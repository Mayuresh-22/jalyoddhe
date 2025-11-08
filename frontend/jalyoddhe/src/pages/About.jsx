import React from "react";
import { FaBullseye, FaEye, FaCogs, FaUsers, FaEnvelope } from "react-icons/fa";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="!flex !flex-col !min-h-screen !bg-gradient-to-b !from-[#031217] !via-[#042029] !to-[#021014] !text-white inter-300">
      
      {/* Main Content */}
      <div className="!flex-1 !flex !flex-col !items-center !justify-center !pt-20">
        <div className="!max-w-10xl w-[94%] !text-center !bg-white/10 !backdrop-blur-xl !rounded-4xl !shadow-[0_8px_32px_rgba(0,0,0,0.25)] !p-10 md:!p-14">
          
          {/* Title */}
          <h1 className="!text-2xl md:!text-3xl !font-semibold !mb-10 !text-white">
            About <span className="!text-[#0077b6]/100">Jalyoddhe</span>
          </h1>

          {/* Introduction */}
          <p className="!text-white/90 !text-base md:!text-lg !leading-relaxed !mb-6">
            <strong>Jalyoddhe</strong> is a marine debris detection and
            monitoring platform that leverages AI and satellite imagery
            to identify, analyze, and visualize pollution hotspots across India’s
            coastlines. Our platform helps organizations take data-driven
            actions to safeguard our marine ecosystems.
          </p>

          {/* Mission Section */}
          <div className="!mt-10 !text-left">
            <h2 className="!text-2xl !font-semibold !text-[#ffffff] !mb-3 !flex !items-center !gap-3">
              <span className="!flex !items-center !justify-center !w-10 !h-10 !rounded-full !bg-white/10 !text-[#0077b6] !shadow-sm !hover:shadow-md !transition-all !duration-300">
                <FaBullseye className="!text-2xl" />
              </span>
              Our Mission
            </h2>
            <p className="!text-white/80 !leading-relaxed">
              Our mission is to empower communities and organizations with
              actionable environmental intelligence — enabling them to detect,
              respond to, and prevent marine pollution using cutting-edge
              technology. We aim to create a cleaner, healthier, and more
              resilient ocean for future generations.
            </p>
          </div>

          {/* Vision Section */}
          <div className="!mt-8 !text-left">
            <h2 className="!text-2xl !font-semibold !text-[#ffffff] !mb-3 !flex !items-center !gap-3">
              <span className="!flex !items-center !justify-center !w-10 !h-10 !rounded-full !bg-white/10 !text-[#0077b6] !shadow-sm !hover:shadow-md !transition-all !duration-300">
                <FaEye className="!text-2xl" />
              </span>
              Our Vision
            </h2>
            <p className="!text-white/80 !leading-relaxed">
              To become a global leader in marine environmental monitoring,
              driving large-scale awareness and action through AI-driven
              sustainability analytics and satellite-based insights.
            </p>
          </div>

          {/* Core Features */}
          <div className="!mt-10 !text-left">
            <h2 className="!text-2xl !font-semibold !text-[#ffffff] !mb-4 !flex !items-center !gap-3">
              <span className="!flex !items-center !justify-center !w-10 !h-10 !rounded-full !bg-white/10 !text-[#0077b6] !shadow-sm !hover:shadow-md !transition-all !duration-300">
                <FaCogs className="!text-2xl" />
              </span>
              What We Offer
            </h2>
            <ul className="!list-disc !list-inside !text-white/80 !space-y-2">
              <li>AI-powered satellite-based debris detection</li>
              <li>Confidence-based pollution severity mapping</li>
              <li>Real-time location tagging for cleanup operations</li>
              <li>Interactive dashboards for data visualization</li>
              <li>Actionable insights to support environmental agencies</li>
            </ul>
          </div>

          {/* Team Section */}
          <div className="!mt-12">
            <h2 className="!text-2xl !font-semibold !text-[#ffffff] !mb-6 !flex !items-center !justify-center !gap-3">
              <span className="!flex !items-center !justify-center !w-10 !h-10 !rounded-full !bg-white/10 !text-[#0077b6] !shadow-sm !hover:shadow-md !transition-all !duration-300">
                <FaUsers className="!text-2xl" />
              </span>
              Meet the Team
            </h2>
            <div className="!grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-2 !justify-items-center !gap-6">
              {[
                {
                  name: "Yashshri Mule",
                  role: "Frontend Developer",
                },
                {
                  name: "Mayuresh Choudhary",
                  role: "Backend & AI Integration",
                },
              ].map((member) => (
                <div
                  key={member.name}
                  className="!bg-white/30 !backdrop-blur-md !rounded-2xl !py-10 !w-[40vw] !shadow-lg hover:!shadow-[0_0_20px_rgba(0,119,182,0.4)] !transition-all !duration-300"
                >
                  <div className="!w-20 !h-20 !rounded-full !bg-[#0077b6]/100 !mx-auto !mb-4 !flex !items-center !justify-center !text-[#ffffff] !text-3xl !font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="!text-lg !font-semibold">{member.name}</h3>
                  <p className="!text-sm !text-white/70">{member.role}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="!mt-12 !text-center">
            <h2 className="!text-2xl !font-semibold !text-[#ffffff] !mb-3 !flex !items-center !justify-center !gap-3">
              <span className="!flex !items-center !justify-center !w-10 !h-10 !rounded-full !bg-white/10  !text-[#0077b6]/100 !shadow-sm !hover:shadow-md !transition-all !duration-300">
                <FaEnvelope className="!text-2xl" />
              </span>
              Get in Touch
            </h2>
            <p className="!text-white/80 !mb-3">
              Have questions or want to collaborate? Reach out to us at:
            </p>
            <a
              href="mailto:jalyoddhe@gmail.com"
              className="!text-[#0077b6] hover:!text-[#00b4d8] !transition-all !duration-200 !font-medium"
            >
              jalyoddhe@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
