import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MapPin, Car, Bike, Star, Users, Calendar,
  ArrowRight, Phone, Clock, Shield,
  Award, Zap, CheckCircle2,
} from "lucide-react";
import useVehicleStore from "../../store/vehicleStore";
import VehicleGrid from "../../components/vehicles/VehicleGrid";
import { POPULAR_CITIES, VEHICLE_IMAGES } from "../../utils/vehicleImages";

const CityPage = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();

  const [activeTab, setActiveTab] = useState("all");

  // Find city details
  const cityDetails = POPULAR_CITIES.find(
    (c) => c.id.toLowerCase() === cityName?.toLowerCase() ||
           c.name.toLowerCase() === cityName?.toLowerCase()
  ) || {
    id: cityName,
    name: cityName?.charAt(0).toUpperCase() + cityName?.slice(1),
    state: "India",
    desc: `Premium vehicle rentals available in ${cityName?.charAt(0).toUpperCase() + cityName?.slice(1)}.`,
    vehicles: 0,
  };

  useEffect(() => {
    if (cityDetails.name) {
      fetchVehicles({
        city: cityDetails.name,
        limit: 12,
        page: 1,
      });
    }
  }, [cityDetails.name]);

  const actualVehicleCount = vehicles?.length || 0;

  const stats = [
    { val: `${actualVehicleCount}+`, label: "Vehicles", icon: Car, color: "from-orange-500 to-red-500" },
    { val: "500+", label: "Happy Users", icon: Users, color: "from-blue-500 to-cyan-500" },
    { val: "4.8★", label: "Rating", icon: Star, color: "from-yellow-500 to-orange-500" },
    { val: "24/7", label: "Support", icon: Clock, color: "from-green-500 to-emerald-500" },
  ];

  const filteredVehicles = vehicles?.filter((v) => {
    if (activeTab === "all") return true;
    return v.type === activeTab;
  }) || [];

  const carCount = vehicles?.filter((v) => v.type === "4W").length || 0;
  const bikeCount = vehicles?.filter((v) => v.type === "2W").length || 0;

  const vehicleTypes = [
    {
      id: "car",
      name: "Cars",
      icon: Car,
      count: carCount,
      link: `/vehicles?type=4W&city=${cityDetails.name}`,
      color: "from-purple-500 to-pink-500",
      img: VEHICLE_IMAGES.sedan,
    },
    {
      id: "bike",
      name: "Bikes",
      icon: Bike,
      count: bikeCount,
      link: `/vehicles?type=2W&city=${cityDetails.name}`,
      color: "from-orange-500 to-red-500",
      img: VEHICLE_IMAGES.sportsBike,
    },
  ];

  const features = [
    { icon: Shield, title: "Verified Vehicles", desc: "Every vehicle quality checked" },
    { icon: Clock, title: "24/7 Support", desc: "Round-the-clock assistance" },
    { icon: Zap, title: "Instant Booking", desc: "Book in 60 seconds" },
    { icon: Award, title: "Best Prices", desc: "Lowest rates guaranteed" },
  ];

  const cityGradients = [
    "from-orange-500 to-red-500",
    "from-blue-500 to-cyan-500",
    "from-purple-500 to-pink-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-purple-500",
  ];

  return (
    <div className="overflow-hidden bg-gray-50 min-h-screen">

      {/* ═════════ HERO (Gradient BG - No Image) ═════════ */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-orange-600 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl">🏙️</div>
          <div className="absolute bottom-10 right-10 text-9xl">🚗</div>
        </div>

        <div className="container-app relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4 text-white/80 text-sm">
              <Link to="/rental-cities" className="hover:text-white">Cities</Link>
              <span>/</span>
              <span className="text-white">{cityDetails.name}</span>
            </div>

            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <MapPin className="w-4 h-4" />
              {cityDetails.state}
            </span>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-heading">
              Vehicle Rentals in <br />
              <span className="text-yellow-300">{cityDetails.name}</span>
            </h1>

            <p className="text-lg text-white/90 mb-6 max-w-xl">
              {cityDetails.desc} Choose from {actualVehicleCount}+ vehicles at
              unbeatable prices with 24/7 support.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to={`/vehicles?city=${cityDetails.name}`} className="btn-primary bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-2xl">
                Browse All Vehicles
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="tel:+918000000000" className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 btn-lg border border-white/30">
                <Phone className="w-5 h-5" />
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═════════ STATS ═════════ */}
      <section className="py-12 -mt-12 relative z-20 container-app">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card p-6 text-center"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${s.color} rounded-2xl flex-center mx-auto mb-3 shadow-lg`}>
                <s.icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-2xl md:text-3xl font-bold gradient-text">{s.val}</p>
              <p className="text-sm text-secondary-600 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═════════ VEHICLE TYPES ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">🚗 Vehicle Types</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Available in <span className="gradient-text">{cityDetails.name}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {vehicleTypes.map((v, i) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="card overflow-hidden cursor-pointer group"
                onClick={() => navigate(v.link)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={v.img} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-2xl mb-1">{v.name}</h3>
                    <p className="text-sm text-white/90">{v.count}+ available</p>
                  </div>
                </div>
                <div className="p-4">
                  <button className="btn-primary w-full">
                    Browse {v.name}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ AVAILABLE VEHICLES ═════════ */}
      <section className="section bg-gradient-to-br from-gray-50 to-primary-50/30">
        <div className="container-app">
          <div className="flex-between mb-8 flex-wrap gap-4">
            <div>
              <span className="badge-primary inline-flex mb-2">⭐ Available Now</span>
              <h2 className="text-3xl font-bold font-heading">
                Top Vehicles in <span className="gradient-text">{cityDetails.name}</span>
              </h2>
            </div>
            <Link to={`/vehicles?city=${cityDetails.name}`} className="btn-outline hidden sm:flex group">
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: "all", label: `All (${vehicles?.length || 0})` },
              { id: "2W", label: `🏍️ Bikes (${bikeCount})` },
              { id: "4W", label: `🚗 Cars (${carCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-primary-500 text-white shadow-md"
                    : "bg-white text-secondary-700 hover:bg-primary-50 border border-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <VehicleGrid vehicles={filteredVehicles.slice(0, 12)} isLoading={isLoading} />

          {filteredVehicles.length > 12 && (
            <div className="text-center mt-8">
              <Link to={`/vehicles?city=${cityDetails.name}${activeTab !== "all" ? `&type=${activeTab}` : ""}`} className="btn-primary btn-lg">
                Browse All {filteredVehicles.length} Vehicles in {cityDetails.name}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ═════════ FEATURES ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">✨ Why Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Why Choose RentiGo in <span className="gradient-text">{cityDetails.name}?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="card-hover p-6 text-center">
                <div className="w-14 h-14 gradient-bg rounded-2xl flex-center mx-auto mb-4 shadow-md">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-secondary-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ OTHER CITIES (Gradient Cards) ═════════ */}
      <section className="section bg-gray-50">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">🌆 Explore More</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Other <span className="gradient-text">Cities</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {POPULAR_CITIES.filter((c) => c.id !== cityDetails.id).slice(0, 12).map((city, i) => {
              const gradient = cityGradients[i % cityGradients.length];
              return (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -3, scale: 1.03 }}
                  className={`bg-gradient-to-br ${gradient} p-4 rounded-xl text-white cursor-pointer shadow-md hover:shadow-2xl transition-all group relative overflow-hidden`}
                  onClick={() => navigate(`/city/${city.id}`)}
                >
                  <div className="absolute top-0 right-0 opacity-10 text-4xl">🏙️</div>
                  <div className="relative z-10">
                    <MapPin className="w-4 h-4 mb-1.5 opacity-90" />
                    <h3 className="font-bold text-sm mb-0.5">{city.name}</h3>
                    <p className="text-[10px] text-white/80">{city.state}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/rental-cities" className="btn-outline btn-lg">
              View All 500+ Cities
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═════════ CTA ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="gradient-bg rounded-3xl p-12 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 text-9xl">🚗</div>
              <div className="absolute bottom-10 right-10 text-9xl">📍</div>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
                Ready to Ride in {cityDetails.name}?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Book your perfect vehicle now and start your journey!
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to={`/vehicles?city=${cityDetails.name}`} className="bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-xl">
                  Browse Vehicles
                </Link>
                <Link to="/contact" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 btn-lg border border-white/30">
                  Get Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CityPage;