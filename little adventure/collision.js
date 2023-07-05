import { Move } from './controls.js'

async function getCollisionsArray(file_path, tiles) {
    if (tiles < 0) {
        throw new Error('Please enter a positive number.')
    }

    const json_res = await fetch(file_path)
    const json_data = await json_res.json()

    const filtered_data = json_data.layers.find(layer => layer.name === 'Collisions')
    const data = filtered_data.data

    const collision_array = []
    let sub_array = []

    data.forEach(element => {
        sub_array.push(element)

        if (sub_array.length === tiles) {
            collision_array.push(sub_array)
            sub_array = []
        }
    })

    if (sub_array.length > 0) {
        collision_array.push(sub_array)
    }


    return collision_array
}

export const collisions = await getCollisionsArray('./pelletTown.json', 70)

export const collisionBlocks = []
const OFFSETS = { x: -700, y: -620 }

class CollisionsMap {
    static width = 12 * 4 // pixel size times zoom. This is size of one block
    static height = 12 * 4 // pixel size times zoom. This is size of one block
    constructor(position) {
        this.position = { x: position.x, y: position.y }
    }

    // only for debugging
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
            collisionBlocks.push(new CollisionsMap({ x: j * CollisionsMap.width + OFFSETS.x, y: i * CollisionsMap.height + OFFSETS.y }))
    })
})

export function collisionMechanics(player) {
    for (let i = 0; i < collisionBlocks.length; i++) {
        const collisionBlock = collisionBlocks[i]
        if (player.position.x + player.width - Move.x > collisionBlock.position.x && player.position.x - Move.x < collisionBlock.position.x + CollisionsMap.width && player.position.y + 30 - Move.y < collisionBlock.position.y + CollisionsMap.height && player.position.y - Move.y + player.height > collisionBlock.position.y) {
            //  collision to right && collision to left && collision to top && collision to bottom
            // add 30px to collison to top to reduce collision area of player
            console.log('colliding with block no: ' + i)
            // colliding = true
            // break
            return true
        }
    }
    return false
}
