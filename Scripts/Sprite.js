class Sprite {
    constructor(config) {
        this.image = new Image
        this.image.src = config.src
        this.image.onload = () => {
            this.loaded = true
        }

        this.shadow = new Image
        this.shadow.src = "../Assets/Sprites/Shadow.png"
        this.shadow.onload = () => {
            this.shadowLoaded = true
        }

        this.type = config.type

        this.shadowOffset = 0

        switch (this.type) {
            case "character":
                this.shadowOffset = 3
                break
            case "log":
                this.shadowOffset = -2
                break
            case "rock":
                    this.shadowOffset = 2
                    break
            default:
                console.log("No Such Type")
                break
        }

        this.animations = config.animations || {
            "idle-down":  [ [2, 0] ],
            "idle-right": [ [4, 1] ],
            "idle-down-right": [ [4, 1] ],
            "idle-up-right": [ [4, 1] ],
            "idle-up":    [ [2, 2] ],
            "idle-left":  [ [1, 3] ],
            "idle-down-left":  [ [1, 3] ],
            "idle-up-left":  [ [1, 3] ],
            "walk-down":  [ [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [0, 0] ],
            "walk-right": [ [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [0, 1] ],
            "walk-down-right": [ [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [0, 1] ],
            "walk-up-right": [ [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [0, 1] ],
            "walk-up":    [ [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [0, 2] ],
            "walk-left":  [ [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [0, 3] ],
            "walk-down-left":  [ [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [0, 3] ],
            "walk-up-left":  [ [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [0, 3] ],
        }
        this.animation = config.animation || "idle-down"
        this.animationFrame = config.animationFrame || 0
        this.animationFrameLimit = config.animationFrameLimit || 6
        this.animationFrameProgress = this.animationFrameLimit

        this.gameObject = config.gameObject
    }

    get frame() {
        return this.animations[this.animation][this.animationFrame]
    }

    setAnimation(key) {
        if (this.animation != key) {
            this.animation = key
            this.animationFrame = 0
            this.animationFrameProgress = this.animationFrameLimit
        }
    }

    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress--
            return
        }

        this.animationFrameProgress = this.animationFrameLimit
        this.animationFrame++

        if (this.frame === undefined) {
            this.animationFrame = 0
        }
    }

    draw(context, cameraFocus) { 
        const x = this.gameObject.position.x - cameraFocus.position.x + utils.asGrid(5) + 0
        const y = this.gameObject.position.y - cameraFocus.position.y + utils.asGrid(2) - 5

        this.shadowLoaded && context.drawImage(this.shadow, x, y + this.shadowOffset)

        const [frameX, frameY] = this.frame

        this.loaded && context.drawImage( // Scaled Down
            this.image, 
            frameX * 16,
            frameY * 18,
            16,
            18,
            x,
            y,
            16,
            18
        )
        this.updateAnimationProgress()
    }
}