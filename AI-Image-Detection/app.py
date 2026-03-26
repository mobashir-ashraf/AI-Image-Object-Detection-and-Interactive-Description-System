import os
import uuid
from flask import Flask, request, jsonify, render_template
from ultralytics import YOLO

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Ensure uploads folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

# Load model (auto-downloads if not present)
model = YOLO("yolov8n.pt")

@app.route("/")
def home():
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

    results = model(filepath)[0]

    objects = []

    for box in results.boxes:
        x1, y1, x2, y2 = box.xyxy[0]

        cls = int(box.cls[0])
        name = model.names[cls]
        confidence = round(float(box.conf[0]), 2)

        objects.append({
            "name": name,
            "confidence": confidence,
            "x": int(x1),
            "y": int(y1),
            "width": int(x2 - x1),
            "height": int(y2 - y1),
            "description": f"A {name} is detected in the image."
        })

    return jsonify(objects)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
