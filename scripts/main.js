import * as THREE from 'three'
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';

// Constants
const ROTATION_SPEED = 1/180

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

const axesHelper = new THREE.AxesHelper(10)
axesHelper.position.set(-0.5, -0.5, -0.5)
scene.add(axesHelper)

// -- Floor --
// const flofronteo = new THREE.PlaneGeometry(5, 5)
// const floorMat = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide
// })
// const floor = new THREE.Mesh(flofronteo, floorMat)
// floor.rotation.x = Math.PI * 0.5
// floor.position.set(2, -0.5, 2)
// scene.add(floor)

// -* Functions *-
function getRandomColor() {
    return Math.random() * 16777215
}

function newCube(parent, color, x, y, z) {
    // Cube
    const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
    const cubeMat = new THREE.MeshBasicMaterial({
        color: color
    })
    const cube = new THREE.Mesh( cubeGeo, cubeMat )

    // Wireframe
    const wfGeo = new THREE.EdgesGeometry(cube.geometry)
    const wfMat = new THREE.LineBasicMaterial({
        color: 0x000000,
    })
    const wireframe = new THREE.LineSegments( wfGeo, wfMat )
    cube.add(wireframe)
    cube.position.set(x, y, z)
    cube.pieces = []
    cube.index = {
        x: x,
        y: y,
        z: z
    }
    parent.add(cube)
    return cube
}

function newGroup(parent, x, y, z) {
    const group = new THREE.Group()
    group.position.set(x, y, z)
    parent.add(group)
    return group
}

// -- Build Rubiks Cube --
const pieces = [] // []

// *- Generate pieces -*
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
            pieces.push(newCube(scene, getRandomColor(), i, j, k))
        }
    }
}

const side = {
    'left': newGroup(scene, 0, 1, 1),
    'down': newGroup(scene, 1, 0, 1),
    'back': newGroup(scene, 1, 1, 0),
    'right': newGroup(scene, 2, 1, 1),
    'up': newGroup(scene, 1, 2, 1),
    'front': newGroup(scene, 1, 1, 2)
}

// Turns
function turnRight() {
    pieces.forEach((piece) => {
        const pos = piece.position
        if (piece.position.x == 2) {
            piece.position.set(pos.x - 2, pos.y - 1, pos.z - 1)
            side.right.add(piece)
        }
    })
    turnRightAnimation()
}

function turnRightAnimation() {
    animationFrame = requestAnimationFrame(turnRightAnimation)
    if (rotation < Math.PI * 0.5) {
        side.right.rotation.x += -Math.PI * ROTATION_SPEED
        rotation += Math.PI * ROTATION_SPEED
    } else {
        cancelAnimationFrame(animationFrame)
        Array.from(side.right.children).forEach((piece) => {
            const pos = piece.position
            piece.position.set(pos.x + 2, pos.z + 1, -pos.y + 1)
            scene.add(piece)
        })
        side.right.rotation.x = 0
        rotation = 0
        animationFrame = 0
    }
}

function turnFront() {
    pieces.forEach((piece) => {
        const pos = piece.position
        if (piece.position.z == 2) {
            piece.position.set(pos.x - 1, pos.y - 1, pos.z - 2)
            side.front.add(piece)
        }
    })
    turnFrontAnimation()
}

function turnFrontAnimation() {
    animationFrame = requestAnimationFrame(turnFrontAnimation)
    if (rotation < Math.PI * 0.5) {
        side.front.rotation.z += -Math.PI * ROTATION_SPEED
        rotation += Math.PI * ROTATION_SPEED
    } else {
        cancelAnimationFrame(animationFrame)
        Array.from(side.front.children).forEach((piece) => {
            const pos = piece.position
            piece.position.set(pos.y + 1, -pos.x + 1, pos.z + 2)
            scene.add(piece)
        })
        side.front.rotation.z = 0
        rotation = 0
        animationFrame = 0
    }
}

