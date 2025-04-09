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

def load_system_message():
    file_path = os.path.join(os.path.dirname(__file__), '..', 'prompts', 'bio_review_prompt.txt')
    file_path = os.path.abspath(file_path)
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()

def get_bio_review(bio: str, temperature: float):
    system_message = load_system_message()
    user_prompt = "Here is the bio to review: " + bio
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_prompt}
            ],
            temperature=temperature,
            max_tokens=1000
        )
        logger.info("OpenAI response received")
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.error("Error calling OpenAI: %s", e)
        return {
            "submitted_rating": 0,
            "submitted_critique": "Error processing bio.",
            "rewritten_bio": "",
            "rewritten_rating": 0,
            "rewritten_explanation": "Could not generate rewrite due to an error."
        }
    

