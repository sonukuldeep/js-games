const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const fps = 30
const interval = 1000 / fps
let lastTime = 0
let requestAnimationFrameRef
const particlesArray = []
const zoom = 15
const adjustPositionX = 2
const adjustPositionY = -5

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

ctx.fillStyle = 'white'
ctx.font = '25px Verdana'
ctx.fillText('Cats', 0, 40)

const textCoordinates = ctx.getImageData(0, 0, 100, 100)

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
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
    }

    update() {
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const distance = (dx * dx + dy * dy) * 0.5
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


function inti() {
    const y2 = textCoordinates.height
    const x2 = textCoordinates.width
    for (let y = 0; y < y2; y++) {
        for (let x = 0; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width + (x * 4) + 3)] > 128) {
                const positionX = x + adjustPositionX
                const positionY = y + adjustPositionY
                particlesArray.push(new Particle(positionX * zoom, positionY * zoom))
            }
        }

    }
}

inti()

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

animate(0)

function connect() {
    let opacityValue = 1
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x
            const dy = particlesArray[a].y - particlesArray[b].y
            const distance = 0.5 * (dx * dx + dy * dy)

            if (distance < 350) {
                opacityValue = 0.2
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