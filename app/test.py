import json
import requests

data = {"hi":1, "hi2":2}

requests.post("http://127.0.0.1:5000/reward", data=json.dumps(data))
