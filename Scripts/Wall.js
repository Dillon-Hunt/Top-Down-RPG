class Wall extends GameObject {
    constructor(config) {
        super(config)

        this.sprite.animations = {
            "default":  [ [0, 0] ],
        }

        this.sprite.animation = "default"
    }

    update(state) {
        
    }
}