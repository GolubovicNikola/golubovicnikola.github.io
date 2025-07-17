---
title: Under the Hood of GoluxAI - A Deep Dive into a Hybrid Tech Stack
description: Today, we're pulling back the curtain and diving deep into the source code of GoluxAI.
author: cotes
date: 2025-06-25 11:33:00 +0800
categories: [Blogging, Demo]
tags: [typography]
pin: false
math: true
mermaid: true

---

# Under the Hood of GoluxAI: A Deep Dive into a Hybrid Tech Stack

In the rapidly evolving world of green tech, applications that provide actionable insights into solar energy are invaluable. One such application, **GoluxAI**, has emerged as a comprehensive platform for homeowners and businesses to explore solar potential, stay informed with curated news, and even query European electricity prices.

But what makes an application like this tick? Today, we're pulling back the curtain and diving deep into the source code of GoluxAI. We'll explore its fascinating hybrid architecture, which masterfully combines the strengths of .NET and Python to deliver a robust and intelligent user experience.
<div class="mermaid">
graph TD;
    subgraph User Interaction
        User[<i class="fa fa-user"></i> User's Browser]
    end

    subgraph GoluxAI Backend Services
        subgraph "Python FastAPI Service (Port 8000)"
            PyAPI["<i class='fa fa-brain'></i> Python FastAPI<br>(app/webapp.py)"]
            Chatbot["<i class='fa fa-robot'></i> LuxAI Chatbot<br>(langchainBOT.py)"]
        end

        subgraph ".NET Core API (Port 9876)"
            NetAPI["<i class='fa fa-server'></i> .NET API Gateway<br>(DayAheadPricesController.cs)"]
            PVWatts["<i class='fa fa-solar-panel'></i> PVWatts Service<br>(PvController.cs)"]
            ENTSOE_Service["<i class='fa fa-bolt'></i> ENTSO-E Service<br>(DayAheadService.cs)"]
        end
    end

    subgraph Databases
        PricesDB[<i class="fa fa-database"></i> Europe Prices DB<br>]
    end

    subgraph External APIs
        ENTSOE[<i class="fa fa-plug"></i> ENTSO-E API]
        PVWattsAPI[<i class="fa fa-sun"></i> NREL PVWatts API]
    end

    %% Data Flows

    User -- "1\. Asks Chatbot / Queries Prices" --> PyAPI
    PyAPI -- "2\. Uses Chatbot" --> Chatbot
    Chatbot -- "3\. Queries Price Data" --> PricesDB

    User -- "4\. Calculates PV Potential" --> NetAPI
    NetAPI -- "5\. Calls PVWatts Service" --> PVWatts
    PVWatts -- "6\. Queries NREL" --> PVWattsAPI

    %% Data Ingestion Flows
    CronJob["<i class='fa fa-clock'></i> Cron Job<br>(crons.txt)"] -- "Triggers Data Ingestion" --> PyAPI
    PyAPI -- "Requests Raw Price Data" --> NetAPI
    NetAPI -- "Fetches from ENTSO-E" --> ENTSOE_Service
    ENTSOE_Service -- "Fetches from ENTSO-E" --> ENTSOE
    NetAPI -- "Returns Prepared Data" --> PyAPI
    PyAPI -- "Stores Prices" --> PricesDB
</div>

<div class="mermaid">
graph TD;
    subgraph Chatbot Logic
        A[User sends message] --> B{Input received by<br>LangChain SQL Agent};
        B --> C{Analyze User Intent};
        C -- "Is it about electricity prices?" --> D{"<i class='fa fa-calendar-alt'></i> Contains a date?<br>(e.g., 'yesterday', '2024-02-21')"};
        D -- Yes --> E[Use ConvertSQLDateTool<br>to format date];
        E --> F[Construct SQL Query];
        D -- No --> F;
        F --> G["<i class='fa fa-database'></i> Execute Query on<br>europe_prices.db"];
        G --> H["<i class='fa fa-robot'></i> Format SQL Result<br>into Natural Language"];
        C -- "Is it a question about GoluxAI?" --> I["<i class='fa fa-search'></i> Use RAG Tool to<br>Search Help Page<br>(FAISS Vector Store)"];
        I --> H;
        C -- "Is it a greeting or general chat?" --> J["<i class='fa fa-robot'></i> Generate Conversational<br>Response with LLM"];
        J --> K;
        C -- "Topic not recognized" --> L[Politely decline to answer];
        L --> K;
        H --> K[<i class='fa fa-paper-plane'></i> Send Final Response to User];
    end
</div>

## The 30,000-Foot View: A Tale of Two Stacks

At its core, GoluxAI operates on a two-part system, containerized with Docker for seamless deployment and communication:

1.  **The .NET Core API (The "Nigo" Service):** This backend acts as the primary data aggregator and gateway. Written in C#, its main job is to communicate with complex, external enterprise-level APIs to fetch raw data. It runs on port `9876`, as seen in its `Dockerfile`.
2.  **The Python FastAPI Backend (The "goluxai-fastapi" Service):** This is the application's brain. It handles data processing, storage, and the AI-powered features that make GoluxAI unique. It exposes the primary API for the front end on port `8000`.

This separation of concerns is a deliberate and intelligent design choice. The .NET service handles the heavy lifting of external data acquisition, while the Python service focuses on what it does best: data science and artificial intelligence.

## The .NET Powerhouse: Data Acquisition and Gateway

The C# backend is the unsung hero of the application, responsible for two critical tasks.

### 1. Fetching Europe-Wide Electricity Prices

The most complex task handled by the .NET service is fetching day-ahead electricity prices from the **ENTSO-E transparency platform**, the official source for European electricity market data.

As defined in `Services/DayAheadService.cs`, the application builds and sends requests to the ENTSO-E API. This is no simple feat, as it involves:
* Handling unique "domain" codes for dozens of countries and regions, all meticulously listed in `Utility/Constants.cs`.
* Parsing complex XML responses, a task where C#'s strong typing and robust libraries excel.
* Aggregating data from multiple regions within a single country (like Italy or Denmark) into a coherent whole, as seen in the `ProcessMultipleRegions` method in `Controllers/DayAheadPricesController.cs`.

### 2. Calculating Solar Panel Potential

A key feature for any user considering solar is calculating potential energy generation. The `Controllers/PvController.cs` file reveals an integration with the **NREL PVWatts API**. This allows GoluxAI to take user inputs like geographic location, system capacity, and panel tilt, and provide a data-backed estimate of monthly and annual electricity production.

This service effectively offloads the complex photovoltaic calculations to a trusted, specialized external API.

## The Python Brain: AI, News, and a Smart Chatbot

If the .NET service is the muscle, the Python service is the mind. Built with the high-performance **FastAPI** framework, this backend is where the data becomes intelligent.

### AI-Curated Solar News Feed

Staying informed is crucial. GoluxAI provides a news feed, but instead of just a raw dump of articles, it uses AI to deliver what matters most. Here’s the pipeline, primarily defined in `external_content.py` and `process_article.py`:

1.  **Fetch:** The system pulls articles from multiple RSS feeds from sources like *PV Magazine* and *Solar Power World*.
2.  **Filter:** This is where the magic happens. A prompt (`FILTERING_PROMT`) is sent to an OpenAI model (`gpt-4o-mini`) via the LangChain library, asking it to select the most insightful and relevant articles for a homeowner or business owner.
3.  **Enhance:** For each selected article, the system:
    * Generates a concise summary.
    * Fetches a relevant, high-quality cover image from Unsplash.
4.  **Store & Serve:** The processed articles, complete with summaries, images, and metadata, are stored in a local **SQLite** database (`solar_articles.db`). The `news_api.py` then exposes this curated content through a REST API, which is consumed by a simple vanilla JavaScript front end (`news-feed.js`).

### LuxAI: The LangChain-Powered Chatbot

Perhaps the most impressive feature is the "LuxAI" chatbot. Defined in `app/llm/langchainBOT.py`, this is not just a simple Q&A bot. It's a sophisticated agent built with LangChain that can:

* **Query Data with Natural Language:** The bot is configured as a `create_sql_agent`. This means a user can ask, *"What was the price of electricity in Serbia yesterday?"*, and the agent can translate that question into a SQL query, execute it against the `europe_prices.db`, and return a human-readable answer.

* **Understand Dates Intelligently:** A custom tool, `ConvertSQLDateTool`, allows the agent to understand relative dates like "today," "last week," or "tomorrow" and convert them into the precise datetime format required for a SQL query.

* **Answer Questions About Itself:** Using a Retrieval-Augmented Generation (RAG) approach, the bot can answer questions about GoluxAI's features. The `get_retrieval_tool` function in `app/llm/custom_tools.py` loads the content of the website's help page into a FAISS vector store, allowing the agent to find and present relevant information from its own documentation.

## A Symphony of Services

The beauty of this architecture lies in how the two services collaborate. The `app/repository/api_logic.py` file in the Python project shows that when it needs to populate its database with historical prices, it calls the `/api/DayAheadPrices/getExternalDataForDateRange` endpoint on the .NET service.

This creates a clear workflow:
1.  The .NET service acts as the vanguard, fetching raw, complex data from the outside world.
2.  The Python service consumes this data, stores it, and builds powerful AI and data science features on top of it.
3.  Containerization via Docker ensures that these two distinct technology stacks can be developed, tested, and deployed as a single, cohesive application.

By leveraging the right tool for the right job, GoluxAI's architecture is a perfect example of modern software design—a powerful, scalable, and intelligent system ready to empower the future of solar energy.