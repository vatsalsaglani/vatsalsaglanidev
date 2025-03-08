"use client";

import { useState, useEffect, useRef } from "react";
import { useWindow } from "@/context/WindowContext"; // Import window context
import GitHubActivityWidget from "./widgets/GitHubActivityWidget";
import AINewsWidget from "./widgets/AINewsWidget";
import WeatherWidget from "./widgets/WeatherWidget";
import CPUMemoryWidget from "./widgets/CPUMemoryWidget";
import { motion, AnimatePresence } from "framer-motion";

export default function WidgetContainer() {
  // Use null as initial state to indicate we don't know the window size yet
  const [windowSize, setWindowSize] = useState(null);
  const [activeWidgetIndex, setActiveWidgetIndex] = useState(0);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // Only determine isMobile after client-side hydration
  const [isMounted, setIsMounted] = useState(false);

  // Track GitHub widget expanded state
  const [isGitHubExpanded, setIsGitHubExpanded] = useState(false);
  
  // Get window context to check if any windows are open
  const { windows, windowOrder } = useWindow();
  
  // Check if any windows are open
  const areWindowsOpen = windowOrder.some(id => windows[id]?.isOpen && !windows[id]?.isMinimized);

  // List of available widgets
  const widgets = [
    {
      id: "githubActivity",
      component: (
        <GitHubActivityWidget onExpandChange={handleGitHubExpandChange} />
      ),
    },
    { id: "aiNews", component: <AINewsWidget /> },
    { id: "weather", component: <WeatherWidget /> },
    { id: "cpuMemory", component: <CPUMemoryWidget /> },
  ];

  // Handle GitHub widget expand/collapse
  function handleGitHubExpandChange(expanded) {
    setIsGitHubExpanded(expanded);
  }

  // Track window size for responsive positioning and set mounted state
  useEffect(() => {
    setIsMounted(true);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Wait for client-side hydration before rendering window-dependent content
  if (!isMounted) {
    return null; // Return nothing during SSR and initial hydration
  }

  // Now we can safely determine if it's mobile
  const isMobile = windowSize?.width < 768;

  // Calculate positions and sizes for desktop bento layout
  const getWidgetLayout = () => {
    const padding = 20; // Padding from screen edges
    const widgetWidth = 288; // 72 * 4 = 288px (w-72 plus some padding)
    const widgetGap = 16; // Gap between widgets

    // Column positions
    const leftColumnX = padding;
    const middleColumnX = padding + widgetWidth + widgetGap;
    const rightColumnX = middleColumnX + widgetWidth + widgetGap;

    // Calculate heights based on expanded state
    const totalHeight = windowSize.height - 160; // Subtract space for header and padding
    const githubHeight = isGitHubExpanded
      ? Math.floor(totalHeight * 0.67)
      : Math.floor(totalHeight * 0.5);
    const weatherHeight = totalHeight - githubHeight - widgetGap;

    // Calculate Y positions
    const topY = 80; // Fixed top position
    const bottomY = topY + githubHeight + widgetGap;

    return {
      github: {
        x: leftColumnX,
        y: topY,
        height: githubHeight,
        width: widgetWidth,
      },
      aiNews: {
        x: middleColumnX,
        y: topY,
        height: totalHeight,
        width: widgetWidth,
      },
      weather: {
        x: leftColumnX,
        y: bottomY,
        height: weatherHeight,
        width: widgetWidth,
      },
      cpuMemory: {
        x: rightColumnX,
        y: topY,
        height: totalHeight,
        width: widgetWidth,
      },
    };
  };

  const layout = getWidgetLayout();

  // Handle touch start event
  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  // Handle touch move event
  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    const swipeDistance = touchEndY.current - touchStartY.current;
    const minSwipeDistance = 50; // Minimum distance to register as a swipe

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe down - go to previous widget
        setActiveWidgetIndex((prev) =>
          prev > 0 ? prev - 1 : widgets.length - 1
        );
      } else {
        // Swipe up - go to next widget
        setActiveWidgetIndex((prev) =>
          prev < widgets.length - 1 ? prev + 1 : 0
        );
      }
    }
  };

  // Navigate to specific widget
  const goToWidget = (index) => {
    setActiveWidgetIndex(index);
  };

  // Determine z-index based on window state - below windows when windows are open
  const containerZIndex = areWindowsOpen ? 1 : 5;
  
  // Determine pointer events based on window state
  const pointerEventsClass = areWindowsOpen ? "pointer-events-none" : "pointer-events-auto";

  // For desktop view, render a single container with positioned widgets
  if (!isMobile) {
    return (
      <div className={`fixed inset-0 ${pointerEventsClass}`} style={{ zIndex: containerZIndex }}>
        {/* GitHub Activity Widget */}
        <motion.div
          className={`absolute ${!areWindowsOpen ? "pointer-events-auto" : ""}`}
          style={{
            left: `${layout.github.x}px`,
            top: `${layout.github.y}px`,
            width: `${layout.github.width}px`,
          }}
          animate={{
            height: `${layout.github.height}px`,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
        >
          <GitHubActivityWidget onExpandChange={handleGitHubExpandChange} />
        </motion.div>
        
        {/* AI News Widget */}
        <div
          className={`absolute ${!areWindowsOpen ? "pointer-events-auto" : ""}`}
          style={{
            left: `${layout.aiNews.x}px`,
            top: `${layout.aiNews.y}px`,
            width: `${layout.aiNews.width}px`,
            height: `${layout.aiNews.height}px`,
          }}
        >
          <AINewsWidget />
        </div>
        
        {/* Weather Widget */}
        <motion.div
          className={`absolute ${!areWindowsOpen ? "pointer-events-auto" : ""}`}
          style={{
            left: `${layout.weather.x}px`,
            width: `${layout.weather.width}px`,
          }}
          animate={{
            top: `${layout.weather.y}px`,
            height: `${layout.weather.height}px`,
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
        >
          <WeatherWidget />
        </motion.div>
        
        {/* CPU/Memory Widget */}
        <div
          className={`absolute ${!areWindowsOpen ? "pointer-events-auto" : ""}`}
          style={{
            left: `${layout.cpuMemory.x}px`,
            top: `${layout.cpuMemory.y}px`,
            width: `${layout.cpuMemory.width}px`,
            height: `${layout.cpuMemory.height}px`,
          }}
        >
          <CPUMemoryWidget />
        </div>
      </div>
    );
  }

  // For mobile, render a carousel of widgets
  return (
    <div className="fixed inset-0" style={{ zIndex: 5 }}>
      {" "}
      {/* Changed from -z-10 to explicit zIndex: 5 */}
      <div
        className="absolute left-4 right-4 top-20"
        onTouchStart={(e) => {
          // Don't capture touch events from buttons or interactive elements
          if (e.target.closest('button, a, [role="button"], .clickable, .interactive')) {
            return;
          }
          handleTouchStart(e);
        }}
        onTouchMove={(e) => {
          // Don't capture touch events from buttons or interactive elements
          if (e.target.closest('button, a, [role="button"], .clickable, .interactive')) {
            return;
          }
          handleTouchMove(e);
        }}
        onTouchEnd={(e) => {
          // Don't capture touch events from buttons or interactive elements
          if (e.target.closest('button, a, [role="button"], .clickable, .interactive')) {
            return;
          }
          handleTouchEnd();
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeWidgetIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {widgets[activeWidgetIndex].component}
          </motion.div>
        </AnimatePresence>

        {/* Widget navigation indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {widgets.map((widget, index) => (
            <button
              key={widget.id}
              onClick={(e) => {
                e.stopPropagation();
                goToWidget(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeWidgetIndex
                  ? "bg-white scale-125"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to widget ${index + 1}`}
            />
          ))}
        </div>

        {/* Swipe indicator */}
        <div className="text-center mt-2 text-white/60 text-xs">
          Swipe up/down to navigate
        </div>
      </div>
    </div>
  );
}
