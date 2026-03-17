import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';
import { getDemoClinicalBrief } from '@/seeds/demo-data';

const isDemoMode = () => useAuthStore.getState().demoMode;

// ─── Types ───────────────────────────────────────────────────────────

export type UnitType =
  | 'med_surg'
  | 'labor_delivery'
  | 'mother_baby'
  | 'pediatrics'
  | 'psychiatric'
  | 'icu'
  | 'emergency'
  | 'community_health'
  | 'other';

export interface PatientInfo {
  ageRange?: string;
  primaryDiagnosis?: string;
  comorbidities?: string;
}

export interface ClinicalBriefCondition {
  name: string;
  patho_context: string;
  assessment_findings: string;
  medications: string;
  interventions: string;
}

export interface ClinicalBriefMedication {
  name: string;
  indication: string;
  nursing_implication: string;
  hold_parameter: string;
}

export interface ClinicalBriefJSON {
  unit_overview: string;
  conditions: ClinicalBriefCondition[];
  medications: ClinicalBriefMedication[];
  assessment_priorities: string[];
  documentation_tips: string[];
  instructor_assessment: string[];
  addressing_nerves: string;
  checklist: string[];
}

export interface ClinicalBrief {
  id: string;
  user_id: string;
  unit_type: UnitType;
  hospital: string | null;
  has_patient_assignment: boolean;
  patient_info: PatientInfo;
  nervous_areas: string[];
  brief_json: ClinicalBriefJSON;
  created_at: string;
}

export interface ClinicalReflection {
  id: string;
  user_id: string;
  brief_id: string | null;
  went_well: string | null;
  harder_than_expected: string | null;
  topics_to_review: string[];
  confidence_rating: number;
  created_at: string;
}

// ─── Flow State ──────────────────────────────────────────────────────

export interface PrepFlowState {
  unitType: UnitType | null;
  hospital: string | null;
  hasPatientAssignment: boolean;
  patientInfo: PatientInfo;
  nervousAreas: string[];
}

// ─── AsyncStorage Keys ───────────────────────────────────────────────

const CACHE_KEY_BRIEFS = '@pioneer_nurse:clinical_briefs';
const CACHE_KEY_REFLECTIONS = '@pioneer_nurse:clinical_reflections';

// ─── Store ───────────────────────────────────────────────────────────

interface ClinicalState {
  // Flow state
  prepFlow: PrepFlowState;
  generatingBrief: boolean;
  currentBrief: ClinicalBrief | null;

  // Saved data
  briefs: ClinicalBrief[];
  reflections: ClinicalReflection[];
  loading: boolean;

  // Flow actions
  setUnitType: (unit: UnitType) => void;
  setHospital: (hospital: string) => void;
  setPatientAssignment: (has: boolean) => void;
  setPatientInfo: (info: PatientInfo) => void;
  setNervousAreas: (areas: string[]) => void;
  resetFlow: () => void;

  // Brief actions
  generateBrief: (userId: string) => Promise<ClinicalBrief>;
  fetchBriefs: (userId: string) => Promise<void>;
  deleteBrief: (briefId: string) => Promise<void>;

  // Reflection actions
  submitReflection: (
    userId: string,
    briefId: string | null,
    data: {
      went_well: string;
      harder_than_expected: string;
      topics_to_review: string[];
      confidence_rating: number;
    },
  ) => Promise<void>;
  fetchReflections: (userId: string) => Promise<void>;

  // Cache
  loadFromCache: () => Promise<void>;
  saveToCache: () => Promise<void>;
}

const initialFlowState: PrepFlowState = {
  unitType: null,
  hospital: null,
  hasPatientAssignment: false,
  patientInfo: {},
  nervousAreas: [],
};

