// Must Have variables
var container, scene, camera, renderer, controls, stats;
var jsonLoader = new THREE.JSONLoader(); 

// Variables fro projector
var projector = new THREE.Projector(), 
    mouse_vector = new THREE.Vector3(),
    mouse = { x: 0, y: 0, z: 1 },
    ray = new THREE.Raycaster( new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0) );

var grid;
var helperline;

var currentLine = [];
var constructingLines = [];
var constructingPoints = [];
var linesInScene = new THREE.Object3D();
var globalHelper  = new THREE.Object3D();
var counter = 0;
var kkt;
var oldAdd
//THREE.Object3D.prototype.add.arguments
init(); 

function init()
    {

    scene = new THREE.Scene();
    var SCREEN_WIDTH = window.innerWidth; 
    var SCREEN_HEIGHT = window.innerHeight; 
    var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 200000;
    camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR); 
    camera.position.set(-200,200,200);   
    scene.add(camera); 

    //scene.__proto__.__proto__.addEventListener('onchange', function(){counter++})
    renderer = new THREE.WebGLRenderer({antialias:true, alpha: true });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT); 
    THREE.EventDispatcher.call( scene );
    scene.addEventListener('load', function(event) {alert("GOT THE EVENT");});
    //scene.dispatchEvent({type:'load'});
    renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onMouseClick, false );

    THREEx.WindowResize(renderer, camera);

    container = document.getElementById( 'ThreeJS' ); 
    container.appendChild( renderer.domElement ); 

    controls = new THREE.OrbitControls( camera, container );     
    // Grid Helper
    grid = gridGenerator (10, 100, 10, 0x8C8C8C, 0xB0B0B0, 0x00ff00);
    grid.position.y = -0.3;
    scene.add(grid);

   // Helper line to display on mouse over
   
    geometryHelper = new THREE.Geometry();
    geometryHelper.vertices[0] = new THREE.Vector3(0,0,0);
    geometryHelper.vertices[1] = new THREE.Vector3(0,0,0);
    
    geometryHelper.verticesNeedUpdate = true;      

    helperline = new THREE.Line(geometryHelper, new THREE.LineBasicMaterial({color: 0x00ff00}));
    helperline.material.needsUpdate = true;
    scene.add(helperline);


    // Plane for picking clicks
    var planeGeometry = new THREE.PlaneGeometry(2000, 2000);
        planeGeometry.applyMatrix( new THREE.Matrix4().makeRotationX(-Math.PI/2) );
        clickPlane = new THREE.Mesh(planeGeometry, new THREE.MeshNormalMaterial());
        // hide the plane
        clickPlane.visible= false;
        scene.add(clickPlane);


    var ambientLight = new THREE.AmbientLight(0xffffff); 
    scene.add(ambientLight);

    animate();
    }

function animate() 
    {
    requestAnimationFrame( animate ); 
    renderer.render( scene, camera );   
    controls.update(); 
    }




function func(){
    console.log('ping')
}