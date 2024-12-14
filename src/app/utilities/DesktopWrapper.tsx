import React from "react";

interface DesktopWrapperProps {
  children: React.ReactNode;
  bgColor?: string;
}

const DesktopWrapper: React.FC<DesktopWrapperProps> = ({
  children,
  bgColor,
}) => {
  return (
    <div className={`h-screen w-screen flex flex-col ${bgColor && bgColor}`}>
      {children}
    </div>
  );
};

export default DesktopWrapper;
