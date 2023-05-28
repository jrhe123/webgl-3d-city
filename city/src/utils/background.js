import * as THREE from 'three'

export class Background {
  constructor(scene) {
    this.url = 'assets/white-bg.png'
    this.scene = scene
    this.init()
  }

  // box
  init() {
    // texture loader
    const loader = new THREE.TextureLoader()
    const geometry = new THREE.SphereGeometry(5000, 32, 32)
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: loader.load(this.url)
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.copy({
      x: 0,
      y: 0,
      z: 0
    })
    this.scene.add(sphere)
  }
}
