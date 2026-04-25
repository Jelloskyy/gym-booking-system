from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
 
app = Flask(__name__)
CORS(app)
 

MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client["gymdb"]
bookings_col = db["bookings"]
 

def serialize(doc):
    doc["_id"] = str(doc["_id"])
    return doc
 

CLASSES = [
    {
        "id": "hiit",
        "name": "High-Intensity Interval Training",
        "trainer": "John Trainer",
        "category": "cardio",
        "desc": "Burn calories and build endurance with this intense cardio workout",
        "days": "Mon, Wed, Fri",
        "time": "06:00 AM (45 min)",
        "enrolled": 18,
        "capacity": 20,
        "bar_color": "red"
    },
    {
        "id": "yoga",
        "name": "Yoga Flow",
        "trainer": "Lisa Anderson",
        "category": "wellness",
        "desc": "Improve flexibility and find your inner peace",
        "days": "Tue, Thu",
        "time": "07:00 AM (60 min)",
        "enrolled": 12,
        "capacity": 15,
        "bar_color": "yellow"
    },
    {
        "id": "strength",
        "name": "Strength Training",
        "trainer": "Mike Strong",
        "category": "strength",
        "desc": "Build muscle and increase strength with guided weight training",
        "days": "Mon, Wed, Fri",
        "time": "05:00 PM (60 min)",
        "enrolled": 25,
        "capacity": 25,
        "bar_color": "red"
    }
]
 

 

@app.route("/api/classes", methods=["GET"])
def get_classes():
    return jsonify(CLASSES)
 

@app.route("/api/bookings", methods=["POST"])
def book_class():
    data = request.json
    class_id  = data.get("class_id")
    user_name = data.get("user_name", "Sarah Member")
    user_email = data.get("user_email", "member@gym.com")
 

    gym_class = next((c for c in CLASSES if c["id"] == class_id), None)
    if not gym_class:
        return jsonify({"error": "Class not found"}), 404
 

    existing = bookings_col.find_one({"class_id": class_id, "user_email": user_email})
    if existing:
        return jsonify({"error": "Already booked"}), 400
 
 
    is_full = gym_class["enrolled"] >= gym_class["capacity"]
    status = "waitlist" if is_full else "confirmed"
 
    booking = {
        "class_id":    class_id,
        "class_name":  gym_class["name"],
        "trainer":     gym_class["trainer"],
        "days":        gym_class["days"],
        "time":        gym_class["time"],
        "category":    gym_class["category"],
        "user_name":   user_name,
        "user_email":  user_email,
        "status":      status,
        "booked_at":   datetime.utcnow().isoformat()
    }
 
    result = bookings_col.insert_one(booking)
    booking["_id"] = str(result.inserted_id)
 
    return jsonify({
        "message": "Booked successfully" if status == "confirmed" else "Added to waitlist",
        "status": status,
        "booking": booking
    }), 201
 

@app.route("/api/bookings/<user_email>", methods=["GET"])
def get_bookings(user_email):
    bookings = list(bookings_col.find({"user_email": user_email}))
    return jsonify([serialize(b) for b in bookings])
 

@app.route("/api/bookings/<booking_id>", methods=["DELETE"])
def cancel_booking(booking_id):
    result = bookings_col.delete_one({"_id": ObjectId(booking_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Booking not found"}), 404
    return jsonify({"message": "Booking cancelled"})
 

if __name__ == "__main__":
    app.run(debug=True, port=5000)