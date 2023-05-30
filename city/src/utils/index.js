import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { City } from './city'

export const initCity = () => {
  // get canvas
  const canvas = document.getElementById('webgl')
  // create scene
  const scene = new THREE.Scene()
  // create camera: fov, aspect, near, far
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    100000
  )
  camera.position.set(1000, 500, 100)
  scene.add(camera)

  // control
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.enableZoom = true
  controls.minDistance = 100
  controls.maxDistance = 2000
  controls.enablePan = true

  // lights
  scene.add(new THREE.AmbientLight(0xadadad))
  const directionLight = new THREE.DirectionalLight(0xffffff)
  directionLight.position.set(0, 0, 0)
  scene.add(directionLight)

  // mesh
  // const box = new THREE.BoxGeometry(2, 2, 2)
  // const material = new THREE.MeshLambertMaterial({
  //   color: 0xff0000
  // })
  // scene.add(new THREE.Mesh(box, material))

  // create renderer
  const renderer = new THREE.WebGLRenderer({
    canvas
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(new THREE.Color(0x000000), 1)

  // clock for scan horizontal line
  const clock = new THREE.Clock()
  // init city with "requestAnimationFrame"
  const city = new City(scene, camera, controls)
  const start = () => {
    city.start(clock.getDelta())
    // controls
    controls.update()
    // render
    renderer.render(scene, camera)
    requestAnimationFrame(start)
  }
  start()

  // events
  window.addEventListener('resize', () => {
    // update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}
