import { useState } from "react";
import { Person, MovementReport, ReportTemplate, ReportFormat, UnitDesignation } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Search, ArrowLeftRight } from "lucide-react";

interface MovementFormProps {
  personnel: Person[];
  templates: ReportTemplate[];
  onGenerateReport: (report: Omit<MovementReport, "id" | "timestamp">) => void;
}

// Predefined locations
const LOCATIONS = [
  "AI BUILDING",
  "NON-MUSLIM COOKHOUSE",
  "MUSLIM COOKHOUSE",
  "KHATIB CAMP MAIN GATE",
  "SOC GROUND",
  "STADIUM",
];

// Determine template based on current time
const getDefaultTemplate = (templates: ReportTemplate[]): string => {
  const now = new Date();
  const hours = now.getHours();
  
  if (hours >= 0 && hours < 12) {
    // 0000 to 1159 - Morning
    return templates.find(t => t.id === "morning")?.id || templates[0]?.id || "";
  } else if (hours >= 12 && hours < 18) {
    // 1200 to 1759 - Afternoon
    return templates.find(t => t.id === "afternoon")?.id || templates[0]?.id || "";
  } else {
    // 1800 to 2359 - Evening
    return templates.find(t => t.id === "evening")?.id || templates[0]?.id || "";
  }
};

