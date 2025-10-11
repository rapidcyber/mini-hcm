import React from "react";
import { motion } from "framer-motion";
const Motion = motion;

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#1a1a1a] rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto scrollbar-hide mx-4"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-b-[#333]">
          <h2 className="text-xl text-[#f5f5f5] font-semibold">{title}</h2>
          <button
            className="text-gray-500 text-2xl! px-3! py-1! hover:text-[#e6ff01] transition duration-300 ease-in-out"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="p-6">{children}</div>
      </Motion.div>
    </div>
  );
};

export default Modal;
