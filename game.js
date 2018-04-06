Physijs.scripts.worker = '/js/physijs_worker.js';
Physijs.scripts.ammo = '/js/ammo.js';
var scene = new Physijs.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 30;

camera.lookAt(0,0,0);
var renderer = new THREE.WebGLRenderer();
var floor;
var wall;
var dude;

var light1 = new THREE.AmbientLight( 0xffffff,0.25);
var light2 = new THREE.SpotLight( 0xffffff );
var light3 = new THREE.SpotLight( 0xffff00 );

var controls = {
    left: false,
    right: false,
    forward: false,
    backward: false
};

window.addEventListener("keydown", function(event){
    switch(event.key)
    {
        case("s"):{
          controls.forward = true;
        }; break;
        case("w"):{
          controls.backward = true;
        }; break;
        case("a"):{
          controls.left = true;
        }; break;
        case("d"):{
          controls.right = true;
        }; break;
    };
});

window.addEventListener("keyup", function(event){
    switch(event.key)
    {
        case("s"):{
          controls.forward = false;
        }; break;
        case("w"):{
          controls.backward = false;
        }; break;
        case("a"):{
          controls.left = false;
        }; break;
        case("d"):{
          controls.right = false;
        }; break;
    };
});

function init(){
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild( renderer.domElement ); //puts the canvas onto the page

    var floorGeometry = new THREE.PlaneGeometry( 40, 20, 128 );
    var wallGeometry = new THREE.BoxGeometry( 40, 20, 100 );
    var cubeGeometry = new THREE.BoxGeometry( 2, 2, 2 );


    var material      = new THREE.MeshLambertMaterial({ color: 0x9999ff });
    var wallMaterial  = new THREE.MeshLambertMaterial({ color: 0x00ff00 } );
    var floorMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa } );

    var pfloorMat = new Physijs.createMaterial( floorMaterial, .9, .5);
    var pcubeMat  = new Physijs.createMaterial( material, .9, .5);

    floor     = new Physijs.BoxMesh( floorGeometry, pfloorMat, 0);
    wall1     = new THREE.Mesh( wallGeometry, wallMaterial );
    dude      = new Physijs.BoxMesh( cubeGeometry, pcubeMat, 1 );


    // cube.setDamping(0.1,0.1);
    dude.castShadow = true;
    dude.receiveShadow = false;
    floor.castShadow = false;
    floor.receiveShadow = true;
    wall1.castShadow = false;
    wall1.receiveShadow = true;

    // light1.castShadow = true;
    // light1.shadow.mapSize.width = 512; // default
    // light1.shadow.mapSize.height = 512; // default
    // light1.shadow.camera.near = 0.5; // default
    // light1.shadow.camera.far = 500 // default

    light2.castShadow = true;
    light3.castShadow = true;

    floor.rotation.x = -Math.PI/2;
    light1.position.set( 0, 10, 0);
    light2.position.set(-100, 100, 100);
    light3.position.set( 0, 6, 5 )

    floor.position.y = -6;
    floor.position.z = -1;
    wall1.position.y = 2;
    wall1.position.z = -10;
    dude.position.z = 4;

    scene.add( floor );
    scene.add( dude );
    scene.add( light1 );
    scene.add( light2 )
    // scene.add( light3 )
    scene.add( wall1 );
}


function updateDude(){
  // print(dude.position);
  if(controls.left){
    //dude.setLinearVelocity(dude.getWorldDirection().multiplyScalar(5))
    dude.translateX(-1);
    dude.__dirtyPosition = true;
  }
  if(controls.right){
    dude.translateX(1);
    dude.__dirtyPosition = true;
  }
  if(controls.forward){
    dude.translateZ(1);
    dude.__dirtyPosition = true;
  }
  if(controls.backward){
    dude.translateZ(-1);
    dude.__dirtyPosition = true;
  }

  // if(!controls.left && !controls.right && !controls.forward && !controls.backward)
  // {
  //   dude.setLinearVelocity(new THREE.Vector3(0, 0, 0));
  // }
}
var counter = 0;

function animate() {
    requestAnimationFrame( animate );
    updateDude();
    scene.simulate();
    renderer.render( scene, camera );

    //dude.setLinearVelocity(dude.getWorldDirection().multiplyScalar(5))
    dude.__dirtyPosition = false;
}
init();
animate();
