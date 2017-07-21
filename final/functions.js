var scene, camera1, camera3, renderer, mesh;
var meshFloor, ambientLight, light, personagem;
var angle = 0;
var position = 0;
var c = 60; //TIMER DO CONTADOR. Sugerido: 60s
var pokebolas = 0;

// direction vector for movement
var direction = new THREE.Vector3(1, 0, 0);
var up = new THREE.Vector3(0, 0, 1);
var axis = new THREE.Vector3();
var id;

// scalar to simulate speed
var speed = 100;

// animation
var animationClip, mixer;
var clock = new THREE.Clock();
var stats = new Stats();

// camera mode
var cameraMode = 3;

var xz = false; // true == x, false == z

init();
//animate();

function init(){
    //cena e camera
	scene = new THREE.Scene();
	camera3 = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
  camera3.position.set(0, 12, -10);
  camera3.lookAt(new THREE.Vector3(0,2,0));

  camera1 = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 3, 1000);
  camera1.position.set(0, 2, 0);
  camera1.lookAt(new THREE.Vector3(0,2,0));

    //plano no chao
		textureFloor();
    //luz ambiente
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
	//scene.add(ambientLight);

	//luz do personagem
	light = new THREE.PointLight(0xffffff, 2, 10);
	light.position.set(0, 3, -1);
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

    //personagem
    loader = new THREE.JSONLoader();
    loader.load('obj/Charmander.json', addModel);

	//lanterna


    // objeto a ser pego
    putObject();

    //Orbit control
    //controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.25;
    //controls.enableZoom = true;

	//controle do personagem
    document.addEventListener("keydown", Keyboard, false);
    //document.addEventListener("keyup", Keyboard, true);
    function Keyboard(event) {
        var speedPers = 0.2;

        if(event.keyCode == 67) {
          if(cameraMode == 3)
            cameraMode = 1;
          else
            cameraMode = 3;
        }

        if(cameraMode == 3) {
          if(event.keyCode == 37) {
            mixer.clipAction('Idle').stop();
            mixer.clipAction('Walk').play();
            personagem.rotation.y = THREE.Math.degToRad( 90 );
            personagem.position.x += speedPers;
			light.rotation.y = THREE.Math.degToRad( 90 );
            light.position.x += speedPers;
          }
          else if(event.keyCode == 39) {
            mixer.clipAction('Idle').stop();
            mixer.clipAction('Walk').play();
            personagem.rotation.y = THREE.Math.degToRad( 270 );
            personagem.position.x -= speedPers;
			light.rotation.y = THREE.Math.degToRad( 270 );
            light.position.x -= speedPers;
          }
          else if(event.keyCode == 40) {
            mixer.clipAction('Idle').stop();
            mixer.clipAction('Walk').play();
            personagem.rotation.y = THREE.Math.degToRad( 180 );
            personagem.position.z -= speedPers;
  		    light.rotation.y = THREE.Math.degToRad( 180 );
            light.position.z -= speedPers;
          }
          else if(event.keyCode == 38) {
            mixer.clipAction('Idle').stop();
            mixer.clipAction('Walk').play();
            personagem.rotation.y = THREE.Math.degToRad( 0 );
            personagem.position.z += speedPers;
			light.rotation.y = THREE.Math.degToRad( 0 );
            light.position.z += speedPers;
          }
        }
        else {
          if(event.keyCode == 37) {
            //mixer.clipAction('Idle').stop();
            //mixer.clipAction('Walk').play();
            personagem.rotation.y += THREE.Math.degToRad( 90 );
            camera1.rotation.y += THREE.Math.degToRad( 90 );
            if(xz)
              xz = false;
            else
              xz = true;
          }
          else if(event.keyCode == 39) {
            //mixer.clipAction('Idle').stop();
            //mixer.clipAction('Walk').play();
            personagem.rotation.y -= THREE.Math.degToRad( 90 );
            camera1.rotation.y -= THREE.Math.degToRad( 90 );

            if(xz)
              xz = false;
            else
              xz = true;
          }
          else if(event.keyCode == 40) {

            if(xz) {
              camera1.position.x -= speedPers;
              personagem.position.x -= speedPers;
			  light.position.x -= speedPers;
            }
            else {
              camera1.position.z -= speedPers;
              personagem.position.z -= speedPers;
              light.position.z -= speedPers;
            }
          }
          else if(event.keyCode == 38) {

            if(xz) {
              camera1.position.x += speedPers;
              personagem.position.x += speedPers;
              light.position.x += speedPers;
            }
            else {
              camera1.position.z += speedPers;
              personagem.position.z += speedPers;
              light.position.z += speedPers;
            }
          }
        }

    }

    var down = false;
    document.addEventListener('keydown', function (){
        down = true;
    }, false);

    document.addEventListener('keyup', function (){
        if(down === true){
            mixer.clipAction('Idle').play();
            mixer.clipAction('Walk').stop();
        }
        else{
            alert('Omnibox. Ignore it.');
        }
        down = false;
    }, false);
		contador();

}

