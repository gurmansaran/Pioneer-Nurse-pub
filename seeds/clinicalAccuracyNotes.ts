// ─── Clinical Accuracy Notes ──────────────────────────────────────────────────
// Items flagged for review by a licensed nurse educator before production use.
// Generated alongside seed content for drugCards.ts, flashcards.ts, questions.ts.
// ──────────────────────────────────────────────────────────────────────────────

export const clinicalAccuracyNotes: string[] = [
  // ─── Drug Card Hold Parameters ─────────────────────────────────────────────
  'DRUG-CARDS: Hold parameters (HR < 60, SBP < 100 for beta-blockers; SBP < 90 for ACE-I/ARBs) are standard textbook values. Actual hold parameters vary by institution, provider orders, and patient baseline. Some facilities use HR < 50 or SBP < 90 for beta-blockers. Always defer to the facility protocol and specific provider order.',

  'DRUG-CARDS: Digoxin hold parameter of HR < 60 bpm (adult) is the most widely taught threshold. Some institutions use HR < 55 bpm or individualize based on patient baseline. Pediatric hold parameters (< 70 child, < 90 infant) should be verified against current pediatric references.',

  'DRUG-CARDS: Furosemide hold parameter of K+ < 3.5 mEq/L is standard. Some providers may allow administration with concurrent potassium replacement at K+ 3.0-3.5. Always verify with the prescribing provider.',

  'DRUG-CARDS: Warfarin therapeutic INR range of 2.0-3.0 (and 2.5-3.5 for mechanical valves) is standard per AHA/ACC. Some providers target slightly different ranges for specific conditions. INR monitoring frequency varies by clinic.',

  'DRUG-CARDS: Heparin aPTT therapeutic range of 1.5-2.5x normal (46-70 seconds) is institution-dependent. Many hospitals use individualized heparin protocols with different target ranges. Anti-Xa monitoring is increasingly used instead of aPTT at some facilities.',

  'DRUG-CARDS: Vancomycin trough target of 10-20 mcg/mL is traditional. Current IDSA/ASHP guidelines (2020) recommend AUC/MIC-guided dosing (target AUC 400-600 mg*hr/L) over trough-based monitoring. Teaching both approaches is appropriate as institutional practices are in transition.',

  // ─── Drug Card Dosing & Pharmacology ───────────────────────────────────────
  'DRUG-CARDS: Metformin renal thresholds — content uses eGFR < 30 as absolute contraindication. FDA updated labeling: contraindicated if eGFR < 30, cautioned at eGFR 30-45 (reduced dose), use with monitoring at eGFR > 45. Serum creatinine thresholds (1.5 males, 1.4 females) are from older labeling but still commonly taught.',

  'DRUG-CARDS: Opioid equivalency ratios (hydromorphone 5-7x morphine) are approximate and vary by source. Exact equianalgesic dosing should reference institutional conversion tables. Clinical conversion typically uses conservative estimates with dose reduction for incomplete cross-tolerance.',

  'DRUG-CARDS: IV furosemide push rate of "no faster than 20 mg/min" is the standard recommendation. Some references cite 10 mg/min for high-risk patients (elderly, renal impairment). Verify with current drug references.',

  'DRUG-CARDS: Enoxaparin dose adjustment at CrCl < 30 mL/min is standard. The specific adjusted dose (typically 30 mg Sub-Q daily for prophylaxis, 1 mg/kg daily for treatment) should be verified against current dosing guidelines.',

  // ─── Insulin ───────────────────────────────────────────────────────────────
  'DRUG-CARDS/FLASHCARDS: Insulin onset/peak/duration times are approximate ranges that vary between sources. Lispro onset 15 min (some sources say 10-15), Regular onset 30 min (30-60), NPH peak 4-12 hours (wide range). These are educational approximations. Clinical dosing decisions should use patient-specific glucose monitoring.',

  'DRUG-CARDS: The statement that insulin glargine has "no peak" is an educational simplification. Glargine has a very flat pharmacokinetic profile but some studies show a modest peak at 6-8 hours. "Peakless" is the standard teaching convention and is appropriate for student-level education.',

  'FLASHCARDS: The "Rule of 15" for hypoglycemia (15g carbs, recheck in 15 min) is the standard recommendation from ADA. Some institutions use 15-20g. For severe hypoglycemia with inability to swallow, IV D50 or IM/Sub-Q glucagon is used instead. Glucagon dosing should be verified against current protocols.',

  // ─── Questions & Scenarios ─────────────────────────────────────────────────
  'QUESTIONS: DKA protocol stating "hold insulin if K+ < 3.3 mEq/L" is from ADA DKA treatment guidelines. The exact threshold may vary by institution (some use < 3.5). The principle is universal: replace potassium before or concurrent with insulin to prevent fatal hypokalemia.',

  'QUESTIONS: tPA (alteplase) administration window for ischemic stroke is stated as 3-4.5 hours. The 3-hour window has the strongest evidence; the 4.5-hour window has additional exclusion criteria (age > 80, NIHSS > 25, oral anticoagulant use, history of both stroke and diabetes). Clinical decision-making involves more nuance than presented.',

  'QUESTIONS: Blood pressure management in ischemic stroke (permissive hypertension, thresholds of 185/110 pre-tPA and 180/105 post-tPA) follows AHA/ASA guidelines but may be updated. Always reference current stroke protocols.',

  'QUESTIONS: Bow-tie question on anaphylaxis states epinephrine 0.3 mg IM. This is the adult dose. Pediatric dosing is weight-based (0.01 mg/kg, max 0.3 mg for < 30 kg, 0.5 mg for > 30 kg in some references). Auto-injector doses vary (EpiPen 0.3 mg adult, 0.15 mg pediatric).',

  'QUESTIONS: Sepsis Hour-1 bundle components follow Surviving Sepsis Campaign guidelines (2021). These guidelines are periodically updated. The 30 mL/kg fluid bolus recommendation has been debated for elderly and heart failure patients — clinical judgment applies.',

  // ─── Pathophysiology Simplifications ────────────────────────────────────────
  'FLASHCARDS/PATHO: The explanation of COPD "hypoxic drive" (removing O2 suppresses respiratory drive) is an educational simplification. The hypoxic drive theory has been challenged by research showing that V/Q mismatch and Haldane effect contribute more to CO2 retention with supplemental O2 than suppression of respiratory drive alone. However, the clinical recommendation (low-flow O2, target 88-92%) remains valid and is the standard teaching.',

  'FLASHCARDS/PATHO: Heart failure classification uses EF < 40% for HFrEF and EF ≥ 50% for HFpEF. The intermediate group (EF 40-49%, termed HFmrEF or "mid-range") is not covered in the seed content for simplicity. This is appropriate for first-semester students but should be introduced in later semesters.',

  'FLASHCARDS/PATHO: The oxyhemoglobin dissociation curve "CADET face Right" mnemonic is a useful educational tool. The actual physiology involves more variables (fetal hemoglobin, carbon monoxide, methemoglobin). The simplified explanation is appropriate for BIOL 4344 level.',

  'FLASHCARDS/PATHO: Sepsis-3 definition and qSOFA criteria are presented alongside older SIRS criteria. Some institutions still use SIRS screening. Students should know both, but the content correctly emphasizes Sepsis-3/qSOFA as the current standard.',

  'FLASHCARDS/PATHO: Atherosclerosis pathogenesis is presented in a simplified linear progression. Actual pathogenesis involves complex interactions between endothelial dysfunction, lipid oxidation, immune response, and hemodynamic forces. The simplified version is appropriate for foundational pathophysiology.',

  // ─── Assessment & Clinical Practice ────────────────────────────────────────
  'FLASHCARDS/ASSESSMENT: Bowel sound assessment stating "5 minutes per quadrant" before documenting absent sounds is the textbook standard. In clinical practice, many providers accept 2-3 minutes per quadrant. However, for testing purposes, 5 minutes is the expected answer.',

  'FLASHCARDS/ASSESSMENT: Homans sign is correctly noted as unreliable and no longer recommended. However, some nursing textbooks and exam questions still reference it. Students should know what it is AND that it is not evidence-based.',

  'FLASHCARDS/ASSESSMENT: GCS scoring is presented in the traditional format. Some institutions now use the updated GCS with pupil reactivity score (GCS-P). The traditional format is still the standard teaching.',

  'FLASHCARDS/ASSESSMENT: Braden Scale cutoff of ≤ 18 for "at risk" follows the original Braden Scale guidelines. Some institutions use different cutoffs or additional risk assessment tools. The interventions described are evidence-based regardless of the specific cutoff used.',

  // ─── Scope of Practice & Delegation ────────────────────────────────────────
  'FLASHCARDS/FOUNDATIONS: LPN/LVN scope of practice varies significantly by state. Texas BON rules allow LVNs to perform IV therapy tasks (including IV push medications) with additional training/certification. The content presents a conservative/general scope. Students should verify Texas-specific LVN scope with current BON rules.',

  'FLASHCARDS/FOUNDATIONS: UAP delegation guidelines (cannot do assessment, teaching, evaluation) are universal principles. Specific tasks delegated to UAPs vary by state, institution, and individual competency verification. Blood glucose monitoring by UAP is allowed in most settings but requires competency validation.',

  'QUESTIONS: The statement that nurses "cannot independently modify prescribed doses" is generally true. However, some protocols (insulin sliding scales, titration protocols for vasopressors/heparin) allow nurses to adjust doses within parameters. The principle of not independently halving a dose without orders is correct.',

  // ─── General Notes ─────────────────────────────────────────────────────────
  'GENERAL: All content is designed for educational purposes aligned with first-semester BSN nursing (Semester 5) at TWU Dallas. Drug dosages, protocols, and clinical guidelines should be cross-referenced with current editions of standard nursing pharmacology textbooks (Lehne, Lilley, or Adams) and current clinical guidelines (AHA, ADA, IDSA, Surviving Sepsis Campaign).',

  'GENERAL: Content reflects guidelines and best practices as of early 2026. Clinical guidelines are periodically updated. A licensed nurse educator should review all content at least annually to ensure alignment with current evidence-based practice.',

  'GENERAL: Memory tricks and mnemonics are educational aids and should not replace understanding of the underlying pharmacology and pathophysiology. Some mnemonics may be institution- or instructor-specific.',

  'GENERAL: The bow-tie questions follow the NCSBN Clinical Judgment Measurement Model (CJMM) format. The specific structure (2 left slots for actions, 1 center for condition, 2 right slots for monitoring) matches the app\'s Bowtie component interface. Actual NCLEX NGN bow-tie items may have different numbers of slots or response options.',
];
