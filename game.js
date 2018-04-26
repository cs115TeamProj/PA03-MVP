Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = '/js/ammo.js';

//sounds
var StartSound = new Audio("Sounds/StartSound.wav");
var ExplodeSound = new Audio("Sounds/ExplodeSound.wav");
var ExpandSounds = [new Audio("Sounds/moveSound1.wav"), new Audio("Sounds/moveSound2.wav"), new Audio("Sounds/moveSound3.wav"), new Audio("Sounds/moveSound4.wav"), new Audio("Sounds/moveSound5.wav")];
var LoseSound			= new Audio("Sounds/LoseSound.wav");
var PoisonSound 	= new Audio("Sounds/PoisonSound.wav");
var endScene, loseScene, startScene, endCamera, loseCamera, startCamera, endText, startText;

var geometry = new THREE.SphereGeometry(50, 60, 40);
geometry.scale(-1, 1, 1);

var material = new THREE.MeshBasicMaterial({
				map: new THREE.TextureLoader().load('../images/ocean.jpg') //sets background iamge
			});
			mesh = new THREE.Mesh(geometry, material);

var scene = new Physijs.Scene();
var camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 30;
camera.lookAt(0,0,0);

var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
var floor;
var wallBack, wallLeft, wallRight, wallFront;
var dudes = [];
var food;
var lifeBar;
var allPoison=[];
var poison;
var light1 = new THREE.AmbientLight( 0xffffff,0.95);
var light2 = new THREE.SpotLight( 0x0000ff);
var gameState = {level:1, energy:10, speed: 10, reset: false, scene:'start', camera:'none' };

var controls = {
    left: false,
    right: false,
    forward: false,
    backward: false,
    camLeft: false,
    camRight: false,
    camForward: false,
    camBack: false
};

var colors=[];
var green = 0x48f442;
var yellow= 0xe5f441;
var red   = 0xf44141;
var blue  = 0x0099ff;

colors.push(green);
colors.push(yellow);
colors.push(red);
colors.push(blue);


window.addEventListener("keydown", function(event){
    switch(event.key)
    {
        case("w"):{
          controls.forward = true;
        }; break;
        case("s"):{
          controls.backward = true;
        }; break;
        case("a"):{
          controls.left = true;
        }; break;
        case("d"):{
          controls.right = true;
        }; break;
        case("ArrowLeft"):{
          controls.camLeft = true;
        }; break;
        case("ArrowRight"):{
          controls.camRight = true;
        }; break;
        case("ArrowUp"):{
          controls.camForward = true;
        }; break;
        case("ArrowDown"):{
          controls.camBack = true;
        }; break;
        case ("p"):{
        	gameState.scene="main";
        }; break;
    };
});

function createSkyBox(image,k){
	// creating a textured plane which receives shadows

	var geometry = new THREE.SphereGeometry( 80, 80, 80 );
	var texture = new THREE.TextureLoader().load( '../images/'+image );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( k, k );
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
	//var pmaterial = new Physijs.createMaterial(material,0.9,0.5);
	//var mesh = new THREE.Mesh( geometry, material );
	var mesh = new THREE.Mesh( geometry, material, 0 );

	mesh.receiveShadow = false;


	return mesh
	// we need to rotate the mesh 90 degrees to make it horizontal not vertical


}
function createStartBox(image){
	// creating a textured plane which receives shadows
	var planeGeometry = new THREE.PlaneGeometry( 80, 80, 80 );
	var texture = new THREE.TextureLoader().load( '../images/'+image );
	var planeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff,  map: texture ,side:THREE.DoubleSide} );
	planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
	scene.add(planeMesh);
	planeMesh.position.x = 0;
	planeMesh.position.y = 0;
	planeMesh.position.z = 5;
	planeMesh.rotation.x = -Math.PI/2;
	planeMesh.receiveShadow = false;
	return planeMesh



}

window.addEventListener("keyup", function(event){
    switch(event.key)
    {
        case("w"):{
          controls.forward = false;
        }; break;
        case("s"):{
          controls.backward = false;
        }; break;
        case("a"):{
          controls.left = false;
        }; break;
        case("d"):{
          controls.right = false;
        }; break;
        case("ArrowLeft"):{
          controls.camLeft = false;
        }; break;
        case("ArrowRight"):{
          controls.camRight = false;
        }; break;
        case("ArrowUp"):{
          controls.camForward = false;
        }; break;
        case("ArrowDown"):{
          controls.camBack = false;
        }; break;
    };
});