function contador(){
	timedCount();
	var t = 0;

	function timedCount() {
		var l = 0;
		if(c == 0){ //1 min para pegar os objetos
			l = document.getElementById("contador");
			if(pokebolas > 0 && pokebolas < 5)
				l.innerHTML = "TEMPO ESGOTADO! "+pokebolas+" pokébolas capturadas! Treine mais!";
			else if(pokebolas >= 5 && pokebolas < 10)
				l.innerHTML = "TEMPO ESGOTADO! "+pokebolas+" pokébolas capturadas! Showw";
			else
				l.innerHTML = "TEMPO ESGOTADO! "+pokebolas+" pokébolas capturadas! MESTRE POKEMON?!";
			stopCount();
			alert('O tempo esgotou! Pressione F5 para jogar novamente.');
			cancelAnimationFrame(id);
		}else{
			l = document.getElementById("contador");
			l.innerHTML = c + " s";
			c--;
			t = setTimeout(function(){ timedCount() }, 1000);
		}
}

function stopCount() {
    clearTimeout(t);
}
}

function addModel(geometry, materials){
  materials.forEach(function (mat){
    mat.skinning = true;});

  personagem = new THREE.SkinnedMesh(geometry, materials);

  personagem.scale.set(1/2, 1/2, 1/2);

  scene.add(personagem);

  mixer = new THREE.AnimationMixer( personagem );
  mixer.clipAction('Idle').play();
  mixer.timeScale = 35;

  animate();
}

// render
function render() {

  if(cameraMode == 3)
    renderer.render(scene, camera3);
  else
    renderer.render(scene, camera1);

  move();

  if(personagem.position.x > mesh.position.x - 0.5 &&
      personagem.position.x < mesh.position.x + 0.5 &&
      personagem.position.z > mesh.position.z - 0.5 &&
      personagem.position.z < mesh.position.z + 0.5) {
				pokebolas++;
    removeEntity(mesh);
    putObject();
  }
}

// animate
function animate() {
  id = requestAnimationFrame(animate);
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
    randomSignal = 2;
  else
    randomSignal = -2;

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

function textureFloor(){
var floorTexture = new THREE.ImageUtils.loadTexture( 'textura/ti.jpg' ); //256x256
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 10, 10 );
var floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(40, 20, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x -= Math.PI / 2;
floor.receiveShadow = true;
floor.position.y = -2;
scene.add(floor);

/*
meshFloor = new THREE.Mesh(
	new THREE.PlaneGeometry(40,20, 10,10),
	new THREE.MeshPhongMaterial({color:0xffffff, wireframe:false})
);
meshFloor.rotation.x -= Math.PI / 2;
meshFloor.receiveShadow = true;
	meshFloor.position.y = -2;
scene.add(meshFloor);

*/
}
