from typing import Any

from app.services.normalize_place import normalize_google_place
from app.services.place_classifier import classify_google_place


def build_google_place_variables(raw: dict) -> dict[str, Any]:
    """
    Build the full normalized variable set for a Google place.

    Combines:
    - canonical place fields (identity/location/provider IDs)
    - TripTailor recommendation/classification variables
    """
    canonical = normalize_google_place(raw)
    classified = classify_google_place(raw)

    return {
        **canonical,
        **classified,
    }


def get_google_place_variable_names() -> list[str]:
    """
    Returns the current variable names produced by build_google_place_variables().
    Useful for documentation, debugging, and questionnaire/recommendation planning.
    """
    return [
        "name",
        "address_line1",
        "address_line2",
        "city",
        "region",
        "postal_code",
        "country",
        "latitude",
        "longitude",
        "phone",
        "website_url",
        "google_maps_url",
        "google_place_id",
        "yelp_business_id",
        "title",
        "description",
        "activity_type",
        "category",
        "tags",
        "estimated_cost_cents",
        "duration_minutes",
        "effort_level",
        "accessibility_notes",
        "wheelchair_accessible",
        "family_friendly",
        "good_for_groups",
        "good_for_kids",
        "pet_friendly",
        "indoor_outdoor",
        "noise_level",
        "activity_level",
        "reservations_required",
        "ticket_required",
        "source",
        "source_url",
        "provider_source",
        "provider_category_types",
        "matched_primary_type",
        "rating",
        "review_count",
        "price_level",
        "business_status",
        "quality_score",
    ]