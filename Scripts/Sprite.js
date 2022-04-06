class Sprite {
    constructor(config) {
        this.image = new Image
        this.image.src = config.src
        this.image.onload = () => {
            this.loaded = true
        }

        this.type = config.type

        this.spriteOffset = 0
        this.shadowOffset = 0
        this.hasShadow = true

        switch (this.type) {
            case "player":
                this.spriteOffset = -5
                this.shadowOffset = 11
                break
            case "character":
                this.spriteOffset = -5
                this.shadowOffset = 3
                break
            case "log":
                this.spriteOffset = -5
                this.shadowOffset = 2
                break
            case "rock":
                this.spriteOffset = -5
                this.shadowOffset = 2
                break
            case "item":
                this.spriteOffset = 0
                this.hasShadow = false
                break
            case "wall":
                this.spriteOffset = 0
                this.hasShadow = false
                break
            default:
                console.log("No Such Type '" + this.type + "'")
                break
        }

        if (this.hasShadow) {
            this.shadow = new Image
            this.shadow.src = "../Assets/Sprites/Shadow.png"
            this.shadow.onload = () => {
                this.shadowLoaded = true
            }
        }

        this.animations = config.animations || {
            "idle-down":  [ [0, 3] ],
            "idle-right": [ [0, 0] ],
            "idle-down-right": [ [0, 0] ],
            "idle-up-right": [ [0, 0] ],
            "idle-up":    [ [0, 2] ],
            "idle-left":  [ [0, 1] ],
            "idle-down-left": [ [0, 1] ],
            "idle-up-left": [ [0, 1] ],
            "walk-down":  [ [1, 3], [2, 3], [3, 3], [4, 3] ],
            "walk-right": [ [1, 0], [2, 0], [3, 0], [4, 0] ],
            "walk-down-right": [ [1, 0], [2, 0], [3, 0], [4, 0] ],
            "walk-up-right": [ [1, 0], [2, 0], [3, 0], [4, 0] ],
            "walk-up":    [ [1, 2], [2, 2], [3, 2], [4, 2] ],
            "walk-left":  [ [1, 1], [2, 1], [3, 1], [4, 1] ],
            "walk-down-left": [ [1, 1], [2, 1], [3, 1], [4, 1] ],
            "walk-up-left": [ [1, 1], [2, 1], [3, 1], [4, 1] ],
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
        const x = this.gameObject.position.x - cameraFocus.position.x + utils.asGrid(5)
        const y = this.gameObject.position.y +- cameraFocus.position.y + utils.asGrid(2) + this.spriteOffset

        this.hasShadow && this.shadowLoaded && context.drawImage(this.shadow, x + 4, y + this.shadowOffset)

        const [frameX, frameY] = this.frame

        this.loaded && context.drawImage( // Scaled Down
            this.image, 
            frameX * 24,
            frameY * 24,
            24,
            24,
            x,
            y,
            24,
            24
        )
        this.updateAnimationProgress()
    }
}