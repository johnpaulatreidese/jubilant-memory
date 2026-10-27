import { useState } from "react";
import { Person, MovementReport, ReportTemplate } from "./types";
import { PersonnelManager } from "./components/PersonnelManager";
import { MovementForm } from "./components/MovementForm";
import { ReportDisplay } from "./components/ReportDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Toaster } from "./components/ui/sonner";

// Default templates
const templates: ReportTemplate[] = [
  {
    id: "morning",
    name: "Morning Report",
    greeting: "Good Morning Trainers,",
    closingMessage: "Thank you Trainers.",
  },
  {
    id: "afternoon",
    name: "Afternoon Report",
    greeting: "Good Afternoon Trainers,",
    closingMessage: "Thank you Trainers.",
  },
  {
    id: "evening",
    name: "Evening Report",
    greeting: "Good Evening Trainers,",
    closingMessage: "Thank you Trainers.",
  },
];

// Sample data
const samplePersonnel: Person[] = [
  // Section 1 (S101-S109)
  { id: "1", unit: "S101", rank: "OCT", name: "HECHEN SIRUI" },
  { id: "2", unit: "S102", rank: "OCT", name: "TAN YU QIAN" },
  { id: "3", unit: "S103", rank: "OCT", name: "LU WENKANG" },
  { id: "4", unit: "S104", rank: "OCT", name: "TOH YIK, TOBY" },
  { id: "5", unit: "S105", rank: "OCT", name: "XIAO NIANHE" },
  { id: "6", unit: "S106", rank: "OCT", name: "ADITHYA KARTHIKEYAN SENTHILKUMAR" },
  { id: "7", unit: "S107", rank: "OCT", name: "DILLON POH KGUAN JOY" },
  { id: "8", unit: "S108", rank: "OCT", name: "AIDAN ONG WEI SHENG" },
  { id: "9", unit: "S109", rank: "OCT", name: "CHEN SHENGXU" },

  // Section 2 (S201-S208)
  { id: "10", unit: "S201", rank: "OCT", name: "JOLOVAN TEO JIA JUN" },
  { id: "11", unit: "S202", rank: "OCT", name: "PEH KANG JIAN" },
  { id: "12", unit: "S203", rank: "OCT", name: "AI BOXUAN" },
  { id: "13", unit: "S204", rank: "OCT", name: "CHEANG CHONG PENG KLIFF" },
  { id: "14", unit: "S205", rank: "OCT", name: "ANG SHAO XUAN" },
  { id: "15", unit: "S206", rank: "OCT", name: "CAYDEN NG KEI CHUN" },
  { id: "16", unit: "S207", rank: "OCT", name: "ADITYA BHATNAGAR" },
  { id: "17", unit: "S208", rank: "OCT", name: "ELLIOTT JAMES WONG" },

  // Section 3 (S301-S309)
  { id: "18", unit: "S301", rank: "OCT", name: "TANG KAI KIAT" },
  { id: "19", unit: "S302", rank: "OCT", name: "ISAAC LIM SZE-YUAN" },
  { id: "20", unit: "S303", rank: "OCT", name: "LIM BOON KHAI" },
  { id: "21", unit: "S304", rank: "OCT", name: "TAM YU ZHE" },
  { id: "22", unit: "S305", rank: "OCT", name: "ELTON BEK WEI JIE" },
  { id: "23", unit: "S306", rank: "OCT", name: "EVAN QUEK JUN ZHI" },
  { id: "24", unit: "S307", rank: "OCT", name: "IAN ZACHARY SOON JIEN HAO" },
  { id: "25", unit: "S308", rank: "OCT", name: "JOSHUA KEE JIAWEI" },
  { id: "26", unit: "S309", rank: "OCT", name: "KARTHIKEYAN SUNDARESAN" },

  // Section 4 (S401-S409)
  { id: "27", unit: "S401", rank: "LTA", name: "ELENA CHAN JENG YAN" },
  { id: "28", unit: "S402", rank: "OCT", name: "ENG CERISE" },
  { id: "29", unit: "S403", rank: "OCT", name: "ANG KAI YUE STANLEY" },
  { id: "30", unit: "S404", rank: "OCT", name: "HARISH S/O GANESEN" },
  { id: "31", unit: "S405", rank: "OCT", name: "HUANG JUNDONG" },
  { id: "32", unit: "S406", rank: "OCT", name: "CIARAN LIAM CONDRON (KANG JUN YING JIE)" },
  { id: "33", unit: "S407", rank: "OCT", name: "KHOR KAI CE" },
  { id: "34", unit: "S408", rank: "OCT", name: "KRISHEL NAGESH DEVATA" },
  { id: "35", unit: "S409", rank: "OCT", name: "TEH GUANG HUI" },

  // Section 5 (S501-S508)
  { id: "36", unit: "S501", rank: "OCT", name: "CHAN YI PENG" },
  { id: "37", unit: "S502", rank: "OCT", name: "HEMANYA CHADHA" },
  { id: "38", unit: "S503", rank: "OCT", name: "IAN LEE RAY MING" },
  { id: "39", unit: "S504", rank: "OCT", name: "NG YONG JIN DARREN" },
  { id: "40", unit: "S505", rank: "OCT", name: "RICK ANG JIA LE" },
  { id: "41", unit: "S506", rank: "OCT", name: "SAMUEL SHILOH NG" },
  { id: "42", unit: "S507", rank: "OCT", name: "TAN GEK KWAN" },
  { id: "43", unit: "S508", rank: "OCT", name: "KEYON NG KAIYANG" },

  // Section 6 (S601-S608)
  { id: "44", unit: "S601", rank: "OCT", name: "KHOO KAI EN, DONOVAN" },
  { id: "45", unit: "S602", rank: "OCT", name: "TRISTAN LIANG HENG JUN" },
  { id: "46", unit: "S603", rank: "OCT", name: "RANADIP SAHA" },
  { id: "47", unit: "S604", rank: "OCT", name: "LIM XING, JETT" },
  { id: "48", unit: "S605", rank: "OCT", name: "TRISTON NG JUN KAI" },
  { id: "49", unit: "S606", rank: "OCT", name: "WU JUN EN, JAYDEN" },
  { id: "50", unit: "S607", rank: "OCT", name: "YONG SHAN YU ETHAN" },
  { id: "51", unit: "S608", rank: "OCT", name: "ZHANG SHUYUAN" },
];

