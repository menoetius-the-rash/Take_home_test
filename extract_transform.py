import csv
import json
import requests

fileToJSON = []

# replace path if needed:
filepath = r'C:\\Users\\Jin\Documents\\Stock Twitter Analysis Project\\stock-twitter-analysis-project\\Take_home_test\\input_data.csv'\


# to store the records in csv
data = {}

# first read file to be converted
with open(filepath) as csv_file:
    reader = csv.DictReader(csv_file)
    
    for records in reader:
        fileToJSON.append(records)
        id = records['id']
        data[id] = records

with open('input_data_in_json.json','w') as outfile:
    json.dump(fileToJSON,outfile,sort_keys=True, indent=4)

jsonData = json.dumps(data)
print(jsonData)

# Create a new resource
endpoint_url ='https://api.capturedata.ie/apiName/endpointName/'
headers = {'Content-type': 'application/json'}
response = requests.post(endpoint_url,
                         data=jsonData,
                         headers=headers)

print(response.request.url)
print(response.request.body)
print(response.request.headers)