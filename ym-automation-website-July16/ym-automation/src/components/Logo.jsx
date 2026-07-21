import React from "react";

export default function Logo({ dark }) {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/ymlogo.png" 
        alt="YM Automation Pvt Ltd Logo"
        className="h-16 w-auto"
      />
    </div>
  );
}
