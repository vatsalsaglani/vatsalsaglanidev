"use client";

import { useState, useEffect, useRef } from "react";

const ContactContent = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);
  const [typingEffect, setTypingEffect] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const messageRef = useRef(null);

  // Contact information from LaTeX resume
  const contactInfo = {
    email: "saglanivatsal@gmail.com",
    website: "vatsalsaglani.pages.dev",
    linkedin: "vatsalsaglani",
    github: "vatsalsaglani",
    medium: "thevatsalsaglani",
    scholar: "Vatsal Saglani",
    phone: "+91-9790960353"
  };

  // Typing effect for the header
  useEffect(() => {
    const text = "Send me a message...";
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setTypingEffect(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle keyboard shortcut (Cmd/Ctrl + Enter)
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (!formData.message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    setIsSending(true);
    setError(null);
    
    try {
      // Replace with your Google Apps Script Web App URL
      const googleScriptUrl = 'https://script.google.com/macros/s/AKfycbwgKPm-kUShXf6iBcpNQCEYQWDfE4J5j4CvFaiH7J0EgA-wmRcfGg9skv8mAl6pi5Op/exec';
      
      // Format the current date for display
      const now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = days[now.getDay()];
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert 0 to 12
      const formattedTime = `${dayName} ${hours} ${ampm}`;
      
      // Add minutes for more precise time
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const formattedTimeWithMinutes = `${dayName} ${hours}:${minutes} ${ampm}`;
      
      // Collect additional metadata
      const metadata = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: now.toISOString(),
        formattedTime: formattedTimeWithMinutes
      };
      
      console.log("Sending data to Google Sheets:", metadata);
      
      // Send data to Google Sheets
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        body: JSON.stringify(metadata),
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors' // This is important for cross-origin requests to Google Scripts
      });
      
      // Since we're using no-cors, we can't actually read the response
      // So we'll just assume success if no error is thrown
      
      setIsSent(true);
      setFormData({
        name: "",
        email: "",
        message: ""
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSent(false);
      }, 3000);
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Fallback to URL-encoded form submission if JSON fails
      try {
        const formData = new FormData();
        Object.keys(metadata).forEach(key => {
          formData.append(key, metadata[key]);
        });
        
        const fallbackResponse = await fetch(googleScriptUrl, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        });
        
        setIsSent(true);
        setFormData({
          name: "",
          email: "",
          message: ""
        });
        
        setTimeout(() => {
          setIsSent(false);
        }, 3000);
      } catch (fallbackErr) {
        console.error('Fallback submission also failed:', fallbackErr);
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text font-mono">
      
      {/* Contact grid with improved styling */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 overflow-auto">
        {/* Email */}
        <a 
          href={`mailto:${contactInfo.email}`}
          className="flex items-center p-4 bg-light-surface/50 dark:bg-dark-surface/50 rounded-md border-l-4 border border-light-accent dark:border-dark-accent hover:bg-light-surface/80 dark:hover:bg-dark-surface/80 transition-colors group"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-light-accent to-light-accent/70 dark:from-dark-accent dark:to-dark-accent/70 text-white rounded-md mr-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm uppercase tracking-wider opacity-70 mb-1">Email</p>
            <p className="font-mono text-light-accent dark:text-dark-accent truncate">{contactInfo.email}</p>
          </div>
        </a>
        
        {/* Website */}
        <a 
          href={`https://${contactInfo.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-4 bg-light-surface/50 dark:bg-dark-surface/50 rounded-md border-l-4 border border-light-secondary dark:border-dark-secondary hover:bg-light-surface/80 dark:hover:bg-dark-surface/80 transition-colors group"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-light-secondary to-light-secondary/70 dark:from-dark-secondary dark:to-dark-secondary/70 text-white rounded-md mr-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm uppercase tracking-wider opacity-70 mb-1">Website</p>
            <p className="font-mono text-light-secondary dark:text-dark-secondary truncate">{contactInfo.website}</p>
          </div>
        </a>
        
        {/* LinkedIn */}
        <a 
          href={`https://linkedin.com/in/${contactInfo.linkedin}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-4 bg-light-surface/50 dark:bg-dark-surface/50 rounded-md border-l-4 border border-blue-500 hover:bg-light-surface/80 dark:hover:bg-dark-surface/80 transition-colors group"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-500/70 text-white rounded-md mr-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm uppercase tracking-wider opacity-70 mb-1">LinkedIn</p>
            <p className="font-mono text-blue-500 truncate">linkedin.com/in/{contactInfo.linkedin}</p>
          </div>
        </a>
        
        {/* GitHub */}
        <a 
          href={`https://github.com/${contactInfo.github}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-4 bg-light-surface/50 dark:bg-dark-surface/50 rounded-md border-l-4 border border-gray-500 hover:bg-light-surface/80 dark:hover:bg-dark-surface/80 transition-colors group"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-md mr-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm uppercase tracking-wider opacity-70 mb-1">GitHub</p>
            <p className="font-mono text-gray-500 dark:text-gray-400 truncate">github.com/{contactInfo.github}</p>
          </div>
        </a>
        
        {/* Medium */}
        <a 
          href={`https://${contactInfo.medium}.medium.com`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-4 bg-light-surface/50 dark:bg-dark-surface/50 rounded-md border-l-4 border border-green-500 hover:bg-light-surface/80 dark:hover:bg-dark-surface/80 transition-colors group"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-600 to-green-500/70 text-white rounded-md mr-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7.5 5h9v1.5h-9zM7.5 8.5h9v1.5h-9zM7.5 12h9v1.5h-9zM7.5 15.5h9v1.5h-9zM3 5h3v3h-3zM3 10h3v3h-3zM3 15h3v3h-3z"/>
            </svg>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm uppercase tracking-wider opacity-70 mb-1">Medium</p>
            <p className="font-mono text-green-500 truncate">{contactInfo.medium}.medium.com</p>
          </div>
        </a>
        
        {/* Phone */}
        <a 
          href={`tel:${contactInfo.phone}`}
          className="flex items-center p-4 bg-light-surface/50 dark:bg-dark-surface/50 rounded-md border-l-4 border border-light-accent dark:border-dark-accent hover:bg-light-surface/80 dark:hover:bg-dark-surface/80 transition-colors group"
        >
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-light-accent to-light-accent/70 dark:from-dark-accent dark:to-dark-accent/70 text-white rounded-md mr-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm uppercase tracking-wider opacity-70 mb-1">Phone</p>
            <p className="font-mono text-light-accent dark:text-dark-accent truncate">{contactInfo.phone}</p>
          </div>
        </a>
      </div>
      
      {/* Terminal-style message form */}
      <div className="mt-auto p-4 bg-light-surface/30 dark:bg-dark-surface/30 border-t border-light-text/10 dark:border-dark-text/10">
        <div className="mb-2 flex items-center">
          <span className="text-xs opacity-50 mr-2">$ contact.sh</span>
          <div className="h-px flex-grow bg-light-text/10 dark:bg-dark-text/10"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name and Email fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center">
              <span className="text-light-accent dark:text-dark-accent mr-2 font-bold min-w-[20px]">{'$'}</span>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="flex-1 bg-light-background/50 dark:bg-dark-background/50 border border-light-text/20 dark:border-dark-text/20 rounded-md p-2 text-sm focus:outline-none focus:border-light-accent dark:focus:border-dark-accent font-mono"
              />
            </div>
            <div className="flex items-center">
              <span className="text-light-accent dark:text-dark-accent mr-2 font-bold min-w-[20px]">{'@'}</span>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="flex-1 bg-light-background/50 dark:bg-dark-background/50 border border-light-text/20 dark:border-dark-text/20 rounded-md p-2 text-sm focus:outline-none focus:border-light-accent dark:focus:border-dark-accent font-mono"
              />
            </div>
          </div>
          
          {/* Message field */}
          <div className="flex items-start">
            <span className="text-light-accent dark:text-dark-accent mr-2 font-bold mt-2">{'>'}</span>
            <textarea 
              ref={messageRef}
              name="message"
              value={formData.message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="flex-1 bg-light-background/50 dark:bg-dark-background/50 border border-light-text/20 dark:border-dark-text/20 rounded-md p-3 text-sm focus:outline-none focus:border-light-accent dark:focus:border-dark-accent resize-none h-24 font-mono"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs opacity-70">
              {isSent && (
                <span className="text-green-500 dark:text-green-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Message sent successfully!
                </span>
              )}
              {error && (
                <span className="text-red-500 dark:text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </span>
              )}
              {!isSent && !error && !isSending && (
                <span className="text-light-text/50 dark:text-dark-text/50">Press Cmd/Ctrl + Enter to send</span>
              )}
            </div>
            <button 
              type="submit"
              disabled={isSending || !formData.message.trim() || !formData.name.trim() || !formData.email.trim()}
              className={`px-4 py-2 rounded-md text-white flex items-center ${
                isSending || !formData.message.trim() || !formData.name.trim() || !formData.email.trim()
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-light-accent dark:bg-dark-accent hover:opacity-90'
              } transition-colors`}
            >
              {isSending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Retro footer */}
      <div className="p-2 text-center text-xs opacity-50 bg-light-surface/50 dark:bg-dark-surface/50 border-t border-light-text/10 dark:border-dark-text/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-light-background/50 dark:bg-dark-background/50 rounded-full">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span>© {new Date().getFullYear()} Vatsal Saglani • All rights reserved</span>
        </div>
      </div>
    </div>
  );
};

export default ContactContent; 