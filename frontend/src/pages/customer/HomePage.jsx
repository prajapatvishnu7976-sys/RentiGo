import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, Car, Shield, Clock, Award,
  ArrowRight, Star, Users, MapPin, Zap,
  Phone, Headphones, User,
  Sparkles, TrendingUp, CheckCircle2,
} from "lucide-react";
import useVehicleStore from "../../store/vehicleStore";
import { POPULAR_CITIES } from "../../utils/vehicleImages";
import toast from "react-hot-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const { fetchVehicles } = useVehicleStore();

  const [quickBooking, setQuickBooking] = useState({
    name: "",
    phone: "",
    vehicle: "",
    pickupDate: "",
  });

  useEffect(() => {
    fetchVehicles({ limit: 6, page: 1 });
  }, []);

  const handleQuickBooking = (e) => {
    e.preventDefault();
    if (!quickBooking.name || !quickBooking.phone || !quickBooking.vehicle || !quickBooking.pickupDate) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Redirecting to vehicles...");
    setTimeout(() => {
      navigate(`/vehicles?type=${quickBooking.vehicle}`);
    }, 800);
  };

  // 🔥 Fleet categories - Rentigo style (Our Fleet section)
  const fleetCategories = [
    {
      name: "SUV Car",
      desc: "Comfortable rides for families & city travel.",
      image: "/vehicles/extra/suv.jpg",
      link: "/vehicles?type=4W",
    },
    {
      name: "Bike",
      desc: "Quick & budget-friendly option for solo rides.",
      image: "/vehicles/bikes/splendor.png",
      link: "/vehicles?type=2W",
    },
    {
      name: "Activa",
      desc: "Easy rides for short distances & daily use.",
      image: "/vehicles/scooters/activa.png",
      link: "/vehicles?type=2W&category=Scooter",
    },
    {
      name: "Taxi",
      desc: "Reliable & professional drivers for any trip.",
      image: "/vehicles/extra/taxi.png",
      link: "/contact",
    },
  ];

  const features = [
    { icon: Shield, title: "100% Secure", desc: "Protected payments & verified owners", color: "from-emerald-500 to-teal-600" },
    { icon: Zap, title: "Instant Booking", desc: "Book your ride in just 60 seconds", color: "from-violet-500 to-purple-600" },
    { icon: Award, title: "Best Prices", desc: "Guaranteed lowest market prices", color: "from-rose-500 to-pink-600" },
    { icon: Headphones, title: "24/7 Support", desc: "Round the clock customer support", color: "from-sky-500 to-blue-600" },
  ];

  const steps = [
    { num: "01", title: "Search Vehicle", desc: "Browse our wide selection of cars, bikes & scooters", icon: Sparkles },
    { num: "02", title: "Book Instantly", desc: "Choose your dates and complete booking in seconds", icon: Calendar },
    { num: "03", title: "Enjoy Your Ride", desc: "Pick up your vehicle and hit the road!", icon: Car },
  ];

  return (
    <div className="bg-white">

      {/* ═══════════════════════════════════════════
          1. HERO SECTION - Premium with Quick Booking
      ═══════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white overflow-hidden min-h-[85vh] flex items-center">

        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 left-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.1),transparent_50%)]" />
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />

        <div className="container-app relative z-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span>India's #1 Premium Rental Platform</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading leading-tight">
                Book{" "}
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Cars, Bikes & Taxis
                </span>{" "}
                <br />
                with Elegance
              </h1>

              <p className="text-lg text-slate-300 mb-8 max-w-lg leading-relaxed">
                Experience premium rentals with{" "}
                <span className="text-white font-semibold">24/7 support</span>,
                verified vehicles, and instant booking. Your journey begins here.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  to="/vehicles"
                  className="group bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl shadow-violet-500/30 flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Car className="w-5 h-5" />
                  Browse Vehicles
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/pricing"
                  className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 px-8 py-4 rounded-xl font-bold transition-all"
                >
                  View Pricing
                </Link>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 pt-8 border-t border-white/10">
                {[
                  { val: "20K+", label: "Customers" },
                  { val: "5000+", label: "Vehicles" },
                  { val: "500+", label: "Cities" },
                  { val: "4.8★", label: "Rating" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                      {s.val}
                    </p>
                    <p className="text-[10px] md:text-xs text-slate-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT - Quick Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-secondary-900">
                      Quick Booking
                    </h3>
                    <p className="text-xs text-secondary-500">Book in 60 seconds</p>
                  </div>
                </div>

                <form onSubmit={handleQuickBooking} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-secondary-700 mb-1.5 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-violet-600" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={quickBooking.name}
                      onChange={(e) => setQuickBooking({ ...quickBooking, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors text-secondary-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-secondary-700 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-violet-600" />
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={quickBooking.phone}
                      onChange={(e) => setQuickBooking({ ...quickBooking, phone: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors text-secondary-900"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-secondary-700 mb-1.5 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-violet-600" />
                      Select Vehicle Type
                    </label>
                    <select
                      value={quickBooking.vehicle}
                      onChange={(e) => setQuickBooking({ ...quickBooking, vehicle: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors text-secondary-900 bg-white"
                    >
                      <option value="">Choose vehicle...</option>
                      <option value="4W">🚗 Car (SUV / Sedan)</option>
                      <option value="2W">🏍️ Bike / Scooter</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-secondary-700 mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-violet-600" />
                      Pickup Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={quickBooking.pickupDate}
                      onChange={(e) => setQuickBooking({ ...quickBooking, pickupDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-violet-500 transition-colors text-secondary-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:via-indigo-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold shadow-xl shadow-violet-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Confirm Booking
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-secondary-500 pt-2">
                    <Shield className="w-3.5 h-3.5 text-emerald-500" />
                    <span>100% Secure & Encrypted Booking</span>
                  </div>
                </form>
              </div>

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">Today's Bookings</p>
                    <p className="text-lg font-bold text-secondary-900">240+</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          2. OUR FLEET - 4 Cards (Rentigo Style)
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container-app">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Car className="w-4 h-4" />
              Our Fleet
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-3">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Perfect Vehicle
              </span>
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              From budget-friendly scooters to luxury SUVs — we have everything for your journey
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fleetCategories.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-violet-200 transition-all group"
              >
                {/* Image with white bg */}
                <div className="h-52 flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-white">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback if image fails
                      console.error(`Failed to load: ${item.image}`);
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-5 leading-relaxed min-h-[48px]">
                    {item.desc}
                  </p>
                  <Link
                    to={item.link}
                    className="block w-full text-center bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-violet-500/30 transition-all"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          3. OUR SERVICES IN OTHER CITIES
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="container-app">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <MapPin className="w-4 h-4" />
              Our Cities
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading mb-3 flex items-center justify-center gap-3">
              🌍 Our Services in{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Other Cities
              </span>
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              We are expanding our rental services across multiple cities in India
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {POPULAR_CITIES.slice(0, 8).map((city, i) => {
              const gradients = [
                "from-indigo-900 via-purple-900 to-slate-900",
                "from-purple-900 via-pink-900 to-slate-900",
                "from-blue-900 via-indigo-900 to-slate-900",
                "from-emerald-900 via-teal-900 to-slate-900",
                "from-orange-900 via-red-900 to-slate-900",
                "from-cyan-900 via-blue-900 to-slate-900",
                "from-violet-900 via-indigo-900 to-slate-900",
                "from-rose-900 via-pink-900 to-slate-900",
              ];
              const gradient = gradients[i % gradients.length];

              return (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all group"
                >
                  <div className={`h-48 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-40">
                      <div className="absolute top-4 left-6 w-8 h-8 bg-yellow-400 rounded-full blur-md" />
                      <div className="absolute top-8 right-8 w-6 h-6 bg-orange-400 rounded-full blur-md" />
                      <div className="absolute top-16 left-1/3 w-10 h-10 bg-red-400 rounded-full blur-lg" />
                      <div className="absolute top-6 right-1/4 w-4 h-4 bg-pink-400 rounded-full blur-md" />
                      <div className="absolute bottom-8 left-8 w-6 h-6 bg-cyan-400 rounded-full blur-md" />
                      <div className="absolute bottom-12 right-6 w-8 h-8 bg-blue-400 rounded-full blur-lg" />
                      <div className="absolute bottom-4 left-1/2 w-5 h-5 bg-purple-400 rounded-full blur-md" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white z-10">
                        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-90" />
                        <p className="text-2xl font-bold">{city.name}</p>
                        <p className="text-xs text-white/70 mt-1">{city.state}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 text-center">
                    <p className="text-sm text-secondary-600 mb-4 italic min-h-[42px]">
                      {city.desc}
                    </p>
                    <Link
                      to={`/city/${city.id}`}
                      className="block w-full text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all"
                    >
                      Book in {city.name}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/rental-cities"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-indigo-500/30 transition-all hover:scale-105"
            >
              View All 500+ Cities
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          4. WHY CHOOSE US
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container-app">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Award className="w-4 h-4" />
              Why Us
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                RentiGo?
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 text-center border border-slate-200 hover:border-violet-200 hover:shadow-xl transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${f.color} rounded-2xl flex-center mx-auto mb-4 shadow-xl`}>
                  <f.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-secondary-900">{f.title}</h3>
                <p className="text-sm text-secondary-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          5. HOW IT WORKS
      ═══════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container-app">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Easy Steps
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-heading">
              How It{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-violet-200 via-indigo-400 to-violet-200" />

            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex-center shadow-xl mx-auto relative z-10">
                    <s.icon className="w-10 h-10 text-white" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-10 h-10 bg-white border-4 border-violet-100 rounded-full flex-center text-xs font-bold text-violet-600 shadow-md z-20">
                    {s.num}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-secondary-900">{s.title}</h3>
                <p className="text-secondary-600 max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          6. CTA
      ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container-app">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.3),transparent_50%)]" />
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.2),transparent_50%)]" />
            </div>

            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 text-9xl">🚗</div>
              <div className="absolute bottom-10 right-10 text-9xl">🏍️</div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>Trusted by 20,000+ Riders</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
                Ready to Hit the{" "}
                <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  Road?
                </span>
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Join thousands of happy riders across India!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-2xl shadow-violet-500/30 transition-all hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/vehicles"
                  className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold transition-all"
                >
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

export default HomePage;