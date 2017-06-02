var camera, scene, renderer;
var container;
var objeto1;
var objeto2;
var objeto3;
var objeto4;

init();
render();

function init() {
  //container
  container = document.createElement('div');
  document.body.appendChild(container);

  //camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(25, 15, 55);

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
  var planeMaterial = new THREE.MeshBasicMaterial();
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.set(0, 10, 0);
  scene.add(plane);

  //ambient light
  var ambient = new THREE.AmbientLight(0xfffff1);
  scene.add(ambient);

  //set another light
  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(10,-100, 100);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 500;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;
  scene.add(spotLight);

  //mtl = textura e cor
  var mtlLoaderObjeto1 = new THREE.MTLLoader();
  mtlLoaderObjeto1.setPath('obj/');
  mtlLoaderObjeto1.load('wanda.mtl', function(materials) {
    materials.preload();
    var objeto1 = new THREE.OBJLoader();
    objeto1.setMaterials(materials);
    objeto1.setPath('obj/');
    objeto1.load('wanda.obj', function(object) {
      object.scale.set(25,25,25);
      object.position.set(-20, 0, 15);
      scene.add(object);
    });
  });

  //mtl = textura e cor
  var mtlLoaderObjeto2 = new THREE.MTLLoader();
  mtlLoaderObjeto2.setPath('obj/');
  mtlLoaderObjeto2.load('cosmo.mtl', function(materials) {
    materials.preload();
    var objeto2 = new THREE.OBJLoader();
    objeto2.setMaterials(materials);
    objeto2.setPath('obj/');
    objeto2.load('cosmo.obj', function(object) {
      object.scale.set(25,25,25);
      object.position.set(0, 0, 10);
      scene.add(object);
    });
  });

  //mtl = textura e cor
  var mtlLoaderObjeto3 = new THREE.MTLLoader();
  mtlLoaderObjeto3.setPath('obj/');
  mtlLoaderObjeto3.load('wanda.mtl', function(materials) {
    materials.preload();
    var objeto3 = new THREE.OBJLoader();
    objeto3.setMaterials(materials);
    objeto3.setPath('obj/');
    objeto3.load('wanda.obj', function(object) {
      object.scale.set(25,25,25);
      object.position.set(10, 0, -15);
      scene.add(object);
    });
  });

  //mtl = textura e cor
  var mtlLoaderObjeto4 = new THREE.MTLLoader();
  mtlLoaderObjeto4.setPath('obj/');
  mtlLoaderObjeto4.load('cosmo.mtl', function(materials) {
    materials.preload();
    var objeto4 = new THREE.OBJLoader();
    objeto4.setMaterials(materials);
    objeto4.setPath('obj/');
    objeto4.load('cosmo.obj', function(object) {
      object.scale.set(25,25,25);
      object.position.set(30, 0, -20);
      scene.add(object);
    });
  });

  //camera look at
  camera.lookAt(plane.position);


  // HELPERS

  // CAMERA HELPER
  //var spotLightHelper = new THREE.SpotLightHelper( spotLight );
  //scene.add( spotLightHelper );

  // AXIS HELPER
  //var axisHelper = new THREE.AxisHelper( 5 );
  //scene.add(axisHelper);
}

function render(){
  requestAnimationFrame(render);
  renderer.render(scene, camera);

  scene.rotation.y += 0.01;
}
