import * as THREE from 'three'
import { OrbitControls } from 'https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls( camera, renderer.domElement )
scene.add(controls)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    color: 0x00fe00,
})
const cube = new THREE.Mesh( geometry, material )
scene.add(cube)

camera.position.z = 5

function animate() {
    requestAnimationFrame( animate )
    renderer.render(scene, camera)
}
animate()