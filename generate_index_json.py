import os
import json

from argparse import ArgumentParser


DEFAULT_URL = "https://github.com/SillyTavern/SillyTavern-Content/raw/main/"
ASSETS_FOLDER = "assets/"
EXTENSIONS_FILE = "extensions.json"
OUTPUT_JSON = "index.json"

parser = ArgumentParser()
parser.add_argument("--url", help="URL to prepend assets path with.")
args = parser.parse_args()

repository_url = args.url if args.url else DEFAULT_URL

if repository_url[-1] != "/":
    repository_url += "/"

if not args.url:
    print("No --url argument given, default to ", repository_url)
else:
    print("Using given --url argument", repository_url)

if __name__ == "__main__":
    assets_json = []
    for path, subdirs, files in os.walk(ASSETS_FOLDER):
        for name in files:
            type = path[len(ASSETS_FOLDER) :]
            id = name
            url = repository_url + ASSETS_FOLDER + type + "/" + name
            entry = {"type": type, "id": id, "url": url}
            print("Creating entry:", entry)
            assets_json.append(entry)

    with open(EXTENSIONS_FILE, "r") as extfile:
        extensions = json.load(extfile)
        
        for extension in extensions:
            print("Adding extension:", extension)
            assets_json.append(extension)

    with open(OUTPUT_JSON, "w") as outfile:
        outfile.write(json.dumps(assets_json, indent=2))
    print("Done.")
