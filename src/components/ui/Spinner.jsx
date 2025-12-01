import { FiLoader } from "react-icons/fi";

export default function Spinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <FiLoader
      className={`animate-spin text-primary ${sizes[size]} ${className}`}
    />
  );
}
