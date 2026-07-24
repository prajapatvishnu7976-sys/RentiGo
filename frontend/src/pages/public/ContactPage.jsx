import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, Clock, Send,
  MessageCircle, Headphones, Globe,
  CheckCircle2, Loader2,
} from "lucide-react";
import {
  FaFacebookF, FaTwitter, FaInstagram,
  FaLinkedinIn, FaWhatsapp,
} from "react-icons/fa";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: ["+91 80000 00000", "+91 90000 00000"],
      desc: "Mon-Sun: 24/7 Support",
      color: "from-green-500 to-emerald-500",
      action: "tel:+918000000000",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@rentigo.com", "info@rentigo.com"],
      desc: "We reply within 24 hours",
      color: "from-blue-500 to-cyan-500",
      action: "mailto:support@rentigo.com",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["Mumbai HQ", "Maharashtra, India"],
      desc: "BKC, Mumbai - 400051",
      color: "from-orange-500 to-red-500",
      action: "#",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      details: ["+91 80000 00000"],
      desc: "Quick chat support",
      color: "from-green-500 to-teal-500",
      action: "https://wa.me/918000000000",
    },
  ];

  const offices = [
    { city: "Mumbai", address: "BKC, Mumbai - 400051", phone: "+91 80000 00001" },
    { city: "Delhi", address: "Connaught Place, Delhi - 110001", phone: "+91 80000 00002" },
    { city: "Bangalore", address: "MG Road, Bangalore - 560001", phone: "+91 80000 00003" },
    { city: "Ahmedabad", address: "SG Highway, Ahmedabad - 380054", phone: "+91 80000 00004" },
  ];

  const faqs = [
    {
      q: "How can I book a vehicle?",
      a: "Just browse our vehicles, select the dates, and click 'Book Now'. It takes only 60 seconds!",
    },
    {
      q: "What documents are required?",
      a: "You'll need a valid driving license, ID proof (Aadhaar/PAN), and credit/debit card.",
    },
    {
      q: "Can I cancel my booking?",
      a: "Yes! Free cancellation up to 24 hours before pickup. Easy refund policy.",
    },
    {
      q: "Do you provide insurance?",
      a: "Yes, all our vehicles come with comprehensive insurance for your peace of mind.",
    },
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
            <span className="badge-primary inline-flex mb-4">📞 Get in Touch</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-heading">
              We'd Love to <br />
              <span className="gradient-text">Hear From You</span>
            </h1>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Have a question, feedback, or need help with your booking?
              Our team is here to help 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═════════ CONTACT CARDS ═════════ */}
      <section className="py-12 -mt-12 relative z-20 container-app">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map((info, i) => (
            <motion.a
              key={i}
              href={info.action}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="card-hover p-6 text-center block"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-2xl flex-center mx-auto mb-4 shadow-lg`}>
                <info.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">{info.title}</h3>
              {info.details.map((d, idx) => (
                <p key={idx} className="text-sm text-secondary-700 font-medium">{d}</p>
              ))}
              <p className="text-xs text-secondary-500 mt-2">{info.desc}</p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* ═════════ FORM + MAP ═════════ */}
      <section className="section">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-8"
            >
              <span className="badge-primary inline-flex mb-3">💬 Send Message</span>
              <h2 className="text-3xl font-bold mb-2 font-heading">
                Drop Us a <span className="gradient-text">Message</span>
              </h2>
              <p className="text-secondary-600 mb-6">
                Fill out the form and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 80000 00000"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Subject *</label>
                    <select
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">Your Message *</label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    className="input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary btn-lg w-full group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Map + Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map */}
              <div className="card overflow-hidden aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.71637809659275!3d19.082197839106607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RentiGo Location"
                />
              </div>

              {/* Office Hours */}
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl flex-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Office Hours</h3>
                    <p className="text-sm text-secondary-500">We're here to help</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Monday - Friday:</span>
                    <span className="font-semibold">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Saturday:</span>
                    <span className="font-semibold">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-600">Sunday:</span>
                    <span className="font-semibold">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-success-600 flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      24/7 Emergency Support Available
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-600" />
                  Follow Us
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { Icon: FaFacebookF, color: "bg-blue-600" },
                    { Icon: FaTwitter, color: "bg-sky-500" },
                    { Icon: FaInstagram, color: "bg-pink-600" },
                    { Icon: FaLinkedinIn, color: "bg-blue-700" },
                    { Icon: FaWhatsapp, color: "bg-green-600" },
                  ].map(({ Icon, color }, i) => (
                    <a
                      key={i}
                      href="#"
                      className={`w-10 h-10 ${color} text-white rounded-xl flex-center hover:scale-110 transition-transform shadow-md`}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════════ OUR OFFICES ═════════ */}
      <section className="section bg-gradient-to-br from-gray-50 to-primary-50/30">
        <div className="container-app">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">🏢 Our Offices</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Find Us <span className="gradient-text">Near You</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-hover p-6"
              >
                <div className="w-12 h-12 gradient-bg rounded-xl flex-center mb-4 shadow-md">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{office.city}</h3>
                <p className="text-sm text-secondary-600 mb-2">{office.address}</p>
                <a href={`tel:${office.phone}`} className="text-sm text-primary-600 font-semibold hover:underline">
                  {office.phone}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section className="section">
        <div className="container-app max-w-4xl">
          <div className="text-center mb-12">
            <span className="badge-primary inline-flex mb-3">❓ FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <h3 className="font-bold mb-2 flex items-start gap-2">
                  <span className="text-primary-600">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-secondary-600 flex items-start gap-2">
                  <span className="text-green-600 font-bold">A.</span>
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;