export function MovementForm({
  personnel,
  templates,
  onGenerateReport,
}: MovementFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(getDefaultTemplate(templates));
  const [greeting, setGreeting] = useState(() => {
    const defaultTemplate = templates.find(t => t.id === getDefaultTemplate(templates));
    return defaultTemplate?.greeting || "";
  });
  const [time, setTime] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [closingMessage, setClosingMessage] = useState(() => {
    const defaultTemplate = templates.find(t => t.id === getDefaultTemplate(templates));
    return defaultTemplate?.closingMessage || "";
  });
  const [isExclusionMode, setIsExclusionMode] = useState(false);
  const [isEntireUnitMode, setIsEntireUnitMode] = useState(false);
  const [platoonMode, setPlatoonMode] = useState<"platoon1" | "platoon2" | null>(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([]);
  const [reportFormat, setReportFormat] = useState<ReportFormat>("movement-list");
  const [searchQuery, setSearchQuery] = useState("");
  const [unitDesignation, setUnitDesignation] = useState<UnitDesignation>("86th FAOCC");

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setGreeting(template.greeting);
      setClosingMessage(template.closingMessage);
    }
  };

  const handlePersonToggle = (personId: string) => {
    setSelectedPersonnel((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const handleSelectAll = () => {
    setSelectedPersonnel(personnel.map((p) => p.id));
  };

  const handleDeselectAll = () => {
    setSelectedPersonnel([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!time || !origin || !destination) {
      return;
    }

    // For entire unit or platoon modes, skip personnel selection validation
    if (!isEntireUnitMode && !platoonMode && selectedPersonnel.length === 0) {
      return;
    }

    onGenerateReport({
      greeting,
      time,
      origin,
      destination,
      personnelIds: isExclusionMode ? [] : selectedPersonnel,
      excludedPersonnelIds: isExclusionMode ? selectedPersonnel : [],
      isExclusionMode,
      isEntireUnitMode,
      platoonMode,
      closingMessage,
      format: reportFormat,
      unitDesignation,
    });
  };

  // Swap origin and destination
  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  // Filter personnel based on search query
  const filteredPersonnel = personnel.filter((person) => {
    const query = searchQuery.toLowerCase();
    return (
      person.name.toLowerCase().includes(query) ||
      person.unit.toLowerCase().includes(query) ||
      person.rank.toLowerCase().includes(query)
    );
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Movement Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Report Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger id="template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Greeting */}
          <div className="space-y-2">
            <Label htmlFor="greeting">Greeting</Label>
            <Input
              id="greeting"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="e.g., Good Morning Trainers,"
              required
            />
          </div>

          {/* Unit Designation */}
          <div className="space-y-2">
            <Label htmlFor="unitDesignation">Unit Designation</Label>
            <Select value={unitDesignation} onValueChange={(value) => setUnitDesignation(value as UnitDesignation)}>
              <SelectTrigger id="unitDesignation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="86th FAOCC">86th FAOCC</SelectItem>
                <SelectItem value="LSN">LSN</SelectItem>
                <SelectItem value="FA">FA</SelectItem>
                <SelectItem value="FATA">FATA</SelectItem>
              </SelectContent>
            </Select>
          </div>

       
          {/* Time, Origin, Destination */}
          <div className="space-y-2">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <Input
                      id="time"
                      value={time}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        setTime(value);
                      }}
                      placeholder="e.g., 0550"
                      className="pr-10"
                      maxLength={4}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      HRS
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date();
                      const hours = String(now.getHours()).padStart(2, "0");
                      const minutes = String(now.getMinutes()).padStart(2, "0");
                      setTime(`${hours}${minutes}`);
                    }}
                  >
                    Now
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input
                  id="origin"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  placeholder="Select or type location"
                  list="origin-list"
                  required
                />
                <datalist id="origin-list">
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  placeholder="Select or type location"
                  list="destination-list"
                  required
                />
                <datalist id="destination-list">
                  {LOCATIONS.map((location) => (
                    <option key={location} value={location} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSwapLocations}
                className="gap-2"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Swap Origin & Destination
              </Button>
            </div>
          </div>

          {/* Personnel Mode */}
          <div className="space-y-2">
            <Label>Report Mode</Label>
            <RadioGroup
              value={isEntireUnitMode ? "entireUnit" : platoonMode === "platoon1" ? "platoon1" : platoonMode === "platoon2" ? "platoon2" : isExclusionMode ? "exclusion" : "inclusion"}
              onValueChange={(value) => {
                setIsEntireUnitMode(value === "entireUnit");
                setIsExclusionMode(value === "exclusion");
                setPlatoonMode(value === "platoon1" ? "platoon1" : value === "platoon2" ? "platoon2" : null);
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inclusion" id="inclusion" />
                <Label htmlFor="inclusion" className="cursor-pointer">
                  The following personnel moved
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exclusion" id="exclusion" />
                <Label htmlFor="exclusion" className="cursor-pointer">
                  All personnel except the following moved
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="entireUnit" id="entireUnit" />
                <Label htmlFor="entireUnit" className="cursor-pointer">
                  Entire 86th FAOCC movement
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="platoon1" id="platoon1" />
                <Label htmlFor="platoon1" className="cursor-pointer">
                  Platoon 1 movement
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="platoon2" id="platoon2" />
                <Label htmlFor="platoon2" className="cursor-pointer">
                  Platoon 2 movement
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Personnel Selection - Hidden when Entire Unit or Platoon Mode is selected */}
          {!isEntireUnitMode && !platoonMode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>
                  {isExclusionMode
                    ? "Select Personnel to Exclude"
                    : "Select Personnel Moving"}
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDeselectAll}
                  >
                    Deselect All
                  </Button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, unit, or rank..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="max-h-64 overflow-y-auto rounded-md border p-4 space-y-2">
                {personnel.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No personnel available. Add personnel first.
                  </p>
                ) : filteredPersonnel.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No personnel match your search.
                  </p>
                ) : (
                  filteredPersonnel.map((person) => (
                    <div key={person.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={person.id}
                        checked={selectedPersonnel.includes(person.id)}
                        onCheckedChange={() => handlePersonToggle(person.id)}
                      />
                      <Label
                        htmlFor={person.id}
                        className="cursor-pointer flex-1"
                      >
                        {person.unit} {person.rank} {person.name}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Closing Message */}
          <div className="space-y-2">
            <Label htmlFor="closing">Closing Message</Label>
            <Textarea
              id="closing"
              value={closingMessage}
              onChange={(e) => setClosingMessage(e.target.value)}
              placeholder="e.g., Thank you Trainers."
              rows={2}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Generate Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}