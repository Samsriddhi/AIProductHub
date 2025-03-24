import cv2
import pytesseract
from pyzbar.pyzbar import decode
import argparse
import requests
import os
import tempfile

INFO_FILE = 'info.txt'



def append_to_info_file(info):
    with open(INFO_FILE, 'a') as f:
        f.write(info + '\n')

def extract_text_from_image(image_path):
    print("[INFO] Performing OCR...")
    image = cv2.imread(image_path)
    if image is None:
        print("Error: Could not load image.")
        return
    text = pytesseract.image_to_string(image)
    if text.strip():
        append_to_info_file("Extracted Text (OCR):\n" + text.strip() + "\n")
    else:
        append_to_info_file("No text found via OCR.\n")

def extract_barcode_from_image(image_path):
    print("[INFO] Scanning for barcodes...")
    image = cv2.imread(image_path)
    if image is None:
        print("Error: Could not load image.")
        return []

    barcodes = decode(image)
    found_codes = []

    for barcode in barcodes:
        barcode_data = barcode.data.decode('utf-8')
        barcode_type = barcode.type
        found_codes.append(barcode_data)
        info = f"Found {barcode_type} barcode: {barcode_data}"
        append_to_info_file(info)
        print(f"[BARCODE] {info}")

    return found_codes

def get_product_info_from_barcode(barcode):
    print(f"[INFO] Looking up product info for barcode: {barcode}")
    url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
    try:
        response = requests.get(url)
        data = response.json()
        if data.get("status") == 1:
            product = data["product"]
            name = product.get("product_name", "N/A")
            brand = product.get("brands", "N/A")
            quantity = product.get("quantity", "N/A")
            info = f"Product Info for {barcode}:\n  Name: {name}\n  Brand: {brand}\n  Quantity: {quantity}\n"
        else:
            info = f"No product found for barcode {barcode}.\n"
    except Exception as e:
        info = f"Error fetching product info: {e}\n"

    append_to_info_file(info)
    print(f"[INFO] {info.strip()}")



def download_image_from_url(url):
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
            for chunk in response.iter_content(1024):
                temp_file.write(chunk)
            temp_file.close()
            print(f"[INFO] Downloaded image from URL.")
            return temp_file.name
        else:
            print(f"Error: Failed to download image (status code {response.status_code})")
            return None
    except Exception as e:
        print(f"Error downloading image: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Extract text and barcode info from image or barcode input")
    parser.add_argument('--image', help="Path or URL to image file")
    parser.add_argument('--barcode', help="Barcode number")
    args = parser.parse_args()



    found_barcodes = []
    image_path = None
    temp_downloaded_file = None

    if args.image:
        if args.image.startswith('http://') or args.image.startswith('https://'):
            image_path = download_image_from_url(args.image)
            temp_downloaded_file = image_path  # remember to delete later
        else:
            image_path = args.image

        if image_path:
            extract_text_from_image(image_path)
            found_barcodes = extract_barcode_from_image(image_path)

    if args.barcode:
        get_product_info_from_barcode(args.barcode)
    elif found_barcodes:
        for code in found_barcodes:
            get_product_info_from_barcode(code)

    if temp_downloaded_file and os.path.exists(temp_downloaded_file):
        os.remove(temp_downloaded_file)
        print(f"[INFO] Cleaned up downloaded image: {temp_downloaded_file}")


if __name__ == "__main__":
    main()