export const useClinicalStore = create<ClinicalState>((set, get) => ({
  prepFlow: { ...initialFlowState },
  generatingBrief: false,
  currentBrief: null,
  briefs: [],
  reflections: [],
  loading: false,

  // ─── Flow Actions ────────────────────────────────────────────────

  setUnitType: (unit) =>
    set((s) => ({ prepFlow: { ...s.prepFlow, unitType: unit } })),

  setHospital: (hospital) =>
    set((s) => ({ prepFlow: { ...s.prepFlow, hospital } })),

  setPatientAssignment: (has) =>
    set((s) => ({
      prepFlow: {
        ...s.prepFlow,
        hasPatientAssignment: has,
        patientInfo: has ? s.prepFlow.patientInfo : {},
      },
    })),

  setPatientInfo: (info) =>
    set((s) => ({ prepFlow: { ...s.prepFlow, patientInfo: info } })),

  setNervousAreas: (areas) =>
    set((s) => ({ prepFlow: { ...s.prepFlow, nervousAreas: areas } })),

  resetFlow: () => set({ prepFlow: { ...initialFlowState }, currentBrief: null }),

  // ─── Brief Actions ───────────────────────────────────────────────

  generateBrief: async (userId) => {
    const { prepFlow } = get();
    set({ generatingBrief: true });

    try {
      if (isDemoMode()) {
        const briefJson = getDemoClinicalBrief(prepFlow);
        const brief: ClinicalBrief = {
          id: `demo-brief-${Date.now()}`,
          user_id: userId,
          unit_type: prepFlow.unitType || 'med_surg',
          hospital: prepFlow.hospital,
          has_patient_assignment: prepFlow.hasPatientAssignment,
          patient_info: prepFlow.patientInfo,
          nervous_areas: prepFlow.nervousAreas,
          brief_json: briefJson,
          created_at: new Date().toISOString(),
        };

        set((s) => ({
          currentBrief: brief,
          briefs: [brief, ...s.briefs],
          generatingBrief: false,
        }));

        get().saveToCache();
        return brief;
      }

      const { data, error } = await supabase.functions.invoke('clinical-brief', {
        body: {
          unit_type: prepFlow.unitType,
          hospital: prepFlow.hospital,
          has_patient_assignment: prepFlow.hasPatientAssignment,
          patient_info: prepFlow.patientInfo,
          nervous_areas: prepFlow.nervousAreas,
        },
      });

      if (error) throw error;

      const briefJson: ClinicalBriefJSON = data.brief;

      // Save to Supabase
      const { data: inserted, error: insertError } = await supabase
        .from('clinical_briefs')
        .insert({
          user_id: userId,
          unit_type: prepFlow.unitType,
          hospital: prepFlow.hospital,
          has_patient_assignment: prepFlow.hasPatientAssignment,
          patient_info: prepFlow.patientInfo,
          nervous_areas: prepFlow.nervousAreas,
          brief_json: briefJson,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      const brief = inserted as ClinicalBrief;

      set((s) => ({
        currentBrief: brief,
        briefs: [brief, ...s.briefs],
        generatingBrief: false,
      }));

      // Cache offline
      get().saveToCache();

      return brief;
    } catch (err) {
      set({ generatingBrief: false });
      throw err;
    }
  },

  fetchBriefs: async (userId) => {
    if (isDemoMode()) return; // briefs are in local state/cache
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('clinical_briefs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ briefs: (data || []) as ClinicalBrief[] });
      get().saveToCache();
    } finally {
      set({ loading: false });
    }
  },

  deleteBrief: async (briefId) => {
    if (!isDemoMode()) {
      const { error } = await supabase
        .from('clinical_briefs')
        .delete()
        .eq('id', briefId);
      if (error) throw error;
    }
    set((s) => ({ briefs: s.briefs.filter((b) => b.id !== briefId) }));
    get().saveToCache();
  },

  // ─── Reflection Actions ──────────────────────────────────────────

  submitReflection: async (userId, briefId, data) => {
    if (isDemoMode()) {
      const reflection: ClinicalReflection = {
        id: `demo-reflection-${Date.now()}`,
        user_id: userId,
        brief_id: briefId,
        went_well: data.went_well,
        harder_than_expected: data.harder_than_expected,
        topics_to_review: data.topics_to_review,
        confidence_rating: data.confidence_rating,
        created_at: new Date().toISOString(),
      };
      set((s) => ({ reflections: [reflection, ...s.reflections] }));
      get().saveToCache();
      return;
    }
    const { error } = await supabase.from('clinical_reflections').insert({
      user_id: userId,
      brief_id: briefId,
      went_well: data.went_well,
      harder_than_expected: data.harder_than_expected,
      topics_to_review: data.topics_to_review,
      confidence_rating: data.confidence_rating,
    });
    if (error) throw error;
    await get().fetchReflections(userId);
  },

  fetchReflections: async (userId) => {
    if (isDemoMode()) return;
    const { data, error } = await supabase
      .from('clinical_reflections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    set({ reflections: (data || []) as ClinicalReflection[] });
    get().saveToCache();
  },

  // ─── Cache ───────────────────────────────────────────────────────

  loadFromCache: async () => {
    try {
      const [briefsStr, reflectionsStr] = await Promise.all([
        AsyncStorage.getItem(CACHE_KEY_BRIEFS),
        AsyncStorage.getItem(CACHE_KEY_REFLECTIONS),
      ]);
      if (briefsStr) set({ briefs: JSON.parse(briefsStr) });
      if (reflectionsStr) set({ reflections: JSON.parse(reflectionsStr) });
    } catch {
      // Cache miss — no problem
    }
  },

  saveToCache: async () => {
    try {
      const { briefs, reflections } = get();
      await Promise.all([
        AsyncStorage.setItem(CACHE_KEY_BRIEFS, JSON.stringify(briefs)),
        AsyncStorage.setItem(CACHE_KEY_REFLECTIONS, JSON.stringify(reflections)),
      ]);
    } catch {
      // Non-critical
    }
  },
}));
