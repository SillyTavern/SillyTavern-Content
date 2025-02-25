import os
import json
import png
import base64

from argparse import ArgumentParser


DEFAULT_URL = "https://github.com/SillyTavern/SillyTavern-Content/raw/main/"
ASSETS_FOLDER = "assets/"
EXTENSIONS_FILE = "extensions.json"
OUTPUT_JSON = "index.json"
HIGHLIGHT_JSON = "highlight.json"

highlighted = []

with open(HIGHLIGHT_JSON, "r") as highlightfile:
    try:
        highlighted = json.load(highlightfile)
    except:
        print("Error parsing highlight.json")
        highlighted = []

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

def read_character(path: str, name: str, entry: dict) -> bool:
    reader = png.Reader(os.path.join(path, name))
    chunks = reader.chunks()
    png_data = None
    for chunk in chunks:
        if chunk[0] == b'tEXt':
            png_data = chunk[1][6:] # skip "chara" and 0x00
            break
    if not png_data:
        print("No tEXt chunk found in", entry)
        return False
    try:
        text = base64.b64decode(png_data)
        data = json.loads(text)
        entry['name'] = data['data']['name']
        entry['description'] = data['data']['creator_notes']
        entry['highlight'] = entry['id'] in highlighted
        return True
    except:
        print("Error parsing tEXt chunk in", entry)
        return False

if __name__ == "__main__":
    assets_json = []
    for path, subdirs, files in os.walk(ASSETS_FOLDER):
        for name in sorted(files):
            if name.startswith("."):
                continue
            type = path[len(ASSETS_FOLDER) :]
            id = name
            url = repository_url + ASSETS_FOLDER + type + "/" + name
            entry = {"type": type, "id": id, "url": url}
            if type == "character":
                read_result = read_character(path, name, entry)
                if not read_result:
                    print("Skipping invalid entry:", entry)
                    continue
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
