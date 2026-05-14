export interface NihssOption {
  value: number;
  label: string;
}

export interface NihssItem {
  key: keyof import("./types").NihssScores;
  number: string;
  name: string;
  description: string;
  options: NihssOption[];
}

export const NIHSS_ITEMS: NihssItem[] = [
  {
    key: "item1a",
    number: "1a",
    name: "Level of Consciousness",
    description: "Assess overall responsiveness. Do not assign >0 if patient awakes with minimal stimulation.",
    options: [
      { value: 0, label: "Alert; keenly responsive" },
      { value: 1, label: "Not alert, but arousable by minor stimulation" },
      { value: 2, label: "Not alert; requires repeated stimulation to attend" },
      { value: 3, label: "Unresponsive or responds only reflexively" },
    ],
  },
  {
    key: "item1b",
    number: "1b",
    name: "LOC Questions",
    description: "Ask patient their age and current month. Score each incorrect/untestable answer.",
    options: [
      { value: 0, label: "Both answers correct" },
      { value: 1, label: "One answer correct" },
      { value: 2, label: "Neither answer correct" },
    ],
  },
  {
    key: "item1c",
    number: "1c",
    name: "LOC Commands",
    description: "Ask patient to open/close eyes and grip/release non-paretic hand.",
    options: [
      { value: 0, label: "Both tasks correct" },
      { value: 1, label: "One task correct" },
      { value: 2, label: "Neither task correct" },
    ],
  },
  {
    key: "item2",
    number: "2",
    name: "Best Gaze",
    description: "Test horizontal eye movements. Only voluntary or reflexive eye movements are scored.",
    options: [
      { value: 0, label: "Normal" },
      { value: 1, label: "Partial gaze palsy; gaze is abnormal in one or both eyes" },
      { value: 2, label: "Forced deviation, or total gaze palsy not overcome by oculocephalic maneuver" },
    ],
  },
  {
    key: "item3",
    number: "3",
    name: "Visual Fields",
    description: "Test visual fields (upper and lower quadrants) by confrontation. Score symmetrical blindness as 3.",
    options: [
      { value: 0, label: "No visual loss" },
      { value: 1, label: "Partial hemianopia" },
      { value: 2, label: "Complete hemianopia" },
      { value: 3, label: "Bilateral hemianopia or cortical blindness" },
    ],
  },
  {
    key: "item4",
    number: "4",
    name: "Facial Palsy",
    description: "Ask patient to show teeth, raise eyebrows, and close eyes.",
    options: [
      { value: 0, label: "Normal symmetric movements" },
      { value: 1, label: "Minor paralysis (flattened NL fold, asymmetry on smiling)" },
      { value: 2, label: "Partial paralysis (total or near-total paralysis of lower face)" },
      { value: 3, label: "Complete paralysis of one or both sides (absent facial movement)" },
    ],
  },
  {
    key: "item5a",
    number: "5a",
    name: "Motor Arm — Left",
    description: "Left arm is held 90° (sitting) or 45° (supine). Score drift, movement against gravity, or no movement.",
    options: [
      { value: 0, label: "No drift; arm holds 90° (or 45°) for full 10 seconds" },
      { value: 1, label: "Drift; arm holds position but drifts down before 10 seconds" },
      { value: 2, label: "Some effort against gravity; arm cannot hold position, but has some effort" },
      { value: 3, label: "No effort against gravity; arm falls immediately" },
      { value: 4, label: "No movement" },
    ],
  },
  {
    key: "item5b",
    number: "5b",
    name: "Motor Arm — Right",
    description: "Right arm is held 90° (sitting) or 45° (supine). Score drift, movement against gravity, or no movement.",
    options: [
      { value: 0, label: "No drift; arm holds 90° (or 45°) for full 10 seconds" },
      { value: 1, label: "Drift; arm holds position but drifts down before 10 seconds" },
      { value: 2, label: "Some effort against gravity; arm cannot hold position, but has some effort" },
      { value: 3, label: "No effort against gravity; arm falls immediately" },
      { value: 4, label: "No movement" },
    ],
  },
  {
    key: "item6a",
    number: "6a",
    name: "Motor Leg — Left",
    description: "Left leg is held at 30° (supine only). Score drift at 5 seconds.",
    options: [
      { value: 0, label: "No drift; leg holds 30° position for full 5 seconds" },
      { value: 1, label: "Drift; leg falls by end of 5-second period" },
      { value: 2, label: "Some effort against gravity; leg falls to bed by 5 seconds, but has some effort" },
      { value: 3, label: "No effort against gravity; leg falls immediately" },
      { value: 4, label: "No movement" },
    ],
  },
  {
    key: "item6b",
    number: "6b",
    name: "Motor Leg — Right",
    description: "Right leg is held at 30° (supine only). Score drift at 5 seconds.",
    options: [
      { value: 0, label: "No drift; leg holds 30° position for full 5 seconds" },
      { value: 1, label: "Drift; leg falls by end of 5-second period" },
      { value: 2, label: "Some effort against gravity; leg falls to bed by 5 seconds, but has some effort" },
      { value: 3, label: "No effort against gravity; leg falls immediately" },
      { value: 4, label: "No movement" },
    ],
  },
  {
    key: "item7",
    number: "7",
    name: "Limb Ataxia",
    description: "Finger-nose-finger and heel-shin test. Score only if out of proportion to weakness.",
    options: [
      { value: 0, label: "Absent" },
      { value: 1, label: "Present in one limb" },
      { value: 2, label: "Present in two limbs" },
    ],
  },
  {
    key: "item8",
    number: "8",
    name: "Sensory",
    description: "Test pinprick sensation on arms, legs, trunk, face. Score loss attributable to stroke only.",
    options: [
      { value: 0, label: "Normal; no sensory loss" },
      { value: 1, label: "Mild-to-moderate sensory loss; patient feels pinprick is less sharp or dull" },
      { value: 2, label: "Severe to total sensory loss; patient is not aware of being touched in the face, arm, and leg" },
    ],
  },
  {
    key: "item9",
    number: "9",
    name: "Best Language",
    description: "Use picture description, naming, and reading tasks. Score based on best performance.",
    options: [
      { value: 0, label: "No aphasia; normal" },
      { value: 1, label: "Mild-to-moderate aphasia; some obvious loss of fluency or facility of comprehension" },
      { value: 2, label: "Severe aphasia; all communication is through fragmentary expression" },
      { value: 3, label: "Mute, global aphasia; no usable speech or auditory comprehension" },
    ],
  },
  {
    key: "item10",
    number: "10",
    name: "Dysarthria",
    description: "Ask patient to read or repeat words from a list. Score articulation only, not aphasia.",
    options: [
      { value: 0, label: "Normal" },
      { value: 1, label: "Mild-to-moderate dysarthria; patient slurs at least some words" },
      { value: 2, label: "Severe dysarthria; patient's speech is so slurred as to be unintelligible or patient is mute/anarthric" },
    ],
  },
  {
    key: "item11",
    number: "11",
    name: "Extinction and Inattention",
    description: "Use information from prior testing to score. Test simultaneous double stimulation (visual, tactile, auditory).",
    options: [
      { value: 0, label: "No abnormality" },
      { value: 1, label: "Visual, tactile, auditory, spatial, or personal inattention; extinction to bilateral simultaneous stimulation in one of the sensory modalities" },
      { value: 2, label: "Profound hemi-inattention or extinction to more than one modality; does not recognize own hand or orients to only one side of space" },
    ],
  },
];

export function computeNihssTotal(scores: import("./types").NihssScores): number {
  return Object.values(scores).reduce((sum, v) => sum + (v as number), 0);
}

export function getNihssSeverity(total: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (total <= 4)
    return { label: "Minor", color: "text-emerald-700", bgColor: "bg-emerald-50 border-emerald-200" };
  if (total <= 15)
    return { label: "Moderate", color: "text-amber-700", bgColor: "bg-amber-50 border-amber-200" };
  if (total <= 20)
    return { label: "Severe", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-200" };
  return { label: "Very Severe", color: "text-red-700", bgColor: "bg-red-50 border-red-200" };
}
