import React from "react";
import { Link } from "react-router-dom";
import { Car, ArrowLeft } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left - Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-bg p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

        <Link to="/" className="flex items-center gap-2 relative z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex-center">
            <Car className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold font-heading">RentiGo</span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-bold mb-4 font-heading leading-tight">
            Welcome back to <br /> the future of <br /> vehicle rentals
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Sign in to access your dashboard, manage bookings, and rent vehicles
            with just a few clicks.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { val: "5K+",   label: "Vehicles" },
            { val: "20K+",  label: "Customers" },
            { val: "4.8★",  label: "Rating" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.val}</p>
              <p className="text-sm text-white/70">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="lg:hidden flex items-center gap-2 text-secondary-600 hover:text-primary-600 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-secondary-900 mb-2 font-heading">
              Sign in to RentiGo
            </h2>
            <p className="text-secondary-600">
              Enter your credentials to access your account
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;