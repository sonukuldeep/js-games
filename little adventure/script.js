const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function ImageLoader(src) {
    const img = new Image()
    img.src = src
    return img
}

canvas.width = 1024
canvas.height = 576

const map = ImageLoader('/assets/images/PelletTown.png')
const player = ImageLoader('/assets/images/playerDown.png')

const mapPositionX = -700
const mapPositionY = -520

const playerWidth = player.width / 4
const playerHeight = player.height

const playerPositionX = canvas.width / 2
const playerPositionY = canvas.height / 2

player.onload = () => {
    ctx.drawImage(map, mapPositionX, mapPositionY)
    ctx.drawImage(player, 0, 0, playerWidth, playerHeight, playerPositionX, playerPositionY, playerWidth, playerHeight)
}