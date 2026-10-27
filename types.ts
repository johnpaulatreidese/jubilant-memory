export interface Person {
  id: string;
  rank: string;
  name: string;
  unit: string;
}

export type ReportFormat = 
  | "movement-list" // "The following cadets has left X and reached Y"
  | "movement-including"; // "86th FAOCC including the following cadets has left X and reached Y"

export type UnitDesignation = "86th FAOCC" | "LSN" | "FA" | "FATA";

export interface MovementReport {
  id: string;
  greeting: string;
  time: string;
  origin: string;
  destination: string;
  personnelIds: string[];
  excludedPersonnelIds: string[];
  isExclusionMode: boolean; // true = "all except", false = "following personnel"
  isEntireUnitMode: boolean; // true = "entire unit movement", no personnel names
  platoonMode: "platoon1" | "platoon2" | null; // simplified platoon-level report
  closingMessage: string;
  timestamp: string;
  format: ReportFormat;
  unitDesignation: UnitDesignation;
}

export interface ReportTemplate {
  id: string;
  name: string;
  greeting: string;
  closingMessage: string;
}