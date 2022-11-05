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

// Class
class KeyManager {
    constructor({key = KEY, offset}) {
        this.key = key
        this.offset = offset
    }

    // Manage key pressed
    pressed(key) {
        switch (key) {
            case this.key.R:
                return [{ x: {values: [this.offset.x + 2], isSelected: true }}, -1]
            case this.key.R_PRIME:
                return [{ x: {values: [this.offset.x + 2], isSelected: true }}, 1]
            case this.key.L:
                return [{ x: {values: [this.offset.x], isSelected: true }}, 1]
            case this.key.L_PRIME:
                return [{ x: {values: [this.offset.x], isSelected: true }}, -1]
            case this.key.U:
                return [{ y: {values: [this.offset.y + 2], isSelected: true }}, -1]
            case this.key.U_PRIME:
                return [{ y: {values: [this.offset.y + 2], isSelected: true }}, 1]
            case this.key.D:
                return [{ y: {values: [this.offset.y], isSelected: true }}, 1]
            case this.key.D_PRIME:
                return [{ y: {values: [this.offset.y], isSelected: true }}, -1]
            case this.key.F:
                return [{ z: {values: [this.offset.z + 2], isSelected: true }}, -1]
            case this.key.F_PRIME:
                return [{ z: {values: [this.offset.z + 2], isSelected: true }}, 1]
            case this.key.B:
                return [{ z: {values: [this.offset.z], isSelected: true }}, 1]
            case this.key.B_PRIME:
                return [{ z: {values: [this.offset.z], isSelected: true }}, -1]
            case this.key.M:
                return [{ x: {values: [this.offset.x + 1], isSelected: true }}, -1]
            case this.key.M_PRIME:
                return [{ x: {values: [this.offset.x + 1], isSelected: true }}, 1]
            case this.key.S:
                return [{ z: {values: [this.offset.z + 1], isSelected: true }}, -1]
            case this.key.S_PRIME:
                return [{ z: {values: [this.offset.z + 1], isSelected: true }}, 1]
            case this.key.E:
                return [{ y: {values: [this.offset.y + 1], isSelected: true }}, -1]
            case this.key.E_PRIME:
                return [{ y: {values: [this.offset.y + 1], isSelected: true }}, 1]
            case this.key.X:
                return [{ x: {values: [this.offset.x, this.offset.x + 1, this.offset.x + 2], isSelected: true }}, -1]
            case this.key.X_PRIME:
                return [{ x: {values: [this.offset.x, this.offset.x + 1, this.offset.x + 2], isSelected: true }}, 1]
            case this.key.Y:
                return [{ y: {values: [this.offset.y, this.offset.y + 1, this.offset.y + 2], isSelected: true }}, -1]
            case this.key.Y_PRIME:
                return [{ y: {values: [this.offset.y, this.offset.y + 1, this.offset.y + 2], isSelected: true }}, 1]
            case this.key.Z:
                return [{ z: {values: [this.offset.z, this.offset.z + 1, this.offset.z + 2], isSelected: true }}, -1]
            case this.key.Z_PRIME:
                return [{ z: {values: [this.offset.z, this.offset.z + 1, this.offset.z + 2], isSelected: true }}, 1]
            default:
                return []
        }
    }
}

export { KeyManager }