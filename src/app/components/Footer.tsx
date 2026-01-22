"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Clock, UtensilsCrossed } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "La Carta", href: "/carta" },
    { name: "Promociones", href: "/promociones" },
    { name: "Reservas", href: "/reservas" },
  ];

  const contactInfo = {
    address: "Av. Principal 123, Ica, Perú",
    phone: "+51 933 739 769",
    email: "reservas@puertoricorestobar.com",
    hours: "Lun - Dom: 6:00 PM - 3:00 AM"
  };

  const socialLinks = [
    { 
      name: "Facebook", 
      href: "https://www.facebook.com/RestobarPuertoricoICA", 
      icon: <Facebook size={20} />
    },
    { 
      name: "Instagram", 
      href: "https://www.instagram.com/puertoricorestobar.ica", 
      icon: <Instagram size={20} />
    },
    // Puedes agregar TikTok si tienen
  ];

  return (
    <footer className="bg-[#050505] text-gray-300 border-t border-white/5 relative z-10">
      {/* Fondo sutil para dar profundidad */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto py-16 px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* 1. BRANDING & INFO */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                    <UtensilsCrossed size={20} />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tighter">
                    PUERTO<span className="text-orange-500">RICO</span>
                </h3>
            </div>
            
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
              El punto de encuentro en Ica. Las mejores hamburguesas, alitas y tragos de autor en un ambiente diseñado para celebrar.
            </p>

            {/* Libro de Reclamaciones */}
            <div className="pt-2">
                <Link href="/libro-reclamaciones" className="inline-block group">
                    <div className="bg-white rounded-lg p-2 max-w-[140px] hover:opacity-90 transition-opacity">
                        <Image
                            src="https://res.cloudinary.com/dhuggiq9q/image/upload/v1768675637/libro_de_reclamaciones_nx7tfc.jpg"
                            alt="Libro de Reclamaciones"
                            width={140}
                            height={50}
                            className="object-contain"
                        />
                    </div>
                </Link>
            </div>
          </div>

          {/* 2. ENLACES + CONTACTO + SOCIAL */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">

            {/* Enlaces Rápidos */}
            <div>
              <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  Menú
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              </h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-orange-500 hover:pl-2 transition-all duration-300 block text-sm font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  Visítanos
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              </h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 group">
                  <MapPin size={18} className="text-orange-500 mt-0.5 flex-shrink-0 group-hover:animate-bounce" />
                  <span className="text-gray-400 group-hover:text-white transition-colors">{contactInfo.address}</span>
                </li>

                <li className="flex items-center gap-3 group">
                  <Clock size={18} className="text-orange-500 flex-shrink-0" />
                  <span className="text-gray-400 group-hover:text-white transition-colors">{contactInfo.hours}</span>
                </li>

                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-orange-500 flex-shrink-0" />
                  <a 
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} 
                    className="text-gray-400 hover:text-orange-500 transition-colors font-medium"
                  >
                    {contactInfo.phone}
                  </a>
                </li>
              </ul>
            </div>

            {/* Redes Sociales */}
            <div>
              <h4 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  Social
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.name}
                    className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 text-gray-400 rounded-xl
                               hover:bg-orange-600 hover:border-orange-500 hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs text-center sm:text-left">
            &copy; {currentYear} Puerto Rico Restobar. Hecho con 🔥 en Ica.
          </p>

          <div className="flex space-x-6 text-xs text-zinc-500">
            <Link href="/terminos" className="hover:text-orange-500 transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-orange-500 transition-colors">Privacidad</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}