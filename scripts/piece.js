import * as THREE from 'three'

// Constants
const WHITE = 0xffffff
const RED = 0xc72033
const BLUE = 0x00a2ff 
const ORANGE = 0xffa500
const GREEN = 0x00ff00
const YELLOW = 0xffff00
const BLACK = 0x000000

// Helper Functions
const vec = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const rot = (x = 0, y = 0, z = 0) => new THREE.Euler(x, y, z)

function createSide(parent, color, pos, rot) {
    const sideGeometry = new THREE.PlaneGeometry(1, 1)
    const sideMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    })
    const side = new THREE.Mesh(sideGeometry, sideMaterial)
    side.rotation.set(rot.x, rot.y, rot.z)
    side.position.set(pos.x, pos.y, pos.z)

    const wireframeGeometry = new THREE.EdgesGeometry(side.geometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
    })
    side.add(new THREE.LineSegments(wireframeGeometry, wireframeMaterial))
    parent.add(side)
    return side
}

// Class
class Piece extends THREE.Group {
    constructor(colors = {white: false, red: false, blue: false, orange: false, green: false, yellow: false}) {
        super()
        this.colors = colors
        this.sides = this.initSides()
    }

    initSides() {
        return {
            positiveX: createSide(this, (this.colors.red)    ? RED    : BLACK, vec(0.5, 0, 0), rot(0, Math.PI * 0.5, 0)),
            negativeX: createSide(this, (this.colors.orange) ? ORANGE : BLACK, vec(-0.5, 0, 0), rot(0, Math.PI * 0.5, 0)),
            positiveY: createSide(this, (this.colors.yellow) ? YELLOW : BLACK, vec(0, 0.5, 0), rot(Math.PI * 0.5, 0, 0)),
            negativeY: createSide(this, (this.colors.white)  ? WHITE  : BLACK, vec(0, -0.5, 0), rot(Math.PI * 0.5, 0, 0)),
            positiveZ: createSide(this, (this.colors.blue)   ? BLUE   : BLACK, vec(0, 0, 0.5), rot()),
            negativeZ: createSide(this, (this.colors.green)  ? GREEN  : BLACK, vec(0, 0, -0.5), rot()),
        }
    }
}

export { Piece }