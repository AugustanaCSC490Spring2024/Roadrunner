import requests
import json
from urllib.parse import quote_plus

# Please note: f-strings require Python 3.6+

# The URL of the Common Crawl Index server
CC_INDEX_SERVER = 'http://index.commoncrawl.org/'

# The Common Crawl index you want to query
INDEX_NAME = 'CC-MAIN-2023-40'      # Replace with the latest index name

# The URL you want to look up in the Common Crawl index
target_url = 'commoncrawl.org/faq'  # Replace with your target URL

# Function to search the Common Crawl Index
def search_cc_index(url):
    encoded_url = quote_plus(url)
    index_url = f'{CC_INDEX_SERVER}{INDEX_NAME}-index?url={encoded_url}&output=json'
    response = requests.get(index_url)
    print("Response from CCI:", response.text)  # Output the response from the server
    if response.status_code == 200:
        records = response.text.strip().split('\n')
        return [json.loads(record) for record in records]
    else:
        return None

# Function to fetch the content from Common Crawl
def fetch_page_from_cc(records):
    for record in records:
        offset, length = int(record['offset']), int(record['length'])
        prefix = record['filename'].split('/')[0]
        s3_url = f'https://data.commoncrawl.org/{record["filename"]}'
        response = requests.get(s3_url, headers={'Range': f'bytes={offset}-{offset+length-1}'})
        if response.status_code == 206:
            # Process the response content if necessary
            # For example, you can use warcio to parse the WARC record
            return response.content
        else:
            print(f"Failed to fetch data: {response.status_code}")
            return None

# Search the index for the target URL
records = search_cc_index(target_url)
if records:
    print(f"Found {len(records)} records for {target_url}")

    # Fetch the page content from the first record
    content = fetch_page_from_cc(records)
    if content:
        print(f"Successfully fetched content for {target_url}")
        # You can now process the 'content' variable as needed
        print(content)
else:
    print(f"No records found for {target_url}")