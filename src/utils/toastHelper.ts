import { toast } from "react-toastify";

export type ToastType = "error" | "success" | "info";

const toastOptions = {
  position: "bottom-right" as const,
  autoClose: 1500, 
  // hideProgressBar: true,
  style: {
    minWidth: "150px",
    minHeight: "30px",
    padding: "8px",
    fontSize: "0.9rem",
  },
};

export const showToast = (message: string, type: ToastType) => {
  switch (type) {
    case "error":
      toast.error(message, toastOptions);
      break;
    case "success":
      toast.success(message, toastOptions);
      break;
    default:
      toast.info(message, toastOptions);
  }
};
