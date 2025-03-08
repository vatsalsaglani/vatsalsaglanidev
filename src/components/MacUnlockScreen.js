"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import Image from "next/image";

const MacUnlockScreen = ({ onUnlocked }) => {
  const { theme } = useTheme();
  const [showWelcome, setShowWelcome] = useState(false);
  const [hasVisited, setHasVisited] = useState(false);
  const [loading, setLoading] = useState(true);
  const wallpaperPath = `/assets/wallpapers/Sequoia${theme === 'light' ? 'Light' : 'Dark'}.png`;
  
  useEffect(() => {
    // Check if user has visited before
    if (typeof window !== 'undefined') {
      const visited = localStorage.getItem('hasVisitedPortfolio');
      setHasVisited(!!visited);
      
      if (visited) {
        // If already visited, just show a brief loading screen
        setTimeout(() => {
          onUnlocked();
        }, 1000);
      } else {
        // First time visitor, show full experience
        setLoading(false);
      }
    }
  }, [onUnlocked]);
  
  const handleStartJourney = () => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasVisitedPortfolio', 'true');
    }
    
    setShowWelcome(true);
    
    // Show welcome screen then unlock
    setTimeout(() => {
      if (onUnlocked) onUnlocked();
    }, 1200);
  };
  
  // If we're just showing a loading screen for returning visitors
  if (hasVisited) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={wallpaperPath}
            alt="Wallpaper"
            fill
            priority
            className="object-cover"
            quality={100}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="z-10 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-light-accent dark:border-t-dark-accent rounded-full animate-spin mb-4"></div>
          <div className="text-white text-xl font-medium drop-shadow-md">Loading Portfolio...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center">
      {/* Wallpaper background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={wallpaperPath}
          alt="Wallpaper"
          fill
          priority
          className="object-cover"
          quality={100}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      </div>
      
      {!showWelcome ? (
        <div className="flex flex-col items-center z-10">
          {/* User Avatar */}
          <div className="w-24 h-24 mb-5 rounded-full overflow-hidden border-[3px] border-white/20 shadow-lg bg-light-surface/80 dark:bg-dark-surface/80 p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                src="/assets/vatsal.JPG" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Username */}
          <div className="mb-6 text-white text-2xl font-medium drop-shadow-md">
            Vatsal Saglani
          </div>
          
          {/* Start Journey Button */}
          <button 
            onClick={handleStartJourney}
            className="px-6 py-2.5 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300 rounded-full border border-white/30 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Begin Experience
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center text-white drop-shadow-md z-10">
          <div className="text-4xl mb-4">Welcome</div>
          <div className="text-xl font-light">to Vatsal's Portfolio</div>
        </div>
      )}
    </div>
  );
};

export default MacUnlockScreen; 