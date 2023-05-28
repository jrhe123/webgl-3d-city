import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
import { loadFBX } from './loader'
//
import { SurrondLine } from './surroundLine'
import { Background } from './background'
export class City {
  constructor(scene, camera) {
    this.scene = scene
    this.camera = camera
    this.tweenPosition = null
    this.tweenRotation = null
    //
    this.loadCity()
  }

  loadCity() {
    loadFBX('models/beijing.fbx')
      .then((obj) => {
        obj.traverse((child) => {
          if (child.isMesh) {
            new SurrondLine(this.scene, child)
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

  start() {
    if (this.tweenPosition && this.tweenRotation) {
      this.tweenPosition.update()
      this.tweenRotation.update()
    }
  }
}
