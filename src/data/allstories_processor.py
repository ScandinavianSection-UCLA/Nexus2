# module to parse the json data
import json

# attributes for stories to fall back on
default_attrs = {
    "annotation": None,
    "bibliographic_info": None,
    "bibliography_references": {
        "reference": [],
    },
    "danish_manuscript": None,
    "danish_publication": None,
    "english_manuscript": None,
    "english_publication": None,
    "etk_index": {
        "heading_danish": None,
        "heading_english": None,
        "id": -2,
    },
    "fielddiary_page_end": None,
    "fielddiary_page_start": None,
    "fieldtrip": {
        "id": -2,
    },
    "full_name": None,
    "genre": {
        "id": -2,
        "name": None,
    },
    "informant_first_name": None,
    "informant_full_name": None,
    "informant_id": None,
    "informant_last_name": None,
    "keywords": {
        "keyword": [],
    },
    "order_told": -1.0,
    "places": {
    },
    "publication_info": None,
    "stories_mentioned": {
        "story": [],
    },
    "story_id": -2,
    "tango_indices": {
        "tango_index": [],
    },
}

# just in case something accidentally runs this program
if __name__ == "__main__":
    with open("original/allstories.json") as original_stories:
        data = json.load(original_stories)
        for story in data:
            for key in default_attrs:
                if key not in story or (isinstance(default_attrs[key], dict) and story[key] is None):
                    story[key] = default_attrs[key]
        with open("allstories.json", "w") as final_stories:
            json.dump(data, final_stories)
