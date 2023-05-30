import * as THREE from 'three'
import { color } from '../config'

export class Fly {
  constructor(scene, time) {
    this.scene = scene
    this.time = time

    this.createFly({
      source: {
        x: 300,
        y: 0,
        z: -200
      },
      target: {
        x: -500,
        y: 0,
        z: -240
      },
      range: 200,
      height: 300,
      color: color.fly,
      size: 30
    })
  }

  createFly(options) {
    const source = new THREE.Vector3(
      options.source.x,
      options.source.y,
      options.source.z
    )
    const target = new THREE.Vector3(
      options.target.x,
      options.target.y,
      options.target.z
    )
    // calculate the center between source & target
    const center = target.clone().lerp(source, 0.5)
    center.y += options.height
    // distance between source & target
    const len = parseInt(source.distanceTo(target))
    //
    const curve = new THREE.QuadraticBezierCurve3(source, center, target)
    //
    const points = curve.getPoints(len)
    const positions = []
    const aPointions = []
    points.forEach((item, index) => {
      positions.push(item.x, item.y, item.z)
      aPointions.push(index)
    })
    //
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )
    geometry.setAttribute(
      'a_position',
      new THREE.Float32BufferAttribute(aPointions, 1)
    )
    //
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_color: {
          value: new THREE.Color(options.color)
        },
        u_range: {
          value: options.range
        },
        u_size: {
          value: options.size
        },
        u_total: {
          value: len
        },
        u_time: this.time
      },
      vertexShader: `
        attribute float a_position;

        uniform float u_range;
        uniform float u_size;
        uniform float u_total;
        uniform float u_time;

        varying float v_opacity;

        void main(){
          float size = u_size;
          float total_number = u_total * mod(u_time, 1.0);

          // in the range
          if (total_number > a_position && total_number < a_position + u_range) {

            // slim the tail effect
            float index = (a_position + u_range - total_number) / u_range;
            size *= index;

            v_opacity = 1.0;
          } else {
            v_opacity = 0.0;
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size / 10.0;
        }
      `,
      fragmentShader: `
        uniform vec3 u_color;

        varying float v_opacity;

        void main(){
          gl_FragColor = vec4(u_color, v_opacity);
        }
      `,
      transparent: true
    })
    const point = new THREE.Points(geometry, material)

    this.scene.add(point)
  }
}
