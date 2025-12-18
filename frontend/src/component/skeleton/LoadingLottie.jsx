import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/Loading animation blue.json";

const LoadingLottie = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Lottie
        animationData={loadingAnimation}
        loop
        style={{ height: 300, width: 300 }}
      />
    </div>

  );
};

export default LoadingLottie;