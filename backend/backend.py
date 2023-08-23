from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from pymongo import MongoClient, ASCENDING
from bson import ObjectId
from bson.json_util import default as bson_default

from datetime import datetime
import json


app = Flask(__name__)
CORS(app)

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        elif isinstance(obj, ObjectId):
            return str(obj)
        return bson_default(obj)
    
app.json_encoder = CustomJSONEncoder

mongo_client = MongoClient("mongodb://localhost")
db = mongo_client["payment"]
coll = db["transactions"]


# Expect something like { "name": "Mohammad Collier", "date_min": "2020-10-01T13:30:00.000Z" }
# Available fields:
# - name (init name)
# - init_bic
# - dest_bic
# - min_date
# - max_date
# - min_amt
# - max_amt
@app.route("/search", methods=["POST"])
def search():
    input = request.json
    query = extract_query(input)

    if len(query) > 0:

      args = request.args
      skip = int(args["start"]) if "start" in args else 0
      limit = int(args["limit"]) if "limit" in args else 100
      
      cursor = coll.find(query).sort("Document.pain_001_001_03.GrpHdr.CreDtTm", ASCENDING).skip(skip).limit(limit+1)
  
      result = [ {"_id": r["_id"], 
                  "name": r["Document"]["pain_001_001_03"]["GrpHdr"]["InitgPty"]["Nm"], 
                  "date": r["Document"]["pain_001_001_03"]["GrpHdr"]["CreDtTm"],
                  "amt": r["Document"]["pain_001_001_03"]["CdtTrfTxInf"]["Amt"]["InstdAmt"]["Amt"],
                  "init_bic": r["Document"]["pain_001_001_03"]["GrpHdr"]["InitgPty"]["Id"]["OrgId"]["Othr"]["Id"],
                  "dest_bic": r["Document"]["pain_001_001_03"]["CdtTrfTxInf"]["CdtrAgt"]["FinInstnId"]["BIC"]
                  } 
              for r in cursor]
  
      
      return Response(json.dumps({"results":result[:limit], "hasNext":len(result)==limit+1}, cls=CustomJSONEncoder), content_type="application/json")
    else:
      return Response("[]", content_type="application/json")

@app.route("/count", methods=["POST"])
def count():
    input = request.json
    query = extract_query(input)
    if len(query) > 0:

      return jsonify({"count": coll.count_documents(query)})
    else:
      return jsonify({"count":0})

def hasKey(input, key):
    return key in input and input[key] is not None and input[key] != ''  

def extract_query(input):
    query = {}
    print("Requested input: %s" % input)
    if hasKey(input, "name"): 
        query["Document.pain_001_001_03.GrpHdr.InitgPty.Nm"] = input["name"]
    if hasKey(input, "init_bic"):
        query["Document.pain_001_001_03.GrpHdr.InitgPty.Id.OrgId.Othr.Id"] = input["init_bic"]
    if hasKey(input, "dest_bic"):
        query["Document.pain_001_001_03.CdtTrfTxInf.CdtrAgt.FinInstnId.BIC"] = input["dest_bic"]
    
    date = {}
    amt = {}

    if hasKey(input, "min_date"):
        date["$gte"] = datetime.fromisoformat(input["min_date"])
    if hasKey(input, "max_date"):
        date["$lte"] = datetime.fromisoformat(input["max_date"])
    if hasKey(input, "min_amt"):
        amt["$gte"] = input["min_amt"]
    if hasKey(input, "max_amt"):
        amt["$lte"] = input["max_amt"]

    if len(date) > 0:
        query["Document.pain_001_001_03.GrpHdr.CreDtTm"] = date
    if len(amt) > 0:
        query["Document.pain_001_001_03.CdtTrfTxInf.Amt.InstdAmt.Amt"] = amt

    print("Found query: %s" % query)

    return query

@app.route("/details/<id>", methods=["GET"])
def details(id):
    result = coll.find_one({"_id": ObjectId(id)})
    return Response(json.dumps(result, cls=CustomJSONEncoder), content_type="application/json")


if __name__ == "__main__":
    app.run(port=8000)
