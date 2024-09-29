
<template>
  <div id="scene">
  </div>
</template>

<script setup>
import * as THREE from 'three';
import {onMounted} from 'vue'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader'
import { ModelManage } from '/src/base/index'

const md = new ModelManage()



// 创建场景
const createScene = () => {
  const scene = new THREE.Scene();
  const axesHelper = new THREE.AxesHelper( 200 );
  scene.add( axesHelper );
  return scene
}

// 创建摄像机
const createCamera = () => {
  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 5000 );
  // camera.position.set( 0.02, 0.02, 0);
  camera.position.set( 30, 30, 30);
  // camera.rotation.y = (90 / 180) * Math.PI
  camera.lookAt( 0,0,0 );
  return camera
}

// 创建渲染器
const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth * 0.8, window.innerHeight * 0.8 );
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x444444); //设置背景颜色
  renderer.outputColorSpace = THREE.SRGBColorSpace
  return renderer
}

// 创建轨道控制器
const createOrbitControls = () => {
  const controls = new OrbitControls( camera, renderer.domElement );
  // controls.target = new THREE.Vector3(0,0,10)
  return controls
}

// 循环动画
const animate = () => {
	requestAnimationFrame( animate );
  // controls.update()
	renderer.render( scene, camera );
}

// 打灯
const addLight = () => {
  const light = new THREE.AmbientLight();
  scene.add( light );
}

const scene = createScene();
const camera = createCamera()
const renderer = createRenderer()
const controls = createOrbitControls()
// addLight()
/** -------------------------------------------------- 一些初始化 */


const replaceTexture = (item) => {
  // console.log(item.material.map)
  const textureLoader = new THREE.TextureLoader()
  // const texture = textureLoader.load('/src/assets/img/Snipaste_2024-08-24_01-19-36.png')
  const texture = textureLoader.load('/src/assets/img/WechatIMG410.jpg')
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  const uv = new Float32Array([
    0,1,
    1,1,
    0,0,
    1,0
  ])
 
  item.material.map = texture
  console.log(item)
  // item.geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2))


  // const geometry = new THREE.PlaneGeometry(10,10)
  // geometry.attributes.uv = new THREE.BufferAttribute(uv, 2)
  // console.log( geometry.attributes.uv)
  // const material = new THREE.MeshBasicMaterial({
  //   map: texture
  // })
  // const mesh = new THREE.Mesh(geometry, material)
  // mesh.position.set(10,0,0)
  // scene.add(mesh)


}


const test = () => {
  const loader = new GLTFLoader();

  // loader.load('./src/assets/model/family_home/scene.gltf', function ( gltf ) {
  loader.load('./src/assets/model/buy1/main.gltf', function ( gltf ) {
    let quque = [...gltf.scene.children]
    let idx = 0
    while(quque.length) {
      const item = quque.pop()
      if (item.type === 'Mesh' && ['20200814-163610-pdt', '20200814-163610-pdt_Room_Entity_Material'].includes(item.material.name)) {
        // if (idx === 2) {
          replaceTexture(item)
        // }
        idx += 1
      }
      if (item.children?.length) {
        quque = [...item.children,...quque]
      }
    }
    console.log(gltf,'gltf')

	  scene.add( gltf.scene );
    }, undefined, function ( error ) {
      console.error( error );
    } 
  );

}

const loadHdr = () => {
  let rgbeLoader = new RGBELoader()
  rgbeLoader.load('./src/assets/hdr/816-hdri-skies-com.hdr', (texture) => {
    
    texture.mapping = THREE.EquirectangularReflectionMapping
    // scene.background = texture
    scene.environment = texture
  })
}


test()
// loadHdr()



const init = () => {
  document.querySelector('#scene').appendChild( renderer.domElement );
  animate();
}
onMounted(init)

</script>


<style scoped>
#info {
	position: absolute;
	top: 10px;
	width: 100%;
	text-align: center;
	z-index: 100;
	display:block;
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
