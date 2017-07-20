var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light, personagem;
var angle = 0;
var position = 0;

// direction vector for movement
var direction = new THREE.Vector3(1, 0, 0);
var up = new THREE.Vector3(0, 0, 1);
var axis = new THREE.Vector3();

// scalar to simulate speed
var speed = 100;

// animation
var mixer, animationClip;
var clock = new THREE.Clock();
var stats = new Stats();


init();

function init(){
    //cena e camera
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, -10);
    camera.lookAt(new THREE.Vector3(0,2,0));

    //plano no chao
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(40,20, 10,10),
		new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = true;
    meshFloor.position.y = -2;
	scene.add(meshFloor);

    //luz ambiente
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambientLight);

    //luz
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);

    // render
    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    loader = new THREE.JSONLoader();
    loader.load('obj/Charmander.json', addModel);
    
    putObject();

    //Orbit control
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.25;
    //controls.enableZoom = true;


    //controle do personagem
    document.addEventListener("keydown", Keyboard, false);
    function Keyboard(event){
        var speedPers = 0.1;
        if(event.keyCode == 37) {
            personagem.position.x += speedPers;
        }
        else if(event.keyCode == 39) {
            personagem.position.x -= speedPers;
        }
        else if(event.keyCode == 40) {
            personagem.position.z -= speedPers;
        }
        else if(event.keyCode == 38) {
            personagem.position.z += speedPers;
        }
    }
}

function addModel(geometry, materials){
  materials.forEach(function (mat){
    mat.skinning = true;});

  personagem = new THREE.SkinnedMesh(geometry, materials);

  scene.add(personagem);

  mixer = new THREE.AnimationMixer( personagem );
  mixer.clipAction('Idle').play();
  mixer.timeScale = 35;

  animate();
} 

// render
function render() {
  renderer.render(scene, camera);

  move();

  if(personagem.position.x > mesh.position.x - 0.5 && 
      personagem.position.x < mesh.position.x + 0.5 &&
      personagem.position.z > mesh.position.z - 0.5 &&
      personagem.position.z < mesh.position.z + 0.5) {
    removeEntity(mesh);
    putObject();
  }
}

// animate
function animate() {
  requestAnimationFrame(animate);
  mixer.update( clock.getDelta() );
  stats.update();
  render();
}

// ---------------------------- funcoes para fazer o objeto a ser pego ---------
function putObject() {
  // ------------- OBJETO A SER PEGO ------------------
  // material
  var material = new THREE.MeshPhongMaterial({
    color: 0x228B22,
    shading: THREE.FlatShading
  });
  // geometry
  var geometry = new THREE.SphereGeometry(0.5, 50, 50, 0, Math.PI * 2, 0, Math.PI * 2);
  // mesh
  mesh = new THREE.Mesh(geometry, material);
  mesh.name = "bola";
  scene.add(mesh);

  var randomSignal;
  if(Math.random() * 10 > 5)
    randomSignal = 1;
  else
    randomSignal = -1;

  //mesh.position.set(Math.random() * 10 * randomSignal, 0, Math.random() * 10 * randomSignal);
  //--------------- CAMINHO EM UM CURVA DE BEZIER QUE O OBJETO SE MOVIMENTA ----------
  // the path
  /*path = new THREE.CubicBezierCurve3(
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 7, 1, -7 ),
      new THREE.Vector3( -7, 1, 7 ),
      new THREE.Vector3( 0, 0, 0 )
  );*/

  var a = Math.random() * 10 * randomSignal;
  var b = Math.random() * 10 * randomSignal;

  path = new THREE.CubicBezierCurve3(
      new THREE.Vector3(b, 0, b),
      new THREE.Vector3(a, 1, a * -1),
      new THREE.Vector3(a * -1, 1, a),
      new THREE.Vector3(b, 0, b)
  );

  drawPath();
  // Start angle and point
  previousAngle = getAngle( position );
  previousPoint = path.getPointAt( position );
  //-------------------- FIM DO OBJETO A SER PEGO--------------------------
}

function drawPath() {
  var vertices = path.getSpacedPoints(5);

  // Change 2D points to 3D points
  for (var i = 0; i < vertices.length; i++) {
    point = vertices[i]
    vertices[i] = new THREE.Vector3(point.x, point.y, 0);
  }
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices = vertices;
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  var line = new THREE.Line(lineGeometry, lineMaterial)
  //scene.add(line);
}

function move() {
  // add up to position for movement
  position += 0.005;

  if(position > 1)
    position = 0;

  // get the point at position
  var point = path.getPointAt(position);
  mesh.position.x = point.x;
  mesh.position.y = point.y;

  var angle = getAngle(position);
  // set the quaternion
  mesh.quaternion.setFromAxisAngle( up, angle );
  previousPoint = point;
  previousAngle = angle;
}

function getAngle( position ){
// get the 2Dtangent to the curve
  var tangent = path.getTangent(position).normalize();
  // change tangent to 3D
  angle = - Math.atan( tangent.x / tangent.y);
  return angle;
}
// ---------------------- FINAL do trajeto do objeto a ser pego ------------

function removeEntity(object) {
  var selectedObject = scene.getObjectByName(object.name);
  scene.remove( selectedObject );
}