const utils = {
    asGrid(value) {
        return value * 24
    },
    asRegular(value) {
        return value / 24
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
            x -= 24
        } else if (facing === "right") {
            x += 24
        } else if (facing === "up") {
            y -= 24
        } else if (facing === "down") {
            y += 24
        } else if (facing === "up-left") {
            y -= 24
            x -= 24
        } else if (facing === "up-right") {
            y -= 24
            x += 24
        } else if (facing === "down-left") {
            y += 24
            x -= 24
        } else if (facing === "down-right") {
            y += 24
            x += 24
        }
        return { x, y }
    },
}