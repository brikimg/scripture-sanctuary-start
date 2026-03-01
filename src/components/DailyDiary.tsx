import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DiaryEntry, DailyEntries } from "@/types";
import { CalendarIcon, Plus, Trash2, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DailyDiary() {
  const [entries, setEntries] = useLocalStorage<DailyEntries>("bible-diary", {});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newNote, setNewNote] = useState("");
  const [showInput, setShowInput] = useState(false);

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const dayEntries = (entries[dateKey] || []).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const addEntry = () => {
    if (!newNote.trim()) return;
    const entry: DiaryEntry = {
      id: crypto.randomUUID(),
      text: newNote.trim(),
      timestamp: new Date().toISOString(),
    };
    setEntries({
      ...entries,
      [dateKey]: [...(entries[dateKey] || []), entry],
    });
    setNewNote("");
    setShowInput(false);
  };

  const removeEntry = (id: string) => {
    const updated = (entries[dateKey] || []).filter(e => e.id !== id);
    if (updated.length === 0) {
      const { [dateKey]: _, ...rest } = entries;
      setEntries(rest);
    } else {
      setEntries({ ...entries, [dateKey]: updated });
    }
  };

  const isToday = format(new Date(), "yyyy-MM-dd") === dateKey;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
          <PenLine className="h-5 w-5 text-gold" /> Daily Notes
        </h2>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, "MMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <Button size="sm" onClick={() => setShowInput(!showInput)} className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Note
          </Button>
        </div>
      </div>

      {showInput && (
        <Card className="mb-3 bg-card border-border">
          <CardContent className="p-4 space-y-3">
            <Textarea
              placeholder="What's on your heart today?"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setShowInput(false); setNewNote(""); }}>Cancel</Button>
              <Button size="sm" onClick={addEntry}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {dayEntries.length === 0 ? (
        <Card className="border-dashed border-2 border-border bg-card/50">
          <CardContent className="p-8 text-center text-muted-foreground">
            <PenLine className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p>No notes for {isToday ? "today" : format(selectedDate, "MMMM d, yyyy")}.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {dayEntries.map(entry => (
            <Card key={entry.id} className="bg-card border-border">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">
                    {format(new Date(entry.timestamp), "h:mm a")}
                  </p>
                  <p className="whitespace-pre-wrap">{entry.text}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeEntry(entry.id)} className="shrink-0">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
