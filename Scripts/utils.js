const utils = {
    asGrid(value) {
        return value * 16
    },
    asRegular(value) {
        return value / 16
    },
    emitEvent(name, detail) {
        const event = new CustomEvent(name, {
            detail
        })
        document.dispatchEvent(event)
    },
    nextPosition(initialX, initialY, facing) {
        let x = initialX
        let y = initialY
        if (facing === "left") {
            x -= 2
        } else if (facing === "right") {
            x += 2
        } else if (facing === "up") {
            y -= 2
        } else if (facing === "down") {
            y += 2
        } else if (facing === "up-left") {
            y -= 1
            x -= 1
        } else if (facing === "up-right") {
            y -= 1
            x += 1
        } else if (facing === "down-left") {
            y += 1
            x -= 1
        } else if (facing === "down-right") {
            y += 1
            x += 1
        }
        return { x, y }
    },
}