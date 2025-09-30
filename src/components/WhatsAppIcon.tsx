"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppIcon() {
  const [isHovered, setIsHovered] = useState(false);
  
  const phoneNumber = "08427383381";
  const whatsappMessage = "Hello! I would like to know more about Yamrajdham Temple.";
  const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Simple Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
            <div className="text-center">
              <div className="font-semibold">Contact Us</div>
              <div className="text-xs text-gray-300">+91 {phoneNumber.slice(0, 5)} {phoneNumber.slice(5)}</div>
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
          </div>
        )}

        {/* Simple WhatsApp Button */}
        <div className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-colors duration-200">
          <MessageCircle className="w-6 h-6" />
        </div>
      </a>
    </div>
  );
}
