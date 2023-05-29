import * as THREE from 'three'
import { color } from '../config'

export class Radar {
  constructor(scene, time) {
    this.scene = scene
    this.time = time

    this.init()
  }

  init() {
    const radius = 50
    const geometry = new THREE.PlaneGeometry(radius * 2, radius * 2, 1, 1)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(color.radarColor)
        },
        // changing time from clock delta
        u_time: this.time,
        u_radius: {
          value: radius
        }
      },
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: `
        varying vec2 v_position;

        void main(){
          v_position = vec2(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec2 v_position;

        uniform float u_time;
        uniform vec3 u_color;
        uniform float u_radius;

        void main(){
          float angle = atan(v_position.x, v_position.y);
          float new_angle = mod(angle + u_time, 3.1415926 * 2.0);

          float dis = distance(vec2(0.0,0.0), v_position);
          float borderWidth = 5.0;

          float f_opacity = 0.0;

          // on the border
          if (dis > u_radius - borderWidth) {
            f_opacity = 1.0;
          }
          // inside the radar
          if (dis < u_radius - borderWidth) {
            f_opacity = 1.0 - new_angle;
          }
          // outside of radar
          if (dis > u_radius) {
            f_opacity = 0.0;
          }

          gl_FragColor = vec4(u_color, f_opacity);
        }
      `
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotateX(-Math.PI / 2)
    mesh.position.set(300, 0, 0)

    this.scene.add(mesh)
  }
}
