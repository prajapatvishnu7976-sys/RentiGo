import React from "react";
import { Link } from "react-router-dom";
import {
  Car, Mail, Phone, MapPin, Send,
  Shield, Award, Clock, Heart,
} from "lucide-react";
import {
  FaFacebookF, FaTwitter, FaInstagram,
  FaLinkedinIn, FaYoutube, FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Our Pricing", href: "/pricing" },
      { label: "Rental Cities", href: "/rental-cities" },
    ],
    Services: [
      { label: "Car Rentals", href: "/vehicles?type=4W" },
      { label: "Bike Rentals", href: "/vehicles?type=2W" },
      { label: "Taxi Service", href: "/vehicles?category=Taxi" },
      { label: "Monthly Plans", href: "/pricing" },
    ],
    Support: [
      { label: "Help Center", href: "/contact" },
      { label: "Safety", href: "/about" },
      { label: "Terms of Service", href: "/about" },
      { label: "Privacy Policy", href: "/about" },
    ],
    Popular: [
      { label: "Rent in Ahmedabad", href: "/city/ahmedabad" },
      { label: "Rent in Mumbai", href: "/city/mumbai" },
      { label: "Rent in Bangalore", href: "/city/bangalore" },
      { label: "Rent in Delhi", href: "/city/delhi" },
    ],
  };

  const socialLinks = [
    { Icon: FaFacebookF, href: "#", label: "Facebook", color: "hover:bg-blue-600" },
    { Icon: FaTwitter, href: "#", label: "Twitter", color: "hover:bg-sky-500" },
    { Icon: FaInstagram, href: "#", label: "Instagram", color: "hover:bg-pink-600" },
    { Icon: FaLinkedinIn, href: "#", label: "LinkedIn", color: "hover:bg-blue-700" },
    { Icon: FaYoutube, href: "#", label: "YouTube", color: "hover:bg-red-600" },
    { Icon: FaWhatsapp, href: "#", label: "WhatsApp", color: "hover:bg-green-600" },
  ];

  const trustBadges = [
    { icon: Shield, text: "100% Secure" },
    { icon: Award, text: "Verified Fleet" },
    { icon: Clock, text: "24/7 Support" },
  ];

  return (
    <footer className="bg-secondary-900 text-white mt-20 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-1 gradient-bg" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="container-app relative z-10">

        {/* ── Newsletter Section ───────────── */}
        <div className="py-12 border-b border-secondary-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2 font-heading">
                Subscribe to our <span className="gradient-text">Newsletter</span>
              </h3>
              <p className="text-secondary-400">
                Get exclusive deals, latest offers, and updates directly in your inbox
              </p>
            </div>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-secondary-800 border border-secondary-700 rounded-xl text-white placeholder-secondary-500 focus:outline-none focus:border-primary-500"
              />
              <button type="submit" className="btn-primary px-6">
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* ── Main Footer ────────────────────── */}
        <div className="py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">

          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-bg rounded-xl flex-center shadow-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold font-heading text-white block leading-none">
                  RentiGo
                </span>
                <p className="text-[10px] text-secondary-400 font-medium">
                  Premium Rentals
                </p>
              </div>
            </Link>

            <p className="text-secondary-400 text-sm leading-relaxed mb-6 max-w-sm">
              Your trusted partner for premium vehicle rentals across India.
              Cars, bikes, and scooters at unbeatable prices, with hassle-free booking.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-secondary-800 px-3 py-1.5 rounded-lg"
                >
                  <badge.icon className="w-3.5 h-3.5 text-primary-400" />
                  <span className="text-xs font-medium text-secondary-300">
                    {badge.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-secondary-300">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:support@rentigo.com" className="hover:text-primary-400 transition-colors">
                  support@rentigo.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-secondary-300">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+918000000000" className="hover:text-primary-400 transition-colors">
                  +91 80000 00000
                </a>
              </div>
              <div className="flex items-start gap-3 text-secondary-300">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-white mb-4 font-heading text-sm uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-secondary-400 hover:text-primary-400 text-sm transition-colors inline-flex items-center gap-1 group"
                    >
                      <span className="w-1 h-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ─────────────────────── */}
        <div className="border-t border-secondary-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-secondary-400 text-sm flex items-center gap-1">
            © {currentYear}{" "}
            <span className="gradient-text font-bold">RentiGo</span>. All rights reserved.
            Made with <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" /> in India
          </p>

          <div className="flex items-center gap-2">
            {socialLinks.map(({ Icon, href, label, color }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`w-9 h-9 rounded-lg bg-secondary-800 ${color} flex-center transition-all duration-200 hover:scale-110 hover:text-white`}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;