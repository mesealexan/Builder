function onMouseClick( event_info ) 
{
    event_info.preventDefault();  
    mouse.x = ( event_info.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event_info.clientY / window.innerHeight ) * 2 + 1;    
    mouse_vector.set( mouse.x, mouse.y, mouse.z );
    projector.unprojectVector( mouse_vector, camera );
    var direction = mouse_vector.sub( camera.position ).normalize();
    ray.set( camera.position, direction );
    
    // Create New Lines
    if(lineCreationOn===true){
        intersects = ray.intersectObject(clickPlane, false );
        if(intersects.length>0)
            makeNewPoints();
        }
    //Modify Existing Lines
    if(editLines===true){
        intersects = ray.intersectObjects( globalHelper.children, true );
        if(intersects.length>0){
            console.log(intersects[0].object.name)
            var selectedLineID = intersects[0].object.id;
            editLine(linesInScene.getObjectById(selectedLineID));
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

function makeNewPoints(){
    newPoint = new THREE.Vector3(roundUp(intersects[0].point.x,10),roundUp(intersects[0].point.y,10),roundUp(intersects[0].point.z,10));
    constructingPoints.push(newPoint);
    
    if(constructingPoints.length>=2){
        makeConstructiveLine(constructingPoints[constructingPoints.length-2], constructingPoints[constructingPoints.length-1]);
        if(aproximateDistance(constructingPoints[constructingPoints.length-1], constructingPoints[0], 6)){
            makeLine(constructingPoints)
        }
    }
}
var tempPoints = new THREE.Object3D();
function editLine(line){
    if(tempPoints.children.length>0){
        for(var i=0;i<tempPoints.children.length;i++){
            scene.remove(tempPoints.children[i]);
            scene.remove(tempPoints)
            tempPoints = new THREE.Object3D();
        }
    }
    if(line){
        for(var j=0;j<line.geometry.vertices.length;j++){
            var sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 12), new THREE.MeshBasicMaterial({color:0xff0000}));
            sphere.position.copy(line.geometry.vertices[j]);
            sphere.name = 'dummy' + j;
            tempPoints.add(sphere)
            globalHelper.add(tempPoints);
        }
    }
}