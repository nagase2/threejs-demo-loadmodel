import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";

const style = {
  height: 400 // we can control scene size by setting container dimensions
};

class App extends Component {
  silenState = { isMounted: true };

  componentDidMount() {
    this.sceneSetup();
    this.addCustomSceneObjects();
    this.startAnimationLoop();
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  // Standard scene setup in Three.js. Check "Creating a scene" manual for more information
  // https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
  sceneSetup = () => {

    
    // get container dimensions and use them for scene sizing
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.scene = new THREE.Scene();
    var bgColor = new THREE.Color( 0x999999 );
    this.scene.background = bgColor
    this.camera = new THREE.PerspectiveCamera(
      90, // 物体からのカメラの距離
      width / height, // aspect ratio
      0.1, // near plane
      1000 // far plane
    );

    this.camera.position.set( 4, 5, 4);
		//this.camera.lookAt( 0, 2, 0 );

    //this.camera.position.z = 10; // is used here to set some distance from a cube that is located at z = 0
    // OrbitControls allow a camera to orbit around the object
    // https://threejs.org/docs/#examples/controls/OrbitControls
    this.controls = new OrbitControls(this.camera, this.el);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.el.appendChild(this.renderer.domElement); // mount using React ref

    //地面を表示
      var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    this.scene.add( mesh );
    var grid = new THREE.GridHelper( 2000, 1000, 0x000000, 0x000000 );
    grid.position.set(0,-1,0)
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    this.scene.add( grid );

    this.scene.fog = new THREE.Fog( 0xa0a0a0, 3, 33 );

      //collada elfモデル
    var loadingManager = new THREE.LoadingManager(function() {
      this.scene.add(elf);
    });
    // var colladaLoader = new ColladaLoader(loadingManager);
    // colladaLoader.load("models/collada/stormtrooper/stormtrooper.dae", function(collada) {
    //     collada.scene.traverse(function(child) {
    //         if (child.isMesh) {
    //           child.castShadow = true;
    //           child.receiveShadow = true;
    //          // child.position.x=20
    //         }
    //       });
    //   elf = collada.scene;
    //   elf.position.set(21,13,-33)
    // });


  
  
  };

 
  addCustomSceneObjects = () => {
    //救急車本体部分
    const geometry = new THREE.BoxGeometry(5, 2, 2);

    this.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x072534,
      transparent: true,
      opacity : 0.95, //透明度
      wireframe :false, //ワイヤフレーム
      side: THREE.DoubleSide,
      flatShading: true
    });
    this.cube = new THREE.Mesh(geometry, this.material);
    this.scene.add(this.cube);

    const geometory2 = new THREE.BoxGeometry(0.8, 1.5, 1.5);
    this.cube2 = new THREE.Mesh(geometory2,this.material);
    this.cube2.position.set(-2.8,-0.2,0)
    this.scene.add(this.cube2);

    //救急車タイヤ部分
    var geometryTire = new THREE.CylinderGeometry( 0.5,0.5,0.5, 10 );
    const materialTire = new THREE.MeshPhongMaterial({
      color: 0x0111111,
      //emissive: 0x111111,
      side: THREE.DoubleSide,
      flatShading: true
    });
    this.tire1 = new THREE.Mesh(geometryTire, materialTire);
    this.tire1.position.set(-1.5,-0.8,1)
    this.tire1.setRotationFromEuler(new THREE.Euler( 1.55, 0, 0, 'XYZ' ))
    this.scene.add(this.tire1);

    this.tire2 = new THREE.Mesh(geometryTire, materialTire);
    this.tire2.position.set(1.5,-0.8,1)
    this.tire2.setRotationFromEuler(new THREE.Euler( 1.55, 0, 0, 'XYZ' ))
    this.scene.add(this.tire2);

    this.tire3 = new THREE.Mesh(geometryTire, materialTire);
    this.tire3.position.set(1.5,-0.8,-1)
    this.tire3.setRotationFromEuler(new THREE.Euler( 1.55, 0, 0, 'XYZ' ))
    this.scene.add(this.tire3);
    
