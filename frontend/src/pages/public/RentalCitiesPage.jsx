import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search, MapPin, Car, Bike, ArrowRight, X,
  Grid3x3, List, TrendingUp, Sparkles, Star,
} from "lucide-react";
import { POPULAR_CITIES, ALL_CITIES } from "../../utils/vehicleImages";

const RentalCitiesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");

  // Gradient colors
  const gradients = [
    "from-orange-500 to-red-500",
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-cyan-500",
    "from-rose-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-lime-500 to-green-500",
  ];

  // Get unique sorted cities
  const uniqueCities = useMemo(() => {
    return [...new Set(ALL_CITIES)].sort();
  }, []);

  // Filter cities
  const filteredCities = useMemo(() => {
    let cities = uniqueCities;

    if (selectedLetter) {
      cities = cities.filter((c) => c.charAt(0).toUpperCase() === selectedLetter);
    }

    if (searchQuery) {
      cities = cities.filter((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return cities;
  }, [searchQuery, selectedLetter, uniqueCities]);

  // Alphabet for filter
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="overflow-hidden bg-gray-50 min-h-screen">

      {/* ═════════ PREMIUM HERO BANNER ═════════ */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-primary-800 to-purple-900" />

        {/* Animated Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        {/* Content */}
        <div className="relative z-10 py-20 md:py-28">
          <div className="container-app text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/30 px-5 py-2 rounded-full mb-6 shadow-glow"
              >
                <div className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
                <MapPin className="w-4 h-4 text-accent-300" />
                <span className="text-white text-sm font-bold uppercase tracking-wider">
                  500+ Cities Available
                </span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading text-white leading-tight">
                Vehicle Rentals
                <br />
                <span className="bg-gradient-to-r from-accent-300 via-yellow-200 to-accent-300 bg-clip-text text-transparent">
                  Across India
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-white/85 max-w-3xl mx-auto mb-10 leading-relaxed">
                Find verified car, bike & taxi rentals in{" "}
                <span className="font-bold text-accent-300">500+ cities</span>.
                <br className="hidden md:block" />
                From metros to small towns — we've got you covered.
              </p>

              {/* Premium Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-2xl mx-auto relative"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent-500/50 to-primary-500/50 blur-xl opacity-50 rounded-2xl" />

                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500" />
                  <input
                    type="text"
                    placeholder="Search your city (Mumbai, Delhi, Ahmedabad...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-14 py-5 bg-transparent focus:outline-none text-secondary-900 placeholder-secondary-400 text-base font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-secondary-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-secondary-500" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-12 pt-8 border-t border-white/10"
              >
                {[
                  { number: "500+", label: "Cities" },
                  { number: "5000+", label: "Vehicles" },
                  { number: "20K+", label: "Happy Users" },
                  { number: "4.8★", label: "Rating" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-xs md:text-sm text-white/70 font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full h-16 fill-gray-50">
            <path d="M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,37.3C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,80L1380,80C1320,80,1200,80,1080,80C960,80,840,80,720,80C600,80,480,80,360,80C240,80,120,80,60,80L0,80Z"></path>
          </svg>
        </div>
      </section>

      {/* ═════════ POPULAR CITIES ═════════ */}
      <section className="section pt-8">
        <div className="container-app">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold">🔥 Top Popular Cities</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {POPULAR_CITIES.slice(0, 12).map((city, i) => {
                const gradient = gradients[i % gradients.length];
                return (
                  <motion.div
                    key={city.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ y: -5, scale: 1.03 }}
                    className={`bg-gradient-to-br ${gradient} p-4 rounded-xl text-white cursor-pointer shadow-md hover:shadow-2xl transition-all group relative overflow-hidden`}
                    onClick={() => navigate(`/city/${city.id}`)}
                  >
                    <div className="absolute top-0 right-0 opacity-10 text-4xl">🏙️</div>
                    <div className="relative z-10">
                      <MapPin className="w-4 h-4 mb-1.5 opacity-90" />
                      <h3 className="font-bold text-sm mb-0.5">{city.name}</h3>
                      <p className="text-[10px] text-white/80">{city.state}</p>
                      <p className="text-[10px] mt-1 bg-white/20 backdrop-blur-sm px-1.5 py-0.5 rounded inline-block">
                        {city.vehicles}+ vehicles
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ ALPHABET FILTER ═════════ */}
      <section className="container-app mb-6">
        <div className="bg-white rounded-2xl shadow-md p-4">
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm font-semibold text-secondary-700">Browse by letter:</p>
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter("")}
                className="text-xs text-primary-600 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter === selectedLetter ? "" : letter)}
                className={`w-8 h-8 rounded-lg font-bold text-sm transition-all ${
                  selectedLetter === letter
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-gray-100 text-secondary-700 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ ALL CITIES ═════════ */}
      <section className="container-app pb-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">All Cities</h2>
            <p className="text-sm text-secondary-500 mt-1">
              {filteredCities.length} cities available
              {selectedLetter && ` starting with "${selectedLetter}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          </div>
        </div>

        {filteredCities.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">No cities found</h3>
            <p className="text-secondary-500 mb-4">Try a different search term</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLetter("");
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredCities.map((city, i) => {
              const gradient = gradients[i % gradients.length];
              return (
                <motion.div
                  key={city}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.01, 0.3) }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className={`bg-gradient-to-br ${gradient} p-4 rounded-xl text-white cursor-pointer shadow-md hover:shadow-2xl transition-all group relative overflow-hidden`}
                  onClick={() => navigate(`/city/${city.toLowerCase()}`)}
                >
                  <div className="absolute top-0 right-0 opacity-10 text-4xl group-hover:scale-125 transition-transform">
                    🏙️
                  </div>
                  <div className="relative z-10">
                    <MapPin className="w-4 h-4 mb-1.5 opacity-90" />
                    <h3 className="font-bold text-sm mb-1 truncate">{city}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-white/80 mt-2">
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      <span>Explore</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* ═════════ CTA ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="gradient-bg rounded-3xl p-12 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 text-9xl">🌆</div>
              <div className="absolute bottom-10 right-10 text-9xl">🚗</div>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
                Don't See Your City?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                We're expanding fast! Contact us to request rental service in your city.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-xl">
                  Request Your City
                </Link>
                <Link to="/vehicles" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 btn-lg border border-white/30">
                  Browse Vehicles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RentalCitiesPage;