import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check, X, Zap, Crown, Rocket, Star,
  Car, Bike, ArrowRight, Calculator,
  Calendar, Clock, Shield, Award,
} from "lucide-react";
import { FLEET_CATEGORIES } from "../../utils/vehicleImages";

const PricingPage = () => {
  const [duration, setDuration] = useState("daily");
  const [vehicleType, setVehicleType] = useState("all");

  const plans = [
    {
      name: "Basic",
      icon: Zap,
      price: { daily: 350, weekly: 2100, monthly: 7500 },
      desc: "Perfect for short trips & daily commute",
      color: "from-blue-500 to-cyan-500",
      popular: false,
      features: [
        { text: "Scooter / Activa included", included: true },
        { text: "Unlimited km (within city)", included: true },
        { text: "Basic insurance", included: true },
        { text: "24/7 roadside assistance", included: true },
        { text: "Free helmet", included: true },
        { text: "Bike / Sports bike", included: false },
        { text: "Car rentals", included: false },
        { text: "Priority support", included: false },
      ],
      btnText: "Start Basic Plan",
    },
    {
      name: "Premium",
      icon: Crown,
      price: { daily: 1500, weekly: 9000, monthly: 32000 },
      desc: "Most popular for regular riders",
      color: "from-primary-500 to-orange-500",
      popular: true,
      features: [
        { text: "All bikes & scooters", included: true },
        { text: "Hatchback & Sedan cars", included: true },
        { text: "Comprehensive insurance", included: true },
        { text: "Unlimited km", included: true },
        { text: "24/7 priority support", included: true },
        { text: "Free pickup & drop", included: true },
        { text: "SUV & Luxury cars", included: false },
        { text: "Personal driver", included: false },
      ],
      btnText: "Start Premium",
    },
    {
      name: "Enterprise",
      icon: Rocket,
      price: { daily: 5000, weekly: 30000, monthly: 100000 },
      desc: "Luxury experience for special occasions",
      color: "from-purple-500 to-pink-500",
      popular: false,
      features: [
        { text: "All vehicle types", included: true },
        { text: "Luxury & Premium cars", included: true },
        { text: "SUV & Convertibles", included: true },
        { text: "Personal driver included", included: true },
        { text: "Full insurance + GAP", included: true },
        { text: "Concierge service", included: true },
        { text: "Free fuel (50 km)", included: true },
        { text: "VIP support hotline", included: true },
      ],
      btnText: "Go Enterprise",
    },
  ];

  const vehiclePricing = FLEET_CATEGORIES;

  const additionalServices = [
    { icon: Shield, name: "Insurance Upgrade", price: "₹200/day", desc: "Zero depreciation cover" },
    { icon: Car, name: "Personal Driver", price: "₹800/day", desc: "Professional chauffeur" },
    { icon: Calendar, name: "Delivery to Doorstep", price: "₹300", desc: "Within 10 km radius" },
    { icon: Clock, name: "Late Return", price: "₹150/hour", desc: "After grace period" },
  ];

  return (
    <div className="overflow-hidden">

      {/* ═════════ HERO ═════════ */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-orange-50 py-20 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl" />

        <div className="container-app relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-primary inline-flex mb-4">💰 Pricing Plans</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
              Simple, Transparent <br />
              <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your needs. No hidden fees, no surprises.
              Cancel anytime.
            </p>

            {/* Duration Toggle */}
            <div className="inline-flex bg-white rounded-2xl shadow-lg p-1.5 border border-gray-100">
              {["daily", "weekly", "monthly"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${
                    duration === d
                      ? "bg-primary-500 text-white shadow-md"
                      : "text-secondary-600 hover:bg-gray-50"
                  }`}
                >
                  {d}
                  {d === "monthly" && (
                    <span className="ml-1 text-[10px] bg-success-500 text-white px-1.5 py-0.5 rounded-full">
                      Save 20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═════════ PRICING PLANS ═════════ */}
      <section className="section -mt-12 relative z-20">
        <div className="container-app">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={`card p-8 relative ${
                  plan.popular
                    ? "border-2 border-primary-500 shadow-2xl scale-105"
                    : "border border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-white" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex-center mb-6 shadow-lg`}>
                  <plan.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-2 font-heading">{plan.name}</h3>
                <p className="text-secondary-600 text-sm mb-6">{plan.desc}</p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold gradient-text">
                      ₹{plan.price[duration].toLocaleString()}
                    </span>
                    <span className="text-secondary-500">/{duration === "daily" ? "day" : duration === "weekly" ? "week" : "month"}</span>
                  </div>
                </div>

                <Link
                  to="/vehicles"
                  className={`btn-lg w-full mb-6 ${
                    plan.popular
                      ? "btn-primary shadow-xl"
                      : "btn-outline"
                  }`}
                >
                  {plan.btnText}
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="space-y-3 pt-6 border-t border-gray-100">
                  <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-3">
                    What's included
                  </p>
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-secondary-700" : "text-gray-400 line-through"}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ VEHICLE WISE PRICING ═════════ */}
      <section className="section bg-gradient-to-br from-gray-50 to-primary-50/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">🚗 Vehicle Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Per Vehicle <span className="gradient-text">Pricing</span>
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Detailed pricing for each vehicle category
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehiclePricing.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="card overflow-hidden group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={v.image}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1">{v.name}</h3>
                  <p className="text-xs text-secondary-500 mb-3">{v.desc}</p>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-2xl font-bold gradient-text">{v.price}</span>
                  </div>
                  <Link to={v.link} className="btn-primary w-full btn-sm">
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ ADDITIONAL SERVICES ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">➕ Add-ons</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Additional <span className="gradient-text">Services</span>
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Customize your rental with these optional add-ons
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-hover p-6 text-center"
              >
                <div className="w-14 h-14 gradient-bg rounded-2xl flex-center mx-auto mb-4 shadow-md">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold mb-2">{s.name}</h3>
                <p className="text-xs text-secondary-500 mb-3">{s.desc}</p>
                <p className="text-xl font-bold gradient-text">{s.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ COMPARISON ═════════ */}
      <section className="section bg-gradient-to-br from-primary-50/30 to-white">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">📊 Compare</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Compare Our <span className="gradient-text">Plans</span>
            </h2>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-primary-500 to-orange-500 text-white">
                    <th className="px-6 py-4 text-left">Features</th>
                    <th className="px-6 py-4 text-center">Basic</th>
                    <th className="px-6 py-4 text-center bg-white/10">Premium ⭐</th>
                    <th className="px-6 py-4 text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Bikes & Scooters", basic: true, premium: true, enterprise: true },
                    { feature: "Cars (Hatchback/Sedan)", basic: false, premium: true, enterprise: true },
                    { feature: "Luxury SUVs", basic: false, premium: false, enterprise: true },
                    { feature: "Personal Driver", basic: false, premium: false, enterprise: true },
                    { feature: "Insurance", basic: "Basic", premium: "Full", enterprise: "Premium" },
                    { feature: "Free Pickup & Drop", basic: false, premium: true, enterprise: true },
                    { feature: "24/7 Support", basic: true, premium: true, enterprise: "VIP" },
                    { feature: "Unlimited KM", basic: true, premium: true, enterprise: true },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{row.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.basic === "boolean" ? (
                          row.basic ? <Check className="w-5 h-5 text-success-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : <span className="text-sm font-semibold">{row.basic}</span>}
                      </td>
                      <td className="px-6 py-4 text-center bg-primary-50/30">
                        {typeof row.premium === "boolean" ? (
                          row.premium ? <Check className="w-5 h-5 text-success-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : <span className="text-sm font-semibold text-primary-600">{row.premium}</span>}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.enterprise === "boolean" ? (
                          row.enterprise ? <Check className="w-5 h-5 text-success-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : <span className="text-sm font-semibold">{row.enterprise}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ CTA ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="gradient-bg rounded-3xl p-12 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 text-9xl">💰</div>
              <div className="absolute bottom-10 right-10 text-9xl">🚗</div>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
                Need a Custom Plan?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Talk to our team for special pricing on corporate & long-term rentals
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/contact" className="bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-xl">
                  Contact Sales
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

export default PricingPage;