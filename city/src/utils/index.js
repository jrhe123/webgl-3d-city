import * as THREE from 'three'

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
  camera.position.set(0, 0, 10)
  scene.add(camera)
  // lights
  scene.add(new THREE.AmbientLight(0xadadad))
  const directionLight = new THREE.DirectionalLight(0xffffff)
  directionLight.position.set(0, 0, 0)
  scene.add(directionLight)
  // mesh
  const box = new THREE.BoxGeometry(2, 2, 2)
  const material = new THREE.MeshLambertMaterial({
    color: 0xff0000
  })
  scene.add(new THREE.Mesh(box, material))
  // create renderer
  const renderer = new THREE.WebGLRenderer({
    canvas
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(new THREE.Color(0x000000), 1)

  // render
  renderer.render(scene, camera)

  // events
  window.addEventListener('resize', () => {
    // update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}
