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

var lineCreationButton = document.getElementById('addLine');
var lineEditingButton = document.getElementById('editLine');

var currentLine = [];
var constructingLines = [];
var constructingPoints = [];
var lineCreationOn = false;

function switchLineCreation(){
    if(lineCreationOn===false){
        lineCreationButton.innerHTML = 'Drawing...'
        lineCreationOn = true
    }else{
        lineCreationButton.innerHTML = 'Add Line'
        lineCreationOn = false
    }
}
function switchEditLineCreation(){
    if(editLines===false){
        lineEditingButton.innerHTML = 'Editing...'
        editLines = true
    }else{
        lineEditingButton.innerHTML = 'Edit Line'
        editLines = false
    }
}

//Call the scene
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

    renderer = new THREE.WebGLRenderer({antialias:true, alpha: true });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT); 

    renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onMouseClick, false );

    THREEx.WindowResize(renderer, camera);

    container = document.getElementById( 'ThreeJS' ); 
    container.appendChild( renderer.domElement ); 

    controls = new THREE.OrbitControls( camera, renderer.domElement );     
    // Grid Helper
    grid = gridGenerator (10, 100, 10, 0x8C8C8C, 0xB0B0B0, 0x00ff00);
    grid.position.x = 5*100;
    grid.position.z = 5*100;
    grid.position.y = -0.3;
    scene.add(grid);

    controls.target = new THREE.Vector3(500,0,500)

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

var listOfObjectsDiv = document.getElementById('listOfObjects')

var newPoint;

function onMouseClick( event_info ) 
{
    event_info.preventDefault();  
    mouse.x = ( event_info.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event_info.clientY / window.innerHeight ) * 2 + 1;    
    mouse_vector.set( mouse.x, mouse.y, mouse.z );
    projector.unprojectVector( mouse_vector, camera );
    var direction = mouse_vector.sub( camera.position ).normalize();
    ray.set( camera.position, direction );
    intersects = ray.intersectObject(clickPlane, false );
    if(lineCreationOn===true){
        if(intersects.length>0)
        {
            newPoint = new THREE.Vector3(roundUp(intersects[0].point.x,10),roundUp(intersects[0].point.y,10),roundUp(intersects[0].point.z,10));
            constructingPoints.push(newPoint);
            
            if(constructingPoints.length>=2){
                makeConstructiveLine(constructingPoints[constructingPoints.length-2], constructingPoints[constructingPoints.length-1]);
                if(aproximateDistance(constructingPoints[constructingPoints.length-1], constructingPoints[0], 6)){
                    makeLine(constructingPoints)
                }
            }

        }
    }


}

function onMouseMove( event_info ) 
    {
    event_info.preventDefault();  
    mouse.x = ( event_info.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event_info.clientY / window.innerHeight ) * 2 + 1;    
    mouse_vector.set( mouse.x, mouse.y, mouse.z );
    projector.unprojectVector( mouse_vector, camera );
    var direction = mouse_vector.sub( camera.position ).normalize();
    ray.set( camera.position, direction );
    var intersects = ray.intersectObject(clickPlane, false );
    if(lineCreationOn===true){
        if(intersects.length>0){

            if(constructingPoints.length>=1){
                geometryHelper.vertices[0] = constructingPoints[constructingPoints.length-1];
                geometryHelper.vertices[1] = new THREE.Vector3(roundUp(intersects[0].point.x,10),roundUp(intersects[0].point.y,10),roundUp(intersects[0].point.z,10));
                geometryHelper.verticesNeedUpdate = true; 
            }
            else{
                geometryHelper.vertices[0] = new THREE.Vector3(0,0,0);
                geometryHelper.vertices[1] = new THREE.Vector3(0,0,0);
                geometryHelper.verticesNeedUpdate = true;
            }

        }
    }
    else{
        geometryHelper.vertices[0] = new THREE.Vector3(0,0,0);
                geometryHelper.vertices[1] = new THREE.Vector3(0,0,0);
                geometryHelper.verticesNeedUpdate = true;
    }
}


function aproximateDistance(pointA, pointB, distance){
    if(Math.abs(pointA.x - pointB.x) <= distance && Math.abs(pointA.y - pointB.y) <= distance && Math.abs(pointA.z - pointB.z) <= distance)
        return true
}

function makeConstructiveLine(pointA, pointB){
    var geometryHelper = new THREE.Geometry();
        geometryHelper.vertices[0] = new THREE.Vector3(pointA.x,pointA.y,pointA.z);
        geometryHelper.vertices[1] = new THREE.Vector3(pointB.x,pointB.y,pointB.z);
    var helperline = new THREE.Line(geometryHelper, new THREE.LineBasicMaterial({color: 0x00ff00}));
    constructingLines.push(helperline);
    scene.add(helperline);
}

function makeLine(arrayOfPoints){

    var geometryHelper = new THREE.Geometry();
    for(var i =0; i<arrayOfPoints.length-1;i++){
        geometryHelper.vertices.push(new THREE.Vector3(arrayOfPoints[i].x,arrayOfPoints[i].y,arrayOfPoints[i].z));
    }
    geometryHelper.vertices.push(new THREE.Vector3(arrayOfPoints[0].x,arrayOfPoints[0].y,arrayOfPoints[0].z));
    var helperline = new THREE.Line(geometryHelper, new THREE.LineBasicMaterial({color: 0xff0000}));
    scene.add(helperline);

    for(var j=0;j<arrayOfPoints.length-1;j++){
        scene.remove(constructingLines[j])
    }
    constructingPoints = [];
    constructingLines = [];
    switchLineCreation()
}
function roundUp(number, precision){
    var result=Math.round(number*1/precision)*precision
    return result
}