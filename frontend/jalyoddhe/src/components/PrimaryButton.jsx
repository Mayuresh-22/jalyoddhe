import React from "react";

const PrimaryButton = ({
  text = "Click Me",
  onClick,
  disabled = false,
  wide = false, // fixed width (e.g., for DebrisCards)
  fullWidth = false, // full container width (e.g., for forms)
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${
        fullWidth
          ? "!w-full"
          : wide
          ? "!min-w-[180px]"
          : "" // default auto width
      } 
      !px-5 !py-2.5 !rounded-3xl 
      !text-white !text-sm !font-medium !shadow-md 
      !transition-all !duration-300 
      ${
        disabled
          ? "!bg-gray-600 !cursor-not-allowed"
          : "!bg-[#0077b6] hover:!bg-[#005c8a] hover:!shadow-lg hover:!scale-[1.03]"
      } 
      ${className}`}
    >
      {disabled ? "Processing..." : text}
    </button>
  );
};

export default PrimaryButton;
