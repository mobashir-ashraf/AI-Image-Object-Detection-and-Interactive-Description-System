let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

let objects = []
let img = new Image()
let input = document.getElementById("imageInput")
let voiceEnabled = true

function toggleTheme() {
    document.body.classList.toggle("dark")
}

function toggleVoice() {
    voiceEnabled = !voiceEnabled

    let btn = document.getElementById("voiceBtn")
    let status = document.getElementById("voiceStatus")

    if (voiceEnabled) {
        btn.classList.remove("muted")
        btn.classList.add("active")
        status.innerText = "ON"
    } else {
        btn.classList.add("muted")
        btn.classList.remove("active")
        status.innerText = "OFF"
    }
}

let dropArea = document.getElementById("dropArea")

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    dropArea.style.background = "#e3f2fd"
})

dropArea.addEventListener("dragleave", () => {
    dropArea.style.background = ""
})

dropArea.addEventListener("drop", (e) => {
    e.preventDefault()
    input.files = e.dataTransfer.files
    previewImage()
})

input.addEventListener("change", previewImage)

function previewImage() {
    img.src = URL.createObjectURL(input.files[0])
    img.onload = function () {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
    }
}

async function uploadImage() {

    document.getElementById("error").innerText = ""

    if (input.files.length === 0) {
        document.getElementById("error").innerText = "Select image first"
        return
    }

    document.getElementById("loader").classList.remove("hidden")

    let formData = new FormData()
    formData.append("image", input.files[0])

    let response = await fetch("/upload", {
        method: "POST",
        body: formData
    })

    objects = await response.json()

    document.getElementById("loader").classList.add("hidden")

    drawBoxes()

    document.getElementById("statsText").innerText =
        "Detected Objects: " + objects.length
}

function drawBoxes() {
    ctx.drawImage(img, 0, 0)

    objects.forEach(obj => {
        ctx.strokeStyle = "lime"
        ctx.lineWidth = 2
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)

        ctx.fillStyle = "lime"
        ctx.fillText(obj.name, obj.x, obj.y - 5)
    })
}

canvas.addEventListener("click", function (event) {

    let rect = canvas.getBoundingClientRect()
    let x = event.clientX - rect.left
    let y = event.clientY - rect.top

    drawBoxes()

    objects.forEach(obj => {
        if (x > obj.x && x < obj.x + obj.width && y > obj.y && y < obj.y + obj.height) {

            ctx.strokeStyle = "red"
            ctx.lineWidth = 3
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)

            let text = obj.name + " (" + obj.confidence + ") : " + obj.description

            document.getElementById("description").innerText = text

            if (voiceEnabled) {
                window.speechSynthesis.cancel()
                let speech = new SpeechSynthesisUtterance(obj.description)
                window.speechSynthesis.speak(speech)
            }
        }
    })
})

function describeImage() {
    let names = [...new Set(objects.map(o => o.name))]
    let text = "This image contains " + names.join(", ")

    document.getElementById("imageDescription").innerText = text

    if (voiceEnabled) {
        window.speechSynthesis.cancel()
        let speech = new SpeechSynthesisUtterance(text)
        window.speechSynthesis.speak(speech)
    }
}
