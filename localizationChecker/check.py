import json
import re

def load_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        file_content = file.read()

        match = re.search(r'\{.*\}', file_content, re.DOTALL)
        if match:
            json_content = match.group()
            return json.loads(json_content)
        else:
            print(f"Error: No JSON content found in {file_path}")
            return None

def find_duplicate_keys(json_data):
    seen_keys = set()
    duplicate_keys = set()

    for key in json_data:
        if key in seen_keys:
            duplicate_keys.add(key)
        else:
            seen_keys.add(key)

    if duplicate_keys:
        print("Duplicate keys:")
        for key in duplicate_keys:
            print(key)
    else:
        print("No duplicate keys found in the file.")

def find_missing_and_extraneous_keys(reference_strings, target_strings, target_language):
    missing_keys = []
    extraneous_keys = []

    for key in reference_strings:
        if key not in target_strings:
            missing_keys.append(key)
    for key in target_strings:
        if key not in reference_strings:
            extraneous_keys.append(key)
    trig = 0
    if missing_keys:
        print(f"Missing keys in {target_language} version:")
        trig = 1
        for key in missing_keys:
            print(key)

    if extraneous_keys:
        print(f"Extraneous keys in {target_language} version:")
        trig = 1
        for key in extraneous_keys:
            print(key)

    if trig == 0:
        print(f"No missing or extraneous key in {target_language} version")

languages_to_check = ["ar", "de", "en", "es", "fr", "ja", "ko", "pt", "ru", "tr", "vi", "zh-Hant"]

reference_strings = load_json(f'string_zh.js')

for language_code in languages_to_check:
    target_strings = load_json(f'string_{language_code}.js')
    find_missing_and_extraneous_keys(reference_strings, target_strings, language_code)
    find_duplicate_keys(target_strings)