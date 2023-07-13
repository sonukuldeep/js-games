const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let particlesArray = []

// handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
})

ctx.fillStyle = 'white'
ctx.font = '30px Verdana'
ctx.fillText('A', 0, 40)

const data = ctx.getImageData(0, 0, 100, 100)

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y
        this.size = 3
        this.baseX = this.x
        this.baseY = this.y
        this.density = (Math.random() * 30) + 1
    }

    draw() {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.closePath()
        ctx.fill()
    }
}


function inti() {
    particlesArray = []
    particlesArray.push(new Particle(50, 50))
}

inti()
console.log(particlesArray)