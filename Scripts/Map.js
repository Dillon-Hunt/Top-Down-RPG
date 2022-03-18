class Map {
    constructor(config) {
        this.world = null
        this.gameObjects = config.gameObjects
        this.actionSpaces = config.actionSpaces || [] // To Do
        this.walls = config.walls || {}

        this.upperImage = new Image()
        this.upperImage.src = "/Assets/Scenes/DemoSceneOne.png"

        this.tiles = config.tiles

        this.paused = false
    }

    drawTiles(context, cameraFocus, layer, barrierImage, grassImage, pathImage) {
        /* console.log(utils.asGrid(13) - cameraFocus.position.x, utils.asGrid(8) - cameraFocus.position.y)
        context.drawImage(this.upperImage, utils.asGrid(13) - cameraFocus.position.x, utils.asGrid(8) - cameraFocus.position.y, 544 / 2, 320 / 2)
        /*  */
        
        let viewWidth = utils.asGrid(5)
        let viewHeight = utils.asGrid(2)

        Object.keys(this.tiles).forEach(key => {
            if (this.tiles[key].layer === layer) {
                let [ x, y ] = key.split("-")
                x = utils.asGrid(parseInt(x))
                y = utils.asGrid(parseInt(y))
                // Visualised if (x < context.canvas.width + cameraFocus.position.x - viewWidth - 100 && x > cameraFocus.position.x - viewWidth + 100 && y < context.canvas.height + cameraFocus.position.y - 100 && y > cameraFocus.position.y - viewHeight + 10) {
                if (x < context.canvas.width + cameraFocus.position.x - viewWidth  && x > cameraFocus.position.x - viewWidth - 32 && y < context.canvas.height + cameraFocus.position.y && y > cameraFocus.position.y - viewHeight - 32) {
                    //let tileImage = new Image()
                    //tileImage.src = this.tiles[key].src
                    let tileImage = null
                    switch (this.tiles[key].type) {
                        case 'barrier':
                            tileImage = barrierImage
                            break
                        case 'grass':
                            tileImage = grassImage
                            break
                        case 'path':
                            tileImage = pathImage
                            break
                    }
                    context.drawImage(
                        tileImage, 
                        x - cameraFocus.position.x + viewWidth,
                        y - cameraFocus.position.y + viewHeight, 
                        32,
                        32
                        )
                }
            }
        })
    }

    spaceTaken(initialX, initialY, facing) {
        let {x, y} = utils.nextPosition(initialX, initialY, facing)

        let taken = false

        Object.keys(this.walls).forEach(key => {
            if (utils.asRegular(x) >= this.walls[key].startX && utils.asRegular(x) <= this.walls[key].endX) {
                if (utils.asRegular(y) <= this.walls[key].startY && utils.asRegular(y) >= this.walls[key].endY) {
                    taken = true
                }
            }
        })
        return taken
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key]
            object.mount(this)
        })
    }

    setWalls() {
        Object.keys(this.tiles).forEach(key => {
            if (this.tiles[key].type === "barrier") {
                let [ x, y ] = key.split("-")
                x = parseInt(x)
                y = parseInt(y)
                this.walls[key] = {
                    startX: x - 1 + 0.2,
                    endX: x + 1 - 0.2,
                    startY: y + 1 - 0.4,
                    endY: y - 1 + 0.15,
                }
            }
        })
    }

    addWall(x, y) {
        this.walls[`${x}-${y}`] = { startX: x, startY: y, endX: x, endY: y}
    }

    removeWall(x, y) {
        delete this.walls[`${x}-${y}`]
    }

    moveWall(initialX, initialY, facing) {
        this.removeWall(initialX, initialY)
        const {x, y} = utils.nextPosition(initialX, initialY, facing)
        this.addWall(x, y)
    }
}