
# Voice Call Bot for Product Deals

This project is a FastAPI-powered application that facilitates an AI-driven cold calling system for product deals. The system allows the AI agent to make calls to customers, discuss product offers, and take actions based on predefined instructions. With a fast latency of under 1 second, the bot performs efficiently by integrating advanced tools and technologies. The system can take input from an API, place calls to customers, and choose a voice from the wide variety offered by the Elevenslab platform.

The entire process is real-time, and WebSockets are used for seamless communication between users and the system.

## Tools & Technologies Used

- **Python 3** – The programming language used for backend development.
- **FastAPI** – Fast and modern web framework for building APIs.
- **SQLModel ORM** – ORM for interacting with the database.
- **OpenAI** – Provides AI models for generating responses.
- **AWS Transcribe** – Used for transcribing voice data to text.
- **Twilio** – Used for making calls and handling the voice interface.
- **Elevenslab** – A platform for text-to-speech conversion with a variety of voices.

## Core Features

1. **JWT Authentication** – Secure user authentication for access control within the system.
2. **Multiple Connections Handling** – The system can handle multiple user connections using WebSockets.
3. **Voice Selection** – Users can choose a voice for the AI agent before placing a call.
4. **Voice Library** – A library of voices is available for users to listen to and select from.
5. **Campaign Call Management** – Users can upload customer contact lists in an Excel file for calling. Calls are made one at a time, ensuring precision and personalization.

## Installation & Setup

To get started with the project, follow these steps:

1. Install the required libraries by running:
   ```bash
   pip install -r requirements.txt
   ```

2. Create an SQLite3 database file in the root directory of the project.

3. Rename the `example.env` file to `.env` and add your secret keys and API configurations.

4. Run the FastAPI server using Uvicorn:
   ```bash
   uvicorn src.main:app
   ```

With that, your voice call bot should be up and running. Enjoy making AI-powered cold calls with real-time responses!
