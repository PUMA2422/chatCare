import React from "react";
import logo from "../assets/logo.png";

export default function Header() {
    return (
        <div className="bg-gray-800 text-white h-16 p-4 shadow-md flex items-center justify-center">
            <div className="flex items-center space-x-3">
                {/* Logo */}
                <img
                    src={logo}
                    alt="ChatCare Logo"
                    className="max-h-25 w-auto object-contain"
                />

                {/* Title */}
                <span className="font-bold text-xl">
          ChatCare - Your AI Health Chatbot
        </span>
            </div>
        </div>
    );
}
