import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { loadFBX } from './loader'
//
import { SurrondLine } from './surroundLine'
import { Background } from './background'
import { Radar } from './radar'
import { Wall } from './wall'
import { Circle } from './circle'
import { Ball } from './ball'
import { Cone } from './cone'
import { Fly } from './fly'
import { Road } from './road'

export class City {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.tweenPosition = null
    this.tweenRotation = null
    // scan up line
    this.height = {
      value: 5
    }
    // scan horizontal line
    this.time = {
      value: 0
    }
    // cone animation
    this.flag = false
    this.top = {
      value: 5
    }
    //
    this.loadCity()
  }

  loadCity() {
    loadFBX('models/beijing.fbx')
      .then((obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            new SurrondLine(this.scene, child, this.height, this.time)
          }
        })
        //
        this.initEffect()
      })
      .catch((error) => {
        console.log('load error: ', error)
      })
  }

  initEffect() {
    new Background(this.scene)

    new Radar(this.scene, this.time)

    new Wall(this.scene, this.time)

    new Circle(this.scene, this.time)

    new Ball(this.scene, this.time)

    new Cone(this.scene, this.top, this.height)

    new Fly(this.scene, this.time)

    new Road(this.scene, this.time)
    // click event
    this.addClick()
  }

  addClick() {
    let flag = true
    document.onmousedown = () => {
      flag = true
      document.onmousemove = () => {
        flag = false
      }
    }

    document.onmouseup = (event) => {
      if (flag) {
        this.clickEvent(event)
      }
      document.onmousemove = null
    }
  }

  clickEvent(event) {
    // get coordinates
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    // create vector
    const standardVector = new THREE.Vector3(x, y, 0.5)
    // convert to world vector
    const worldVector = standardVector.unproject(this.camera)
    // normalize
    const ray = worldVector.sub(this.camera.position).normalize()
    // create raycaseter to check if selected
    const raycaster = new THREE.Raycaster(this.camera.position, ray)
    const intersects = raycaster.intersectObjects(this.scene.children, true)
    let point3d = null
    if (intersects.length) {
      point3d = intersects[0]
    }
    // camera animation
    if (point3d) {
      const proportion = 3
      const time = 5000
      this.tweenPosition = new TWEEN.Tween(this.camera.position)
        .to(
          {
            x: point3d.point.x * proportion,
            y: point3d.point.y * proportion,
            z: point3d.point.z * proportion
          },
          time
        )
        .start()
      this.tweenRotation = new TWEEN.Tween(this.camera.rotation)
        .to(
          {
            x: this.camera.rotation.x,
            y: this.camera.rotation.y,
            z: this.camera.rotation.z
          },
          time
        )
        .start()
    }
  }

  start(delta) {
    if (this.tweenPosition && this.tweenRotation) {
      this.tweenPosition.update()
      this.tweenRotation.update()
    }

    // animate scanning line
    // increase by 0.4 per frame
    this.height.value += 0.4
    if (this.height.value > 160) {
      this.height.value = 5
    }
    // scan horizontal line
    this.time.value += delta
    // cone animation value
    if (this.top.value > 15 || this.top.value < 0) {
      this.flag = !this.flag
    }
    this.top.value += this.flag ? -0.8 : 0.8
  }
}
