import React, { useState } from 'react';
import { PhoneMockup } from './PhoneMockup';
import { Monitor, Smartphone } from 'lucide-react';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [viewMode, setViewMode] = useState<'phone' | 'fullscreen'>('phone');

  if (viewMode === 'fullscreen') {
    return (
      <div className="h-screen bg-background overflow-hidden relative">
        {/* View Toggle */}
        <button
          onClick={() => setViewMode('phone')}
          className="absolute top-4 right-4 z-50 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200"
          title="Switch to phone mockup view"
        >
          <Smartphone size={20} className="text-gray-700" />
        </button>
        
        {/* Full App */}
        <div className="h-full flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* View Toggle */}
      <button
        onClick={() => setViewMode('fullscreen')}
        className="absolute top-4 right-4 z-50 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200"
        title="Switch to fullscreen view"
      >
        <Monitor size={20} className="text-gray-700" />
      </button>
      
      {/* Phone Mockup */}
      <PhoneMockup>
        <div className="h-full bg-background overflow-hidden">
          <div className="h-full flex flex-col">
            {children}
          </div>
        </div>
      </PhoneMockup>
    </div>
  );
}