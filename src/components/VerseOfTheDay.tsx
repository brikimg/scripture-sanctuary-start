import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, ImageIcon } from "lucide-react";

interface VerseData {
  reference: string;
  text: string;
}

const FALLBACK_VERSES: VerseData[] = [
  { reference: "Psalm 46:10", text: "Be still, and know that I am God." },
  { reference: "Proverbs 3:5-6", text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight." },
  { reference: "Isaiah 41:10", text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand." },
  { reference: "Philippians 4:13", text: "I can do all this through him who gives me strength." },
  { reference: "Romans 8:28", text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
  { reference: "Jeremiah 29:11", text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future." },
  { reference: "Matthew 11:28", text: "Come to me, all you who are weary and burdened, and I will give you rest." },
];

function getDailyFallback(): VerseData {
  const day = Math.floor(Date.now() / 86400000) % FALLBACK_VERSES.length;
  return FALLBACK_VERSES[day];
}

export default function VerseOfTheDay() {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fetchVerse = async () => {
    setLoading(true);
    try {
      // Use bible-api.com with a curated list of verses
      const verses = [
        "Psalm+23:1-3", "Proverbs+3:5-6", "Isaiah+40:31", "Jeremiah+29:11",
        "Philippians+4:6-7", "Romans+8:28", "Matthew+11:28-30", "John+3:16",
        "Psalm+46:10", "Isaiah+41:10", "2+Timothy+1:7", "Joshua+1:9",
        "Psalm+119:105", "Lamentations+3:22-23", "Psalm+27:1",
      ];
      const dayIndex = Math.floor(Date.now() / 86400000) % verses.length;
      const res = await fetch(`https://bible-api.com/${verses[dayIndex]}`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setVerse({ reference: data.reference, text: data.text.trim() });
    } catch {
      setVerse(getDailyFallback());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVerse(); }, []);

  const generateImage = () => {
    if (!verse || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 800;
    canvas.height = 450;

    // Warm gradient background
    const grad = ctx.createLinearGradient(0, 0, 800, 450);
    grad.addColorStop(0, "#f5e6d3");
    grad.addColorStop(0.5, "#ede0d4");
    grad.addColorStop(1, "#d5c4a1");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 450);

    // Decorative border
    ctx.strokeStyle = "#b08d57";
    ctx.lineWidth = 3;
    ctx.strokeRect(25, 25, 750, 400);
    ctx.strokeStyle = "#c9a96e";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 740, 390);

    // Cross ornament at top center
    ctx.strokeStyle = "#8b7355";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(400, 45);
    ctx.lineTo(400, 75);
    ctx.moveTo(388, 55);
    ctx.lineTo(412, 55);
    ctx.stroke();

    // Verse text
    ctx.fillStyle = "#3d2b1f";
    ctx.textAlign = "center";
    ctx.font = "italic 20px 'Georgia', serif";
    
    const words = verse.text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const test = line + word + " ";
      ctx.font = "italic 20px 'Georgia', serif";
      if (ctx.measureText(test).width > 680 && line) {
        lines.push(line.trim());
        line = word + " ";
      } else {
        line = test;
      }
    }
    if (line.trim()) lines.push(line.trim());

    const startY = 225 - (lines.length * 15);
    lines.forEach((l, i) => {
      ctx.font = "italic 20px 'Georgia', serif";
      ctx.fillText(`"${i === 0 ? "" : ""}${l}${i === lines.length - 1 ? "" : ""}`, 400, startY + i * 32);
    });

    // Add quotes around the whole thing
    ctx.font = "italic 36px 'Georgia', serif";
    ctx.fillStyle = "#b08d57";
    ctx.fillText("\u201C", 60, startY + 5);
    ctx.fillText("\u201D", 740, startY + (lines.length - 1) * 32 + 5);

    // Reference
    ctx.font = "bold 18px 'Georgia', serif";
    ctx.fillStyle = "#6b5744";
    ctx.fillText(`— ${verse.reference}`, 400, startY + lines.length * 32 + 30);

    setShowImage(true);
  };

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `verse-${verse?.reference?.replace(/\s/g, "-")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <section>
      <h2 className="font-serif text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
        ✦ Verse of the Day
      </h2>
      <Card className="bg-parchment border-border shadow-md">
        <CardContent className="p-8">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : verse ? (
            <div className="space-y-4">
              <blockquote className="font-serif text-xl md:text-2xl italic leading-relaxed text-foreground">
                "{verse.text}"
              </blockquote>
              <p className="text-right font-serif text-lg font-semibold text-primary">
                — {verse.reference}
              </p>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={generateImage} className="gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Create Image
                </Button>
                {showImage && (
                  <Button variant="outline" size="sm" onClick={downloadImage} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
              <canvas ref={canvasRef} className={showImage ? "w-full max-w-2xl rounded-lg border border-border mt-3" : "hidden"} />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
