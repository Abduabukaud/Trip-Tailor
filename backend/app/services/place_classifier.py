from copy import deepcopy
from typing import Any

from app.services.google_type_rules import GOOGLE_TYPE_RULES, TYPE_PRIORITY, get_default_activity_rule


def _normalize_google_price_level(raw: dict) -> int | None:
    """
    Google Places Text Search may return price_level as an integer (typically 0-4).
    Return it as-is if present and valid.
    """
    price_level = raw.get("price_level")
    if isinstance(price_level, int) and 0 <= price_level <= 4:
        return price_level
    return None


def _build_quality_score(rating: float | None, review_count: int | None) -> float | None:
    """
    Simple placeholder quality score.
    For now, return rating if present.
    Later, this can incorporate review_count weighting.
    """
    if rating is None:
        return None
    return float(rating)


def classify_google_place(raw: dict) -> dict[str, Any]:
    """
    Convert a raw Google Places result into normalized TripTailor activity metadata.
    This does not save anything to the DB. It only classifies the place.
    """
    place_types = raw.get("types") or []
    result = deepcopy(get_default_activity_rule())

    matched_type = None
    for place_type in TYPE_PRIORITY:
        if place_type in place_types and place_type in GOOGLE_TYPE_RULES:
            result.update(GOOGLE_TYPE_RULES[place_type])
            matched_type = place_type
            break

    rating = raw.get("rating")
    review_count = raw.get("user_ratings_total")
    price_level = _normalize_google_price_level(raw)

    result.update({
        "title": raw.get("name"),
        "description": None,
        "source": "google",
        "source_url": None,

        # Provider-derived variables
        "provider_source": "google",
        "provider_category_types": place_types,
        "matched_primary_type": matched_type,
        "rating": float(rating) if rating is not None else None,
        "review_count": int(review_count) if review_count is not None else None,
        "price_level": price_level,
        "business_status": raw.get("business_status"),
        "quality_score": _build_quality_score(
            float(rating) if rating is not None else None,
            int(review_count) if review_count is not None else None,
        ),
    })

    return result