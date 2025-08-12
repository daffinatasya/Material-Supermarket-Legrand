import React from 'react';

interface PhoneMockupProps {
  children: React.ReactNode;
}

export function PhoneMockup({ children }: PhoneMockupProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      {/* Phone Frame */}
      <div className="relative transform scale-75 origin-center">
        {/* Phone Body */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3.5rem] p-2 shadow-2xl">
          {/* Screen Container */}
          <div className="relative bg-black rounded-[3rem] overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30">
              <div className="bg-black rounded-b-2xl px-8 py-2 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                  {/* Camera */}
                  <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                  {/* Speaker */}
                  <div className="w-14 h-1.5 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Screen Content */}
            <div className="relative bg-white rounded-[3rem] overflow-hidden w-[390px] h-[844px]">
              {/* Status Bar */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-transparent z-20 flex items-center justify-between px-6 pt-3">
                <div className="flex items-center space-x-1">
                  <span className="text-black text-sm font-semibold">9:41</span>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Signal bars */}
                  <div className="flex space-x-0.5">
                    <div className="w-1 h-1 bg-black rounded-full"></div>
                    <div className="w-1 h-2 bg-black rounded-full"></div>
                    <div className="w-1 h-3 bg-black rounded-full"></div>
                    <div className="w-1 h-3 bg-black rounded-full"></div>
                  </div>
                  {/* WiFi */}
                  <div className="w-4 h-3 relative">
                    <div className="absolute inset-0 border-2 border-black rounded-sm"></div>
                    <div className="absolute inset-0.5 bg-black rounded-sm"></div>
                  </div>
                  {/* Battery */}
                  <div className="w-6 h-3 border border-black rounded-sm relative">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0.5 h-1 bg-black rounded-r-sm translate-x-full"></div>
                    <div className="w-4 h-full bg-black rounded-sm"></div>
                  </div>
                </div>
              </div>
              
              {/* App Content */}
              <div className="absolute inset-0 pt-12 overflow-hidden">
                <div className="h-full w-full">
                  {children}
                </div>
              </div>
            </div>
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </div>
        
        {/* Side Buttons */}
        <div className="absolute left-[-4px] top-24 w-1.5 h-10 bg-gray-700 rounded-l-lg"></div>
        <div className="absolute left-[-4px] top-36 w-1.5 h-14 bg-gray-700 rounded-l-lg"></div>
        <div className="absolute left-[-4px] top-52 w-1.5 h-14 bg-gray-700 rounded-l-lg"></div>
        <div className="absolute right-[-4px] top-32 w-1.5 h-18 bg-gray-700 rounded-r-lg"></div>
        
        {/* Phone Reflection */}
        <div className="absolute inset-0 rounded-[3.5rem] bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none"></div>
      </div>
    </div>
  );
}