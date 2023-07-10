let convas
let ctx
let flowField
let requestAnimationFrameRef

let computedLength = 20
let cellSize = 15
let animationType = 'line'

window.onload = function () {
    canvas = document.querySelector('canvas')
    ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height)
    flowField.animate(0)
}

window.addEventListener('resize', () => {
    cancelAnimationFrame(requestAnimationFrameRef)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height)
    flowField.animate(0)
})

const mouse = {
    x: 0,
    y: 0
}

let modifier1 = 'cos'
let modifier2 = 'sin'

function modifier(modifier, angle) {
    let val
    switch (modifier) {
        case 'sin':
            val = Math.sin(angle)
            break
        case 'tan':
            val = Math.tan(angle)
            break
        case 'cos':
            val = Math.cos(angle)
            break
    }
    return val
}

window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e
    mouse.x = clientX
    mouse.y = clientY
})

class FlowFieldEffect {
    #ctx
    #width
    #height
    constructor(_ctx, _width, _height) {
        this.#ctx = _ctx
        this.#ctx.lineWidth = 1 // thicker line eat more cpu resourse
        this.#width = _width
        this.#height = _height
        this.lastTime = 0
        this.targetFps = 60
        this.interval = 1000 / this.targetFps
        this.timer = 0
        this.cellSize = cellSize // smaller value are more cpu intensive
        this.gradient
        this.#createGradient()
        this.#ctx.strokeStyle = this.gradient
        this.radius = 0
        this.vr = 0.03
    }
    #createGradient() {
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height)
        this.gradient.addColorStop("0.1", "#ff5c33")
        this.gradient.addColorStop("0.2", "#ff66b3")
        this.gradient.addColorStop("0.4", "#ccccff")
        this.gradient.addColorStop("0.6", "#b3ffff")
        this.gradient.addColorStop("0.8", "#80ff80")
        this.gradient.addColorStop("0.9", "#ffff33")
    }
    #draw(angle, _x, _y) {
        // enable these if you want to enable mouse interactions
        // const positionX = _x
        // const positionY = _y
        // const dx = mouse.x - positionX
        // const dy = mouse.y - positionY
        // const distance = dx * dx + dy * dy
        // let computedLength = distance * 0.0001

        const lineLength = computedLength //computedLength > 40 ? 40 : computedLength < 2 ? 2 : computedLength
        this.#ctx.beginPath()

        if (animationType === 'line') {
            // animate line
            this.#ctx.moveTo(_x, _y)
            this.#ctx.lineTo(_x + modifier(modifier1, angle) * lineLength, _y + modifier(modifier2, angle) * lineLength)
            // this.#ctx.lineTo(_x + Math.cos(angle) * lineLength, _y + Math.sin(angle) * lineLength)
        } else {
            // animate circle
            // this.#ctx.arc(_x, _y, 2, 0, 2 * Math.PI)
            this.#ctx.arc(_x + modifier(modifier1, angle) * lineLength, _y + modifier(modifier2, angle) * lineLength, 2, 0, 2 * Math.PI)
            // this.#ctx.arc(_x + Math.cos(angle) * lineLength, _y + Math.sin(angle) * lineLength, 2, 0, 2 * Math.PI)
        }

        this.#ctx.stroke()
        this.#ctx.closePath()
    }
    animate(timeStamp) {
        const deltaTime = timeStamp - this.lastTime
        this.lastTime = timeStamp
        if (this.timer > this.interval) {
            this.#ctx.clearRect(0, 0, this.#width, this.#height)
            this.radius += this.vr
            if (this.radius > 5 || this.radius < -5) this.vr *= -1
            for (let y = 0; y < this.#height; y += this.cellSize) {
                for (let x = 0; x < this.#width; x += this.cellSize) {
                    // play around with sin, cos and tan to get interesting patterns 
                    const angle = (Math.cos(x * 0.01) + Math.sin(y * 0.01)) * this.radius
                    this.#draw(angle, x, y)
                }
            }
            this.timer = 0
        } else {
            this.timer += deltaTime
        }
        requestAnimationFrameRef = requestAnimationFrame(this.animate.bind(this))
    }
}


// range slider
const range = document.getElementById('range')

range.addEventListener('input', (e) => {
    computedLength = rangeCalc(e, 1, 40)
})

const range2 = document.getElementById('range2')

range2.addEventListener('input', (e) => {
    cellSize = rangeCalc(e, 10, 20)
    cancelAnimationFrame(requestAnimationFrameRef)
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height)
    flowField.animate(0)
})

const scale = (num, in_min, in_max, out_min, out_max) => {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

function rangeCalc(e, startVal, endVal) {
    const value = +e.target.value
    const label = e.target.nextElementSibling

    const range_width = getComputedStyle(e.target).getPropertyValue('width')
    const label_width = getComputedStyle(label).getPropertyValue('width')

    const num_width = +range_width.substring(0, range_width.length - 2)
    const num_label_width = +label_width.substring(0, label_width.length - 2)

    const max = +e.target.max
    const min = +e.target.min

    const left = value * (num_width / max) - num_label_width / 2 + scale(value, min, max, 10, -10)
    label.style.left = `${left}px`


    const sValue = startVal + parseInt(value) * (endVal - startVal) * 0.01
    label.innerHTML = sValue.toFixed(1)
    return sValue
}

// switch
function switchHandler() {
    const form = document.querySelector('.switches-container')
    const formData = new FormData(form)

    const value = formData.get('select')
    animationType = value
    cancelAnimationFrame(requestAnimationFrameRef)
    flowField = new FlowFieldEffect(ctx, canvas.width, canvas.height)
    flowField.animate(0)
}

// drop down
function handleDropdown() {
    const form = document.querySelector('.dropdown-container')
    const formData = new FormData(form)
    const firstValue = formData.get('firstModifier')
    const secondValue = formData.get('secondModifier')
    if (firstValue)
        modifier1 = firstValue
    if (secondValue)
        modifier2 = secondValue

}