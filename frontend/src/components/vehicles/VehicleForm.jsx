import React, { useState, useEffect } from "react";
import { Upload, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import Input from "../common/Input";
import Button from "../common/Button";
import {
  VEHICLE_TYPES, FUEL_TYPES, TRANSMISSION_TYPES,
} from "../../utils/constants";
import { getImageUrl } from "../../utils/helpers";
import adminService from "../../services/adminService";

const VehicleForm = ({ onSubmit, initialData = null, isLoading, isEdit = false }) => {
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    brand: "",
    model: "",
    modelYear: new Date().getFullYear(),
    type: "2W",
    fuelType: "petrol",
    transmission: "manual",
    seatingCapacity: 2,
    color: "",
    description: "",
    features: [],
    pricing: { daily: "", weekly: "", monthly: "" },
    location: "",
  });
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [locations, setLocations] = useState([]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await adminService.getAllLocations();
        setLocations(res.data.locations || []);
      } catch (err) {
        console.error("Failed to fetch locations");
      }
    };
    fetchLocations();
  }, []);

  // Load initial data for edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleNumber: initialData.vehicleNumber || "",
        brand: initialData.brand || "",
        model: initialData.model || "",
        modelYear: initialData.modelYear || new Date().getFullYear(),
        type: initialData.type || "2W",
        fuelType: initialData.fuelType || "petrol",
        transmission: initialData.transmission || "manual",
        seatingCapacity: initialData.seatingCapacity || 2,
        color: initialData.color || "",
        description: initialData.description || "",
        features: initialData.features || [],
        pricing: {
          daily: initialData.pricing?.daily || "",
          weekly: initialData.pricing?.weekly || "",
          monthly: initialData.pricing?.monthly || "",
        },
        location: initialData.location?._id || initialData.location || "",
      });

      if (initialData.images) {
        setImagePreview(initialData.images.map((img) => getImageUrl(img.url)));
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("pricing.")) {
      const key = name.split(".")[1];
      setFormData((p) => ({
        ...p,
        pricing: { ...p.pricing, [key]: value },
      }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }

    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = imagePreview.length + files.length;

    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview((p) => [...p, reader.result]);
      };
      reader.readAsDataURL(file);
      setImages((p) => [...p, file]);
    });
  };

  const removeImage = (idx) => {
    setImages((p) => p.filter((_, i) => i !== idx));
    setImagePreview((p) => p.filter((_, i) => i !== idx));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((p) => ({
        ...p,
        features: [...p.features, featureInput.trim()],
      }));
      setFeatureInput("");
    }
  };

  const removeFeature = (idx) => {
    setFormData((p) => ({
      ...p,
      features: p.features.filter((_, i) => i !== idx),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.vehicleNumber) errs.vehicleNumber = "Required";
    if (!formData.brand) errs.brand = "Required";
    if (!formData.model) errs.model = "Required";
    if (!formData.location) errs.location = "Required";
    if (!formData.pricing.daily) errs["pricing.daily"] = "Required";
    if (!formData.pricing.weekly) errs["pricing.weekly"] = "Required";
    if (!formData.pricing.monthly) errs["pricing.monthly"] = "Required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "pricing" || key === "features") {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value);
      }
    });

    images.forEach((img) => data.append("images", img));

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Vehicle Number"
            name="vehicleNumber"
            placeholder="MH12AB1234"
            value={formData.vehicleNumber}
            onChange={handleChange}
            error={errors.vehicleNumber}
            disabled={isEdit}
            required
          />
          <Input
            label="Brand"
            name="brand"
            placeholder="Honda, Maruti, etc."
            value={formData.brand}
            onChange={handleChange}
            error={errors.brand}
            required
          />
          <Input
            label="Model"
            name="model"
            placeholder="Activa, Swift, etc."
            value={formData.model}
            onChange={handleChange}
            error={errors.model}
            required
          />
          <Input
            label="Model Year"
            name="modelYear"
            type="number"
            min="2000"
            max={new Date().getFullYear() + 1}
            value={formData.modelYear}
            onChange={handleChange}
            required
          />

          <div className="form-group">
            <label className="label">Vehicle Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input"
            >
              {VEHICLE_TYPES.map((vt) => (
                <option key={vt.value} value={vt.value}>
                  {vt.icon} {vt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Fuel Type *</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="input"
            >
              {FUEL_TYPES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Transmission *</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
              className="input"
            >
              {TRANSMISSION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Seating Capacity"
            name="seatingCapacity"
            type="number"
            min="1"
            max="10"
            value={formData.seatingCapacity}
            onChange={handleChange}
            required
          />

          <Input
            label="Color"
            name="color"
            placeholder="Pearl White, Red, etc."
            value={formData.color}
            onChange={handleChange}
          />

          <div className="form-group">
            <label className="label">Location *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`input ${errors.location ? "input-error" : ""}`}
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name} - {loc.city}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group mt-4">
          <label className="label">Description</label>
          <textarea
            name="description"
            placeholder="Tell renters about your vehicle..."
            value={formData.description}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            className="input resize-none"
          />
          <p className="text-xs text-secondary-500 mt-1">
            {formData.description.length}/500
          </p>
        </div>
      </div>

      {/* Pricing */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Pricing (₹) *</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Daily"
            name="pricing.daily"
            type="number"
            min="0"
            placeholder="499"
            value={formData.pricing.daily}
            onChange={handleChange}
            error={errors["pricing.daily"]}
            required
          />
          <Input
            label="Weekly"
            name="pricing.weekly"
            type="number"
            min="0"
            placeholder="2999"
            value={formData.pricing.weekly}
            onChange={handleChange}
            error={errors["pricing.weekly"]}
            required
          />
          <Input
            label="Monthly"
            name="pricing.monthly"
            type="number"
            min="0"
            placeholder="9999"
            value={formData.pricing.monthly}
            onChange={handleChange}
            error={errors["pricing.monthly"]}
            required
          />
        </div>
      </div>

      {/* Features */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Features</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            placeholder="Add a feature (e.g. ABS, GPS)"
            className="input flex-1"
          />
          <Button type="button" onClick={addFeature} icon={Plus}>
            Add
          </Button>
        </div>

        {formData.features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feat, i) => (
              <span
                key={i}
                className="badge-primary flex items-center gap-1.5 py-1.5 pl-3 pr-2"
              >
                {feat}
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="hover:bg-primary-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div className="card p-6">
        <h3 className="font-semibold text-lg mb-4">Vehicle Images (Max 5)</h3>

        {imagePreview.length < 5 && (
          <label className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all block">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
            <Upload className="w-10 h-10 text-secondary-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-secondary-700">
              Click to upload images
            </p>
            <p className="text-xs text-secondary-500 mt-1">
              JPEG, PNG, WEBP (Max 5MB each)
            </p>
          </label>
        )}

        {imagePreview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
            {imagePreview.map((src, i) => (
              <div key={i} className="relative group aspect-square">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 w-7 h-7 bg-danger-500 text-white rounded-full flex-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
        {isEdit ? "Update Vehicle" : "Add Vehicle"}
      </Button>
    </form>
  );
};

export default VehicleForm;