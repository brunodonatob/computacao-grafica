var camera, scene, renderer;
var container;
var objeto;

init();
render();

function init() {
  //container
  container = document.createElement('div');
  document.body.appendChild(container);

  //camera
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(0,40,50);

  //scene
  scene = new THREE.Scene();

  //renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( 0xffffff );
  container.appendChild(renderer.domElement);

  //plane for the ground
  var planeGeometry = new THREE.PlaneBufferGeometry(10, 20, 32);
  var planeMaterial = new THREE.MeshBasicMaterial({color: null});
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0,12,-1);
  scene.add(plane);

  //ambient light
  var ambient = new THREE.AmbientLight(0xfffff1);
  scene.add(ambient);

  //set another light
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(100,-100,100);
  spotLight.castShadow = true;
  spotLight.shadowMapWidth = 1024;
  spotLight.shadowMapHeight = 1024;
  spotLight.shadowCameraNear = 500;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 30;
  scene.add(spotLight);

  //mtl = textura e cor
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('obj/');
  mtlLoader.load('StevenUniverse.mtl', function(materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('obj/');
    objLoader.load('StevenUniverse.obj', function(object) {
      object.scale.set(25,25,25);
      scene.add(object);
      objeto = object;
    });
  });

  //camera look at
  camera.lookAt(plane.position);

  window.addEventListener('DOMMouseScroll', mousewheel, false);
  window.addEventListener('mousewheel', mousewheel, false);

}

function render(){
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  //alterando valores dos eixos para executar algum movimento
  //objeto.rotation.z += 0.01;
  objeto.rotation.y += 0.01;
  //objeto.rotation.x += 0.001;

  }

function mousewheel(event) {
    var fovMAX = 160;
    var fovMIN = 1;

    camera.fov -= event.wheelDeltaY * 0.02;
    camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
    camera.updateProjectionMatrix();
}
