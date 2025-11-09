import React from "react";
import { FaBullseye, FaEye, FaCogs, FaUsers, FaEnvelope } from "react-icons/fa";
import Footer from "../components/Footer";
import oceanBg from "../assets/hero.png";
import missionImg from "../assets/mission.png";
import visionImg from "../assets/vision.png";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#031217] text-white inter-300">
      {/* Hero Section */}
      <section
        className="relative h-[70vh] flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${oceanBg})` }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        <div className="relative z-10 text-center px-6 animate-fade-in">
          <h1 className="!text-4xl !md:text-5xl !font-bold mb-4 shadow-lg">
            About Jalyoddhe
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Empowering ocean warriors with AI-driven satellite intelligence to
            detect, analyze, and act against marine pollution.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-6xl mx-auto text-center py-16 px-6 md:px-10 animate-slide-up">
        <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8">
          <strong>Jalyoddhe</strong> — meaning “Ocean Warriors” — is an
          AI-powered marine debris detection platform that leverages satellite
          imagery and deep learning to identify and track pollution hotspots
          along India’s coastlines. We transform raw data into actionable
          environmental intelligence for real-world impact.
        </p>
        <div className="w-[50vw] h-[1px] bg-[#0077b6] mx-auto rounded-full"></div>
      </section>

      {/* Mission + Vision Container */}
      <section className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-4xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-5 flex flex-col animate-fade-in">

        {/* Mission Row */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Left: Text */}
          <div className="md:w-1/2 space-y-3 md:text-left">
            <h2 className="text-3xl font-semibold flex items-center justify-center md:justify-start gap-3">
              <span className="flex items-center justify-center w-15 h-15 rounded-full bg-[#0077b6]/10 text-[#0077b6]">
                <FaBullseye />
              </span>
              Our Mission
            </h2>
            <p className="text-white/80 leading-relaxed">
              To empower coastal defenders, researchers, and environmental
              agencies with precise, real-time insights. We aim to simplify
              complex satellite data into meaningful stories that spark action
              and accelerate ocean cleanup efforts.
            </p>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/3 flex justify-end">
            <img
              src={missionImg}
              alt="Mission"
              className="w-[40%] md:w-[45%] lg:w-[40%] object-contain transition-all duration-500 hover:scale-102"
            />
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/10 my-6"></div>

        {/* Vision Row */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Left: Image */}
          <div className="md:w-1/3 flex justify-center">
            <img
              src={visionImg}
              alt="Vision"
              className="w-[45%] md:w-[45%] lg:w-[40%] object-contain transition-all duration-500 hover:scale-102"
            />
          </div>

          {/* Right: Text */}
          <div className="md:w-1/2 space-y-3 md:text-left">
            <h2 className="text-3xl font-semibold flex items-center justify-center md:justify-start gap-3">
              <span className="flex items-center justify-center w-15 h-15 rounded-full bg-[#0077b6]/10 text-[#0077b6]">
                <FaEye />
              </span>
              Our Vision
            </h2>
            <p className="text-white/80 leading-relaxed">
              We envision a future where every coastline is monitored and
              protected through AI and satellite-driven insights. Our goal is to
              make marine conservation data-accessible, transparent, and
              impactful — for everyone.
            </p>
          </div>
        </div>

        <div className="w-full h-[1px] bg-white/10 my-6"></div>

        {/* What We Do */}
        <section className="max-w-full animate-fade-in text-center">
          <h2 className="!text-3xl font-semibold !mb-6 flex items-center gap-3">
            <span className="flex items-center justify-center w-15 h-15 rounded-full bg-[#0077b6]/10 text-[#0077b6]">
              <FaCogs />
            </span>
            What We Do
          </h2>

          {/* 2 cards per row layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-base text-white/80">
            {[
              "AI-powered debris detection using satellite data",
              "Confidence-based classification of marine pollution",
              "Geospatial mapping for targeted cleanup",
              "Data-driven insights for NGOs and policymakers",
              "Real-time monitoring of pollution trends",
              "Supporting SDG 14 — Life Below Water",
            ].map((text, i) => (
              <div
                key={i}
                className="bg-white/10 hover:bg-white/20 rounded-3xl p-6 shadow-md transition-all duration-300 hover:scale-[1.01]"
              >
                {text}
              </div>
            ))}
          </div>
        </section>

        <div className="w-full h-[1px] bg-white/10 my-6"></div>

        {/* Team Section */}
        <section className="max-w-full animate-slide-up">
          <h2 className="text-3xl font-semibold mb-15 flex items-center gap-3">
            <span className="flex items-center justify-center w-15 h-15 rounded-full bg-[#0077b6]/10 text-[#0077b6]">
              <FaUsers />
            </span>
            Meet the Team
          </h2>

          {/* Bigger team cards */}
          <div className="!grid grid-cols-1 sm:grid-cols-2 justify-items-center ">
            {[
              { name: "Yashshri Mule", role: "Frontend Developer" },
              { name: "Mayuresh Choudhary", role: "Backend & AI Engineer" },
            ].map((member) => (
              <div
                key={member.name}
                className="!bg-white/15 !rounded-3xl p-5 !w-[95%] !md:w-[75%] !text-center !transition-all !duration-300 hover:scale-[1.01]"
              >
                <div className="w-20 h-20 rounded-full bg-[#0077b6] mx-auto mb-5 flex items-center justify-center text-white text-4xl font-semibold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="!text-2xl !font-medium">{member.name}</h3>
                <p className="!text-sm !text-white/70">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full h-[1px] bg-white/10 my-6"></div>

        {/* Contact Section */}
        <section className="!text-left animate-fade-in">
          <div className="!flex !items-center !gap-3 !mb-3">
            <h2 className="text-3xl font-semibold mb-15 flex items-center gap-3">
              <span className="flex items-center justify-center w-15 h-15 rounded-full bg-[#0077b6]/10 text-[#0077b6]">
                <FaEnvelope />
              </span>
              Get in Touch
            </h2>
          </div>

          <div className="!flex !flex-wrap !items-center !gap-2 !text-white/80">
            <p className="!text-white/80 !text-base">
              Have questions or collaboration ideas? Reach out to us at{" "}
              <a
                href="mailto:jalyoddhe@gmail.com"
                className="!text-[#0077b6] hover:!text-[#005c8a] !transition-all !duration-200 !font-medium"
              >
                jalyoddhe@gmail.com
              </a>
            </p>
          </div>
        </section>
      </section>
    </div>
  );
};

export default About;
