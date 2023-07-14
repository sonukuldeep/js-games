const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const fps = 30
const interval = 1000 / fps
let lastTime = 0
let requestAnimationFrameRef
const particlesArray = []
const zoom = 10
const adjustPositionX = 2
const adjustPositionY = 5
const threads = 200

ctx.fillStyle = 'white'
ctx.font = '20px Verdana'
ctx.fillText('Cat meme', 0, 20)
const textCoordinates = ctx.getImageData(0, 0, 110, 30)
ctx.strokeStyle = 'white'
ctx.rect(0, 0, 110, 30)
ctx.stroke()

const mouse = {
    x: null,
    y: null,
    radius: 5000
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
})

window.addEventListener('resize', () => {
    cancelAnimationFrame(requestAnimationFrameRef)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    animate(0)
})

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y
        this.size = 3
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 1000) + 50
    }

    draw() {
        const distance = getDistance(this.baseX, this.baseY, this.x, this.y)
        const red = Math.random() * 255
        const green = Math.random() * 255
        const blue = Math.random() * 255
        const color = `rgba(${(new Uint8ClampedArray([red, green, blue, distance])).join()})`
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
    }

    update() {
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = 0.5 * (dx * dx + dy * dy)
        const forceDistanceX = dx / distance
        const forceDistanceY = dy / distance
        const maxDistance = mouse.radius
        const force = (maxDistance - distance) / maxDistance
        const distanceX = forceDistanceX * force * this.density
        const distanceY = forceDistanceY * force * this.density
        if (distance < mouse.radius) {
            this.x -= distanceX
            this.y -= distanceY
        }
        else {
            if (this.x !== this.baseX) {
                const dx = this.x - this.baseX
                this.x -= dx / 10
            }
            if (this.y !== this.baseY) {
                const dy = this.y - this.baseY
                this.y -= dy / 10
            }

        }
    }
}

function init() {
    let count = 3 // since every forth value in array is alpha channel
    for (let i = 0; i < textCoordinates.height; i++) {
        for (let j = 0; j < textCoordinates.width; j++) {
            if (textCoordinates.data[count] > 100) {
                const positionX = j + adjustPositionX
                const positionY = i + adjustPositionY
                particlesArray.push(new Particle(positionX * zoom, positionY * zoom))
            }
            count += 4
        }
    }
}

function animate(timestamp) {
    const elapsedTime = timestamp - lastTime
    if (elapsedTime > interval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].draw()
            particlesArray[i].update()
        }
        lastTime = timestamp
        connect()
    }
    requestAnimationFrameRef = requestAnimationFrame(animate)
}


function connect() {
    let opacityValue = 1
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const distance = getDistance(particlesArray[a].x, particlesArray[a].y, particlesArray[b].x, particlesArray[b].y)

            if (distance < threads) {
                opacityValue = 0.3
                ctx.strokeStyle = `rgba(255,255,255,${opacityValue})`
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
                ctx.stroke()
            }
        }

    }
}



/**
 * Description Get distance between two points.
 * (x1,y1) are co-ordinates of first point
 * (x2,y2) are co-ordinates of second point
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
function getDistance(x1, y1, x2, y2) {
    const dx = x1 - x2
    const dy = y1 - y2
    const distance = 0.5 * (dx * dx + dy * dy)
    return distance
}


init()

animate(0)

