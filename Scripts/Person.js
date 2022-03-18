class Person extends GameObject {
    constructor(config) {
        super(config)
        this.remainingProgress = 0
        this.standing = false
        this.playerControlled = config.playerControlled || false

        this.directionUpdate = {
            "up": [["x", 0], ["y", -2]],
            "down": [["x", 0], ["y", 2]],
            "up-left": [["x", -1], ["y", -1]],
            "up-right": [["x", 1], ["y", -1]],
            "down-left": [["x", -1], ["y", 1]],
            "down-right": [["x", 1], ["y", 1]],
            "left": [["x", -2], ["y", 0]],
            "right": [["x", 2], ["y", 0]]
        }
    }

    update(state) {
        if (this.remainingProgress > 0) {
            this.updatePosition(state)
        } else {
            if (this.playerControlled && state.arrow && !state.map.paused) {
                this.updateCanvas = true
                this.startBehavior(state, {
                    type: "walk",
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

        if (behavior.type === "walk") {
            if (state.map.spaceTaken(this.position.x, this.position.y, this.position.facing)) {
                if (this.playerControlled) return;
                setTimeout(() => {
                    this.startBehavior(state, behavior)
                }, 10)
                return
            }

            state.map.moveWall(this.position.x, this.position.y, this.position.facing)
            this.remainingProgress = 8
            this.updateSprite()
        }
    }

    updatePosition(state) {
        const [[xProperty, xChange], [yProperty, yChange]] = this.directionUpdate[this.position.facing]
        this.position[xProperty] += xChange
        this.position[yProperty] += yChange
        this.remainingProgress -= 1

        if (this.remainingProgress === 0) {
            utils.emitEvent("WalkingComplete", {
                id: this.id
            })
        }
        if (!state.arrow) {
            this.updateSprite()
            this.updateCanvas = false
        }
    }

    updateSprite() {
        if (this.remainingProgress > 0) {
            this.sprite.setAnimation(`walk-${this.position.facing}`)
            return
        } else {
            this.sprite.setAnimation(`idle-${this.position.facing}`)
            this.updateCanvas = false
        }
    }
}