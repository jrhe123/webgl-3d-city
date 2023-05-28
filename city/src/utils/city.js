import { loadFBX } from './loader'
import { SurrondLine } from './surroundLine'
import * as THREE from 'three'

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
      })
      .catch((error) => {
        console.log('load error: ', error)
      })
  }

  start() {}
}
