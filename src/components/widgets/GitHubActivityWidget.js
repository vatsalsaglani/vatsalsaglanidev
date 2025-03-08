"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function GitHubActivityWidget({ onExpandChange }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    totalRepos: 0,
  });
  const [profile, setProfile] = useState({
    name: "",
    login: "",
    avatar: "",
    followers: 0,
    following: 0,
    stars: 0,
    publicRepos: 0,
  });
  const [expanded, setExpanded] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Notify parent component when expanded state changes
  useEffect(() => {
    if (typeof onExpandChange === "function") {
      onExpandChange(expanded);
    }
  }, [expanded, onExpandChange]);

  // Mock data to use when API rate limit is exceeded
  const mockProfile = {
    name: "Demo User",
    login: "demouser",
    avatar: "https://avatars.githubusercontent.com/u/583231?v=4", // GitHub octocat avatar
    followers: 142,
    following: 63,
    stars: 78,
    publicRepos: 24,
  };

  const mockActivities = [
    {
      id: "1",
      type: "PushEvent",
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      repo: { name: "demouser/project-alpha" },
      payload: {
        commits: [
          { message: "Fix navigation bug" },
          { message: "Update README" },
        ],
      },
    },
    {
      id: "2",
      type: "PullRequestEvent",
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      repo: { name: "demouser/awesome-app" },
      payload: { action: "opened" },
    },
    {
      id: "3",
      type: "IssuesEvent",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      repo: { name: "organization/shared-library" },
      payload: { action: "opened" },
    },
    {
      id: "4",
      type: "CreateEvent",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      repo: { name: "demouser/new-project" },
      payload: { ref_type: "repository" },
    },
  ];

  const mockStats = {
    totalCommits: 14,
    totalPRs: 3,
    totalIssues: 2,
    totalRepos: 4,
  };

  // Function to use mock data
  const useMockData = () => {
    setProfile(mockProfile);
    setActivities(mockActivities);
    setStats(mockStats);
    setUsingMockData(true);
    setLoading(false);
  };

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        setLoading(true);
        // Replace with your GitHub username
        const username = "vatsalsaglani";

        // Check if we have cached data to avoid hitting rate limits
        const cachedData = localStorage.getItem("github_data");
        const cachedTimestamp = localStorage.getItem("github_data_timestamp");

        // Use cached data if it's less than 10 minutes old
        if (cachedData && cachedTimestamp) {
          const parsedData = JSON.parse(cachedData);
          const timestamp = parseInt(cachedTimestamp);
          const now = Date.now();

          // If cache is less than 10 minutes old, use it
          if (now - timestamp < 10 * 60 * 1000) {
            setProfile(parsedData.profile);
            setActivities(parsedData.activities);
            setStats(parsedData.stats);
            setLoading(false);
            return;
          }
        }

        // Optional: Add your GitHub token for higher rate limits
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
        const headers = token ? { Authorization: `token ${token}` } : {};
        // const headers = {};

        // Fetch user profile data
        const profileResponse = await fetch(
          `https://api.github.com/users/${username}`,
          { headers }
        );

        // Check for rate limit error
        if (profileResponse.status === 403) {
          const rateLimitData = await profileResponse.json();
          if (
            rateLimitData.message &&
            rateLimitData.message.includes("rate limit")
          ) {
            console.warn("GitHub API rate limit exceeded, using mock data");
            useMockData();
            return;
          }
        }

        if (!profileResponse.ok) {
          throw new Error(`GitHub API error: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();

        // Fetch user's repositories to calculate stars
        const reposResponse = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=150`,
          { headers }
        );

        // Check for rate limit error
        if (reposResponse.status === 403) {
          useMockData();
          return;
        }

        if (!reposResponse.ok) {
          throw new Error(`GitHub API error: ${reposResponse.status}`);
        }

        const reposData = await reposResponse.json();

        // Calculate total stars
        const totalStars = reposData.reduce(
          (sum, repo) => sum + repo.stargazers_count,
          0
        );

        // Set profile data
        const profileInfo = {
          name: profileData.name || profileData.login,
          login: profileData.login,
          avatar: profileData.avatar_url,
          followers: profileData.followers,
          following: profileData.following,
          stars: totalStars,
          publicRepos: profileData.public_repos,
        };

        setProfile(profileInfo);

        // Fetch recent activity
        const activityResponse = await fetch(
          `https://api.github.com/users/${username}/events?per_page=5`,
          { headers }
        );

        // Check for rate limit error
        if (activityResponse.status === 403) {
          // We already have profile data, so just use mock activity data
          setActivities(mockActivities);
          setStats(mockStats);
          setLoading(false);
          return;
        }

        if (!activityResponse.ok) {
          throw new Error(`GitHub API error: ${activityResponse.status}`);
        }

        const activityData = await activityResponse.json();
        setActivities(activityData);

        // Calculate activity stats
        const commits = activityData
          .filter((event) => event.type === "PushEvent")
          .reduce(
            (total, event) => total + (event.payload.commits?.length || 0),
            0
          );

        const prs = activityData.filter(
          (event) => event.type === "PullRequestEvent"
        ).length;
        const issues = activityData.filter(
          (event) => event.type === "IssuesEvent"
        ).length;

        // Get unique repos from activity
        const uniqueRepos = new Set(
          activityData.map((event) => event.repo.name)
        );

        const statsInfo = {
          totalCommits: commits,
          totalPRs: prs,
          totalIssues: issues,
          totalRepos: uniqueRepos.size,
        };

        setStats(statsInfo);

        // Cache the data to reduce API calls
        localStorage.setItem(
          "github_data",
          JSON.stringify({
            profile: profileInfo,
            activities: activityData,
            stats: statsInfo,
          })
        );
        localStorage.setItem("github_data_timestamp", Date.now().toString());

        setLoading(false);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);

        // Check if we have cached data to use as fallback
        const cachedData = localStorage.getItem("github_data");
        if (cachedData) {
          console.log("Using cached GitHub data as fallback");
          const parsedData = JSON.parse(cachedData);
          setProfile(parsedData.profile);
          setActivities(parsedData.activities);
          setStats(parsedData.stats);
          setLoading(false);
        } else {
          // No cached data, use mock data
          console.log("No cached data available, using mock data");
          useMockData();
        }

        setError("GitHub API limit reached. Using cached or demo data.");
      }
    }

    fetchGitHubData();
    // Refresh every 10 minutes instead of 5 to reduce API calls
    const interval = setInterval(fetchGitHubData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Format the event type to be more readable
  const formatEventType = (type) => {
    return type
      .replace("Event", "")
      .replace(/([A-Z])/g, " $1")
      .trim();
  };

  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `${diffDays}d`;
    }
  };

  // Get color for event type
  const getEventColor = (type) => {
    switch (type) {
      case "PushEvent":
        return "bg-green-500";
      case "PullRequestEvent":
        return "bg-purple-500";
      case "IssuesEvent":
        return "bg-blue-500";
      case "CreateEvent":
        return "bg-yellow-500";
      case "DeleteEvent":
        return "bg-red-500";
      case "WatchEvent":
        return "bg-pink-500";
      case "ForkEvent":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="widget bg-black/60 backdrop-blur-md rounded-xl overflow-hidden text-white p-4 w-72">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
          </svg>
          <h3 className="font-medium">GitHub Activity</h3>
        </div>
        {usingMockData && (
          <div className="text-xs text-amber-400">Demo Data</div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* User Profile */}
          <div className="flex items-center mb-4 bg-white/5 p-2 rounded-lg">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
            <div className="ml-3">
              <div className="font-bold">{profile.name}</div>
              <div className="text-xs text-white/70">@{profile.login}</div>
            </div>
          </div>

          {/* GitHub Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <div className="text-xs text-white/70">Repos</div>
              <div className="text-lg font-bold">{profile.publicRepos}</div>
            </div>
            <div className="bg-white/10 p-2 rounded-lg">
              <div className="text-xs text-white/70">Stars</div>
              <div className="text-lg font-bold">{profile.stars}</div>
            </div>
            <div className="bg-white/10 p-2 rounded-lg">
              <div className="text-xs text-white/70">Followers</div>
              <div className="text-lg font-bold">{profile.followers}</div>
            </div>
            <div className="bg-white/10 p-2 rounded-lg">
              <div className="text-xs text-white/70">Following</div>
              <div className="text-lg font-bold">{profile.following}</div>
            </div>
          </div>

          {/* Error message if any */}
          {error && (
            <div className="text-amber-400 text-xs mb-3 p-2 bg-amber-400/10 rounded-lg">
              {error}
            </div>
          )}

          {/* Expand/Collapse Button */}
          <div 
            className="w-full py-2 px-3 mb-3 bg-white/10 hover:bg-white/15 transition-colors rounded-lg flex items-center justify-between cursor-pointer interactive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleExpanded();
            }}
            style={{ position: 'relative', zIndex: 50 }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium">
              {expanded ? "Hide Recent Activity" : "Show Recent Activity"}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {/* Expandable Activity Section */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Recent Activity Stats */}
                <div className="text-xs font-medium mb-2 text-white/80">
                  Recent Activity
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <div className="text-xs text-white/70">Commits</div>
                    <div className="text-lg font-bold">
                      {stats.totalCommits}
                    </div>
                  </div>
                  <div className="bg-white/10 p-2 rounded-lg">
                    <div className="text-xs text-white/70">PRs</div>
                    <div className="text-lg font-bold">{stats.totalPRs}</div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="text-xs font-medium mb-2 text-white/80">
                  Latest Events
                </div>
                <div className="space-y-2 mb-3">
                  {activities.length > 0 ? (
                    activities.slice(0, 4).map((activity, index) => (
                      <div
                        key={index}
                        className="p-2 bg-white/10 rounded-lg text-xs"
                      >
                        <div className="flex items-start">
                          <div
                            className={`w-2 h-2 mt-1 rounded-full ${getEventColor(
                              activity.type
                            )} mr-2 flex-shrink-0`}
                          ></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <span className="font-medium truncate">
                                {formatEventType(activity.type)}
                              </span>
                              <span className="text-white/60 ml-1 flex-shrink-0">
                                {formatDate(activity.created_at)}
                              </span>
                            </div>
                            <div className="truncate">
                              {activity.repo.name.split("/")[1]}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-2 bg-white/10 rounded-lg text-xs">
                      No activity found
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View Profile Link - clickable */}
          <div
            className="block text-center text-xs bg-white/10 hover:bg-white/20 transition-colors p-2 rounded-lg cursor-pointer interactive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              window.open(`https://github.com/${profile.login}`, '_blank');
            }}
            style={{ position: 'relative', zIndex: 50 }}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            View Full Profile →
          </div>
        </>
      )}
    </div>
  );
}
