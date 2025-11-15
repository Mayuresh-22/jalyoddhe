import { useState, useEffect, useRef } from "react";
import { FaComments } from "react-icons/fa";

const ChatAgent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const fullMessage = "Hi there! 👋 How are you today?";

  const typingTimeoutRef = useRef(null);
  const indexRef = useRef(0);
  const isTypingRef = useRef(false);
  
  {/* Popup Effects */}
  useEffect(() => {
    const showMessage = () => setShowPopup(true);
    const initialTimer = setTimeout(showMessage, 1500);
    const interval = setInterval(showMessage, 900000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!showPopup) return;
    const hideTimer = setTimeout(() => setShowPopup(false), 5000);
    return () => clearTimeout(hideTimer);
  }, [showPopup]);

  useEffect(() => {
    if (!showPopup) return;

    setMessage("");
    indexRef.current = 0;

    if (isTypingRef.current) return;
    isTypingRef.current = true;

    const typeNext = () => {
      const i = indexRef.current;
      if (i < fullMessage.length) {
        setMessage((prev) => prev + fullMessage.charAt(i));
        indexRef.current = i + 1;
        typingTimeoutRef.current = setTimeout(typeNext, 50);
      } else {
        isTypingRef.current = false;
      }
    };

    typingTimeoutRef.current = setTimeout(typeNext, 50);

    return () => {
      clearTimeout(typingTimeoutRef.current);
      isTypingRef.current = false;
    };
  }, [showPopup]);

  const handleChatClick = () => {
    window.location.href = "#chat-agent";
  };

  return (
    <div className="fixed bottom-[9vh] right-6 z-[2000] flex flex-col items-end">
      {/* Popup Message */}
      {showPopup && (
        <div className="mb-3 max-w-[260px] bg-white/30 backdrop-blur-2xl border border-white/40 text-gray-800 rounded-3xl shadow-lg px-4 py-3 text-sm animate-fade-in">
          <p className="leading-snug font-medium">{message}</p>
        </div>
      )}

      {/* Floating Chat Button */}
      <button
        onClick={handleChatClick}
        className="!w-14 !h-14 !rounded-full !bg-white/20 !backdrop-blur-2xl !border !border-white/30 !text-white !shadow-[0_4px_20px_rgba(0,0,0,0.2)] !hover:shadow-[0_6px_25px_rgba(0,0,0,0.3)] !flex !items-center !justify-center !transition-all !duration-300"
        title="Chat with Assistant"
      >
        <FaComments className="text-2xl text-[#ffffff]" />
      </button>
    </div>
  );
};

export default ChatAgent;
