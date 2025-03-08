"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import Wallpaper from "@/components/Wallpaper";
import DockIcon from "@/components/DockIcon";
import Window from "@/components/Window";
import ProjectsContent from "@/components/ProjectsContent";
// import GitHubActivityWidget from "@/components/GitHubActivityWidget";
import WidgetContainer from "@/components/WidgetContainer";
import LaTeXResumeContent from "@/components/LaTeXResumeContent";
import ContactContent from "@/components/ContactContent";
import AboutMeContent from "@/components/AboutMeContent";
import TerminalGitHubContent from "@/components/TerminalGitHubContent";
import MacUnlockScreen from "@/components/MacUnlockScreen";


const BlogContent = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchMediumPosts = async () => {
      try {
        setLoading(true);

        // Fetch the RSS feed using a CORS proxy
        const response = await fetch(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            "https://medium.com/feed/@thevatsalsaglani"
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Medium posts");
        }

        const data = await response.json();

        // Parse the XML content
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");

        // Extract posts from the XML
        const items = xmlDoc.querySelectorAll("item");
        const mediumPosts = Array.from(items).map((item) => {
          // Get the publication date
          const pubDateElement = item.querySelector("pubDate");
          const pubDate = pubDateElement
            ? new Date(pubDateElement.textContent)
            : new Date();
          const formattedDate = pubDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          // Get the title
          const titleElement = item.querySelector("title");
          const title = titleElement
            ? titleElement.textContent
                .replace("<![CDATA[", "")
                .replace("]]>", "")
            : "Untitled Post";

          // Get the link
          const linkElement = item.querySelector("link");
          const link = linkElement ? linkElement.textContent : "#";

          // Get categories/tags
          const categories = Array.from(item.querySelectorAll("category"))
            .map((cat) =>
              cat.textContent.replace("<![CDATA[", "").replace("]]>", "")
            )
            .filter(Boolean);

          // Extract description from the HTML in the description tag
          const descriptionElement = item.querySelector("description");
          let description = "No description available";
          let imageUrl = null;

          if (descriptionElement && descriptionElement.textContent) {
            // Create a temporary div to parse the HTML content
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = descriptionElement.textContent;

            // Try to find the medium-feed-snippet class which contains the description
            const snippetElement = tempDiv.querySelector(
              ".medium-feed-snippet"
            );
            if (snippetElement) {
              description = snippetElement.textContent.trim();
            }

            // Try to extract image if available
            const imgElement = tempDiv.querySelector("img");
            if (imgElement && imgElement.src) {
              imageUrl = imgElement.src;
            }
          }

          return {
            title,
            link,
            description,
            date: formattedDate,
            imageUrl,
            categories,
          };
        });

        setPosts(mediumPosts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Medium posts:", err);
        setError("Failed to load blog posts. Please try again later.");
        setLoading(false);
      }
    };

    fetchMediumPosts();
  }, []);

  return (
    <div
      className="text-light-text dark:text-dark-text p-2 sm:p-4 h-full"
      style={{ fontFamily: "monospace" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6 border-b border-gray-300 dark:border-gray-700 pb-3 sm:pb-4">
        <img
          src="https://cdn-static-1.medium.com/_/fp/icons/Medium-Avatar-500x500.svg"
          alt="Medium"
          className="w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-0 sm:mr-3"
        />
        <h2
          className="text-xl sm:text-2xl font-bold tracking-tight"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Medium Retro
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <div className="flex items-center mb-3 sm:mb-0">
          <img
            src="/assets/vatsal.JPG"
            alt="Vatsal Saglani"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 border-2 border-gray-300 dark:border-gray-700 object-cover"
          />
          <div>
            <h3 className="font-bold">Vatsal Saglani</h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              2.3K Followers
            </p>
          </div>
        </div>
        <a
          href="https://thevatsalsaglani.medium.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white hover:bg-green-700 transition-colors rounded text-sm sm:text-base"
        >
          View Profile
        </a>
      </div>

      {/* Note about RSS feed limitations */}
      <div className="mb-4 sm:mb-6 p-2 sm:p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-md text-xs sm:text-sm">
        <p className="text-yellow-800 dark:text-yellow-200">
          <span className="font-bold">Note:</span> Medium's RSS feed only
          provides the most recent posts.
          <a
            href="https://thevatsalsaglani.medium.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 underline text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            Visit the full profile
          </a>{" "}
          to see all articles.
        </p>
      </div>

      <div
        className="space-y-4 sm:space-y-6 overflow-auto hide-scrollbar"
        style={{
          maxHeight: isMobile ? "calc(100% - 220px)" : "calc(100% - 200px)",
        }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse text-gray-500 dark:text-gray-400">
              Loading posts...
            </div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4 border border-red-300 rounded">
            {error}
            <div className="mt-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          posts.map((post, index) => (
            <BlogPost
              key={index}
              title={post.title}
              description={post.description}
              date={post.date}
              url={post.link}
              imageUrl={post.imageUrl}
              categories={post.categories}
            />
          ))
        )}

        {/* Fallback content if no posts are loaded */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center p-4 border border-gray-300 dark:border-gray-700 rounded">
            <p>No posts found. View all articles on Medium instead.</p>
            <a
              href="https://thevatsalsaglani.medium.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors rounded"
            >
              Visit Medium Profile
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// Blog post component with retro styling and enhanced display
const BlogPost = ({
  title,
  description,
  date,
  url,
  imageUrl,
  categories = [],
}) => (
  <div className="border-b border-gray-300 dark:border-gray-700 pb-3 sm:pb-4">
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {imageUrl && (
          <div className="sm:w-1/4 w-full flex-shrink-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto rounded border border-gray-200 dark:border-gray-700"
            />
          </div>
        )}
        <div className={imageUrl ? "sm:w-3/4 w-full" : "w-full"}>
          <h3
            className="text-lg sm:text-xl font-bold mb-2 group-hover:underline"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {title}
          </h3>
          <p className="mb-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
            {description.length > 120 && window.innerWidth < 640
              ? `${description.substring(0, 120)}...`
              : description}
          </p>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {categories
                .slice(0, window.innerWidth < 640 ? 2 : 4)
                .map((category, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded"
                  >
                    {category}
                  </span>
                ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {date}
            </span>
            <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 group-hover:underline">
              Read more →
            </span>
          </div>
        </div>
      </div>
    </a>
  </div>
);

// Update the OpenSourceContent component
const OpenSourceContent = () => (
  <div className="h-full">
    <TerminalGitHubContent />
  </div>
);

// Define initial window positions and sizes with better spacing
const initialWindowProps = {
  aboutMe: {
    position: { x: 100, y: 100 },
    size: { width: 700, height: 800 },
  },
  projects: {
    position: { x: 150, y: 120 },
    size: { width: 800, height: 600 }, // Larger size for the projects window
  },
  blog: {
    position: { x: 200, y: 140 },
    size: { width: 700, height: 600 },
  },
  openSource: {
    position: { x: 250, y: 160 },
    size: { width: 600, height: 450 },
  },
  contact: {
    position: { x: 250, y: 150 },
    size: { width: 650, height: 650 }, // Increased size for better visibility
  },
  resume: {
    position: { x: 200, y: 150 },
    size: { width: 800, height: 700 },
  },
  githubActivity: {
    position: { x: 350, y: 200 },
    size: { width: 500, height: 550 },
  },
 
};

// Map window IDs to their titles
const windowTitles = {
  aboutMe: "About Me",
  projects: "Projects",
  blog: "Blog",
  openSource: "vatsal@github ~ zsh", // Updated title for terminal
  contact: "Contact",
  resume: "Resume",
  
  // githubActivity: "GitHub Activity",
};

// Map window IDs to their content components
const windowContents = {
  aboutMe: <AboutMeContent />,
  projects: <ProjectsContent />,
  blog: <BlogContent />,
  openSource: <OpenSourceContent />,
  contact: <ContactContent />,
  resume: <LaTeXResumeContent />
  // githubActivity: <GitHubActivityWidget />,
};

export default function Home() {
  // Add a loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Your existing states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windows, setWindows] = useState({});
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [windowOrder, setWindowOrder] = useState([]);
  const [nextZIndex, setNextZIndex] = useState(1000);
  const [isMobileView, setIsMobileView] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth <= 640);
    };

    // Check initially and on resize
    if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Mobile auto-maximize
  useEffect(() => {
    if (isMobileView && activeWindowId) {
      // Auto-maximize windows on mobile
      setWindows((prev) => ({
        ...prev,
        [activeWindowId]: {
          ...prev[activeWindowId],
          isMaximized: true,
        },
      }));
    }
  }, [isMobileView, activeWindowId]);

  // Handler for opening a window
  const openWindow = useCallback(
    (id, customProps = {}) => {
      // Check if window already exists
      if (windows[id]?.isOpen) {
        // Just focus it
        focusWindow(id);
        return;
      }

      // Create a new window state, using customProps to override defaults
      const newWindow = {
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        position: customProps.position || initialWindowProps[id].position,
        size: customProps.size || initialWindowProps[id].size,
        zIndex: nextZIndex,
      };

      // Update windows state
      setWindows((prev) => ({ ...prev, [id]: newWindow }));

      // Add to window order
      setWindowOrder((prev) => [...prev.filter((wId) => wId !== id), id]);

      // Set as active window
      setActiveWindowId(id);

      // Increment next z-index
      setNextZIndex((prev) => prev + 1);
    },
    [windows, windowOrder, nextZIndex]
  );

  // Handler for focusing a window
  const focusWindow = useCallback(
    (id) => {
      if (!windows[id]?.isOpen) return;

      // Update window's z-index
      setWindows((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMinimized: false, // Restore if minimized
          zIndex: nextZIndex,
        },
      }));

      // Move to front of window order
      setWindowOrder((prev) => [...prev.filter((wId) => wId !== id), id]);

      // Set as active window
      setActiveWindowId(id);

      // Increment next z-index
      setNextZIndex((prev) => prev + 1);
    },
    [windows, nextZIndex]
  );

  // Handler for closing a window
  const closeWindow = useCallback(
    (id) => {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], isOpen: false },
      }));

      // Update active window if needed
      if (activeWindowId === id) {
        const reversedOrder = [...windowOrder].reverse();
        const nextActiveId = reversedOrder.find(
          (wId) =>
            wId !== id && windows[wId]?.isOpen && !windows[wId]?.isMinimized
        );
        setActiveWindowId(nextActiveId || null);
      }
    },
    [windows, windowOrder, activeWindowId]
  );

  // Handler for minimizing a window
  const minimizeWindow = useCallback(
    (id) => {
      setWindows((prev) => ({
        ...prev,
        [id]: { ...prev[id], isMinimized: true },
      }));

      // Update active window if needed
      if (activeWindowId === id) {
        const reversedOrder = [...windowOrder].reverse();
        const nextActiveId = reversedOrder.find(
          (wId) =>
            wId !== id && windows[wId]?.isOpen && !windows[wId]?.isMinimized
        );
        setActiveWindowId(nextActiveId || null);
      }
    },
    [windows, windowOrder, activeWindowId]
  );

  // Handler for maximizing/restoring a window
  const maximizeWindow = useCallback(
    (id) => {
      setWindows((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          isMaximized: !prev[id]?.isMaximized,
        },
      }));

      // Focus the window
      focusWindow(id);
    },
    [focusWindow]
  );

  // Handler for updating window position
  const updateWindowPosition = useCallback((id, position) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], position },
    }));
  }, []);

  // Handler for updating window size
  const updateWindowSize = useCallback((id, size) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], size },
    }));
  }, []);

  // Handle dock icon clicks
  const handleDockIconClick = useCallback(
    (id) => {
      // For mobile, just open maximized
      if (isMobileView) {
        openWindow(id, {
          position: { x: 0, y: 48 },
          size: { width: window.innerWidth, height: window.innerHeight - 118 },
          isMaximized: true,
        });
        return;
      }

      // Existing desktop code
      // Get viewport dimensions - using fixed values as fallback
      const viewportWidth =
        typeof window !== "undefined" ? window.innerWidth : 1200;
      const viewportHeight =
        typeof window !== "undefined" ? window.innerHeight : 800;

      // Fixed center position calculations
      const windowWidth = initialWindowProps[id].size.width;
      const windowHeight = initialWindowProps[id].size.height;

      // Calculate center - force to be truly centered
      const centerX = Math.floor((viewportWidth - windowWidth) / 2);
      const centerY = Math.floor((viewportHeight - windowHeight) / 2);

      // Add a slight offset for each open window
      const offset = 25;
      const openWindowCount = Object.values(windows).filter(
        (w) => w?.isOpen
      ).length;

      const finalPosition = {
        x: centerX + openWindowCount * offset,
        y: centerY + openWindowCount * offset,
      };

      console.log(`Opening window ${id} at position:`, finalPosition);
      console.log(`Viewport size: ${viewportWidth}x${viewportHeight}`);
      console.log(`Window size: ${windowWidth}x${windowHeight}`);

      // Open window with explicit position
      openWindow(id, {
        position: finalPosition,
        size: initialWindowProps[id].size,
      });
    },
    [windows, openWindow, isMobileView]
  );

  // Add a new function to close all windows
  const closeAllWindows = useCallback(() => {
    // Get all open window IDs
    const openWindowIds = Object.keys(windows).filter(id => windows[id]?.isOpen);
    
    // Close each window
    openWindowIds.forEach(id => {
      closeWindow(id);
    });
    
    // Close mobile menu if it's open
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [windows, closeWindow, isMobileMenuOpen]);

  // Add a new effect to handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+W or Cmd+W (metaKey is Cmd on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') {
        // If there's an active window, prevent default behavior and close it
        if (activeWindowId) {
          e.preventDefault();
          e.stopPropagation();
          closeWindow(activeWindowId);
          return false;
        }
      }
    };

    // Add event listener with capture phase to ensure it runs before browser handlers
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [activeWindowId, closeWindow]);

  // Handle unlock completion
  const handleUnlocked = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <>
      {isLoading && <MacUnlockScreen onUnlocked={handleUnlocked} />}
      
      <div className={`relative min-h-screen bg-transparent transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Wallpaper />

        {/* Top Menu Bar */}
        <nav className="h-12 sm:h-8 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md fixed top-0 w-full flex items-center px-4 z-50 border-b border-light-text/10 dark:border-dark-text/10">
          <div className="flex items-center justify-between w-full">
            {/* Left section: Logo and menu items */}
            <div className="flex items-center gap-4">
              {/* Logo */}
              <span 
                onClick={closeAllWindows}
                className="font-semibold text-light-accent dark:text-dark-accent text-lg sm:text-base cursor-pointer hover:opacity-80 transition-opacity"
              >
                {"👨‍💻"}
              </span>

              {/* Desktop Menu Items */}
              <div className="hidden sm:flex items-center gap-4">
                <button 
                  onClick={closeAllWindows}
                  className="text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 px-2 py-1 rounded transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => handleDockIconClick("projects")}
                  className="text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 px-2 py-1 rounded transition-colors"
                >
                  Projects
                </button>
                <button 
                  onClick={() => handleDockIconClick("blog")}
                  className="text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 px-2 py-1 rounded transition-colors"
                >
                  Blog
                </button>
                <button 
                  onClick={() => handleDockIconClick("resume")} 
                  className="text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 px-2 py-1 rounded transition-colors"
                >
                  Resume
                </button>
                <button 
                  onClick={() => handleDockIconClick("contact")}
                  className="text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 px-2 py-1 rounded transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            {/* Right section: Mobile menu button and Theme toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg hover:bg-light-text/5 dark:hover:bg-dark-text/5 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-light-text dark:text-dark-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`sm:hidden fixed top-12 right-0 w-full bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-md border-b border-light-text/10 dark:border-dark-text/10 transition-transform duration-300 ${
            isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
          } z-40`}
        >
          <div className="flex flex-col p-4 gap-2">
            <button 
              onClick={closeAllWindows}
              className="w-full text-left px-4 py-3 text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 rounded-lg transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => {
                handleDockIconClick("projects");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 rounded-lg transition-colors"
            >
              Projects
            </button>
            <button 
              onClick={() => {
                handleDockIconClick("blog");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 rounded-lg transition-colors"
            >
              Blog
            </button>
            <button 
              onClick={() => {
                handleDockIconClick("resume");
                setIsMobileMenuOpen(false);
              }} 
              className="w-full text-left px-4 py-3 text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 rounded-lg transition-colors"
            >
              Resume
            </button>
            <button 
              onClick={() => {
                handleDockIconClick("contact");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-light-text dark:text-dark-text hover:bg-light-text/5 dark:hover:bg-dark-text/5 rounded-lg transition-colors"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Main Content Area - Windows */}
        <main
          className="fixed inset-0 pt-12 sm:pt-8 overflow-hidden window-layer"
          style={{ zIndex: 10 }}
        >
          <WidgetContainer />
          {/* Render all windows */}
          {Object.keys(windows).map(
            (id) =>
              windows[id]?.isOpen && (
                <Window
                  key={id}
                  id={id}
                  title={windowTitles[id]}
                  isOpen={windows[id].isOpen}
                  isMinimized={windows[id].isMinimized}
                  isMaximized={windows[id].isMaximized}
                  isActive={activeWindowId === id}
                  zIndex={windows[id].zIndex}
                  initialPosition={windows[id].position}
                  initialSize={windows[id].size}
                  onFocus={focusWindow}
                  onClose={closeWindow}
                  onMinimize={minimizeWindow}
                  onMaximize={maximizeWindow}
                  onPositionChange={updateWindowPosition}
                  onSizeChange={updateWindowSize}
                  className="window-element"
                >
                  {windowContents[id]}
                </Window>
              )
          )}
        </main>

        {/* Dock */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md p-1 sm:p-2 rounded-xl flex gap-1 sm:gap-4 border border-light-text/10 dark:border-dark-text/10 shadow-lg z-40">
          <div onClick={() => handleDockIconClick("aboutMe")}>
            <DockIcon
              icon="finder-about-me-removebg-preview.png"
              label="About Me"
              showLabel={!isMobileView}
            />
          </div>
          <div onClick={() => handleDockIconClick("projects")}>
            <DockIcon
              icon="vscode-projects-removebg-preview.png"
              label="Projects"
              showLabel={!isMobileView}
            />
          </div>
          <div onClick={() => handleDockIconClick("blog")}>
            <DockIcon
              icon="safari-removebg-preview.png"
              label="Blog"
              showLabel={!isMobileView}
            />
          </div>
          <div onClick={() => handleDockIconClick("openSource")}>
            <DockIcon
              icon="terminal-removebg-preview.png"
              label="Open Source"
              showLabel={!isMobileView}
            />
          </div>
          <div onClick={() => handleDockIconClick("contact")}>
            <DockIcon
              icon="messages.png"
              label="Contact"
              showLabel={!isMobileView}
            />
          </div>
        </div>
      </div>
    </>
  );
}
