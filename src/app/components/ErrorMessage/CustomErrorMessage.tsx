import React from "react";

interface CustomErrorMessageProps {
  message?: string;
}

const CustomErrorMessage: React.FC<CustomErrorMessageProps> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="custom-error-message text-[#FA5512] font-bold mb-5">
      {message}
    </div>
  );
};

export default CustomErrorMessage;
