import * as THREE from 'three'

// Constants
const BLACK = 0x1b1c1c

// Functions
function createSide(parent, color, pos, rot) {
    const [x, y, z] = pos
    const [xr, yr, zr] = rot
    const sideGeometry = new THREE.PlaneGeometry(1, 1)
    const sideMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    })
    const side = new THREE.Mesh(sideGeometry, sideMaterial)
    side.position.set(x, y, z)
    side.rotation.set(xr, yr, zr)

    const wireframeGeometry = new THREE.EdgesGeometry(side.geometry)
    const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
    })
    side.add(new THREE.LineSegments(wireframeGeometry, wireframeMaterial))
    parent.add(side)
    return side
}

// Classes
class Center extends THREE.Group {
    constructor(color) {
        super()
        this.isCenter = true
        this.color = color
        this.side = createSide(this, color, [0, 0, 0.5], [0, 0, 0])
    }
}

class Edge extends THREE.Group {
    constructor(color) {
        super()
        this.isEdge = true
        this.color = color
        this.side = this.initSides()
    }

    initSides() {
        const side = [
            createSide(this, this.color[0], [0, 0, 0.5], [0, 0, 0]),
            createSide(this, this.color[1], [0, 0.5, 0], [Math.PI * 0.5, 0, 0]),
            createSide(this, BLACK, [0.5, 0, 0], [0, Math.PI * 0.5, 0]),
            createSide(this, BLACK, [-0.5, 0, 0], [0, Math.PI * 0.5, 0]),
            createSide(this, BLACK, [0, -0.5, 0], [Math.PI * 0.5, 0, 0]),
            createSide(this, BLACK, [0, 0, -0.5], [0, 0, 0]),
        ]
        return side
    }
}

class Corner extends THREE.Group {
    constructor(color) {
        super()
        this.isCorner = true
        this.color = color
        this.side = this.initSides()
    }

    initSides() {
        const side = [
            createSide(this, this.color[0], [0, 0, 0.5], [0, 0, 0]),
            createSide(this, this.color[1], [0, 0.5, 0], [Math.PI * 0.5, 0, 0]),
            createSide(this, this.color[2], [0.5, 0, 0], [0, Math.PI * 0.5, 0]),
            createSide(this, BLACK, [-0.5, 0, 0], [0, Math.PI * 0.5, 0]),
            createSide(this, BLACK, [0, -0.5, 0], [Math.PI * 0.5, 0, 0]),
            createSide(this, BLACK, [0, 0, -0.5], [0, 0, 0]),
        ]
        return side
    }
}

export { Center, Edge, Corner }