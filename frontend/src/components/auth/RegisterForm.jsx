import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail, Lock, User, Phone, Building, UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";
import { validateEmail, validatePhone, validatePassword } from "../../utils/validators";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    businessName: "",
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

    if (!formData.name) newErrors.name = "Name is required";
    else if (formData.name.length < 2)
      newErrors.name = "Name must be at least 2 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phone) newErrors.phone = "Phone is required";
    else if (!validatePhone(formData.phone))
      newErrors.phone = "Invalid Indian phone (10 digits, starts with 6-9)";

    if (!formData.password) newErrors.password = "Password is required";
    else {
      const pwErrors = validatePassword(formData.password);
      if (pwErrors.length > 0) newErrors.password = pwErrors.join(", ");
    }

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    if (formData.role === "owner" && !formData.businessName)
      newErrors.businessName = "Business name is required for owners";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { confirmPassword, ...submitData } = formData;
    const result = await register(submitData);

    if (result.success) {
      toast.success(result.message);
      if (result.user.role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/");
      }
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Selection */}
      <div className="form-group">
        <label className="label">I want to register as</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, role: "customer" }))}
            className={`p-3 rounded-xl border-2 transition-all ${
              formData.role === "customer"
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">👤</div>
            <p className="font-semibold text-sm">Customer</p>
            <p className="text-xs text-secondary-500">Rent vehicles</p>
          </button>

          <button
            type="button"
            onClick={() => setFormData((p) => ({ ...p, role: "owner" }))}
            className={`p-3 rounded-xl border-2 transition-all ${
              formData.role === "owner"
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="text-2xl mb-1">🏢</div>
            <p className="font-semibold text-sm">Owner</p>
            <p className="text-xs text-secondary-500">List vehicles</p>
          </button>
        </div>
      </div>

      <Input
        label="Full Name"
        name="name"
        placeholder="John Doe"
        value={formData.name}
        onChange={handleChange}
        icon={User}
        error={errors.name}
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Email"
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
          label="Phone Number"
          name="phone"
          placeholder="9876543210"
          maxLength={10}
          value={formData.phone}
          onChange={handleChange}
          icon={Phone}
          error={errors.phone}
          required
        />
      </div>

      {formData.role === "owner" && (
        <Input
          label="Business Name"
          name="businessName"
          placeholder="Your Rental Business"
          value={formData.businessName}
          onChange={handleChange}
          icon={Building}
          error={errors.businessName}
          required
        />
      )}

      <Input
        label="Password"
        type="password"
        name="password"
        placeholder="Min 6 chars, 1 upper, 1 lower, 1 number"
        value={formData.password}
        onChange={handleChange}
        icon={Lock}
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="Re-enter your password"
        value={formData.confirmPassword}
        onChange={handleChange}
        icon={Lock}
        error={errors.confirmPassword}
        required
      />

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={isLoading}
        icon={UserPlus}
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-secondary-600 pt-2">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary-600 hover:text-primary-700 font-semibold"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;