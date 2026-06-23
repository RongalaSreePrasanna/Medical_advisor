export type Language = "English" | "Hindi" | "Marathi" | "Tamil" | "Telugu" | "Bengali" | "Kannada";

export interface Diagnosis {
  condition: string;
  confidence: string;
  description: string;
  homeCare: string;
}

export interface GovScheme {
  name: string;
  description: string;
}

export interface RecommendedMedicine {
  name: string;
  purpose: string;
  dosage: string;
  durationDays: number;
  howToUse: string;
  colorTheme: "blue" | "red" | "green" | "yellow" | "purple";
}

export interface SymptomResult {
  severity: "Low" | "Medium" | "High" | "Emergency";
  severityScore: number;
  diagnoses: Diagnosis[];
  isEmergency: boolean;
  emergencyAlert: string;
  redFlags: string[];
  governmentSchemes?: GovScheme[];
  guidance: string;
  spokenSummary: string;
  disclaimer: string;
  recommendedMedicines?: RecommendedMedicine[];
}

export interface VaccineItem {
  id: string;
  name: string;
  recommendedAge: string;
  ageWeeks: number;
  status: "Due" | "Given" | "Overdue";
  givenDate?: string;
  description: string;
}

export interface HealthProfile {
  id: string;
  type: "Child" | "Mother";
  name: string;
  ageInMonths: number;
  lastMilestoneDate: string;
  contactNumber: string;
  vaccines: VaccineItem[];
}

export interface OutbreakForecast {
  region: string;
  dengueRisk: "Low" | "Medium" | "High";
  malariaRisk: "Low" | "Medium" | "High";
  heatstrokeRisk: "Low" | "Medium" | "High";
  weeklyRiskTrend: number[]; // 5 elements
  alertMessage: string;
}

export interface HouseholdInfo {
  id: string;
  headName: string;
  villageName: string;
  familyCount: number;
  immunizationPercentage: number;
  notes: string;
}

export interface HealthcareCenter {
  name: string;
  type: "PHC" | "Government Hospital" | "Vaccination Center" | "Emergency Unit";
  pinCode: string;
  city: string;
  state: string;
  distance: string;
  phone: string;
  services: string[];
  bedCount: number;
}
