Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = '/js/ammo.js';
var scene = new Physijs.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 30;
camera.lookAt(0,0,0);

var StartSound = new Audio("Sounds/StartSound.wav");
var ExplodeSound = new Audio("Sounds/ExplodeSound.wav");
var expandSounds = [new Audio("Sounds/moveSound1.wav"), new Audio("Sounds/moveSound2.wav"), new Audio("Sounds/moveSound3.wav"), new Audio("Sounds/moveSound4.wav"), new Audio("Sounds/moveSound5.wav")];

var renderer = new THREE.WebGLRenderer();
var floor;
var wallBack
var wallLeft
var wallRight;
var wallFront;
var dudes = [];
var food;
var allFood=[];
var poision;
var light1 = new THREE.AmbientLight( 0xffffff,0.95);
var light2 = new THREE.SpotLight( 0x0000ff);

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
    };
});

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
function isFood(obj) {
  for (var i=0; i<allFood.length; i++) {
    var c_food=allFood[i];
    if (c_food==obj) return c_food;

  }
  return null;

}

function addFoods() {
    var foodGeometry = new THREE.SphereGeometry( .5, 10, 10 );
    var foodMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    var pfoodMat     = new Physijs.createMaterial( foodMaterial, .9, .5);

    for (var i = 0; i < 5; i++) {
      var food_c             = new Physijs.SphereMesh( foodGeometry, pfoodMat);
      var fX = randomInt(-18, 18);
      var fY = randomInt(-18, 18);
      food_c.position.set(fX, 0, fY);
      allFood.push(food_c)
      scene.add(food_c);
    }
}

var dudeGeometry=null
var dudeMaterial= null

function addDude(scale, X, Y, Z){
  var dude  = new Physijs.BoxMesh( dudeGeometry, dudeMaterial);
  dudes.push(dude);
  dude.castShadow    = true;
  dude.receiveShadow = false;
  dude.position.set(X, Y, Z);
  //var dude = createDude(scale, X, Y, Z);
  scene.add( dude );
  console.log("the dude is " + dude);
  dude.addEventListener( 'collision',
      function( other_object, relative_velocity, relative_rotation, contact_normal ) {
        var foodCand=isFood(other_object);
          if (foodCand==other_object){
              //add more food
              foodX = randomInt(-19, 19);
              foodZ = randomInt(-19, 19);
              foodCand.position.set(foodX, 0, foodZ);
              foodCand.__dirtyPosition = true;

              //made dude bigger by deleting dude and creating a new bigger one in its place because physijs is a doofus
              var dudeX = dude.position.x;
              var dudeY = dude.position.y;
              var dudeZ = dude.position.z;
              var dudeSize = dude.geometry.parameters.height+1;
              var dudeIndex;
              if (dudeSize >=5){
                  dudeIndex = dudes.indexOf(this);
                  scene.remove(this);
                  dudes.splice(dudeIndex, 1);
                  for (var a=0; a<10; a++){
                      addDude(2, dudeX, dudeY, dudeZ);
                  }
                  ExplodeSound.play();
                  console.dir(dudes);
              } else {
                  console.log(dudes.indexOf(this));
                  dudeIndex = dudes.indexOf(this);
                  scene.remove(this);
                  dudes.splice(dudeIndex, 1);
                  console.dir(dudes);
                  addDude(dudeSize, dudeX, dudeY, dudeZ);
                  expandSounds[randomInt(0, expandSounds.length-1)].play();
              }
          } else if(other_object==poision) {
            //add more poision
            var poisionX = randomInt(-19, 19);
            var poisionY = randomInt(-19, 19);
            poision.position.set(poisionX, 0, poisionY);
            poision.__dirtyPosition = true;

            //made dude bigger by deleting dude and creating a new bigger one in its place because physijs is a doofus
            var dudeX = dude.position.x;
            var dudeY = dude.position.y;
            var dudeZ = dude.position.z;
            var dudeSize = dude.geometry.parameters.height-1;
            var dudeIndex;

                dudeIndex = dudes.indexOf(this);
                scene.remove(this);
                dudes.splice(dudeIndex, 1);
                console.dir(dudes);
                addDude(scale, X, Y, Z);
                expandSounds[randomInt(0, expandSounds.length-1)].play();
          }
      }
  )

}

function createDude(scale, X, Y, Z){

    var loader = new THREE.JSONLoader();
    loader.load("../models/suzanne.json",
        function ( geometry, materials ) {
          console.log('loading dude')
          dudeGeometry = geometry;


    //var cubeGeometry = new THREE.BoxGeometry( scale, scale, scale );
    var material     = new THREE.MeshLambertMaterial({ color: 0x0099ff });
    var pcubeMat     = new Physijs.createMaterial( material, .9, .5);
    dudeMaterial = pcubeMat
    addDude(scale,X,Y,Z);
    //find next open space in the array
  },
  function(xhr){
    console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );},
  function(err){console.log("error in loading: "+err);}
  )
}

