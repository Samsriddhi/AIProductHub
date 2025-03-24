import json
import requests
from typing import Optional
import warnings
import re
import os
from dotenv import load_dotenv

load_dotenv()

# Access the values
application_token = os.getenv("APPLICATION_TOKEN")

INFO_FILE = "info.txt"
BASE_API_URL = "https://api.langflow.astra.datastax.com"
LANGFLOW_ID = "2094f72a-e9f5-4028-8c86-eeb6c527310c"
FLOW_ID = "ef7b4c33-d334-4244-b0f7-9974b5deb27c"
APPLICATION_TOKEN = application_token
ENDPOINT = ""

print(f"🧪 Loaded API token: {repr(APPLICATION_TOKEN)}")

TWEAKS = {
    "Agent-0odrT": {},
    "ChatInput-fDUA8": {},
    "ChatOutput-LqShb": {},
    "DuckDuckGoSearchComponent-dmJcK": {}
}

def run_flow(message: str,
             endpoint: str,
             output_type: str = "chat",
             input_type: str = "chat",
             tweaks: Optional[dict] = None,
             application_token: Optional[str] = None) -> dict:
    api_url = f"{BASE_API_URL}/lf/{LANGFLOW_ID}/api/v1/run/{endpoint}"

    payload = {
        "input_value": message,
        "output_type": output_type,
        "input_type": input_type,
    }
    headers = None
    if tweaks:
        payload["tweaks"] = tweaks
    if application_token:
        headers = {"Authorization": "Bearer " + application_token, "Content-Type": "application/json"}

    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()

def extract_json_from_markdown(text):
    import re
    import json

    def clean_json_block(block):
        import re

        # Step 1: Strip inline comments
        lines = block.splitlines()
        cleaned_lines = []
        for line in lines:
            if '//' in line:
                line = line.split('//')[0]
            cleaned_lines.append(line)
        cleaned = '\n'.join(cleaned_lines)

        # Step 2: Fix broken "product_image" field (if value is incomplete or unterminated)
        cleaned = re.sub(r'"product_image"\s*:\s*"https:[^",\n]*', '"product_image": null,', cleaned)

        # Step 3: Replace "N/A" or "n/a" with null
        cleaned = cleaned.replace('"N/A"', 'null').replace('"n/a"', 'null')

        # Step 4: Remove trailing commas before closing brackets
        cleaned = re.sub(r',\s*([\]}])', r'\1', cleaned)

        return cleaned.strip()

    # Step 5: Extract JSON inside markdown code block ```json ... ```
    matches = re.findall(r"```(?:json)?\s*({[\s\S]+?})\s*```", text)

    for match in matches:
        cleaned = clean_json_block(match)
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            print("❌ JSON decode error:", e)
            print("🧪 Problematic block:\n", cleaned)
            continue

    # Fallback: Try to grab any JSON-looking blob
    fallback = re.search(r"({[\s\S]+})", text)
    if fallback:
        cleaned = clean_json_block(fallback.group(1))
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            print("❌ Fallback JSON decode error:", e)
            print("🧪 Fallback block:\n", cleaned)

    return None



def find_nested_text_field(response):
    try:
        for outer in response.get("outputs", []):
            for inner in outer.get("outputs", []):
                text = (
                    inner.get("results", {})
                         .get("message", {})
                         .get("data", {})
                         .get("text")
                )
                if text:
                    return text
    except Exception:
        return None
    return None

def main():
    try:
        with open(INFO_FILE, 'r', encoding='utf-8') as f:
            message = f.read().strip()
    except FileNotFoundError:
        print("❌ info.txt not found.")
        return

    try:
        response = run_flow(
            message=message,
            endpoint=ENDPOINT or FLOW_ID,
            output_type="chat",
            input_type="chat",
            tweaks=TWEAKS,
            application_token=APPLICATION_TOKEN
        )
    except Exception as e:
        print(f"❌ Error calling Langflow API: {e}")
        return

    try:
        markdown_text = find_nested_text_field(response)
        if markdown_text:
            extracted_json = extract_json_from_markdown(markdown_text)
            if extracted_json:
                with open(INFO_FILE, 'w', encoding='utf-8') as f:
                    json.dump(extracted_json, f, indent=2)
                print("✅ Clean JSON extracted and written to info.txt")
                return

        # fallback: write full response
        with open(INFO_FILE, 'w', encoding='utf-8') as f:
            json.dump(response, f, indent=2)
        print("⚠️ Wrote raw response to info.txt (couldn't extract embedded JSON)")

    except Exception as e:
        print(f"❌ Failed to write output to info.txt: {e}")

if __name__ == "__main__":
    main()
