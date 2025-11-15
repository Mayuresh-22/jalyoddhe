
const SecondaryButton = ({
  text = "Click Me",
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`!min-w-[180px] !px-5 !py-2.5 !rounded-3xl 
        !bg-transparent !border !border-white/30 !text-white 
        !text-sm !font-medium !transition-all !duration-300 
        hover:!bg-white/20 hover:!shadow-md hover:!scale-[1.03]
        ${disabled ? "!opacity-60 !cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