function isPoison(obj) {

  for (var i=0; i<allPoison.length; i++) {
    var poison=allPoison[i];
    if (poison==obj) return poison;

  }
  return null;

}

function addPoison() {
      var poisonCount = 0;
      var poison;
      var loader = new THREE.JSONLoader();
      // load a resource
      if(gameState.level == 1){
          poisonCount = 1;
      } else if (gameState.level >= 2){
          poisonCount = 5;
      }
      for(var i = 0; i < poisonCount; i++){
          loader.load(
              // resource URL
              'models/banana.json',
              // onLoad callback
              function ( geometry, materials ) {
                  var material = new THREE.MeshLambertMaterial( { color: 0x000000} );
                  // var object = new THREE.Mesh( geometry, material );
                  var poisonMat     = new Physijs.createMaterial( material, .4, .2);
                  var poisonGeom = geometry;
                  poisonGeom.scale(.5, .5, .5);
                  poison = new Physijs.BoxMesh( poisonGeom, poisonMat);

                  poison.castShadow    = true;
                  poison.receiveShadow = false;
                  //banana.position.set(X, Y, Z);
                  var fX = randomInt(-18, 18);
                  var fY = randomInt(-18, 18);
                  poison.position.set(fX, 0, fY);
                  allPoison.push(poison)
                  scene.add(poison);
              },

              // onProgress callback
              function ( xhr ) {
                  console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
              },

              // onError callback
              function( err ) {
                  console.log( 'An error happened' );
              }
          );
      }
}

function addFoods() {
  var foodSize = .5;
  if (gameState.level >= 3){
    foodSize = .1;
  }
  var loader = new THREE.JSONLoader();
  // load a resource
  loader.load(
      // resource URL
      'models/banana.json',
      // onLoad callback
      function ( geometry, materials ) {
          var material = new THREE.MeshLambertMaterial( { color: 0xffff00} );
          // var object = new THREE.Mesh( geometry, material );
          var pcubeMat     = new Physijs.createMaterial( material, .9, .1);
          var bananaGeom = geometry;
          bananaGeom.scale(foodSize, foodSize, foodSize);
          food = new Physijs.BoxMesh( bananaGeom, pcubeMat);
          food.castShadow    = true;
          food.receiveShadow = false;
          //banana.position.set(X, Y, Z);
          var fX = randomInt(-18, 18);
          var fY = randomInt(-18, 18);
          food.position.set(fX, 0, fY);
          scene.add(food);
      },

      // onProgress callback
      function ( xhr ) {
          console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
      },

      // onError callback
      function( err ) {
          console.log( 'An error happened' );
      }
  );
}

