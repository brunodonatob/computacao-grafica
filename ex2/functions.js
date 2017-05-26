var camera, scene, renderer;
var container;
var objeto;
var objeto2;

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
  renderer.setClearColor( 0x2952A3 );
  container.appendChild(renderer.domElement);

  //plane for the ground
  var planeGeometry = new THREE.PlaneBufferGeometry(0.001, 0.001, 0.001);
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
  mtlLoader.load('cosmo.mtl', function(materials) {
    materials.preload();
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('obj/');
    objLoader.load('cosmo.obj', function(object) {
      object.scale.set(25,25,25);
      object.position.set(20, 5, -5);
      scene.add(object);
      objeto = object;
    });
  });

  //mtl = textura e cor
  var mtlLoader2 = new THREE.MTLLoader();
  mtlLoader.setPath('obj/');
  mtlLoader.load('wanda.mtl', function(materials) {
    materials.preload();
    var objLoader2 = new THREE.OBJLoader();
    objLoader2.setMaterials(materials);
    objLoader2.setPath('obj/');
    objLoader2.load('wanda.obj', function(object) {
      object.scale.set(25,25,25);
      object.position.set(-20, 5, -5);
      scene.add(object);
      objeto2 = object;
    });
  });

  //camera look at
  camera.lookAt(plane.position);
}

function render(){
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  objeto.rotation.y -= 0.01;
  objeto2.rotation.y += 0.01;
}
