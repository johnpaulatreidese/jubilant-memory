import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Person } from "../types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface PersonnelManagerProps {
  personnel: Person[];
  onAddPerson: (person: Omit<Person, "id">) => void;
  onUpdatePerson: (id: string, person: Omit<Person, "id">) => void;
  onDeletePerson: (id: string) => void;
}

export function PersonnelManager({
  personnel,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
}: PersonnelManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState({
    unit: "",
    rank: "",
    name: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPerson) {
      onUpdatePerson(editingPerson.id, formData);
      setEditingPerson(null);
    } else {
      onAddPerson(formData);
      setIsAddDialogOpen(false);
    }
    setFormData({ unit: "", rank: "", name: "" });
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      unit: person.unit,
      rank: person.rank,
      name: person.name,
    });
  };

  const handleCancel = () => {
    setEditingPerson(null);
    setFormData({ unit: "", rank: "", name: "" });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Personnel Roster</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Personnel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Personnel</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="e.g., L101"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank</Label>
                  <Input
                    id="rank"
                    placeholder="e.g., OCT"
                    value={formData.rank}
                    onChange={(e) =>
                      setFormData({ ...formData, rank: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value.toUpperCase() })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Personnel
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unit</TableHead>
                <TableHead>Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnel.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No personnel added yet
                  </TableCell>
                </TableRow>
              ) : (
                personnel.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>
                      {editingPerson?.id === person.id ? (
                        <Input
                          value={formData.unit}
                          onChange={(e) =>
                            setFormData({ ...formData, unit: e.target.value })
                          }
                          className="h-8"
                        />
                      ) : (
                        person.unit
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPerson?.id === person.id ? (
                        <Input
                          value={formData.rank}
                          onChange={(e) =>
                            setFormData({ ...formData, rank: e.target.value })
                          }
                          className="h-8"
                        />
                      ) : (
                        person.rank
                      )}
                    </TableCell>
                    <TableCell>
                      {editingPerson?.id === person.id ? (
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value.toUpperCase() })
                          }
                          className="h-8"
                        />
                      ) : (
                        person.name
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingPerson?.id === person.id ? (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={handleSubmit}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(person)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDeletePerson(person.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
