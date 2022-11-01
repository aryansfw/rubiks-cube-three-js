// import * as THREE from '../../three.js'
import * as THREE from 'three'
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import * as PIECE from './piece.js'

// Constants
const ROTATION_SPEED = 1/60
const PI = Math.PI
const R_ANGLE = PI * 0.5
const WHITE = 0xffffff
const RED = 0xff0000
const BLUE = 0x0000ff
const ORANGE = 0xffa500
const GREEN = 0x00ff00
const YELLOW = 0xffff00

// Event Listeners
document.addEventListener('keypress', controlManager)

// Global variables
let animationFrame
let rotation = 0

// Three Javascript
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 4, 5)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setClearColor(0x2f3133)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls( camera, renderer.domElement )

// const axesHelper = new THREE.AxesHelper(10)
// axesHelper.position.set(-0.5, -0.5, -0.5)
// scene.add(axesHelper)

// -* Helper Functions *-
function vect3(x, y, z) {
    return new THREE.Vector3(x, y, z)
}

function euler(x, y, z) {
    return new THREE.Euler(x, y, z)
}

function createCenter(parent, color, pos, rot) { 
    const center = new PIECE.Center(color)
    center.position.set(pos.x, pos.y, pos.z)
    center.rotation.set(rot.x, rot.y, rot.z)
    parent.add(center)
    return center
}

function createEdge(parent, color, pos, rot) { 
    const edge = new PIECE.Edge(color)
    edge.position.set(pos.x, pos.y, pos.z)
    edge.rotation.set(rot.x, rot.y, rot.z)
    parent.add(edge)
    return edge
}

function createCorner(parent, color, pos, rot) { 
    const corner = new PIECE.Corner(color)
    corner.position.set(pos.x, pos.y, pos.z)
    corner.rotation.set(rot.x, rot.y, rot.z)
    parent.add(corner)
    return corner
}

function createGroup(parent, x, y, z) {
    const group = new THREE.Group()
    group.position.set(x, y, z)
    parent.add(group)
    return group
}

function reset(side) {
    cancelAnimationFrame(animationFrame)
    Array.from(side.children).forEach((piece) => {
        piece.getWorldPosition(piece.position)
        piece.position.round()
        piece.getWorldQuaternion(piece.rotation)
        scene.add(piece)
    })
    side.rotation.set(0, 0, 0)
    rotation = 0
    animationFrame = 0
    
}

