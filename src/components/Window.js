"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Window({
  id,
  title,
  children,
  isOpen,
  isMinimized,
  isMaximized,
  isActive,
  zIndex,
  initialSize = { width: 600, height: 400 },
  initialPosition = { x: 50, y: 50 },
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onPositionChange,
  onSizeChange,
}) {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const windowRef = useRef(null);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle window click
  const handleWindowClick = (e) => {
    if (!isActive) {
      onFocus(id);
    }
  };

  // Handle drag start
  const handleDragStart = (e) => {
    if (isMaximized) return;

    // Prevent text selection during drag
    e.preventDefault();

    // Calculate offset from mouse position to window corner
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setIsDragging(true);

    // Focus window
    if (!isActive) {
      onFocus(id);
    }
  };

  // Handle resize start with direction
  const handleResizeStart = (e, direction) => {
    if (isMaximized) return;

    // Prevent text selection during resize
    e.preventDefault();

    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      left: position.x,
      top: position.y,
    });

    setResizeDirection(direction);
    setIsResizing(true);

    // Focus window
    if (!isActive) {
      onFocus(id);
    }
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Bound the window position to the viewport
        const boundedX = Math.max(
          0,
          Math.min(newX, window.innerWidth - size.width)
        );
        const boundedY = Math.max(
          0,
          Math.min(newY, window.innerHeight - size.height)
        );

        setPosition({ x: boundedX, y: boundedY });
      }

      if (isResizing) {
        let newWidth = size.width;
        let newHeight = size.height;
        let newX = position.x;
        let newY = position.y;

        // Calculate new dimensions based on resize direction
        if (resizeDirection.includes('e')) {
          newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
        }
        if (resizeDirection.includes('w')) {
          const deltaX = resizeStart.x - e.clientX;
          newWidth = Math.max(300, resizeStart.width + deltaX);
          newX = resizeStart.left - deltaX;
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));
        }
        if (resizeDirection.includes('n')) {
          const deltaY = resizeStart.y - e.clientY;
          newHeight = Math.max(200, resizeStart.height + deltaY);
          newY = resizeStart.top - deltaY;
        }

        // Bound the window size and position
        newWidth = Math.min(newWidth, window.innerWidth - newX);
        newHeight = Math.min(newHeight, window.innerHeight - newY);
        newX = Math.max(0, newX);
        newY = Math.max(0, newY);

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onPositionChange(id, position);
      }
      if (isResizing) {
        setIsResizing(false);
        setResizeDirection(null);
        onSizeChange(id, size);
        onPositionChange(id, position);
      }
    };

    // Add event listeners to document instead of window
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    id,
    isDragging,
    isResizing,
    dragOffset,
    resizeStart,
    position,
    size,
    onPositionChange,
    onSizeChange,
    resizeDirection,
  ]);

  // Update position and size when window props change
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setPosition(initialPosition);
      setSize(initialSize);
    }
  }, [initialPosition, initialSize, isDragging, isResizing]);

  if (!isOpen) return null;

  // Calculate height for maximized windows in mobile view to avoid dock overlap
  const mobileMaxHeight = isMobile ? "calc(100vh - 48px - 80px)" : "calc(100vh - 48px)";

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.1 }}
          style={{
            position: "fixed",
            top: isMaximized ? "48px" : position.y,
            left: isMaximized ? 0 : position.x,
            zIndex,
            width: isMaximized ? "100%" : `${size.width}px`,
            height: isMaximized ? (isMobile ? mobileMaxHeight : "calc(100vh - 48px)") : `${size.height}px`,
          }}
          className={`${
            isMaximized ? "" : "rounded-lg"
          } sm:static sm:mobile-window`}
          onClick={handleWindowClick}
        >
          <div
            ref={windowRef}
            className={`w-full h-full overflow-hidden flex flex-col ${
              isMaximized ? "" : "rounded-lg"
            } 
            ${isActive ? "shadow-lg" : "shadow-md"}
            backdrop-blur-md
            bg-white/85 dark:bg-[#1e1e1e]/85
            border border-gray-200/50 dark:border-gray-700/50
            ${
              isActive
                ? "bg-white/90 dark:bg-[#1e1e1e]/90 border-gray-300/60 dark:border-gray-600/60"
                : "bg-white/80 dark:bg-[#1e1e1e]/80 border-gray-200/40 dark:border-gray-700/40"
            }
            relative
            `}
          >
            {/* Window Title Bar */}
            <div
              className={`window-title-bar h-8 flex items-center justify-between px-3 cursor-move select-none
              bg-gray-100/90 dark:bg-[#252526]/90
              border-b border-gray-200/50 dark:border-gray-700/50
              ${
                isActive
                  ? "bg-gray-100/95 dark:bg-[#323233]/95"
                  : "bg-gray-50/90 dark:bg-[#252526]/90"
              }`}
              onMouseDown={handleDragStart}
            >
              <div className="window-controls flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(id);
                  }}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMinimize(id);
                  }}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMaximize(id);
                  }}
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                />
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {title}
              </div>
              <div className="w-16" />
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto bg-white/60 dark:bg-[#1e1e1e]/60 hide-scrollbar mobile-content">
              {children}
            </div>

            {/* Resize Handles - hide when maximized or on small screens */}
            {!isMaximized && (
              <>
                {/* Corner handles */}
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize hidden sm:block z-10"
                  onMouseDown={(e) => handleResizeStart(e, 'se')}
                />
                <div
                  className="absolute bottom-0 left-0 w-6 h-6 cursor-sw-resize hidden sm:block z-10"
                  onMouseDown={(e) => handleResizeStart(e, 'sw')}
                />
                <div
                  className="absolute top-0 right-0 w-6 h-6 cursor-ne-resize hidden sm:block z-10"
                  onMouseDown={(e) => handleResizeStart(e, 'ne')}
                />
                <div
                  className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize hidden sm:block z-10"
                  onMouseDown={(e) => handleResizeStart(e, 'nw')}
                />
                
                {/* Edge handles */}
                <div
                  className="absolute top-0 left-6 right-6 h-2 cursor-n-resize hidden sm:block z-10"
                  onMouseDown={(e) => handleResizeStart(e, 'n')}
                />
                <div
                  className="absolute bottom-0 left-6 right-6 h-2 cursor-s-resize hidden sm:block z-10"
                  onMouseDown={(e) => handleResizeStart(e, 's')}
                />
                <div
                  className="absolute left-0 top-6 bottom-6 w-2 cursor-w-resize hidden sm:block z-10"
                  onMouseDown={(e) => handleResizeStart(e, 'w')}
                />
                <div
                  className="absolute right-0 top-6 bottom-6 w-2 cursor-e-resize hidden sm:block z-10"
                  onMouseDown={(e) => handleResizeStart(e, 'e')}
                />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
