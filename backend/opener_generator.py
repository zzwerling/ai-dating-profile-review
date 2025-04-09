from openai import OpenAI
from dotenv import load_dotenv
import json
import os
import logging

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s [%(levelname)s] %(message)s"
)
logger = logging.getLogger(__name__)

def load_prompt(path="opener_generator_prompt.txt", **variables):
    with open(path, "r", encoding="utf-8") as file:
        return file.read().format(**variables)

def generate_openers(description: str, tone: str, number: int):
    system_prompt = load_prompt({"description": description, "tone": tone, "number": number})
    logger.info(system_prompt)
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
            ],
            temperature=0.7,
            max_tokens=1000
        )
        logger.info("OpenAI response received")
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error("Error calling OpenAI: %s", e)
        return {
            "openers":["Failed to generate openers"]
        }
    

