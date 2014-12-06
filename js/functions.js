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
var lineCounter = -1;
function makeLine(arrayOfPoints){
    lineCounter++
    var geometryHelper = new THREE.Geometry();
    for(var i =0; i<arrayOfPoints.length-1;i++){
        geometryHelper.vertices.push(new THREE.Vector3(arrayOfPoints[i].x,arrayOfPoints[i].y,arrayOfPoints[i].z));
    }
    geometryHelper.vertices.push(new THREE.Vector3(arrayOfPoints[0].x,arrayOfPoints[0].y,arrayOfPoints[0].z));
    var helperline = new THREE.Line(geometryHelper, new THREE.LineBasicMaterial({color: 0xff0000}));
    helperline.name = 'line' + lineCounter
    linesInScene.add(helperline);
    globalHelper.add(linesInScene);
    scene.add(globalHelper)

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