export default function App() {
  const [personnel, setPersonnel] = useState<Person[]>(samplePersonnel);
  const [currentReport, setCurrentReport] = useState<MovementReport | null>(null);

  const handleAddPerson = (person: Omit<Person, "id">) => {
    const newPerson: Person = {
      ...person,
      id: Date.now().toString(),
    };
    setPersonnel([...personnel, newPerson]);
  };

  const handleUpdatePerson = (id: string, updatedPerson: Omit<Person, "id">) => {
    setPersonnel(
      personnel.map((p) => (p.id === id ? { ...updatedPerson, id } : p))
    );
  };

  const handleDeletePerson = (id: string) => {
    setPersonnel(personnel.filter((p) => p.id !== id));
  };

  const handleGenerateReport = (
    report: Omit<MovementReport, "id" | "timestamp">
  ) => {
    const newReport: MovementReport = {
      ...report,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setCurrentReport(newReport);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Toaster />
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="mb-2">Movement Report Application</h1>
          <p className="text-muted-foreground">
            Track personnel movements between locations
          </p>
        </div>

        <Tabs defaultValue="report" className="space-y-6">
          <TabsList>
            <TabsTrigger value="report">Create Report</TabsTrigger>
            <TabsTrigger value="personnel">Manage Personnel</TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Form */}
              <div>
                <MovementForm
                  personnel={personnel}
                  templates={templates}
                  onGenerateReport={handleGenerateReport}
                />
              </div>

              {/* Report Display */}
              <div>
                {currentReport ? (
                  <ReportDisplay report={currentReport} personnel={personnel} />
                ) : (
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed p-8">
                    <p className="text-muted-foreground text-center">
                      Fill out the form to generate a movement report
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personnel">
            <PersonnelManager
              personnel={personnel}
              onAddPerson={handleAddPerson}
              onUpdatePerson={handleUpdatePerson}
              onDeletePerson={handleDeletePerson}
            />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-8 pb-4">
          Please contact OCT KLIFF if there are any fixes/improvements to be made
        </footer>
      </div>
    </div>
  );
}