class Game { 
    constructor(config) {
        this.map = null

        this.delta = 0;
        this.getTime = typeof performance === 'function' ? performance.now : Date.now;
        this.lastUpdate = this.getTime();
        this.FRAME_DURATION = 1000 / 60;
    }

    createGameElements(container) {
        this.element = document.createElement('div')
        this.element.classList.add("Game")

        this.gameCanvas = document.createElement('canvas')
        this.gameCanvas.classList.add("game-canvas")
        this.gameCanvas.width = utils.asGrid(10)
        this.gameCanvas.height = utils.asGrid(5)
        this.context = this.gameCanvas.getContext("2d", { alpha: false })
        this.context.imageSmoothingEnabled = false

        this.tilesetImage = new Image()
        this.tilesetImage.src = "/Assets/Tiles/tileset.png"

        this.element.appendChild(this.gameCanvas)
        container.appendChild(this.element)
    }

    startGameLoop() {
        const step = () => {

            const now = this.getTime();
            this.delta = (now - this.lastUpdate) / this.FRAME_DURATION;
            this.lastUpdate = now;

            if (!this.map.paused) {

                this.map.fKey = this.directionInput.fKey

                Object.values(this.map.gameObjects).sort((a, b) => {
                    return a.y - b.y
                }).forEach(object => {
                    object.update({
                        delta: this.delta,
                        arrow: this.directionInput.direction,
                        map: this.map
                    })
                })

                const cameraFocus = this.map.gameObjects.player

                if (cameraFocus.updateCanvas === undefined || cameraFocus.updateCanvas) {
                    document.querySelector(".player-position").textContent = `x: ${cameraFocus.position.x}, y: ${cameraFocus.position.y}`
                    this.wasMoving = true

                    this.context.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height)

                    this.map.drawTiles(this.context, cameraFocus, "bottom", this.tilesetImage)
                    this.map.drawTiles(this.context, cameraFocus, "floor", this.tilesetImage)

                    Object.values(this.map.gameObjects).forEach(object => {
                        object.type != "player" && object.sprite.draw(this.context, cameraFocus)
                    })

                    this.map.gameObjects["player"].sprite.draw(this.context, cameraFocus)

                    //this.map.drawTiles(this.context, cameraFocus, "top", this.barrierImage, this.grassImage, this.pathImage)
                }
                /* setTimeout(() => {
                    step()
                }, 1000 / 120) */
            }

            requestAnimationFrame(step)
        }
        step()
    }

    bindHotKeys() {
        // Bind all keys
    }

    bindPlayerTriggers() {
        // Bind with playerWalkingComplete listener
    }

    async startMap(mapId, initialPlayerState) {
        let map = mapId
        let configJSON = await this.loadJSONData(map)
        
        let newConfig = {
            id: configJSON.id,
            gameObjects: {

            },
            tiles: {

            }
        }

        Object.keys(configJSON.gameObjects).forEach(object => {
            switch (configJSON.gameObjects[object].type) {
                case "player":
                    newConfig.gameObjects[object] = new Player({
                        name: configJSON.gameObjects[object].name,
                        type: configJSON.gameObjects[object].type,
                        playerControlled: configJSON.gameObjects[object].playerControlled,
                        position: configJSON.gameObjects[object].position,
                        src: configJSON.gameObjects[object].src,
                    })
                    break
                case "character":
                    newConfig.gameObjects[object] = new Person({
                        name: object.name,
                        type: object.type,
                        playerControlled: object.playerControlled,
                        position: object.position,
                        src: object.src,
                    })
                    break
                case "log":
                    newConfig.gameObjects[object] = new Log({
                        name: configJSON.gameObjects[object].name,
                        type: configJSON.gameObjects[object].type,
                        moveable: configJSON.gameObjects[object].moveable,
                        breakable: configJSON.gameObjects[object].breakable,
                        directions: configJSON.gameObjects[object].directions,
                        position: configJSON.gameObjects[object].position,
                        src: configJSON.gameObjects[object].src
                    })
                    break
                case "rock":
                    newConfig.gameObjects[object] = new Rock({
                        name: configJSON.gameObjects[object].name,
                        type: configJSON.gameObjects[object].type,
                        moveable: configJSON.gameObjects[object].moveable,
                        breakable: configJSON.gameObjects[object].breakable,
                        directions: configJSON.gameObjects[object].directions,
                        position: configJSON.gameObjects[object].position,
                        src: configJSON.gameObjects[object].src
                    })
                    break
                case "wall":
                    newConfig.gameObjects[object] = new Wall({
                        name: configJSON.gameObjects[object].name,
                        type: configJSON.gameObjects[object].type,
                        position: {
                            x: configJSON.gameObjects[object].position.x * 24,
                            y: configJSON.gameObjects[object].position.y * 24
                        },
                        src: "./Assets/Tiles/" + configJSON.gameObjects[object].name + ".png"
                    })
                    break
                default:
                    console.log("GameObject Type '" + object.type + "' Does Not Exist")
            }
        })

        // Testing
        /* newConfig.gameObjects["test-axe"] = new Item({
            type: "item",
            data: {
                name: "axe",
                canBreak: ["log"],
                level: "1",
                durability: 5
            },
            position: {
                x: 48,
                y: 64,
                direction: "down"
            },
            src: "/Assets/Items/Axe.png"
        })

        newConfig.gameObjects["test-pickaxe"] = new Item({
            type: "item",
            data: {
                name: "pickaxe",
                canBreak: ["rock"],
                level: "1",
                durability: 5
            },
            position: {
                x: 64,
                y: 64,
                direction: "down"
            },
            src: "/Assets/Items/Pickaxe.png"
        }) */

        Object.keys(configJSON.tiles).forEach(key => {
            newConfig.tiles[key] = configJSON.tiles[key]
        })

        this.map = new Map(newConfig)
        this.map.world = this
        /* this.map.setWalls() */
        this.map.mountObjects()

        this.saveState.map.id = newConfig.id

        if (initialPlayerState) {
            this.map.gameObjects.player.position = { x: initialPlayerState.x, y: initialPlayerState.y, facing: initialPlayerState.facing }
        }

        console.log(this.map.gameObjects)

        this.saveState.playerPosition = this.map.gameObjects.player.position
    }

    async loadJSONData(map) {
        let data = await fetch(`./Maps/${map}.json`).then(response => { return response.json() })
        return data
    }

    async init(container) {
        this.createGameElements(container)

        this.saveState = new SaveState()

        const saveFile = this.saveState.getSaveFile()
        let initialPlayerState = null

        if (saveFile) {
            this.saveState.load()
            initialPlayerState = this.saveState.player.position
        }

        await this.startMap(this.saveState.map.id, initialPlayerState)


        this.bindHotKeys()
        this.bindPlayerTriggers()

        this.directionInput = new DirectionInput()
        this.directionInput.init()

        this.startGameLoop()
    }
}