import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { WritingProject } from "@/types";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "In Progress": "bg-gold/20 text-gold-foreground border-gold/40",
  "Completed": "bg-primary/15 text-primary border-primary/30",
  "On Hold": "bg-muted text-muted-foreground border-border",
};

export default function WritingProjects() {
  const [projects, setProjects] = useLocalStorage<WritingProject[]>("bible-projects", []);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<WritingProject | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<WritingProject["status"]>("In Progress");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("In Progress");
    setEditing(null);
  };

  const openNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (p: WritingProject) => {
    setEditing(p);
    setTitle(p.title);
    setDescription(p.description);
    setStatus(p.status);
    setDialogOpen(true);
  };

  const save = () => {
    if (!title.trim()) return;
    if (editing) {
      setProjects(projects.map(p =>
        p.id === editing.id ? { ...p, title, description, status } : p
      ));
    } else {
      setProjects([...projects, {
        id: crypto.randomUUID(),
        title,
        description,
        status,
        createdAt: new Date().toISOString(),
      }]);
    }
    setDialogOpen(false);
    resetForm();
  };

  const remove = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gold" /> Writing Projects
        </h2>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openNew} className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">{editing ? "Edit Project" : "New Project"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Input placeholder="Project title" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
              <Select value={status} onValueChange={(v) => setStatus(v as WritingProject["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={save} className="w-full">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <Card className="border-dashed border-2 border-border bg-card/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>No projects yet. Add your first writing project!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {projects.map(p => (
            <Card key={p.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif font-semibold text-lg truncate">{p.title}</h3>
                    <Badge variant="outline" className={STATUS_COLORS[p.status]}>{p.status}</Badge>
                  </div>
                  {p.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
