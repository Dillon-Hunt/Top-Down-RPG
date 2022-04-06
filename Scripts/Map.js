class Map {
    constructor(config) {
        this.world = null
        this.gameObjects = config.gameObjects
        this.actionSpaces = config.actionSpaces || [] // To Do
        this.walls = config.walls || {}
        this.remove = null

        this.eKey = false

        this.tiles = config.tiles

        this.paused = false
    }

    drawTiles(context, cameraFocus, layer, tilesetImage) {
        
        /* console.log(utils.asGrid(13) - cameraFocus.position.x, utils.asGrid(8) - cameraFocus.position.y)
        context.drawImage(this.upperImage, utils.asGrid(13) - cameraFocus.position.x, utils.asGrid(8) - cameraFocus.position.y, 544 / 2, 320 / 2)
        /*  */
        
        let viewWidth = utils.asGrid(5)
        let viewHeight = utils.asGrid(2)

        let tiles = Object.keys(this.tiles).filter(tile => ((tile.includes(layer)) && (utils.asGrid(this.tiles[tile].position.x) < context.canvas.width + cameraFocus.position.x - viewWidth)  && (utils.asGrid(this.tiles[tile].position.x) > cameraFocus.position.x - viewWidth - 32) && (utils.asGrid(this.tiles[tile].position.y) < context.canvas.height + cameraFocus.position.y) && (utils.asGrid(this.tiles[tile].position.y) > cameraFocus.position.y - viewHeight - 32)))

        tiles.forEach(tile => {
            context.drawImage(
                tilesetImage,
                this.tiles[tile].frame.x * 24, 
                this.tiles[tile].frame.y * 24,
                24, 
                24,
                this.tiles[tile].position.x * 24 - cameraFocus.position.x + viewWidth,
                this.tiles[tile].position.y * 24 - cameraFocus.position.y + viewHeight,
                24,
                24
            )
        })

        /* Object.keys(this.tiles).forEach(key => {
            if (this.tiles[key].layer === layer) {
                let [ x, y ] = key.split("-")
                x = utils.asGrid(parseInt(x))
                y = utils.asGrid(parseInt(y))
                // Visualised if (x < context.canvas.width + cameraFocus.position.x - viewWidth - 100 && x > cameraFocus.position.x - viewWidth + 100 && y < context.canvas.height + cameraFocus.position.y - 100 && y > cameraFocus.position.y - viewHeight + 10) {
                if (x < context.canvas.width + cameraFocus.position.x - viewWidth  && x > cameraFocus.position.x - viewWidth - 32 && y < context.canvas.height + cameraFocus.position.y && y > cameraFocus.position.y - viewHeight - 32) {
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
                        24,
                        24
                        )
                }
            }
        }) */
    }

    rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        // x, y, width, height, x2, y2, width2, height2
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2){
            return false;
        }
        return true;
    }

    spaceTaken(nextX, nextY, facing, player) {

        let boxCollider = [12, 10]

        let spaceTaken = {
            blocked: false,
            object: null
        }

        let {x, y} = { x: Math.floor(nextX), y: Math.floor(nextY) }

        //console.log(x, y)

        Object.values(this.gameObjects).forEach(object => {
            switch (object.type) {
                case "wall":
                    let objectX = Math.floor(object.position.x)
                    let objectY = Math.floor(object.position.y)

                    if (this.rectIntersect(x + boxCollider[0] / 2, y + boxCollider[1] / 2, 24 - boxCollider[0], 24 - boxCollider[1], objectX, objectY, 24, 24)) {
                        spaceTaken = {
                            blocked: true,
                            object: object
                        }
                    }
                    break
                default:
                    break
            }
        })

        /* let taken = "none"

        Object.keys(this.walls).forEach(key => {
            if (utils.asRegular(x) === this.walls[key].x && utils.asRegular(y) == this.walls[key].y) {
                taken = "wall"
            }
        })

        if (taken === "none") {
            Object.keys(this.gameObjects).forEach(key => {


                if (x === this.gameObjects[key].position.x  && y === this.gameObjects[key].position.y) {

                    if (this.gameObjects[key].type === "log" || this.gameObjects[key].type === "rock") {

                        if (this.gameObjects[key].moveable && this.gameObjects[key].directions.includes(facing)) {
                            
                            let logNext = utils.nextPosition(this.gameObjects[key].position.x, this.gameObjects[key].position.y, facing)

                            taken === "none" && Object.keys(this.gameObjects).forEach(key => {
                                if (logNext.x === this.gameObjects[key].position.x && logNext.y === this.gameObjects[key].position.y) {
                                    taken = "wall"
                                }
                            })

                            taken === "none" && Object.keys(this.walls).forEach(key => {
                                if (utils.asRegular(logNext.x) === this.walls[key].x && utils.asRegular(logNext.y) === this.walls[key].y) {
                                    taken = "wall"
                                }
                            })
        
                            if (taken != "wall") {
                                taken = "moveable"
                                this.gameObjects[key].beingMoved = true
                            }

                        } else if (this.gameObjects[key].breakable && player) {

                            this.gameObjects["player"].inventory.forEach(item => {
                                if (item.canBreak.includes(this.gameObjects[key].type) && item.durability > 0) {
                                    console.log("Player Destroys Log")
                                    item.durability--
                                    taken = "broken"
                                    setTimeout(() => {
                                        delete this.gameObjects[key]
                                    }, 100)
                                }
                            })
                            if (!taken.includes("broken")) {
                                taken = "wall"
                            }
                        } else {
                            taken = "wall"
                        }
                    } else if (this.gameObjects[key].type === "item" && player) {
                        console.log("Player Found A", this.gameObjects[key].data.name)
                        this.gameObjects["player"].inventory.push(this.gameObjects[key].data)
                        delete this.gameObjects[key]
                    } else if (this.gameObjects[key].type === "character" && player) {
                        console.log("Why Hello There")
                        taken = "wall"
                        this.paused = true
                        setTimeout(() => {
                            this.paused = false
                        }, 1000)
                    }
                } else {
                    if (this.gameObjects[key].type === "log") {
                        this.gameObjects[key].beingMoved = false
                    }
                }
            })
        } */

        return spaceTaken
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key]
            object.mount(this)
        })
    }
/* 
    setWalls() {
        Object.keys(this.tiles).forEach(key => {
            if (this.tiles[key].type === "barrier") {
                let [ x, y ] = key.split("-")
                x = parseInt(x)
                y = parseInt(y)
                this.walls[key] = {x, y}
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
    } */
}