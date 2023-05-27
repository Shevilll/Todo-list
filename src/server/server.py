from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client = MongoClient("localhost", 27017)
db = client["todo"]
collection = db["list"]
# collection.insert_one({"name": "shevil"})
item = collection.find()
item = list(item)


@app.route("/server/data")
def data():
    for i in item:
        i["_id"] = str(i["_id"])
    return jsonify(item)


if __name__ == "__main__":
    app.run(debug=True)
