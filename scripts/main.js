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

const KEY = {
    R: 'k',
    R_PRIME: 'j',
    L: 'd',
    L_PRIME: 'f',
    U: 'u',
    U_PRIME: 'r',
    D: 'v',
    D_PRIME: 'm',
    F: 'n',
    F_PRIME: 'b',
    B: 'e',
    B_PRIME: 'i',
    M: 'h',
    M_PRIME: 'g'
}

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

// -- Helper Functions --
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

function setAxes({x = [0, 1, 2], y = [0, 1, 2], z = [0, 1, 2]}) {
    return {
        x: x,
        y: y,
        z: z,
    }
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
const SIDES = {
    'left'  : createGroup(scene, 0, 1, 1),
    'down'  : createGroup(scene, 1, 0, 1),
    'back'  : createGroup(scene, 1, 1, 0),
    'right' : createGroup(scene, 2, 1, 1),
    'up'    : createGroup(scene, 1, 2, 1),
    'front' : createGroup(scene, 1, 1, 2)
}

function rotate(s, axes, direction = false) {
    pieces.forEach((piece) => {
        let pos = piece.position
        if (axes.x.includes(pos.x) && axes.y.includes(pos.y) && axes.z.includes(pos.z)) {
            piece.position.set(pos.x - s.position.x, pos.y - s.position.y, pos.z - s.position.z)
            s.add(piece)
            console.log(s)
        }
    })
    doRotation(s, axes, direction)
}

function doRotation(s, axes, direction) {
    animationFrame = requestAnimationFrame(() => doRotation(s, axes, direction))
    if (rotation < R_ANGLE) {
        if (axes.x.length == 1) {
            s.rotation.x += PI * ROTATION_SPEED * direction
        } else if (axes.y.length == 1) {
            s.rotation.y += PI * ROTATION_SPEED * direction
        } else if (axes.z.length == 1) {
            s.rotation.z += PI * ROTATION_SPEED * direction
        }
        rotation += Math.PI * ROTATION_SPEED
    } else {
        reset(s)
    }
}

// Keybindings
function controlManager(e) {
    if (animationFrame) return
    switch (e.key) {
        case KEY.R:
            rotate(SIDES.right, setAxes({x: [2]}), -1)
            break
        case KEY.R_PRIME:
            rotate(SIDES.right, setAxes({x: [2]}), 1)
            break
        case KEY.L:
            rotate(SIDES.left, setAxes({x: [0]}), -1)
            break
        case KEY.L_PRIME:
            rotate(SIDES.left, setAxes({x: [0]}), 1)
            break
        case KEY.U:
            rotate(SIDES.up, setAxes({y: [2]}), -1)
            break
        case KEY.U_PRIME:
            rotate(SIDES.up, setAxes({y: [2]}), 1)
            break
        case KEY.D:
            rotate(SIDES.down, setAxes({y: [0]}), -1)
            break
        case KEY.D_PRIME:
            rotate(SIDES.down, setAxes({y: [0]}), 1)
            break
        case KEY.F:
            rotate(SIDES.front, setAxes({z: [2]}), -1)
            break
        case KEY.F_PRIME:
            rotate(SIDES.front, setAxes({z: [2]}), 1)
            break
        case KEY.B:
            rotate(SIDES.back, setAxes({z: [0]}), -1)
            break
        case KEY.B_PRIME:
            rotate(SIDES.back, setAxes({z: [0]}), 1)
            break
        case KEY.M:
            rotate(SIDES.left, setAxes({x: [1]}), -1)
            break
        case KEY.M_PRIME:
            rotate(SIDES.left, setAxes({x: [1]}), 1)
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