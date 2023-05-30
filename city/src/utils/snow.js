import * as THREE from 'three'
import { Points } from './points'

export class Snow {
  constructor(scene) {
    this.points = new Points(scene, {
      size: 30,
      opacity: 0.8,
      range: 1000,
      count: 600,
      setAnimation(position) {
        position.x -= position.speedX
        position.y -= position.speedY
        position.z -= position.speedZ

        if (position.y <= 0) {
          position.y = this.range / 2
        }
      },
      setPosition(position) {
        position.speedX = Math.random() - 0.5
        position.speedY = Math.random() + 0.5
        position.speedZ = Math.random() - 0.5
      },
      url: 'assets/snow.png'
    })
  }

  init() {
    // PointCloud   Points
    this.material = new THREE.PointsMaterial({
      size: 30,
      map: new THREE.TextureLoader().load('assets/snow.png'),
      transparent: true,
      opacity: 0.8,
      depthTest: false
    })
    this.geometry = new THREE.BufferGeometry()

    //
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2,
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2
      )

      position.speedX = Math.random() - 0.5
      position.speedY = Math.random() + 4
      position.speedZ = Math.random() - 0.5

      this.pointList.push(position)
    }
    this.geometry.setFromPoints(this.pointList)

    this.point = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.point)
  }

  animation() {
    this.points.animation()
  }
}
