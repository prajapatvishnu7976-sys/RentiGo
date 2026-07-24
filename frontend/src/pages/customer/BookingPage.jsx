import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, MapPin, CreditCard, User,
  Phone, Mail, CheckCircle2, Shield, Clock,
  Car, AlertCircle, ArrowRight, Loader2, Lock,
  Smartphone, Building2, Banknote, X, Copy,
  Wifi, Fingerprint, Sparkles,
} from "lucide-react";
import useVehicleStore from "../../store/vehicleStore";
import useAuth from "../../hooks/useAuth";
import bookingService from "../../services/bookingService";
import { getImageUrl } from "../../utils/helpers";
import { getVehicleFallback } from "../../utils/vehicleImages";
import toast from "react-hot-toast";

const BookingPage = () => {
  const { vehicleId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentVehicle, fetchVehicleById, isLoading } = useVehicleStore();

  const [step, setStep] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState({ open: false, type: null });
  const [paymentTimer, setPaymentTimer] = useState(300); // 5 min
  const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, processing, success, failed
  const [otpValue, setOtpValue] = useState("");

  const [formData, setFormData] = useState({
    pickupDate: searchParams.get("pickup") || "",
    returnDate: searchParams.get("return") || "",
    pickupLocation: "",
    dropLocation: "",
    duration: searchParams.get("type") || "daily",
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    licenseNumber: "",
    paymentMethod: "upi",
    // UPI
    upiId: "",
    // Card
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    // Netbanking
    selectedBank: "",
    specialRequests: "",
    agreedToTerms: false,
  });

  useEffect(() => {
    if (vehicleId) fetchVehicleById(vehicleId);
  }, [vehicleId]);

  // Timer for UPI/Netbanking
  useEffect(() => {
    let interval;
    if (paymentModal.open && paymentStatus === "idle" && paymentTimer > 0) {
      interval = setInterval(() => {
        setPaymentTimer((prev) => {
          if (prev <= 1) {
            setPaymentStatus("failed");
            toast.error("Payment timeout! Please try again.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [paymentModal.open, paymentStatus, paymentTimer]);

  const handleChange = (e) => {
    let { name, value, type, checked } = e.target;

    // Card number formatting (add spaces every 4 digits)
    if (name === "cardNumber") {
      value = value.replace(/\D/g, "").slice(0, 16);
      value = value.replace(/(\d{4})/g, "$1 ").trim();
    }

    // CVV only digits
    if (name === "cardCvv") {
      value = value.replace(/\D/g, "").slice(0, 3);
    }

    // Card expiry MM/YY
    if (name === "cardExpiry") {
      value = value.replace(/\D/g, "").slice(0, 4);
      if (value.length >= 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
      }
    }

    // Phone only 10 digits
    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0;
    const days = Math.ceil(
      (new Date(formData.returnDate) - new Date(formData.pickupDate)) /
        (1000 * 60 * 60 * 24)
    );
    return days > 0 ? days : 0;
  };

  const calculatePricing = () => {
    if (!currentVehicle) return { subtotal: 0, serviceFee: 0, tax: 0, total: 0, days: 0 };
    const days = calculateDays();
    const rate = currentVehicle.pricing?.[formData.duration] || 0;
    const subtotal = days * rate;
    const serviceFee = Math.round(subtotal * 0.05);
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + serviceFee + tax;
    return { subtotal, serviceFee, tax, total, days };
  };

  const pricing = calculatePricing();

  const nextStep = () => {
    if (step === 1) {
      if (!formData.pickupDate || !formData.returnDate) {
        toast.error("Please select pickup and return dates");
        return;
      }
      if (pricing.days <= 0) {
        toast.error("Return date must be after pickup date");
        return;
      }
      if (!formData.pickupLocation.trim()) {
        toast.error("Please enter pickup location");
        return;
      }
    }
    if (step === 2) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.licenseNumber.trim()) {
        toast.error("Please fill all required fields");
        return;
      }
      if (formData.phone.length !== 10) {
        toast.error("Please enter valid 10-digit phone number");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter valid email address");
        return;
      }
    }
    setStep(step + 1);
  };

  // ══════════════════════════════════════════
  // 🔥 CREATE BOOKING (Real API Call)
  // ══════════════════════════════════════════
  const createBookingInBackend = async () => {
    const bookingData = {
      vehicleId: vehicleId,
      durationType: formData.duration,
      startDate: formData.pickupDate,
      endDate: formData.returnDate,
      customerNotes: `Pickup: ${formData.pickupLocation}${formData.dropLocation ? `, Drop: ${formData.dropLocation}` : ""}${formData.specialRequests ? `, Notes: ${formData.specialRequests}` : ""}`,
    };

    const response = await bookingService.createBooking(bookingData);
    const booking = response.data?.booking || response.booking;
    if (!booking) throw new Error("Booking creation failed");
    return booking;
  };

  // ══════════════════════════════════════════
  // 🔥 PAYMENT HANDLERS
  // ══════════════════════════════════════════

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      toast.error("Please agree to terms & conditions");
      return;
    }

    // Validate payment method fields
    if (formData.paymentMethod === "upi") {
      if (!formData.upiId.includes("@")) {
        toast.error("Please enter valid UPI ID (e.g., yourname@paytm)");
        return;
      }
      openPaymentModal("upi");
    } else if (formData.paymentMethod === "card") {
      if (formData.cardNumber.replace(/\s/g, "").length !== 16) {
        toast.error("Please enter valid 16-digit card number");
        return;
      }
      if (!formData.cardName.trim()) {
        toast.error("Please enter cardholder name");
        return;
      }
      if (formData.cardExpiry.length !== 5) {
        toast.error("Please enter valid expiry date (MM/YY)");
        return;
      }
      if (formData.cardCvv.length !== 3) {
        toast.error("Please enter valid 3-digit CVV");
        return;
      }
      openPaymentModal("card");
    } else if (formData.paymentMethod === "netbanking") {
      if (!formData.selectedBank) {
        toast.error("Please select a bank");
        return;
      }
      openPaymentModal("netbanking");
    } else if (formData.paymentMethod === "cash") {
      handleCashPayment();
    }
  };

  const openPaymentModal = (type) => {
    setPaymentModal({ open: true, type });
    setPaymentStatus("idle");
    setPaymentTimer(300);
    setOtpValue("");
  };

  // 🔥 UPI Payment
  const processUpiPayment = async () => {
    setPaymentStatus("processing");
    toast.loading("Verifying UPI transaction...", { id: "payment" });

    // Simulate UPI verification (in real app, poll backend)
    setTimeout(async () => {
      try {
        // 90% success rate
        if (Math.random() > 0.1) {
          const booking = await createBookingInBackend();
          setPaymentStatus("success");
          toast.success("🎉 Payment successful! Booking confirmed.", { id: "payment", duration: 4000 });

          setTimeout(() => {
            setPaymentModal({ open: false, type: null });
            navigate("/my-bookings");
          }, 2500);
        } else {
          throw new Error("Transaction declined by bank");
        }
      } catch (error) {
        setPaymentStatus("failed");
        toast.error(error.message || "Payment failed! Please try again.", { id: "payment" });
      }
    }, 2500);
  };

  // 🔥 Card Payment (OTP based)
  const processCardPayment = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter 6-digit OTP");
      return;
    }

    if (otpValue !== "123456") {
      toast.error("Invalid OTP! Use 123456 for testing");
      return;
    }

    setPaymentStatus("processing");
    toast.loading("Processing payment...", { id: "payment" });

    setTimeout(async () => {
      try {
        const booking = await createBookingInBackend();
        setPaymentStatus("success");
        toast.success("🎉 Payment successful! Booking confirmed.", { id: "payment", duration: 4000 });

        setTimeout(() => {
          setPaymentModal({ open: false, type: null });
          navigate("/my-bookings");
        }, 2500);
      } catch (error) {
        setPaymentStatus("failed");
        toast.error("Payment failed! Please try again.", { id: "payment" });
      }
    }, 2000);
  };

  // 🔥 Netbanking Payment
  const processNetbankingPayment = async () => {
    setPaymentStatus("processing");
    toast.loading("Redirecting to bank...", { id: "payment" });

    setTimeout(async () => {
      try {
        const booking = await createBookingInBackend();
        setPaymentStatus("success");
        toast.success("🎉 Payment successful! Booking confirmed.", { id: "payment", duration: 4000 });

        setTimeout(() => {
          setPaymentModal({ open: false, type: null });
          navigate("/my-bookings");
        }, 2500);
      } catch (error) {
        setPaymentStatus("failed");
        toast.error("Payment failed!", { id: "payment" });
      }
    }, 3000);
  };

  // 🔥 Cash Payment
  const handleCashPayment = async () => {
    setBookingLoading(true);
    try {
      await createBookingInBackend();
      toast.success("🎉 Booking confirmed! Pay ₹" + pricing.total + " at pickup.", { duration: 5000 });
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (error) {
      setBookingLoading(false);
      toast.error(error.response?.data?.message || "Booking failed");
    }
  };

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const copyText = (text, label = "Copied") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label}!`);
  };

  if (isLoading || !currentVehicle) {
    return (
      <div className="min-h-screen flex-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  const { brand, model, modelYear, type, images, location, category } = currentVehicle;
  const vehicleImage = images?.[0]?.url
    ? getImageUrl(images[0].url)
    : getVehicleFallback(type, brand, model, category);

  const steps = [
    { num: 1, title: "Booking Details", icon: Calendar },
    { num: 2, title: "Your Information", icon: User },
    { num: 3, title: "Payment & Confirm", icon: CreditCard },
  ];

  const banks = [
    { code: "SBI", name: "State Bank of India" },
    { code: "HDFC", name: "HDFC Bank" },
    { code: "ICICI", name: "ICICI Bank" },
    { code: "AXIS", name: "Axis Bank" },
    { code: "KOTAK", name: "Kotak Mahindra Bank" },
    { code: "PNB", name: "Punjab National Bank" },
    { code: "BOB", name: "Bank of Baroda" },
    { code: "YES", name: "Yes Bank" },
  ];

  // Generate UPI QR code URL
  const upiPaymentString = `upi://pay?pa=rentigo@paytm&pn=RentiGo&am=${pricing.total}&cu=INR&tn=Vehicle%20Booking%20${brand}%20${model}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiPaymentString)}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-app">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Progress Steps */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex-center transition-all ${
                    step >= s.num ? "bg-primary-500 text-white shadow-lg" : "bg-gray-100 text-secondary-400"
                  }`}>
                    {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-semibold ${step >= s.num ? "text-primary-600" : "text-secondary-400"}`}>
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${step > s.num ? "bg-primary-500" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: FORM */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6 md:p-8"
            >
              {/* STEP 1: Booking Details */}
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold mb-2 font-heading">Booking Details</h2>
                  <p className="text-secondary-600 mb-6">Select your rental dates and location</p>

                  <div className="space-y-4">
                    <div>
                      <label className="label">Rental Duration *</label>
                      <div className="grid grid-cols-3 gap-3">
                        {["daily", "weekly", "monthly"].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setFormData({ ...formData, duration: d })}
                            className={`p-3 rounded-xl border-2 transition-all capitalize ${
                              formData.duration === d
                                ? "border-primary-500 bg-primary-50 text-primary-600 font-bold"
                                : "border-gray-200 text-secondary-600 hover:border-primary-300"
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Pickup Date *</label>
                        <input
                          type="date"
                          name="pickupDate"
                          value={formData.pickupDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={handleChange}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label className="label">Return Date *</label>
                        <input
                          type="date"
                          name="returnDate"
                          value={formData.returnDate}
                          min={formData.pickupDate || new Date().toISOString().split("T")[0]}
                          onChange={handleChange}
                          className="input"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Pickup Location *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                        <input
                          type="text"
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleChange}
                          placeholder="Enter pickup address"
                          className="input pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Drop Location (Optional)</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                        <input
                          type="text"
                          name="dropLocation"
                          value={formData.dropLocation}
                          onChange={handleChange}
                          placeholder="Same as pickup"
                          className="input pl-10"
                        />
                      </div>
                    </div>

                    {pricing.days > 0 && (
                      <div className="bg-gradient-to-br from-primary-50 to-orange-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-secondary-600">Total Days:</span>
                          <span className="font-bold text-primary-600">{pricing.days} days</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button onClick={nextStep} className="btn-primary btn-lg w-full mt-6">
                    Continue to Information
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* STEP 2: User Info */}
              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold mb-2 font-heading">Your Information</h2>
                  <p className="text-secondary-600 mb-6">Please provide your contact details</p>

                  <div className="space-y-4">
                    <div>
                      <label className="label">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="input pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Email *</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            className="input pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="label">Phone (10 digits) *</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                            maxLength="10"
                            className="input pl-10"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="label">Driving License Number *</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleChange}
                        placeholder="e.g., MH01-20210012345"
                        className="input"
                        required
                      />
                      <p className="text-xs text-secondary-500 mt-1 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Your information is encrypted and secure
                      </p>
                    </div>

                    <div>
                      <label className="label">Special Requests (Optional)</label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Any special requirements?"
                        className="input resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="btn-outline flex-1">
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button onClick={nextStep} className="btn-primary flex-1">
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

              {/* STEP 3: Payment */}
              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <h2 className="text-2xl font-bold mb-2 font-heading">Payment Method</h2>
                  <p className="text-secondary-600 mb-6">Choose your preferred payment method</p>

                  {/* Payment Options */}
                  <div className="space-y-3 mb-6">
                    {[
                      { id: "upi", label: "UPI Payment", desc: "GPay, PhonePe, Paytm", icon: Smartphone, color: "bg-purple-500" },
                      { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard, color: "bg-blue-500" },
                      { id: "netbanking", label: "Net Banking", desc: "All major banks", icon: Building2, color: "bg-green-500" },
                      { id: "cash", label: "Pay at Pickup", desc: "Cash payment on pickup", icon: Banknote, color: "bg-orange-500" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.paymentMethod === method.id
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="w-4 h-4 text-primary-600"
                        />
                        <div className={`w-10 h-10 ${method.color} rounded-lg flex-center text-white`}>
                          <method.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{method.label}</p>
                          <p className="text-xs text-secondary-500">{method.desc}</p>
                        </div>
                        {formData.paymentMethod === method.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary-500" />
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Dynamic Payment Details Form */}
                  <AnimatePresence mode="wait">
                    {formData.paymentMethod === "upi" && (
                      <motion.div
                        key="upi-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200"
                      >
                        <label className="label">Enter Your UPI ID *</label>
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleChange}
                          placeholder="yourname@paytm / yourname@ybl"
                          className="input"
                        />
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {[
                            { name: "GPay", color: "bg-blue-100 text-blue-700" },
                            { name: "PhonePe", color: "bg-purple-100 text-purple-700" },
                            { name: "Paytm", color: "bg-blue-100 text-blue-600" },
                            { name: "BHIM", color: "bg-orange-100 text-orange-700" },
                          ].map((app) => (
                            <div key={app.name} className={`${app.color} p-2 rounded-lg text-center text-xs font-semibold`}>
                              {app.name}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {formData.paymentMethod === "card" && (
                      <motion.div
                        key="card-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-3"
                      >
                        <div>
                          <label className="label">Card Number *</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            className="input font-mono"
                            maxLength="19"
                          />
                        </div>
                        <div>
                          <label className="label">Cardholder Name *</label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleChange}
                            placeholder="JOHN DOE"
                            className="input uppercase"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="label">Expiry (MM/YY) *</label>
                            <input
                              type="text"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              placeholder="12/28"
                              className="input font-mono"
                              maxLength="5"
                            />
                          </div>
                          <div>
                            <label className="label">CVV *</label>
                            <input
                              type="password"
                              name="cardCvv"
                              value={formData.cardCvv}
                              onChange={handleChange}
                              placeholder="123"
                              className="input font-mono"
                              maxLength="3"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-blue-700 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Your card details are encrypted with 256-bit SSL
                        </p>
                      </motion.div>
                    )}

                    {formData.paymentMethod === "netbanking" && (
                      <motion.div
                        key="net-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200"
                      >
                        <label className="label">Select Your Bank *</label>
                        <select
                          name="selectedBank"
                          value={formData.selectedBank}
                          onChange={handleChange}
                          className="input"
                        >
                          <option value="">-- Choose Bank --</option>
                          {banks.map((bank) => (
                            <option key={bank.code} value={bank.code}>
                              {bank.name}
                            </option>
                          ))}
                        </select>
                        <div className="grid grid-cols-4 gap-2 mt-3">
                          {banks.slice(0, 4).map((bank) => (
                            <button
                              key={bank.code}
                              type="button"
                              onClick={() => setFormData({ ...formData, selectedBank: bank.code })}
                              className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                                formData.selectedBank === bank.code
                                  ? "bg-green-600 text-white"
                                  : "bg-white text-secondary-700 hover:bg-green-100"
                              }`}
                            >
                              {bank.code}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {formData.paymentMethod === "cash" && (
                      <motion.div
                        key="cash-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200"
                      >
                        <div className="flex items-start gap-2">
                          <Banknote className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-orange-800">
                            <p className="font-bold mb-1">Pay at Pickup</p>
                            <p>You will pay <strong>₹{pricing.total.toLocaleString()}</strong> in cash when you pick up the vehicle. Booking will be confirmed instantly!</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Security Notice */}
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-yellow-800">
                        <p className="font-semibold mb-0.5">Security Deposit</p>
                        <p>₹2,000 refundable deposit will be collected at pickup.</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2 mb-6 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreedToTerms"
                      checked={formData.agreedToTerms}
                      onChange={handleChange}
                      className="w-4 h-4 mt-1 text-primary-600 rounded"
                      required
                    />
                    <span className="text-sm text-secondary-600">
                      I agree to the{" "}
                      <Link to="/about" className="text-primary-600 hover:underline font-semibold">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/about" className="text-primary-600 hover:underline font-semibold">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="btn-outline flex-1"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={bookingLoading || !formData.agreedToTerms}
                      className="btn-primary flex-1"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : formData.paymentMethod === "cash" ? (
                        <>
                          <Banknote className="w-4 h-4" />
                          Confirm Booking
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Pay ₹{pricing.total.toLocaleString()}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="card overflow-hidden">
                <div className="aspect-video bg-white flex items-center justify-center p-4">
                  <img src={vehicleImage} alt={`${brand} ${model}`} className="max-h-full max-w-full object-contain"
                    onError={(e) => { e.target.src = getVehicleFallback(type, brand, model, category); }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{brand} {model}</h3>
                  <p className="text-sm text-secondary-500 mb-3">{modelYear} Model</p>
                  {location && (
                    <p className="text-xs text-secondary-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {location.name}, {location.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold mb-4">Price Breakdown</h3>
                {pricing.days > 0 ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">
                        ₹{currentVehicle.pricing?.[formData.duration]} × {pricing.days} days
                      </span>
                      <span className="font-semibold">₹{pricing.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Service Fee (5%)</span>
                      <span className="font-semibold">₹{pricing.serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">GST (18%)</span>
                      <span className="font-semibold">₹{pricing.tax.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold">Total</span>
                        <span className="text-2xl font-bold gradient-text">
                          ₹{pricing.total.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-secondary-500 mt-1">Including all taxes & fees</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-secondary-500 text-center py-4">
                    Select dates to see pricing
                  </p>
                )}
              </div>

              <div className="card p-4">
                <div className="space-y-2 text-xs">
                  {[
                    { icon: Shield, text: "Secure Booking & Payment" },
                    { icon: Clock, text: "Free Cancellation (24h)" },
                    { icon: CheckCircle2, text: "Instant Confirmation" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-secondary-600">
                      <item.icon className="w-4 h-4 text-success-500" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          🔥 PAYMENT MODAL (UPI / Card / Netbanking)
      ══════════════════════════════════════════════ */}
      <AnimatePresence>
        {paymentModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 relative">
                <button
                  onClick={() => {
                    if (paymentStatus !== "success" && paymentStatus !== "processing") {
                      if (window.confirm("Cancel payment?")) {
                        setPaymentModal({ open: false, type: null });
                      }
                    }
                  }}
                  className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
                  disabled={paymentStatus === "processing"}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <div className={`w-14 h-14 rounded-2xl flex-center mx-auto mb-3 ${
                    paymentModal.type === "upi" ? "bg-purple-100" :
                    paymentModal.type === "card" ? "bg-blue-100" : "bg-green-100"
                  }`}>
                    {paymentModal.type === "upi" && <Smartphone className="w-7 h-7 text-purple-600" />}
                    {paymentModal.type === "card" && <CreditCard className="w-7 h-7 text-blue-600" />}
                    {paymentModal.type === "netbanking" && <Building2 className="w-7 h-7 text-green-600" />}
                  </div>
                  <h3 className="text-xl font-bold">
                    {paymentModal.type === "upi" && "UPI Payment"}
                    {paymentModal.type === "card" && "Card Verification"}
                    {paymentModal.type === "netbanking" && "Bank Redirect"}
                  </h3>
                </div>
              </div>

              {/* Body - Based on Payment Status */}
              <div className="p-6">
                {paymentStatus === "success" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex-center mx-auto mb-4">
                      <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                    <p className="text-secondary-600 mb-2">₹{pricing.total.toLocaleString()} paid successfully</p>
                    <p className="text-sm text-secondary-500">Redirecting to your bookings...</p>
                  </motion.div>
                ) : paymentStatus === "failed" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-red-100 rounded-full flex-center mx-auto mb-4">
                      <X className="w-12 h-12 text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h3>
                    <p className="text-secondary-600 mb-4">Please try again</p>
                    <button
                      onClick={() => {
                        setPaymentStatus("idle");
                        setPaymentTimer(300);
                        setOtpValue("");
                      }}
                      className="btn-primary"
                    >
                      Retry Payment
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {/* Amount Display */}
                    <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-xl p-4 mb-4 text-center">
                      <p className="text-xs text-secondary-500 uppercase font-bold">Amount to Pay</p>
                      <p className="text-3xl font-bold gradient-text mt-1">
                        ₹{pricing.total.toLocaleString()}
                      </p>
                    </div>

                    {/* Timer */}
                    <div className="text-center mb-4">
                      <p className="text-sm text-secondary-600">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Session expires: <span className="font-bold text-red-600">{formatTimer(paymentTimer)}</span>
                      </p>
                    </div>

                    {/* UPI Content */}
                    {paymentModal.type === "upi" && (
                      <>
                        <div className="bg-white border-4 border-purple-100 rounded-2xl p-4 mb-4 flex-center">
                          <img src={qrCodeUrl} alt="UPI QR" className="w-56 h-56" />
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 mb-4">
                          <p className="text-xs text-secondary-500 mb-1">Paying to:</p>
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">RentiGo Fleet Services</p>
                            <button
                              onClick={() => copyText("rentigo@paytm", "UPI ID copied")}
                              className="text-primary-600 flex items-center gap-1 text-xs"
                            >
                              <Copy className="w-3 h-3" />
                              rentigo@paytm
                            </button>
                          </div>
                        </div>

                        <div className="text-center mb-4">
                          <p className="text-xs text-secondary-500">Or use UPI ID:</p>
                          <p className="font-mono text-sm font-semibold">{formData.upiId}</p>
                        </div>

                        <button
                          onClick={processUpiPayment}
                          disabled={paymentStatus === "processing"}
                          className="btn-primary w-full"
                        >
                          {paymentStatus === "processing" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Verifying Payment...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              I have Paid via UPI
                            </>
                          )}
                        </button>

                        <p className="text-[10px] text-center text-secondary-400 mt-2">
                          🔒 Secure UPI payment • Instant confirmation
                        </p>
                      </>
                    )}

                    {/* Card Content - OTP */}
                    {paymentModal.type === "card" && (
                      <>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                            <p className="font-semibold text-sm">OTP Sent!</p>
                          </div>
                          <p className="text-xs text-secondary-600">
                            OTP sent to registered mobile ending with{" "}
                            <strong>••••{formData.phone.slice(-4)}</strong>
                          </p>
                          <p className="text-xs text-blue-700 mt-2 bg-blue-100 p-2 rounded-lg">
                            <strong>Test OTP: 123456</strong>
                          </p>
                        </div>

                        <div className="mb-4">
                          <label className="label">Enter 6-digit OTP</label>
                          <input
                            type="text"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                            placeholder="123456"
                            maxLength="6"
                            className="input text-center text-2xl font-mono tracking-widest"
                          />
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-secondary-600">
                          <div className="flex justify-between mb-1">
                            <span>Card:</span>
                            <span className="font-mono">•••• {formData.cardNumber.slice(-4)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span className="font-bold">₹{pricing.total.toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          onClick={processCardPayment}
                          disabled={paymentStatus === "processing" || otpValue.length !== 6}
                          className="btn-primary w-full"
                        >
                          {paymentStatus === "processing" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Fingerprint className="w-4 h-4" />
                              Verify & Pay
                            </>
                          )}
                        </button>
                      </>
                    )}

                    {/* Netbanking Content */}
                    {paymentModal.type === "netbanking" && (
                      <>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 text-center">
                          <Wifi className="w-12 h-12 text-green-600 mx-auto mb-2 animate-pulse" />
                          <p className="font-semibold mb-1">Redirecting to {formData.selectedBank}</p>
                          <p className="text-xs text-secondary-600">
                            You'll be redirected to your bank's secure page
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs">
                          <div className="flex justify-between mb-1">
                            <span>Bank:</span>
                            <span className="font-semibold">
                              {banks.find(b => b.code === formData.selectedBank)?.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span className="font-bold">₹{pricing.total.toLocaleString()}</span>
                          </div>
                        </div>

                        <button
                          onClick={processNetbankingPayment}
                          disabled={paymentStatus === "processing"}
                          className="btn-primary w-full"
                        >
                          {paymentStatus === "processing" ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Connecting to Bank...
                            </>
                          ) : (
                            <>
                              <Building2 className="w-4 h-4" />
                              Proceed to Bank
                            </>
                          )}
                        </button>

                        <p className="text-[10px] text-center text-secondary-400 mt-2">
                          🔒 Secure netbanking • SSL encrypted
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;