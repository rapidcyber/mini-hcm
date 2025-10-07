import React from "react";
import { motion as Motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
// import { useMutation } from "@tanstack/react-query";
// import { addTable } from "../../https";
// import { enqueueSnackbar } from "notistack"
// import AddTable from "./forms/Table";
// import AddCategory from "./forms/Category";
// import AddDishes from "./forms/Dishes";

const Modal = ({ setIsModalOpen, modal, selectedItem=null }) => {

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#262626] p-6 rounded-lg shadow-lg w-96"
      >
        {/* Modal Header */}

        <div className="flex justify-between item-center mb-4">
          <h2 className="text-[#f5f5f5] text-xl font-semibold">Add {modal.charAt(0).toUpperCase() + modal.slice(1)}</h2>
          <button
            onClick={handleCloseModal}
            className="text-[#f5f5f5] hover:text-red-500"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        {/* Modal Body. Add other forms here based on the modal prop */}
        {modal === "activities" && <AddPunch setIsModalOpen={setIsModalOpen} selectedItem={selectedItem} />}
      </Motion.div>
    </div>
  );
};

export default Modal;
