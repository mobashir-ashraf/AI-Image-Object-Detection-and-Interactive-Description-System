🚀 AI Image Object Detection and Interactive Description System

An AI-powered web application that detects objects in images using YOLOv8 and provides interactive visual and audio descriptions.

🔗 GitHub Repository:
https://github.com/mobashir-ashraf/AI-Image-Object-Detection-and-Interactive-Description-System

---

📌 Features

- 🧠 Object Detection using YOLOv8 (Ultralytics)
- 📷 Upload image and detect multiple objects
- 🎯 Bounding boxes drawn on detected objects
- 🖱️ Click on objects to view details
- 🗣️ Text-to-Speech for object descriptions
- 📝 Automatic overall image description

---

🛠️ Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Flask
- AI Model: YOLOv8
- Libraries: OpenCV, Pillow

---

📂 Project Structure

AI-Image-Object-Detection-and-Interactive-Description-System/
    static/
        script.js
        style.css
    templates/
        index.html
    uploads/
        .gitkeep
    app.py
    requirements.txt
    Procfile
    README.md

---

⚙️ Installation & Setup

1. Clone the repository

git clone https://github.com/mobashir-ashraf/AI-Image-Object-Detection-and-Interactive-Description-System.git
cd AI-Image-Object-Detection-and-Interactive-Description-System

2. Create virtual environment (recommended)

python -m venv venv
venv\Scripts\activate

3. Install dependencies

pip install -r requirements.txt

4. Run the application

python app.py

5. Open in browser

http://127.0.0.1:5000

---

🌐 Deployment (Render)

This project is ready to deploy on .

Build Command:

pip install -r requirements.txt

Start Command:

gunicorn app:app

---

⚠️ Important Notes

- The "uploads/" folder is included using ".gitkeep"
- The model file "yolov8n.pt" may not be uploaded due to size limits
- Unique filenames are generated using UUID to avoid overwriting
- Ensure all dependencies are installed before running

---

🤝 Contribution

Feel free to fork this repository and improve the project.

---

📄 License

This project is licensed under the MIT License.

---

👨‍💻 Author

Developed by Mobashir Ashraf

---

⭐ If you like this project, consider giving it a star!
