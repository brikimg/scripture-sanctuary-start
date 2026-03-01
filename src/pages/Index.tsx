import VerseOfTheDay from "@/components/VerseOfTheDay";
import WritingProjects from "@/components/WritingProjects";
import DailyDiary from "@/components/DailyDiary";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {/* Header */}
        <header className="text-center space-y-2 pb-2">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground tracking-tight">
            Daily Bread
          </h1>
          <p className="text-muted-foreground font-sans text-lg">
            Your daily companion for Scripture, writing & reflection
          </p>
          <div className="mx-auto w-24 h-px bg-gold/60 mt-4" />
        </header>

        <VerseOfTheDay />

        <div className="grid md:grid-cols-2 gap-8">
          <WritingProjects />
          <DailyDiary />
        </div>

        <footer className="text-center text-sm text-muted-foreground pt-6 pb-4 border-t border-border">
          <p className="font-serif italic">"Your word is a lamp for my feet, a light on my path." — Psalm 119:105</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
