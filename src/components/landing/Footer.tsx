import { Church, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="kontak" className="bg-primary py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Church className="h-6 w-6 text-accent" />
              <span className="font-display text-lg font-bold text-primary-foreground">
                GBAP Bethania
              </span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Gereja yang hidup dan bertumbuh dalam kasih Kristus, melayani
              jemaat dan masyarakat dengan sepenuh hati.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-primary-foreground mb-4 uppercase tracking-wider">
              Menu
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Beranda", href: "#beranda" },
                { label: "Tentang Kami", href: "#tentang" },
                { label: "Jadwal Ibadah", href: "#jadwal" },
                { label: "Pelayanan", href: "#pelayanan" },
                { label: "Dashboard", href: "/login" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-semibold text-primary-foreground mb-4 uppercase tracking-wider">
              Pelayanan
            </h4>
            <ul className="space-y-2.5">
              {["Kelompok Sel", "Sekolah Minggu", "Pemuda", "Paduan Suara", "Diakonia"].map(
                (link) => (
                  <li key={link}>
                    <a
                      href="#pelayanan"
                      className="text-sm text-primary-foreground/60 hover:text-accent transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-primary-foreground mb-4 uppercase tracking-wider">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm text-primary-foreground/60">
                  Jl. Gereja No. 123, Jakarta Selatan
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-accent shrink-0" />
                <span className="text-sm text-primary-foreground/60">
                  (021) 1234-5678
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-accent shrink-0" />
                <span className="text-sm text-primary-foreground/60">
                  info@gkianugerah.id
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center">
          <p className="text-sm text-primary-foreground/40">
            © 2026 GBAP Bethania. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
