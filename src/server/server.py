from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from time import ctime

"""Structure = {
_id:default
todo:str
pending:bool
date_added:default with localtime
}"""
app = Flask(__name__)
CORS(app)
client = MongoClient("localhost", 27017)
db = client["todo"]
collection = db["list"]


@app.route("/data/get", methods=["GET"])
def getData():
    item = collection.find()
    item = list(item)

    for i in item:
        i["_id"] = str(i["_id"])
    return jsonify(item)


@app.route("/data/post", methods=["POST"])
def postData():
    data = request.get_json()
    if data["todo"]:
        collection.insert_one(
            {
                "todo": data["todo"],
                "pending": data["pending"],
                "addedon": ctime(),
            }
        )
    return getData()


@app.route("/data/delete", methods=["POST"])
def deleteData():
    data = request.get_json()
    if data["_id"]:
        id = ObjectId(data["_id"])
        collection.delete_one({"_id": id})
    return getData()


@app.route("/data/update", methods=["POST"])
def updateData():
    data = request.get_json()
    if data["_id"]:
        id = ObjectId(data["_id"])
        collection.update_one({"_id": id}, {"$set": {"pending": data["pending"]}})
    return getData()


if __name__ == "__main__":
    app.run(debug=True)
