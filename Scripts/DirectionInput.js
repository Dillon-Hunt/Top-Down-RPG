class DirectionInput {
    constructor() {
        this.heldDirections = []

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
        return this.heldDirections[0]/* 
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
        } */
    }

    init() {
        document.addEventListener("keydown", e => {
            const direction = this.map[e.code]
            if (direction && this.heldDirections.indexOf(direction) === -1) {
                this.heldDirections.unshift(direction)
            }
        })
        document.addEventListener("keyup", e => {
            const direction = this.map[e.code]
            const index = this.heldDirections.indexOf(direction)
            if (index > -1) {
                this.heldDirections.splice(index, 1)
            }
        })
    }
}