var scene, camera1, camera3, renderer, mesh, lamp;
var meshFloor, ambientLight, light, personagem;
var angle = 0;
var position = 0;
var c = 60; //TIMER DO CONTADOR. Sugerido: 60s
var pokebolas = 0;
var candy;
var mtlLoaderObjeto2;
var randomSignal1;
var randomSignal3;
var randomSignal2;
var randomSignal4;


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
  camera1.position.set(0, 1.5, 0);
  camera1.lookAt(new THREE.Vector3(0,1,1));

    //plano no chao
		textureFloor();
    //luz ambiente
	ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  ambientLight.name = "ambientLight";

	//luz do personagem
	light = new THREE.PointLight(0xffffff, 2, 10);
	light.position.set(0, 2, 3);
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

    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath('obj/pkb/');
    mtlLoader.load('pokeball.mtl', function(materials) {
      materials.preload();
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('obj/pkb/');
      objLoader.load('pokeball.obj', function(object) {
        object.scale.set(1/4,1/4,1/4);
        mesh = object;
        mesh.name = "bola";

        // objeto a ser pego
        putObject();
      });
    });

		//candy
	mtlLoaderObjeto2 = new THREE.MTLLoader();
  mtlLoaderObjeto2.setPath('obj/candy/');
  mtlLoaderObjeto2.load('CandyCane.mtl', function(materials) {
		materials.preload();
    var objeto2 = new THREE.OBJLoader();
    objeto2.setMaterials(materials);
    objeto2.setPath('obj/candy/');
    objeto2.load('CandyCane.obj', function(object) {
	    object.scale.set(2,2,2);

    	object.name = "candy";
			if(Math.random() * 10 > 5)
				randomSignal1 = 1;
			else
				randomSignal1 = -1;

			if(Math.random() * 10 > 5)
				randomSignal3 = 1;
			else
				randomSignal3 = -1;

			randomSignal2 = Math.floor(Math.random() * 8) * randomSignal1;
			randomSignal4 = Math.floor(Math.random() * 8) * randomSignal3;
			object.position.set(randomSignal4, 0, randomSignal2);

			candy = object;
    });
  });


    //personagem
    loader = new THREE.JSONLoader();
    loader.load('obj/Charmander.json', addModel);
		//lanterna
    var mtlLoaderObjeto1 = new THREE.MTLLoader();
    mtlLoaderObjeto1.setPath('obj/');
    mtlLoaderObjeto1.load('flame1.mtl', function(materials) {
      materials.preload();
      var objeto1 = new THREE.OBJLoader();
      objeto1.setMaterials(materials);
      objeto1.setPath('obj/');
      objeto1.load('flame1.obj', function(object) {
        object.scale.set(0.4,0.4,0.4);
      object.name = "lamp";

      if(Math.random() * 10 > 5)
        randomSignal1 = 1;
      else
        randomSignal1 = -1;

      if(Math.random() * 10 > 5)
        randomSignal3 = 1;
      else
        randomSignal3 = -1;

      randomSignal2 = Math.floor(Math.random() * 8) * randomSignal1;
      randomSignal4 = Math.floor(Math.random() * 8) * randomSignal3;
      object.position.set(randomSignal4, 0, randomSignal2);
      lamp = object;
      });
    });

  //lanterna
  setTimeout(function(){ putObject2();}, 15000)
	//aparecer doce
	setTimeout(function(){ adicionarElementoSurpresa();}, 45000) //aparece o doce aos 45 segundos


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

        // CAMERA EM TERCEIRA PESSOA
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
        // CAMERA EM PRIMEIRA PESSOA
        else {
          if(event.keyCode == 37) {
            //mixer.clipAction('Idle').stop();
            //mixer.clipAction('Walk').play();
            personagem.position.x += speedPers;
            camera1.position.x += speedPers;
            light.position.x += speedPers;
          }
          else if(event.keyCode == 39) {
            //mixer.clipAction('Idle').stop();
            //mixer.clipAction('Walk').play();
            personagem.position.x -= speedPers;
            camera1.position.x -= speedPers;
            light.position.x -= speedPers;
          }
          else if(event.keyCode == 40) {

            camera1.position.z -= speedPers;
            personagem.position.z -= speedPers;
    			  light.position.z -= speedPers;
          }
          else if(event.keyCode == 38) {

            camera1.position.z += speedPers;
            personagem.position.z += speedPers;
            light.position.z += speedPers;
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

        }
        down = false;
    }, false);
		contador();

}

function contador() {
	timedCount();
	var t = 0;

	function timedCount() {
		var l = 0;
		if(c+1 == 0){ //1 min para pegar os objetos
			l = document.getElementById("contador");
			if(pokebolas > 0 && pokebolas < 5)
				l.innerHTML = "TEMPO ESGOTADO! "+pokebolas+" pokébolas capturadas! Treine mais!";
			else if(pokebolas >= 5 && pokebolas < 10)
				l.innerHTML = "TEMPO ESGOTADO! "+pokebolas+" pokébolas capturadas! Showw";
			else if(pokebolas >= 10)
				l.innerHTML = "TEMPO ESGOTADO! "+pokebolas+" pokébolas capturadas! MESTRE POKEMON?!";
				else {
					l.innerHTML = "TEMPO ESGOTADO! 0 pokébolas capturadas! Poxa :( ";
				}


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

  mesh = scene.getObjectByName("bola");

  if(personagem.position.x > mesh.position.x - 0.5 &&
      personagem.position.x < mesh.position.x + 0.5 &&
      personagem.position.z > mesh.position.z - 0.5 &&
      personagem.position.z < mesh.position.z + 0.5) {
		pokebolas++;
    removeEntity(mesh);
    putObject();
  }

  if(personagem.position.x > lamp.position.x - 0.5 &&
      personagem.position.x < lamp.position.x + 0.5 &&
      personagem.position.z > lamp.position.z - 0.5 &&
      personagem.position.z < lamp.position.z + 0.5) {
        removeEntity(lamp);
        scene.add(ambientLight);
        setTimeout(function(){ removeEntity(ambientLight) }, 5000);
  }else if(personagem.position.x > candy.position.x - 0.5 &&
      personagem.position.x < candy.position.x + 0.5 &&
      personagem.position.z > candy.position.z - 0.5 &&
      personagem.position.z < candy.position.z + 0.5) {
				pokebolas = pokebolas + 5;
        removeEntity(candy);
    		// alert('removi doce!');
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

  var randomSignal;
  if(Math.random() * 10 > 5)
    randomSignal = 1;
  else
    randomSignal = -1;

  //--------------- CAMINHO EM UM CURVA DE BEZIER QUE O OBJETO SE MOVIMENTA ----------
  var a = Math.random() * 10 * randomSignal;
  var b = Math.random() * 10 * randomSignal;

  mesh.position.set(a, 0, b);

  scene.add(mesh);

  // the path
  path = new THREE.CubicBezierCurve3(
      new THREE.Vector3(a, 0, b),
      new THREE.Vector3(a, 1, a * -1),
      new THREE.Vector3(b * -1, 1, b),
      new THREE.Vector3(a, 0, b)
  );

  drawPath();
  // Start angle and point
  previousAngle = getAngle( position );
  previousPoint = path.getPointAt( position );
  //-------------------- FIM DO OBJETO A SER PEGO--------------------------
}

function putObject2() {
  scene.add(lamp);
}

function adicionarElementoSurpresa() {
	scene.add(candy);
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

}
