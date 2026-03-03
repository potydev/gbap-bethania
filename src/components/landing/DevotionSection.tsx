import { useState, useEffect } from "react";
import { getTodayDevotion, type Devotion } from "@/lib/store";
import { BookOpen, Calendar, User, Loader2 } from "lucide-react";

const DevotionSection = () => {
  const [devotion, setDevotion] = useState<Devotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTodayDevotion();
        setDevotion(data);
      } catch (error) {
        console.error("Error loading devotion:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  if (!devotion) {
    return null; // Don't show section if no devotion available
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm font-medium">Renungan Hari Ini</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {devotion.title}
          </h2>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(devotion.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{devotion.author}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-card border border-border p-8 md:p-12 shadow-soft">
            {/* Scripture */}
            <div className="mb-8 p-6 rounded-xl bg-accent/5 border-l-4 border-accent">
              <p className="text-lg md:text-xl font-serif text-foreground leading-relaxed italic">
                "{devotion.scripture}"
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {devotion.content}
              </div>
            </div>

            {/* Bottom decoration */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>Kiranya firman Tuhan memberkati hari Anda</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevotionSection;
