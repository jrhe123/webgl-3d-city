import * as THREE from 'three'
import { Points } from './points'

export class Rain {
  constructor(scene) {
    this.points = new Points(scene, {
      size: 10,
      opacity: 0.4,
      range: 1000,
      count: 800,
      setAnimation(position) {
        position.y -= position.speedY

        // check boundary
        if (position.y <= 0) {
          position.y = this.range / 2
        }
      },
      setPosition(position) {
        position.speedY = 20
      },
      url: 'assets/rain.png'
    })
  }

  init() {
    //
    this.material = new THREE.PointsMaterial({
      size: 10,
      map: new THREE.TextureLoader().load('assets/rain.png'),
      transparent: true,
      opacity: 0.4,
      depthTest: false
    })

    this.geometry = new THREE.BufferGeometry()
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2,
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2
      )

      position.speedY = 20

      this.pointsList.push(position)
    }

    this.geometry.setFromPoints(this.pointsList)

    this.points = new THREE.Points(this.geometry, this.material)

    this.scene.add(this.points)
  }

  animation() {
    this.points.animation()
  }
}
