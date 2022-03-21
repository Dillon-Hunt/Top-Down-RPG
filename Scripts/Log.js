class Log extends GameObject {
    constructor(config) {
        super(config)
        this.remainingProgress = 0
        this.remainingDelay = 0
        this.standing = false
        this.moveable = config.moveable || false
        this.directions = config.directions
        this.beingMoved = false

        this.sprite.animations = {
            "idle-down":  [ [0, 0] ],
            "idle-right":  [ [0, 0] ],
            "idle-up":  [ [0, 0] ],
            "idle-left":  [ [0, 0] ],
            "rolling-down":  [ [0, 0] ],
            "rolling-right":  [ [0, 0] ],
            "rolling-up":  [ [0, 0] ],
            "rolling-left":  [ [0, 0] ],
        }

        this.directionUpdate = {
            "up": [["x", 0], ["y", -1]],
            "down": [["x", 0], ["y", 1]],/* 
            "up-left": [["x", -.7], ["y", -.7]],
            "up-right": [["x", .7], ["y", -.7]],
            "down-left": [["x", -.7], ["y", .7]],
            "down-right": [["x", .7], ["y", .7]], */
            "left": [["x", -1], ["y", 0]],
            "right": [["x", 1], ["y", 0]]
        }
    }

    update(state) {
        if (this.remainingProgress > 0) {
            this.updatePosition(state)
        } else {
            if (this.beingMoved && state.arrow && !state.map.paused) {
                this.beingMoved = false
                this.updateCanvas = true
                this.startBehavior(state, {
                    type: "pushed",
                    direction: state.arrow
                })
                this.updateSprite()
            }

            if (this.updateCanvas) {
                this.updateSprite()
            }
        }
    }


    startBehavior(state, behavior) {
        if (state.map.paused) {
            setTimeout(() => {
                this.startBehavior(state, behavior)
            }, 10)
            return
        }

        this.position.facing = behavior.direction

        if (behavior.type === "pushed") {
            state.map.moveWall(this.position.x, this.position.y, this.position.facing)
            this.remainingProgress = 16
            this.remainingDelay = 3
            this.updateSprite()
        }
    }

    updatePosition(state) {
        if (this.remainingDelay > 0) {
            this.remainingDelay--
            return
        }
        const [[xProperty, xChange], [yProperty, yChange]] = this.directionUpdate[this.position.facing]
        this.position[xProperty] += xChange
        this.position[yProperty] += yChange
        this.remainingProgress--

        if (this.remainingProgress === 0) {
            utils.emitEvent("RollingComplete", {
                id: this.id
            })
        }
    }

    updateSprite() {
        if (this.remainingProgress > 0) {
            this.sprite.setAnimation(`rolling-${this.position.facing}`)
            return
        } else {
            this.sprite.setAnimation(`idle-${this.position.facing}`)
            this.updateCanvas = false
        }
    }
}