import * as THREE from 'three'
import { color } from '../config'
import { Cylinder } from './cylinder'

export class Circle {
  constructor(scene, time) {
    this.config = {
      radius: 50,
      color: color.circle,
      opacity: 0.6,
      height: 1,
      open: false,
      position: {
        x: 300,
        y: 0,
        z: 300
      },
      speed: 2.0
    }

    new Cylinder(scene, time).createCylinder(this.config)
  }
}
