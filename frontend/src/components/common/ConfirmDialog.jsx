import React from "react";
import { AlertTriangle, Trash2, Info, CheckCircle } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const variantConfig = {
    danger: {
      icon: Trash2,
      color: "text-danger-500",
      bg: "bg-danger-50",
      btnVariant: "danger",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-warning-600",
      bg: "bg-warning-50",
      btnVariant: "primary",
    },
    info: {
      icon: Info,
      color: "text-primary-600",
      bg: "bg-primary-50",
      btnVariant: "primary",
    },
    success: {
      icon: CheckCircle,
      color: "text-success-600",
      bg: "bg-success-50",
      btnVariant: "success",
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div className={`w-16 h-16 ${config.bg} rounded-full flex-center mx-auto mb-4`}>
          <Icon className={`w-8 h-8 ${config.color}`} />
        </div>

        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
          {title}
        </h3>

        <p className="text-secondary-600 mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={config.btnVariant}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;