function turnLeft() {
    pieces.forEach((piece) => {
        const pos = piece.position
        if (piece.position.x == 0) {
            piece.position.set(pos.x, pos.y - 1, pos.z - 1)
            side.left.add(piece)
        }
    })
    turnLeftAnimation()
}

function turnLeftAnimation() {
    animationFrame = requestAnimationFrame(turnLeftAnimation)
    if (rotation < Math.PI * 0.5) {
        side.left.rotation.x += Math.PI * ROTATION_SPEED
        rotation += Math.PI * ROTATION_SPEED
    } else {
        cancelAnimationFrame(animationFrame)
        Array.from(side.left.children).forEach((piece) => {
            const pos = piece.position
            piece.position.set(pos.x, -pos.z + 1, pos.y + 1)
            scene.add(piece)
        })
        side.left.rotation.x = 0
        rotation = 0
        animationFrame = 0
    }
}

function turnBack() {
    pieces.forEach((piece) => {
        const pos = piece.position
        if (piece.position.z == 0) {
            piece.position.set(pos.x - 1, pos.y - 1, pos.z)
            side.back.add(piece)
        }
    })
    turnBackAnimation()
}

function turnBackAnimation() {
    animationFrame = requestAnimationFrame(turnBackAnimation)
    if (rotation < Math.PI * 0.5) {
        side.back.rotation.z += Math.PI * ROTATION_SPEED
        rotation += Math.PI * ROTATION_SPEED
    } else {
        cancelAnimationFrame(animationFrame)
        Array.from(side.back.children).forEach((piece) => {
            const pos = piece.position
            piece.position.set(-pos.y + 1, pos.x + 1, pos.z)
            scene.add(piece)
        })
        side.back.rotation.z = 0
        rotation = 0
        animationFrame = 0
    }
}

function turnUp() {
    pieces.forEach((piece) => {
        const pos = piece.position
        if (piece.position.y == 2) {
            piece.position.set(pos.x - 1, pos.y - 2, pos.z - 1)
            side.up.add(piece)
        }
    })
    turnUpAnimation()
}

function turnUpAnimation() {
    animationFrame = requestAnimationFrame(turnUpAnimation)
    if (rotation < Math.PI * 0.5) {
        side.up.rotation.y -= Math.PI * ROTATION_SPEED
        rotation += Math.PI * ROTATION_SPEED
    } else {
        cancelAnimationFrame(animationFrame)
        Array.from(side.up.children).forEach((piece) => {
            const pos = piece.position
            piece.position.set(-pos.z + 1, pos.y + 2, pos.x + 1)
            scene.add(piece)
        })
        side.up.rotation.y = 0
        rotation = 0
        animationFrame = 0
    }
}

function turnDown() {
    pieces.forEach((piece) => {
        const pos = piece.position
        if (piece.position.y == 0) {
            piece.position.set(pos.x - 1, pos.y, pos.z - 1)
            side.down.add(piece)
        }
    })
    turnDownAnimation()
}

function turnDownAnimation() {
    animationFrame = requestAnimationFrame(turnDownAnimation)
    if (rotation < Math.PI * 0.5) {
        side.down.rotation.y += Math.PI * ROTATION_SPEED
        rotation += Math.PI * ROTATION_SPEED
    } else {
        cancelAnimationFrame(animationFrame)
        Array.from(side.down.children).forEach((piece) => {
            const pos = piece.position
            piece.position.set(pos.z + 1, pos.y, -pos.x + 1)
            scene.add(piece)
        })
        side.down.rotation.y = 0
        rotation = 0
        animationFrame = 0
    }
}

function controlManager(e) {
    if (animationFrame) return
    switch (e.key) {
        case 'a':
            turnLeft()
            break
        case 's':
            turnFront()
            break
        case 'd':
            turnBack()
            break
        case 'f':
            turnRight()
            break
        case 'j':
            turnUp()
            break
        case 'k':
            turnDown()
            break
    }
    // Reset grouping function
}

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()

renderer.render(scene, camera)