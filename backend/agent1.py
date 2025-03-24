import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

INFO_FILE = "info.txt"

# Define the product schema for reference in the LLM prompt
product_schema = {
    "id": "int",
    "product_name": "text",
    "barcode": "int",
    "brand": "text",
    "product_image": "text",
    "item_weight": "int",
    "weight_unit": "text",
    "ingredients": "jsonb",
    "product_description": "text",
    "storage_requirements": "text",
    "items_per_package": "int",
    "color": "text",
    "material": "text",
    "width": "int",
    "height": "int",
    "dimension_unit": "text",
    "warranty": "int"
}

# 🔐 Setup your OpenAI client securely
model = OpenAI(
    api_key=openai_api_key, # ← You should set this in your environment
)

def load_info_txt():
    with open(INFO_FILE, "r", encoding="utf-8", errors="ignore") as file:
        return file.read()

def append_to_info_file(info):
    with open(INFO_FILE, "a", encoding="utf-8") as file:
        file.write("\n---\nStructured Output (via LLM):\n")
        file.write(info + "\n")

def generate_prompt(raw_text):
    schema_description = "\n".join([f"- {key} ({val})" for key, val in product_schema.items()])
    prompt = f"""
You are a data extraction assistant. Your task is to extract structured product data from the raw OCR + barcode + product info below.

RAW TEXT:
\"\"\"
{raw_text}
\"\"\"

Please return a valid JSON object with the following fields:
{schema_description}

Only fill in fields you are confident about. Use `null` for anything uncertain or missing. Convert ingredients into a list if they appear in sentence form.

Return ONLY the JSON object.
"""
    return prompt.strip()

def call_llm(prompt):
    messages = [
        {"role": "system", "content": "You are an AI assistant that extracts structured product data from unstructured text for a PostgreSQL table. GIVE YOUR PUTPUT IN JSON AND NO ``` IN START OR END OF YOUT OUTPUT."},
        {"role": "user", "content": prompt}
    ]
    response = model.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.2
    )
    return response.choices[0].message.content

def main():
    print("[INFO] Reading from info.txt...")
    raw_text = load_info_txt()

    print("[INFO] Generating prompt...")
    prompt = generate_prompt(raw_text)

    print("[INFO] Sending request to OpenAI...")
    structured_output = call_llm(prompt)

    print("\n[LLM Structured Output]\n")
    print(structured_output)

    # 🔥 Overwrite info.txt with just the structured output
    with open(INFO_FILE, "w", encoding="utf-8") as file:
        file.write(structured_output + "\n")
    print("\n[INFO] Overwrote info.txt with structured output only")

if __name__ == "__main__":
    main()
