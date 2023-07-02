
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

const boundaries = []
export const collisions = await getCollisionsArray('./pelletTown.json', 70)

// class CollisionsMap {
//     static width = 12 * 4 // pixel size times zoom
//     static height = 12 * 4 // pixel size times zoom
//     constructor(position) {
//         this.position = { x: position.x, y: position.y }
//     }
// }

// collisions.forEach((row, i) => {
//     row.forEach((col, j) => {
//         if (col === 1025)
//         boundaries.push(new CollisionsMap({ position: { x: j * CollisionsMap.width, y: i * CollisionsMap.height } }))
//     })
// })

export default boundaries

