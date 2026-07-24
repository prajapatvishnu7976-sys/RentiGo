import React from "react";
import { Link } from "react-router-dom";
import { Car, ArrowLeft, CheckCircle } from "lucide-react";
import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  const benefits = [
    "Instant access to 5000+ vehicles",
    "Flexible daily, weekly & monthly plans",
    "Verified owners & secure bookings",
    "24/7 customer support",
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left - Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex-center">
            <Car className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold font-heading">RentiGo</span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 font-heading leading-tight">
            Start your journey <br /> with RentiGo today
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-md">
            Join thousands of customers who trust us for hassle-free vehicle
            rentals.
          </p>

          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-sm text-white/70">
          🔒 Your data is secure & encrypted
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link
            to="/"
            className="lg:hidden flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-2 font-heading">
              Create your account
            </h2>
            <p className="text-secondary-600">
              Join RentiGo and start renting vehicles today
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;