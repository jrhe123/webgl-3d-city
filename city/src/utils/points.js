import * as THREE from 'three'

export class Points {
  constructor(
    scene,
    { size, opacity, range, count, setAnimation, setPosition, url }
  ) {
    this.scene = scene

    // range
    this.range = range
    // snow number
    this.count = count

    this.pointList = []

    this.size = size
    this.opacity = opacity
    this.setAnimation = setAnimation
    this.setPosition = setPosition
    this.url = url

    this.init()
  }

  init() {
    // PointCloud   Points
    this.material = new THREE.PointsMaterial({
      size: this.size,
      map: new THREE.TextureLoader().load(this.url),
      transparent: true,
      opacity: this.opacity,
      depthTest: false
    })
    this.geometry = new THREE.BufferGeometry()
    // add snow now
    for (let i = 0; i < this.count; i++) {
      const position = new THREE.Vector3(
        Math.random() * this.range - this.range / 2,
        Math.random() * this.range,
        Math.random() * this.range - this.range / 2
      )
      this.setPosition(position)
      this.pointList.push(position)
    }
    this.geometry.setFromPoints(this.pointList)

    this.point = new THREE.Points(this.geometry, this.material)
    this.scene.add(this.point)
  }

  animation() {
    this.pointList.forEach((position) => {
      this.setAnimation(position)
    })
    this.point.geometry.setFromPoints(this.pointList)
  }
}
