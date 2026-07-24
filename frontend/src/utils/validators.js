export const validateEmail = (email) => {
  const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

export const validatePassword = (password) => {
  const errors = [];
  if (password.length < 6)
    errors.push("At least 6 characters");
  if (!/[A-Z]/.test(password))
    errors.push("One uppercase letter");
  if (!/[a-z]/.test(password))
    errors.push("One lowercase letter");
  if (!/\d/.test(password))
    errors.push("One number");
  return errors;
};

export const validateVehicleNumber = (number) => {
  const regex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
  return regex.test(number.toUpperCase());
};

export const validatePincode = (pincode) => {
  const regex = /^[1-9][0-9]{5}$/;
  return regex.test(pincode);
};

export const validateDateRange = (startDate, endDate) => {
  const errors = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!startDate) {
    errors.startDate = "Start date is required";
  } else if (new Date(startDate) < today) {
    errors.startDate = "Start date cannot be in the past";
  }

  if (!endDate) {
    errors.endDate = "End date is required";
  } else if (startDate && new Date(endDate) <= new Date(startDate)) {
    errors.endDate = "End date must be after start date";
  }

  return errors;
};

export const validateFileSize = (file, maxSize = 5 * 1024 * 1024) => {
  return file.size <= maxSize;
};

export const validateFileType = (file, allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]) => {
  return allowedTypes.includes(file.type);
};

export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const minLength = (value, min) => {
  return String(value).length >= min;
};

export const maxLength = (value, max) => {
  return String(value).length <= max;
};

export const isPositiveNumber = (value) => {
  return !isNaN(value) && Number(value) > 0;
};