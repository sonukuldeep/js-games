const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight
var GAMEFRAME = 0
var STAGGEREDFRAME = 20

class Boundary {
    static WIDTH = 40
    static HEIGHT = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.speed = 2
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.06
        this.rotation = 0
    }

    draw() {
        context.save()
        context.translate(this.position.x, this.position.y)
        context.rotate(this.rotation)
        context.translate(-this.position.x, -this.position.y)
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        context.fillStyle = 'yellow'
        context.lineTo(this.position.x, this.position.y)
        context.fill()
        context.closePath()
        context.restore()
    }

    update() {
        this.draw()
        this.updateRotation()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate
        this.radians += this.openRate
    }

    updateRotation() {
        if (this.velocity.x > 0) {
            this.rotation = 0
        } else if (this.velocity.x < 0) {
            this.rotation = Math.PI
        }
        if (this.velocity.y > 0) {
            this.rotation = Math.PI / 2
        } else if (this.velocity.y < 0) {
            this.rotation = 3 * Math.PI / 2
        }
    }
}

class Ghost {
    constructor({ position, velocity, image = ghostSprite(), speed = 1, variant = 0 }) {
        this.position = position
        this.velocity = velocity
        this.previousCollisions = []
        this.previousPath = ''
        this.scared = false
        this.speed = speed
        this.image = image
        this.radius = 16
        this.spriteSize = 16
        this.rotation = 0
        this.variant = variant

    }

    update() {
        let position = Math.floor(GAMEFRAME / STAGGEREDFRAME) % 2
        this.updateRotation()
        context.drawImage(this.image, (position + this.rotation) * this.spriteSize, this.variant * this.spriteSize, this.spriteSize, this.spriteSize, this.position.x - this.spriteSize, this.position.y - this.spriteSize, 35, 35)
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

    }

    updateRotation() {
        if (this.velocity.x > 0) {
            this.rotation = 0
        } else if (this.velocity.x < 0) {
            this.rotation = 2
        }
        if (this.velocity.y > 0) {
            this.rotation = 6
        } else if (this.velocity.y < 0) {
            this.rotation = 4
        }
    }

}

class Pallet {
    constructor({ position }) {
        this.position = position
        this.radius = 4
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'white'
        context.fill()
        context.closePath()
    }
}

class PowerUp {
    constructor({ position }) {
        this.position = position
        this.radius = 10
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'white'
        context.fill()
        context.closePath()
    }
}

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

function ghostSprite() {
    const image = new Image()
    image.src = '/moving-sprites/ghost-sprite.png'
    const sprite_width = 16
    const sprite_height = 16
    return image
}

const boundries = []
const pallets = []
const powerUp = []
const player = new Player({ position: { x: Boundary.WIDTH + Boundary.WIDTH / 2, y: Boundary.HEIGHT + Boundary.HEIGHT / 2 }, velocity: { x: 0, y: 0 } })
const ghosts = [new Ghost({ position: { x: Boundary.WIDTH * 6 + Boundary.WIDTH / 2, y: Boundary.HEIGHT + Boundary.HEIGHT / 2 }, velocity: { x: 2, y: 0 } }), new Ghost({ position: { x: Boundary.WIDTH * 6 + Boundary.WIDTH / 2, y: Boundary.HEIGHT * 5 + Boundary.HEIGHT / 2 }, velocity: { x: 2, y: 0 }, color: 'gray' })]

