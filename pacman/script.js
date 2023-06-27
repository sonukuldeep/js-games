const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

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
        this.radius = 15
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = 'yellow'
        context.fill()
        context.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x

        this.position.y += this.velocity.y
    }
}

class Ghost {
    constructor({ position, velocity, color = 'red', speed = 1 }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.previousCollisions = []
        this.speed = speed
        this.previousPath = ''
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = this.color
        context.fill()
        context.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x

        this.position.y += this.velocity.y
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
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

const boundries = []
const pallets = []
const player = new Player({ position: { x: Boundary.WIDTH + Boundary.WIDTH / 2, y: Boundary.HEIGHT + Boundary.HEIGHT / 2 }, velocity: { x: 0, y: 0 } })
const ghosts = [new Ghost({ position: { x: Boundary.WIDTH * 6 + Boundary.WIDTH / 2, y: Boundary.HEIGHT + Boundary.HEIGHT / 2 }, velocity: { x: 5, y: 0 } })]

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


const collisionDetection = (circle, rectangle) => (circle.position.y - circle.radius + circle.velocity.y <=
    rectangle.position.y + rectangle.height &&
    circle.position.x + circle.radius + circle.velocity.x >=
    rectangle.position.x &&
    circle.position.y + circle.radius + circle.velocity.y >=
    rectangle.position.y &&
    circle.position.x - circle.radius + circle.velocity.x <=
    rectangle.position.x + rectangle.width)


function animationLoop() {

    window.requestAnimationFrame(animationLoop)
    context.clearRect(0, 0, window.innerWidth, window.innerHeight)

    // handle movement
    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundries.length; i++) {
            if (collisionDetection({ ...player, velocity: { x: 0, y: -5 } }, boundries[i])) {
                player.velocity.y = 0
                break
            } else
                player.velocity.y = -5
        }
    }
    else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundries.length; i++) {
            if (collisionDetection({ ...player, velocity: { x: 0, y: 5 } }, boundries[i])) {
                player.velocity.y = 0
                break
            } else
                player.velocity.y = 5
        }
    }
    else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundries.length; i++) {
            if (collisionDetection({ ...player, velocity: { x: -5, y: 0 } }, boundries[i])) {
                player.velocity.x = 0
                break
            } else
                player.velocity.x = -5
        }
    }
    else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundries.length; i++) {
            if (collisionDetection({ ...player, velocity: { x: 5, y: 0 } }, boundries[i])) {
                player.velocity.x = 0
                break
            } else
                player.velocity.x = 5
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
    for (let index = pallets.length - 1; index > 0; index--) {
        const pallet = pallets[index];
        pallet.draw()

        if (Math.hypot(pallet.position.x - player.position.x, pallet.position.y - player.position.y) < pallet.radius + player.radius) {
            pallets.splice(index, 1)
            score += 1
            scoreElement.innerText = score
        }
    }

    // draw ghost
    ghosts.forEach(ghost => {
        ghost.update()
        const collisions = []

        boundries.forEach(boundary => {
            if (!collisions.includes('left') && collisionDetection({ ...ghost, velocity: { x: -5, y: 0 } }, boundary))
                collisions.push('left')
            if (!collisions.includes('right') && collisionDetection({ ...ghost, velocity: { x: 5, y: 0 } }, boundary))
                collisions.push('right')
            if (!collisions.includes('down') && collisionDetection({ ...ghost, velocity: { x: 0, y: 5 } }, boundary))
                collisions.push('down')
            if (!collisions.includes('up') && collisionDetection({ ...ghost, velocity: { x: 0, y: -5 } }, boundary))
                collisions.push('up')
        })

        // ghost.velocity.x = 0
        // ghost.velocity.y = 0

        // if (JSON.stringify(collisions) !== JSON.stringify(ghost.previousCollisions)) {
        //     const paths = ['right', 'left', 'up', 'down'].filter(path => !collisions.includes(path))
        //     const randomIndex = Math.floor(Math.random() * paths.length)
        //     ghost.previousCollisions = [...collisions]
        //     const smartPath = []
        //     if (paths.includes(ghost.previousPath)) {
        //         smartPath.push(ghost.previousPath)
        //     }
        //     smartPath.push(paths[randomIndex])
        //     const randomIndexAgain = Math.floor(Math.random() * smartPath.length)


        //     switch (smartPath[randomIndexAgain]) {
        //         case 'down':
        //             ghost.velocity.y = 1 * ghost.speed
        //             ghost.previousPath = 'down'
        //             break
        //         case 'up':
        //             ghost.velocity.y = -1 * ghost.speed
        //             ghost.previousPath = 'up'
        //             break
        //         case 'right':
        //             ghost.velocity.x = 1 * ghost.speed
        //             ghost.previousPath = 'right'
        //             break
        //         case 'left':
        //             ghost.velocity.x = -1 * ghost.speed
        //             ghost.previousPath = 'left'
        //             break
        //     }

        // } else {
        //     switch (ghost.previousPath) {
        //         case 'down':
        //             ghost.velocity.y = 1 * ghost.speed
        //             break
        //         case 'up':
        //             ghost.velocity.y = -1 * ghost.speed
        //             break
        //         case 'right':
        //             ghost.velocity.x = 1 * ghost.speed
        //             break
        //         case 'left':
        //             ghost.velocity.x = -1 * ghost.speed
        //             break
        //     }
        // }



        if (collisions.length > ghost.previousCollisions.length)
            ghost.previousCollisions = [...collisions]

        if (JSON.stringify(collisions) !== JSON.stringify(ghost.previousCollisions)) {
            if (ghost.velocity.x > 0 && !ghost.previousCollisions.includes('right')) ghost.previousCollisions.push('right')
            else if (ghost.velocity.x < 0 && !ghost.previousCollisions.includes('left')) ghost.previousCollisions.push('left')
            else if (ghost.velocity.y > 0 && !ghost.previousCollisions.includes('down')) ghost.previousCollisions.push('down')
            else if (ghost.velocity.y < 0 && !ghost.previousCollisions.includes('up')) ghost.previousCollisions.push('up')

            const pathways = ghost.previousCollisions.filter(path => !collisions.includes(path))
            const randomIndex = Math.floor(Math.random() * pathways.length)
            const direction = pathways[randomIndex]

            ghost.velocity.x = 0
            ghost.velocity.y = 0
            switch (direction) {
                case 'up':
                    ghost.velocity.y = -5
                    break
                case 'down':
                    ghost.velocity.y = 5
                    break
                case 'left':
                    ghost.velocity.x = -5
                    break
                case 'right':
                    ghost.velocity.x = 5
                    break
            }

            ghost.previousCollisions = []

        }

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