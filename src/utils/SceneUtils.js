import { Group, Mesh } from "three";
const SceneUtils = {
  createMeshesFromInstancedMesh: function(instancedMesh) {
    const group = new Group();
    const count = instancedMesh.count;
    const geometry = instancedMesh.geometry;
    const material = instancedMesh.material;
    for (let i = 0; i < count; i++) {
      const mesh = new Mesh(geometry, material);
      instancedMesh.getMatrixAt(i, mesh.matrix);
      mesh.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      group.add(mesh);
    }
    group.copy(instancedMesh);
    group.updateMatrixWorld();
    return group;
  },
  createMultiMaterialObject: function(geometry, materials) {
    const group = new Group();
    for (let i = 0, l = materials.length; i < l; i++) {
      group.add(new Mesh(geometry, materials[i]));
    }
    return group;
  },
  detach: function(child, parent, scene) {
    console.warn("THREE.SceneUtils: detach() has been deprecated. Use scene.attach( child ) instead.");
    scene.attach(child);
  },
  attach: function(child, scene, parent) {
    console.warn("THREE.SceneUtils: attach() has been deprecated. Use parent.attach( child ) instead.");
    parent.attach(child);
  }
};
export {
  SceneUtils
};
//# sourceMappingURL=SceneUtils.js.map
