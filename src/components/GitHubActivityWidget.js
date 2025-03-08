"use client";

import { useState, useEffect } from 'react';
import { useTheme } from "@/context/ThemeContext";

export default function GitHubActivityWidget() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCommits: 0,
    totalPRs: 0,
    totalIssues: 0,
    totalRepos: 0
  });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchGitHubActivity() {
      try {
        setLoading(true);
        // Replace with your GitHub username
        const username = 'vatsalsaglani';
        const response = await fetch(`https://api.github.com/users/${username}/events?per_page=10`);
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data = await response.json();
        setActivities(data);
        
        // Calculate stats
        const commits = data.filter(event => event.type === 'PushEvent')
          .reduce((total, event) => total + (event.payload.commits?.length || 0), 0);
        
        const prs = data.filter(event => event.type === 'PullRequestEvent').length;
        const issues = data.filter(event => event.type === 'IssuesEvent').length;
        
        // Get unique repos
        const uniqueRepos = new Set(data.map(event => event.repo.name));
        
        setStats({
          totalCommits: commits,
          totalPRs: prs,
          totalIssues: issues,
          totalRepos: uniqueRepos.size
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setError('Failed to load GitHub activity. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchGitHubActivity();
    // Refresh every 5 minutes
    const interval = setInterval(fetchGitHubActivity, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Format the event type to be more readable
  const formatEventType = (type) => {
    return type
      .replace('Event', '')
      .replace(/([A-Z])/g, ' $1')
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
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };

  // Get color for event type
  const getEventColor = (type) => {
    switch (type) {
      case 'PushEvent':
        return 'bg-green-500 dark:bg-green-600';
      case 'PullRequestEvent':
        return 'bg-purple-500 dark:bg-purple-600';
      case 'IssuesEvent':
        return 'bg-blue-500 dark:bg-blue-600';
      case 'CreateEvent':
        return 'bg-yellow-500 dark:bg-yellow-600';
      case 'DeleteEvent':
        return 'bg-red-500 dark:bg-red-600';
      case 'WatchEvent':
        return 'bg-pink-500 dark:bg-pink-600';
      case 'ForkEvent':
        return 'bg-indigo-500 dark:bg-indigo-600';
      default:
        return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  return (
    <div className="text-light-text dark:text-dark-text p-4 h-full overflow-auto hide-scrollbar">
      <div className="flex items-center mb-4">
        <svg className="w-6 h-6 mr-2 text-light-text dark:text-dark-text" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <h2 className="text-xl font-bold">GitHub Activity</h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-light-surface/60 dark:bg-dark-surface/60 p-3 rounded-lg">
          <div className="text-xs text-light-text/70 dark:text-dark-text/70">Commits</div>
          <div className="text-xl font-bold">{stats.totalCommits}</div>
        </div>
        <div className="bg-light-surface/60 dark:bg-dark-surface/60 p-3 rounded-lg">
          <div className="text-xs text-light-text/70 dark:text-dark-text/70">Pull Requests</div>
          <div className="text-xl font-bold">{stats.totalPRs}</div>
        </div>
        <div className="bg-light-surface/60 dark:bg-dark-surface/60 p-3 rounded-lg">
          <div className="text-xs text-light-text/70 dark:text-dark-text/70">Issues</div>
          <div className="text-xl font-bold">{stats.totalIssues}</div>
        </div>
        <div className="bg-light-surface/60 dark:bg-dark-surface/60 p-3 rounded-lg">
          <div className="text-xs text-light-text/70 dark:text-dark-text/70">Repositories</div>
          <div className="text-xl font-bold">{stats.totalRepos}</div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="mb-2 font-medium">Recent Activity</div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-6 w-6 border-2 border-light-accent dark:border-dark-accent rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div 
                key={index} 
                className="p-3 bg-light-surface/60 dark:bg-dark-surface/60 rounded-lg border border-light-text/10 dark:border-dark-text/10"
              >
                <div className="flex items-start">
                  <div className={`w-2 h-2 mt-1.5 rounded-full ${getEventColor(activity.type)} mr-2`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{formatEventType(activity.type)}</span>
                      <span className="text-xs text-light-text/70 dark:text-dark-text/70">
                        {formatDate(activity.created_at)}
                      </span>
                    </div>
                    <div className="text-sm truncate">
                      {activity.repo.name}
                    </div>
                    {activity.type === 'PushEvent' && activity.payload.commits && (
                      <div className="mt-1 text-xs text-light-text/70 dark:text-dark-text/70">
                        {activity.payload.commits.length} commit{activity.payload.commits.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 bg-light-surface/60 dark:bg-dark-surface/60 rounded-lg">
              No recent activity found.
            </div>
          )}
        </div>
      )}
    </div>
  );
} 