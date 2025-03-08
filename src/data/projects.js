// Project file structure
export const projectsData = {
  folders: [
    {
      name: "API Discovery Extension",
      files: [
        {
          name: "README.md",
          content: `# API Discovery Extension

## Overview
Led the development of a powerful extension that has significantly contributed to client acquisition for API testing services.

## Features
- Automatic API detection in web applications
- Request/response data capture
- Integration with testing frameworks
- Export capabilities to various formats

## Technologies
- JavaScript
- Chrome Extensions API
- RESTful APIs
- GraphQL
`
        },
        {
          name: "implementation.md",
          content: `# Implementation Details

## Architecture
The extension follows a modular architecture with the following components:
- Background Script: Manages the extension lifecycle and communication
- Content Script: Injects into web pages to capture API calls
- Popup UI: Provides user interface for configuration
- Storage Module: Handles persistent storage of captured requests

## Technical Challenges
- Intercepting API calls from different frameworks
- Handling authentication headers securely
- Optimizing performance for high-traffic applications
`
        }
      ]
    },
    {
      name: "LLM Response Evaluator",
      files: [
        {
          name: "README.md",
          content: `# LLM Response Evaluator

## Overview
An AI-driven evaluator that assesses LLM responses against expected outputs, acting as a QA Tester for AI models.

## Purpose
This tool helps benchmark and evaluate the quality of responses from various language models, providing quantitative metrics on accuracy, relevance, and completeness.

## Key Features
- Comparison against golden datasets
- Semantic similarity scoring
- Context relevance analysis
- Factual accuracy verification
`
        },
        {
          name: "architecture.md",
          content: `# Architecture

## System Design
The evaluator uses a multi-stage pipeline:
1. **Input Processing**: Normalizes both expected and actual responses
2. **Feature Extraction**: Extracts semantic embeddings and key information
3. **Comparison Engine**: Runs multiple evaluation algorithms in parallel
4. **Scoring Module**: Combines algorithm outputs with weighted scoring
5. **Reporting**: Generates detailed reports and visualizations

## ML Components
- Embedding models for semantic comparison
- Named entity recognition for fact checking
- Classification models for category alignment
- Regression models for quality scoring
`
        },
        {
          name: "metrics.md",
          content: `# Evaluation Metrics

## Core Metrics
- **Semantic Similarity**: Cosine similarity between response and reference embeddings
- **Factual Accuracy**: Percentage of facts correctly represented
- **Coherence Score**: Measure of logical flow and consistency
- **Relevance Score**: Appropriateness to the original query
- **Completeness**: Coverage of expected information points

## Benchmark Results
| Model       | Semantic | Factual | Coherence | Relevance | Completeness |
|-------------|----------|---------|-----------|-----------|--------------|
| GPT-4       | 0.92     | 0.94    | 0.89      | 0.95      | 0.91         |
| Claude      | 0.90     | 0.92    | 0.88      | 0.91      | 0.89         |
| PaLM        | 0.87     | 0.85    | 0.82      | 0.88      | 0.84         |
| Llama 2     | 0.85     | 0.83    | 0.81      | 0.86      | 0.82         |
`
        }
      ]
    },
    {
      name: "ETL Testing Framework",
      files: [
        {
          name: "README.md",
          content: `# ETL Testing Framework

## Overview
An end-to-end ETL testing framework built in collaboration with Data Architects to ensure data integrity across transformation pipelines.

## Capabilities
- Source-to-destination data validation
- Transformation rule verification
- Data quality assessment
- Performance monitoring
- Automated regression testing
`
        }
      ]
    }
  ]
}; 