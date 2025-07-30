---
title: How to Use LLMs to Classify News Articles
description: Today, we're pulling back the curtain and diving deep into the source code of GoluxAI.
author: cotes
date: 2025-06-26 11:33:00 +0800
categories: [Blogging, Demo]
tags: [typography]
pin: false
math: true
mermaid: true

---
## How to Use LLMs to Classify News Articles

*Beyond chatbots: A practical guide to building an intelligent content curation pipeline with Python, LangChain, and a single, powerful prompt.*

We're all drowning in information. The internet is a firehose of content, and for anyone trying to stay informed on a specific topic, cutting through the noise is a full-time job. Whether you're a homeowner researching solar panels or a developer tracking AI trends, the challenge is the same: How do you find the handful of articles that *actually matter*?

For years, the answer involved complex keyword filters, manual curation, or machine learning models that required massive datasets and specialized training. But today, with the power of Large Language Models (LLMs), we can build a remarkably sophisticated classification and curation system in just a few lines of Python.

In this post, we'll break down the engine behind an AI-powered news service, showing you exactly how it uses an LLM to read a stream of articles and intelligently select the most relevant ones. This isn't theory; it's a look at production code.

### The Goal: From Information Overload to Curated Digest

Our objective is to build an automated pipeline that does the following:

1.  **Fetches** articles from multiple online sources (RSS feeds).
2.  **Classifies** them based on relevance and quality for a specific audience.
3.  **Enhances** the selected articles with summaries and images.
4.  **Serves** them through a clean API.

The entire workflow can be visualized like this:

<div class="mermaid">
graph TD;
    A[Start: Cron Job Triggers Update] --> B{Fetch Raw Articles<br>from Multiple RSS Feeds};
    B --> C[Combine into a Single List];
    C --> D{"<i class='fa fa-robot'></i> <b>The Core Logic:</b><br>Filter with LLM & LangChain<br>(filter_articles in external_content.py)"};
    D -- "Returns a list of selected article IDs" --> E{For Each Selected Article};
    E -- Article --> F[Generate Summary<br>with another LLM call];
    F --> G[Fetch Relevant Image<br>from Unsplash API];
    G --> H["<i class='fa fa-database'></i> Store Enriched Article<br>in SQLite Database"];
    H --> I{API Ready<br>/api/news};
    E -- "All Articles Processed" --> I;
</div>

While every step is important, the magic happens in step `D`. This is where the LLM acts as our expert curator.

### The Deep Dive: The "Brain" of the Operation

How do you get an LLM to act as a world-class editor? You give it clear, specific instructions. The effectiveness of this entire system hinges on a single, well-crafted prompt.

This is the exact prompt used in the `goluxai` service, found in `app/llm/prompts.py`:

```python
# app/llm/prompts.py

FILTERING_PROMT = """
    You are an AI assistant helping a European homeowner or business owner who is struggling to make informed decisions about solar energy adoption. Your task is to select the {num_articles} most important and insightful articles about solar energy from the given list.

    Consider the following criteria:
    1. Quality of the content
    2. Relevance to solar energy adoption in Europe
    3. Focus on practical insights for homeowners or business owners
    4. Importance and potential impact on decision-making

    The selected articles should provide significant insights to help the reader make informed decisions about solar energy adoption.

    Here are the articles:
    {articles}

    Please return your selection as a Python list of article IDs or URLs, like this: ["id1", "id2", "id3"] or ["url1", "url2", "url3"]
    Do not include any other text in your response, just the Python list.
"""
```

Let's break down why this prompt is so effective:

1.  **It Establishes a Persona:** The prompt begins with "You are an AI assistant helping a European homeowner..." This gives the LLM a clear role and audience, focusing its analysis.
2.  **It Defines a Clear Task:** The goal is explicit: "select the {num\_articles} most important and insightful articles."
3.  **It Provides Specific Criteria:** This is the most crucial part. Instead of just saying "find the best articles," it gives the LLM four concrete criteria to evaluate against (quality, relevance, practical insights, impact).
4.  **It Enforces a Strict Output Format:** The final instruction to "return your selection as a Python list" and "Do not include any other text" is vital for automation. It ensures the LLM's response can be directly parsed by the Python code without any extra cleaning.

### The Python Code in Action

With the prompt defined, let's look at how the `external_content.py` file uses it. This function is the bridge between our application and the LLM.

```python
# external_content.py

def filter_articles(articles, num_articles):
    # 1. Set up the LangChain prompt template
    prompt = ChatPromptTemplate.from_template(FILTERING_PROMT)

    # 2. Define the chain: Prompt -> LLM -> Output Parser
    chain = prompt | ChatOpenAI() | StrOutputParser() 

    # 3. Format the articles list for the prompt
    articles_str = "\n".join([f"ID: {a['id']}, Title: {a['title']},  Source: {a['source']}, URL: {a['url']}" for a in articles])
    
    # 4. Invoke the chain with the articles and desired number
    result = chain.invoke(
        {"articles": articles_str, "num_articles": num_articles}
    )
    
    # 5. Parse the result from the LLM
    try:
        selected_ids = eval(result.strip())
    except:
        # Fallback for when the LLM adds extra text
        match = re.search(r'\[.*?\]', result, re.DOTALL)
        if match:
            # ... more robust parsing logic
            
    # 6. Filter the original articles list based on the selected IDs
    filtered_articles = [article for article in articles if article['id'] in selected_ids or article['url'] in selected_ids]        
    
    # ... enhancement steps (fetching images, etc.)

    return filtered_articles
```

This code is a beautiful, real-world example of interacting with an LLM programmatically:

  * It uses **LangChain** (`ChatPromptTemplate`, `ChatOpenAI`) to simplify the interaction with the OpenAI API.
  * It formats the list of fetched articles into a simple string (`articles_str`) to be injected into the prompt.
  * It robustly parses the LLM's output. The `try...except` block is a crucial piece of defensive programming, acknowledging that LLMs can sometimes be "chatty" and add extra text around the desired Python list.

### The Final Polish: Adding Value Beyond Classification

Once the best articles are selected, the pipeline doesn't stop. As seen in `process_article.py`, it further enhances the content by:

  * **Summarizing:** Calling the LLM again with a different prompt to generate a concise summary for each article.
  * **Visualizing:** Fetching a relevant cover image from the Unsplash API based on the article's title.

This turns a simple list of links into a rich, engaging, and easy-to-digest news feed.

### You Can Build This, Too

What's most exciting about this approach is its accessibility. You don't need to be a data scientist with a Ph.D. in Natural Language Processing to build powerful classification systems anymore.

By combining the programmatic power of Python, the simplicity of libraries like LangChain, and the reasoning capabilities of modern LLMs, you can create intelligent applications that solve real-world problems. The key is not in the complexity of the code, but in the clarity and precision of the instructions you give to your AI collaborator.
