import * as THREE from 'three'
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import { RubiksCube } from './rubiks-cube.js'

// Three Javascript
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 4, 5)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight - 1)
renderer.setClearColor(0x2f3133)
document.body.appendChild(renderer.domElement)

// Camera controller
const controls = new OrbitControls( camera, renderer.domElement )
controls.target.set(1, 1, 1)

// Creating rubik's cube instance
const cube = new RubiksCube({
    parent: scene,
    offset: { x: 0, y: 0, z: 0},
})
cube.toggle()

// Allow movement
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    cube.update()
    renderer.render(scene, camera)
}
animate()