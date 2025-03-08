"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import Three.js components to avoid SSR issues
const SpaceBackground = dynamic(() => import("./SpaceBackground"), { 
  ssr: false,
  suspense: true 
});

const AboutMeContent = () => {
  // State for current time period
  const [currentPeriod, setCurrentPeriod] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef(null);
  
  // Define time periods in chronological order (oldest to newest)
  const timePeriods = [
    {
      id: "education",
      title: "B.Tech, Computer Science and Engineering",
      organization: "Vellore Institute of Technology",
      date: "June 2015 - May 2019",
      content: (
        <>
          <p className="mb-4">
            Completed Bachelor of Technology in Computer Science and Engineering with a Cumulative GPA of 8.48/10.
          </p>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Achievements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Awarded VIT Best Project in 2019 for an outstanding capstone project</li>
              <li>Published multiple research papers during undergraduate studies</li>
              <li>Participated in various hackathons and coding competitions</li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Publications:</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Malware Classification using Machine Learning Algorithms</strong>
                <p className="text-sm text-light-text/70 dark:text-dark-text/70">Presented at the 2nd International Conference on Trends in Electronics and Informatics (ICOEI)</p>
                <p className="text-sm text-light-text/70 dark:text-dark-text/70">Citations: 22</p>
              </li>
              <li>
                <strong>Big Data Technology in Healthcare: A Survey</strong>
                <p className="text-sm text-light-text/70 dark:text-dark-text/70">Delivered at the 10th IFIP International Conference on New Technologies, Mobility, and Security (NTMS)</p>
                <p className="text-sm text-light-text/70 dark:text-dark-text/70">Citations: 4</p>
              </li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: "intern-iiit",
      title: "Machine Learning Intern",
      organization: "IIIT Allahabad",
      date: "May 2019 - July 2019",
      content: (
        <>
          <p className="mb-4">
            Conducted comprehensive data analysis on network traffic through various switches to optimize cluster efficiency.
          </p>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Key Achievements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Analyzed network traffic data to optimize cluster efficiency</li>
              <li>Achieved significant cost reduction and energy savings</li>
              <li>Applied machine learning techniques to network optimization</li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Data Analysis</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Network Optimization</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Python</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "intern-krishihub",
      title: "Data Science Intern",
      organization: "KrishiHub",
      date: "September 2019 - January 2020",
      content: (
        <>
          <p className="mb-4">
            Engineered OpenCV algorithms to identify diseased crop regions and implemented meta-learning techniques for crop disease classification.
          </p>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Key Achievements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Developed OpenCV algorithms for accurate disease detection in crops</li>
              <li>Implemented meta-learning techniques for crop disease classification</li>
              <li>Integrated OpenCV-based detection with classifier systems</li>
              <li>Deployed production-level agricultural technology solutions</li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">OpenCV</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Meta-learning</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Computer Vision</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Python</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "consultant",
      title: "Machine Learning Consultant",
      organization: "Quinnox",
      date: "January 2020 - November 2021",
      content: (
        <>
          <p className="mb-4">
            Pioneered implementation of data pre-processing pipelines and developed text classification models to automate content categorization.
          </p>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Key Achievements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Implemented data pre-processing pipelines using Pandas</li>
              <li>Developed text classification models using Scikit-learn, FastText, and Gensim</li>
              <li>Led extraction and recognition of named entities using transformer models</li>
              <li>Engineered text augmentation processes to improve model robustness</li>
              <li>Created a conversational bot for streamlining automation testing</li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Pandas</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Scikit-learn</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">FastText</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Gensim</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">FastAPI</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Flask</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "senior-engineer",
      title: "Senior Data Science Engineer",
      organization: "Qyrus",
      date: "November 2021 - July 2024",
      content: (
        <>
          <p className="mb-4">
            Led the development of AI-powered testing solutions and built sophisticated models for text classification, recommendation systems, and multi-modal architectures.
          </p>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Key Achievements:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Developed transformer models from scratch for text classification and NER</li>
              <li>Designed a recommendation system using a decoder-only transformer model</li>
              <li>Engineered a multi-modal architecture combining Transformers and CNNs</li>
              <li>Fine-tuned object detection models (DETR, Detectron2, YOLO)</li>
              <li>Led the development of a Generative AI-powered Software Testing Kit (STK)</li>
              <li>Created a self-serve Retrieval-Augmented Generation (RAG) system</li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Transformers</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">PyTorch</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">AWS</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">FastAPI</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">NextJS</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">SvelteKit</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-light-surface/50 dark:bg-dark-surface/50 rounded-lg border border-light-accent/20 dark:border-dark-accent/20">
            <h4 className="text-lg font-semibold text-light-accent dark:text-dark-accent mb-3">Key Innovations</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Generative AI-powered Software Testing Kit (STK):</strong>
                <p className="text-sm text-light-text/80 dark:text-dark-text/80">Developed an accessible Python library empowering traditional testers to leverage the power of AI seamlessly.</p>
              </li>
              <li>
                <strong>Agent-based Autonomous Testing:</strong>
                <p className="text-sm text-light-text/80 dark:text-dark-text/80">Pioneered multi-agent workflows that significantly reduce manual intervention, enhance accuracy, and accelerate testing cycles.</p>
              </li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: "present",
      title: "Data Science Lead - GenAI",
      organization: "Qyrus",
      date: "July 2024 - Present",
      content: (
        <>
          <p className="mb-4">
            Currently leading innovative projects at Qyrus, where I focus on designing and implementing autonomous, agent-based workflows that revolutionize how we approach testing across Web, Mobile, Desktop applications, and APIs.
          </p>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Key Responsibilities:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Leading the development of AI-powered automation frameworks and SDKs</li>
              <li>Architecting and implementing agentic AI orchestration systems</li>
              <li>Developing advanced developer productivity tools leveraging LLMs</li>
              <li>Creating scalable data pipelines for general ETL validations</li>
              <li>Designing vision-based automation solutions for UI testing</li>
              <li>Mentoring team members on AI/ML best practices and implementation</li>
            </ul>
          </div>
          <div className="mb-4">
            <h4 className="text-light-accent dark:text-dark-accent font-semibold mb-2">Technologies:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">LLMs</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">AWS</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Azure</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">PyTorch</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Playwright</span>
              <span className="px-2 py-1 bg-light-accent/10 dark:bg-dark-accent/20 text-light-accent dark:text-dark-accent rounded-md text-sm">Computer Vision</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-light-surface/50 dark:bg-dark-surface/50 rounded-lg border border-light-accent/20 dark:border-dark-accent/20">
            <h4 className="text-lg font-semibold text-light-accent dark:text-dark-accent mb-3">Key Achievements</h4>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>AI-Powered Testing Framework:</strong>
                <p className="text-sm text-light-text/80 dark:text-dark-text/80">Developed a comprehensive browser automation framework with adaptive streaming and accessibility features, published as an open-source SDK.</p>
              </li>
              <li>
                <strong>Developer Productivity Suite:</strong>
                <p className="text-sm text-light-text/80 dark:text-dark-text/80">Created an AI-powered chatbot with integrated diagramming capabilities and code preview functionality, significantly enhancing developer workflows.</p>
              </li>
              <li>
                <strong>Team Leadership:</strong>
                <p className="text-sm text-light-text/80 dark:text-dark-text/80">Successfully led multiple AI initiatives while fostering a collaborative environment for knowledge sharing and cross-functional skill development.</p>
              </li>
            </ul>
          </div>
        </>
      )
    }
  ];

  // Navigate to next period (forward in time - to newer periods)
  const goForward = () => {
    if (currentPeriod < timePeriods.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPeriod(prev => prev + 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Navigate to previous period (back in time - to older periods)
  const goBack = () => {
    if (currentPeriod > 0 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPeriod(prev => prev - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Go to present (most recent period)
  const goToPresent = () => {
    if (currentPeriod !== timePeriods.length - 1 && !isAnimating) {
      setIsAnimating(true);
      setCurrentPeriod(timePeriods.length - 1);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Handle timeline click
  const handleTimelineClick = (index) => {
    if (currentPeriod !== index && !isAnimating) {
      setIsAnimating(true);
      setCurrentPeriod(index);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  // Scroll to top when period changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [currentPeriod]);

  return (
    <div className="time-machine-container h-full flex flex-col bg-gradient-to-b from-light-background/90 to-light-surface/90 dark:from-dark-background/90 dark:to-dark-surface/90 text-light-text dark:text-dark-text overflow-hidden relative">
      {/* 3D Space Background */}
      <div className="absolute inset-0 z-behind">
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-gray-900 to-black"></div>}>
          <SpaceBackground />
        </Suspense>
      </div>
      
      {/* Introduction section */}
      <div className="intro-section p-6 border-b border-light-accent/10 dark:border-dark-accent/10 bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-light-accent dark:border-dark-accent shadow-lg">
              <img 
                src="/assets/vatsal.JPG" 
                alt="Vatsal Saglani" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Introduction Text */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-light-accent dark:text-dark-accent flex items-center">
              <span className="wave-emoji mr-2">👋</span> Hello, I'm Vatsal Saglani
            </h1>
            <p className="text-light-text/90 dark:text-dark-text/90 text-sm sm:text-base">
              A Data Science Lead specializing in Generative AI and Autonomous Agents. I thrive at the intersection of artificial intelligence, software testing automation, and advanced machine learning techniques.
            </p>
          </div>
        </div>
      </div>
      
      {/* Time Machine header */}
      <div className="time-header sticky top-0 z-10 p-4 bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-md border-b border-light-accent/10 dark:border-dark-accent/10 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-light-text dark:text-dark-text flex items-center">
            <svg className="w-5 h-5 mr-2 text-light-accent dark:text-dark-accent" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Time Machine
          </h2>
          <div className="text-light-text/70 dark:text-dark-text/70 text-sm">
            Currently viewing: <span className="text-light-accent dark:text-dark-accent font-medium">{timePeriods[currentPeriod].date}</span>
          </div>
        </div>
        <div className="hidden sm:block">
          <button 
            onClick={goToPresent}
            className="px-3 py-1 bg-light-accent dark:bg-dark-accent text-white rounded-md hover:opacity-90 transition-opacity text-sm shadow-md"
          >
            Return to Present
          </button>
        </div>
      </div>
      
      {/* Main content area */}
      <div ref={contentRef} className="time-content-area flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPeriod}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text flex items-center">
                <span className="inline-block w-2 h-8 bg-light-accent dark:bg-dark-accent mr-3 rounded-sm"></span>
                {timePeriods[currentPeriod].title}
              </h3>
              <div className="flex items-center text-light-text/70 dark:text-dark-text/70 ml-5">
                <span className="mr-2 font-medium">{timePeriods[currentPeriod].organization}</span>
                <span className="text-sm bg-light-accent/10 dark:bg-dark-accent/10 px-2 py-0.5 rounded-full text-light-accent dark:text-dark-accent">
                  {timePeriods[currentPeriod].date}
                </span>
              </div>
            </div>
            
            <div className="time-period-content bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-md p-5 rounded-lg border border-light-accent/10 dark:border-dark-accent/10 shadow-lg">
              {timePeriods[currentPeriod].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Timeline navigation */}
      <div className="time-navigation sticky bottom-0 p-4 bg-light-surface/70 dark:bg-dark-surface/70 backdrop-blur-md border-t border-light-accent/10 dark:border-dark-accent/10">
        <div className="timeline-slider relative h-8 mb-3">
          <div className="absolute inset-0 flex items-center">
            <div className="h-1 w-full bg-light-text/10 dark:bg-dark-text/10 rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center">
            <div 
              className="h-1 bg-light-accent dark:bg-dark-accent rounded-full transition-all duration-300"
              style={{ 
                width: `${(currentPeriod / (timePeriods.length - 1)) * 100}%`,
              }}
            ></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-between px-1">
            {timePeriods.map((period, index) => (
              <div key={period.id} className="group relative">
                <button
                  onClick={() => handleTimelineClick(index)}
                  className={`w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center ${
                    currentPeriod === index 
                      ? 'bg-light-accent dark:bg-dark-accent scale-125' 
                      : 'bg-light-text/20 dark:bg-dark-text/20 hover:bg-light-text/40 dark:hover:bg-dark-text/40'
                  }`}
                >
                  {currentPeriod === index && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-light-surface/90 dark:bg-dark-surface/90 text-xs px-2 py-1 rounded pointer-events-none">
                  {period.date.split(' - ')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="navigation-controls flex justify-between mt-2">
          <button 
            onClick={goBack}
            disabled={currentPeriod === 0 || isAnimating}
            className={`nav-button px-4 py-2 rounded-md flex items-center ${
              currentPeriod === 0 || isAnimating
                ? 'bg-light-text/20 dark:bg-dark-text/20 cursor-not-allowed'
                : 'bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 shadow-md'
            } transition-colors`}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back in Time
          </button>
          <button 
            onClick={goToPresent}
            className="today-button sm:hidden px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-md hover:opacity-90 transition-opacity shadow-md"
          >
            Present
          </button>
          <button 
            onClick={goForward}
            disabled={currentPeriod === timePeriods.length - 1 || isAnimating}
            className={`nav-button px-4 py-2 rounded-md flex items-center ${
              currentPeriod === timePeriods.length - 1 || isAnimating
                ? 'bg-light-text/20 dark:bg-dark-text/20 cursor-not-allowed'
                : 'bg-light-accent dark:bg-dark-accent text-white hover:opacity-90 shadow-md'
            } transition-colors`}
          >
            Forward in Time
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Add CSS for animations */}
      <style jsx>{`
        .wave-emoji {
          display: inline-block;
          animation: wave 2.5s infinite;
          transform-origin: 70% 70%;
        }
        
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default AboutMeContent; 