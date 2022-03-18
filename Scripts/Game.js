class Game { 
    constructor(config) {
        this.map = null
    }

    createGameElements(container) {
        this.element = document.createElement('div')
        this.element.classList.add("Game")

        this.gameCanvas = document.createElement('canvas')
        this.gameCanvas.classList.add("game-canvas")
        this.gameCanvas.width = utils.asGrid(10)
        this.gameCanvas.height = utils.asGrid(5)
        this.context = this.gameCanvas.getContext("2d", { alpha: false })

        this.barrierImage = new Image()
        this.barrierImage.src = "/Assets/Tiles/barrier.png"
        this.grassImage = new Image()
        this.grassImage.src = "/Assets/Tiles/grass.png"
        this.pathImage = new Image()
        this.pathImage.src = "/Assets/Tiles/path.png"

        this.element.appendChild(this.gameCanvas)
        container.appendChild(this.element)
    }

    startGameLoop() {
        const step = () => {
            if (!this.map.paused) {

                Object.values(this.map.gameObjects).sort((a, b) => {
                    return a.y - b.y
                }).forEach(object => {
                    object.update({
                        arrow: this.directionInput.direction,
                        map: this.map
                    })
                })

                const cameraFocus = this.map.gameObjects.player

                if (cameraFocus.updateCanvas === undefined || cameraFocus.updateCanvas) {
                    this.context.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height)

                    this.map.drawTiles(this.context, cameraFocus, "bottom", this.barrierImage, this.grassImage, this.pathImage)
                    this.map.drawTiles(this.context, cameraFocus, "floor", this.barrierImage, this.grassImage, this.pathImage)

                    Object.values(this.map.gameObjects).forEach(object => {
                        object.sprite.draw(this.context, cameraFocus)
                    })

                    //this.map.drawTiles(this.context, cameraFocus, "top", this.barrierImage, this.grassImage, this.pathImage)
                }

                requestAnimationFrame(step)
                /* setTimeout(() => {
                    step()
                }, 1000 / 120) */
            }
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

        Object.values(configJSON.gameObjects).forEach(object => {
            // If type === "Character" <-- add in other game objects
            newConfig.gameObjects[object.id] = new Person({
                playerControlled: object.playerControlled,
                position: object.position,
                src: object.src
            })
        })

        Object.keys(configJSON.tiles).forEach(key => {
            newConfig.tiles[key] = configJSON.tiles[key]
        })

        this.map = new Map(newConfig)
        this.map.world = this
        this.map.setWalls()
        this.map.mountObjects()

        this.saveState.map.id = newConfig.id

        if (initialPlayerState) {
            this.map.gameObjects.player.position = { x: initialPlayerState.x, y: initialPlayerState.y, facing: initialPlayerState.facing }
        }

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