const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const mapSrc = '/assets/images/PelletTown.png'
const playerSrcDown = '/assets/images/playerDown.png'
const playerSrcLeft = '/assets/images/playerLeft.png'
const playerSrcRight = '/assets/images/playerRight.png'
const playerSrcUp = '/assets/images/playerUp.png'

let FRAMERATE = 0
const FRAMERATELIMIT = 20

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
    constructor(position, src) {
        super(position, src)
        this.width = this.image.width / 4
        this.height = this.image.height
    }
}

// sprite objects
const map = new Sprite({ x: -700, y: -520 }, mapSrc)
const player = new PlayerSprite({ x: canvas.width / 2, y: canvas.height / 2 }, playerSrcDown)

// draw sprites
const drawImages = (step) => {
    ctx.drawImage(map.image, map.position.x, map.position.y)
    ctx.drawImage(player.image, step * player.width, 0, player.width, player.height, player.position.x, player.position.y, player.width, player.height)
}


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

window.addEventListener('keyup', () => {
    map.move.x = 0
    map.move.y = 0
})

function movement() {
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
    
    drawImages(step)
    map.updatePosition()

    FRAMERATE++
}

// anmation loop
let animationID
function animation() {
    movement()
    animationID = requestAnimationFrame(animation)
}

animation()

