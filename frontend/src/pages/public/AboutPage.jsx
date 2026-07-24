import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, Eye, Heart, Users, Award, Shield,
  TrendingUp, Globe, Zap, CheckCircle2,
  ArrowRight, Car, Star, Clock,
} from "lucide-react";
import { HERO_IMAGES } from "../../utils/vehicleImages";

const AboutPage = () => {
  const stats = [
    { val: "20K+", label: "Happy Customers", icon: Users, color: "from-blue-500 to-cyan-500" },
    { val: "5000+", label: "Vehicles", icon: Car, color: "from-orange-500 to-red-500" },
    { val: "200+", label: "Cities", icon: Globe, color: "from-green-500 to-emerald-500" },
    { val: "4.8★", label: "Rating", icon: Star, color: "from-yellow-500 to-orange-500" },
  ];

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      desc: "To make vehicle rentals accessible, affordable, and effortless for every Indian. We believe mobility is a right, not a luxury.",
      color: "from-primary-500 to-orange-500",
    },
    {
      icon: Eye,
      title: "Our Vision",
      desc: "To become India's #1 trusted vehicle rental platform, serving every city and town with premium quality and service.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      title: "Our Values",
      desc: "Trust, Transparency, and Customer-first approach. We treat every customer like family and every vehicle like our own.",
      color: "from-red-500 to-pink-500",
    },
  ];

  const features = [
    { icon: Shield, title: "100% Verified", desc: "All vehicles are quality checked" },
    { icon: Clock, title: "24/7 Support", desc: "Round the clock customer service" },
    { icon: Zap, title: "Instant Booking", desc: "Book your ride in 60 seconds" },
    { icon: Award, title: "Best Prices", desc: "Guaranteed lowest market prices" },
    { icon: TrendingUp, title: "Growing Fast", desc: "Expanding to 500+ cities by 2026" },
    { icon: CheckCircle2, title: "Trusted Brand", desc: "Loved by 20,000+ customers" },
  ];

  const team = [
    {
      name: "Rahul Sharma",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=85",
      bio: "10+ years in automotive industry",
    },
    {
      name: "Priya Patel",
      role: "Co-Founder & CTO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85",
      bio: "Tech leader, ex-Google engineer",
    },
    {
      name: "Amit Kumar",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=85",
      bio: "Operations expert across 50+ cities",
    },
    {
      name: "Sneha Singh",
      role: "Customer Success Head",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=85",
      bio: "Passionate about user experience",
    },
  ];

  const journey = [
    { year: "2020", title: "RentiGo Founded", desc: "Started with just 50 vehicles in Mumbai" },
    { year: "2021", title: "1,000+ Vehicles", desc: "Expanded to 10 major cities" },
    { year: "2023", title: "10,000+ Customers", desc: "Reached half-million bookings milestone" },
    { year: "2025", title: "200+ Cities", desc: "Today serving 200+ cities across India" },
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
            <span className="badge-primary inline-flex mb-4">🚀 About RentiGo</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
              Driving India's <br />
              <span className="gradient-text">Rental Revolution</span>
            </h1>
            <p className="text-lg text-secondary-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to transform how Indians rent vehicles. From your local
              commute to weekend adventures, RentiGo is your trusted ride partner.
            </p>
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

      {/* ═════════ OUR STORY ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge-primary inline-flex mb-3">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
                Started with a <span className="gradient-text">Simple Idea</span>
              </h2>
              <div className="space-y-4 text-secondary-600 leading-relaxed">
                <p>
                  In 2020, our founders faced a common problem — renting a vehicle in India
                  was expensive, complicated, and unreliable. They knew there had to be a better way.
                </p>
                <p>
                  That's how <strong className="text-primary-600">RentiGo</strong> was born — a
                  modern platform that combines technology with personalized service to deliver
                  the best rental experience in India.
                </p>
                <p>
                  Today, we're proud to serve <strong>20,000+ customers</strong> across
                  <strong> 200+ cities</strong>, with a fleet of <strong>5,000+ vehicles</strong> ranging
                  from budget scooters to luxury SUVs.
                </p>
              </div>
              <Link to="/vehicles" className="btn-primary btn-lg mt-6 group">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={HERO_IMAGES.suv}
                  alt="Our Story"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 gradient-bg rounded-xl flex-center text-white">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">Trusted Since</p>
                    <p className="text-2xl font-bold gradient-text">2020</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════════ MISSION VISION VALUES ═════════ */}
      <section className="section bg-gradient-to-br from-gray-50 to-primary-50/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">💎 What Drives Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Mission, Vision & <span className="gradient-text">Values</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-hover p-8 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${v.color} rounded-2xl flex-center mx-auto mb-5 shadow-lg`}>
                  <v.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading">{v.title}</h3>
                <p className="text-secondary-600 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ WHY CHOOSE US ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">✨ Features</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Why People <span className="gradient-text">Love RentiGo</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="card p-6 flex items-start gap-4 hover:shadow-hover transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex-center flex-shrink-0">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-secondary-600">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ OUR JOURNEY ═════════ */}
      <section className="section bg-gradient-to-br from-primary-50/30 to-white">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">📈 Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              5 Years of <span className="gradient-text">Growth</span>
            </h2>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {journey.map((j, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center relative"
                >
                  <div className="relative inline-block mb-4">
                    <div className="w-20 h-20 gradient-bg rounded-full flex-center shadow-xl mx-auto relative z-10">
                      <span className="text-white font-bold text-lg">{j.year}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{j.title}</h3>
                  <p className="text-sm text-secondary-600">{j.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ TEAM ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">👥 Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Meet the <span className="gradient-text">Dream Team</span>
            </h2>
            <p className="text-secondary-600 max-w-2xl mx-auto">
              Passionate people building the future of vehicle rentals in India
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="card overflow-hidden group"
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary-100 to-orange-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                  <p className="text-sm text-primary-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-xs text-secondary-500">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ CTA ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="gradient-bg rounded-3xl p-12 md:p-16 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-10 left-10 text-9xl">🚗</div>
              <div className="absolute bottom-10 right-10 text-9xl">🏍️</div>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-heading">
                Join Our Growing Family
              </h2>
              <p className="text-white/90 text-lg mb-8">
                20,000+ happy customers can't be wrong. Try RentiGo today!
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 btn-lg shadow-xl">
                  Get Started Free
                </Link>
                <Link to="/contact" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 btn-lg border border-white/30">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;