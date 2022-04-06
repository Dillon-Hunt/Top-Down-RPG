class DirectionInput {
    constructor() {
        this.heldDirections = []

        this.keys = {
            f: false
        }

        this.map = {
            "ArrowUp": "up",
            "ArrowDown": "down",
            "ArrowLeft": "left",
            "ArrowRight": "right",
            "KeyW": "up",
            "KeyS": "down",
            "KeyA": "left",
            "KeyD": "right",
        }
    }

    get direction() {
        if (this.heldDirections[1] === undefined) {
            return this.heldDirections[0]
        } else {
            let heldDirections = [this.heldDirections[0], this.heldDirections[1]]
            if (heldDirections.includes("up") && !heldDirections.includes("down")) {
                if (heldDirections.includes("left")) {
                    return "up-left"
                } else if (heldDirections.includes("right")) {
                    return "up-right"
                }
            }
            if (!heldDirections.includes("up") && heldDirections.includes("down")) {
                if (heldDirections.includes("left")) {
                    return "down-left"
                } else if (heldDirections.includes("right")) {
                    return "down-right"
                }
            }
            if ((heldDirections.includes("up") && heldDirections.includes("down")) || (heldDirections.includes("left") && heldDirections.includes("right"))) {
                return heldDirections[0]
            }
        }
    }

    get fKey() {
        return this.keys.f
    }

    init() {
        document.addEventListener("keydown", e => {
            const direction = this.map[e.code]
            if (direction && this.heldDirections.indexOf(direction) === -1) {
                this.heldDirections.unshift(direction)
            } else if (e.code === "KeyF") {
                this.keys.f = true
            }   
        })
        document.addEventListener("keyup", e => {
            const direction = this.map[e.code]
            const index = this.heldDirections.indexOf(direction)
            if (index > -1) {
                this.heldDirections.splice(index, 1)
            } else if (e.code === "KeyF") {
                this.keys.f = false
            }
        })
    }
}