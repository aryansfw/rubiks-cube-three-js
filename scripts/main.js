import * as THREE from 'three'
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';

// Event Listeners

// Three Javascript
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 4, 5)
console.log(camera.rotation)
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setClearColor(0x2f3133)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls( camera, renderer.domElement )

const axesHelper = new THREE.AxesHelper(10)
axesHelper.position.set(-0.5, -0.5, -0.5)
scene.add(axesHelper)

// -- Floor --
const floorGeo = new THREE.PlaneGeometry(5, 5)
const floorMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
})
const floor = new THREE.Mesh(floorGeo, floorMat)
floor.rotation.x = Math.PI * 0.5
floor.position.set(2, -0.5, 2)
scene.add(floor)

// -- Rubiks Cube --

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
    parent.add(cube)
    return cube
}

function addPiece(center, x, y, z, x1, y1, z1) {
    const piece = pieces.get(x, y, z)
    if (!piece) return
    piece.position.set(x1, y1, z1)
    center.add(piece)
}

// Add pieces to center
function setR(center) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            addPiece(center, 2, i, j, 0, i - 1, j - 1)
        }
    }
}

let rotation = 0
let animFrame
function moveR(center) {
    animFrame = requestAnimationFrame(() => moveR(center))
    if (rotation >= -Math.PI * 0.5) {
        center.rotation.x -= Math.PI * 1/90
        rotation -= Math.PI * 1/90
    }
    else {
        rotation = 0
        cancelAnimationFrame(animFrame)
    }
    renderer.render(scene, camera)
}


// -- Build Rubiks Cube --

const center = {
    'org': newCube(scene, 0xffa500, 0, 1, 1),
    'wht': newCube(scene, 0xffffff, 1, 0, 1),
    'grn': newCube(scene, 0x00ff00, 1, 1, 0),
    'red': newCube(scene, 0xff0000, 2, 1, 1),
    'ylw': newCube(scene, 0xffff00, 1, 2, 1),
    'blu': newCube(scene, 0x0000ff, 1, 1, 2)
}

const pieces = [] // []
pieces.get = (x, y, z) => {
    return pieces[x][y][z] 
}

for (let i = 0; i < 3; i++) {
    pieces.push([])
    for (let j = 0; j < 3; j++) {
        pieces[i].push([])
        for (let k = 0; k < 3; k++) {
            const isCenter = Object.keys(center).find((x) => {
                    return center[x].position.equals(new THREE.Vector3(i, j, k))
                }
            )
            if (!isCenter) {
                pieces[i][j].push(newCube(scene, getRandomColor(), i, j, k))
            } else {
                pieces[i][j].push(undefined)
            }
        }
    }
}

function controlManager(e) {
    switch (e.key) {
        case 'a':
            // L
            break
        case 's':
            // F
            break
        case 'd':
            // B
            break
        case 'f':
            moveR(center.red)
            break
        case 'w':
            // U
            break
        case 'E':
            // D
            break
    }
}

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()

setR(center.red)
console.log(center.red)

renderer.render(scene, camera)

export { controlManager, moveR, center, pieces }