function init(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement ); //puts the canvas onto the page

    var floorGeometry = new THREE.PlaneGeometry( 40, 40, 128 );
    var floorMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff } );
    var pfloorMat     = new Physijs.createMaterial( floorMaterial, .9, .5);
    floor             = new Physijs.BoxMesh( floorGeometry, pfloorMat, 0);

    floor.castShadow    = false;
    floor.receiveShadow = true;
    floor.rotation.x    = -Math.PI/2;
    floor.position.y    = -6;
    floor.position.z    = -1;
    scene.add( floor );

    var wallGeometry  = new THREE.PlaneGeometry( 40, 20, 100 );
    var wallMaterial  = new THREE.MeshLambertMaterial({ color: 0x0000ff, opacity: 0, transparent: true } );
    var pwallMat      = new Physijs.createMaterial( wallMaterial, .9, .5);
    wallBack          = new Physijs.BoxMesh( wallGeometry, pwallMat, 0);
    wallLeft          = new Physijs.BoxMesh( wallGeometry, pwallMat, 0);
    wallRight         = new Physijs.BoxMesh( wallGeometry, pwallMat, 0);
    wallFront         = new Physijs.BoxMesh( wallGeometry, pwallMat, 0);

    wallBack.castShadow    = false;
    wallBack.receiveShadow = true;
    wallBack.position.y    = 4;
    wallBack.position.z    = -21;
    wallBack.rotateX(Math.PI);
    scene.add( wallBack );

    wallLeft.castShadow    = false;
    wallLeft.receiveShadow = true;
    wallLeft.position.y    = 4;
    wallLeft.position.x    = -20;
    wallLeft.position.z    = -1;
    wallLeft.rotateY(-Math.PI/2);
    scene.add( wallLeft );

    wallRight.castShadow    = false;
    wallRight.receiveShadow = true;
    wallRight.position.y    = 4;
    wallRight.position.x    = 20;
    wallRight.position.z    = -1;
    wallRight.rotateY(Math.PI/2);
    scene.add( wallRight );

    wallFront.castShadow    = false;
    wallFront.receiveShadow = true;
    wallFront.position.y    = 4;
    wallFront.position.z    = 19;
    // wallFront.rotateX(Math.PI);
    scene.add( wallFront );

    createDude(2, 0, 0, 4);
    light1.position.set( 0, 10, 0 );
    scene.add( light1 );
    light2.castShadow = true;
    light2.position.set( 0, 10, 0 );
    scene.add( light2 );

    // var foodGeometry = new THREE.SphereGeometry( .5, 10, 10 );
    // var foodMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff });
    // var pfoodMat     = new Physijs.createMaterial( foodMaterial, .9, .5);
    // food             = new Physijs.SphereMesh( foodGeometry, pfoodMat);
    // var foodX = randomInt(-18, 18);
    // var foodZ = randomInt(-18, 18);
    // food.position.set(foodX, 0, foodZ);


    var posionG = new THREE.SphereGeometry( .5, 10, 10 );
    var pMaterial = new THREE.MeshLambertMaterial({ color: 000000 });
    var poisionMat     = new Physijs.createMaterial( pMaterial, .9, .5);
    poision             = new Physijs.SphereMesh( posionG, poisionMat);
    var pX = randomInt(-18, 18);
    var pY = randomInt(-18, 18);
    poision.position.set(pX, 0, pY)

    // scene.add(food);
    scene.add(poision);
    addFoods();


    StartSound.play();
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


var lastMoveSoundTime = null;
function update_camera()
{
  if(controls.camLeft){
    //dude.setLinearVelocity(dude.getWorldDirection().multiplyScalar(5))
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
var dudeSpeed = 8;
function updateDude(){
  var didMove = false;
  if(controls.left){
    dudes.forEach(function(element) {
        element.setLinearVelocity(new THREE.Vector3(-dudeSpeed,0,0));
    });
    didMove = true;
  }
  if(controls.right){
    dudes.forEach(function(element) {
        element.setLinearVelocity(new THREE.Vector3(dudeSpeed,0,0));
    });
    didMove = true;
  }
  if(controls.forward){
    dudes.forEach(function(element) {
        element.setLinearVelocity(new THREE.Vector3(0,0,-dudeSpeed));
    });
    didMove = true;
  }
  if(controls.backward){
    dudes.forEach(function(element) {
        element.setLinearVelocity(new THREE.Vector3(0,0,dudeSpeed));
    });
    didMove = true;
  }
}

function animate() {
    requestAnimationFrame( animate );
    updateDude();
    update_camera();
    scene.simulate();
    renderer.render( scene, camera );

    //dude.setLinearVelocity(dude.getWorldDirection().multiplyScalar(5))
}

init();
animate();
