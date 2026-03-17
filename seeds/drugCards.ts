// ─── Drug Cards Seed Data ─────────────────────────────────────────────────────
// 30 high-yield drug cards for TWU Dallas BSN Semester 5 (NURS 3813 Pharmacology)
// Aligned with ATI Pharmacology proctored exam and NCLEX-RN content
// ──────────────────────────────────────────────────────────────────────────────

export interface DrugCard {
  id: string;
  drug_name: string;
  brand_names: string[];
  drug_class: string;
  mechanism_of_action: string;
  indications: string[];
  nursing_implications: string[];
  hold_parameters: string;
  side_effects: string[];
  high_alert: boolean;
  memory_trick: string;
  related_conditions: string[];
  semester_relevance: string;
  course_code: string;
}

export const drugCards: DrugCard[] = [
  // ─── BETA BLOCKERS ────────────────────────────────────────────────────────
  {
    id: 'drug-001',
    drug_name: 'metoprolol',
    brand_names: ['Lopressor', 'Toprol-XL'],
    drug_class: 'Beta-1 Selective Blocker',
    mechanism_of_action:
      'Selectively blocks beta-1 adrenergic receptors in the heart, reducing heart rate, myocardial contractility, and cardiac output. Decreases myocardial oxygen demand.',
    indications: ['Hypertension', 'Angina pectoris', 'Heart failure (HFrEF)', 'Post-MI', 'Rate control in atrial fibrillation'],
    nursing_implications: [
      'BEFORE: Assess apical pulse for 1 full minute and blood pressure. Check blood glucose in diabetic patients (masks hypoglycemia signs like tachycardia and tremors).',
      'DURING: Administer with or immediately after meals to enhance absorption (Lopressor). Toprol-XL may be given without regard to meals but do not crush or chew.',
      'AFTER: Monitor for bradycardia, hypotension, fatigue, and dizziness. Teach patient to rise slowly. Instruct NEVER to stop abruptly — taper over 1-2 weeks to prevent rebound tachycardia and hypertensive crisis.',
    ],
    hold_parameters: 'Hold if HR < 60 bpm or SBP < 100 mmHg. Notify provider.',
    side_effects: ['Bradycardia', 'Hypotension', 'Fatigue', 'Dizziness', 'Depression', 'Bronchospasm (at higher doses)', 'Cold extremities', 'Erectile dysfunction'],
    high_alert: false,
    memory_trick: 'All "-olol" drugs are beta-blockers. "Metro" = city heart — it slows the city pace. Beta-blockers are "LOL" drugs: they make the heart LOL (Low Output, Low rate).',
    related_conditions: ['Hypertension', 'Heart failure', 'Atrial fibrillation', 'Myocardial infarction'],
    semester_relevance: 'Core Semester 5 drug. Tested heavily on ATI Pharm proctored exam. Know hold parameters cold.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-002',
    drug_name: 'atenolol',
    brand_names: ['Tenormin'],
    drug_class: 'Beta-1 Selective Blocker',
    mechanism_of_action:
      'Selectively blocks beta-1 adrenergic receptors in the heart. Does not cross blood-brain barrier as readily as metoprolol, so fewer CNS effects.',
    indications: ['Hypertension', 'Angina pectoris', 'Post-MI'],
    nursing_implications: [
      'BEFORE: Assess apical pulse for 1 full minute and BP. Check renal function — atenolol is renally excreted, dose adjustment needed for CrCl < 35 mL/min.',
      'DURING: Can be given without regard to meals. Do not crush if long-acting formulation.',
      'AFTER: Monitor for bradycardia, hypotension, fatigue. Teach patient to avoid abrupt discontinuation. Less lipophilic than metoprolol — fewer nightmares/depression.',
    ],
    hold_parameters: 'Hold if HR < 60 bpm or SBP < 100 mmHg. Notify provider.',
    side_effects: ['Bradycardia', 'Hypotension', 'Fatigue', 'Dizziness', 'Cold extremities', 'Nausea'],
    high_alert: false,
    memory_trick: '"A-TEN-olol" — think "a ten" on the heart scale, keeping heart rate at a perfect 10 (not too fast, not too slow).',
    related_conditions: ['Hypertension', 'Angina', 'Post-MI prophylaxis'],
    semester_relevance: 'Tested alongside metoprolol. Know the renal excretion difference.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-003',
    drug_name: 'carvedilol',
    brand_names: ['Coreg'],
    drug_class: 'Non-selective Beta Blocker with Alpha-1 Blockade',
    mechanism_of_action:
      'Blocks beta-1, beta-2, AND alpha-1 adrenergic receptors. The alpha-1 blockade causes vasodilation, providing additional BP lowering. Preferred in HFrEF.',
    indications: ['Heart failure (HFrEF)', 'Hypertension', 'Left ventricular dysfunction post-MI'],
    nursing_implications: [
      'BEFORE: Assess apical pulse and BP. Check liver function — carvedilol is hepatically metabolized. Contraindicated in decompensated HF, severe bradycardia, or bronchospastic disease.',
      'DURING: MUST be taken with food to slow absorption and reduce risk of orthostatic hypotension. Start at lowest dose and titrate slowly.',
      'AFTER: Monitor for significant orthostatic hypotension (due to alpha blockade), bradycardia, weight gain, and worsening HF symptoms. Teach patient to rise slowly and dangle feet before standing.',
    ],
    hold_parameters: 'Hold if HR < 60 bpm or SBP < 100 mmHg. Notify provider.',
    side_effects: ['Bradycardia', 'Orthostatic hypotension', 'Dizziness', 'Fatigue', 'Weight gain', 'Diarrhea', 'Hyperglycemia'],
    high_alert: false,
    memory_trick: '"Coreg COREs the heart" — it blocks ALL receptor types (beta-1, beta-2, alpha-1). Think "COR" = heart in Latin. It is the CORE drug for heart failure.',
    related_conditions: ['Heart failure', 'Hypertension', 'Post-MI'],
    semester_relevance: 'Key HF drug. Know the difference: carvedilol = non-selective + alpha vs. metoprolol = beta-1 selective.',
    course_code: 'NURS 3813',
  },

  // ─── ACE INHIBITORS ───────────────────────────────────────────────────────
  {
    id: 'drug-004',
    drug_name: 'lisinopril',
    brand_names: ['Zestril', 'Prinivil'],
    drug_class: 'ACE Inhibitor',
    mechanism_of_action:
      'Inhibits angiotensin-converting enzyme (ACE), preventing conversion of angiotensin I to angiotensin II. Reduces vasoconstriction, aldosterone secretion, and sodium/water retention. Also prevents bradykinin breakdown (causes the dry cough).',
    indications: ['Hypertension', 'Heart failure', 'Diabetic nephropathy', 'Post-MI'],
    nursing_implications: [
      'BEFORE: Check BP, potassium level (risk of hyperkalemia), and BUN/creatinine (baseline renal function). Confirm patient is NOT pregnant — teratogenic (was formerly Category D, now labeled with pregnancy warning).',
      'DURING: Can be given without regard to food. First-dose hypotension is common — consider giving at bedtime initially.',
      'AFTER: Monitor K+ levels regularly (normal 3.5-5.0 mEq/L). Monitor for dry persistent cough (switch to ARB if intolerable). Watch for angioedema (swelling of face, lips, tongue) — hold drug and call provider immediately. Teach to avoid potassium supplements and salt substitutes (contain KCl).',
    ],
    hold_parameters: 'Hold if SBP < 90 mmHg or K+ > 5.0 mEq/L. Notify provider. Hold if signs of angioedema.',
    side_effects: ['Dry persistent cough (10-15%)', 'Hyperkalemia', 'Angioedema (rare but life-threatening)', 'Hypotension', 'Dizziness', 'Headache', 'Elevated creatinine'],
    high_alert: false,
    memory_trick: 'All "-pril" drugs are ACE inhibitors. "PRIL" = "April Showers" = that dry cough raining on your parade. ACE inhibitors cause a dry cough because they prevent bradykinin breakdown.',
    related_conditions: ['Hypertension', 'Heart failure', 'Diabetic nephropathy', 'CKD'],
    semester_relevance: 'Highest-yield ACE inhibitor on ATI and NCLEX. The dry cough vs. ARB comparison is a guaranteed test question.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-005',
    drug_name: 'enalapril',
    brand_names: ['Vasotec'],
    drug_class: 'ACE Inhibitor',
    mechanism_of_action:
      'Prodrug converted to enalaprilat in the liver. Inhibits ACE, reducing angiotensin II formation. Same mechanism as lisinopril but requires hepatic activation.',
    indications: ['Hypertension', 'Heart failure', 'Asymptomatic LV dysfunction'],
    nursing_implications: [
      'BEFORE: Check BP, K+, BUN/creatinine. Verify no pregnancy. Has IV form (enalaprilat) for hypertensive emergencies — only ACE inhibitor available IV.',
      'DURING: Can give with or without food. IV enalaprilat given over 5 minutes.',
      'AFTER: Same monitoring as lisinopril — K+, renal function, cough, angioedema. Monitor hepatic function since it requires liver activation.',
    ],
    hold_parameters: 'Hold if SBP < 90 mmHg or K+ > 5.0 mEq/L. Notify provider.',
    side_effects: ['Dry cough', 'Hyperkalemia', 'Angioedema', 'Hypotension', 'Dizziness', 'Headache'],
    high_alert: false,
    memory_trick: '"Enalapril" = "Enable a PRIL." It is the only ACE inhibitor with an IV form (enalaprilat). Think "Vasotec" = "Vaso-tech" = technology for your vessels.',
    related_conditions: ['Hypertension', 'Heart failure', 'Hypertensive emergency (IV form)'],
    semester_relevance: 'Know that enalapril is the only IV ACE inhibitor. Same class concerns as lisinopril.',
    course_code: 'NURS 3813',
  },

  // ─── ARBs ─────────────────────────────────────────────────────────────────
  {
    id: 'drug-006',
    drug_name: 'losartan',
    brand_names: ['Cozaar'],
    drug_class: 'Angiotensin II Receptor Blocker (ARB)',
    mechanism_of_action:
      'Blocks angiotensin II at the AT1 receptor, preventing vasoconstriction and aldosterone release. Unlike ACE inhibitors, does NOT affect bradykinin — so no cough.',
    indications: ['Hypertension', 'Diabetic nephropathy (Type 2 DM)', 'Stroke prevention', 'Heart failure (when ACE-I intolerant)'],
    nursing_implications: [
      'BEFORE: Check BP, K+, BUN/creatinine. Verify no pregnancy — same teratogenic risk as ACE inhibitors.',
      'DURING: Can be given without regard to meals.',
      'AFTER: Monitor K+ and renal function. Key teaching: ARBs are the go-to alternative when a patient cannot tolerate ACE inhibitors due to cough. Still risk hyperkalemia and angioedema (though less common).',
    ],
    hold_parameters: 'Hold if SBP < 90 mmHg or K+ > 5.0 mEq/L. Notify provider.',
    side_effects: ['Hyperkalemia', 'Hypotension', 'Dizziness', 'Angioedema (rare, less than ACE-I)', 'Elevated creatinine'],
    high_alert: false,
    memory_trick: 'All "-sartan" drugs are ARBs. "LOSartan" = "LOSS of the cough" — it is the alternative when ACE inhibitors cause intolerable cough. ARBs block the receptor, not the enzyme.',
    related_conditions: ['Hypertension', 'Type 2 diabetic nephropathy', 'Heart failure'],
    semester_relevance: 'The ACE-I vs. ARB comparison is a top ATI/NCLEX topic. ARB = no cough is the key differentiator.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-007',
    drug_name: 'valsartan',
    brand_names: ['Diovan'],
    drug_class: 'Angiotensin II Receptor Blocker (ARB)',
    mechanism_of_action:
      'Selectively blocks angiotensin II at the AT1 receptor. Prevents vasoconstriction and aldosterone secretion without affecting bradykinin metabolism.',
    indications: ['Hypertension', 'Heart failure', 'Post-MI'],
    nursing_implications: [
      'BEFORE: Check BP, K+, and renal function. Confirm no pregnancy.',
      'DURING: Can be given without regard to meals. Available in combination with sacubitril (Entresto) for HFrEF.',
      'AFTER: Monitor K+, BUN/creatinine, BP. Sacubitril/valsartan (Entresto) must NOT be given within 36 hours of an ACE inhibitor — risk of angioedema.',
    ],
    hold_parameters: 'Hold if SBP < 90 mmHg or K+ > 5.0 mEq/L. Notify provider.',
    side_effects: ['Hyperkalemia', 'Hypotension', 'Dizziness', 'Headache', 'Fatigue'],
    high_alert: false,
    memory_trick: '"VALsartan" = "VALiant protector" of the vessels. In Entresto, it teams up with sacubitril — "Enter the STONE-cold duo for heart failure."',
    related_conditions: ['Hypertension', 'Heart failure (especially as Entresto)', 'Post-MI'],
    semester_relevance: 'Know Entresto (sacubitril/valsartan) as a key HF drug. Never combine with ACE-I within 36 hours.',
    course_code: 'NURS 3813',
  },

  // ─── LOOP DIURETICS ───────────────────────────────────────────────────────
  {
    id: 'drug-008',
    drug_name: 'furosemide',
    brand_names: ['Lasix'],
    drug_class: 'Loop Diuretic',
    mechanism_of_action:
      'Inhibits sodium-potassium-chloride cotransporter (NKCC2) in the thick ascending loop of Henle. Produces rapid, potent diuresis. Also promotes calcium and magnesium excretion.',
    indications: ['Heart failure (fluid overload)', 'Pulmonary edema', 'Edema', 'Hypertension (adjunct)', 'Acute kidney injury (to maintain urine output)'],
    nursing_implications: [
      'BEFORE: Check K+ (normal 3.5-5.0 mEq/L), Mg2+, Na+, BUN/creatinine, and BP. Weigh patient daily (same time, same scale, same clothing). Assess for dehydration.',
      'DURING: IV push no faster than 20 mg/min to prevent ototoxicity. Give oral doses in the morning and early afternoon to avoid nocturia. Monitor I&O closely.',
      'AFTER: Monitor for hypokalemia (muscle cramps, weakness, irregular pulse, flat T waves on ECG), dehydration, hypotension, ototoxicity (tinnitus, hearing loss). Teach to eat potassium-rich foods (bananas, oranges, potatoes). May need potassium supplement.',
    ],
    hold_parameters: 'Hold if K+ < 3.5 mEq/L or SBP < 90 mmHg. Notify provider. Hold if signs of severe dehydration.',
    side_effects: ['Hypokalemia', 'Hyponatremia', 'Hypomagnesemia', 'Hypocalcemia', 'Dehydration', 'Hypotension', 'Ototoxicity', 'Hyperuricemia (gout)', 'Hyperglycemia'],
    high_alert: false,
    memory_trick: '"Lasix = Lasts 6 hours." Furosemide flushes out fluid FAST. "Loop diuretics LOSE potassium" — always check K+ first. Think "Loop Loses" electrolytes.',
    related_conditions: ['Heart failure', 'Pulmonary edema', 'Cirrhosis with ascites', 'Renal disease'],
    semester_relevance: 'Top 5 most-tested drug on ATI Pharm. K+ monitoring and ototoxicity are guaranteed questions.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-009',
    drug_name: 'bumetanide',
    brand_names: ['Bumex'],
    drug_class: 'Loop Diuretic',
    mechanism_of_action:
      'Same mechanism as furosemide — inhibits NKCC2 in the ascending loop of Henle. 40x more potent than furosemide (1 mg bumetanide ~ 40 mg furosemide).',
    indications: ['Heart failure', 'Edema', 'Pulmonary edema (when furosemide insufficient)'],
    nursing_implications: [
      'BEFORE: Check K+, Mg2+, Na+, BUN/creatinine, BP. Daily weights. Assess hearing baseline.',
      'DURING: IV push over 1-2 minutes. Oral doses in the morning. Much more potent than furosemide — dose carefully.',
      'AFTER: Same electrolyte monitoring as furosemide. Higher ototoxicity risk, especially with aminoglycosides. Monitor strict I&O.',
    ],
    hold_parameters: 'Hold if K+ < 3.5 mEq/L or SBP < 90 mmHg. Notify provider.',
    side_effects: ['Hypokalemia', 'Hyponatremia', 'Dehydration', 'Ototoxicity', 'Hypotension', 'Muscle cramps', 'Hyperuricemia'],
    high_alert: false,
    memory_trick: '"BUMex BUMPS up the potency" — 40x stronger than furosemide. 1 mg Bumex = 40 mg Lasix. Think "Bumex is the BIGGER gun."',
    related_conditions: ['Heart failure', 'Edema refractory to furosemide'],
    semester_relevance: 'Know the potency equivalence: 1 mg bumetanide = 40 mg furosemide. Same class concerns.',
    course_code: 'NURS 3813',
  },

  // ─── ANTICOAGULANTS ───────────────────────────────────────────────────────
  {
    id: 'drug-010',
    drug_name: 'heparin (unfractionated)',
    brand_names: ['Heparin Sodium'],
    drug_class: 'Anticoagulant (Indirect Thrombin Inhibitor)',
    mechanism_of_action:
      'Binds to antithrombin III, dramatically accelerating its ability to inactivate thrombin (Factor IIa), Factor Xa, and other clotting factors. Works immediately when given IV.',
    indications: ['DVT treatment/prophylaxis', 'PE treatment', 'Acute coronary syndrome', 'Atrial fibrillation', 'Cardiac catheterization', 'Dialysis circuit patency'],
    nursing_implications: [
      'BEFORE: Check baseline aPTT (normal 25-35 seconds), platelet count, and signs of active bleeding. Ask about heparin-induced thrombocytopenia (HIT) history.',
      'DURING: Never give IM — only IV or subcutaneous. IV requires infusion pump. Check aPTT every 6 hours per protocol (therapeutic: 1.5-2.5x normal = ~46-70 seconds). Sub-Q: inject into abdominal fat, do NOT aspirate or massage. Rotate sites.',
      'AFTER: Monitor for bleeding (gums, bruising, hematuria, tarry stools, petechiae). Monitor platelet count for HIT (drop > 50% from baseline). Antidote: protamine sulfate (1 mg per 100 units heparin).',
    ],
    hold_parameters: 'Hold if aPTT > 70 seconds or platelet count < 100,000/mm3 or active bleeding. Notify provider immediately.',
    side_effects: ['Bleeding', 'HIT (Heparin-Induced Thrombocytopenia)', 'Bruising at injection site', 'Osteoporosis (long-term use)', 'Hyperkalemia'],
    high_alert: true,
    memory_trick: '"HEParin = HEP me, aPTT!" Heparin is monitored by aPTT. Antidote = protamine sulfate. "Pro-TAME-ine tames the heparin." HIT = platelets drop, paradoxical clotting.',
    related_conditions: ['DVT', 'Pulmonary embolism', 'ACS', 'Atrial fibrillation'],
    semester_relevance: 'HIGH ALERT medication. aPTT monitoring, HIT recognition, and protamine sulfate antidote are guaranteed test questions.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-011',
    drug_name: 'warfarin',
    brand_names: ['Coumadin', 'Jantoven'],
    drug_class: 'Anticoagulant (Vitamin K Antagonist)',
    mechanism_of_action:
      'Inhibits vitamin K epoxide reductase, blocking synthesis of vitamin K-dependent clotting factors (II, VII, IX, X) and proteins C and S. Takes 3-5 days for full therapeutic effect.',
    indications: ['DVT/PE long-term prevention', 'Atrial fibrillation stroke prevention', 'Mechanical heart valve', 'Post-MI (select cases)'],
    nursing_implications: [
      'BEFORE: Check baseline INR/PT. Obtain medication list — warfarin has EXTENSIVE drug-food interactions. Ask about vitamin K intake.',
      'DURING: Therapeutic INR = 2.0-3.0 for most indications (2.5-3.5 for mechanical heart valves). Takes 3-5 days to work, so overlap with heparin when starting. Give at same time daily.',
      'AFTER: Monitor INR regularly (weekly, then monthly when stable). Teach to maintain CONSISTENT vitamin K intake (not avoid it). Avoid NSAIDs, aspirin, alcohol excess. Report signs of bleeding. Wear medical alert bracelet. Antidote: vitamin K (phytonadione) for non-emergent reversal; 4-factor PCC or fresh frozen plasma for emergent bleeding.',
    ],
    hold_parameters: 'Hold if INR > 3.0 (or > 3.5 for mechanical valve). Notify provider. Hold if any active bleeding.',
    side_effects: ['Bleeding', 'Bruising', 'Skin necrosis (rare, protein C/S deficiency)', 'Purple toe syndrome', 'Alopecia (rare)'],
    high_alert: true,
    memory_trick: '"WarFARin = Far from working quickly" — takes 3-5 days. Monitored by INR/PT (extrinsic pathway). "War-FAIR-in plays FAIR with vitamin K" — keep intake consistent. Antidote = vitamin K. PT/INR for PT (ProThrombin time) = WarfariN.',
    related_conditions: ['Atrial fibrillation', 'DVT', 'PE', 'Mechanical heart valve'],
    semester_relevance: 'HIGH ALERT. The heparin vs. warfarin comparison (aPTT vs. INR, protamine vs. vitamin K) is the most-tested anticoagulant topic.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-012',
    drug_name: 'enoxaparin',
    brand_names: ['Lovenox'],
    drug_class: 'Low Molecular Weight Heparin (LMWH)',
    mechanism_of_action:
      'Preferentially inhibits Factor Xa (more than thrombin) via antithrombin III. More predictable pharmacokinetics than unfractionated heparin — does not routinely require lab monitoring.',
    indications: ['DVT prophylaxis (post-surgery, immobilization)', 'DVT/PE treatment', 'Acute coronary syndrome', 'Bridge therapy for warfarin'],
    nursing_implications: [
      'BEFORE: Check platelet count and renal function (CrCl). Dose reduction needed if CrCl < 30 mL/min. Ask about HIT history (cross-reactivity possible).',
      'DURING: Subcutaneous injection ONLY — never IM, never IV. Inject into abdominal fat (alternate sides). Do NOT expel air bubble from prefilled syringe. Do NOT aspirate or massage site.',
      'AFTER: Monitor for bleeding signs. Anti-Xa levels only if renal impairment, obesity, or pregnancy. Monitor platelet count periodically for HIT. Antidote: protamine sulfate (only partially effective — reverses ~60%).',
    ],
    hold_parameters: 'Hold if platelet count < 100,000/mm3 or CrCl < 30 mL/min without dose adjustment or active bleeding. Notify provider.',
    side_effects: ['Bleeding', 'Injection site bruising/hematoma', 'Thrombocytopenia', 'Elevated liver enzymes', 'Hyperkalemia'],
    high_alert: true,
    memory_trick: '"Lovenox LOVES the belly" — always inject subcutaneously into abdominal fat. "LOW Molecular Weight = LOW maintenance" — does not need routine aPTT monitoring. Keep the air bubble!',
    related_conditions: ['DVT prophylaxis', 'PE', 'ACS', 'Post-surgical thromboprophylaxis'],
    semester_relevance: 'HIGH ALERT. Know injection technique (keep air bubble, no aspiration/massage) — very common NCLEX question.',
    course_code: 'NURS 3813',
  },

  // ─── INSULIN ──────────────────────────────────────────────────────────────
  {
    id: 'drug-013',
    drug_name: 'insulin lispro',
    brand_names: ['Humalog'],
    drug_class: 'Rapid-Acting Insulin',
    mechanism_of_action:
      'Binds to insulin receptors on muscle and fat cells, facilitating glucose uptake. Modified amino acid sequence allows faster absorption. Onset: 15 minutes, Peak: 1-2 hours, Duration: 3-5 hours.',
    indications: ['Type 1 DM', 'Type 2 DM (with basal insulin or oral agents)', 'Hyperkalemia (with glucose)', 'DKA (IV regular insulin preferred, but lispro used sub-Q)'],
    nursing_implications: [
      'BEFORE: Check blood glucose. Check injection site rotation chart. Verify correct insulin type (look-alike/sound-alike risk). Check expiration date.',
      'DURING: Administer 15 minutes BEFORE meals (or immediately after). Sub-Q injection — rotate sites (abdomen fastest absorption). Do NOT mix with glargine or detemir. Clear solution.',
      'AFTER: Monitor blood glucose 1-2 hours after meal. Watch for hypoglycemia (peak at 1-2 hours): sweating, tremors, tachycardia, confusion, irritability. Treat hypoglycemia with Rule of 15: 15g fast-acting carbs, recheck in 15 minutes.',
    ],
    hold_parameters: 'Hold if blood glucose < 70 mg/dL. Treat hypoglycemia first, then notify provider. Follow sliding scale if ordered.',
    side_effects: ['Hypoglycemia', 'Injection site lipodystrophy', 'Hypokalemia', 'Weight gain', 'Allergic reaction (rare)'],
    high_alert: true,
    memory_trick: '"LIS-pro = Lis(t) it first, give it PRO-mptly before meals." Rapid-acting = give RIGHT before eating. "Humalog is HUngry — give it with food." Clear solution, NOT cloudy.',
    related_conditions: ['Type 1 DM', 'Type 2 DM', 'DKA', 'Hyperglycemia'],
    semester_relevance: 'HIGH ALERT. Insulin onset/peak/duration table is guaranteed on ATI Pharm. Lispro onset 15 min is the fastest.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-014',
    drug_name: 'regular insulin (insulin R)',
    brand_names: ['Humulin R', 'Novolin R'],
    drug_class: 'Short-Acting Insulin',
    mechanism_of_action:
      'Unmodified human insulin. Onset: 30 minutes, Peak: 2-4 hours, Duration: 6-8 hours. The ONLY insulin that can be given IV.',
    indications: ['Type 1 DM', 'Type 2 DM', 'DKA (IV drip)', 'HHS', 'Hyperkalemia (with D50)', 'Sliding scale coverage'],
    nursing_implications: [
      'BEFORE: Check blood glucose. Verify it is "Regular" insulin — only type given IV. Check for clarity (should be clear, not cloudy).',
      'DURING: Give 30 minutes before meals for sub-Q. For IV: use infusion pump, monitor glucose every 1-2 hours. Can be mixed with NPH: draw Regular FIRST ("clear before cloudy"). Do NOT mix with glargine.',
      'AFTER: Peak at 2-4 hours — highest hypoglycemia risk at this time. Monitor potassium (insulin drives K+ into cells). In DKA, monitor K+ closely and replace before giving insulin if K+ < 3.3 mEq/L.',
    ],
    hold_parameters: 'Hold if blood glucose < 70 mg/dL. For IV insulin in DKA: hold if K+ < 3.3 mEq/L until potassium is replaced. Notify provider.',
    side_effects: ['Hypoglycemia', 'Hypokalemia', 'Injection site reactions', 'Weight gain'],
    high_alert: true,
    memory_trick: '"Regular is the ONLY one for IV" — remember "R = Runs through the IV." Draw "RN" = Regular before NPH (clear before cloudy). Onset 30 min = give 30 min before meals.',
    related_conditions: ['DKA', 'HHS', 'Type 1 DM', 'Type 2 DM', 'Hyperkalemia'],
    semester_relevance: 'HIGH ALERT. "Only insulin for IV" is an NCLEX classic. DKA protocol (check K+ before insulin) is critical.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-015',
    drug_name: 'NPH insulin (insulin isophane)',
    brand_names: ['Humulin N', 'Novolin N'],
    drug_class: 'Intermediate-Acting Insulin',
    mechanism_of_action:
      'Crystalline suspension of insulin with protamine. Onset: 1-2 hours, Peak: 4-12 hours, Duration: 12-18 hours. Provides basal coverage.',
    indications: ['Type 1 DM (with rapid-acting for basal-bolus)', 'Type 2 DM'],
    nursing_implications: [
      'BEFORE: Check blood glucose. Roll vial gently between palms — do NOT shake (causes bubbles that alter dose). Verify cloudy appearance (only insulin that is supposed to be cloudy).',
      'DURING: Sub-Q only. Can mix with regular insulin: draw Regular (clear) first, then NPH (cloudy). Usually given twice daily (morning and bedtime).',
      'AFTER: Peak 4-12 hours — watch for hypoglycemia especially mid-afternoon (morning dose) and 2-3 AM (evening dose). Ensure patient has snacks available at peak times.',
    ],
    hold_parameters: 'Hold if blood glucose < 70 mg/dL. Notify provider.',
    side_effects: ['Hypoglycemia (especially at peak)', 'Injection site lipodystrophy', 'Weight gain'],
    high_alert: true,
    memory_trick: '"NPH = Not Particularly Hasty" — intermediate acting, not fast. "N = Nighttime hypoglycemia" risk with bedtime dosing. It is CLOUDY — the only cloudy insulin. Roll, do not shake!',
    related_conditions: ['Type 1 DM', 'Type 2 DM'],
    semester_relevance: 'HIGH ALERT. "Cloudy insulin" = NPH. Mixing order (clear before cloudy) is tested on every pharm exam.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-016',
    drug_name: 'insulin glargine',
    brand_names: ['Lantus', 'Basaglar', 'Toujeo'],
    drug_class: 'Long-Acting Insulin (Basal)',
    mechanism_of_action:
      'Forms microprecipitates in subcutaneous tissue, providing slow, steady release. Onset: 1-2 hours, No peak (peakless — steady state), Duration: ~24 hours.',
    indications: ['Type 1 DM (basal coverage)', 'Type 2 DM (basal coverage)'],
    nursing_implications: [
      'BEFORE: Check blood glucose. Verify clear solution — glargine is clear (do NOT confuse with NPH which is cloudy).',
      'DURING: Sub-Q only. Give at SAME TIME every day (usually bedtime). Do NOT mix with any other insulin in the same syringe — acidic pH is incompatible. Cannot give IV.',
      'AFTER: Less hypoglycemia risk than NPH due to peakless action. Monitor fasting blood glucose to assess effectiveness. Teach patient this is background insulin — still needs mealtime rapid-acting insulin in Type 1 DM.',
    ],
    hold_parameters: 'Hold if blood glucose < 70 mg/dL. Notify provider. Typically do not hold basal insulin entirely — provider may reduce dose.',
    side_effects: ['Hypoglycemia (less than NPH)', 'Injection site reactions', 'Weight gain', 'Lipodystrophy'],
    high_alert: true,
    memory_trick: '"Glargine is the GLACIER" — slow, steady, no peaks, lasts all day. "Lantus = LONG and FLAT." NEVER mix glargine with anything. Clear solution but NOT for IV.',
    related_conditions: ['Type 1 DM', 'Type 2 DM'],
    semester_relevance: 'HIGH ALERT. "Peakless, 24-hour, never mix" — three key facts always tested. Compare with NPH.',
    course_code: 'NURS 3813',
  },

  // ─── ANTIBIOTICS ──────────────────────────────────────────────────────────
  {
    id: 'drug-017',
    drug_name: 'amoxicillin',
    brand_names: ['Amoxil'],
    drug_class: 'Aminopenicillin (Penicillin)',
    mechanism_of_action:
      'Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs). Bactericidal. Broader spectrum than penicillin V/G.',
    indications: ['Otitis media', 'Sinusitis', 'Strep pharyngitis', 'UTI', 'H. pylori (triple therapy)', 'Pneumonia (community-acquired)'],
    nursing_implications: [
      'BEFORE: Ask about penicillin/cephalosporin allergy (cross-reactivity ~1-2%). Obtain culture and sensitivity BEFORE first dose if ordered. Check renal function for dose adjustment.',
      'DURING: Can give with or without food (food reduces GI upset). Complete full course even if feeling better.',
      'AFTER: Monitor for allergic reaction (rash, urticaria, anaphylaxis). Watch for C. difficile (watery diarrhea). Monitor for superinfection (oral thrush, vaginal yeast).',
    ],
    hold_parameters: 'Hold if history of anaphylaxis to penicillin. Notify provider if new rash develops.',
    side_effects: ['Diarrhea', 'Nausea', 'Rash (especially with EBV/mono)', 'Allergic reaction/anaphylaxis', 'C. difficile colitis', 'Superinfection'],
    high_alert: false,
    memory_trick: '"AMOX-icillin = A MOXie killer of bacteria." All "-cillin" drugs are penicillins. Always ask about allergies first! Mononucleosis + amoxicillin = widespread maculopapular rash (not a true allergy).',
    related_conditions: ['Otitis media', 'Strep throat', 'Sinusitis', 'H. pylori'],
    semester_relevance: 'Most prescribed antibiotic. Allergy cross-reactivity and C. diff are key NCLEX topics.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-018',
    drug_name: 'cephalexin',
    brand_names: ['Keflex'],
    drug_class: 'First-Generation Cephalosporin',
    mechanism_of_action:
      'Inhibits bacterial cell wall synthesis (same mechanism as penicillins). First-gen cephalosporins cover gram-positive cocci well (Staph, Strep).',
    indications: ['Skin and soft tissue infections', 'UTI', 'Bone infections', 'Strep pharyngitis (penicillin alternative)', 'Otitis media'],
    nursing_implications: [
      'BEFORE: Ask about penicillin allergy — ~1-2% cross-reactivity with cephalosporins. If patient had anaphylaxis to penicillin, avoid cephalosporins. Obtain C&S before first dose.',
      'DURING: Can give with food to reduce GI upset. Complete full course.',
      'AFTER: Monitor for allergic reactions, GI upset, C. difficile diarrhea, and superinfection.',
    ],
    hold_parameters: 'Hold if history of anaphylaxis to penicillin or cephalosporins. Notify provider if rash or diarrhea develops.',
    side_effects: ['Diarrhea', 'Nausea', 'Rash', 'Allergic reaction', 'C. difficile', 'Superinfection'],
    high_alert: false,
    memory_trick: '"Ceph" drugs = Cephalosporins. "KEFLEX KEeps infections in chECK." First-gen = best for gram-positive skin bugs. Remember the cross-reactivity: "Penicillin and Cephalosporin are COUSINS, not twins."',
    related_conditions: ['Cellulitis', 'UTI', 'Strep pharyngitis'],
    semester_relevance: 'Know penicillin cross-reactivity rule. First-gen = gram-positive coverage.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-019',
    drug_name: 'ciprofloxacin',
    brand_names: ['Cipro'],
    drug_class: 'Fluoroquinolone',
    mechanism_of_action:
      'Inhibits bacterial DNA gyrase and topoisomerase IV, preventing DNA replication and transcription. Bactericidal. Broad-spectrum including gram-negative organisms.',
    indications: ['UTI (complicated)', 'Respiratory infections', 'GI infections', 'Bone/joint infections', 'Anthrax (post-exposure)'],
    nursing_implications: [
      'BEFORE: Assess for history of tendon disorders, myasthenia gravis, QT prolongation, or seizures. Check renal function. Avoid in children/adolescents (cartilage damage) and pregnancy.',
      'DURING: Take on empty stomach (2 hours before or 6 hours after antacids, iron, calcium, dairy). Increase fluid intake to prevent crystalluria. Avoid excessive sunlight (photosensitivity).',
      'AFTER: Monitor for tendon pain (especially Achilles) — discontinue immediately if suspected tendonitis/rupture. Watch for C. difficile, peripheral neuropathy, CNS effects (dizziness, confusion, seizures). FDA black box warning for tendon rupture, peripheral neuropathy, and CNS effects.',
    ],
    hold_parameters: 'Hold if patient reports tendon pain, swelling, or inflammation. Hold if QTc > 500 ms. Notify provider.',
    side_effects: ['Tendon rupture (black box)', 'Peripheral neuropathy (black box)', 'CNS effects (black box)', 'QT prolongation', 'C. difficile', 'Photosensitivity', 'Nausea', 'Crystalluria'],
    high_alert: false,
    memory_trick: '"CIPRO = C.I.P.R.O. = Cartilage Injury, Photosensitivity, Rupture of tendons, Oh no!" All "-floxacin" drugs are fluoroquinolones. Three black box warnings: tendons, nerves, brain.',
    related_conditions: ['UTI', 'Respiratory infections', 'GI infections', 'Anthrax'],
    semester_relevance: 'FDA black box warnings are heavily tested. Know tendon rupture risk and drug-food interactions (no dairy/antacids).',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-020',
    drug_name: 'vancomycin',
    brand_names: ['Vancocin'],
    drug_class: 'Glycopeptide Antibiotic',
    mechanism_of_action:
      'Inhibits bacterial cell wall synthesis by binding to D-Ala-D-Ala terminus of peptidoglycan precursors. Bactericidal against gram-positive organisms including MRSA.',
    indications: ['MRSA infections', 'C. difficile colitis (oral route only)', 'Endocarditis', 'Meningitis (gram-positive)', 'Severe skin/soft tissue infections'],
    nursing_implications: [
      'BEFORE: Obtain baseline BUN/creatinine (nephrotoxic) and hearing assessment (ototoxic). Obtain trough level before 4th dose (therapeutic trough: 10-20 mcg/mL for most infections, AUC/MIC-guided dosing increasingly used). Obtain C&S.',
      'DURING: IV infusion over at LEAST 60 minutes (1 gram over 60 min minimum) to prevent Red Man Syndrome (not a true allergy — it is a histamine-mediated infusion reaction). If RMS occurs: stop infusion, give diphenhydramine, restart at slower rate. Oral vancomycin is NOT absorbed systemically — used only for C. difficile.',
      'AFTER: Monitor trough levels, BUN/creatinine, and hearing. Watch for nephrotoxicity (increased creatinine) and ototoxicity (tinnitus, hearing loss). Increased risk when combined with aminoglycosides.',
    ],
    hold_parameters: 'Hold if trough > 20 mcg/mL or creatinine increasing > 0.5 mg/dL from baseline. Notify provider.',
    side_effects: ['Red Man Syndrome (infusion-related)', 'Nephrotoxicity', 'Ototoxicity', 'Thrombophlebitis', 'Neutropenia (with prolonged use)'],
    high_alert: false,
    memory_trick: '"VAN-comycin = the VAN that runs over MRSA." Red Man Syndrome = infuse too FAST, patient turns RED. Slow it down! "Van Goes Slow" = infuse over 60+ minutes. Two toxicities: Nephro and Oto (kidneys and ears).',
    related_conditions: ['MRSA', 'C. difficile', 'Endocarditis', 'Osteomyelitis'],
    semester_relevance: 'Red Man Syndrome vs. true allergy is a classic ATI/NCLEX question. Know trough level timing and therapeutic range.',
    course_code: 'NURS 3813',
  },

  // ─── OPIOID ANALGESICS ────────────────────────────────────────────────────
  {
    id: 'drug-021',
    drug_name: 'morphine',
    brand_names: ['MS Contin', 'Roxanol', 'Duramorph'],
    drug_class: 'Opioid Agonist (Schedule II)',
    mechanism_of_action:
      'Binds to mu-opioid receptors in the CNS. Produces analgesia, euphoria, sedation, and respiratory depression. Also causes histamine release (vasodilation, pruritus).',
    indications: ['Moderate to severe pain', 'Acute MI pain', 'Pulmonary edema (reduces preload)', 'Chronic cancer pain'],
    nursing_implications: [
      'BEFORE: Assess pain (location, quality, intensity 0-10). Check respiratory rate — do NOT give if RR < 12/min. Assess level of consciousness. Check allergies and renal function (active metabolites accumulate in renal failure).',
      'DURING: Give IV morphine slowly (diluted, over 4-5 minutes). Have naloxone (Narcan) at bedside. Implement fall precautions. Raise side rails.',
      'AFTER: Monitor respiratory rate and depth every 1-2 hours initially. Assess sedation scale. Monitor for constipation (order stool softener/bowel regimen prophylactically). Watch for urinary retention, nausea, hypotension, pruritus. Reassess pain 30 min after IV, 1 hour after PO.',
    ],
    hold_parameters: 'Hold if RR < 12 breaths/min or sedation score > 2 or SBP < 90 mmHg. Notify provider. Administer naloxone 0.4 mg IV if RR < 8/min.',
    side_effects: ['Respiratory depression', 'Constipation', 'Nausea/vomiting', 'Sedation', 'Hypotension', 'Pruritus', 'Urinary retention', 'Euphoria', 'Miosis (pinpoint pupils)'],
    high_alert: true,
    memory_trick: '"MORPHINE = Must Offer Respiratory Protection, Have IV Naloxone ready, Evaluate pain." Antidote = naloxone (Narcan). Priority assessment = Respirations. "Count to 12 before you give" (RR must be >/= 12).',
    related_conditions: ['Acute pain', 'MI', 'Pulmonary edema', 'Cancer pain'],
    semester_relevance: 'HIGH ALERT. Respiratory depression assessment and naloxone are the most-tested opioid topics on NCLEX.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-022',
    drug_name: 'hydromorphone',
    brand_names: ['Dilaudid'],
    drug_class: 'Opioid Agonist (Schedule II)',
    mechanism_of_action:
      'Semisynthetic opioid, 5-7x more potent than morphine. Binds mu-opioid receptors. Less histamine release than morphine.',
    indications: ['Moderate to severe pain', 'Morphine-intolerant patients (less histamine release)', 'Post-surgical pain', 'Cancer pain'],
    nursing_implications: [
      'BEFORE: Assess pain and respiratory rate (RR >/= 12). CRITICAL SAFETY: Hydromorphone is frequently confused with morphine due to name similarity — use Tall Man Lettering: HYDROmorphone. Verify dose carefully (5x more potent).',
      'DURING: IV push over 2-3 minutes. Have naloxone available. Double-check dosing — a morphine dose given as hydromorphone can be fatal.',
      'AFTER: Same monitoring as morphine — respiratory rate, sedation, pain reassessment, bowel function.',
    ],
    hold_parameters: 'Hold if RR < 12 breaths/min or sedation score > 2. Notify provider. Have naloxone available.',
    side_effects: ['Respiratory depression', 'Constipation', 'Nausea', 'Sedation', 'Hypotension', 'Pruritus', 'Urinary retention'],
    high_alert: true,
    memory_trick: '"DILAUDID is DILUTED morphine? NO — it is MORE potent!" This is a dangerous look-alike/sound-alike. "HYDROmorphone = HIGH DOSE risk — 5-7x morphine." Always double-check.',
    related_conditions: ['Severe pain', 'Post-surgical pain', 'Cancer pain'],
    semester_relevance: 'HIGH ALERT. ISMP high-alert medication. The hydromorphone-morphine confusion is a patient safety question on NCLEX.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-023',
    drug_name: 'oxycodone',
    brand_names: ['OxyContin (ER)', 'Roxicodone (IR)', 'Percocet (with acetaminophen)'],
    drug_class: 'Opioid Agonist (Schedule II)',
    mechanism_of_action:
      'Binds mu-opioid receptors in the CNS. Semisynthetic opioid derived from thebaine. Available in immediate-release and extended-release formulations.',
    indications: ['Moderate to severe pain', 'Chronic pain (extended-release)', 'Post-surgical pain (immediate-release)'],
    nursing_implications: [
      'BEFORE: Assess pain and respiratory rate. For Percocet, check total daily acetaminophen intake (max 3-4 g/day to prevent hepatotoxicity). Check liver function.',
      'DURING: ER formulations (OxyContin): swallow whole, do NOT crush, break, or chew (dose dumping = fatal overdose). Give on schedule for chronic pain, not PRN.',
      'AFTER: Monitor respiratory rate, sedation, bowel function. Track total acetaminophen if taking combination product. Assess for signs of dependence/tolerance.',
    ],
    hold_parameters: 'Hold if RR < 12 breaths/min or sedation score > 2. Hold Percocet if total acetaminophen > 3 g/day. Notify provider.',
    side_effects: ['Respiratory depression', 'Constipation', 'Nausea', 'Sedation', 'Dizziness', 'Hepatotoxicity (acetaminophen combinations)', 'Physical dependence'],
    high_alert: true,
    memory_trick: '"OxyCONTIN = CONTINuous release — never crush!" Crushing ER = releasing entire dose at once = overdose. "Percocet has a PERK — and that perk is Tylenol (acetaminophen)." Watch the Tylenol total!',
    related_conditions: ['Chronic pain', 'Post-surgical pain', 'Cancer pain'],
    semester_relevance: 'HIGH ALERT. "Never crush extended-release" and acetaminophen max dose are frequent NCLEX questions.',
    course_code: 'NURS 3813',
  },

  // ─── STATINS ──────────────────────────────────────────────────────────────
  {
    id: 'drug-024',
    drug_name: 'atorvastatin',
    brand_names: ['Lipitor'],
    drug_class: 'HMG-CoA Reductase Inhibitor (Statin)',
    mechanism_of_action:
      'Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis. Reduces LDL cholesterol by 40-60%. Increases HDL and reduces triglycerides.',
    indications: ['Hyperlipidemia', 'Atherosclerotic cardiovascular disease prevention', 'Post-MI', 'Diabetic patients > 40 years'],
    nursing_implications: [
      'BEFORE: Obtain baseline lipid panel and liver function tests (AST/ALT). Ask about muscle pain history. Check for drug interactions (especially with grapefruit, gemfibrozil, cyclosporine).',
      'DURING: Can be taken any time of day (atorvastatin has long half-life unlike simvastatin). Avoid excessive grapefruit juice (inhibits CYP3A4, increases statin levels).',
      'AFTER: Monitor lipid panel 4-12 weeks after starting. Check LFTs periodically. Instruct patient to report unexplained muscle pain, tenderness, or weakness — risk of rhabdomyolysis (check CK if symptomatic). Watch for elevated blood glucose.',
    ],
    hold_parameters: 'Hold if AST/ALT > 3x upper limit of normal or CK > 10x upper limit of normal or symptoms of rhabdomyolysis (dark urine, severe muscle pain). Notify provider.',
    side_effects: ['Myalgia (muscle pain)', 'Rhabdomyolysis (rare but serious)', 'Elevated LFTs', 'GI upset', 'Headache', 'Elevated blood glucose', 'Memory issues (rare)'],
    high_alert: false,
    memory_trick: '"A-TOR-vastatin = a TORE muscle?" — watch for rhabdomyolysis. All "-statin" drugs = HMG-CoA reductase inhibitors. "Lipitor LIPids = Lower." Report any muscle pain immediately — could be rhabdo.',
    related_conditions: ['Hyperlipidemia', 'Coronary artery disease', 'Stroke prevention', 'Type 2 DM cardiovascular risk'],
    semester_relevance: 'Rhabdomyolysis and liver monitoring are key test topics. Know to report muscle pain.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-025',
    drug_name: 'simvastatin',
    brand_names: ['Zocor'],
    drug_class: 'HMG-CoA Reductase Inhibitor (Statin)',
    mechanism_of_action:
      'Same as atorvastatin — inhibits HMG-CoA reductase. Shorter half-life than atorvastatin, so timing matters.',
    indications: ['Hyperlipidemia', 'Cardiovascular disease prevention'],
    nursing_implications: [
      'BEFORE: Same as atorvastatin — baseline lipid panel and LFTs. Check for concurrent use of amiodarone, verapamil, diltiazem (increase rhabdomyolysis risk — dose limit 20 mg with these drugs).',
      'DURING: Take in the EVENING (cholesterol synthesis peaks overnight and simvastatin has shorter half-life). Avoid grapefruit juice entirely.',
      'AFTER: Same monitoring — lipid panel, LFTs, muscle symptoms. Maximum dose 80 mg only for patients who have been on it > 12 months without issues.',
    ],
    hold_parameters: 'Hold if AST/ALT > 3x upper limit of normal or CK > 10x upper limit of normal. Notify provider.',
    side_effects: ['Myalgia', 'Rhabdomyolysis', 'Elevated LFTs', 'GI upset', 'Headache'],
    high_alert: false,
    memory_trick: '"SIMvastatin = SIMply take at SUNSET." Evening dosing is key because cholesterol is made at night. Unlike atorvastatin which can be taken anytime.',
    related_conditions: ['Hyperlipidemia', 'Cardiovascular disease prevention'],
    semester_relevance: 'Know the key difference: simvastatin = evening dosing, atorvastatin = any time. Drug interaction limits are testable.',
    course_code: 'NURS 3813',
  },

  // ─── BRONCHODILATORS ──────────────────────────────────────────────────────
  {
    id: 'drug-026',
    drug_name: 'albuterol',
    brand_names: ['ProAir', 'Ventolin', 'Proventil'],
    drug_class: 'Short-Acting Beta-2 Agonist (SABA)',
    mechanism_of_action:
      'Stimulates beta-2 adrenergic receptors in bronchial smooth muscle, causing bronchodilation. Also stabilizes mast cells. Rapid onset (5-15 minutes), duration 4-6 hours.',
    indications: ['Acute bronchospasm', 'Asthma (rescue inhaler)', 'COPD exacerbation', 'Exercise-induced bronchospasm', 'Hyperkalemia (nebulized — drives K+ intracellular)'],
    nursing_implications: [
      'BEFORE: Assess respiratory status (lung sounds, O2 sat, work of breathing, peak flow if available). Check heart rate.',
      'DURING: Rescue inhaler — use PRN for acute symptoms. If using with an inhaled corticosteroid, give albuterol FIRST (opens airways so steroid can penetrate). Wait 1 minute between puffs. Shake MDI well. Use spacer for better drug delivery.',
      'AFTER: Reassess lung sounds and O2 sat 15-20 minutes after administration. Monitor for tachycardia, tremors, nervousness. If using rescue inhaler > 2 days/week, asthma is NOT well-controlled — notify provider.',
    ],
    hold_parameters: 'Hold if HR > 120 bpm or patient has new-onset chest pain or palpitations. Notify provider.',
    side_effects: ['Tachycardia', 'Tremors', 'Nervousness', 'Headache', 'Palpitations', 'Hypokalemia (high doses)', 'Throat irritation'],
    high_alert: false,
    memory_trick: '"ALBUTerol = ALL BREATHE!" It is the RESCUE inhaler — always given first. "SABA = Save A Breath, Always." If needing rescue > 2x/week, asthma control is poor.',
    related_conditions: ['Asthma', 'COPD', 'Bronchospasm', 'Exercise-induced bronchoconstriction'],
    semester_relevance: 'Rescue inhaler before maintenance inhaler order is a guaranteed ATI/NCLEX question. Know the "> 2x/week" rule.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-027',
    drug_name: 'ipratropium',
    brand_names: ['Atrovent'],
    drug_class: 'Anticholinergic Bronchodilator (Short-Acting Muscarinic Antagonist)',
    mechanism_of_action:
      'Blocks acetylcholine at muscarinic receptors in bronchial smooth muscle, causing bronchodilation. Reduces mucus secretion. Onset 15-30 minutes, duration 4-6 hours.',
    indications: ['COPD maintenance', 'Acute bronchospasm (with albuterol)', 'Rhinorrhea (nasal formulation)'],
    nursing_implications: [
      'BEFORE: Assess respiratory status. Ask about glaucoma and urinary retention history (anticholinergic contraindications).',
      'DURING: Often combined with albuterol in nebulizer (DuoNeb/Combivent). Not a rescue inhaler — onset is slower than albuterol. Avoid spraying in eyes.',
      'AFTER: Monitor for dry mouth (most common), urinary retention, constipation, and blurred vision. Offer hard candy or frequent oral care for dry mouth.',
    ],
    hold_parameters: 'Hold if patient has acute narrow-angle glaucoma or urinary retention. Notify provider.',
    side_effects: ['Dry mouth', 'Urinary retention', 'Constipation', 'Blurred vision', 'Cough', 'Headache', 'Bronchospasm (paradoxical, rare)'],
    high_alert: false,
    memory_trick: '"I-PRA-tropium = I PRActice drying things out." Anticholinergic = drying effects (dry mouth, urinary retention, constipation). "Atrovent = Atropine\'s VENT cousin" — same anticholinergic family.',
    related_conditions: ['COPD', 'Acute bronchospasm', 'Chronic bronchitis'],
    semester_relevance: 'Know anticholinergic side effects and that ipratropium is NOT a rescue inhaler. COPD stepwise therapy tested on ATI.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-028',
    drug_name: 'salmeterol',
    brand_names: ['Serevent Diskus'],
    drug_class: 'Long-Acting Beta-2 Agonist (LABA)',
    mechanism_of_action:
      'Stimulates beta-2 receptors causing sustained bronchodilation. Onset: 30-60 minutes, Duration: 12 hours. NOT for acute bronchospasm.',
    indications: ['Asthma maintenance (always with inhaled corticosteroid)', 'COPD maintenance', 'Exercise-induced bronchospasm prevention'],
    nursing_implications: [
      'BEFORE: Verify patient has a rescue inhaler (SABA) available. Salmeterol should NEVER be used alone for asthma — FDA black box warning for increased asthma-related death when used as monotherapy.',
      'DURING: Use twice daily (every 12 hours) at same times. This is a maintenance medication, NOT a rescue inhaler. Typically combined with fluticasone (Advair).',
      'AFTER: Monitor for tachycardia, tremors, headache. Ensure patient understands: for acute attack, use albuterol, NOT salmeterol. Assess asthma control at follow-up visits.',
    ],
    hold_parameters: 'Hold if HR > 120 bpm. NEVER use for acute bronchospasm. Notify provider if using rescue inhaler more frequently.',
    side_effects: ['Headache', 'Tachycardia', 'Tremors', 'Throat irritation', 'Palpitations', 'Paradoxical bronchospasm (rare)'],
    high_alert: false,
    memory_trick: '"SALMeterol = SLOW And Long Maintenance." LABA = Long-Acting, NOT for rescue. "Serevent is SERENE" — it keeps you calm and stable, not for emergencies. FDA black box: never use alone for asthma.',
    related_conditions: ['Asthma (with ICS)', 'COPD'],
    semester_relevance: 'FDA black box warning (no monotherapy in asthma) and LABA vs. SABA distinction are high-yield NCLEX topics.',
    course_code: 'NURS 3813',
  },

  // ─── BONUS HIGH-YIELD DRUGS ───────────────────────────────────────────────
  {
    id: 'drug-029',
    drug_name: 'digoxin',
    brand_names: ['Lanoxin'],
    drug_class: 'Cardiac Glycoside',
    mechanism_of_action:
      'Inhibits Na+/K+ ATPase pump, increasing intracellular calcium, which increases myocardial contractility (positive inotrope). Also slows conduction through AV node (negative chronotrope/dromotrope).',
    indications: ['Heart failure (HFrEF, adjunct therapy)', 'Atrial fibrillation (rate control)', 'Atrial flutter'],
    nursing_implications: [
      'BEFORE: Check apical pulse for 1 FULL minute. Check potassium level — hypokalemia increases digoxin toxicity risk. Check digoxin level if ordered (therapeutic: 0.8-2.0 ng/mL). Check renal function (renally excreted).',
      'DURING: Very narrow therapeutic index (0.8-2.0 ng/mL, toxicity > 2.0 ng/mL). Administer at same time daily. Avoid concurrent use with amiodarone, verapamil (increase digoxin levels).',
      'AFTER: Monitor for toxicity: GI (anorexia, nausea, vomiting — EARLIEST signs), visual changes (yellow-green halos, blurred vision), cardiac (bradycardia, heart block, any new dysrhythmia). Antidote: Digoxin immune Fab (Digibind).',
    ],
    hold_parameters: 'Hold if apical HR < 60 bpm (adult) or < 70 bpm (child) or < 90 bpm (infant). Hold if K+ < 3.5 mEq/L or digoxin level > 2.0 ng/mL. Notify provider.',
    side_effects: ['Bradycardia', 'Heart block', 'Nausea/vomiting/anorexia (early toxicity)', 'Yellow-green visual halos', 'Dysrhythmias', 'Confusion'],
    high_alert: true,
    memory_trick: '"DIG-oxin DIGs a slow heart rate." Check pulse for 1 full minute. "Dig + Low K+ = Toxicity" — hypokalemia is the #1 risk factor. Yellow-green halos = "Van Gogh vision" (he may have had digoxin toxicity). Antidote = DigiFab.',
    related_conditions: ['Heart failure', 'Atrial fibrillation', 'Atrial flutter'],
    semester_relevance: 'Extremely high-yield on ATI and NCLEX. Toxicity signs, hold parameters, and K+ relationship are all tested.',
    course_code: 'NURS 3813',
  },
  {
    id: 'drug-030',
    drug_name: 'metformin',
    brand_names: ['Glucophage'],
    drug_class: 'Biguanide (Oral Antidiabetic)',
    mechanism_of_action:
      'Decreases hepatic glucose production, decreases intestinal glucose absorption, and improves insulin sensitivity in peripheral tissues. Does NOT stimulate insulin release — no hypoglycemia when used alone.',
    indications: ['Type 2 DM (first-line therapy)', 'Prediabetes', 'PCOS (off-label)'],
    nursing_implications: [
      'BEFORE: Check renal function (BUN/creatinine, eGFR). Contraindicated if eGFR < 30 mL/min/1.73m2. Check for planned contrast dye procedures — hold metformin before and 48 hours after IV contrast.',
      'DURING: Take with meals to reduce GI side effects (most common: diarrhea, nausea, metallic taste). Start low, titrate slowly.',
      'AFTER: Monitor HbA1c every 3-6 months (goal < 7% for most adults). Monitor renal function at least annually. Check vitamin B12 levels (metformin decreases absorption). Teach patient signs of lactic acidosis (rare but fatal): muscle pain, weakness, difficulty breathing, unusual fatigue, abdominal pain. Hold before surgery.',
    ],
    hold_parameters: 'Hold if eGFR < 30 mL/min/1.73m2 or serum creatinine > 1.5 mg/dL (males) or > 1.4 mg/dL (females). Hold 48 hours before/after IV contrast. Hold for surgery. Notify provider.',
    side_effects: ['GI upset (diarrhea, nausea, bloating)', 'Metallic taste', 'Vitamin B12 deficiency', 'Lactic acidosis (rare, life-threatening)', 'Weight neutral or slight loss'],
    high_alert: false,
    memory_trick: '"MET-formin MET-abolizes glucose without causing hypo." First-line for T2DM. "No contrast + No kidneys failing = No metformin problems." Hold 48 hours around IV contrast. Lactic acidosis = the scary rare one.',
    related_conditions: ['Type 2 DM', 'Prediabetes', 'Metabolic syndrome', 'PCOS'],
    semester_relevance: 'First-line T2DM drug. Contrast dye interaction and lactic acidosis are heavily tested on ATI Pharm proctored exam.',
    course_code: 'NURS 3813',
  },
];
