import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";
import { validateEmail } from "../../utils/validators";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await login(formData);
    if (result.success) {
      toast.success(result.message);
      const from = location.state?.from?.pathname;

      // Redirect based on role
      if (from) {
        navigate(from, { replace: true });
      } else if (result.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (result.user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/");
      }
    } else {
      toast.error(result.message);
    }
  };

  const quickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email Address"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={handleChange}
        icon={Mail}
        error={errors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        icon={Lock}
        error={errors.password}
        required
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary-500 focus:ring-primary-400"
          />
          <span className="text-secondary-600">Remember me</span>
        </label>
        <Link
          to="/forgot-password"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isLoading}
        icon={LogIn}
      >
        Sign In
      </Button>

      <p className="text-center text-sm text-secondary-600 pt-2">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Create one
        </Link>
      </p>

      {/* Quick Login Demo */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <p className="text-xs text-secondary-500 text-center mb-3 font-medium">
          🎯 Quick Demo Login
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => quickLogin("admin@rentigo.com", "Admin@123")}
            className="px-2 py-2 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium transition-colors"
          >
            👑 Admin
          </button>
          <button
            type="button"
            onClick={() => quickLogin("owner1@rentigo.com", "Owner@123")}
            className="px-2 py-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors"
          >
            🏢 Owner
          </button>
          <button
            type="button"
            onClick={() => quickLogin("customer1@rentigo.com", "Customer@123")}
            className="px-2 py-2 text-xs bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors"
          >
            👤 Customer
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;