import { motion } from "framer-motion";
import { Clock, MapPin, CalendarDays } from "lucide-react";

const schedules = [
  {
    day: "Minggu",
    services: [
      { name: "Ibadah Pagi I", time: "06:30 - 08:00", location: "Gedung Utama" },
      { name: "Ibadah Pagi II", time: "09:00 - 10:30", location: "Gedung Utama" },
      { name: "Ibadah Sore", time: "17:00 - 18:30", location: "Gedung Utama" },
    ],
  },
  {
    day: "Rabu",
    services: [
      { name: "Ibadah Doa", time: "18:30 - 20:00", location: "Aula Serbaguna" },
    ],
  },
  {
    day: "Jumat",
    services: [
      { name: "Ibadah Pemuda", time: "19:00 - 21:00", location: "Aula Pemuda" },
    ],
  },
  {
    day: "Sabtu",
    services: [
      { name: "Sekolah Minggu", time: "09:00 - 11:00", location: "Ruang Anak" },
      { name: "Latihan Paduan Suara", time: "15:00 - 17:00", location: "Gedung Utama" },
    ],
  },
];

const ScheduleSection = () => {
  return (
    <section id="jadwal" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Jadwal Ibadah
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-4">
            Bergabung dalam Ibadah
          </h2>
          <p className="text-muted-foreground text-lg">
            Kami menantikan kehadiran Anda di setiap ibadah dan kegiatan gereja.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {schedules.map((schedule, idx) => (
            <motion.div
              key={schedule.day}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-xl bg-card border border-border p-6 hover:shadow-soft transition-shadow"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {schedule.day}
                </h3>
              </div>

              <div className="space-y-4">
                {schedule.services.map((service) => (
                  <div
                    key={service.name}
                    className="flex flex-col gap-1 pl-4 border-l-2 border-accent/30"
                  >
                    <span className="font-semibold text-foreground text-sm">
                      {service.name}
                    </span>
                    <div className="flex items-center gap-4 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {service.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {service.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
