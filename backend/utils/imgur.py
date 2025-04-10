import requests
import os

from dotenv import load_dotenv
from fastapi import HTTPException
from typing import List

from models.schema import Image, ImageURLResponse

load_dotenv()
IMGUR_CLIENT_ID = os.getenv("IMGUR_CLIENT_ID")
MAX_IMAGES = 5


def extract_album_hash(imgur_url: str) -> str:
    parts = str(imgur_url).strip("/").split("/")
    if "a" in parts and "imgur.com" in parts:
        return parts[parts.index("a") + 1]
    raise ValueError("Invalid Imgur album URL format")

def fetch_album_images(imgur_url: str) -> List[Image]:
    images = []
    if not IMGUR_CLIENT_ID:
        raise RuntimeError("Missing IMGUR_CLIENT_ID in environment.")

    album_hash = extract_album_hash(imgur_url)
    url = f"https://api.imgur.com/3/album/{album_hash}/images"
    headers = {"Authorization": f"Client-ID {IMGUR_CLIENT_ID}"}

    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise RuntimeError("Failed to fetch images from Imgur")

    images_data = response.json().get("data", [])[:MAX_IMAGES]
    
    if not images_data:
        raise HTTPException(400, detail="Imgur album contains no images.")
    
    images =  [
        Image(
            link=img["link"],
            type=img["type"],
            width=img["width"],
            height=img["height"]
        ) for img in images_data
    ]
    
    return images

