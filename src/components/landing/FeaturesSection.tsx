import { motion } from "framer-motion";
import { Users, CalendarDays, BookOpen, Heart, Music, Globe } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Manajemen Jemaat",
    description: "Kelola data anggota jemaat dengan mudah dan terorganisir dalam satu platform.",
  },
  {
    icon: CalendarDays,
    title: "Jadwal Ibadah",
    description: "Atur jadwal ibadah, kegiatan, dan acara gereja secara efisien.",
  },
  {
    icon: BookOpen,
    title: "Kelompok Sel",
    description: "Pantau dan kelola kelompok-kelompok sel untuk pertumbuhan rohani jemaat.",
  },
  {
    icon: Heart,
    title: "Pelayanan Diakonia",
    description: "Koordinasikan pelayanan kasih dan bantuan kepada yang membutuhkan.",
  },
  {
    icon: Music,
    title: "Tim Pelayanan",
    description: "Atur jadwal dan koordinasi tim worship, multimedia, dan pelayanan lainnya.",
  },
  {
    icon: Globe,
    title: "Keuangan & Persembahan",
    description: "Catat dan kelola persembahan, perpuluhan, dan laporan keuangan gereja.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="pelayanan" className="py-20 lg:py-28 bg-warm-overlay">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Fitur Lengkap
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Semua yang Gereja Anda Butuhkan
          </h2>
          <p className="text-muted-foreground text-lg">
            Platform manajemen gereja terpadu untuk mengelola jemaat, ibadah, 
            pelayanan, dan keuangan dalam satu tempat.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group p-6 lg:p-8 rounded-xl bg-card border border-border hover:border-accent/30 hover:shadow-elevated transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