// Building the rubik's cube
const pieces = [
    // Centers
    createCenter(scene, WHITE,  vect3(1, 0, 1), euler(R_ANGLE, 0, 0)),  // White
    createCenter(scene, RED,    vect3(2, 1, 1), euler(0, R_ANGLE, 0)),  // Red
    createCenter(scene, BLUE,   vect3(1, 1, 2), euler(0, 0, 0)),        // Blue
    createCenter(scene, ORANGE, vect3(0, 1, 1), euler(0, -R_ANGLE, 0)), // Orange
    createCenter(scene, GREEN,  vect3(1, 1, 0), euler(0, PI, 0)),       // Green
    createCenter(scene, YELLOW, vect3(1, 2, 1), euler(-R_ANGLE, 0, 0)), // Yellow
    
    // Edges
    createEdge(scene, [WHITE, RED],     vect3(2, 0, 1), euler(R_ANGLE, 0, -R_ANGLE)),  // White-Red
    createEdge(scene, [WHITE, BLUE],    vect3(1, 0, 2), euler(R_ANGLE, 0, 0)),         // White-Blue
    createEdge(scene, [WHITE, ORANGE],  vect3(0, 0, 1), euler(R_ANGLE, 0, R_ANGLE)),   // White-Orange
    createEdge(scene, [WHITE, GREEN],   vect3(1, 0, 0), euler(R_ANGLE, 0, PI)),        // White-Green
    createEdge(scene, [RED, BLUE],      vect3(2, 1, 2), euler(R_ANGLE, R_ANGLE, 0)),   // Red-Blue
    createEdge(scene, [RED, GREEN],     vect3(2, 1, 0), euler(-R_ANGLE, R_ANGLE, 0)),  // Red-Green
    createEdge(scene, [RED, YELLOW],    vect3(2, 2, 1), euler(0, R_ANGLE, 0)),         // Red-Yellow
    createEdge(scene, [BLUE, ORANGE],   vect3(0, 1, 2), euler(0, 0, R_ANGLE)),         // Blue-Orange
    createEdge(scene, [BLUE, YELLOW],   vect3(1, 2, 2), euler(0, 0, 0)),               // Blue-Yellow
    createEdge(scene, [ORANGE, GREEN],  vect3(0, 1, 0), euler(-R_ANGLE, -R_ANGLE, 0)), // Orange-Green
    createEdge(scene, [ORANGE, YELLOW], vect3(0, 2, 1), euler(0, -R_ANGLE, 0)),        // Orange-Yellow
    createEdge(scene, [GREEN, YELLOW],  vect3(1, 2, 0), euler(0, -PI, 0)),             // Green-Yellow

    // Corners
    createCorner(scene, [WHITE, BLUE, RED],     vect3(2, 0, 2), euler(R_ANGLE, 0, 0)),        // White-Blue-Red
    createCorner(scene, [WHITE, ORANGE, BLUE],  vect3(0, 0, 2), euler(R_ANGLE, 0, R_ANGLE)),  // White-Orange-Blue
    createCorner(scene, [WHITE, GREEN, ORANGE], vect3(0, 0, 0), euler(R_ANGLE, 0, PI)),       // White-Green-Orange
    createCorner(scene, [WHITE, RED, GREEN],    vect3(2, 0, 0), euler(R_ANGLE, 0, -R_ANGLE)), // White-Red-Green
    createCorner(scene, [BLUE, YELLOW, RED],    vect3(2, 2, 2), euler(0, 0, 0)),              // Blue-Yellow-Red
    createCorner(scene, [ORANGE, YELLOW, BLUE], vect3(0, 2, 2), euler(0, -R_ANGLE, 0)),       // Orange-Yellow-Blue
    createCorner(scene, [GREEN, YELLOW, ORANGE],vect3(0, 2, 0), euler(0, PI, 0)),             // Blue-Yellow-Red
    createCorner(scene, [RED, YELLOW, GREEN],   vect3(2, 2, 0), euler(0, R_ANGLE, 0)),        // Red-Yellow-Green
] 

// Create side groups
const side = {
    'left'  : createGroup(scene, 0, 1, 1),
    'down'  : createGroup(scene, 1, 0, 1),
    'back'  : createGroup(scene, 1, 1, 0),
    'right' : createGroup(scene, 2, 1, 1),
    'up'    : createGroup(scene, 1, 2, 1),
    'front' : createGroup(scene, 1, 1, 2)
}

// Rotation Functions
function rotateRight(isPrime = false) {
    pieces.forEach((piece) => {
        let pos = piece.position
        if (pos.x == 2) {
            piece.position.set(pos.x - 2, pos.y - 1, pos.z - 1)
            side.right.add(piece)
        }
    })
    rotateRightAnimation(isPrime)
}

function rotateRightAnimation(isPrime) {
    let sign = (isPrime) ? -1 : 1
    animationFrame = requestAnimationFrame(() => rotateRightAnimation(isPrime))
    if (rotation < R_ANGLE) {
        side.right.rotation.x += -Math.PI * ROTATION_SPEED * sign
        rotation += Math.PI * ROTATION_SPEED
    } else {
        reset(side.right)
    }
}

function rotateFront(isPrime = false) {
    pieces.forEach((piece) => {
        let pos = piece.position
        if (pos.z == 2) {
            piece.position.set(pos.x - 1, pos.y - 1, pos.z - 2)
            side.front.add(piece)
        }
    })
    rotateFrontAnimation(isPrime)
}

