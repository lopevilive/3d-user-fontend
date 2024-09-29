
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import {Assistance} from './assistance'
import {Light} from './light'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ReflectorForSSRPass } from 'three/addons/objects/ReflectorForSSRPass.js';
import { SSRPass } from 'three/addons/postprocessing/SSRPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';

export class ModelManage {
  constructor (payload) {
    this.payload = payload || {}
    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null
    this.assistance = null
    this.light = new Light(this)
    this.width = window.innerWidth * 0.94
    this.height = window.innerHeight * 0.75
    this.timer = null

    this.init()
  }

  createScene() {
    this.scene = new THREE.Scene();
  }
  createCamera() {
    const {
      fov = 45,
      aspect = this.width / this.height,
      near = 0.01,far = 5000,
      position = [30,30,30],
      lookAt = [0,0,0]
    } = this.payload.camera || {}
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( ...position);
    camera.lookAt(...lookAt);
    this.camera = camera
  }
  createRenderer() {
    const {
      width = this.width,
      height = this.height,
      color = 0x444444,
      devicePixelRatio = window.devicePixelRatio,
      outputColorSpace = THREE.SRGBColorSpace
    } = this.payload.renderer || {}
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize( width, height );
    renderer.setPixelRatio(devicePixelRatio)
    renderer.setClearColor(color); //设置背景颜色
    renderer.outputColorSpace = outputColorSpace
    this.renderer = renderer
  }
  createOrbitControls() {
    const {target = [0,0,0]} = this.payload.controls || {}
    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.target = new THREE.Vector3(...target)
    this.controls = controls
  }
  startAnimate() {
    this.renderer.render(this.scene, this.camera)
    console.log(1)
   this.timer = requestAnimationFrame(() => {
      this.renderer.render(this.scene, this.camera)
      this.startAnimate()
    })
  }
  async loadModel(path) {
    const gltfLoader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      gltfLoader.load(
        path,
        (gltf) => {
          // console.log(gltf)
          this.scene.add(gltf.scene);
          resolve()
        },
        undefined,
        undefined,
        (err) => {
          reject('模型加载出错：',err)
        }
      )

    })
  }
  // 添加一些辅助工具
  addAssistance() {
    this.assistance = new Assistance(this)
  }
  formatCameraPos(pos, target) {
    this.camera.position.set(...pos)
    this.camera.lookAt(...target)
    this.controls.target = new THREE.Vector3(...target)
  }
  async loadHdr(path, useBg = false) {
    return new Promise((resolve) => {
      const rgbeLoader = new RGBELoader()
      rgbeLoader.load(path, (hdr) => {
        // hdr.mapping = THREE.EquirectangularReflectionMapping
        this.scene.environment = hdr
        this.scene.environment.mapping = THREE.EquirectangularReflectionMapping
        if (useBg) {
          this.scene.background = hdr
        }
        resolve()
      })
    })
  }
  getMeshByMatName(str) {
    let queue = [...this.scene.children]
    while(queue.length) {
      const obj = queue.pop()
      if (obj.type === 'Mesh') {
        if (obj.material.name === str) {
          return obj
        }
      }
      if (obj.children?.length) {
        queue = [...obj.children, ...queue]
      }
    }
  }
  /**材质控制-----------------------------------------------------------s */
  setMaterial(name, payload) {
    const mesh = this.scene.getObjectByName(name)
    mesh.material = mesh.material.clone()
    Object.assign(mesh.material, payload)
  }
  setNormalMap(name,path) { // 法线贴图
    const mesh = this.scene.getObjectByName(name)
    mesh.material = mesh.material.clone()
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(path, (texture) => {
      mesh.material.normalMap = texture
    })
  }
  setRoughnessMap(name,path) { // 粗糙贴图
    const mesh = this.scene.getObjectByName(name)
    mesh.material = mesh.material.clone()
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(path, (texture) => {
      mesh.material.roughnessMap = texture
    })
  }
  async setMap(name, path)  {
    const mesh = this.scene.getObjectByName(name)
    mesh.material = mesh.material.clone()
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(path, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.flipY = false;
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      mesh.material.map = texture
    })
  }
    /**材质控制-----------------------------------------------------------e */

  /**渲染调优-----------------------------------------------------------s*/
  renderingTuning() {
    const ReflectorGeometry = new THREE.PlaneGeometry( 1, 1 );
    const groundReflector = new ReflectorForSSRPass( ReflectorGeometry, {
        clipBias: 0.0003,
        textureWidth: this.width,
        textureHeight: this.height,
        color: 0x888888,
        useDepthTexture: true,
    } );
    groundReflector.material.depthWrite = false;
    groundReflector.rotation.x = - Math.PI / 2;
    groundReflector.visible = false;
    this.scene.add( groundReflector );

    const composer = new EffectComposer( this.renderer );

    const ssrPass = new SSRPass( {
        renderer: this.renderer,
        scene: this.scene,
        camera: this.camera,
        width: this.width,
        height: this.height,
        groundReflector: groundReflector,
        selects: []
    } );
    composer.addPass( ssrPass );
    ssrPass.thickness = 0.018;
    ssrPass.infiniteThick = false;
    ssrPass.maxDistance = .1;
    groundReflector.maxDistance = 0.036
    ssrPass.opacity = 1;
    groundReflector.opacity = 0.317;

    composer.addPass( new ShaderPass( GammaCorrectionShader ) );
  }
    
    
    
    /**渲染调优-----------------------------------------------------------e*/

  destory() {
    if (this.timer) cancelAnimationFrame(this.timer)
    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null
    this.assistance = null
  }



  init() {
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.createOrbitControls()
    this.startAnimate()
    this.renderingTuning()
  }

}



