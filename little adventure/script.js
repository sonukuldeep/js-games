import { Move as MOVE } from './controls.js';
import { collisionBlocks, collisionMechanics } from "./collision.js";

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576
const OFFSETS = { x: -700, y: -620 }
let FRAMERATE = 0
const FRAMERATELIMIT = 20

const mapSrc = '/assets/images/PelletTown.png'
const playerSrcDown = '/assets/images/playerDown.png'
const playerSrcLeft = '/assets/images/playerLeft.png'
const playerSrcRight = '/assets/images/playerRight.png'
const playerSrcUp = '/assets/images/playerUp.png'
const foreGround = '/assets/images/PelletTownForeground.png'

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
        this.position.x += MOVE.x
        this.position.y += MOVE.y
    }
}

class PlayerSprite extends Sprite {
    constructor(position, src) {
        super(position, src)
        this.width = 48 // set according to charater sprite
        this.height = 68 // set according to charater sprite
    }

}

// sprite objects
const map = new Sprite(OFFSETS, mapSrc)
const foreGroundMap = new Sprite(OFFSETS, foreGround)
const player = new PlayerSprite({ x: canvas.width / 2, y: canvas.height / 2 }, playerSrcDown)


let colliding
function movement() {

    colliding = collisionMechanics(player)

    let step = Math.floor(FRAMERATE / FRAMERATELIMIT) % 4
    if (MOVE.x < 0) {
        player.imageLoader(playerSrcRight)
    }
    else if (MOVE.x > 0) {
        player.imageLoader(playerSrcLeft)
    }
    else if (MOVE.y > 0) {
        player.imageLoader(playerSrcUp)
    }
    else if (MOVE.y < 0) {
        player.imageLoader(playerSrcDown)
    } else {
        step = 0
    }

    ctx.drawImage(map.image, map.position.x, map.position.y)
    if (!colliding) {
        map.updatePosition()
        foreGroundMap.updatePosition()
    }
    
    if (!colliding)
    collisionBlocks.forEach(boundary => {
        boundary.updatePosition(MOVE.x, MOVE.y)
        // boundary.draw()
    })
    
    ctx.drawImage(player.image, step * player.width, 0, player.width, player.height, player.position.x, player.position.y, player.width, player.height)
    
    ctx.drawImage(foreGroundMap.image, foreGroundMap.position.x, foreGroundMap.position.y)

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

