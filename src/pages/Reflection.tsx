import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { BookOpen, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReflectionEntry {
  date: string; // YYYY-MM-DD
  content: string;
  createdAt: string;
}

const STORAGE_KEY = "kaizen-reflections";

const Reflection = () => {
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setEntries(saved);
    const todayEntry = saved.find((e: ReflectionEntry) => e.date === today);
    if (todayEntry) setContent(todayEntry.content);
  }, [today]);

  const saveReflection = () => {
    const updated = [...entries];
    const idx = updated.findIndex((e) => e.date === today);
    const entry: ReflectionEntry = { date: today, content, createdAt: new Date().toISOString() };
    if (idx >= 0) {
      updated[idx] = entry;
    } else {
      updated.unshift(entry);
    }
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast({ title: "Reflection saved", description: "You can revisit it anytime in Growth" });
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-6">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-growth flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Daily Reflection
          </h1>
          <Button variant="outline" size="sm" className="border-primary text-primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        <Card className="p-6 shadow-zen bg-card/80 backdrop-blur-sm animate-fade-in">
          <p className="text-zen mb-4">Write freely to declutter your mind. This stays private on your device.</p>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How did today go? What did you learn? What will you do differently tomorrow?"
            className="min-h-[160px] bg-background/50 border-primary/20 focus:border-primary"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={saveReflection} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
          </div>
        </Card>

        {entries.length > 0 && (
          <div className="mt-6 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Past reflections</h2>
            {entries.map((e) => (
              <Card key={e.createdAt} className="p-4 bg-card/70">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{e.date}</span>
                  <span className="text-xs text-muted-foreground">Saved</span>
                </div>
                <p className="text-zen text-sm whitespace-pre-wrap line-clamp-3">{e.content}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reflection;