from kafka import KafkaConsumer
from pymongo import MongoClient
import json
import signal
import sys
MONGODB_URL = 'mongodb+srv://Ananddb:Anand2003@cluster0.hhg4k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

# MongoDB setup
mongo_client = MongoClient(MONGODB_URL)
db = mongo_client["analytics_db"]
collection = db["events"]

# Kafka Consumer setup (do not pre-set value_deserializer)
consumer = KafkaConsumer(
    'user-events',
    'order-events',
    bootstrap_servers=['localhost:9092'],
    auto_offset_reset='earliest',
    group_id='analytics-service'
)

def consume_events():
    print("Consumer started. Waiting for events...")
    try:
        for message in consumer:
            raw = message.value
            if not raw:
                print("Skipping empty message.")
                continue

            try:
                decoded = raw.decode('utf-8').strip()
            except Exception as decode_err:
                print("Error decoding message:", decode_err)
                continue

            # Ignore messages that do not start with '{'
            if not decoded.startswith("{"):
                print("Skipping non-JSON message:", decoded)
                continue

            try:
                event = json.loads(decoded)
            except Exception as json_err:
                print("Error parsing JSON:", json_err, "Raw message:", decoded)
                continue

            try:
                collection.insert_one(event)
                print("Stored event:", event)
            except Exception as db_err:
                print("Error inserting into MongoDB:", db_err)
    except Exception as e:
        print("Error while consuming events:", e)


def signal_handler(sig, frame):
    print("Interrupt received, shutting down consumer...")
    consumer.close()
    sys.exit(0)

# Setup signal handling for graceful shutdown (Ctrl+C)
signal.signal(signal.SIGINT, signal_handler)

if __name__ == '__main__':
    consume_events()
