// toastHelper.ts
import { toast } from "react-toastify";

export type ToastType = "error" | "success" | "info";

export const showToast = (message: string, type: ToastType) => {
  switch (type) {
    case "error":
      toast.error(message);
      break;
    case "success":
      toast.success(message);
      break;
    default:
      toast.info(message);
  }
};
