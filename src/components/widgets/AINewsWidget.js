"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from "@/context/ThemeContext";

export default function AINewsWidget() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const visibilityRef = useRef(true);

  // Track if the page is visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      visibilityRef.current = document.visibilityState === 'visible';
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Fetch AI news
  useEffect(() => {
    async function fetchAINews() {
      // Only fetch if the page is visible
      if (!visibilityRef.current) return;
      
      try {
        setLoading(true);
        
        // Fetch top stories from HackerNews
        const topStoriesResponse = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        if (!topStoriesResponse.ok) {
          throw new Error('Failed to fetch top stories');
        }
        
        const topStoryIds = await topStoriesResponse.json();
        
        // Fetch details for the top 20 stories
        const storyPromises = topStoryIds.slice(0, 20).map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
            .then(response => response.json())
        );
        
        const stories = await Promise.all(storyPromises);
        
        // Filter for AI-related stories
        const aiKeywords = ['ai', 'artificial intelligence', 'machine learning', 'ml', 'deep learning', 
                           'neural network', 'gpt', 'llm', 'large language model', 'openai', 'chatgpt'];
        
        const aiStories = stories.filter(story => {
          if (!story || !story.title) return false;
          
          const title = story.title.toLowerCase();
          return aiKeywords.some(keyword => title.includes(keyword.toLowerCase()));
        });
        
        // If we don't have enough AI stories, add some other tech stories
        let finalStories = aiStories;
        if (aiStories.length < 5) {
          const otherStories = stories
            .filter(story => !aiStories.includes(story))
            .slice(0, 5 - aiStories.length);
          
          finalStories = [...aiStories, ...otherStories];
        }
        
        // Sort by score (popularity)
        finalStories.sort((a, b) => b.score - a.score);
        
        // Take top 5
        setNews(finalStories.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching AI news:', error);
        setError('Failed to load news');
        setLoading(false);
      }
    }
    
    // Initial fetch
    fetchAINews();
    
    // Refresh every 5 minutes if the page is visible
    const interval = setInterval(() => {
      if (visibilityRef.current) {
        fetchAINews();
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Format the time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  // Direct navigation function that bypasses normal event handling
  const directNavigate = (url, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.open(url, '_blank');
  };

  return (
    <div className="widget bg-black/60 backdrop-blur-md rounded-xl overflow-hidden text-white p-4 w-72" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
          <h3 className="font-medium">AI News</h3>
        </div>
        <div className="text-xs text-blue-400 font-medium">
          HackerNews
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-xs p-4 text-center">
          {error}
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {news.length > 0 ? (
            news.map((item, index) => (
              <div 
                key={index}
                className="block p-2 bg-white/10 hover:bg-white/15 rounded-lg transition-colors cursor-pointer"
                onClick={(e) => directNavigate(item.url || `https://news.ycombinator.com/item?id=${item.id}`, e)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">{item.title}</h4>
                    <div className="flex items-center text-xs text-white/70">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        {item.score}
                      </span>
                      <span className="mx-2">•</span>
                      <span>{formatTime(item.time)}</span>
                      {item.by && (
                        <>
                          <span className="mx-2">•</span>
                          <span>by {item.by}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-white/70 text-sm">
              No AI news found at the moment
            </div>
          )}
          
          {/* View More Link with direct navigation */}
          <div 
            className="block text-center text-xs bg-white/10 hover:bg-white/20 transition-colors p-2 rounded-lg mt-2 cursor-pointer"
            onClick={(e) => directNavigate("https://news.ycombinator.com/news", e)}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            View More News →
          </div>
        </div>
      )}
    </div>
  );
} 