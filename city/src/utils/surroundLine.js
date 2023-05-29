import * as THREE from 'three'
import { color } from '../config'

export class SurrondLine {
  constructor(scene, child, height, time) {
    this.scene = scene
    this.child = child
    this.height = height
    this.time = time
    //
    this.createMesh()
    // outline of building
    this.createLine()
  }

  computedMesh() {
    this.child.geometry.computeBoundingBox()
    this.child.geometry.computeBoundingSphere()
  }

  createMesh() {
    this.computedMesh()

    // get the mesh height
    const { max, min } = this.child.geometry.boundingBox
    const size = max.z - min.z

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_city_color: {
          value: new THREE.Color(color.mesh)
        },
        u_head_color: {
          value: new THREE.Color(color.head)
        },
        u_size: {
          value: size
        },
        u_height: this.height,
        u_up_color: {
          value: new THREE.Color(color.risingColor)
        }
      },
      vertexShader: `
        varying vec3 v_position;

        void main() {
          v_position = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_position;
        uniform vec3 u_city_color;
        uniform vec3 u_head_color;
        uniform float u_size;

        uniform vec3 u_up_color;
        uniform float u_height;

        void main() {
          vec3 base_color = u_city_color;

          // calculate color based on the mesh height
          base_color = mix(base_color, u_head_color, v_position.z / u_size);

          // scanning line effect
          if (u_height > v_position.z && u_height < v_position.z + 6.0) {
            float f_index = (u_height - v_position.z) / 3.0;
            // blur the both sides color
            base_color = mix(u_up_color, base_color, abs(f_index - 1.0));
          }
          
          gl_FragColor = vec4(base_color, 1.0);
        }
      `
    })
    const mesh = new THREE.Mesh(this.child.geometry, material)
    mesh.position.copy(this.child.position)
    mesh.rotation.copy(this.child.rotation)
    mesh.scale.copy(this.child.scale)

    this.scene.add(mesh)
  }

  createLine() {
    // get the mesh outline
    const geometry = new THREE.EdgesGeometry(this.child.geometry)
    // create lines
    // v1
    // const material = new THREE.LineBasicMaterial({
    //   color: color.soundline
    // })

    const { max, min } = this.child.geometry.boundingBox
    // v2
    const material = new THREE.ShaderMaterial({
      uniforms: {
        line_color: {
          value: new THREE.Color(color.soundline)
        },
        u_time: this.time,
        u_max: {
          value: max
        },
        u_min: {
          value: min
        },
        live_color: {
          value: new THREE.Color(color.liveColor)
        }
      },
      vertexShader: `
        uniform vec3 line_color;
        uniform float u_time;
        uniform vec3 u_max;
        uniform vec3 u_min;
        uniform vec3 live_color;

        varying vec3 v_color;

        void main() {
          // u_time (changing value)
          // u_max, u_min
          // live_color
          float new_time = mod(u_time * 0.1, 1.0);
          float rangeY = mix(u_min.y, u_max.y, new_time);

          // ANIMATE scanning horizontal line
          if (rangeY < position.y && rangeY > position.y - 200.0) {
            float f_index = 1.0 - sin((position.y - rangeY) / 200.0 * 3.14);
            float r = mix(live_color.r, line_color.r, f_index);
            float g = mix(live_color.g, line_color.g, f_index);
            float b = mix(live_color.b, line_color.b, f_index);

            v_color = vec3(r,g,b);
          } else {
            v_color = line_color;
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_color;

        void main() {
          gl_FragColor = vec4(v_color, 1.0);
        }
      `
    })

    const line = new THREE.LineSegments(geometry, material)
    // copy the position & rotation & scale
    line.scale.copy(this.child.scale)
    line.position.copy(this.child.position)
    line.rotation.copy(this.child.rotation)

    this.scene.add(line)
  }
}
