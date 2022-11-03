import * as THREE from 'three'
import { Piece } from './piece.js'

// Keybindings
const KEY = {
    R       : 'k',
    R_PRIME : 'j',
    L       : 'f',
    L_PRIME : 'd',
    U       : 'u',
    U_PRIME : 'r',
    D       : ',',
    D_PRIME : 'c',
    F       : 'm',
    F_PRIME : 'v',
    B       : 'e',
    B_PRIME : 'i',
    M       : 'h',
    M_PRIME : 'g',
    S       : 'y',
    S_PRIME : 't',
    E       : 'n',
    E_PRIME : 'b',
    X       : 'w',
    X_PRIME : 'q',
    Y       : 's',
    Y_PRIME : 'a',
    Z       : 'x',
    Z_PRIME : 'z',
}

// Helper Functions
const vec = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z)
const rot = (x = 0, y = 0, z = 0) => new THREE.Euler(x, y, z)
const group = (parent, pos) => {
    const group = new THREE.Group()
    group.position.set(pos.x, pos.y, pos.z)
    parent.add(group)
    return group
}

// Class
class RubiksCube {
    constructor({window = document, parent = undefined, offset = {x: -1, y: 0, z: -1}, key = KEY, rotationSpeed = Math.PI * 1/60}) {
        this.parent = parent
        this.window = window
        this.offset = offset
        this.pieces = this.initPieces()
        this.center = group(this.parent, vec(this.offset.x + 1, this.offset.y + 1, this.offset.z + 1))
        this.key = key
        this.rotationSpeed = rotationSpeed
        this.active = false
        this.keyQueue = []
        this.rotation = 0
        this.animationFrame = 0
    } 

