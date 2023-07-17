const canvas = document.querySelector('canvas')!
const ctx = canvas.getContext('2d')!
canvas.width = window.innerWidth
canvas.height = window.innerHeight
ctx.fillStyle = 'red'

var fps = 30; // Frames per second
var interval = 1000 / fps; // Interval between frames in milliseconds
var lastTime = 0;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

class Particle {
    x: number;
    y: number;
    radius: number;
    effect: Effect;

    constructor(effect: Effect) {
        this.effect = effect
        this.x = Math.random() * this.effect.width
        this.y = Math.random() * this.effect.height
        this.radius = 15
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        context.fill()
    }
}

class Effect {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    particles: Particle[];
    numberOfParticles: number;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.particles = []
        this.numberOfParticles = 20
        this.createParticle()
    }

    createParticle() {
        for (let index = 0; index < this.numberOfParticles; index++) {
            this.particles.push(new Particle(this))

        }
    }
    handleParticles(context: CanvasRenderingContext2D) {
        this.particles.forEach(particle => particle.draw(context))
    }
}

const effect = new Effect(canvas)
effect.handleParticles(ctx)

function animation(timestamp) {
  // Calculate the time difference since the last frame
  var elapsedTime = timestamp - lastTime;

  // Proceed only if enough time has elapsed based on the desired frame rate
  if (elapsedTime > interval) {
    // Update your animation or game logic here

    // Render your animation or game state here

    // Update the last time to the current timestamp
    lastTime = timestamp;
  }

  // Request the next frame
  requestAnimationFrame(animation);
}