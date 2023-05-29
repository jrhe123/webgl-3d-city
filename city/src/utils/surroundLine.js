import * as THREE from 'three'
import { color } from '../config'

export class SurrondLine {
  constructor(scene, child) {
    this.scene = scene
    this.child = child
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

        void main() {
          vec3 base_color = u_city_color;

          // calculate color based on the mesh height
          base_color = mix(base_color, u_head_color, v_position.z / u_size);
          
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

    // v2
    const material = new THREE.ShaderMaterial({
      uniforms: {
        line_color: {
          value: new THREE.Color(color.soundline)
        }
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 line_color;

        void main() {
          gl_FragColor = vec4(line_color, 1.0);
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