    // Create all pieces
    initPieces() {
        let pieces = []
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                for (let z = 0; z < 3; z++) {
                    let piece = new Piece({
                        white: (y == 0) ? true : false,
                        red: (x == 2) ? true : false,
                        blue: (z == 2) ? true : false,
                        orange: (x == 0) ? true : false,
                        green: (z == 0) ? true : false,
                        yellow: (y == 2) ? true : false,
                    })
                    piece.position.set(this.offset.x + x, this.offset.y + y, this.offset.z + z)
                    this.parent.add(piece)
                    pieces.push(piece)
                }
            }
        }
        return pieces
    }

    // Set which axis to be rotated at and select which pieces to rotate
    setRotationAxes({
        x = { values: [this.offset.x, this.offset.x + 1, this.offset.x + 2], isSelected: false },
        y = { values: [this.offset.y, this.offset.y + 1, this.offset.y + 2], isSelected: false },
        z = { values: [this.offset.z, this.offset.z + 1, this.offset.z + 2], isSelected: false } 
    }, direction) {
        return [{x: x, y: y, z: z}, direction]
    }

    // Select pieces according to selected axis
    rotationSetup(axes, direction) {
        this.pieces.forEach(piece => {
            if (axes.x.values.includes(piece.position.x) && axes.y.values.includes(piece.position.y) && axes.z.values.includes(piece.position.z)) {
                // Set piece position relative to center of cube
                piece.position.set(piece.position.x - (this.offset.x + 1), piece.position.y - (this.offset.y + 1), piece.position.z - (this.offset.z + 1))
                this.center.add(piece)
            }
        })
        this.rotate(axes, direction)
    }

    // Rotation animation and computation
    rotate(axes, direction) {
        this.animationFrame = requestAnimationFrame(() => this.rotate(axes, direction))
        if (this.rotation < Math.PI * 0.5) {
            if (axes.x.isSelected) {
                this.center.rotation.x += this.rotationSpeed * direction
            } else if (axes.y.isSelected) {
                this.center.rotation.y += this.rotationSpeed * direction
            } else if (axes.z.isSelected) {
                this.center.rotation.z += this.rotationSpeed * direction
            }
            this.rotation += this.rotationSpeed
        } else {
            // Reset
            cancelAnimationFrame(this.animationFrame)
            Array.from(this.center.children).forEach((piece) => {
                piece.getWorldPosition(piece.position)
                piece.position.round()
                piece.getWorldQuaternion(piece.rotation)
                this.parent.add(piece)
            })
            this.center.rotation.set(0, 0, 0)
            this.rotation = 0
            this.animationFrame = 0
        }
    }

    // Keybindings
    controls(key) {
        let axes, direction
        switch (key) {
            case this.key.R:
                [axes, direction] = this.setRotationAxes({ x: {values: [this.offset.x + 2], isSelected: true }}, -1)
                break
            case this.key.R_PRIME:
                [axes, direction] = this.setRotationAxes({ x: {values: [this.offset.x + 2], isSelected: true }}, 1)
                break
            case this.key.L:
                [axes, direction] = this.setRotationAxes({ x: {values: [this.offset.x], isSelected: true }}, 1)
                break
            case this.key.L_PRIME:
                [axes, direction] = this.setRotationAxes({ x: {values: [this.offset.x], isSelected: true }}, -1)
                break
            case this.key.U:
                [axes, direction] = this.setRotationAxes({ y: {values: [this.offset.y + 2], isSelected: true }}, -1)
                break
            case this.key.U_PRIME:
                [axes, direction] = this.setRotationAxes({ y: {values: [this.offset.y + 2], isSelected: true }}, 1)
                break
            case this.key.D:
                [axes, direction] = this.setRotationAxes({ y: {values: [this.offset.y], isSelected: true }}, 1)
                break
            case this.key.D_PRIME:
                [axes, direction] = this.setRotationAxes({ y: {values: [this.offset.y], isSelected: true }}, -1)
                break
            case this.key.F:
                [axes, direction] = this.setRotationAxes({ z: {values: [this.offset.z + 2], isSelected: true }}, -1)
                break
            case this.key.F_PRIME:
                [axes, direction] = this.setRotationAxes({ z: {values: [this.offset.z + 2], isSelected: true }}, 1)
                break
            case this.key.B:
                [axes, direction] = this.setRotationAxes({ z: {values: [this.offset.z], isSelected: true }}, 1)
                break
            case this.key.B_PRIME:
                [axes, direction] = this.setRotationAxes({ z: {values: [this.offset.z], isSelected: true }}, -1)
                break
            case this.key.M:
                [axes, direction] = this.setRotationAxes({ x: {values: [this.offset.x + 1], isSelected: true }}, -1)
                break
            case this.key.M_PRIME:
                [axes, direction] = this.setRotationAxes({ x: {values: [this.offset.x + 1], isSelected: true }}, 1)
                break
            case this.key.S:
                [axes, direction] = this.setRotationAxes({ z: {values: [this.offset.z + 1], isSelected: true }}, -1)
                break
            case this.key.S_PRIME:
                [axes, direction] = this.setRotationAxes({ z: {values: [this.offset.z + 1], isSelected: true }}, 1)
                break
            case this.key.E:
                [axes, direction] = this.setRotationAxes({ y: {values: [this.offset.y + 1], isSelected: true }}, -1)
                break
            case this.key.E_PRIME:
                [axes, direction] = this.setRotationAxes({ y: {values: [this.offset.y + 1], isSelected: true }}, 1)
                break
            case this.key.X:
                [axes, direction] = this.setRotationAxes({ x: {values: [this.offset.x, this.offset.x + 1, this.offset.x + 2], isSelected: true }}, -1)
                break
            case this.key.X_PRIME:
                [axes, direction] = this.setRotationAxes({ x: {values: [this.offset.x, this.offset.x + 1, this.offset.x + 2], isSelected: true }}, 1)
                break
            case this.key.Y:
                [axes, direction] = this.setRotationAxes({ y: {values: [this.offset.y, this.offset.y + 1, this.offset.y + 2], isSelected: true }}, -1)
                break
            case this.key.Y_PRIME:
                [axes, direction] = this.setRotationAxes({ y: {values: [this.offset.y, this.offset.y + 1, this.offset.y + 2], isSelected: true }}, 1)
                break
            case this.key.Z:
                [axes, direction] = this.setRotationAxes({ z: {values: [this.offset.z, this.offset.z + 1, this.offset.z + 2], isSelected: true }}, -1)
                break
            case this.key.Z_PRIME:
                [axes, direction] = this.setRotationAxes({ z: {values: [this.offset.z, this.offset.z + 1, this.offset.z + 2], isSelected: true }}, 1)
                break
            default:
                break
        }
        if (axes && direction) this.rotationSetup(axes, direction)
    }

    // Pushes key into keyQueue
    pushKeyQueue(that, key) {
        if (that.keyQueue.length < 2) that.keyQueue.push(key)
    }

    // Pops key from keyQueue and executes it
    popKeyQueue() {
        if (this.keyQueue.length > 0) {
            this.controls(this.keyQueue[0])
            this.keyQueue.shift()
        }
    }

    // Update to do animation
    update() {
        if (this.animationFrame == 0 && this.keyQueue.length > 0) {
            this.popKeyQueue()
        }
    }

    // Toggle controls on/off
    toggle() {
        if (!this.active) {
            this.window.addEventListener('keypress', (e) => this.pushKeyQueue(this, e.key))
        } else {
            this.window.removeEventListener('keypress', RubiksCube.pushKeyQueue)
        }
    }
}

export { RubiksCube }