map.forEach((row, y) => {
    row.map((symbol, x) => {
        switch (symbol) {
            case '-':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeHorizontal.png') }))
                break
            case '|':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeVertical.png') }))
                break
            case '1':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeCorner1.png') }))
                break
            case '2':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeCorner2.png') }))
                break
            case '3':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeCorner3.png') }))
                break
            case '4':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeCorner4.png') }))
                break
            case 'b':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/block.png') }))
                break
            case '[':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/capLeft.png') }))
                break
            case ']':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/capRight.png') }))
                break
            case '_':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/capBottom.png') }))
                break
            case '^':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/capTop.png') }))
                break
            case '+':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeCross.png') }))
                break
            case '5':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeConnectorTop.png') }))
                break
            case '6':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeConnectorRight.png') }))
                break
            case '7':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeConnectorBottom.png') }))
                break
            case '8':
                boundries.push(new Boundary({ position: { x: Boundary.WIDTH * x, y: Boundary.HEIGHT * y }, image: createImage('/img/pipeConnectorLeft.png') }))
                break
            case '.':
                pallets.push(new Pallet({ position: { x: Boundary.WIDTH * x + Boundary.WIDTH / 2, y: Boundary.HEIGHT * y + Boundary.HEIGHT / 2 } }))
                break
            case 'p':
                powerUp.push(new PowerUp({ position: { x: Boundary.WIDTH * x + Boundary.WIDTH / 2, y: Boundary.HEIGHT * y + Boundary.HEIGHT / 2 } }))
                break
        }
    })
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

let lastKey = ''
let score = 0
const scoreElement = document.getElementById('score')


const collisionDetection = (circle, rectangle) => {
    const padding = Boundary.WIDTH / 2 - circle.radius - 1
    return ((circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding) &&
        (circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding) &&
        (circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding) &&
        (circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding))
}

let animationID
function animationLoop() {

    animationID = window.requestAnimationFrame(animationLoop)
    context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    GAMEFRAME += 1

    // handle movement
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundries.length; i++) {
            if (collisionDetection({ ...player, velocity: { x: 0, y: -1 * player.speed } }, boundries[i])) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -1 * player.speed
            }
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundries.length; i++) {
            if (collisionDetection({ ...player, velocity: { x: 0, y: 1 * player.speed } }, boundries[i])) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 1 * player.speed
            }
        }
    }
    else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundries.length; i++) {
            if (collisionDetection({ ...player, velocity: { x: -1 * player.speed, y: 0 } }, boundries[i])) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -1 * player.speed
            }
        }
    }
    else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundries.length; i++) {
            if (collisionDetection({ ...player, velocity: { x: 1 * player.speed, y: 0 } }, boundries[i])) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 1 * player.speed
            }
        }
    }


    // draw boundaries
    boundries.forEach(boundary => {
        boundary.draw()
        if (collisionDetection(player, boundary)) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    }
    )

    // draw player
    player.update()

    // draw pallets
    for (let index = pallets.length - 1; index >= 0; index--) {
        const pallet = pallets[index];
        pallet.draw()

        if (Math.hypot(pallet.position.x - player.position.x, pallet.position.y - player.position.y) < pallet.radius + player.radius) {
            pallets.splice(index, 1)
            score += 1
            scoreElement.innerText = score
        }
    }

    // draw powerup
    for (let index = powerUp.length - 1; index >= 0; index--) {
        const power = powerUp[index];
        power.draw()

        if (Math.hypot(power.position.x - player.position.x, power.position.y - player.position.y) < power.radius + player.radius) {
            powerUp.splice(index, 1)
            ghosts.forEach(ghost => {
                ghost.scared = true

                setTimeout(() => { ghost.scared = false }, 3000)
            })
        }
    }

    // eat ghost or die
    // for (let index = ghosts.length - 1; index >= 0; index--) {
    //     const ghost = ghosts[index]
    //     if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius) {
    //         if (ghost.scared) {
    //             ghosts.splice(index, 1)
    //         }
    //         else {
    //             cancelAnimationFrame(animationID)
    //             const para = document.createElement('h1')
    //             para.innerText = 'You lost'
    //             document.body.appendChild(para)
    //         }
    //     }
    // }

    // win
    if (pallets.length == 0 || ghosts.length == 0) {
        setTimeout(() => {

            cancelAnimationFrame(animationID)
            const para = document.createElement('h1')
            para.innerText = 'You won'
            document.body.appendChild(para)
        }, 100)
    }

    // draw ghost
    ghosts.forEach(ghost => {
        ghost.update()

        const collisions = []

        boundries.forEach(boundary => {
            if (!collisions.includes('left') && collisionDetection({ ...ghost, velocity: { x: -1 * ghost.speed, y: 0 } }, boundary))
                collisions.push('left')
            if (!collisions.includes('right') && collisionDetection({ ...ghost, velocity: { x: 1 * ghost.speed, y: 0 } }, boundary))
                collisions.push('right')
            if (!collisions.includes('down') && collisionDetection({ ...ghost, velocity: { x: 0, y: 1 * ghost.speed } }, boundary))
                collisions.push('down')
            if (!collisions.includes('up') && collisionDetection({ ...ghost, velocity: { x: 0, y: -1 * ghost.speed } }, boundary))
                collisions.push('up')
        })

        // ghost movement 1
        ghost.velocity.x = 0
        ghost.velocity.y = 0

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.previousCollisions)) {

            let paths = ['right', 'left', 'up', 'down'].filter(path => !collisions.includes(path))

            switch (ghost.previousPath) {
                case 'down':
                    paths = paths.filter(path => path !== 'up')
                    break
                case 'up':
                    paths = paths.filter(path => path !== 'down')
                    break
                case 'right':
                    paths = paths.filter(path => path !== 'left')
                    break
                case 'left':
                    paths = paths.filter(path => path !== 'right')
                    break
            }

            const randomIndex = Math.floor(Math.random() * paths.length)
            ghost.previousCollisions = [...collisions]

            switch (paths[randomIndex]) {
                case 'down':
                    ghost.velocity.y = 1 * ghost.speed
                    ghost.previousPath = 'down'
                    break
                case 'up':
                    ghost.velocity.y = -1 * ghost.speed
                    ghost.previousPath = 'up'
                    break
                case 'right':
                    ghost.velocity.x = 1 * ghost.speed
                    ghost.previousPath = 'right'
                    break
                case 'left':
                    ghost.velocity.x = -1 * ghost.speed
                    ghost.previousPath = 'left'
                    break
            }

        } else {
            switch (ghost.previousPath) {
                case 'down':
                    ghost.velocity.y = 1 * ghost.speed
                    break
                case 'up':
                    ghost.velocity.y = -1 * ghost.speed
                    break
                case 'right':
                    ghost.velocity.x = 1 * ghost.speed
                    break
                case 'left':
                    ghost.velocity.x = -1 * ghost.speed
                    break
            }
        }


        // ghost movement 2 // second mechanics of ghost movement
        // if (collisions.length > ghost.previousCollisions.length)
        //     ghost.previousCollisions = [...collisions]

        // if (JSON.stringify(collisions) !== JSON.stringify(ghost.previousCollisions)) {
        //     if (ghost.velocity.x > 0 && !ghost.previousCollisions.includes('right')) ghost.previousCollisions.push('right')
        //     else if (ghost.velocity.x < 0 && !ghost.previousCollisions.includes('left')) ghost.previousCollisions.push('left')
        //     else if (ghost.velocity.y > 0 && !ghost.previousCollisions.includes('down')) ghost.previousCollisions.push('down')
        //     else if (ghost.velocity.y < 0 && !ghost.previousCollisions.includes('up')) ghost.previousCollisions.push('up')

        //     const pathways = ghost.previousCollisions.filter(path => !collisions.includes(path))
        //     const randomIndex = Math.floor(Math.random() * pathways.length)
        //     const direction = pathways[randomIndex]

        //     ghost.velocity.x = 0
        //     ghost.velocity.y = 0
        //     switch (direction) {
        //         case 'up':
        //             ghost.velocity.y = -1 * ghost.speed
        //             break
        //         case 'down':
        //             ghost.velocity.y = 1 * ghost.speed
        //             break
        //         case 'left':
        //             ghost.velocity.x = -1 * ghost.speed
        //             break
        //         case 'right':
        //             ghost.velocity.x = 1 * ghost.speed
        //             break
        //     }

        //     ghost.previousCollisions = []

        // }

    })

}

animationLoop()



window.addEventListener('keydown', (e) => {
    e.preventDefault()
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
        case 'ArrowDown':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = true
            lastKey = 'd'
            break
        default:
            console.log(e.key)
    }
})

window.addEventListener('keyup', (e) => {
    e.preventDefault()
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            keys.w.pressed = false
            break
        case 'a':
        case 'ArrowLeft':
            keys.a.pressed = false
            break
        case 's':
        case 'ArrowDown':
            keys.s.pressed = false
            break
        case 'd':
        case 'ArrowRight':
            keys.d.pressed = false
            break
        default:
            console.log(e.key)
    }
})