var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'red';
var fps = 30; // Frames per second
var interval = 1000 / fps; // Interval between frames in milliseconds
var lastTime = 0;
window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
var Particle = /** @class */ (function () {
    function Particle(effect) {
        this.effect = effect;
        this.x = Math.random() * this.effect.width;
        this.y = Math.random() * this.effect.height;
        this.radius = 15;
    }
    Particle.prototype.draw = function (context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    };
    return Particle;
}());
var Effect = /** @class */ (function () {
    function Effect(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 20;
        this.createParticle();
    }
    Effect.prototype.createParticle = function () {
        for (var index = 0; index < this.numberOfParticles; index++) {
            this.particles.push(new Particle(this));
        }
    };
    Effect.prototype.handleParticles = function (context) {
        this.particles.forEach(function (particle) { return particle.draw(context); });
    };
    return Effect;
}());
var effect = new Effect(canvas);
effect.handleParticles(ctx);
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