function createDude(scale, X, Y, Z) {

    if (gameState.level == 1 && dudes.length >= 3){
        levelUp(2);
        return;
    } else if (gameState.level ==2 && dudes.length >=5){
        levelUp(3);
        return;
    }
    var dude;
    var currentColor = colors[randomInt(0, colors.length-1)];
    var loader = new THREE.JSONLoader();
    // load a resource
    loader.load(
        // resource URL
        'models/suzanne.json',
        // onLoad callback
        function ( geometry, materials ) {
            var material = new THREE.MeshLambertMaterial( { color:currentColor ,opacity: 0.95,transparent:true});
            // var object = new THREE.Mesh( geometry, material );
            var pcubeMat     = new Physijs.createMaterial( material, .9, .5);
            var dudeGeom = geometry;
            dudeGeom.scale(scale, scale, scale);
            dude = new Physijs.BoxMesh( dudeGeom, pcubeMat);
            dudes.push(dude);
            dude.castShadow    = true;
            dude.receiveShadow = false;
            dude.position.set(X, Y, Z);
            scene.add( dude );
            dude.addEventListener( 'collision',
        				function( other_object, relative_velocity, relative_rotation, contact_normal ) {
									var touched_poison=isPoison(other_object);
          					if (other_object==food){
                        //add more food
                        foodX = randomInt(-18, 18);
                        foodZ = randomInt(-18, 18);
            						food.position.set(foodX, 0, foodZ);
            						food.__dirtyPosition = true;

                        //made dude bigger by deleting dude and creating a new bigger one in its place because physijs is a doofus
                        var dudeX = dude.position.x;
                        var dudeY = dude.position.y;
                        var dudeZ = dude.position.z;
                        scale += 1;
                        var dudeIndex;
                        if (scale >=5){
                            dudeIndex = dudes.indexOf(this);
                            scene.remove(this);
                            dudes.splice(dudeIndex, 1);
                            for (var a=0; a<2; a++){
                                createDude(1, dudeX, dudeY, dudeZ);
																console.log("creating dude");
                            }
                            scale = 1;
                            ExpandSounds[randomInt(0, ExpandSounds.length-1)].play();
                        } //in this else statement it messes up the size of the array
												else {
                            dudeIndex = dudes.indexOf(this);
                            scene.remove(this);
                            dudes.splice(dudeIndex, 1);
                            createDude(scale, dudeX, dudeY, dudeZ);
                            ExpandSounds[randomInt(0, ExpandSounds.length-1)].play();
                        }
												console.log("the size of the array is (after touching yellow banana)" + dudes.length);
												console.log(dudes);
          					} else if(other_object==touched_poison) {
                        //add more poision
                        var foodX = randomInt(-18, 18);
                        var foodY = randomInt(-18, 18);
                        touched_poison.position.set(foodX, 0, foodY);
                        touched_poison.__dirtyPosition = true;
                        reduceEnergy();
                        // //made dude bigger by deleting dude and creating a new bigger one in its place because physijs is a doofus
                        // var dudeX = dude.position.x;
                        // var dudeY = dude.position.y;
                        // var dudeZ = dude.position.z;
                        // var dudeIndex;
                        // dudeIndex = dudes.indexOf(this);
                        // scene.remove(this);
                        // dudes.splice(dudeIndex, 1);
                        // createDude(scale, dudeX, dudeY, dudeZ);
                        PoisonSound.play();
                    }
        				}
        		)
            scene.add( dude );
        },

        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // onError callback
        function( err ) {
            console.log( 'An error happened' );
        }
    );


}

function levelUp(newLevel){
		ExplodeSound.play();
    console.log("level up to "+newLevel);
    gameState.level = newLevel;

    //clear all dudes and start again with just one
    for (var i=0; i<dudes.length; i++){
        scene.remove(dudes[i]);
    }
    dudes = [];
    createDude(2,0,0,4);

    //clear poisons and add new
    for (var i=0; i<allPoison.length; i++){
        scene.remove(allPoison[i]);
    }
    allPoison = [];
    addPoison();

    //clear food and add new food
    scene.remove(food);
    addFoods();

}
function createStartScene(){
		startScene = new Physijs.Scene();
		startText = createStartBox("START.png");
		startScene.add(startText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		startScene.add(light1);
		startCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		startCamera.position.set(0,50,1);
		startCamera.lookAt(0,0,0);
	}

function createLoseScene(){
		loseScene = new Physijs.Scene();
		loseText = createSkyBox('lose.jpg',7);
		loseScene.add(loseText);
		var light1 = createPointLight();
		light1.position.set(0,200,20);
		loseScene.add(light1);
		loseCamera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );
		loseCamera.position.set(0,50,1);
		loseCamera.lookAt(0,0,0);
	}


	function createPointLight(){
		var light;
		light = new THREE.PointLight( 0xffffff);
		light.castShadow = true;
		//Set up shadow properties for the light
		light.shadow.mapSize.width = 2048;  // default
		light.shadow.mapSize.height = 2048; // default
		light.shadow.camera.near = 0.5;       // default
		light.shadow.camera.far = 500      // default
		return light;
	}



function reduceEnergy(){

	document.getElementById("eb_"+gameState.energy).style.visibility="hidden";
  gameState.energy -= 1;
  if (gameState.energy <1){
			LoseSound.play()
      console.log("game over");
			gameState.scene="lose";
  }
}

function newWall(){
  var wallGeometry  = new THREE.PlaneGeometry( 40, 20, 100 );
  var wallMaterial  = new THREE.MeshLambertMaterial({ color: 0x0000ff, opacity: 0, transparent: true } );
  var pwallMat      = new Physijs.createMaterial( wallMaterial, .9, .5);
  return (new Physijs.BoxMesh( wallGeometry, pwallMat, 0));
}

function positioningWall(wall, x, y, z){
	wall.castShadow = false;
	wall.receiveShadow = true;
	wall.position.x = x;
	wall.position.y = y;
	wall.position.z = z;
}


