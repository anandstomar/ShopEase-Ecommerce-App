from flask import Flask, jsonify
from pymongo import MongoClient
MONGODB_URL = 'mongodb+srv://Ananddb:Anand2003@cluster0.hhg4k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
app = Flask(__name__)

# MongoDB setup
mongo_client = MongoClient(MONGODB_URL)
db = mongo_client["analytics_db"]
collection = db["events"]

@app.route('/analytics/events', methods=['GET'])
def get_all_events():
    events = list(collection.find({}, {'_id': 0}))
    return jsonify(events), 200

@app.route('/analytics/events/<event_type>', methods=['GET'])
def get_events_by_type(event_type):
    events = list(collection.find({'event_type': event_type}, {'_id': 0}))
    return jsonify(events), 200

if __name__ == '__main__':
    app.run(port=5000)
