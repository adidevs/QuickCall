"use client";
import React, { createContext, useContext, useState } from "react";

type CallStatusContextType = {
  isCallActive: boolean;
  setCallActive: (status: boolean) => void;
};

const CallStatusContext = createContext<CallStatusContextType | undefined>(
  undefined,
);

export const CallStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const setCallActive = (status: boolean) => {
    setIsCallActive(status);
  };

  return (
    <CallStatusContext.Provider value={{ isCallActive, setCallActive }}>
      {children}
    </CallStatusContext.Provider>
  );
};

export const useCallStatus = () => {
  const context = useContext(CallStatusContext);
  if (context === undefined) {
    throw new Error("useCallStatus must be used within a CallStatusProvider");
  }
  return context;
};
