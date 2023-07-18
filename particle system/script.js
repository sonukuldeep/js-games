var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
// const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
// gradient.addColorStop(0, 'red')
// gradient.addColorStop(0.4, 'blue')
// gradient.addColorStop(0.5, 'green')
// gradient.addColorStop(0.6, 'yellow')
// gradient.addColorStop(1, 'violet')
// ctx.fillStyle = gradient
ctx.strokeStyle = 'white';
var fps = 30; // Frames per second
var interval = 1000 / fps; // Interval between frames in milliseconds
var lastTime = 0;
window.addEventListener('resize', function () {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
});
var Particle = /** @class */ (function () {
    function Particle(effect) {
        this.effect = effect;
        this.radius = 5 + Math.random() * 20;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = ((Math.random() * 20) - 10) / this.radius;
        this.vy = ((Math.random() * 20) - 10) / this.radius;
        this.fillColorFactor = 360 / canvas.width;
    }
    Particle.prototype.draw = function (context) {
        context.fillStyle = "hsl(".concat(this.x * this.fillColorFactor, ", 100%, 50%)");
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        // context.stroke()
    };
    Particle.prototype.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        if ((this.x + this.radius) > this.effect.width || (this.x - this.radius) < 0)
            this.vx *= -1;
        if ((this.y + this.radius) > this.effect.height || (this.y - this.radius) < 0)
            this.vy *= -1;
    };
    return Particle;
}());
var Effect = /** @class */ (function () {
    function Effect(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 200;
        this.createParticle();
    }
    Effect.prototype.createParticle = function () {
        for (var index = 0; index < this.numberOfParticles; index++) {
            this.particles.push(new Particle(this));
        }
    };
    Effect.prototype.handleParticles = function (context) {
        this.particles.forEach(function (particle) {
            particle.draw(context);
            particle.update();
        });
    };
    Effect.prototype.connectParticles = function (context) {
        var maxDistance = 100;
        for (var a = 0; a < this.particles.length; a++) {
            for (var b = a; b < this.particles.length; b++) {
                var dx = this.particles[a].x - this.particles[b].x;
                var dy = this.particles[a].y - this.particles[b].y;
                var distance = Math.hypot(dx, dy);
                if (distance < maxDistance) {
                    context.save();
                    var opacity = 1 - distance / maxDistance;
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    };
    return Effect;
}());
var effect = new Effect(canvas);
function animation(timestamp) {
    // Calculate the time difference since the last frame
    var elapsedTime = timestamp - lastTime;
    // Proceed only if enough time has elapsed based on the desired frame rate
    if (elapsedTime > interval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // effect.connectParticles(ctx)
        effect.handleParticles(ctx);
        // Update your animation or game logic here
        // Render your animation or game state here
        // Update the last time to the current timestamp
        lastTime = timestamp;
    }
    // Request the next frame
    requestAnimationFrame(animation);
}
animation(0);
