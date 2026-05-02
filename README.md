# 🚀 AI-Powered Selenium MCP Server

A lightweight MCP (Model Context Protocol) server that enables Large Language Models (LLMs) to interact with real web applications using Selenium.

---

## 🔍 Overview

This project bridges the gap between LLMs and browser automation by exposing Selenium capabilities as structured tools.

Instead of writing traditional automation scripts, LLMs can trigger browser actions through a standardized interface.

---

## 🏗️ Architecture

LLM → MCP Server → Selenium → Browser

---

## ⚙️ Key Features

- Tool-based browser automation (click, type, navigate)
- Multi-browser support (Chrome, Firefox, Edge)
- Structured request/response model for LLMs
- Screenshot and file upload support
- Window and iframe handling

---

## 🧠 Why This Matters

This project demonstrates how automation can evolve from script-based execution to AI-driven systems where LLMs can:

- Understand tasks
- Execute browser actions
- Interact with real-world applications

---

## 🔄 Example Flow

Prompt: "Open Google and search for ChatGPT"

→ LLM converts prompt to structured tool call  
→ MCP server executes via Selenium  
→ Result returned back to LLM  

---

## 🛠️ Tech Stack

- Selenium
- MCP Protocol
- TypeScript

---

## 📌 Getting Started

Clone the repository
Start the MCP server
Connect with your preferred LLM
Execute browser actions via structured prompts

---

## 🤝 Contribution

Open to ideas and improvements around AI-driven automation.