function init(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    var container = document.createElement( 'div' );
    container.style.position = 'relative';
    document.body.appendChild( container );

    var foreground = document.getElementById('world');
    container.appendChild( renderer.domElement ); //puts the canvas onto the page

    window.addEventListener('resize', handleWindowResize, false);

    var floorGeometry = new THREE.PlaneGeometry( 40, 40, 128 );
    var floorMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, opacity: 0, transparent: true  } );
    var pfloorMat     = new Physijs.createMaterial( floorMaterial, .9, .5);
    floor             = new Physijs.BoxMesh( floorGeometry, pfloorMat, 0);

    floor.castShadow    = false;
    floor.receiveShadow = true;
    floor.rotation.x    = -Math.PI/2;
    floor.position.y    = -6;
    floor.position.z    = -1;
    scene.add( floor );

    wallBack          = newWall();
    wallLeft          = newWall();
    wallRight         = newWall();
    wallFront         = newWall();

		positioningWall(wallBack, 0 , 4, -21);
    wallBack.rotateX(Math.PI);
    scene.add( wallBack );

		positioningWall(wallLeft, -20 , 4, -1);
    wallLeft.rotateY(-Math.PI/2);
    scene.add( wallLeft );

		positioningWall(wallRight, 20 , 4, -1);
    wallRight.rotateY(Math.PI/2);
    scene.add( wallRight );

		positioningWall(wallFront, 0 , 4, 19);
    // wallFront.rotateX(Math.PI);
    scene.add( wallFront );

    createDude(2, 0, 0, 4);
    light1.position.set( 0, 10, 0 );
    scene.add( light1 );
    light2.castShadow = true;
    light2.position.set( 0, 10, 0 );
    scene.add( light2 );

    scene.add(mesh);
		createLoseScene();
		createStartScene();

    var posionG       = new THREE.SphereGeometry( .5, 10, 10 );
    var pMaterial     = new THREE.MeshLambertMaterial({ color: 000000 });
    var poisonMat     = new Physijs.createMaterial( pMaterial, .9, .5);
    poison            = new Physijs.SphereMesh( posionG, poisonMat);
    var pX            = randomInt(-18, 18);
    var pY            = randomInt(-18, 18);
    poison.position.set(pX, 0, pY)

    addPoison();
    addFoods();


    StartSound.play();
    }

    function handleWindowResize() {
    	// update height and width of the renderer and the camera
    	HEIGHT = window.innerHeight;
    	WIDTH = window.innerWidth;
    	renderer.setSize(WIDTH, HEIGHT);
    	camera.aspect = WIDTH / HEIGHT;
    	camera.updateProjectionMatrix();
    }

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function update_camera(){
  if(controls.camLeft){
    camera.translateX(-1);
    camera.__dirtyPosition = true;
  }
  if(controls.camRight){
    camera.translateX(1);
    camera.__dirtyPosition = true;
  }
  if(controls.camForward){
    camera.translateZ(-1);
    camera.__dirtyPosition = true;
  }
  if(controls.camBack){
    camera.translateZ(1);
    camera.__dirtyPosition = true;
  }
  camera.lookAt(0,0,0);
}

function updateDude(){
  if (gameState.level >= 2){
    gameState.speed = 20;
  }
  if(controls.left){
    dudes.forEach(function(element) {
        element.setLinearVelocity(new THREE.Vector3(-gameState.speed,0,0));
    });
  }
  if(controls.right){
    dudes.forEach(function(element) {
        element.setLinearVelocity(new THREE.Vector3(gameState.speed,0,0));
    });
  }
  if(controls.forward){
    dudes.forEach(function(element) {
        element.setLinearVelocity(new THREE.Vector3(0,0,-gameState.speed));
    });
  }
  if(controls.backward){
    dudes.forEach(function(element) {
        element.setLinearVelocity(new THREE.Vector3(0,0,gameState.speed));
    });
  }

}
var info = document.getElementById("game_info");

function animate() {
    requestAnimationFrame( animate );

    scene.simulate();
    renderer.clear();
  	switch(gameState.scene){
				case ("main"): {
						console.log("main scene");
						updateDude();
						update_camera();
						renderer.render( scene, camera );
				}; break;
				case ("start"):{
						console.log("start scene");
						renderer.render( startScene, startCamera );
				}; break;
				case ("lose"): {
						renderer.render( loseScene, loseCamera );
						info.style.visibility="hidden";
				}; break;
		}
		info.innerHTML="Level: " + gameState.level;
}


init();
animate();
