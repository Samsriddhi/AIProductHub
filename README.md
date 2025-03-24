# AIProductHub


AIProductHub is an intelligent product information extractor powered by agentic AI workflows. It takes raw input (image,  or barcode-based metadata), enriches it using custom and Langflow agents, and serves structured product data through a frontend dashboard.

---



### VIDEO DEMONSTRATIONS-

full- https://drive.google.com/file/d/1TUSmNy947Nsd9c6lIzxUbyXYUVsjVKyX/view?usp=sharing

backend- https://drive.google.com/file/d/1CGqQESsVTc9NQuRtei4eI-9idXKV_M62/view?usp=sharing

---

## 🚀 Steps to Run

0. **Go and Clone the Master Branch**

### 🧱 Backend Setup

1. **Go to the backend directory, Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the backend**
   ```bash
   python main.py
   ```
   > Ensure the FastAPI server is running on `http://localhost:8000`.

---

### 🎨 Frontend Setup

3. Install Node.js dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

5. Visit the URL shown in terminal (usually `http://localhost:3000`) to explore the frontend.

---

## 🧰 Tech Stack

### Frontend
- **Next.js** (React Framework)
- **TailwindCSS** (Styling)

### Backend
- **Supabase(Postgre SQL)**
- **Python + FastAPI** (API and business logic)
- **Langflow Agent (Langchain + Astra)** for:
  - Enrichment via DuckDuckGo/Web Search
  - Intelligent JSON completion
  - Contextual filling of product metadata
- **Tesseract OCR + Barcode Parsing** (optional image input pre-processing)
- **Prompt Cleanup Engine** to sanitize outputs from Langflow into structured JSON

---

## 🔁 Backend Agentic AI Workflow(mian.py)

1. **Input(script.py,agent1.py)**: Accepts either:
   - OCR’d image
   - Barcode number
   - Free-form user prompt

2. **Langflow Agent Call(agent2.py)**:
   - Sends prompt to Langflow hosted on Astra
   - Agent performs RAG (Retrieval-Augmented Generation) + enrichment via web search
   - Output is returned in markdown with embedded JSON

3. **Sanitizer + Parser**:
   - Cleans malformed JSON (fixes comments, commas, formatting)
   - Extracts structured product info

4. **Response**:
   - JSON is written to `info.txt`
   - Or piped to downstream apps via API

---


## Backend Workflow:

            +-------------------------+
            |      User Input         |
            | (Image / Barcode / Text)|
            +-----------+-------------+
                        |
                        v
       +----------------------------------------+
       |         Pre-processing Layer           |
       |----------------------------------------|
       | OCR (Tesseract) + Barcode Reader (pyzbar)|
       +----------------------+-----------------+
                              |
                              v
       +----------------------------------------+
       |              Agent 1                  |
       |----------------------------------------|
       | - Reads extracted text from info.txt   |
       | - Sends to Langflow via Astra API      |
       | - Langflow does enrichment (DuckDuckGo)|
       +----------------------+-----------------+
                              |
                     JSON (possibly malformed)
                              |
                              v
       +----------------------------------------+
       |           Agent 2 (JSON Cleaner)       |
       |----------------------------------------|
       | - Extracts embedded JSON from markdown |
       | - Removes // comments                  |
       | - Fixes broken fields (e.g., URLs)     |
       | - Normalizes types & missing commas    |
       +----------------------+-----------------+
                              |
                              v
              +----------------------------+
              |   Clean JSON saved to      |
              |       info.txt             |
              +------------+---------------+
                           |
                           v
         +-----------------------------------------+
         |   Frontend (Next.js + TailwindCSS)      |
         |   - Reads from backend API              |
         |   - Displays product metadata dashboard |
         +-----------------------------------------+


---

## 🌱 What’s Next

### 🔮 Planned Enhancements(What time constraints did not let me do)

- **RAG++ Integration**: Smarter, high-quality retrieval from internal product databases before query is sent to Langflow.
- **Prompt Caching**: Store previously processed prompts and their Langflow responses to:
  - Save tokens (💸)
  - Accelerate inference
- **Schema Validation & Auto-fill**: Ensure outputs always conform to a strict product schema
- **Product Database Sync**: Directly save enriched data to a NoSQL DB (e.g., MongoDB or Astra DB)

---

## 🧠 Example Use Cases

- Auto-filling product specs from barcode scans
- Structuring user-uploaded catalog data
- Smart product detail enrichment via agents

---


> Built with 💡 by Samriddhi



