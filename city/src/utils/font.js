import * as THREE from 'three'
import { color } from '../config'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

export class Font {
  constructor(scene) {
    this.scene = scene
    this.font = null

    this.init()
  }

  init() {
    const loader = new FontLoader()
    loader.load('fonts/font.json', (font) => {
      this.font = font

      this.createTextQueue()
    })
  }

  createTextQueue() {
    ;[
      {
        text: 'building A',
        size: 20,
        position: {
          x: -10,
          y: 130,
          z: 410
        },
        rotate: Math.PI / 1.3,
        color: '#ffffff'
      },
      {
        text: 'building B',
        size: 20,
        position: {
          x: 180,
          y: 110,
          z: -70
        },
        rotate: Math.PI / 2,
        color: '#ffffff'
      }
    ].forEach((item) => {
      this.createText(item)
    })
  }

  createText(data) {
    const geometry = new TextGeometry(data.text, {
      font: this.font,
      size: 20,
      height: 2
    })
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(1.0,1.0,1.0,1.0);
        }
      `
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.copy(data.position)
    mesh.rotateY(data.rotate)

    this.scene.add(mesh)
  }
}
