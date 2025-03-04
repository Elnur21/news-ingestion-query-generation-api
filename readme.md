# News Ingestion and Query Generation API

## Overview

This project is a simple Express server that performs two primary tasks:

1. **Ingests News Articles** from URLs in a CSV file.
2. **Generates Responses** based on user queries using the Hugging Face API.

## Features

- **Ingests News Articles**:

  - Reads URLs from a CSV file.
  - Fetches page title and content using `axios` and `cheerio`.
  - Logs the content to the console.

- **Generates Responses**:
  - Accepts a user query via a POST request at `/agent`.
  - Sends the query to Hugging Face's GPT-2 model to generate a response.
  - Returns the generated response or an error message.

## Prerequisites

Before running the project, make sure you have:

- A Hugging Face API key
- A CSV file containing a list of URLs

# Run app

```
npm install
```

```
node index.js
```
