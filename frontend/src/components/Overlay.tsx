import React from "react";

const Overlay = () => {
  return (
    <div className="absolute w-full top-0 left-0 z-10 h-[100vh] bg-black flex justify-center items-center">
      <p className="text-white text-2xl">Uploading...</p>
    </div>
  );
};

export default Overlay;
