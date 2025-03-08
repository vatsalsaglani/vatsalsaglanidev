"use client";

import { createContext, useContext, useState, useCallback } from "react";

const WindowContext = createContext({
  windows: {},
  windowOrder: [],
  openWindow: () => {},
  closeWindow: () => {},
  minimizeWindow: () => {},
  maximizeWindow: () => {},
  focusWindow: () => {},
  isWindowOpen: () => false,
  isWindowMinimized: () => false,
  isWindowMaximized: () => false,
  getWindowZIndex: () => 10,
  updateWindowPosition: () => {},
  updateWindowSize: () => {},
  getActiveWindowId: () => null,
});

export function WindowProvider({ children }) {
  // Track all window states
  const [windows, setWindows] = useState({});
  // Track window stacking order (last item is top-most window)
  const [windowOrder, setWindowOrder] = useState([]);
  // Base z-index for windows - using a MUCH higher value
  const baseZIndex = 9000; // Changed from 1000 to 9000

  // Get active window ID (top-most window)
  const getActiveWindowId = useCallback(() => {
    // Find the last open, non-minimized window in the stack
    for (let i = windowOrder.length - 1; i >= 0; i--) {
      const id = windowOrder[i];
      if (windows[id]?.isOpen && !windows[id]?.isMinimized) {
        return id;
      }
    }
    return null;
  }, [windows, windowOrder]);

  // Open a window
  const openWindow = useCallback((id, initialProps = {}) => {
    console.log(`Opening window: ${id}`);
    
    // If window already exists and is open, just focus it
    if (windows[id]?.isOpen) {
      focusWindow(id);
      return;
    }
    
    // Create new window state
    setWindows(prev => ({
      ...prev,
      [id]: {
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position: initialProps.position || { x: 50, y: 50 },
        size: initialProps.size || { width: 600, height: 400 },
        ...initialProps,
      },
    }));
    
    // Add to window order (or move to top if already exists)
    setWindowOrder(prev => {
      const newOrder = prev.filter(windowId => windowId !== id);
      return [...newOrder, id];
    });
    
    console.log(`Window ${id} opened and focused`);
  }, [windows]);

  // Close a window
  const closeWindow = useCallback((id) => {
    console.log(`Closing window: ${id}`);
    
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }));
    
    // No need to remove from windowOrder, just mark as closed
  }, []);

  // Minimize a window
  const minimizeWindow = useCallback((id) => {
    console.log(`Minimizing window: ${id}`);
    
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }));
  }, []);

  // Maximize a window
  const maximizeWindow = useCallback((id) => {
    console.log(`Maximizing/restoring window: ${id}`);
    
    // Focus the window first
    focusWindow(id);
    
    // Then toggle maximize state
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id]?.isMaximized,
      },
    }));
  }, []);

  // Focus a window (bring to front)
  const focusWindow = useCallback((id) => {
    console.log(`Focusing window: ${id}`);
    
    // Check if window exists and is open
    if (!windows[id]?.isOpen) {
      console.log(`Cannot focus window ${id} - not open`);
      return;
    }
    
    // If window is minimized, restore it
    if (windows[id]?.isMinimized) {
      setWindows(prev => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: false,
        },
      }));
    }
    
    // Move window to top of stack
    setWindowOrder(prev => {
      const newOrder = prev.filter(windowId => windowId !== id);
      return [...newOrder, id];
    });
    
    console.log(`Window ${id} moved to top of stack`);
  }, [windows]);

  // Check if window is open
  const isWindowOpen = useCallback((id) => {
    return windows[id]?.isOpen || false;
  }, [windows]);

  // Check if window is minimized
  const isWindowMinimized = useCallback((id) => {
    return windows[id]?.isMinimized || false;
  }, [windows]);

  // Check if window is maximized
  const isWindowMaximized = useCallback((id) => {
    return windows[id]?.isMaximized || false;
  }, [windows]);

  // Get window z-index based on its position in the stack
  const getWindowZIndex = useCallback((id) => {
    const index = windowOrder.indexOf(id);
    if (index === -1) return baseZIndex;
    return baseZIndex + index;
  }, [windowOrder, baseZIndex]);

  // Update window position
  const updateWindowPosition = useCallback((id, position) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        position,
      },
    }));
  }, []);

  // Update window size
  const updateWindowSize = useCallback((id, size) => {
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        size,
      },
    }));
  }, []);

  return (
    <WindowContext.Provider
      value={{
        windows,
        windowOrder,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        focusWindow,
        isWindowOpen,
        isWindowMinimized,
        isWindowMaximized,
        getWindowZIndex,
        updateWindowPosition,
        updateWindowSize,
        getActiveWindowId,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export const useWindow = () => useContext(WindowContext);
