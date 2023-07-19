const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
// const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
// gradient.addColorStop(0, 'red')
// gradient.addColorStop(0.4, 'blue')
// gradient.addColorStop(0.5, 'green')
// gradient.addColorStop(0.6, 'yellow')
// gradient.addColorStop(1, 'violet')
// ctx.fillStyle = gradient
ctx.strokeStyle = 'white'
const fps = 30; // Frames per second
const interval = 1000 / fps; // Interval between frames in milliseconds
let lastTime = 0;
let requestAnimationFrameRef = 0

const mouse = {
    x: -1,
    y: -1,
    radius: 120
}

window.addEventListener('resize', () => {
    cancelAnimationFrame(requestAnimationFrameRef)
    canvas.width = document.documentElement.clientWidth
    canvas.height = document.documentElement.clientHeight
    effect = new Effect(canvas)
    animation(0)
})

window.addEventListener('mousedown', (e) => {
    const { clientX, clientY } = e
    mouse.x = clientX
    mouse.y = clientY
})

window.addEventListener('mouseup', () => {
    mouse.x = -1
    mouse.y = -1
})

class Particle {
    x: number;
    y: number;
    radius: number;
    effect: Effect;
    vx: number;
    vy: number;
    force: number;
    pushX: number;
    pushY: number;
    friction: number;
    fillColorFactor: number;
    whale: Whale;
    count: number;

    constructor(effect: Effect) {
        this.effect = effect
        this.radius = Math.floor(5 + Math.random() * 10)
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2)
        this.vx = ((Math.random() * 20) - 25) / this.radius
        this.vy = ((Math.random() * 20) - 10) / this.radius
        this.force = 60 / (this.radius)
        this.pushX = 0
        this.pushY = 0
        this.friction = 0.98
        this.fillColorFactor = 360 / canvas.width
        this.whale = new Whale(effect.canvas)
        this.count = 0
    }

    draw(context: CanvasRenderingContext2D) {
        context.fillStyle = `hsl(${this.x * this.fillColorFactor}, 100%, 50%)`
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()

    }
    update(context: CanvasRenderingContext2D, x: number, y: number) {
        const dx = this.x - x
        const dy = this.y - y

        // context.beginPath()
        // context.arc(x, y, 120, 0, Math.PI * 2)
        // context.stroke()


        const distance = Math.hypot(dx, dy)
        if (distance < 120) {
            const angle = Math.atan2(dy, dx)
            this.pushX += Math.cos(angle) * this.force
            this.pushY += Math.sin(angle) * this.force
        }

        this.x += this.vx + this.pushX
        // this.y += this.vy + this.pushY

        // if ((this.x + this.radius) > this.effect.width || (this.x - this.radius) < 0) {
        //     this.x = this.x
        //     this.vx *= -1
        //     this.pushX *= -1
        // }

        if(this.x < -30) {
            this.x = this.effect.width + 30
        }
        if ((this.y + this.radius) > this.effect.height || (this.y - this.radius) < 0) {
            this.y = this.y
            this.vy *= -1
            this.pushY *= -1
        }

        this.pushX *= this.friction
        this.pushY *= this.friction
    }
}

class Effect {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    particles: Particle[];
    numberOfParticles: number;
    whale: Whale;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.particles = []
        this.numberOfParticles = 200
        this.createParticle()
        this.whale = new Whale(canvas)
    }

    createParticle() {
        for (let index = 0; index < this.numberOfParticles; index++) {
            this.particles.push(new Particle(this))

        }
    }
    handleParticles(context: CanvasRenderingContext2D) {
        // this.connectParticles(context)
        this.particles.forEach(particle => {
            particle.draw(context)
            const x = this.whale.x + 80
            const y = this.whale.y + 80 * Math.sin(this.whale.angle)
            particle.update(context, x, y)
        })
        this.whale.draw(context)
    }
    connectParticles(context: CanvasRenderingContext2D) {
        const maxDistance = 100
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x
                const dy = this.particles[a].y - this.particles[b].y
                const distance = Math.hypot(dx, dy)
                if (distance < maxDistance) {
                    context.save()
                    const opacity = 1 - distance / maxDistance
                    context.globalAlpha = opacity
                    context.beginPath()
                    context.moveTo(this.particles[a].x, this.particles[a].y)
                    context.lineTo(this.particles[b].x, this.particles[b].y)
                    context.stroke()
                    context.restore()
                }
            }

        }
    }
}

class Whale {
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;
    width: number;
    height: number;
    x: number;
    y: number;
    frame: number;
    maxFrame: number;
    angle: number;


    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.image = document.querySelector('#whale')!
        this.width = 420
        this.height = 285
        this.x = this.canvas.width * 0.2
        this.y = this.canvas.height * 0.5
        this.frame = 0
        this.maxFrame = 38
        this.angle = 0
 
    }
    draw(context: CanvasRenderingContext2D) {
        context.save()
        context.translate(this.x, this.y)
        context.rotate(Math.sin(this.angle))
        context.drawImage(this.image, this.frame * this.width, 0, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height)
        // context.beginPath()
        // context.arc(this.width / 2 - 100, 0, 120, 0, Math.PI * 2)
        // context.stroke()
        context.restore()
        this.y += Math.sin(this.angle)
        this.frame < this.maxFrame ? this.frame++ : this.frame = 0
        this.angle < (Math.PI * 2) ? this.angle += 0.01 : this.angle = 0.01
    }
}

let effect = new Effect(canvas)

function animation(timestamp) {
    // Calculate the time difference since the last frame
    var elapsedTime = timestamp - lastTime;

    // Proceed only if enough time has elapsed based on the desired frame rate
    if (elapsedTime > interval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        effect.handleParticles(ctx)
        // Update your animation or game logic here

        // Render your animation or game state here

        // Update the last time to the current timestamp

        lastTime = timestamp;
    }

    // Request the next frame
    requestAnimationFrameRef = requestAnimationFrame(animation);
}

animation(0)