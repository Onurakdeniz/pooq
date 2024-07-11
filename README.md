

## FLEEK FUNCTIONS for LLM CAST PROCESSING: BOOSTING CONTENT DISCOVERABILITY

### This is ONE EXAMPLE of how we use FLEEK FUNCTIONS for CONTENT DISCOVERABILITY:
## Overview

This project demonstrates an innovative approach to processing and analyzing content from Farcaster using Fleek Functions. The goal is to enhance content discoverability, improve categorization, and enable more sophisticated content analysis.

![Architecture Diagram](https://imgur.com/zXzFnKm.png "Cast Processing with Fleek Functions")


## Architecture

Our system architecture leverages several key components:

1. **Farcaster**: The source of our content (casts).
2. **Fleek Functions**: The core of our processing pipeline.
3. **OpenAI**: For semantic processing and vectorization.
4. **Pinecone**: For efficient vector storage and similarity search.
5. **Backend**: Handles main business logic and database operations.

## Process Flow

1. Casts are created on Farcaster.
2. A Neynar webhook triggers our Fleek Function.
3. The Fleek Function orchestrates the following processes:
   - Semantic processing using OpenAI
   - Vectorization of content using OpenAI
   - Storage of processed data in Pinecone DB
4. Our backend interacts with the Fleek Function for business logic and database operations.

## Key Features

- **Tag Generation**: Automatically create relevant tags for each cast.
- **Categorization**: Classify casts into predefined categories.
- **Entity Extraction**: Identify and extract key entities mentioned in casts.
- **Vectorization**: Convert casts into vector representations for similarity search.
- **Spam Detection**: Utilize processed data to identify potential spam content.
- **LLM-Generated Content Detection**: Analyze patterns to distinguish between human-written and AI-generated content.

## Benefits

1. **Improved Discoverability**: Enhanced tagging and categorization make it easier for users to find relevant content.
2. **Content Insights**: Deep semantic analysis provides valuable insights into content trends and user interests.
3. **Spam Reduction**: Advanced processing helps in identifying and filtering out spam content.
4. **Similar Content Discovery**: Vector representations enable efficient similarity searches, helping users find related casts.

## Contribution

This project was developed as part of the Onchain Summer Buildathon, focusing on the discovery track.
