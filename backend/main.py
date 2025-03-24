from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import subprocess
import json
import os
import re
import shlex
from fastapi.middleware.cors import CORSMiddleware

INFO_FILE = "info.txt"

app = FastAPI()

# ✅ Allow CORS from any origin (good for testing; tighten in prod)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=['GET', 'POST'],
    allow_headers=["*",'Content-Type'],
)

class ProductData(BaseModel):
    product: dict

def clear_info_file():
    with open(INFO_FILE, 'w', encoding='utf-8') as f:
        f.truncate()

def write_input_to_info_txt(product: dict):
    lines = ["Input Product Data:"]
    for key, value in product.items():
        lines.append(f"{key}: {value}")
    with open(INFO_FILE, 'a', encoding='utf-8') as f:
        f.write("\n".join(lines) + "\n")

def call_script_py(image: str = None, barcode: str = None):
    command = ["python", "script.py"]

    if image and image.strip().upper() != "N/A":
        command += ["--image", image.strip()]

    if barcode and str(barcode).strip().upper() != "N/A":
        command += ["--barcode", str(barcode).strip()]

    print(f"\n🚀 [Running script.py with args]: {shlex.join(command)}")

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    print(f"\n🖨️ [STDOUT from script.py]:\n{result.stdout}")
    print(f"\n🧨 [STDERR from script.py]:\n{result.stderr}")

    if result.returncode != 0:
        raise RuntimeError(f"script.py failed with exit code {result.returncode}")

def call_agent1_py():
    subprocess.run(["python", "agent1.py"], check=True)

def call_agent2_py():
    subprocess.run(["python", "agent2.py"], check=True)

def read_final_json_from_info_txt():
    with open(INFO_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Use regex to extract a JSON object from the file (greedy match)
    matches = re.findall(r"\{.*\}", content, re.DOTALL)

    for match in reversed(matches):
        try:
            parsed = json.loads(match)
            return parsed
        except Exception:
            continue

    return {
        "error": "No valid JSON found in info.txt",
        "raw_info_txt": content
    }

@app.post("/process")
async def process_product_data(data: ProductData):
    try:
        # Step 1: Clear info.txt
        clear_info_file()
        print("✅ [Step 1] Cleared info.txt\n")

        # Step 2: Write input JSON to info.txt
        write_input_to_info_txt(data.product)
        with open(INFO_FILE, "r", encoding="utf-8", errors="ignore") as f:
            print("📄 [Step 2] After writing input:\n", f.read())

        # Step 3: Call script.py (OCR + barcode scan + lookup)
        image = data.product.get("product_image")
        barcode = data.product.get("barcode")
        call_script_py(image=image, barcode=barcode)
        with open(INFO_FILE, "r", encoding="utf-8", errors="ignore") as f:
            print("📄 [Step 3] After script.py:\n", f.read())

        # Step 4: Call agent1.py (LLM cleanup)
        call_agent1_py()
        with open(INFO_FILE, "r", encoding="utf-8", errors="ignore") as f:
            print("📄 [Step 4] After agent1.py:\n", f.read())

        # Step 5: Call agent2.py (Langflow search enrichment)
        call_agent2_py()
        with open(INFO_FILE, "r", encoding="utf-8", errors="ignore") as f:
            print("📄 [Step 5] After agent2.py:\n", f.read())

        # Step 6: Parse and return structured JSON
        final_json = read_final_json_from_info_txt()
        print("📦 [Step 6] Final parsed JSON:\n", final_json)
        return final_json

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
