import requests
import json
import os

# @dev remember to call load_dotenv() func
def upload_img_and_json_to_pinata(index):    
    pinata_img_path = 'ipfs://{}'
    pinata_base_url = 'https://api.pinata.cloud'
    endpoint = '/pinning/pinFileToIPFS'
    filepath_json = f"{os.getcwd()}/metadata/json/{index}.json"
    filepath_img = f"{os.getcwd()}/metadata/img/{index}.png"
    file_name_json = index + '.json'
    file_name_img = index + '.png'
    headers = {
        "pinata_api_key": os.getenv('PINIATA_PUBLIC_KEY'),
        "pinata_secret_api_key": os.getenv('PINIATA_PRIVATE_KEY')
    }
    img_binary = open(filepath_img, 'rb').read()

    response_img = requests.post(
        pinata_base_url + endpoint,
        files={'file': (file_name_img, img_binary)},
        headers=headers    
    )

    with open(filepath_json) as f:
        json_data = json.load(f)
        json_data['image'] = pinata_img_path.format(response_img.json()['IpfsHash'])

    response_json = requests.post(
        pinata_base_url + endpoint,
        files={'file': (file_name_json, json.dumps(json_data, indent=2).encode('utf-8'))},
        headers=headers
    )
    return pinata_img_path.format(response_json.json()['IpfsHash'])