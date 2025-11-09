import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginIllustration from "../assets/hero.jpg";
import PrimaryButton from "../components/PrimaryButton"; // ✅ Import reusable button

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (email === "admin@example.com" && password === "admin123") {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid email or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="!min-h-screen !flex !items-center !justify-center !bg-gradient-to-b !from-[#031217] !via-[#021a22] !to-[#000] !text-white px-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-3xl bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        
        {/* LEFT SIDE - Illustration */}
        <div className="hidden md:flex md:w-1/2 relative items-center justify-center bg-gradient-to-br from-[#0077b6]/20 via-[#00b4d8]/20 to-transparent">
          <img
            src={loginIllustration}
            alt="Login Illustration"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031217]/80 via-transparent to-[#031217]/30"></div>
          <div className="absolute bottom-10 left-8 text-left">
            <h2 className="text-3xl font-semibold text-white mb-2">
              Welcome Back!
            </h2>
            <p className="text-[#90e0ef] text-sm max-w-xs leading-relaxed">
              Secure access to your admin dashboard. Manage marine debris data,
              analytics, and cleanup operations effortlessly.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00b4d8]/10 via-transparent to-[#90e0ef]/10 pointer-events-none"></div>

          <h2 className="!text-2xl !md:text-3xl !font-semibold !text-center !mb-6">
            Admin Login
          </h2>

          {error && (
            <p className="text-red-400 text-sm text-center mb-3 animate-pulse">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="!w-full !px-4 !py-2.5 !text-sm !rounded-xl !bg-white/10 !text-white !border !border-white/25 focus:!ring-2 focus:!ring-[#005c8a] focus:!border-transparent outline-none placeholder-gray-400 transition-all duration-300"
                placeholder="Email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="!w-full !px-4 !py-2.5 !text-sm !rounded-xl !bg-white/10 !text-white !border !border-white/25 focus:!ring-2 focus:!ring-[#005c8a] focus:!border-transparent outline-none placeholder-gray-400 transition-all duration-300"
                placeholder="Password"
              />
            </div>

            {/* ✅ Replaced old button with PrimaryButton */}
            <PrimaryButton
              text="Login"
              onClick={handleSubmit}
              disabled={isLoading}
              className="!mt-2 !w-full"
            />

            {/* Forgot Password */}
            <p className="text-right text-gray-400 text-xs mt-2 hover:text-[#005c8a] cursor-pointer transition-all duration-200">
              Forgot Password?
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
