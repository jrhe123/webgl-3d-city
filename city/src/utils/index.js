import * as THREE from 'three'

export const initCity = () => {
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
  scene.add(camera)
}
