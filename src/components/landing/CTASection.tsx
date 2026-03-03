import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 lg:py-28 bg-warm-overlay">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-6">
            Mari Bertumbuh Bersama dalam{" "}
            <span className="text-gradient-gold">Kasih Kristus</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Kami mengundang Anda untuk menjadi bagian dari komunitas iman kami.
            Bersama-sama, kita melangkah dalam terang dan kasih.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              className="text-base"
              onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
            >
              Mulai Bergabung
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base"
              onClick={() => document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" })}
            >
              Hubungi Kami
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
