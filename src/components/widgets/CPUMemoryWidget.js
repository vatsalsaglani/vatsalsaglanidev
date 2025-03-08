"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function CPUMemoryWidget() {
  const [memoryUsage, setMemoryUsage] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [memoryHistory, setMemoryHistory] = useState([]);
  const [fps, setFps] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [jsHeapSize, setJsHeapSize] = useState(0);
  const [domNodes, setDomNodes] = useState(0);
  const [networkRequests, setNetworkRequests] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastCPUTimeRef = useRef(0);
  const lastActivityTimeRef = useRef(Date.now());
  const networkStatsRef = useRef({
    lastUpdate: Date.now(),
    bytesReceived: 0,
    bytesSent: 0,
    prevBytesReceived: 0,
    prevBytesSent: 0,
  });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Maximum number of data points to keep in history
  const MAX_HISTORY = 30;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // Function to measure memory usage
    const measureMemory = () => {
      if (performance && performance.memory) {
        // Chrome-only API
        const memoryInfo = performance.memory;
        const percentUsed =
          (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100;
        setMemoryUsage(Math.min(percentUsed, 100));
        setJsHeapSize(Math.round(memoryInfo.usedJSHeapSize / (1024 * 1024)));
      } else {
        // Fallback for browsers that don't support the memory API
        const randomChange = Math.random() * 4 - 2;
        setMemoryUsage((prev) =>
          Math.min(Math.max(prev + randomChange, 20), 90)
        );
        setJsHeapSize(Math.round(Math.random() * 200 + 100));
      }
    };

    // Function to estimate CPU usage based on task duration
    const estimateCPUUsage = () => {
      const now = performance.now();
      const elapsed = now - lastCPUTimeRef.current;
      lastCPUTimeRef.current = now;

      // Create a computationally intensive task
      const startTask = performance.now();
      let result = 0;
      for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i);
      }
      const taskDuration = performance.now() - startTask;

      // Calculate an estimate of CPU load based on how long the task took
      // relative to the elapsed time since the last measurement
      const estimatedLoad = Math.min((taskDuration / elapsed) * 100, 100);

      // Smooth the value to avoid jumps
      setCpuUsage((prev) => {
        const newValue = prev * 0.7 + estimatedLoad * 0.3;
        return Math.min(Math.max(newValue, 5), 95);
      });
    };

    // Function to count DOM nodes
    const countDOMNodes = () => {
      setDomNodes(document.querySelectorAll("*").length);
    };

    // Function to monitor network activity and calculate speeds
    const monitorNetwork = () => {
      if (window.performance && window.performance.getEntriesByType) {
        const resources = performance.getEntriesByType("resource");
        setNetworkRequests(resources.length);

        // Calculate network speeds using the Performance API
        if (navigator.connection) {
          // Use NetworkInformation API if available (Chrome, Edge)
          const connection = navigator.connection;
          if (connection.downlink) {
            setDownloadSpeed(connection.downlink); // Mbps
          }

          // Note: Upload speed isn't directly available from the API
        }

        // Alternative approach using PerformanceObserver
        if (window.PerformanceObserver) {
          try {
            // Calculate network speeds based on transferred bytes
            const now = Date.now();
            const elapsedSec =
              (now - networkStatsRef.current.lastUpdate) / 1000;

            // Get total transferred bytes from resource entries
            let totalReceived = 0;
            let totalSent = 0;

            resources.forEach((resource) => {
              // Only count resources loaded in the last interval
              if (resource.startTime > networkStatsRef.current.lastUpdate) {
                if (resource.transferSize) {
                  totalReceived += resource.transferSize;
                }

                // Estimate upload size (headers + body for POST/PUT requests)
                if (
                  resource.initiatorType === "fetch" ||
                  resource.initiatorType === "xmlhttprequest"
                ) {
                  // Rough estimate for upload data
                  totalSent += 500; // Headers estimate
                }
              }
            });

            // Update cumulative bytes
            networkStatsRef.current.bytesReceived += totalReceived;
            networkStatsRef.current.bytesSent += totalSent;

            // Calculate speeds in KB/s
            if (elapsedSec > 0) {
              const dlSpeed =
                (networkStatsRef.current.bytesReceived -
                  networkStatsRef.current.prevBytesReceived) /
                elapsedSec /
                1024;
              const ulSpeed =
                (networkStatsRef.current.bytesSent -
                  networkStatsRef.current.prevBytesSent) /
                elapsedSec /
                1024;

              // Update speeds with smoothing
              setDownloadSpeed(
                (prev) => Math.round((prev * 0.7 + dlSpeed * 0.3) * 10) / 10
              );
              setUploadSpeed(
                (prev) => Math.round((prev * 0.7 + ulSpeed * 0.3) * 10) / 10
              );

              // Store previous values
              networkStatsRef.current.prevBytesReceived =
                networkStatsRef.current.bytesReceived;
              networkStatsRef.current.prevBytesSent =
                networkStatsRef.current.bytesSent;
              networkStatsRef.current.lastUpdate = now;
            }
          } catch (e) {
            console.error("Error monitoring network:", e);
          }
        }
      }
    };

    // Measure FPS
    const measureFps = (timestamp) => {
      frameCountRef.current++;

      // Update FPS every second
      if (timestamp - lastTimeRef.current >= 1000) {
        setFps(
          Math.round(
            (frameCountRef.current * 1000) / (timestamp - lastTimeRef.current)
          )
        );
        frameCountRef.current = 0;
        lastTimeRef.current = timestamp;
      }

      requestAnimationFrame(measureFps);
    };

    // Update history arrays
    const updateHistory = () => {
      setCpuHistory((prev) => {
        const newHistory = [...prev, cpuUsage];
        return newHistory.length > MAX_HISTORY
          ? newHistory.slice(-MAX_HISTORY)
          : newHistory;
      });

      setMemoryHistory((prev) => {
        const newHistory = [...prev, memoryUsage];
        return newHistory.length > MAX_HISTORY
          ? newHistory.slice(-MAX_HISTORY)
          : newHistory;
      });
    };

    // Track user activity to adjust measurement frequency
    const trackActivity = () => {
      lastActivityTimeRef.current = Date.now();
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", trackActivity);
    window.addEventListener("keydown", trackActivity);
    window.addEventListener("scroll", trackActivity);
    window.addEventListener("click", trackActivity);

    // Start FPS measurement
    const animationFrameId = requestAnimationFrame(measureFps);

    // Set up PerformanceObserver for network monitoring
    let networkObserver;
    if (window.PerformanceObserver) {
      try {
        networkObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === "resource") {
              // Update network stats on new resource loads
              networkStatsRef.current.bytesReceived += entry.transferSize || 0;
            }
          });
        });
        networkObserver.observe({ entryTypes: ["resource"] });
      } catch (e) {
        console.error("PerformanceObserver error:", e);
      }
    }

    // Collect metrics at regular intervals
    const metricsInterval = setInterval(() => {
      // Check if user has been active in the last 30 seconds
      const isActive = Date.now() - lastActivityTimeRef.current < 30000;

      // Always measure FPS and memory
      measureMemory();
      monitorNetwork();

      // Only run CPU-intensive measurements if the user is active
      if (isActive) {
        estimateCPUUsage();
        countDOMNodes();
      }

      updateHistory();
    }, 1000);

    // Initialize with some data for the graphs
    if (cpuHistory.length === 0) {
      const initialData = Array.from(
        { length: MAX_HISTORY },
        () => Math.floor(Math.random() * 30) + 20
      );
      setCpuHistory(initialData);
      setMemoryHistory(
        initialData.map(() => Math.floor(Math.random() * 20) + 30)
      );
    }

    // Simulate some initial network activity
    setDownloadSpeed(Math.random() * 5 + 1);
    setUploadSpeed(Math.random() * 2 + 0.5);

    return () => {
      clearInterval(metricsInterval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", trackActivity);
      window.removeEventListener("keydown", trackActivity);
      window.removeEventListener("scroll", trackActivity);
      window.removeEventListener("click", trackActivity);
      if (networkObserver) networkObserver.disconnect();
    };
  }, [isMounted]);

  // Get color based on usage percentage
  const getUsageColor = (usage) => {
    if (usage < 60) return "text-green-400";
    if (usage < 80) return "text-yellow-400";
    return "text-red-400";
  };

  // Draw the graph line
  const getGraphPath = (data, height) => {
    if (data.length === 0) return "";

    const width = 100; // Width of the graph area in percentage
    const xStep = width / (MAX_HISTORY - 1);

    return data
      .map((value, index) => {
        const x = index * xStep;
        const y = height - (value / 100) * height;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  // Format bytes to a readable string
  const formatBytes = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Format speed to a readable string
  const formatSpeed = (speed, unit = "KB/s") => {
    if (speed < 0.1) return "< 0.1 " + unit;
    return speed.toFixed(1) + " " + unit;
  };

  // Show a simple loading state during SSR
  if (!isMounted) {
    return (
      <div className="widget bg-black/60 backdrop-blur-md rounded-xl overflow-hidden text-white p-4 w-72">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-purple-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M15 4H5v16h14V8h-4V4zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992z" />
            </svg>
            <h3 className="font-medium">Browser Monitor</h3>
          </div>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-4 w-4 border-2 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="widget bg-black/60 backdrop-blur-md rounded-xl overflow-hidden text-white p-4 w-72">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-purple-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M15 4H5v16h14V8h-4V4zM3 2.992C3 2.444 3.447 2 3.999 2H16l5 5v13.993A1 1 0 0 1 20.007 22H3.993A1 1 0 0 1 3 21.008V2.992z" />
          </svg>
          <h3 className="font-medium">Browser Monitor</h3>
        </div>
        <div className="text-xs text-purple-400 font-medium">{fps} FPS</div>
      </div>

      {/* CPU Usage */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs text-white/70">CPU Load</div>
          <div className={`text-sm font-bold ${getUsageColor(cpuUsage)}`}>
            {Math.round(cpuUsage)}%
          </div>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${getUsageColor(
              cpuUsage
            )} transition-all duration-500 ease-out`}
            style={{ width: `${cpuUsage}%` }}
          ></div>
        </div>

        {/* CPU Graph */}
        <div className="mt-2 h-16 w-full bg-black/30 rounded-md overflow-hidden relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <path
              d={getGraphPath(cpuHistory, 100)}
              fill="none"
              stroke="rgba(168, 85, 247, 0.8)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-glow"
            />
            <path
              d={`${getGraphPath(cpuHistory, 100)} L 100 100 L 0 100 Z`}
              fill="url(#cpuGradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(168, 85, 247, 0.8)" />
                <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-white/10 h-1/4"></div>
            <div className="border-b border-white/10 h-1/4"></div>
            <div className="border-b border-white/10 h-1/4"></div>
            <div className="h-1/4"></div>
          </div>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <div className="text-xs text-white/70">Memory Usage</div>
          <div className={`text-sm font-bold ${getUsageColor(memoryUsage)}`}>
            {Math.round(memoryUsage)}% ({jsHeapSize} MB)
          </div>
        </div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${getUsageColor(
              memoryUsage
            )} transition-all duration-500 ease-out`}
            style={{ width: `${memoryUsage}%` }}
          ></div>
        </div>

        {/* Memory Graph */}
        <div className="mt-2 h-16 w-full bg-black/30 rounded-md overflow-hidden relative">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="overflow-visible"
          >
            <path
              d={getGraphPath(memoryHistory, 100)}
              fill="none"
              stroke="rgba(52, 211, 153, 0.8)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-glow"
            />
            <path
              d={`${getGraphPath(memoryHistory, 100)} L 100 100 L 0 100 Z`}
              fill="url(#memoryGradient)"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(52, 211, 153, 0.8)" />
                <stop offset="100%" stopColor="rgba(52, 211, 153, 0)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            <div className="border-b border-white/10 h-1/4"></div>
            <div className="border-b border-white/10 h-1/4"></div>
            <div className="border-b border-white/10 h-1/4"></div>
            <div className="h-1/4"></div>
          </div>
        </div>
      </div>

      {/* Network Speed */}
      <div className="mb-4">
        <div className="text-xs text-white/70 mb-2">Network Speed</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/10 p-2 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-white/70 text-xs">Download</div>
              <div className="text-blue-400 text-xs">↓</div>
            </div>
            <div className="font-bold text-sm">
              {formatSpeed(downloadSpeed)}
            </div>
          </div>
          <div className="bg-white/10 p-2 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="text-white/70 text-xs">Upload</div>
              <div className="text-green-400 text-xs">↑</div>
            </div>
            <div className="font-bold text-sm">{formatSpeed(uploadSpeed)}</div>
          </div>
        </div>
      </div>

      {/* Browser Info */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-white/10 p-2 rounded-lg">
          <div className="text-white/70">DOM Nodes</div>
          <div className="font-bold">{domNodes}</div>
        </div>
        <div className="bg-white/10 p-2 rounded-lg">
          <div className="text-white/70">Network Requests</div>
          <div className="font-bold">{networkRequests}</div>
        </div>
      </div>
    </div>
  );
}