function rotateFrontAnimation(isPrime) {
    let sign = (isPrime) ? -1 : 1
    animationFrame = requestAnimationFrame(() => rotateFrontAnimation(isPrime))
    if (rotation < R_ANGLE) {
        side.front.rotation.z += -Math.PI * ROTATION_SPEED * sign
        rotation += Math.PI * ROTATION_SPEED
    } else {
        reset(side.front)
    }
}

function rotateLeft(isPrime = false) {
    pieces.forEach((piece) => {
        let pos = piece.position
        if (pos.x == 0) {
            piece.position.set(pos.x, pos.y - 1, pos.z - 1)
            side.left.add(piece)
        }
    })
    rotateLeftAnimation(isPrime)
}

function rotateLeftAnimation(isPrime) {
    let sign = (isPrime) ? -1 : 1
    animationFrame = requestAnimationFrame(() => rotateLeftAnimation(isPrime))
    if (rotation < R_ANGLE) {
        side.left.rotation.x += Math.PI * ROTATION_SPEED * sign
        rotation += Math.PI * ROTATION_SPEED
    } else {
        reset(side.left)
    }
}

function rotateBack(isPrime = false) {
    pieces.forEach((piece) => {
        let pos = piece.position
        if (pos.z == 0) {
            piece.position.set(pos.x - 1, pos.y - 1, pos.z)
            side.back.add(piece)
        }
    })
    rotateBackAnimation(isPrime)
}

function rotateBackAnimation(isPrime) {
    let sign = (isPrime) ? -1 : 1
    animationFrame = requestAnimationFrame(() => rotateBackAnimation(isPrime))
    if (rotation < R_ANGLE) {
        side.back.rotation.z += Math.PI * ROTATION_SPEED * sign
        rotation += Math.PI * ROTATION_SPEED
    } else {
        reset(side.back)
    }
}

function rotateUp(isPrime = false) {
    pieces.forEach((piece) => {
        let pos = piece.position
        if (pos.y == 2) {
            piece.position.set(pos.x - 1, pos.y - 2, pos.z - 1)
            side.up.add(piece)
        }
    })
    rotateUpAnimation(isPrime)
}

function rotateUpAnimation(isPrime) {
    let sign = (isPrime) ? -1 : 1
    animationFrame = requestAnimationFrame(() => rotateUpAnimation(isPrime))
    if (rotation < R_ANGLE) {
        side.up.rotation.y -= Math.PI * ROTATION_SPEED * sign
        rotation += Math.PI * ROTATION_SPEED
    } else {
        reset(side.up)
    }
}

function rotateDown(isPrime = false) {
    pieces.forEach((piece) => {
        let pos = piece.position
        if (pos.y == 0) {
            piece.position.set(pos.x - 1, pos.y, pos.z - 1)
            side.down.add(piece)
        }
    })
    rotateDownAnimation(isPrime)
}

function rotateDownAnimation(isPrime) {
    let sign = (isPrime) ? -1 : 1
    animationFrame = requestAnimationFrame(() => rotateDownAnimation(isPrime))
    if (rotation < R_ANGLE) {
        side.down.rotation.y += Math.PI * ROTATION_SPEED * sign
        rotation += Math.PI * ROTATION_SPEED
    } else {
        reset(side.down)
    }
}

// Keybindings
function controlManager(e) {
    if (animationFrame) return
    switch (e.key) {
        case 'a':
            rotateLeft()
            break
        case 'A':
            rotateLeft(true)
            break
        case 's':
            rotateFront()
            break
        case 'S':
            rotateFront(true)
            break
        case 'd':
            rotateBack()
            break
        case 'D':
            rotateBack(true)
            break
        case 'f':
            rotateRight()
            break
        case 'F':
            rotateRight(true)
            break
        case 'e':
            rotateUp()
            break
        case 'E':
            rotateUp(true)
            break
        case 'r':
            rotateDown()
            break
        case 'R':
            rotateDown(true)
            break
        default:
            break
    }
}

// Allow movement
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}
animate()