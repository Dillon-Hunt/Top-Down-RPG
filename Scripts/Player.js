class Player extends GameObject {
    constructor(config) {
        super(config)
        this.remainingProgress = 0
        this.preDelay = 0
        this.postDelay = 0
        this.standing = false
        this.map = config.map

        this.inventory = []

        this.directionUpdate = {
            "up": [["x", 0], ["y", -1]],
            "down": [["x", 0], ["y", 1]],
            "left": [["x", -1], ["y", 0]],
            "right": [["x", 1], ["y", 0]]
        }
    }

    update(state) {
        if (this.inventory.length != 0) {
            //console.log(this.inventory)
        }

        if (this.remainingProgress > 0 || this.preDelay > 0 || this.postDelay > 0) {
            this.updatePosition(state)
        } else {
            if (state.arrow && !state.map.paused) {
                this.updateCanvas = true
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                })
                this.updateSprite()
            } else {
                this.updateCanvas = true
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
            let taken = state.map.spaceTaken(this.position.x, this.position.y, this.position.facing, true)
            
            if (taken === "wall") {
                this.updateSprite()
                return
            }

            state.map.moveWall(this.position.x, this.position.y, this.position.facing)

            this.remainingProgress = 16

            if (taken === "moveable") {
                this.preDelay = 3
                this.postDelay = this.preDelay
            }

            if (taken === "broken") {
                this.postDelay = 10
            }

            this.updateSprite()
        }
    }

    updatePosition(state) {

        if (this.preDelay <= 0 && this.remainingProgress != 0) {
            const [[xProperty, xChange], [yProperty, yChange]] = this.directionUpdate[this.position.facing]
            this.position[xProperty] += xChange
            this.position[yProperty] += yChange
            this.remainingProgress -= 1
        } else {
            this.preDelay--
        }


        if (this.remainingProgress === 0) {
            if (this.postDelay === 0) {
                utils.emitEvent("WalkingComplete", {
                    id: this.id
                })
            } else {
                this.postDelay--
            }
            return
        }
    }

    updateSprite() {
        if (this.remainingProgress > 0) {
            this.sprite.setAnimation(`walk-${this.position.facing}`)
        } else {
            this.sprite.setAnimation(`idle-${this.position.facing}`)
            this.updateCanvas = true
        }
    }
}