        this.tire4 = new THREE.Mesh(geometryTire, materialTire);
    this.tire4.position.set(-1.5,-0.8,-1)
    this.tire4.setRotationFromEuler(new THREE.Euler( 1.55, 0, 0, 'XYZ' ))
    this.scene.add(this.tire4);


    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);

    lights[0].position.set(1, 100, 0);
    lights[1].position.set(100, 0, 100);
    lights[2].position.set(-10, -10, -10);
    

    let light = new THREE.HemisphereLight(0x555555, 0x111111);
    light.position.set(333, 200, 33);
    this.scene.add(light);
    light.castShadow =true;
    // light.shadow.camera.top = 18;
    // light.shadow.camera.bottom = - 10;
    // light.shadow.camera.left = - 10;
    // light.shadow.camera.right = 120;

    this.scene.add(lights[0]);
    this.scene.add(lights[1]);
    this.scene.add(lights[2]);
  };

  startAnimationLoop = () => {
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
    

    this.renderer.render(this.scene, this.camera);

    // The window.requestAnimationFrame() method tells the browser that you wish to perform
    // an animation and requests that the browser call a specified function
    // to update an animation before the next repaint
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;

    // Note that after making changes to most of camera properties you have to call
    // .updateProjectionMatrix for the changes to take effect.
    this.camera.updateProjectionMatrix();
  };

 
  addSilenA(){
    const objName = "silen"
    this.removeParts(objName)
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0x002534,
      side: THREE.DoubleSide,
      flatShading: true
    });
    const geometry21 = new THREE.BoxGeometry(0.8, 0.5, 1);
    this.cube21 = new THREE.Mesh(geometry21, material);
    this.cube21.name = objName
    this.cube21.position.set(2, 1, 0);
    this.cube21.castShadow =true;
    this.scene.add(this.cube21);

    const geometry22 = new THREE.BoxGeometry(0.8, 0.5, 1);
    this.cube22 = new THREE.Mesh(geometry22, material);
    this.cube22.name = objName
    this.cube22.position.set(-2, 1, 0);
    this.cube22.castShadow =true;
    this.cube22.receiveShadow=true;
    this.scene.add(this.cube22);
  }
  //サイレンBを追加する
 addSilenB(){
   const objName = "silen"
    this.removeParts(objName)
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0xff2534,
      side: THREE.DoubleSide,
      flatShading: true
    });
    const geometry21 = new THREE.BoxGeometry(0.3, 0.5, 1);
    this.cube21 = new THREE.Mesh(geometry21, material);
    this.cube21.name = objName
    this.cube21.position.set(2, 1, 0);
    this.scene.add(this.cube21);

    const geometry22 = new THREE.BoxGeometry(0.3, 0.5, 1);
    this.cube22 = new THREE.Mesh(geometry22, material);
    this.cube22.name = objName
    this.cube22.position.set(-2, 1, 0);
    this.scene.add(this.cube22);
  }
    //サイレンBを追加する
 addSilenC(){
   const objName = "silen"
    this.removeParts(objName)
    const material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      emissive: 0xff25ff,
      side: THREE.DoubleSide,
      flatShading: true
    });
    const geometry21 = new THREE.BoxGeometry(0.5, 0.9, 1);
    this.cube21 = new THREE.Mesh(geometry21, material);
    this.cube21.name = objName
    this.cube21.position.set(2, 1, 0);
    this.scene.add(this.cube21);

    const geometry22 = new THREE.BoxGeometry(0.5, 0.9, 1);
    this.cube22 = new THREE.Mesh(geometry22, material);
    this.cube22.name = objName
    this.cube22.position.set(-2, 1, 0);
    this.scene.add(this.cube22);
  }
  changeWireframeSetting(){
    this.material.wireframe ? this.material.wireframe =false : this.material.wireframe= true;
  }
  //指定されたオブジェクトを削除
  removeParts(objName){
    // console.log("remove")
    // console.log(this.cube21)
    // this.scene.remove(this.cube21)
    // this.scene.remove(this.cube22)
    while(this.scene.getObjectByName(objName)!== undefined){
      this.scene.remove(this.scene.getObjectByName(objName))
    }
    
  }
  render() {
    return (
      <div style={style} ref={ref => (this.el = ref)}>
        <button
          onClick={() =>
            this.addSilenA()
          }
        >
          サイレンA
        </button>
        <button
          onClick={() =>
            this.addSilenB()
          }
        >
          サイレンB
        </button>
        <button
          onClick={() =>
            this.addSilenC()
          }
        >
          サイレンC
        </button>
        <button
          onClick={() =>
            this.removeParts("silen")
          }
        >
        サイレン消す
        </button>
        <button
          onClick={() =>
            this.changeWireframeSetting
        ()
          }
        >
        ワイヤフレーム
        </button>    
     
        <br/><br/>
      </div>

      
    );
  }
}


class Container extends React.Component {
  state = { isMounted: true };
 
  render() {
    const { isMounted = true } = this.state;
    return (
      <>
        <button
          onClick={() =>
            this.setState(state => ({ isMounted: !state.isMounted }))
            
          }
        >
          {isMounted ? "Unmount" : "Mount"}
        </button><br/><br/>
            
        {isMounted && <App />}
        {isMounted && <div>Scroll to zoom, drag to rotate</div>}
      </>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Container />, rootElement);
