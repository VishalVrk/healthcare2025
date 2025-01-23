import React from "react";

const TreatmentRecommendationEngine = () => {

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div style={{ width: "100%", height: "100vh", border: "none" }}>
      <iframe
        src={`https://healthcare2025.vercel.app/TreatmentRecommendationEngine.html`}
        title="Embedded HTML"
        style={{ width: "100%", height: "100%", border: "none" }}
      ></iframe>
      </div>
    </div>
  );
};

export default TreatmentRecommendationEngine;