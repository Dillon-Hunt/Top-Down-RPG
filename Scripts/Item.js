class Item extends GameObject {
    constructor(config) {
        super(config)

        this.data = config.data

        this.sprite.animations = {
            "idle":  [ [0, 0] ],
        }

        this.sprite.setAnimation(`idle`)
    }
}