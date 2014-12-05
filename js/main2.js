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


var maxPointsForOneLine = 100;
// Create an empty object to store all possible linesDummy
var linesDummy = [];
var currentVertex = 0;
var lastLine = -1;

var lines = new THREE.Object3D();

var lineCreationOn = false;
var editLines = false;





var lineCreationButton = document.getElementById('addLine');
var lineEditingButton = document.getElementById('editLine');
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
    camera.lookAt(scene.position);   
    scene.add(camera); 

    renderer = new THREE.WebGLRenderer({antialias:true, alpha: true });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT); 

    renderer.domElement.addEventListener( 'mousemove', onMouseMove, false );
    renderer.domElement.addEventListener( 'mousedown', onMouseClick, false );

    THREEx.WindowResize(renderer, camera);

    container = document.getElementById( 'ThreeJS' ); 
    container.appendChild( renderer.domElement ); 
    
    // Grid Helper
    grid = gridGenerator (10, 100, 10, 0x8C8C8C, 0xB0B0B0, 0x00ff00);
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

    controls = new THREE.OrbitControls( camera, renderer.domElement ); 

    var ambientLight = new THREE.AmbientLight(0xffffff); 
    scene.add(ambientLight);

    makeNewLine()

    animate();
    }

function animate() 
    {
    requestAnimationFrame( animate ); 
    renderer.render( scene, camera );   
    controls.update(); 
    }

var listOfObjectsDiv = document.getElementById('listOfObjects')
function onMouseClick( event_info ) 
{
    event_info.preventDefault();  
    mouse.x = ( event_info.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event_info.clientY / window.innerHeight ) * 2 + 1;    
    mouse_vector.set( mouse.x, mouse.y, mouse.z );
    projector.unprojectVector( mouse_vector, camera );
    var direction = mouse_vector.sub( camera.position ).normalize();
    ray.set( camera.position, direction );
    if(editLines===true){
        
         intersects = ray.intersectObjects( lines.children, true );
         if(intersects.length>0){
            for(var m=0;m<lines.children.length;m++){
            lines.children[m].material.color.setHex(0x0000ff)
        }
            intersects[0].object.material.color.setHex(0xff0000)
         }
    }

    //Line Creation
    if(lineCreationOn === true){
        intersects = ray.intersectObject(clickPlane, false );
        if(intersects.length>0)
        {
            if(currentVertex===0){
                linesDummy[lastLine].geometry.vertices[currentVertex].copy(intersects[0].point);
                linesDummy[lastLine].geometry.verticesNeedUpdate = true;
                helperline.geometry.vertices[0].copy(intersects[0].point);
                helperline.geometry.verticesNeedUpdate = true;
                currentVertex++;
            }
            else if(currentVertex>0&&currentVertex<maxPointsForOneLine){
                scene.add(linesDummy[lastLine]);
                helperline.geometry.vertices[0].copy(intersects[0].point);
                helperline.geometry.verticesNeedUpdate = true;
                for(var k = currentVertex ; k< maxPointsForOneLine; k++){
                    linesDummy[lastLine].geometry.vertices[k].copy(intersects[0].point);
                    linesDummy[lastLine].geometry.verticesNeedUpdate = true;
                    if(Math.abs(linesDummy[lastLine].geometry.vertices[k].x - linesDummy[lastLine].geometry.vertices[0].x) <=5 && Math.abs(linesDummy[lastLine].geometry.vertices[k].z - linesDummy[lastLine].geometry.vertices[0].z) <=5){
                        linesDummy[lastLine].geometry.vertices[k].copy(linesDummy[lastLine].geometry.vertices[0]);
                        darwActualLine(lastLine,k);
                        scene.remove(linesDummy[lastLine]);
                        //Write to div
                        p = document.createElement('p');
                        text = document.createTextNode(lines.children[lastLine].name);
                        p.appendChild(text);
                        listOfObjectsDiv.appendChild(p);

                        makeNewLine();
                        currentVertex = -1;
                        lineCreationOn = false;
                        lineCreationButton.innerHTML = 'Add Line';
                    }
                }
                currentVertex++
            }

        }
    }//Line Creation


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
    intersects = ray.intersectObject(clickPlane, false );
    if(lineCreationOn === true){
        if(currentVertex>0){
            if(intersects.length>0){
               helperline.geometry.vertices[1].copy(intersects[0].point);
               helperline.geometry.verticesNeedUpdate = true;
               //console.log(Math.abs(intersects[0].point.x - linesDummy[lastLine].geometry.vertices[0].x),Math.abs(intersects[0].point.z - linesDummy[lastLine].geometry.vertices[0].z))
               if(Math.abs(intersects[0].point.x - linesDummy[lastLine].geometry.vertices[0].x) <=5 && Math.abs(intersects[0].point.z - linesDummy[lastLine].geometry.vertices[0].z) <=5){
                    helperline.material.needsUpdate = true;
                    helperline.material.color.setHex(0xff00ff);
               }else{
                    helperline.material.needsUpdate = true;
                    helperline.material.color.setHex(0x00ff00);
                }
            }
        }
    }
}

