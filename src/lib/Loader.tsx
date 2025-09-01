import { Loader } from "lucide-react";
import React from "react";
import { ClockLoader, PulseLoader } from "react-spinners";

// Loader for page 
export const Loader1: React.FC = () => {
  return (
    <>
      {/* Loader container centered vertically and horizontally */}
      <div className="flex justify-center items-center h-[65vh] w-[80vw] " >
        {/* ClockLoader spinner */}
        <ClockLoader
          color="#FFD700" // Use a single color (light green) for now
          loading
          size={50}           // reduced size
          speedMultiplier={1}
        />
      </div>
    </>
  );
};