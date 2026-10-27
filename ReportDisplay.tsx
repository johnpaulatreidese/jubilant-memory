import { Person, MovementReport } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, Download, User } from "lucide-react";
import { toast } from "sonner";

interface ReportDisplayProps {
  report: MovementReport;
  personnel: Person[];
}

export function ReportDisplay({ report, personnel }: ReportDisplayProps) {
  const getPersonById = (id: string) => personnel.find((p) => p.id === id);

  const getReportText = () => {
    let text = `${report.greeting}\n\n`;

    const unit = report.unitDesignation;
    
    // Format time with HR suffix if not already present
    const formattedTime = report.time.toUpperCase().endsWith('HRS')
      ? report.time
      : `${report.time}HRS`;
    
    // Handle Entire Unit mode - no personnel names
    if (report.isEntireUnitMode) {
      text += `${unit} has left ${report.origin.toUpperCase()} and reached ${report.destination.toUpperCase()} as at ${formattedTime}.\n\n`;
      text += `${report.closingMessage}`;
      return text;
    }

    // Handle Platoon modes - no personnel names
    if (report.platoonMode) {
      const platoonLabel = report.platoonMode === "platoon1" ? "PLATOON 1" : "PLATOON 2";
      text += `${platoonLabel} has left ${report.origin.toUpperCase()} and reached ${report.destination.toUpperCase()} as at ${formattedTime}.\n\n`;
      text += `${report.closingMessage}`;
      return text;
    }

    // Get the personnel list
    const displayPersonnel = report.isExclusionMode
      ? report.excludedPersonnelIds.map(getPersonById).filter(Boolean)
      : report.personnelIds.map(getPersonById).filter(Boolean);

    // Sort by unit
    const sortedPersonnel = [...displayPersonnel].sort((a, b) => {
      if (!a || !b) return 0;
      return a.unit.localeCompare(b.unit);
    });

    const totalPersonnel = personnel.length;
    const movingCount = report.isExclusionMode 
      ? totalPersonnel - report.excludedPersonnelIds.length
      : report.personnelIds.length;

    switch (report.format) {
      case "movement-list":
        // Original format: "The following cadets has left X and reached Y"
        if (report.isExclusionMode) {
          text += `${unit} less the following cadets `;
          text += `has left ${report.origin.toUpperCase()} and reached ${report.destination.toUpperCase()} as at ${formattedTime}.\n\n`;
        
        } else {
          text += `The following cadets `;
          text += `have left ${report.origin.toUpperCase()} and reached ${report.destination.toUpperCase()} as at ${formattedTime}.\n\n`;
    
        }
      
        sortedPersonnel.forEach((person) => {
          if (person) {
            text += `${person.unit} ${person.rank} ${person.name}\n`;
          }
        });
        break;

      case "movement-including":
        // Including format: "86th FAOCC including the following cadets has left X and reached Y"
        text += `${unit} including the following cadets has left ${report.origin.toUpperCase()} and reached ${report.destination.toUpperCase()} as at ${formattedTime}.\n\n`;
        
        sortedPersonnel.forEach((person) => {
          if (person) {
            text += `${person.unit} ${person.rank} ${person.name}\n`;
          }
        });
        break;
    }

    text += `\n${report.closingMessage}`;

    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getReportText());
    toast.success("Report copied to clipboard!");
  };

  const handleExport = () => {
    const blob = new Blob([getReportText()], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movement-report-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Report exported!");
  };

  const getNamesOnly = () => {
    // Get the personnel list
    const displayPersonnel = report.isExclusionMode
      ? report.excludedPersonnelIds.map(getPersonById).filter(Boolean)
      : report.personnelIds.map(getPersonById).filter(Boolean);

    // Sort by unit
    const sortedPersonnel = [...displayPersonnel].sort((a, b) => {
      if (!a || !b) return 0;
      return a.unit.localeCompare(b.unit);
    });

    // Return unit, rank, and name formatted, one per line
    return sortedPersonnel.map((person) => 
      person ? `${person.unit} ${person.rank} ${person.name}` : ""
    ).join("\n");
  };

  const handleCopyNamesOnly = () => {
    navigator.clipboard.writeText(getNamesOnly());
    toast.success("Names copied to clipboard!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Generated Report</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            {!report.isEntireUnitMode && !report.platoonMode && (
              <Button size="sm" variant="outline" onClick={handleCopyNamesOnly}>
                <User className="mr-2 h-4 w-4" />
                Copy Names
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md bg-muted p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm">{getReportText()}</pre>
        </div>
      </CardContent>
    </Card>
  );
}