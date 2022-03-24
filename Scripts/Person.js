class Person extends GameObject {
    constructor(config) {
        super(config)
        this.remainingProgress = 0
        this.remainingDelay = 0
        this.slashDelay = 0
        this.standing = false
        this.map = config.map

        if (this.playerControlled) {
            this.inventory = []
        }

        this.directionUpdate = {
            "up": [["x", 0], ["y", -1]],
            "down": [["x", 0], ["y", 1]],
            "up-left": [["x", -.7], ["y", -.7]],
            "up-right": [["x", .7], ["y", -.7]],
            "down-left": [["x", -.7], ["y", .7]],
            "down-right": [["x", .7], ["y", .7]],
            "left": [["x", -1], ["y", 0]],
            "right": [["x", 1], ["y", 0]]
        }
    }

    update(state) {
        if (this.remainingProgress > 0 || this.remainingDelay > 0) {
            this.updatePosition(state)
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

        if (behavior.type === "walk") {
            let taken = state.map.spaceTaken(this.position.x, this.position.y, this.position.facing, false)

            if (taken === "wall") {
                setTimeout(() => {
                    this.startBehavior(state, behavior)
                }, 10)
                return
            }

            state.map.moveWall(this.position.x, this.position.y, this.position.facing)
            this.remainingProgress = 16

            if (taken === "log") {
                this.remainingDelay = 5
            }

            this.updateSprite()
        }
    }

    updatePosition(state) {
        if (this.remainingProgress === 0) {
            this.remainingDelay--
            if (this.remainingDelay === 0) {
                utils.emitEvent("WalkingComplete", {
                    id: this.id
                })
            }
            return
        }

        const [[xProperty, xChange], [yProperty, yChange]] = this.directionUpdate[this.position.facing]
        this.position[xProperty] += xChange
        this.position[yProperty] += yChange
        this.remainingProgress -= 1
    }

    updateSprite() {
        if (this.slashDelay > 0) {
            this.sprite.setAnimation(`slash-${this.position.facing}`) // Change
        } else if (this.remainingProgress > 0) {
            this.sprite.setAnimation(`walk-${this.position.facing}`)
        } else {
            this.sprite.setAnimation(`idle-${this.position.facing}`)
            this.updateCanvas = true
        }
    }
}