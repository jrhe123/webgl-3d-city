import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
//
import moment from 'moment-timezone'

export class Font {
  constructor(scene) {
    this.scene = scene
    this.font = null
    // date
    const weekday = moment().tz('America/Toronto').weekday()
    const now = moment().tz('America/Toronto').hour()
    const isNight = now >= 20 || now <= 8
    this.weekday = weekday
    this.text1 = 'WebGL'
    this.text2 = 'ReactJS'
    if (this.weekday === 1 || this.weekday === 4) {
      this.text1 = 'Sunny - WebGL'
      this.text2 = `${isNight ? 'Evening' : 'Daylight'} - ReactJS`
    } else if (this.weekday === 2 || this.weekday === 5) {
      this.text1 = 'Snow - WebGL'
      this.text2 = `${isNight ? 'Evening' : 'Daylight'} - ReactJS`
    } else if (this.weekday === 3 || this.weekday === 6) {
      this.text1 = 'Rain - WebGL'
      this.text2 = `${isNight ? 'Evening' : 'Daylight'} - ReactJS`
    }

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
        text: this.text1,
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
        text: this.text2,
        size: 20,
        position: {
          x: 180,
          y: 110,
          z: -70
        },
        rotate: Math.PI / 2,
        color: '#ffffff'
      },
      {
        text: 'https://github.com/jrhe123/short_cut',
        size: 20,
        position: {
          x: -300,
          y: 130,
          z: 150
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
