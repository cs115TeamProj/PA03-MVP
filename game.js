Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = '/js/ammo.js';
var scene = new Physijs.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 30;

camera.lookAt(0,0,0);
var renderer = new THREE.WebGLRenderer();
var floor;
var wallBack
var wallLeft
var wallRight;
var wallFront;
var dude;

var light1 = new THREE.AmbientLight( 0xffffff,0.25);
var light2 = new THREE.SpotLight( 0xffffff );
var light3 = new THREE.SpotLight( 0xffffff );

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

function init(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement ); //puts the canvas onto the page

    var floorGeometry = new THREE.PlaneGeometry( 40, 20, 128 );
    var floorMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa } );
    var pfloorMat     = new Physijs.createMaterial( floorMaterial, .9, .5);
    floor             = new Physijs.BoxMesh( floorGeometry, pfloorMat, 0);

    floor.castShadow    = false;
    floor.receiveShadow = true;
    floor.rotation.x    = -Math.PI/2;
    floor.position.y    = -6;
    floor.position.z    = -1;
    scene.add( floor );

    var wallGeometry  = new THREE.PlaneGeometry( 40, 20, 100 );
    var wallMaterial  = new THREE.MeshLambertMaterial({ color: 0x00ff00 } );
    var pwallMat      = new Physijs.createMaterial( wallMaterial, .9, .5);
    wallBack          = new Physijs.BoxMesh( wallGeometry, pwallMat, 0);

    wallBack.castShadow    = false;
    wallBack.receiveShadow = true;
    wallBack.position.y    = 4;
    wallBack.position.z    = -11;
    scene.add( wallBack );

    var cubeGeometry = new THREE.BoxGeometry( 2, 2, 2 );
    var material     = new THREE.MeshLambertMaterial({ color: 0x9999ff });
    var pcubeMat     = new Physijs.createMaterial( material, .9, .5);
    dude             = new Physijs.BoxMesh( cubeGeometry, pcubeMat);

    dude.castShadow    = true;
    dude.receiveShadow = false;
    dude.position.z    = 4;
    scene.add( dude );

    // light1.castShadow = true;
    // light1.shadow.mapSize.width = 512; // default
    // light1.shadow.mapSize.height = 512; // default
    // light1.shadow.camera.near = 0.5; // default
    // light1.shadow.camera.far = 500 // default

    light2.castShadow = true;
    light3.castShadow = true;


    light1.position.set( 0, 10, 0);
    light2.position.set(-100, 100, 100);
    light3.position.set( 0, 6, 5 )

    scene.add( light1 );
    scene.add( light2 )
    scene.add( light3 )
}
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
    camera.translateZ(1);
    camera.__dirtyPosition = true;
  }
  if(controls.camBack){
    camera.translateZ(-1);
    camera.__dirtyPosition = true;
  }
  camera.lookAt(0,0,0);
}
var dudeSpeed = 5;
function updateDude(){
  // print(dude.position);
  if(controls.left){
    //dude.setLinearVelocity(dude.getWorldDirection().multiplyScalar(5))
    dude.setLinearVelocity(new THREE.Vector3(-dudeSpeed,0,0));
    // dude.__dirtyPosition = true;
  }
  if(controls.right){
    dude.setLinearVelocity(new THREE.Vector3(dudeSpeed,0,0));
    dude.__dirtyPosition = true;
  }
  if(controls.forward){
    dude.setLinearVelocity(new THREE.Vector3(0,0,-dudeSpeed));
    dude.__dirtyPosition = true;
  }
  if(controls.backward){
    dude.setLinearVelocity(new THREE.Vector3(0,0,dudeSpeed));
    dude.__dirtyPosition = true;
  }

}


function animate() {
    requestAnimationFrame( animate );
    updateDude();
    update_camera();
    scene.simulate();
    renderer.render( scene, camera );

    //dude.setLinearVelocity(dude.getWorldDirection().multiplyScalar(5))
    dude.__dirtyPosition = false;
}
init();
animate();
