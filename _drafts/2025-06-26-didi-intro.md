---
title: Didi - More Than a Dictionary. A Flutter Case Study in API Integration & Offline-First Design.
description: Today, we're pulling back the curtain and diving deep into the source code of Didi.
author: cotes
date: 2025-06-25 11:33:00 +0800
categories: [Blogging, Demo]
tags: [typography]
pin: true
math: true
mermaid: true
---

# Didi: More Than a Dictionary. A Flutter Case Study in API Integration & Offline-First Design.

*A look under the hood of a modern dictionary app, from handling complex JSON to a clever offline database strategy.*

*(Imagine a sleek, minimalist header image here, perhaps showing the Didi app's logo or a stylized image of a phone displaying a word definition)*

In a world saturated with apps, the humble dictionary is often overlooked. We need them, but we rarely think about what makes a good one. Is it just about having the words? Or is it about a clean interface, useful features like audio pronunciations, and—most importantly—the ability to work when you’re on a plane or in a subway tunnel with no signal?

Today, we're diving into **Didi**, a cross-platform dictionary application for English and German words, written in Flutter. While its clean UI is the first thing you see, its true strength lies in the thoughtful engineering that powers it. We'll look at how it masterfully handles data from external APIs and uses a local database to create a robust, offline-capable experience.

## The App's Lifeline: From API to Dart Objects

At its core, Didi is powered by the free [DictionaryAPI](https://dictionaryapi.dev/) for its English words. Like many public APIs, it returns a wealth of information, but it’s nested within a complex JSON structure. Handling this elegantly is the first challenge Didi solves.

The entire data lifecycle can be visualized like this:

<div class="mermaid">
graph TD;
    A[User searches a word] --> B{SearchBox Widget};
    B --> C[HTTP GET Request<br>using 'http' package];
    C --> D{dictionaryapi.dev};
    D --> E[Nested JSON Response];
    E --> F["DataConversion.dart<br><b>The 'Magic' Parser</b>"];
    F --> G["Clean Dart Objects<br>(WordEN, Meaning, Definition)"];
    G --> H{WordDetailsScreen<br>using FutureBuilder};
    H --> I[<i class="fa fa-mobile-screen"></i> User sees definition];
</div>

The most interesting part of this flow is step `F`. Anyone who has worked with external APIs knows that the data is rarely in the perfect format. In `lib/repository/DataConversion.dart`, the `wordENfromMap` function is the unsung hero. It takes the raw JSON map and meticulously pulls out every piece of data—the word, phonetics, audio URLs, and a list of meanings. It then dives deeper into each meaning to extract parts of speech, definitions, examples, synonyms, and antonyms, carefully constructing a clean, type-safe `WordEN` object.

This function is a perfect example of defensive programming; it checks for the existence of different phonetic and audio files and handles cases where they might be missing, preventing the app from crashing and ensuring a smooth user experience.

```dart
// A simplified look at the data parsing logic in DataConversion.dart

WordEN wordENfromMap(Map<String, dynamic> jsonData) {
    var word = jsonData['word'];
    var phonetic = "";
    var audioUrl = "";

    // Gracefully find the best available phonetic text and audio URL
    if (jsonData['phonetics'] != null) {
        phonetic = getPhoneticandAudio(jsonData)[0];
        audioUrl = getPhoneticandAudio(jsonData)[1];
    }

    // Loop through meanings to build structured objects
    var meanings = List.from(jsonData['meanings'], growable: false);
    List<Meaning> _meanings = List.empty(growable: true);

    for (int i = 0; i < meanings.length; i++) {
        // ... parsing logic for definitions, synonyms, etc.
    }
    
    // Return a clean, structured object for the UI
    WordEN wordEN = WordEN(word, phonetic, audioUrl, _meanings, false);
    return wordEN;
}
```

Once the data is fetched and parsed, the `word_details/components/body.dart` file uses a `FutureBuilder` widget. This is a classic Flutter pattern for handling asynchronous operations. It gracefully shows the user a loading spinner while the API call is in progress and then seamlessly builds the UI once the `WordEN` object is ready.

## Feature Spotlight: An Offline-First Approach with `sqflite`

This is where Didi truly shines from a technical standpoint. What happens when a user wants to save a word to review later, even without an internet connection? The app uses the `sqflite` package, a Flutter plugin for SQLite, to implement a local database.

But it’s not just a simple key-value store. The code in `lib/repository/DBProvider.dart` reveals a sophisticated relational database design, breaking down the complex `WordEN` object into multiple tables.

<div class="mermaid">
erDiagram
    WORDS_EN ||--o{ MEANINGS_EN : has
    MEANINGS_EN ||--o{ DEFINITIONS_EN : has

    WORDS_EN {
        int id PK
        string word
        string phonetic
        string audio_url
    }
    MEANINGS_EN {
        int id PK
        int fk_word_id FK
        string word_class
        string synonyms
        string antonyms
    }
    DEFINITIONS_EN {
        int id PK
        int fk_meaning_id FK
        string definition
        string example
    }
</div>

This schema is incredibly smart. Instead of dumping a large, messy JSON object into a single row, Didi normalizes the data:

1.  **A `words_en` table** stores the top-level information.
2.  **A `meanings_en` table** stores each part-of-speech (noun, verb, etc.) and its associated synonyms and antonyms, linking back to the word's ID.
3.  **A `definitions_en` table** stores each individual definition and example, linking back to its corresponding meaning.

When a user hits the "Save" button, the `insertWord` method in `DBProvider.dart` is called. It doesn't just run one query; it carefully orchestrates a series of insertions. First, it inserts the main word into `words_en` to get a `wordId`. Then, it loops through the `meanings` list in the `WordEN` object, inserting each one into the `meanings_en` table using the `wordId`. It does the same for the definitions, creating a perfectly structured, relational copy of the API data right on the user's device.

This design makes querying for specific information extremely efficient and is a fantastic example of building robust, offline-first features.

## The Little Touches

Beyond these core features, Didi employs other Flutter best practices:

  * **State Management:** It uses the `provider` package for state management, a lightweight and powerful solution for separating business logic from the UI.
  * **Audio Playback:** It leverages the `audioplayers` package to let users hear the correct pronunciation of a word, a small feature that dramatically improves the user experience.
  * **Custom UI:** The app is built with custom components and a clear design language, seen in files like `home_screen.dart` and the various components within `lib/screens/`.

## Final Thoughts

Didi is more than just a dictionary app; it's a well-architected showcase of modern Flutter development. It demonstrates how to consume a complex API, gracefully parse its data, and store it intelligently for a fast, feature-rich, and offline-capable experience. It’s a great reminder that even for the simplest of ideas, thoughtful engineering can make all the difference. With support for German words on the horizon, the foundation is clearly set for Didi to become an even more powerful tool for language learners.