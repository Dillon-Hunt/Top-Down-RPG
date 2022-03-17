class SaveState {
    constructor(config) {
        this.map = {
            id: "DemoSceneOne"
        }
        this.player = {
            position: {
                x: 0,
                y: 0,
                direction: "down"
            }
        }
        this.saveSlot = 1
    }

    save() {

    }

    getSaveFile() {
        const saveFile = window.localStorage.getItem(this.saveSlot.toString())
        return saveFile ? JSON.parse(saveFile) : null
    }

    load(saveFile) {
        if (saveFile) {
            this.map.id = saveFile.map.id
            this.player = {
                position: {
                    x: saveFile.player.position.x,
                    y: saveFile.player.position.y,
                    facing: saveFile.player.position.facing
                }
            }

            // Add in items and health etc.
        }
    }
}