import React, { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      name,
      placeholder,
      error,
      helperText,
      icon: Icon,
      required = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === "password" && showPassword ? "text" : type;

    return (
      <div className="form-group">
        {label && (
          <label htmlFor={name} className="label">
            {label}
            {required && <span className="text-danger-500 ml-0.5">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          )}

          <input
            ref={ref}
            type={inputType}
            name={name}
            id={name}
            placeholder={placeholder}
            className={`
              input
              ${Icon ? "pl-11" : ""}
              ${type === "password" ? "pr-11" : ""}
              ${error ? "input-error" : ""}
              ${className}
            `}
            {...props}
          />

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
        </div>

        {error && (
          <p className="error-text">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-xs text-secondary-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;