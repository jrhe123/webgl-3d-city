const basicType = {
  color: {
    method: "addColor",
    getValue: (item) => item.color.getStyle(),
    setValue: (item, value) => item.color.setStyle(value),
  },
  intensity: {
    extends: [0, 10],
    getValue: (item) => item.intensity,
    setValue: (item, value) => (item.intensity = +value),
  },
  distance: {
    extends: [0, 2],
    getValue: (item) => item.distance,
    setValue: (item, value) => (item.distance = +value),
  },
  angle: {
    extends: [0, Math.PI / 2],
    getValue: (item) => item.angle,
    setValue: (item, value) => (item.angle = +value),
  },
  exponent: {
    extends: [0, 20],
    getValue: (item) => item.exponent,
    setValue: (item, value) => (item.exponent = +value),
  },
  groundColor: {
    method: "addColor",
    getValue: (item) => item.groundColor.getStyle(),
    setValue: (item, value) => item.groundColor.setStyle(value),
  },
  opacity: {
    extends: [0, 1],
    getValue: (item) => item.opacity,
    setValue: (item, value) => (item.opacity = +value),
  },
  transparent: {
    getValue: (item) => item.transparent,
    setValue: (item, value) => (item.transparent = value),
  },
  wireframe: {
    getValue: (item) => item.wireframe,
    setValue: (item, value) => (item.wireframe = value),
  },
  visible: {
    getValue: (item) => item.visible,
    setValue: (item, value) => (item.visible = value),
  },
  cameraNear: {
    extends: [0, 50],
    getValue: (item, camera) => camera.near,
    setValue: (item, value, camera) => (camera.near = value),
  },
  cameraFar: {
    extends: [50, 1000],
    getValue: (item, camera) => camera.far,
    setValue: (item, value, camera) => (camera.far = value),
  },
  side: {
    extends: [["front", "back", "double"]],
    getValue: (item, camera) => "front",
    setValue: (item, value, camera) => {
      switch (value) {
        case "front":
          item.side = THREE.FrontSide;
          break;
        case "back":
          item.side = THREE.BackSide;
          break;
        case "double":
          item.side = THREE.DoubleSide;
          break;
      }
    },
  },
  // mat env color
  ambient: {
    method: "addColor",
    getValue: (item, camera) => item.ambient.getHex(),
    setValue: (item, value, camera) => (item.ambient = new THREE.Color(value)),
  },
  // mat itself color
  emissive: {
    method: "addColor",
    getValue: (item, camera) => item.emissive.getHex(),
    setValue: (item, value, camera) => (item.emissive = new THREE.Color(value)),
  },
  // highlight color
  specular: {
    method: "addColor",
    getValue: (item, camera) => item.specular.getHex(),
    setValue: (item, value, camera) => (item.specular = new THREE.Color(value)),
  },
  // highlight shineiness
  shininess: {
    extends: [0, 100],
    getValue: (item, camera) => item.shininess,
    setValue: (item, value, camera) => (item.shininess = value),
  },
  red: {
    extends: [0, 1],
    getValue: (item, camera) => item.uniforms.r.value,
    setValue: (item, value, camera) => (item.uniforms.r.value = value),
  },
  alpha: {
    extends: [0, 1],
    getValue: (item, camera) => item.uniforms.a.value,
    setValue: (item, value, camera) => (item.uniforms.a.value = value),
  },
  dashSize: {
    extends: [0, 5],
    getValue: (item, camera) => item.dashSize,
    setValue: (item, value, camera) => (item.dashSize = +value),
  },
  gapSize: {
    extends: [0, 1],
    getValue: (item, camera) => item.gapSize,
    setValue: (item, value, camera) => (item.gapSize = +value),
  },
};

const itemType = {
  SpotLight: ["color", "intensity", "distance", "angle", "exponent"],
  AmbientLight: ["color"],
  PointLight: ["color", "intensity", "distance"],
  DirectionalLight: ["color", "intensity"],
  HemisphereLight: ["skyColor", "groundColor", "intensity"],
  MeshBasicMaterial: [
    "color",
    "opacity",
    "transparent",
    "wireframe",
    "visible",
  ],
  MeshDepthMaterial: ["wireframe", "cameraNear", "cameraFar"],
  MeshNormalMaterial: [
    "opacity",
    "transparent",
    "wireframe",
    "visible",
    "side",
  ],
  MeshLambertMaterial: [
    "color",
    "opacity",
    "transparent",
    "wireframe",
    "visible",
    "side",
    "ambient",
    "emissive",
  ],
  MeshPhongMaterial: [
    "color",
    "opacity",
    "transparent",
    "wireframe",
    "visible",
    "side",
    "ambient",
    "emissive",
    "specular",
    "shininess",
  ],
  ShaderMaterial: ["red", "alpha"],
  LineBasicMaterial: ["color"],
  LineDashedMaterial: ["color", "dashSize", "gapSize"],
};

function initControls(item, camera) {
  console.log("item: ", item);
  console.log("camera: ", camera);

  const typeList = itemType[item.type];
  if (!typeList || !typeList.length) {
    return;
  }

  const controls = {};
  const gui = new dat.GUI();
  for (let i = 0; i < typeList.length; i++) {
    const _type = typeList[i];
    const child = basicType[_type];
    if (child) {
      controls[_type] = child.getValue(item, camera);
      const childExtends = child.extends || [];
      gui[child.method || "add"](controls, _type, ...childExtends).onChange(
        (value) => {
          child.setValue(item, value, camera);
        }
      );
    }
  }
}
