from flask import Flask, render_template, request, jsonify
from ultralytics import YOLO
import os
import uuid

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

model = YOLO("yolov8n.pt")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload():

    if "image" not in request.files:
        return jsonify({"error": "No file uploaded"})

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No file selected"})

    filename = str(uuid.uuid4()) + "_" + file.filename
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    results = model(filepath)

    detected_objects = []

    for r in results:
        for box in r.boxes:

            cls = int(box.cls[0])
            name = model.names[cls]
            confidence = float(box.conf[0])

            x1, y1, x2, y2 = map(int, box.xyxy[0])

            description = f"A {name} is clearly visible in the image detected using AI."

            detected_objects.append({
                "name": name,
                "confidence": round(confidence, 2),
                "x": x1,
                "y": y1,
                "width": x2-x1,
                "height": y2-y1,
                "description": description
            })

    return jsonify(detected_objects)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
