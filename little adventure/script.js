const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
import { collisions } from "./collisionArray.js";

canvas.width = 1024
canvas.height = 576
const offsets = { x: -700, y: -620 }

const mapSrc = '/assets/images/PelletTown.png'
const playerSrcDown = '/assets/images/playerDown.png'
const playerSrcLeft = '/assets/images/playerLeft.png'
const playerSrcRight = '/assets/images/playerRight.png'
const playerSrcUp = '/assets/images/playerUp.png'

let FRAMERATE = 0
const FRAMERATELIMIT = 20
const boundaries = []

class CollisionsMap {
    static width = 12 * 4 // pixel size times zoom
    static height = 12 * 4 // pixel size times zoom
    constructor(position) {
        this.position = { x: position.x, y: position.y }
    }

    // draw() {
    //     ctx.fillStyle = 'red'
    //     ctx.fillRect(this.position.x, this.position.y, 48, 48)
    // }

    updatePosition(x, y) {
        this.position.x += x
        this.position.y += y
    }
}

collisions.forEach((row, i) => {
    row.forEach((col, j) => {
        if (col === 1025)
            boundaries.push(new CollisionsMap({ x: j * CollisionsMap.width + offsets.x, y: i * CollisionsMap.height + offsets.y }))
    })
})


class Sprite {
    constructor(position, src) {
        this.position = { x: position.x, y: position.y }
        this.image = new Image()
        this.move = { x: 0, y: 0 }
        this.imageLoader(src)
    }
    imageLoader(src) {
        this.image.src = src
    }

    updatePosition() {
        this.position.x += this.move.x
        this.position.y += this.move.y
    }
}

class PlayerSprite extends Sprite {
    static width = 48
    static height = 68
    constructor(position, src) {
        super(position, src)
    }

}

// sprite objects
const map = new Sprite(offsets, mapSrc)
const player = new PlayerSprite({ x: canvas.width / 2, y: canvas.height / 2 }, playerSrcDown)

// handle movement 
window.addEventListener('keydown', (e) => {
    e.preventDefault()
    switch (e.key) {
        case 'w':
        case 'ArrowUp':
            map.move.y = 1
            break
        case 'a':
        case 'ArrowLeft':
            map.move.x = 1
            break
        case 's':
        case 'ArrowDown':
            map.move.y = -1
            break
        case 'd':
        case 'ArrowRight':
            map.move.x = -1
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
            map.move.y = 0
            break
        case 'a':
        case 'ArrowLeft':
            map.move.x = 0
            break
        case 's':
        case 'ArrowDown':
            map.move.y = 0
            break
        case 'd':
        case 'ArrowRight':
            map.move.x = 0
            break
        default:
            console.log(e.key)
    }
})

function collisionMechanics() {
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (player.position.x + PlayerSprite.width - map.move.x > boundary.position.x && player.position.x - map.move.x < boundary.position.x + CollisionsMap.width && player.position.y - map.move.y < boundary.position.y + CollisionsMap.height && player.position.y - map.move.y + PlayerSprite.height > boundary.position.y) {
            console.log('colliding')
            colliding = true
            break
        }
    }
}

let colliding
function movement() {
    colliding = false

    collisionMechanics()

    let step = Math.floor(FRAMERATE / FRAMERATELIMIT) % 4
    if (map.move.x < 0) {
        player.imageLoader(playerSrcRight)
    }
    else if (map.move.x > 0) {
        player.imageLoader(playerSrcLeft)
    }
    else if (map.move.y > 0) {
        player.imageLoader(playerSrcUp)
    }
    else if (map.move.y < 0) {
        player.imageLoader(playerSrcDown)
    } else {
        step = 0
    }

    ctx.drawImage(map.image, map.position.x, map.position.y)
    if (!colliding) {
        map.updatePosition()
    }

    if (!colliding)
        boundaries.forEach(boundary => {
            boundary.updatePosition(map.move.x, map.move.y)
        })

    ctx.drawImage(player.image, step * PlayerSprite.width, 0, PlayerSprite.width, PlayerSprite.height, player.position.x, player.position.y, PlayerSprite.width, PlayerSprite.height)

    FRAMERATE++
}

// anmation loop
let animationID
function animation() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    movement()
    animationID = requestAnimationFrame(animation)
}

animation()

