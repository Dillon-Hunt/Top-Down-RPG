class Player extends GameObject {
    constructor(config) {
        super(config)
        this.standing = false
        this.map = config.map
        this.actualPosition = {
            x: this.position.x,
            y: this.position.y
        }

        this.inventory = []

        this.directionUpdate = {
            "up": [["x", 0], ["y", -1]],
            "down": [["x", 0], ["y", 1]],
            "up-left": [["x", -1], ["y", -1]],
            "up-right": [["x", 1], ["y", -1]],
            "down-left": [["x", -1], ["y", 1]],
            "down-right": [["x", 1], ["y", 1]],
            "left": [["x", -1], ["y", 0]],
            "right": [["x", 1], ["y", 0]]
        }
    }
    
    update(state) {
        if (this.inventory.length != 0) {
            //console.log(this.inventory)
        }

        if (state.arrow && !state.map.paused) {
            this.updateCanvas = true
            this.startBehavior(state, {
                type: "walk",
                direction: state.arrow
            })
            this.updatePosition(state)
            this.updateSprite()

        } else {
            this.updateCanvas = true
        }

        if (this.updateCanvas) {
            this.updateSprite()
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
            // Walking
        }
    }

    updatePosition(state) {
        const [[xProperty, xChange], [yProperty, yChange]] = this.directionUpdate[this.position.facing]
        const nextX = Math.floor((this.position[xProperty] + xChange * state.delta) * 100) / 100
        const nextY = Math.floor((this.position[yProperty] + yChange * state.delta) * 100) / 100
        
        let spaceTaken = state.map.spaceTaken(nextX, nextY, this.position.facing, true)

        if (!spaceTaken.blocked) {
            this.position[xProperty] = nextX
            this.position[yProperty] = nextY
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