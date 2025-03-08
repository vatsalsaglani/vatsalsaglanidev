"use client";

import { useState, useEffect, useRef } from "react";
import { jsPDF } from "jspdf";
import 'katex/dist/katex.min.css';
import katex from 'katex';

const LaTeXResumeContent = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const resumeRef = useRef(null);
  
  // Your LaTeX resume code - using String.raw to avoid escape sequence issues
  const latexResumeCode = String.raw`
    \documentclass[11pt,a4paper]{article}

% Packages
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage{titlesec}
\usepackage{fancyhdr}

% Page settings
\pagestyle{fancy}
\fancyhf{}
\cfoot{\thepage}

% Custom commands
\newcommand{\sectionline}{
  \noindent\makebox[\linewidth]{\rule{\paperwidth}{0.4pt}}
}

% Title format
\titleformat{\section}
  {\normalfont\Large\bfseries}{\thesection}{1em}{}

% Document
\begin{document}

% Header
\begin{center}
    {\Huge\bfseries Vatsal Saglani}\\[0.5em]
    \textit{Software Developer, AI Engineer, Data Scientist}\\[0.5em]
    Email: \href{mailto:saglanivatsal@gmail.com}{saglanivatsal@gmail.com} $\cdot$
    Website: \href{https://vatsalsaglani.vercel.app}{vatsalsaglani.vercel.app} $\cdot$
    LinkedIn: \href{https://linkedin.com/in/vatsalsaglani}{vatsalsaglani} $\cdot$ \\
    Github: \href{https://github.com/vatsalsaglani/}{vatsalsaglani} $\cdot$ 
    Medium: \href{https://thevatsalsaglani.medium.com/}{thevatsalsaglani} $\cdot$ 
    Google Scholar: \href{https://scholar.google.com/citations?user=3RB_jh0AAAAJ&hl=en}{Vatsal Saglani} $\cdot$
    Phone: +91-9790960353
\end{center}
\sectionline

% Education
\section*{Education}
\subsection*{Vellore Institute of Technology}
\textbf{B.Tech}, Computer Science and Engineering \hfill June 2015 - May 2019\\
\begin{itemize}
    \item Cumulative GPA: 8.48/10.
    \item Awarded VIT Best Project in 2019 for an outstanding capstone project.
\end{itemize}


% Experience
\section*{Experience}
\subsection*{Data Science Lead - GenAI}
\textbf{Qyrus} \hfill July 2024 - Present\\
\begin{itemize}
    \item Leading a team for building agentic workflows for real autonomous testing for Web, Mobile, and Desktop applications and APIs.
    \item Developing SageMaker pipelines for enterprise-wide processing and training jobs.
    \item Built Python packages for DRY and efficient LLM usage over multiple providers like OpenAI, Azure OpenAI, Bedrock, Groq, and others and custom LLM inference on SageMaker.
    \item Working on building multi-agent systems for mimicking human interactions across various platforms.
    \item Working on nuance prompt engineering techniques for multi-agent workflows.
\end{itemize}
\subsection*{Senior Data Science Engineer}
\textbf{Qyrus} \hfill November 2021 - July 2024\\
\begin{itemize}
    \item Developed transformer models from scratch for text classification and named entity recognition (NER), improving data handling.
    \item Designed and trained a recommendation system using a decoder-only transformer model, suggesting next steps for building autonomous tests.
    \item Engineered a multi-modal architecture that combines Transformers and CNNs for generating captions and text from images.
    \item Built and trained language models for answering questions and extracting information, using the PyTorch and Transformers library.
    \item Fine-tuned object detection models such as DETR, Detectron2, and YOLO, improving element detection in software testing.
    \item Optimized model performance on minimal hardware using effective quantization techniques, reducing inference times without losing quality.
    \item Fine-tuned a range of large language models (LLMs) for customized tasks in vision and text, including models like Mistral and Llama.
    \item Led the development of a Generative AI-powered Software Testing Kit (STK) and published it as a Python package for traditional testing teams to leverage AI in testing.
    \item Initiated the development of an autonomous chatbot testing service using a distributed AI framework with Kafka, DynamoDB, and Redis.
    \item Led a 4-member team for developing a desktop application testing and data comparison service, employing AWS technologies like SQS and Lambda.
    \item Developed copilot bots for comprehensive testing of software across Web, Mobile, API, and Desktop platforms.
    \item Designed a cloud-based API Testing Agent using LLMs, introducing robust fallback strategies and setting new standards in the industry.
    \item Orchestrated the efficient chaining of multiple AI models, boosting the capabilities of a test automation assistant.
    \item Designed and implemented a distributed data processing pipeline with AWS SQS, AWS Lambda, SQL databases, and SageMaker.
    \item Wrote shell scripts to automate deployments on Amazon EC2 and managed container deployments on AWS ECS and SageMaker using Docker and AWS ECR.
    \item Created a self-serve Retrieval-Augmented Generation (RAG) system that learns dynamically from custom data, featuring tools integration (BYOA).
    \item Developed initial software versions (MVPs) with FastAPI, NextJS, SvelteKit, and Node.js for client demos and strategic meetings.
    \item Mentored new team members, accelerating their learning and integration into the team.
    \item Led presentations and discussions with stakeholders and clients, demonstrating AI capabilities and project impacts.
\end{itemize}


\subsection*{Machine Learning Consultant}
\textbf{Quinnox} \hfill January 2020 - November 2021\\
\begin{itemize}
    \item Pioneered the implementation of data pre-processing pipelines using Pandas, enhancing data quality and readiness for analysis.
    \item Developed and trained a suite of text classification models leveraging Numpy, Scikit-learn, FastText, and Gensim to automate content categorization.
    \item Led the extraction and recognition of named entities by training transformer models, increasing accuracy in data interpretation.
    \item Engineered a text augmentation process to introduce errors into data, simulating real-world inaccuracies for improved model robustness.
    \item Created a conversational bot that streamlined the automation testing process, contributing to more efficient quality assurance practices.
    \item Architected a unified backend system capable of managing asynchronous predictions from diverse machine learning models using FastAPI, Flask, and aiohttp.
\end{itemize}

\subsection*{Data Science Intern}
\textbf{KrishiHub} \hfill September 2019 - January 2020\\
\begin{itemize}
    \item Engineered OpenCV algorithms to accurately identify diseased crop regions, contributing to the advancement of agricultural technology.
    \item Implemented meta-learning techniques to construct a sophisticated model for crop disease classification, enhancing predictive accuracy.
    \item Seamlessly integrated the OpenCV-based disease detection algorithm with the classifier system, culminating in a production-level deployment.
\end{itemize}

\subsection*{Machine Learning Intern}
\textbf{IIIT Allahabad} \hfill May 2019 - July 2019\\
\begin{itemize}
    \item Conducted comprehensive data analysis on network traffic through various switches to optimize cluster efficiency, resulting in significant cost reduction and energy savings.
\end{itemize}

% Projects
\section*{Projects}
\subsubsection*{\href{https://github.com/vatsalsaglani/GraphRAG4Rec}{GraphRAG4Rec}}
\begin{itemize}
    \item A Graph-based RAG bot to deliver content-based movie recommendations. A naive implementation of Microsoft's GraphRAG.
\end{itemize}
\subsubsection*{\href{https://github.com/vatsalsaglani/claudetools}{Claudetools}}
\begin{itemize}
    \item Developed a Python package for doing function calling using the Claude 3 family of models. Can be used as a drop-in replacement for OpenAI function calling or tools.
\end{itemize}
\subsubsection*{\href{https://github.com/vatsalsaglani/FuncReAct}{FuncReAct}}
\begin{itemize}
    \item Constructed a flexible RAG (Retrieval-Augmented Generation) framework leveraging OpenAI's API and Pinecone's vector database to enable dynamic action integration within applications.
\end{itemize}
\subsubsection*{\href{https://github.com/vatsalsaglani/rumage-ai-search}{LLM-powered Search}}
\begin{itemize}
    \item A LLM-powered search engine developed using Playwright and both open and closed-source LLMs demonstrating efficient and effective LLM chaining.
\end{itemize}
\subsubsection*{\href{https://github.com/vatsalsaglani/bert4rec}{Bert4Rec}}
\begin{itemize}
    \item Developed a recommendation system using a decoder-only self-attention transformer model to predict movie preferences, utilizing PyTorch and Optuna for training and optimization.
\end{itemize}
\subsubsection*{\href{https://github.com/vatsalsaglani/cocoImageCaptioningTransformer}{Image Captioning Transformer}}
\begin{itemize}
    \item Implemented a state-of-the-art image captioning algorithm by adapting DE:TR principles, employing a ResNet50 model for feature extraction and transformer architecture for text encoding and prediction.
\end{itemize}

% Skills
\section*{Skills}
Python,
PyTorch, JAX, Large Language Models (LLMs),
LLMs and Agents,
Computer Vision,
NLP,
Recommendation Systems,
Training and Fine-tuning LLMs,
NumPy,
FastAPI,
Flask,
SQL and NoSQL DBs,
AWS (EC2, Lambda, Sagemaker, Bedrock, ECS, EKS),
Azure AI,
Javascript,
SvelteKit,
ReactJS,
NextJS


% Publications
\section*{Publications}
\subsubsection*{Malware Classification using Machine Learning Algorithms}
\begin{itemize}
    \item Presented at the 2nd International Conference on Trends in Electronics and Informatics (ICOEI).
    \begin{itemize}
        \item Citations: 22
    \end{itemize}
\end{itemize}

\subsubsection*{Big Data Technology in Healthcare: A Survey}
\begin{itemize}
    \item Delivered at the 10th IFIP International Conference on New Technologies, Mobility, and Security (NTMS).
    \begin{itemize}
        \item Citations: 4
    \end{itemize}
\end{itemize}

\subsubsection*{Classifying and Predicting DoS and DDoS Attacks on Cloud Services}
\begin{itemize}
    \item Discussed at the 2nd International Conference on Trends in Electronics and Informatics (ICOEI).
    \begin{itemize}
        \item Citations: 4
    \end{itemize}
\end{itemize}

\subsubsection*{IoT based Smart Safe System}
\begin{itemize}
    \item Introduced at the International Conference on Computational Techniques, Electronics and Mechanical Systems (CTEMS).
    \begin{itemize}
        \item Citations: 2
    \end{itemize}
\end{itemize}

\end{document}
  `;

  // Function to render LaTeX to HTML
  const renderLatex = (latexCode) => {
    // Remove any LaTeX comments before processing
    latexCode = latexCode.replace(/%\s*([^\n]+)/g, '');
    
    // Split the LaTeX code into sections for better rendering
    const sections = latexCode.split('\\section*{');
    
    // Process the header (everything before the first section)
    const header = sections[0];
    
    // Extract the name and title from the header
    const nameMatch = header.match(/\\Huge\\bfseries\s+([^}\\]+)/);
    const name = nameMatch ? nameMatch[1] : 'Vatsal Saglani';
    
    const titleMatch = header.match(/\\textit{([^}]+)}/);
    const title = titleMatch ? titleMatch[1] : 'Software Developer, AI Engineer, Data Scientist';
    
    // Extract contact information
    const emailMatch = header.match(/mailto:([^}]+)}/);
    const email = emailMatch ? emailMatch[1] : 'saglanivatsal@gmail.com';
    
    const websiteMatch = header.match(/Website: \\href{([^}]+)}{([^}]+)}/);
    const website = websiteMatch ? websiteMatch[2] : 'vatsalsaglani.vercel.app';
    const websiteUrl = websiteMatch ? websiteMatch[1] : 'https://vatsalsaglani.vercel.app';
    
    const linkedinMatch = header.match(/LinkedIn: \\href{([^}]+)}{([^}]+)}/);
    const linkedin = linkedinMatch ? linkedinMatch[2] : 'vatsalsaglani';
    const linkedinUrl = linkedinMatch ? linkedinMatch[1] : 'https://linkedin.com/in/vatsalsaglani';
    
    const githubMatch = header.match(/Github: \\href{([^}]+)}{([^}]+)}/);
    const github = githubMatch ? githubMatch[2] : 'vatsalsaglani';
    const githubUrl = githubMatch ? githubMatch[1] : 'https://github.com/vatsalsaglani/';
    
    // Process each section
    const processedSections = sections.slice(1).map(section => {
      const sectionTitleMatch = section.match(/^([^}]+)}/);
      const sectionTitle = sectionTitleMatch ? sectionTitleMatch[1] : '';
      const sectionContent = section.replace(/^[^}]+}/, '');
      
      return {
        title: sectionTitle,
        content: sectionContent
      };
    });
    
    return (
      <div className="latex-resume p-8 bg-white dark:bg-dark-surface text-light-text dark:text-dark-text max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-light-text dark:text-dark-text">{name}</h1>
          <p className="text-lg mt-2 text-light-text/80 dark:text-dark-text/80">{title}</p>
          <div className="flex flex-wrap justify-center gap-3 mt-3 text-sm">
            <a href={`mailto:${email}`} className="flex items-center gap-1 text-light-accent dark:text-dark-accent hover:underline">
              <span>📧</span> {email}
            </a>
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-light-accent dark:text-dark-accent hover:underline">
              <span>🌐</span> {website}
            </a>
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-light-accent dark:text-dark-accent hover:underline">
              <span>💼</span> LinkedIn
            </a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-light-accent dark:text-dark-accent hover:underline">
              <span>💻</span> GitHub
            </a>
          </div>
        </div>
        
        {/* Sections */}
        {processedSections.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="text-2xl font-bold border-b border-light-text/20 dark:border-dark-text/20 pb-1 mb-4 text-light-text dark:text-dark-text">{section.title}</h2>
            <div className="pl-2" dangerouslySetInnerHTML={{ __html: processLatexContent(section.content) }} />
          </div>
        ))}
      </div>
    );
  };
  
  // Helper function to process LaTeX content - additional cleanup
  const processLatexContent = (content) => {
    // First, let's remove LaTeX comments (lines starting with %)
    content = content.replace(/%\s*([^\n]+)/g, '');
    
    // Process subsections
    content = content.replace(/\\subsection\*{([^}]+)}/g, 
      (match, title) => {
        return `<h3 class="text-xl font-bold mt-4 mb-2">${title}</h3>`;
      }
    );
    
    // Process subsubsections with hyperlinks
    content = content.replace(/\\subsubsection\*{\\href{([^}]+)}{([^}]+)}}/g, 
      (match, url, title) => {
        return `<h4 class="text-lg font-semibold mt-3 mb-1"><a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">${title}</a></h4>`;
      }
    );
    
    // Process regular subsubsections
    content = content.replace(/\\subsubsection\*{([^}]+)}/g, 
      (match, title) => {
        return `<h4 class="text-lg font-semibold mt-3 mb-1">${title}</h4>`;
      }
    );
    
    // Process job entries with company and date
    content = content.replace(/\\textbf{([^}]+)}\s*\\hfill\s*([^\\\n]+)\\\\([^\\]+)\\\\/g, 
      (match, position, years, company) => {
        return `
          <div class="mb-2">
            <div class="flex justify-between">
              <strong class="text-md">${position}</strong>
              <span class="text-gray-600 dark:text-gray-400">${years}</span>
            </div>
            <div class="text-gray-700 dark:text-gray-300">${company.trim()}</div>
          </div>
        `;
      }
    );
    
    // Remove LaTeX document structure commands
    content = content.replace(/\\begin{document}|\\end{document}/g, '');
    content = content.replace(/\\begin{itemize}/g, '');
    content = content.replace(/\\end{itemize}/g, '');
    
    // Process itemize environments with improved regex that's more tolerant
    content = content.replace(/\\item\s+([^\\]+)(?=\\item|\\end{itemize}|$)/g, 
      (match, itemContent) => {
        return `<li class="text-sm">${itemContent.trim()}</li>`;
      }
    );
    
    // Clean up any remaining \item tags
    content = content.replace(/\\item\s*/g, '<li class="text-sm">');
    
    // Wrap loose li elements in ul tags
    if (content.includes('<li') && !content.includes('<ul')) {
      content = '<ul class="list-disc pl-5 space-y-1 my-2">' + content + '</ul>';
    }
    
    // Process nested itemize environments
    content = content.replace(/<li class="text-sm">([^<]*)<ul/g, 
      (match, text) => {
        return `<li class="text-sm font-medium">${text}<ul`;
      }
    );
    
    // Process hyperlinks
    content = content.replace(/\\href{([^}]+)}{([^}]+)}/g, 
      (match, url, text) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">${text}</a>`;
      }
    );
    
    // Process textbf
    content = content.replace(/\\textbf{([^}]+)}/g, '<strong>$1</strong>');
    
    // Process textit
    content = content.replace(/\\textit{([^}]+)}/g, '<em>$1</em>');
    
    // Process line breaks
    content = content.replace(/\\\\/g, '<br>');
    
    // Process \hfill commands that might be visible
    content = content.replace(/\\hfill/g, '<span class="flex-grow"></span>');
    
    // Process bullet points in skills section
    content = content.replace(/,\s+/g, ' • ');
    
    // Remove \begin{...} and \end{...} tags that might still be visible
    content = content.replace(/\\begin{[^}]+}/g, '');
    content = content.replace(/\\end{[^}]+}/g, '');
    
    // Clean up any LaTeX commands that might still be visible
    content = content.replace(/\\[a-zA-Z]+/g, '');
    
    // Clean up curly braces that might be showing (like {document})
    content = content.replace(/{[a-zA-Z]+}/g, '');
    
    // Fix any double spaces
    content = content.replace(/\s{2,}/g, ' ');
    
    // Add final styling to the processed HTML before returning
    let processedContent = content;
    
    // Style headings with accent colors
    processedContent = processedContent.replace(/<h3 class="([^"]+)">/g, 
      '<h3 class="$1 text-light-accent dark:text-dark-accent">');
    
    processedContent = processedContent.replace(/<h4 class="([^"]+)">/g, 
      '<h4 class="$1 text-light-secondary dark:text-dark-secondary">');
    
    // Style links with accent color
    processedContent = processedContent.replace(/<a ([^>]+)class="([^"]+)">/g, 
      '<a $1class="$2 text-light-accent dark:text-dark-accent hover:opacity-80 transition-opacity">');
    
    // Style strong elements
    processedContent = processedContent.replace(/<strong>/g, 
      '<strong class="text-light-text dark:text-dark-text">');
    
    // Enhance list items
    processedContent = processedContent.replace(/<li class="text-sm">/g, 
      '<li class="text-sm mb-1.5 text-light-text/90 dark:text-dark-text/90">');
    
    return processedContent;
  };

  // Function to generate PDF from LaTeX
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Use html2canvas to capture the rendered resume
      if (resumeRef.current) {
        // Import html2canvas properly
        const html2canvas = (await import('html2canvas')).default;
        
        // Store original styles
        const originalHeight = resumeRef.current.style.height;
        const originalOverflow = resumeRef.current.style.overflow;
        const originalPosition = resumeRef.current.style.position;
        const scrollContainer = resumeRef.current.closest('.overflow-auto');
        const originalScrollContainerOverflow = scrollContainer ? scrollContainer.style.overflow : null;
        
        // Modify the element to ensure all content is rendered
        if (scrollContainer) {
          scrollContainer.style.overflow = 'visible';
        }
        resumeRef.current.style.height = 'auto';
        resumeRef.current.style.overflow = 'visible';
        resumeRef.current.style.position = 'absolute'; // Take out of normal flow
        
        // Wait a moment for the DOM to update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Capture the entire content
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowHeight: resumeRef.current.scrollHeight,
          windowWidth: resumeRef.current.scrollWidth,
          height: resumeRef.current.scrollHeight,
          width: resumeRef.current.scrollWidth,
          x: 0,
          y: 0
        });
        
        // Restore original styles
        resumeRef.current.style.height = originalHeight;
        resumeRef.current.style.overflow = originalOverflow;
        resumeRef.current.style.position = originalPosition;
        if (scrollContainer && originalScrollContainerOverflow) {
          scrollContainer.style.overflow = originalScrollContainerOverflow;
        }
        
        // Convert to image and add to PDF
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Calculate dimensions to fit on A4 paper
        const imgWidth = 210; // A4 width in mm (minus margins)
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        // Add the image to the PDF
        let heightLeft = imgHeight;
        let position = 0;
        let pageHeight = 297; // A4 height in mm
        
        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add additional pages if needed for very long resumes
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight; // top of next page
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        // Save the PDF
        pdf.save('Vatsal_Saglani_Resume.pdf');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Function to download raw LaTeX
  const downloadRawLatex = () => {
    const element = document.createElement('a');
    const file = new Blob([latexResumeCode], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'resume.tex';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface shadow-sm">
        <h2 className="text-xl font-semibold text-light-text dark:text-dark-text">Resume</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="px-3 py-1 bg-light-accent dark:bg-dark-accent text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={downloadRawLatex}
            className="px-3 py-1 bg-light-secondary dark:bg-dark-secondary text-white rounded hover:opacity-90 transition-opacity"
          >
            Download LaTeX
          </button>
        </div>
      </div>

      {/* Content Container with Scrolling */}
      <div className="flex-1 overflow-auto p-4 bg-light-background dark:bg-dark-background">
        <div ref={resumeRef} className="rounded shadow-lg">
          {renderLatex(latexResumeCode)}
        </div>
      </div>
    </div>
  );
};

export default LaTeXResumeContent; 