class Map {
    constructor(config) {
        this.world = null
        this.gameObjects = config.gameObjects
        this.actionSpaces = config.actionSpaces || [] // To Do
        this.walls = config.walls || {}

        /* if (config.lowerSrc) {
            this.lowerImage = new Image()
            this.lowerImage.src = config.lowerSrc
        }

        if (config.upperSrc) {
            this.upperImage = new Image()
            this.upperImage.src = config.upperSrc
        } */

        this.tiles = config.tiles

        this.paused = false
    }

    drawBackground(context, cameraFocus) {
        Object.keys(this.tiles).forEach(key => {
            if (this.tiles[key].layer = "bottom") {
                let tileImage = new Image()
                tileImage.src = this.tiles[key].src
                let [ x, y ] = key.split("-")
                x = parseInt(x)
                y = parseInt(y)
                context.drawImage(
                    tileImage, 
                    utils.asGrid(x) - cameraFocus.position.x + utils.asGrid(9), 
                    utils.asGrid(y) - cameraFocus.position.y + utils.asGrid(4), 
                    16,
                    16
                    )
            }
        })
    }

    drawForeground(context, cameraFocus) {
        if (this.upperImage) {
            context.drawImage(this.upperImage, utils.asGrid(20) - cameraFocus.position.x, utils.asGrid(5) - cameraFocus.position.y, 272 * 2, 160 * 2)
        }
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

Window.maps = {
    DemoSceneOne: {
        id: "DemoSceneOne",
        lowerSrc: "/Assets/Scenes/DemoSceneOne-large.png",
        upperSrc: null,
        gameObjects: {
            player: new Person({
                playerControlled: true,
                position: {
                    x: 1,
                    y: 1,
                    facing: "Down",
                },
                src: "/Assets/Sprites/player-large.png"
            })
        },
        walls: {
            topLimit: {
                startX: -1, // Smaller
                endX: 17,   // Larger
                startY: -1, // Smaller
                endY: 0     // Larger
            },
            bottomLimit: {
                startX: 0,
                endX: 16,
                startY: 9,
                endY: 10
            },
            leftLimit: {
                startX: -1,
                endX: 0,
                startY: -1,
                endY: 9
            },
            rightLimit: {
                startX: 16,
                endX: 17,
                startY: 0,
                endY: 9
            },
            block: {
                startX: 5.5,
                endX: 7.5,
                startY: 4.5,
                endY: 5.5
            },
        }
    }
}