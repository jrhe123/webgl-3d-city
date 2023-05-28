import { loadFBX } from './loader'
import { SurrondLine } from './surroundLine'
import { Background } from './background'

export class City {
  constructor(scene) {
    this.scene = scene
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
  }

  start() {}
}
