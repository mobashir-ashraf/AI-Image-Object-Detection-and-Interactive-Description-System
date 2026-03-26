let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

let objects = []
let img = new Image()

let input = document.getElementById("imageInput")

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

    if (objects.error) {
        document.getElementById("loader").classList.add("hidden")
        document.getElementById("error").innerText = objects.error
        return
    }

    drawBoxes()
}

function drawBoxes() {
    ctx.drawImage(img, 0, 0)
    objects.forEach(obj => {
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
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

            document.getElementById("description").innerText =
                obj.name + " (" + obj.confidence + ") : " + obj.description

            let speech = new SpeechSynthesisUtterance(obj.description)
            window.speechSynthesis.speak(speech)
        }
    })
})

function describeImage() {
    let names = [...new Set(objects.map(o => o.name))]
    let text = "This image contains " + names.join(", ")
    document.getElementById("imageDescription").innerText = text

    let speech = new SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(speech)
}
