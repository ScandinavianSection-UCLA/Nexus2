import re

default_attrs = {
    "story_id": -1,
    "informant":
        {'id': 150},
    "publication_info": "",
    "full_name": "",
    "search_string": "",
    "place_recorded": {'id': -1},
    "url": "",
    "fieldtrip": {'id': -2},
    "places_mentioned": {"place": {"place_id": -2, "place_name": ""}},
    "id": -2,
}

pattern = re.compile("null.*")

if __name__ == "__main__":
    with open("original/cstories.json") as stories:
        data = stories.read()
        result = re.search(r"(?P<key>[^\"]+)\": *null", data)
        while result:
            data = data[:271]+""+data[271:]
            key = result.group(1)
            replace = default_attrs[key]
            end = result.span()[1]
            data = data[:end-4]+str(replace)+data[end:]
            result = re.search(r"(?P<key>[^\"]+)\": *null", data)
        with open("cstories.json", "w") as output:
            output.write(data)
            #print("YET", data)
