import json
import logging
from openai import AsyncOpenAI
from app.core.config import settings

logger = logging.getLogger(__name__)

async def analyze_ticket(subject: str, description: str) -> dict:
    """
    Analyzes ticket subject and description using OpenAI if API key is present.
    Falls back to simple heuristics if not configured or if API call fails.
    """
    text = f"{subject} {description}".lower()
    fallback_result = _heuristic_fallback(text)
    
    if not settings.OPENAI_API_KEY:
        logger.info("OPENAI_API_KEY not found. Using heuristic fallback.")
        return fallback_result

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a customer support ticket routing system. Classify the user's ticket into a category and sentiment. Reply strictly with valid JSON containing exactly two keys: 'category' (e.g. 'Technical Support', 'Billing', 'General Inquiry', 'Feature Request') and 'sentiment' (e.g. 'Positive', 'Neutral', 'Negative', 'Urgent')."},
                {"role": "user", "content": f"Subject: {subject}\nDescription: {description}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.0
        )
        result = json.loads(response.choices[0].message.content)
        return {
            "category": result.get("category", fallback_result["category"]),
            "sentiment": result.get("sentiment", fallback_result["sentiment"])
        }
    except Exception as e:
        logger.error(f"OpenAI API call failed: {e}. Falling back to heuristics.")
        return fallback_result

def _heuristic_fallback(text: str) -> dict:
    category = "General Inquiry"
    sentiment = "Neutral"
    
    if "bug" in text or "error" in text or "broken" in text:
        category = "Technical Support"
        sentiment = "Negative"
    if "urgent" in text or "asap" in text or "immediately" in text:
        sentiment = "Urgent"
    if "bill" in text or "invoice" in text or "charge" in text or "refund" in text:
        category = "Billing"
    if "feature" in text or "add" in text or "request" in text:
        category = "Feature Request"
        sentiment = "Positive"
        
    return {
        "category": category,
        "sentiment": sentiment
    }
