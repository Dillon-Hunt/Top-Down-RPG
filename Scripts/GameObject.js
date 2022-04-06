class GameObject {
    constructor(config) {
        this.name = config.name
        this.type = config.type
        this.isMounted = false
        this.position = config.position || { x: 0, y: 0, facing: "down" }
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/Assets/Sprites/default.png",
            type: this.type
        })
    }

    mount(map) {
        this.isMounted = true
        /* map.addWall(this.x, this.y) */ // Perhaps Specify GameObject, can only pass through if player has a key... or make it a part of the GameObject

        // Do Behavior
    }

    update() {
        // Change Clothes ect
    }

    // doBehaviorEvent
}