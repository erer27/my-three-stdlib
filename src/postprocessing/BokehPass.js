var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { Pass, FullScreenQuad } from "./Pass.js";
import { WebGLRenderTarget, NearestFilter, MeshDepthMaterial, RGBADepthPacking, NoBlending, UniformsUtils, ShaderMaterial, Color } from "three";
import { BokehShader } from "../shaders/BokehShader.js";
class BokehPass extends Pass {
  constructor(scene, camera, params) {
    super();
    __publicField(this, "scene");
    __publicField(this, "camera");
    __publicField(this, "renderTargetDepth");
    __publicField(this, "materialDepth");
    __publicField(this, "materialBokeh");
    __publicField(this, "fsQuad");
    __publicField(this, "_oldClearColor");
    __publicField(this, "uniforms");
    this.scene = scene;
    this.camera = camera;
    const focus = params.focus !== void 0 ? params.focus : 1;
    const aspect = params.aspect !== void 0 ? params.aspect : camera.aspect;
    const aperture = params.aperture !== void 0 ? params.aperture : 0.025;
    const maxblur = params.maxblur !== void 0 ? params.maxblur : 1;
    const width = params.width || window.innerWidth || 1;
    const height = params.height || window.innerHeight || 1;
    this.renderTargetDepth = new WebGLRenderTarget(width, height, {
      minFilter: NearestFilter,
      magFilter: NearestFilter
    });
    this.renderTargetDepth.texture.name = "BokehPass.depth";
    this.materialDepth = new MeshDepthMaterial();
    this.materialDepth.depthPacking = RGBADepthPacking;
    this.materialDepth.blending = NoBlending;
    if (BokehShader === void 0) {
      console.error("BokehPass relies on BokehShader");
    }
    const bokehShader = BokehShader;
    const bokehUniforms = UniformsUtils.clone(bokehShader.uniforms);
    bokehUniforms["tDepth"].value = this.renderTargetDepth.texture;
    bokehUniforms["focus"].value = focus;
    bokehUniforms["aspect"].value = aspect;
    bokehUniforms["aperture"].value = aperture;
    bokehUniforms["maxblur"].value = maxblur;
    bokehUniforms["nearClip"].value = camera.near;
    bokehUniforms["farClip"].value = camera.far;
    this.materialBokeh = new ShaderMaterial({
      defines: Object.assign({}, bokehShader.defines),
      uniforms: bokehUniforms,
      vertexShader: bokehShader.vertexShader,
      fragmentShader: bokehShader.fragmentShader
    });
    this.uniforms = bokehUniforms;
    this.needsSwap = false;
    this.fsQuad = new FullScreenQuad(this.materialBokeh);
    this._oldClearColor = new Color();
  }
  render(renderer, writeBuffer, readBuffer) {
    this.scene.overrideMaterial = this.materialDepth;
    renderer.getClearColor(this._oldClearColor);
    const oldClearAlpha = renderer.getClearAlpha();
    const oldAutoClear = renderer.autoClear;
    renderer.autoClear = false;
    renderer.setClearColor(16777215);
    renderer.setClearAlpha(1);
    renderer.setRenderTarget(this.renderTargetDepth);
    renderer.clear();
    renderer.render(this.scene, this.camera);
    this.uniforms["tColor"].value = readBuffer.texture;
    this.uniforms["nearClip"].value = this.camera.near;
    this.uniforms["farClip"].value = this.camera.far;
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      renderer.clear();
      this.fsQuad.render(renderer);
    }
    this.scene.overrideMaterial = null;
    renderer.setClearColor(this._oldClearColor);
    renderer.setClearAlpha(oldClearAlpha);
    renderer.autoClear = oldAutoClear;
  }
}
export {
  BokehPass
};
//# sourceMappingURL=BokehPass.js.map
