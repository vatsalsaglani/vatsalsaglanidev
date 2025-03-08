"use client";

import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useTheme } from "@/context/ThemeContext";

export default function ProjectsContent() {
  const [repos, setRepos] = useState([]);
  const [topStarredRepos, setTopStarredRepos] = useState([]);
  const [recentlyUpdatedRepos, setRecentlyUpdatedRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeFolderType, setActiveFolderType] = useState(null); // 'starred' or 'recent'
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [openFolders, setOpenFolders] = useState(['starred', 'recent']);
  const [repoFiles, setRepoFiles] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 640 : false;
  const username = "vatsalsaglani";

  // Fetch repositories on component mount
  useEffect(() => {
    fetchRepositories();
  }, []);

  // Open top starred repo by default after repos are loaded
  useEffect(() => {
    if (topStarredRepos.length > 0 && !activeFolder) {
      fetchRepoFiles(topStarredRepos[0], 'starred');
    }
  }, [topStarredRepos]);

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
          processRepos(parsedData);
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
      
      const data = await response.json();
      
      // Cache the data
      localStorage.setItem("github_repos", JSON.stringify(data));
      localStorage.setItem("github_repos_timestamp", Date.now().toString());
      
      processRepos(data);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setError("Failed to load repositories. Please try again later.");
      setLoading(false);
      
      // Try to use cached data as fallback
      const cachedData = localStorage.getItem("github_repos");
      if (cachedData) {
        processRepos(JSON.parse(cachedData));
      }
    }
  };

  // Process repositories data
  const processRepos = (data) => {
    setRepos(data);
    
    // Sort by stars (descending) and take top 10
    const starredRepos = [...data].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 10);
    setTopStarredRepos(starredRepos);
    
    // Sort by updated_at (descending) and take top 4
    const recentRepos = [...data].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)).slice(0, 4);
    setRecentlyUpdatedRepos(recentRepos);
    
    setLoading(false);
  };

  // Fetch repository files
  const fetchRepoFiles = async (repo, folderType) => {
    try {
      // If we already have the files for this repo and it's the active folder,
      // just toggle its open state (contract it)
      if (repoFiles[repo.name] && activeFolder === repo.name) {
        if (openFolders.includes(repo.name)) {
          setOpenFolders(openFolders.filter(name => name !== repo.name));
        } else {
          setOpenFolders([...openFolders, repo.name]);
        }
        return;
      }
      
      // If we already have the files for this repo but it's not the active folder,
      // just set it as active and ensure it's open
      if (repoFiles[repo.name]) {
        setActiveFolder(repo.name);
        setActiveFolderType(folderType);
        setActiveFile(null);
        setFileContent("");
        
        // Make sure the repo folder is open
        if (!openFolders.includes(repo.name)) {
          setOpenFolders([...openFolders, repo.name]);
        }
        return;
      }
      
      setFileLoading(true);
      
      // Optional: Add your GitHub token for higher rate limits
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      const headers = token ? { Authorization: `token ${token}` } : {};
      
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/git/trees/main?recursive=1`,
        { headers }
      );
      
      if (!response.ok) {
        // Try master branch if main doesn't exist
        const masterResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/git/trees/master?recursive=1`,
          { headers }
        );
        
        if (!masterResponse.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await masterResponse.json();
        processRepoFiles(repo.name, data.tree, folderType);
      } else {
        const data = await response.json();
        processRepoFiles(repo.name, data.tree, folderType);
      }
    } catch (err) {
      console.error(`Error fetching files for ${repo.name}:`, err);
      // Set empty files array for this repo
      setRepoFiles(prev => ({
        ...prev,
        [repo.name]: []
      }));
      setFileLoading(false);
    }
  };

  // Process repository files
  const processRepoFiles = (repoName, files, folderType) => {
    // Filter out non-file entries and limit to certain file types
    const filteredFiles = files.filter(file => 
      file.type === "blob" && 
      (file.path.endsWith('.js') || 
       file.path.endsWith('.py') || 
       file.path.endsWith('.svelte') || 
       file.path.endsWith('.ipynb') ||
       file.path.endsWith('.md') ||
       file.path.endsWith('.json') ||
       file.path.endsWith('.html') ||
       file.path.endsWith('.css'))
    );
    
    // Sort files by path
    filteredFiles.sort((a, b) => a.path.localeCompare(b.path));
    
    // Update repoFiles state
    setRepoFiles(prev => ({
      ...prev,
      [repoName]: filteredFiles
    }));
    
    // Set active folder
    setActiveFolder(repoName);
    setActiveFolderType(folderType);
    
    // Add the repo to openFolders to show its files
    if (!openFolders.includes(repoName)) {
      setOpenFolders(prev => [...prev, repoName]);
    }
    
    setActiveFile(null);
    setFileContent("");
    setFileLoading(false);
  };

  // Fetch file content
  const fetchFileContent = async (repo, file) => {
    try {
      setFileLoading(true);
      
      // Optional: Add your GitHub token for higher rate limits
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      const headers = token ? { 
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      } : { 
        Accept: 'application/vnd.github.v3.raw' 
      };
      
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo}/contents/${file.path}`,
        { headers }
      );
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }
      
      const content = await response.text();
      
      // Special handling for .ipynb files
      if (file.path.endsWith('.ipynb')) {
        try {
          // Parse the JSON content of the notebook
          const notebookData = JSON.parse(content);
          
          // Format the notebook content for display
          let formattedContent = '';
          
          // Add metadata
          if (notebookData.metadata) {
            formattedContent += '// Notebook Metadata\n';
            formattedContent += `// Kernel: ${notebookData.metadata.kernelspec?.name || 'Unknown'}\n`;
            formattedContent += `// Language: ${notebookData.metadata.language_info?.name || 'Unknown'}\n\n`;
          }
          
          // Process cells
          if (notebookData.cells) {
            notebookData.cells.forEach((cell, index) => {
              formattedContent += `// Cell ${index + 1} (${cell.cell_type})\n`;
              
              if (cell.cell_type === 'markdown') {
                formattedContent += '/*\n' + (cell.source ? (Array.isArray(cell.source) ? cell.source.join('') : cell.source) : '') + '\n*/\n\n';
              } else if (cell.cell_type === 'code') {
                formattedContent += (cell.source ? (Array.isArray(cell.source) ? cell.source.join('') : cell.source) : '') + '\n\n';
                
                if (cell.outputs && cell.outputs.length > 0) {
                  formattedContent += '// Output:\n';
                  cell.outputs.forEach(output => {
                    if (output.text) {
                      formattedContent += '/*\n' + (Array.isArray(output.text) ? output.text.join('') : output.text) + '\n*/\n';
                    } else if (output.data && output.data['text/plain']) {
                      formattedContent += '/*\n' + (Array.isArray(output.data['text/plain']) ? output.data['text/plain'].join('') : output.data['text/plain']) + '\n*/\n';
                    }
                  });
                  formattedContent += '\n';
                }
              }
            });
          }
          
          setFileContent(formattedContent);
        } catch (jsonError) {
          console.error('Error parsing notebook JSON:', jsonError);
          setFileContent(`Error parsing notebook: ${jsonError.message}\n\nRaw content:\n${content}`);
        }
      } else {
        // Regular file handling
        setFileContent(content);
      }
      
      setActiveFile(file);
      setFileLoading(false);
    } catch (err) {
      console.error(`Error fetching content for ${file.path}:`, err);
      setFileContent(`Error loading file: ${err.message}`);
      setFileLoading(false);
    }
  };

  // Toggle folder in sidebar
  const toggleFolder = (folderName) => {
    if (openFolders.includes(folderName)) {
      setOpenFolders(openFolders.filter(name => name !== folderName));
    } else {
      setOpenFolders([...openFolders, folderName]);
    }
  };

  // Get file language for syntax highlighting
  const getFileLanguage = (filePath) => {
    if (!filePath) return 'text';
    
    const extension = filePath.split('.').pop().toLowerCase();
    
    const languageMap = {
      'js': 'javascript',
      'py': 'python',
      'svelte': 'svelte',
      'ipynb': 'json',
      'md': 'markdown',
      'json': 'json',
      'html': 'html',
      'css': 'css'
    };
    
    return languageMap[extension] || 'text';
  };

  // Group files by directory
  const getFileGroups = (files) => {
    const groups = {};
    
    files.forEach(file => {
      const parts = file.path.split('/');
      const fileName = parts.pop();
      const directory = parts.join('/');
      
      if (!groups[directory]) {
        groups[directory] = [];
      }
      
      groups[directory].push({
        ...file,
        name: fileName
      });
    });
    
    return groups;
  };

  return (
    <div className="flex flex-col sm:flex-row h-full overflow-hidden font-mono text-sm w-full">
      {/* Mobile View Toggle for Sidebar */}
      <div className="sm:hidden p-2 border-b border-gray-300 dark:border-gray-700">
        <button 
          onClick={() => setShowSidebar(!showSidebar)} 
          className={`w-full py-1 px-3 rounded ${isDark ? "bg-[#333]/70 text-gray-200" : "bg-gray-200/70 text-gray-700"}`}
        >
          {showSidebar ? "Hide Explorer" : "Show Explorer"}
        </button>
      </div>
      
      {/* Sidebar/Explorer - conditional render on mobile */}
      {(showSidebar || !isMobile) && (
        <div
          className={`${isMobile ? "h-64" : "flex-none"} w-full sm:w-56 flex flex-col ${
            isDark ? "bg-[#252526]/90" : "bg-[#F3F3F3]/90"
          } border-r ${
            isDark ? "border-[#3C3C3C]" : "border-[#E7E7E7]"
          } backdrop-blur-sm overflow-hidden`}
        >
          <div
            className={`p-2 text-xs uppercase font-semibold ${
              isDark ? "text-[#bbbbbb]" : "text-[#6F6F6F]"
            }`}
          >
            Explorer
          </div>
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-light-accent dark:border-dark-accent rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            <div className="flex-1 overflow-auto hide-scrollbar">
              {/* Top Starred Repositories */}
              <div className="select-none">
                <div
                  className={`flex items-center px-2 py-1 cursor-pointer ${
                    isDark ? "text-[#cccccc]" : "text-[#333333]"
                  }`}
                  onClick={() => toggleFolder('starred')}
                >
                  <svg
                    className={`w-4 h-4 mr-1 transition-transform duration-200 ${
                      isDark ? "text-[#cccccc]" : "text-[#424242]"
                    }`}
                    style={{
                      transform: openFolders.includes('starred')
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                    }}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M6 4l4 4-4 4V4z" />
                  </svg>
                  <svg
                    className="w-4 h-4 mr-1 text-yellow-400"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
                  </svg>
                  <span className="font-semibold">Top Starred Repos</span>
                </div>

                {openFolders.includes('starred') && (
                  <div className="ml-4">
                    {topStarredRepos.map((repo) => (
                      <div key={repo.id}>
                        <div
                          className={`flex items-center px-2 py-1 cursor-pointer ${
                            activeFolder === repo.name
                              ? isDark
                                ? "bg-[#37373D]/90"
                                : "bg-[#E5EBEE]/90"
                              : ""
                          } hover:${
                            isDark ? "bg-[#2A2D2E]/90" : "bg-[#E8E8E8]/90"
                          }`}
                          onClick={() => fetchRepoFiles(repo, 'starred')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-1"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#ffa000"
                              d="M40 12H22l-4-4H8c-2.2 0-4 1.8-4 4v8h40v-4c0-2.2-1.8-4-4-4"
                            />
                            <path
                              fill="#ffca28"
                              d="M40 12H8c-2.2 0-4 1.8-4 4v20c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V16c0-2.2-1.8-4-4-4"
                            />
                          </svg>
                          <span
                            className={`${isDark ? "text-[#cccccc]" : "text-[#333333]"} truncate`}
                            title={repo.name}
                          >
                            {repo.name}
                          </span>
                          <span className="ml-auto text-xs text-gray-500">
                            {repo.stargazers_count}⭐
                          </span>
                        </div>
                        
                        {/* Show files directly under the repo when it's active and open */}
                        {activeFolder === repo.name && openFolders.includes(repo.name) && repoFiles[repo.name] && (
                          <div className="ml-4">
                            {Object.entries(getFileGroups(repoFiles[repo.name])).map(([directory, files]) => (
                              <div key={directory}>
                                {directory && (
                                  <div
                                    className={`flex items-center px-2 py-1 cursor-pointer ${
                                      isDark ? "text-[#cccccc]" : "text-[#333333]"
                                    }`}
                                    onClick={() => toggleFolder(directory)}
                                  >
                                    <svg
                                      className={`w-4 h-4 mr-1 transition-transform duration-200 ${
                                        isDark ? "text-[#cccccc]" : "text-[#424242]"
                                      }`}
                                      style={{
                                        transform: openFolders.includes(directory)
                                          ? "rotate(90deg)"
                                          : "rotate(0deg)",
                                      }}
                                      viewBox="0 0 16 16"
                                      fill="currentColor"
                                    >
                                      <path d="M6 4l4 4-4 4V4z" />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4 mr-1"
                                      viewBox="0 0 48 48"
                                    >
                                      <path
                                        fill="#ffa000"
                                        d="M40 12H22l-4-4H8c-2.2 0-4 1.8-4 4v8h40v-4c0-2.2-1.8-4-4-4"
                                      />
                                      <path
                                        fill="#ffca28"
                                        d="M40 12H8c-2.2 0-4 1.8-4 4v20c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V16c0-2.2-1.8-4-4-4"
                                      />
                                    </svg>
                                    <span className="truncate" title={directory}>
                                      {directory.split('/').pop() || directory}
                                    </span>
                                  </div>
                                )}
                                
                                {(!directory || openFolders.includes(directory)) && (
                                  <div className={directory ? "ml-4" : ""}>
                                    {files.map((file) => (
                                      <div
                                        key={file.path}
                                        className={`flex items-center px-2 py-1 cursor-pointer ${
                                          activeFile && activeFile.path === file.path
                                            ? isDark
                                              ? "bg-[#37373D]/90"
                                              : "bg-[#E5EBEE]/90"
                                            : ""
                                        } hover:${
                                          isDark ? "bg-[#2A2D2E]/90" : "bg-[#E8E8E8]/90"
                                        }`}
                                        onClick={() => fetchFileContent(activeFolder, file)}
                                      >
                                        {getFileIcon(file.name)}
                                        <span
                                          className={`${isDark ? "text-[#cccccc]" : "text-[#333333]"} truncate`}
                                          title={file.name}
                                        >
                                          {file.name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recently Updated Repositories */}
              <div className="select-none mt-2">
                <div
                  className={`flex items-center px-2 py-1 cursor-pointer ${
                    isDark ? "text-[#cccccc]" : "text-[#333333]"
                  }`}
                  onClick={() => toggleFolder('recent')}
                >
                  <svg
                    className={`w-4 h-4 mr-1 transition-transform duration-200 ${
                      isDark ? "text-[#cccccc]" : "text-[#424242]"
                    }`}
                    style={{
                      transform: openFolders.includes('recent')
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                    }}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M6 4l4 4-4 4V4z" />
                  </svg>
                  <svg
                    className="w-4 h-4 mr-1 text-blue-400"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75V8a.5.5 0 01-.5.5H5.5a.5.5 0 010-1h2V4.75a.5.5 0 011 0z"></path>
                  </svg>
                  <span className="font-semibold">Recently Updated</span>
                </div>

                {openFolders.includes('recent') && (
                  <div className="ml-4">
                    {recentlyUpdatedRepos.map((repo) => (
                      <div key={repo.id}>
                        <div
                          className={`flex items-center px-2 py-1 cursor-pointer ${
                            activeFolder === repo.name
                              ? isDark
                                ? "bg-[#37373D]/90"
                                : "bg-[#E5EBEE]/90"
                              : ""
                          } hover:${
                            isDark ? "bg-[#2A2D2E]/90" : "bg-[#E8E8E8]/90"
                          }`}
                          onClick={() => fetchRepoFiles(repo, 'recent')}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4 mr-1"
                            viewBox="0 0 48 48"
                          >
                            <path
                              fill="#ffa000"
                              d="M40 12H22l-4-4H8c-2.2 0-4 1.8-4 4v8h40v-4c0-2.2-1.8-4-4-4"
                            />
                            <path
                              fill="#ffca28"
                              d="M40 12H8c-2.2 0-4 1.8-4 4v20c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V16c0-2.2-1.8-4-4-4"
                            />
                          </svg>
                          <span
                            className={`${isDark ? "text-[#cccccc]" : "text-[#333333]"} truncate`}
                            title={repo.name}
                          >
                            {repo.name}
                          </span>
                          <span className="ml-auto text-xs text-gray-500">
                            {new Date(repo.updated_at).toLocaleDateString('en-US', {
                              month: 'numeric',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        {/* Show files directly under the repo when it's active and open */}
                        {activeFolder === repo.name && openFolders.includes(repo.name) && repoFiles[repo.name] && (
                          <div className="ml-4">
                            {Object.entries(getFileGroups(repoFiles[repo.name])).map(([directory, files]) => (
                              <div key={directory}>
                                {directory && (
                                  <div
                                    className={`flex items-center px-2 py-1 cursor-pointer ${
                                      isDark ? "text-[#cccccc]" : "text-[#333333]"
                                    }`}
                                    onClick={() => toggleFolder(directory)}
                                  >
                                    <svg
                                      className={`w-4 h-4 mr-1 transition-transform duration-200 ${
                                        isDark ? "text-[#cccccc]" : "text-[#424242]"
                                      }`}
                                      style={{
                                        transform: openFolders.includes(directory)
                                          ? "rotate(90deg)"
                                          : "rotate(0deg)",
                                      }}
                                      viewBox="0 0 16 16"
                                      fill="currentColor"
                                    >
                                      <path d="M6 4l4 4-4 4V4z" />
                                    </svg>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4 mr-1"
                                      viewBox="0 0 48 48"
                                    >
                                      <path
                                        fill="#ffa000"
                                        d="M40 12H22l-4-4H8c-2.2 0-4 1.8-4 4v8h40v-4c0-2.2-1.8-4-4-4"
                                      />
                                      <path
                                        fill="#ffca28"
                                        d="M40 12H8c-2.2 0-4 1.8-4 4v20c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V16c0-2.2-1.8-4-4-4"
                                      />
                                    </svg>
                                    <span className="truncate" title={directory}>
                                      {directory.split('/').pop() || directory}
                                    </span>
                                  </div>
                                )}
                                
                                {(!directory || openFolders.includes(directory)) && (
                                  <div className={directory ? "ml-4" : ""}>
                                    {files.map((file) => (
                                      <div
                                        key={file.path}
                                        className={`flex items-center px-2 py-1 cursor-pointer ${
                                          activeFile && activeFile.path === file.path
                                            ? isDark
                                              ? "bg-[#37373D]/90"
                                              : "bg-[#E5EBEE]/90"
                                            : ""
                                        } hover:${
                                          isDark ? "bg-[#2A2D2E]/90" : "bg-[#E8E8E8]/90"
                                        }`}
                                        onClick={() => fetchFileContent(activeFolder, file)}
                                      >
                                        {getFileIcon(file.name)}
                                        <span
                                          className={`${isDark ? "text-[#cccccc]" : "text-[#333333]"} truncate`}
                                          title={file.name}
                                        >
                                          {file.name}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div
        className={`flex-1 overflow-auto ${
          isDark ? "bg-[#1e1e1e]/80" : "bg-[#ffffff]/80"
        } backdrop-blur-sm hide-scrollbar`}
      >
        {fileLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin h-8 w-8 border-2 border-light-accent dark:border-dark-accent rounded-full border-t-transparent"></div>
          </div>
        ) : activeFile ? (
          <div className="h-full flex flex-col">
            {/* File tabs */}
            <div
              className={`flex ${
                isDark ? "bg-[#252526]/90" : "bg-[#f3f3f3]/90"
              } border-b ${isDark ? "border-[#1e1e1e]" : "border-[#e4e4e4]"}`}
            >
              <div
                className={`px-3 py-1 flex items-center ${
                  isDark ? "bg-[#1e1e1e]/90" : "bg-[#ffffff]/90"
                }`}
              >
                {getFileIcon(activeFile.name)}
                <span
                  className={`${isDark ? "text-[#cccccc]" : "text-[#333333]"} ml-1`}
                >
                  {activeFile.name}
                </span>
              </div>
            </div>

            {/* File content */}
            <div className="p-0 h-[calc(100%-32px)] overflow-auto hide-scrollbar">
              <SyntaxHighlighter
                language={getFileLanguage(activeFile.path)}
                style={isDark ? vscDarkPlus : vs}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  height: '100%',
                  fontSize: '0.9rem',
                  backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
                }}
                showLineNumbers={true}
              >
                {fileContent}
              </SyntaxHighlighter>
            </div>
          </div>
        ) : (
          <div
            className={`flex items-center justify-center h-full ${
              isDark ? "text-[#6d6d6d]" : "text-[#999999]"
            }`}
          >
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg">Select a file to view</p>
              {!activeFolder && (
                <p className="mt-2 text-sm max-w-md px-4">
                  Choose a repository from the sidebar to explore its files
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get file icon based on extension
function getFileIcon(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  
  const iconMap = {
    'js': (
      <svg className="w-4 h-4 mr-1 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18v18H3V3zm16.525 13.707c-.131-.821-.666-1.511-2.252-2.155-.552-.259-1.165-.438-1.349-.854-.068-.248-.078-.382-.034-.529.113-.484.687-.629 1.137-.495.293.09.563.315.732.676.775-.507.775-.507 1.316-.844-.203-.314-.304-.451-.439-.586-.473-.528-1.103-.798-2.126-.775l-.528.067c-.507.124-.991.395-1.283.754-.855.968-.608 2.655.427 3.354 1.023.765 2.521.933 2.712 1.653.18.878-.652 1.159-1.475 1.058-.607-.136-.945-.439-1.316-1.002l-1.372.788c.157.359.337.517.607.832 1.305 1.316 4.568 1.249 5.153-.754.021-.067.18-.528.056-1.237l.034.049zm-6.737-5.434h-1.686c0 1.453-.007 2.898-.007 4.354 0 .924.047 1.772-.104 2.033-.247.517-.886.451-1.175.359-.297-.146-.448-.349-.623-.641-.047-.078-.082-.146-.095-.146l-1.368.844c.229.473.563.879.994 1.137.641.383 1.502.507 2.404.305.588-.17 1.095-.519 1.358-1.059.384-.697.302-1.553.299-2.509.008-1.541 0-3.083 0-4.635l.003-.042z"/>
      </svg>
    ),
    'py': (
      <svg className="w-4 h-4 mr-1 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.13-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.33-.23-.41-.08-.41.08z"/>
      </svg>
    ),
    'svelte': (
      <svg className="w-4 h-4 mr-1 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.354 21.125a4.44 4.44 0 0 1-4.765-1.767 4.109 4.109 0 0 1-.703-3.107 3.898 3.898 0 0 1 .134-.522l.105-.321.287.21a7.21 7.21 0 0 0 2.186 1.092l.208.063-.02.208a1.253 1.253 0 0 0 .226.83 1.337 1.337 0 0 0 1.435.533 1.231 1.231 0 0 0 .343-.15l5.59-3.562a1.164 1.164 0 0 0 .524-.778 1.242 1.242 0 0 0-.211-.937 1.338 1.338 0 0 0-1.435-.533 1.23 1.23 0 0 0-.343.15l-2.133 1.36a4.078 4.078 0 0 1-1.135.499 4.44 4.44 0 0 1-4.765-1.766 4.108 4.108 0 0 1-.702-3.108 3.855 3.855 0 0 1 1.742-2.582l5.589-3.563a4.072 4.072 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.109 4.109 0 0 1 .703 3.107 3.943 3.943 0 0 1-.134.522l-.105.321-.287-.21a7.204 7.204 0 0 0-2.186-1.092l-.208-.063.02-.208a1.253 1.253 0 0 0-.226-.83 1.337 1.337 0 0 0-1.435-.533 1.23 1.23 0 0 0-.343.15L8.62 9.368a1.163 1.163 0 0 0-.524.778 1.242 1.242 0 0 0 .211.937 1.338 1.338 0 0 0 1.435.533 1.23 1.23 0 0 0 .343-.15l2.133-1.36a4.078 4.078 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.108 4.108 0 0 1 .702 3.108 3.855 3.855 0 0 1-1.742 2.582l-5.589 3.563a4.072 4.072 0 0 1-1.135.499z"/>
      </svg>
    ),
    'ipynb': (
      <svg className="w-4 h-4 mr-1 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm0 4.8a7.2 7.2 0 1 1 0 14.4 7.2 7.2 0 0 1 0-14.4zm0 1.6a5.6 5.6 0 1 0 0 11.2 5.6 5.6 0 0 0 0-11.2zM9.981 7.84a.8.8 0 0 1 .8.8v6.72a.8.8 0 0 1-1.6 0V8.64a.8.8 0 0 1 .8-.8zm4.038 0a.8.8 0 0 1 .8.8v6.72a.8.8 0 0 1-1.6 0V8.64a.8.8 0 0 1 .8-.8z"/>
      </svg>
    ),
    'md': (
      <svg className="w-4 h-4 mr-1 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.27 19.385H1.73A1.73 1.73 0 0 1 0 17.655V6.345a1.73 1.73 0 0 1 1.73-1.73h20.54A1.73 1.73 0 0 1 24 6.345v11.308a1.73 1.73 0 0 1-1.73 1.731zM5.769 15.923v-4.5l2.308 2.885 2.307-2.885v4.5h2.308V8.078h-2.308l-2.307 2.885-2.308-2.885H3.46v7.847zM21.232 12h-2.309V8.077h-2.307V12h-2.308l3.461 4.039z"/>
      </svg>
    ),
    'json': (
      <svg className="w-4 h-4 mr-1 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.08 9.5c0-.65-.46-1.08-1.08-1.08-.57 0-1.08.47-1.08 1.08 0 .61.51 1.08 1.08 1.08.65 0 1.08-.47 1.08-1.08zM5 12.5c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-1-9c-.56 0-1 .44-1 1s.44 1 1 1 1-.44 1-1-.44-1-1-1zm-1.5 6c-.83 0-1.5-.67-1.5-1.5S1.67 6.5 2.5 6.5 4 7.17 4 8s-.67 1.5-1.5 1.5zm0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5zM5 4.5C5 5.33 4.33 6 3.5 6S2 5.33 2 4.5 2.67 3 3.5 3 5 3.67 5 4.5zm-2.5 11c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm17-6.5c-.56 0-1-.44-1-1s.44-1 1-1 1 .44 1 1zm-1.5-4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0 6c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm12 4c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm6.5-1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm1.5-7c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm0 10c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm0-6c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zm-2.5-4c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5z"/>
      </svg>
    ),
    'html': (
      <svg className="w-4 h-4 mr-1 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
      </svg>
    ),
    'css': (
      <svg className="w-4 h-4 mr-1 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414v-.001z"/>
      </svg>
    ),
  };
  
  return iconMap[extension] || (
    <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 9V3.5L18.5 9M6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V8l-6-6H6z"/>
    </svg>
  );
}