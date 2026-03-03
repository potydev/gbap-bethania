import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const values = [
  "Ibadah yang berpusat pada Firman Tuhan",
  "Komunitas yang saling mengasihi dan mendukung",
  "Pelayanan kepada sesama dengan hati yang tulus",
  "Pertumbuhan iman melalui pemuridan",
];

const AboutSection = () => {
  return (
    <section id="tentang" className="py-20 lg:py-28 bg-primary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent text-sm font-semibold uppercase tracking-widest">
              Tentang Kami
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mt-3 mb-6">
              Gereja yang Hidup dan Bertumbuh
            </h2>
            <p className="text-primary-foreground/75 text-lg leading-relaxed mb-8">
              GBAP Bethania adalah komunitas iman yang berdedikasi untuk menyembah
              Tuhan, melayani sesama, dan membuat murid Kristus. Selama lebih dari
              25 tahun, kami telah menjadi rumah rohani bagi ratusan keluarga.
            </p>

            <div className="space-y-4">
              {values.map((value) => (
                <div key={value} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <span className="text-primary-foreground/80">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 p-8 lg:p-10">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-display font-bold text-accent mb-2">
                    Visi Kami
                  </div>
                  <p className="text-primary-foreground/70 text-lg leading-relaxed mt-4">
                    "Menjadi gereja yang memberkati bangsa melalui kasih Kristus,
                    menghasilkan murid-murid yang setia, dan menjadi terang bagi
                    dunia."
                  </p>
                </div>
                <div className="h-px bg-primary-foreground/10" />
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-display font-bold text-accent">12</div>
                    <div className="text-sm text-primary-foreground/60 mt-1">Kelompok Sel</div>
                  </div>
                  <div>
                    <div className="text-3xl font-display font-bold text-accent">8</div>
                    <div className="text-sm text-primary-foreground/60 mt-1">Tim Pelayanan</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
