function makeNewLine(){
    var geometry = new THREE.Geometry();
    var linemat = new THREE.LineBasicMaterial({color: 0xff0000});
    for(var j = 0; j < maxPointsForOneLine; j++){
        geometry.vertices.push(new THREE.Vector3(0,0,0));
    }
    var line = new THREE.Line(geometry, linemat);
    linesDummy.push(line);
    lastLine++
}

function darwActualLine(indexInArray,noOfPoints){
	var geometry = new THREE.Geometry();
    var linemat = new THREE.LineBasicMaterial({color: 0x0000ff});
    for(var j = 0; j < noOfPoints; j++){
        geometry.vertices.push(linesDummy[indexInArray].geometry.vertices[j]);
    }
    geometry.vertices.push(linesDummy[indexInArray].geometry.vertices[0]);
    var line = new THREE.Line(geometry, linemat);
    var count = lines.children.length + 1
    line.name = 'Line no. ' + count;
    lines.add(line);
    scene.add(lines);
}