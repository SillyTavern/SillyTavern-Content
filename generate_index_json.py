import os
import json

URL = "https://github.com/SillyTavern/SillyTavern-Content/raw/main/"
ASSETS_FOLDER = "assets/"
OUTPUT_JSON = "index.json"


if __name__ == "__main__":
    assets_json = []
    for path, subdirs, files in os.walk(ASSETS_FOLDER):
        for name in files:
            type = path[len(ASSETS_FOLDER):]
            id = name
            url = URL + ASSETS_FOLDER + type + "/" + name
            entry = {"type":type,"id":id,"url":url}
            print("Creating entry:", entry)
            assets_json.append(entry)

    with open(OUTPUT_JSON, "w") as outfile:
        outfile.write(json.dumps(assets_json,indent=2))
    print("Done.")