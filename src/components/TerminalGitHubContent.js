"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from 'marked'; // Import marked for markdown rendering

export default function TerminalGitHubContent() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRepoIndex, setSelectedRepoIndex] = useState(0);
  const [viewMode, setViewMode] = useState("list"); // list, details, readme
  const [readmeContent, setReadmeContent] = useState("");
  const [readmeLoading, setReadmeLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [username, setUsername] = useState("vatsalsaglani");
  const [currentPage, setCurrentPage] = useState(0);
  const reposPerPage = 5;
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Terminal prompt styling
  const prompt = "guest@vatsal-portfolio ~ $ ";

  // Fetch repositories on component mount
  useEffect(() => {
    fetchRepositories();
  }, []);

  // Auto-focus the input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [viewMode, commandHistory]);

  // Scroll to bottom of terminal when command history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory, loading, viewMode, readmeLoading]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode === "list") {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedRepoIndex((prev) => {
            if (prev > 0) {
              // If at the top of the current page, move to previous page
              if (prev % reposPerPage === 0 && currentPage > 0) {
                setCurrentPage(currentPage - 1);
                return prev - 1;
              }
              return prev - 1;
            }
            return prev;
          });
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedRepoIndex((prev) => {
            if (prev < repos.length - 1) {
              // If at the bottom of the current page, move to next page
              if ((prev + 1) % reposPerPage === 0 && prev + 1 < repos.length) {
                setCurrentPage(currentPage + 1);
                return prev + 1;
              }
              return prev + 1;
            }
            return prev;
          });
        } else if (e.key === "Enter") {
          e.preventDefault();
          viewRepoDetails(repos[selectedRepoIndex]);
        }
      } else if (viewMode === "details" || viewMode === "readme") {
        if (e.key === "Escape" || e.key === "Backspace") {
          e.preventDefault();
          if (viewMode === "readme") {
            setViewMode("details");
            addToCommandHistory("Returned to repository details");
          } else {
            setViewMode("list");
            addToCommandHistory("Returned to repository list");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, selectedRepoIndex, repos, currentPage]);

  // Update current page when selected repo index changes
  useEffect(() => {
    setCurrentPage(Math.floor(selectedRepoIndex / reposPerPage));
  }, [selectedRepoIndex]);

  // Fetch repositories from GitHub API
  const fetchRepositories = async () => {
    try {
      setLoading(true);
      
      // Check for cached data first
      const cachedData = localStorage.getItem("github_repos");
      const cachedTimestamp = localStorage.getItem("github_repos_timestamp");
      
      if (cachedData && cachedTimestamp) {
        const parsedData = JSON.parse(cachedData);
        const timestamp = parseInt(cachedTimestamp);
        const now = Date.now();
        
        // If cache is less than 1 hour old, use it
        if (now - timestamp < 60 * 60 * 1000) {
          setRepos(parsedData);
          setLoading(false);
          addToCommandHistory(`Fetched ${parsedData.length} repositories from cache`);
          return;
        }
      }
      
      // Optional: Add your GitHub token for higher rate limits
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      const headers = token ? { Authorization: `token ${token}` } : {};
      
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        { headers }
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      let data = await response.json();
      
      // Sort by stars (descending)
      data = data.sort((a, b) => b.stargazers_count - a.stargazers_count);
      
      setRepos(data);
      
      // Cache the data
      localStorage.setItem("github_repos", JSON.stringify(data));
      localStorage.setItem("github_repos_timestamp", Date.now().toString());
      
      addToCommandHistory(`Fetched ${data.length} repositories from GitHub`);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setError("Failed to load repositories. Please try again later.");
      setLoading(false);
      
      // Try to use cached data as fallback
      const cachedData = localStorage.getItem("github_repos");
      if (cachedData) {
        setRepos(JSON.parse(cachedData));
        addToCommandHistory("Using cached repository data due to API error");
      } else {
        addToCommandHistory("ERROR: Failed to fetch repositories");
      }
    }
  };

  // View repository details
  const viewRepoDetails = async (repo) => {
    setViewMode("details");
    addToCommandHistory(`cd ${repo.name}`);
    addToCommandHistory(`Viewing details for ${repo.name}`);
    
    // Add some delay to simulate command execution
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Display repo details as command output
    addToCommandHistory(`
Name: ${repo.name}
Description: ${repo.description || 'No description'}
Stars: ${repo.stargazers_count}
Forks: ${repo.forks_count}
Language: ${repo.language || 'Not specified'}
Created: ${new Date(repo.created_at).toLocaleDateString()}
Last updated: ${new Date(repo.updated_at).toLocaleDateString()}
URL: ${repo.html_url}
    `);
    
    addToCommandHistory(`Type 'readme' to view README or 'back' to return to list`);
  };

  // Fetch and display README content
  const fetchReadme = async (repo) => {
    try {
      setReadmeLoading(true);
      addToCommandHistory(`cat README.md`);
      
      // Optional: Add your GitHub token for higher rate limits
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      const headers = token ? { 
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      } : { 
        Accept: 'application/vnd.github.v3.raw' 
      };
      
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/readme`,
        { headers }
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("README not found");
        }
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const content = await response.text();
      // Parse markdown to HTML
      const htmlContent = marked.parse(content);
      setReadmeContent(htmlContent);
      setViewMode("readme");
      addToCommandHistory("README.md:");
      addToCommandHistory(`Type 'back' to return to repository details`);
    } catch (err) {
      console.error("Error fetching README:", err);
      addToCommandHistory(`ERROR: ${err.message}`);
    } finally {
      setReadmeLoading(false);
    }
  };

  // Add a message to command history
  const addToCommandHistory = (message) => {
    setCommandHistory(prev => [...prev, message]);
  };

  // Handle command input
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    
    const command = currentCommand.trim().toLowerCase();
    addToCommandHistory(`${prompt}${command}`);
    
    // Process command
    if (command === "clear" || command === "cls") {
      setCommandHistory([]);
    } else if (command === "help") {
      addToCommandHistory(`
Available commands:
  help - Show this help message
  clear - Clear the terminal
  ls - List repositories
  cd <repo> - View repository details
  back - Go back to previous view
  readme - View README.md (when in repo details)
  refresh - Refresh repository list
  next - Show next page of repositories
  prev - Show previous page of repositories
  exit - Close terminal
      `);
    } else if (command === "ls") {
      setViewMode("list");
      addToCommandHistory("Listing repositories...");
    } else if (command === "refresh") {
      fetchRepositories();
    } else if (command === "exit") {
      addToCommandHistory("Closing terminal...");
      // You would need to implement a way to close the window here
      // This depends on your window management system
    } else if (command === "back") {
      if (viewMode === "readme") {
        setViewMode("details");
        addToCommandHistory("Returned to repository details");
      } else if (viewMode === "details") {
        setViewMode("list");
        addToCommandHistory("Returned to repository list");
      }
    } else if (command === "next") {
      if (currentPage < Math.ceil(repos.length / reposPerPage) - 1) {
        setCurrentPage(prev => prev + 1);
        addToCommandHistory(`Showing page ${currentPage + 2}`);
      } else {
        addToCommandHistory("Already at the last page");
      }
    } else if (command === "prev") {
      if (currentPage > 0) {
        setCurrentPage(prev => prev - 1);
        addToCommandHistory(`Showing page ${currentPage}`);
      } else {
        addToCommandHistory("Already at the first page");
      }
    } else if (command === "readme" && viewMode === "details") {
      fetchReadme(repos[selectedRepoIndex]);
    } else if (command.startsWith("cd ")) {
      const repoName = command.substring(3).trim();
      const repoIndex = repos.findIndex(r => 
        r.name.toLowerCase() === repoName.toLowerCase()
      );
      
      if (repoIndex >= 0) {
        setSelectedRepoIndex(repoIndex);
        viewRepoDetails(repos[repoIndex]);
      } else {
        addToCommandHistory(`Repository '${repoName}' not found`);
      }
    } else {
      addToCommandHistory(`Command not found: ${command}`);
      addToCommandHistory("Type 'help' for available commands");
    }
    
    setCurrentCommand("");
  };

  // Get current page of repositories
  const getCurrentPageRepos = () => {
    const startIndex = currentPage * reposPerPage;
    return repos.slice(startIndex, startIndex + reposPerPage);
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 overflow-hidden" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}>
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-3 overflow-auto bg-black"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Welcome message */}
        <div className="mb-4 text-gray-400">
          <p>Welcome to Vatsal's GitHub Terminal</p>
          <p>Type 'help' for available commands</p>
          <p className="text-xs mt-1">Use arrow keys to navigate, Enter to select</p>
        </div>
        
        {/* Command history */}
        <div className="space-y-1">
          {commandHistory.map((cmd, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              {cmd.startsWith(prompt) ? (
                <div>
                  <span className="text-blue-400">{prompt}</span>
                  <span>{cmd.substring(prompt.length)}</span>
                </div>
              ) : (
                <div>{cmd}</div>
              )}
            </div>
          ))}
        </div>
        
        {/* Loading indicator */}
        {loading && (
          <div className="mt-2 animate-pulse">Loading repositories...</div>
        )}
        
        {/* Repository list view */}
        {viewMode === "list" && !loading && (
          <div className="mt-2">
            <div className="text-blue-400">{prompt}ls</div>
            <div className="grid grid-cols-1 gap-1 mt-1">
              {getCurrentPageRepos().map((repo, index) => {
                const actualIndex = currentPage * reposPerPage + index;
                return (
                  <div 
                    key={repo.id}
                    className={`px-2 py-1 rounded cursor-pointer ${
                      selectedRepoIndex === actualIndex 
                        ? "bg-green-900/30 border border-green-500/50" 
                        : "hover:bg-gray-900"
                    }`}
                    onClick={() => {
                      setSelectedRepoIndex(actualIndex);
                      viewRepoDetails(repo);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-2">
                          {selectedRepoIndex === actualIndex ? ">" : ""}
                        </span>
                        <span className="font-bold">{repo.name}</span>
                        {repo.fork && (
                          <span className="ml-2 text-xs text-gray-500">(fork)</span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-400">
                        <span className="mr-3">{repo.language || "N/A"}</span>
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
                          </svg>
                          {repo.stargazers_count}
                        </span>
                      </div>
                    </div>
                    {selectedRepoIndex === actualIndex && repo.description && (
                      <div className="text-xs text-gray-400 mt-1 ml-4">
                        {repo.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Pagination info */}
            <div className="mt-3 text-xs text-gray-500">
              Page {currentPage + 1} of {Math.ceil(repos.length / reposPerPage)} 
              ({repos.length} repositories)
              {currentPage > 0 && (
                <span className="ml-2 text-blue-400 cursor-pointer" onClick={() => {
                  setCurrentPage(prev => prev - 1);
                  addToCommandHistory(`Showing page ${currentPage}`);
                }}>
                  prev
                </span>
              )}
              {currentPage < Math.ceil(repos.length / reposPerPage) - 1 && (
                <span className="ml-2 text-blue-400 cursor-pointer" onClick={() => {
                  setCurrentPage(prev => prev + 1);
                  addToCommandHistory(`Showing page ${currentPage + 2}`);
                }}>
                  next
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* README loading indicator */}
        {readmeLoading && (
          <div className="mt-2 animate-pulse">Loading README.md...</div>
        )}
        
        {/* README content */}
        {viewMode === "readme" && !readmeLoading && (
          <div className="mt-2 readme-content bg-gray-900/30 p-3 rounded-md border border-gray-800">
            <div dangerouslySetInnerHTML={{ __html: readmeContent }} className="prose prose-sm prose-invert max-w-none" />
          </div>
        )}
        
        {/* Command input */}
        <form onSubmit={handleCommandSubmit} className="mt-2 flex items-center">
          <span className="text-blue-400 mr-1">{prompt}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            className="flex-1 bg-transparent outline-none border-none"
            autoFocus
          />
        </form>
      </div>
      
      {/* Mobile controls - only visible on small screens */}
      <div className="sm:hidden bg-gray-900 p-2 border-t border-gray-800 flex justify-between">
        <button 
          onClick={() => {
            if (viewMode === "readme") {
              setViewMode("details");
              addToCommandHistory("Returned to repository details");
            } else if (viewMode === "details") {
              setViewMode("list");
              addToCommandHistory("Returned to repository list");
            }
          }}
          className="px-3 py-1 bg-gray-800 rounded text-xs"
        >
          Back
        </button>
        
        {viewMode === "list" && (
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                if (currentPage > 0) {
                  setCurrentPage(prev => prev - 1);
                }
              }}
              className="px-3 py-1 bg-gray-800 rounded text-xs"
              disabled={currentPage === 0}
            >
              Prev
            </button>
            <button 
              onClick={() => {
                if (currentPage < Math.ceil(repos.length / reposPerPage) - 1) {
                  setCurrentPage(prev => prev + 1);
                }
              }}
              className="px-3 py-1 bg-gray-800 rounded text-xs"
              disabled={currentPage >= Math.ceil(repos.length / reposPerPage) - 1}
            >
              Next
            </button>
            <button 
              onClick={() => {
                if (repos[selectedRepoIndex]) {
                  viewRepoDetails(repos[selectedRepoIndex]);
                }
              }}
              className="px-3 py-1 bg-gray-800 rounded text-xs"
            >
              Select
            </button>
          </div>
        )}
        
        {viewMode === "details" && (
          <button 
            onClick={() => fetchReadme(repos[selectedRepoIndex])}
            className="px-3 py-1 bg-gray-800 rounded text-xs"
          >
            View README
          </button>
        )}
      </div>
      
      {/* Add styles for markdown rendering */}
      <style jsx global>{`
        .readme-content h1, .readme-content h2, .readme-content h3, 
        .readme-content h4, .readme-content h5, .readme-content h6 {
          color: #58a6ff;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }
        
        .readme-content h1 {
          font-size: 1.5em;
          border-bottom: 1px solid #30363d;
          padding-bottom: 0.3em;
        }
        
        .readme-content h2 {
          font-size: 1.3em;
          border-bottom: 1px solid #30363d;
          padding-bottom: 0.3em;
        }
        
        .readme-content h3 {
          font-size: 1.1em;
        }
        
        .readme-content p, .readme-content li {
          margin-bottom: 1em;
        }
        
        .readme-content a {
          color: #58a6ff;
          text-decoration: none;
        }
        
        .readme-content a:hover {
          text-decoration: underline;
        }
        
        .readme-content code {
          background-color: rgba(110, 118, 129, 0.4);
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
        }
        
        .readme-content pre {
          background-color: #161b22;
          border-radius: 6px;
          padding: 1em;
          overflow: auto;
          margin: 1em 0;
        }
        
        .readme-content pre code {
          background-color: transparent;
          padding: 0;
          white-space: pre;
        }
        
        .readme-content blockquote {
          border-left: 3px solid #30363d;
          padding-left: 1em;
          color: #8b949e;
          margin: 1em 0;
        }
        
        .readme-content img {
          max-width: 100%;
          height: auto;
        }
        
        .readme-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        .readme-content table th, .readme-content table td {
          border: 1px solid #30363d;
          padding: 0.5em;
        }
        
        .readme-content table th {
          background-color: #161b22;
        }
      `}</style>
    </div>
  );
} 