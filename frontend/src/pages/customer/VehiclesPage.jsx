import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, X, SlidersHorizontal,
  Car, Bike, MapPin, ChevronDown, ArrowUpDown,
  RefreshCw, Sparkles, ArrowRight, Star,
} from "lucide-react";
import useVehicleStore from "../../store/vehicleStore";
import { POPULAR_CITIES, getVehicleFallback } from "../../utils/vehicleImages";
import { formatPrice, getImageUrl } from "../../utils/helpers";
import { formatFuelType, formatTransmission } from "../../utils/formatters";

const VehiclesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { vehicles, fetchVehicles, isLoading } = useVehicleStore();

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    category: searchParams.get("category") || "",
    fuelType: searchParams.get("fuelType") || "",
    transmission: searchParams.get("transmission") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "newest",
  });

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [showUniqueOnly, setShowUniqueOnly] = useState(true);

  useEffect(() => {
    const params = { limit: 200 };
    if (filters.type) params.type = filters.type;
    if (filters.city) params.city = filters.city;
    if (filters.category) params.category = filters.category;
    if (filters.fuelType) params.fuelType = filters.fuelType;
    if (filters.transmission) params.transmission = filters.transmission;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (searchQuery) params.search = searchQuery;
    if (filters.sortBy) params.sortBy = filters.sortBy;

    fetchVehicles(params);

    const newParams = new URLSearchParams();
    Object.entries({ ...filters, q: searchQuery }).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  }, [filters, searchQuery]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: "", city: "", category: "", fuelType: "",
      transmission: "", minPrice: "", maxPrice: "", sortBy: "newest",
    });
    setSearchQuery("");
  };

  // ═══ SMART VEHICLE LOGIC ═══
  const displayVehicles = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return [];
    let result = [...vehicles];

    if (!filters.city && showUniqueOnly) {
      const uniqueMap = new Map();
      result.forEach((v) => {
        const key = `${v.brand}-${v.model}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, v);
        } else {
          const existing = uniqueMap.get(key);
          if ((v.averageRating || 0) > (existing.averageRating || 0)) {
            uniqueMap.set(key, v);
          }
        }
      });
      result = Array.from(uniqueMap.values());
    }

    switch (filters.sortBy) {
      case "price-low":
        result.sort((a, b) => (a.pricing?.daily || 0) - (b.pricing?.daily || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.pricing?.daily || 0) - (a.pricing?.daily || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case "popular":
        result.sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    return result;
  }, [vehicles, filters.sortBy, filters.city, showUniqueOnly]);

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== "newest"
  ).length + (searchQuery ? 1 : 0);

  const totalRawCount = vehicles?.length || 0;
  const displayCount = displayVehicles?.length || 0;

  // 🔥 Rental Categories - CORRECT IMAGE PATHS
  const rentalCategories = [
    {
      name: "Cars",
      image: "/vehicles/cars/dzire.webp",
      desc: "Comfortable and safe rides for family or business trips.",
      link: "/vehicles?type=4W",
      btnText: "Explore Cars",
    },
    {
      name: "Bikes",
      image: "/vehicles/bikes/splendor.png",
      desc: "Affordable two-wheelers for solo rides and short trips.",
      link: "/vehicles?type=2W",
      btnText: "Explore Bikes",
    },
    {
      name: "Activas",
      image: "/vehicles/scooters/activa.png",
      desc: "Easy-to-ride scooters for daily commutes.",
      link: "/vehicles?type=2W&category=Scooter",
      btnText: "Explore Activas",
    },
    {
      name: "Taxis",
      image: "/vehicles/extra/taxi.png",
      desc: "Professional taxi services with experienced drivers.",
      link: "/contact",
      btnText: "Explore Taxis",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ═══ PREMIUM HERO HEADER ═══ */}
      <section className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-primary-900 to-slate-900" />

        {/* Animated Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="relative z-10 py-16 md:py-20">
          <div className="container-app">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-4 text-sm">
                <Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
                <ChevronDown className="w-3 h-3 text-white/40 rotate-[-90deg]" />
                <span className="text-white/80 font-medium">Our Rentals</span>
                {filters.city && (
                  <>
                    <ChevronDown className="w-3 h-3 text-white/40 rotate-[-90deg]" />
                    <span className="text-accent-300 font-semibold">📍 {filters.city}</span>
                  </>
                )}
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span className="text-white text-xs font-semibold uppercase tracking-wider">
                  Premium Fleet
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl font-bold mb-4 font-heading text-white leading-tight">
                {filters.city ? (
                  <>
                    Vehicles in{" "}
                    <span className="bg-gradient-to-r from-accent-300 via-primary-300 to-white bg-clip-text text-transparent">
                      {filters.city}
                    </span>
                  </>
                ) : (
                  <>
                    Browse Our{" "}
                    <span className="bg-gradient-to-r from-accent-300 via-primary-300 to-white bg-clip-text text-transparent">
                      Premium Vehicles
                    </span>
                  </>
                )}
              </h1>

              {/* Description */}
              <p className="text-lg text-white/80 max-w-2xl mb-6 leading-relaxed">
                {filters.city
                  ? `Find perfect rides available in ${filters.city}. Premium quality with 24/7 support.`
                  : `Choose from 200+ premium vehicles across India. Cars, bikes & scooters at best prices.`}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                {[
                  { icon: Car, label: "200+ Vehicles", color: "text-accent-300" },
                  { icon: MapPin, label: "60+ Cities", color: "text-primary-300" },
                  { icon: Star, label: "4.8★ Rated", color: "text-yellow-300" },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-white/90 font-semibold">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Wave Decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-12 fill-gray-50">
            <path d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,37.3C672,32,768,32,864,37.3C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,60L1392,60C1344,60,1248,60,1152,60C1056,60,960,60,864,60C768,60,672,60,576,60C480,60,384,60,288,60C192,60,96,60,48,60L0,60Z"></path>
          </svg>
        </div>
      </section>

      {/* RENTAL CATEGORIES */}
      {!filters.city && !searchQuery && activeFiltersCount === 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-app">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-3">
                Rental Categories
              </h2>
              <p className="text-secondary-600">
                From daily rides to long trips, we have the right vehicle for you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rentalCategories.map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Image */}
                  <div className="h-52 flex items-center justify-center p-6 bg-white">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error(`Failed to load: ${cat.image}`);
                        e.target.style.display = "none";
                      }}
                    />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="text-xl font-bold text-secondary-900 mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-secondary-600 mb-5 leading-relaxed min-h-[48px]">
                      {cat.desc}
                    </p>
                    <Link
                      to={cat.link}
                      className="block w-full text-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-lg font-semibold transition-all shadow-lg shadow-primary-500/30"
                    >
                      {cat.btnText}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEARCH BAR */}
      <div className="container-app relative z-20 mb-8 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search by brand, model... (e.g., Swift, Activa, Thar)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>

            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="md:col-span-2 input"
            >
              <option value="">All Types</option>
              <option value="2W">🏍️ Bike</option>
              <option value="4W">🚗 Car</option>
            </select>

            <select
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="md:col-span-3 input"
            >
              <option value="">All Cities</option>
              {POPULAR_CITIES.map((c) => (
                <option key={c.id} value={c.name}>📍 {c.name}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:col-span-2 btn-primary relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-400 text-secondary-900 rounded-full text-xs font-bold flex-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container-app pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* SIDEBAR FILTERS */}
          <AnimatePresence>
            {(showFilters || (typeof window !== "undefined" && window.innerWidth >= 1024)) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`lg:col-span-1 ${showFilters ? "block" : "hidden lg:block"}`}
              >
                <div className="card p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Filter className="w-5 h-5 text-primary-600" />
                      Filters
                    </h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="label mb-3">Vehicle Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleFilterChange("type", filters.type === "2W" ? "" : "2W")}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          filters.type === "2W"
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                      >
                        <Bike className={`w-5 h-5 mx-auto mb-1 ${
                          filters.type === "2W" ? "text-primary-600" : "text-secondary-500"
                        }`} />
                        <span className="text-xs font-semibold">Bike</span>
                      </button>
                      <button
                        onClick={() => handleFilterChange("type", filters.type === "4W" ? "" : "4W")}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          filters.type === "4W"
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                      >
                        <Car className={`w-5 h-5 mx-auto mb-1 ${
                          filters.type === "4W" ? "text-primary-600" : "text-secondary-500"
                        }`} />
                        <span className="text-xs font-semibold">Car</span>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="label">Fuel Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["petrol", "diesel", "electric", "cng"].map((f) => (
                        <button
                          key={f}
                          onClick={() =>
                            handleFilterChange("fuelType", filters.fuelType === f ? "" : f)
                          }
                          className={`p-2 rounded-lg border text-xs font-semibold transition-all capitalize ${
                            filters.fuelType === f
                              ? "border-primary-500 bg-primary-50 text-primary-600"
                              : "border-gray-200 text-secondary-600 hover:border-primary-300"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="label">Transmission</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["manual", "automatic"].map((t) => (
                        <button
                          key={t}
                          onClick={() =>
                            handleFilterChange("transmission", filters.transmission === t ? "" : t)
                          }
                          className={`p-2 rounded-lg border text-xs font-semibold transition-all capitalize ${
                            filters.transmission === t
                              ? "border-primary-500 bg-primary-50 text-primary-600"
                              : "border-gray-200 text-secondary-600 hover:border-primary-300"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="label">Price Range (per day)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min ₹"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                        className="input"
                      />
                      <input
                        type="number"
                        placeholder="Max ₹"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1 mt-2">
                      {[
                        { label: "< 1k", min: "", max: "1000" },
                        { label: "1-3k", min: "1000", max: "3000" },
                        { label: "3k+", min: "3000", max: "" },
                      ].map((p) => (
                        <button
                          key={p.label}
                          onClick={() => {
                            handleFilterChange("minPrice", p.min);
                            handleFilterChange("maxPrice", p.max);
                          }}
                          className="text-xs px-2 py-1.5 rounded-md bg-gray-50 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!filters.city && (
                    <div className="mb-6 p-3 bg-primary-50 rounded-xl border border-primary-100">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showUniqueOnly}
                          onChange={(e) => setShowUniqueOnly(e.target.checked)}
                          className="w-4 h-4 text-primary-600 rounded"
                        />
                        <div>
                          <p className="text-sm font-semibold text-secondary-900 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                            Show Unique Models
                          </p>
                          <p className="text-[10px] text-secondary-600 mt-0.5">
                            One card per model (variety)
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  <button
                    onClick={() => setShowFilters(false)}
                    className="btn-primary w-full lg:hidden"
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* VEHICLES SECTION */}
          <main className="lg:col-span-3">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-4 rounded-xl shadow-sm gap-3">
              <div className="text-sm text-secondary-600">
                {filters.city ? (
                  <>
                    <span className="font-bold text-secondary-900">{displayCount}</span> vehicles available in{" "}
                    <span className="font-semibold text-primary-600">📍 {filters.city}</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-secondary-900">{displayCount}</span>
                    {showUniqueOnly ? (
                      <> unique models <span className="text-xs text-secondary-400">(from {totalRawCount} total)</span></>
                    ) : (
                      <> vehicles found</>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2 bg-gray-50 rounded-lg text-sm font-semibold border border-gray-200 focus:outline-none focus:border-primary-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-500" />
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-500" />
                </div>
              </div>
            </div>

            {filters.city && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-primary-50 border border-blue-200 rounded-xl flex items-start gap-3"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-secondary-900">
                    Showing vehicles available in {filters.city}
                  </p>
                  <p className="text-sm text-secondary-600 mt-0.5">
                    All vehicles below are ready for pickup in {filters.city}.
                  </p>
                </div>
                <button
                  onClick={() => handleFilterChange("city", "")}
                  className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
                    Search: {searchQuery}
                    <button onClick={() => setSearchQuery("")}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || key === "sortBy") return null;
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm capitalize"
                    >
                      {key}: {value}
                      <button onClick={() => handleFilterChange(key, "")}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}

            {/* AVAILABLE VEHICLES */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton h-96 rounded-2xl" />
                ))}
              </div>
            ) : displayVehicles?.length === 0 ? (
              <div className="card p-16 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No Vehicles Found</h3>
                <p className="text-secondary-500 mb-6">
                  {filters.city
                    ? `No vehicles available in ${filters.city} matching your filters`
                    : "Try adjusting your filters or search query"}
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayVehicles.map((vehicle, i) => {
                  const vehicleImage = vehicle.images?.[0]?.url
                    ? getImageUrl(vehicle.images[0].url)
                    : getVehicleFallback(vehicle.type, vehicle.brand, vehicle.model, vehicle.category);

                  return (
                    <motion.div
                      key={vehicle._id || i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i % 6) * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="h-52 flex items-center justify-center p-4 bg-white border-b border-gray-100 relative">
                        <img
                          src={vehicleImage}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.src = getVehicleFallback(vehicle.type, vehicle.brand, vehicle.model);
                          }}
                        />

                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md ${
                          vehicle.type === "2W" ? "bg-blue-500" : "bg-purple-500"
                        }`}>
                          {vehicle.type === "2W" ? "🏍️ 2W" : "🚗 4W"}
                        </span>

                        {vehicle.averageRating > 0 && (
                          <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-bold">
                              {Number(vehicle.averageRating).toFixed(1)}
                            </span>
                          </span>
                        )}
                      </div>

                      <div className="p-5 text-center">
                        <h3 className="text-xl font-bold text-secondary-900 mb-3">
                          {vehicle.brand} {vehicle.model}
                        </h3>

                        <div className="space-y-1.5 mb-4 text-sm">
                          <p className="text-secondary-600">
                            Price: <span className="font-semibold text-secondary-900">
                              {formatPrice(vehicle.pricing?.daily)} / Day
                            </span>
                          </p>
                          <p className="text-secondary-600">
                            Fuel: <span className="font-medium">{formatFuelType(vehicle.fuelType)}</span>
                          </p>
                          <p className="text-secondary-600">
                            Transmission: <span className="font-medium">{formatTransmission(vehicle.transmission)}</span>
                          </p>
                          <p>
                            Status: <span className={`font-semibold ${
                              vehicle.status === "available" ? "text-green-600" : "text-red-600"
                            }`}>
                              {vehicle.status === "available" ? "Available" : vehicle.status}
                            </span>
                          </p>
                        </div>

                        {vehicle.location?.city && (
                          <p className="text-xs text-secondary-500 mb-4 flex items-center justify-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {vehicle.location.city}
                          </p>
                        )}

                        <Link
                          to={`/vehicles/${vehicle._id}`}
                          className="block w-full text-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-lg font-semibold shadow-lg shadow-primary-500/30 transition-all"
                        >
                          Book Now
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default VehiclesPage;