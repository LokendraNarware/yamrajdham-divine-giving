"use client";

import React from "react";

// Simple fallback Toaster component that doesn't cause runtime errors
export function Toaster() {
  return (
    <div 
      id="toaster-container" 
      className="fixed top-0 right-0 z-50 p-4"
      style={{ display: 'none' }}
    >
      {/* This is a placeholder toaster that won't cause runtime errors */}
    </div>
  );
}
