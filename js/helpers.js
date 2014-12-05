function gridGenerator (rows, side, innerNum, lineColor, innerColor, axisColor) {
	//variables
	holder = new THREE.Object3D();
	holder.position.set(0, 0, 0);
	scene.add(holder);
	this.rows = rows;
	this.columns = rows//columns;
	this.side = side;		
	this.innerNum = innerNum;
	this.innerColor;
	this.axisColor;
	var matrix = [];
	//colors
	(typeof lineColor) === 'undefined' ? this.lineColor = "#F24738" : this.lineColor = lineColor;
	(typeof innerColor) === 'undefined' ? this.innerColor = "#0E7369" : this.innerColor = innerColor;;
	(typeof axisColor) === 'undefined' ? this.axisColor = 0x000088 : this.axisColor = axisColor;
	//materials
	var lineMaterial = new THREE.LineBasicMaterial( { color: this.lineColor } );
	var innerLineMaterial = new THREE.LineBasicMaterial( { color: this.innerColor } );
	var axisMaterial = new THREE.LineBasicMaterial( { color: this.axisColor} );
	//small lines
	DrawColumns(this.columns * this.innerNum, this.rows * this.innerNum, 
		this.side / this.innerNum, innerLineMaterial, true, this.innerNum);
	DrawRows(this.columns * this.innerNum, this.rows * this.innerNum, 
		this.side / this.innerNum, innerLineMaterial, true, this.innerNum);
	//big lines
	DrawColumns(this.columns, this.rows, this.side, lineMaterial);
	DrawRows(this.columns, this.rows, this.side, lineMaterial);
	//axis
	DrawAxis(this.columns, this.rows, this.side, axisMaterial);

	function DrawColumns (cols, rows, side, mat, innerBool, innerNum) {
		for (var i = 0; i <= cols; i++) {
			if(innerBool && i % innerNum == 0) continue;
			var lineGeometry = new THREE.Geometry();		
			var vertArray = lineGeometry.vertices;
			var startPoint = new THREE.Vector3(-((cols / 2) * side) + (i * side), 0, (rows * side) / 2);
			var endPoint = new THREE.Vector3(-((cols / 2) * side) + (i * side), 0 ,-(rows * side) / 2);
			vertArray.push(startPoint);		
			vertArray.push(endPoint);			
			lineGeometry.computeLineDistances();	
			var line = new THREE.Line(lineGeometry, mat);
			holder.add(line);
		};
	}

	function DrawRows (cols, rows, side, mat, innerBool, innerNum){
		for (var i = 0; i < rows +1; i++) {
			if(innerBool && i % innerNum == 0) continue;
			var lineGeometry = new THREE.Geometry();		
			var vertArray = lineGeometry.vertices;
			var startPoint = new THREE.Vector3(-((cols / 2) * side), 0, ((rows * side) / 2) - (i * side));
			var endPoint = new THREE.Vector3((cols / 2 ) * side, 0, ((rows * side) / 2) - (i * side));
			vertArray.push(startPoint);		
			vertArray.push(endPoint);	
			CalculatePoints(startPoint, side, cols);	
			lineGeometry.computeLineDistances();	
			var line = new THREE.Line(lineGeometry, mat);
			holder.add(line);
		};
	}

	function CalculatePoints(origin, side, cols){
		for (var i = 0; i <= cols; i++) {
			var vector = new THREE.Vector3(origin.x + (i * side), origin.y, origin.z);		
			AddToMatrix(vector);
		};
	}

	function AddToMatrix(Vector3){
		//for( var l = 0; l< rows; l++){
		matrix.push([Vector3.x, Vector3.y, Vector3.z]);
	}

	function DrawAxis (cols, rows, side, mat) {
		//X
		var lineGeometry = new THREE.Geometry();		
		var vertArray = lineGeometry.vertices;
		vertArray.push(new THREE.Vector3(0, 0, (rows * side) / 2));		
		vertArray.push(new THREE.Vector3(0,0,-(rows * side) / 2));
		lineGeometry.computeLineDistances();	
		var line = new THREE.Line(lineGeometry, mat);
		holder.add(line);	
		//Z
		var lineGeometry = new THREE.Geometry();		
		var vertArray = lineGeometry.vertices;
		vertArray.push(new THREE.Vector3(((cols / 2) * side), 0, 0));		
		vertArray.push(new THREE.Vector3(-((cols / 2) * side), 0, 0));
		lineGeometry.computeLineDistances();	
		var line = new THREE.Line(lineGeometry, mat);
		holder.add(line);
	}

	holder.matrix2 = matrix;
	return holder;
}

function makeGizmo (type) {
	var holder = new THREE.Object3D();
	var colorX = 0x0000ff;
	var colorY = 0x00ff00;
	var colorZ = 0xff0000;
	holder.position.set(0, 0, 0);

	holder.Xmat = new THREE.MeshBasicMaterial({color: colorX});
	holder.Ymat = new THREE.MeshBasicMaterial({color: colorY});
	holder.Zmat = new THREE.MeshBasicMaterial({color: colorZ});
	var helperMat = new THREE.MeshBasicMaterial({color: 0xffffff});

	switch (type){
		case "position":
		{
			var radius = 0.5, height = 25, heightSeg = 16, topSeg = 0;
			var arrowRadius = 1.5, arrowHeight = 3, arrowHeightSeg = 16, arrowTopSeg = 0;

			var arrowGeom = new THREE.CylinderGeometry(0, arrowRadius, arrowHeight, arrowHeightSeg, arrowTopSeg);
			var cylinderGeom = new THREE.CylinderGeometry(radius, radius, height, heightSeg, topSeg);						
        	cylinderGeom.applyMatrix( new THREE.Matrix4().makeTranslation(0, (height / 2), 0));
        	arrowGeom.applyMatrix( new THREE.Matrix4().makeTranslation(0, height + (arrowHeight / 2), 0));
        	cylinderGeom.merge(arrowGeom);

			//X
			var cylinderX = new THREE.Mesh(cylinderGeom, holder.Xmat);	
			cylinderX.rotation.set(0, 0, -Math.PI / 2);	
			holder.add(cylinderX);

			//Y		
			var cylinderY = new THREE.Mesh(cylinderGeom, holder.Ymat);
			cylinderY.rotation.set(0, 0, 0);
			holder.add(cylinderY);

			//Z
			var cylinderZ = new THREE.Mesh(cylinderGeom, holder.Zmat);
			cylinderZ.rotation.set(Math.PI / 2, 0, 0);
			holder.add(cylinderZ);

			//sphere			
			var radius = 1, segments = 6, rings = 6;
			var sphereGeom =  new THREE.SphereGeometry( radius, segments, rings );
			var sphere = new THREE.Mesh( sphereGeom, helperMat );
			holder.add(sphere);
		}
		break;
		case "rotation":{
			var radius = 25, tube = 0.3, radialSegments = 6, tubularSegments = 36;
			var torusGeom = new THREE.TorusGeometry( radius, tube, radialSegments, tubularSegments );
			//X
			var torusX = new THREE.Mesh(torusGeom, holder.Xmat);
			torusX.rotation.set(0, 0, Math.PI / 2);
			holder.add(torusX);
			//Y
			var torusY = new THREE.Mesh(torusGeom, holder.Ymat);
			torusY.rotation.set(0, Math.PI / 2, 0);
			holder.add(torusY);
			//Z
			var torusZ = new THREE.Mesh(torusGeom, holder.Zmat);
			torusZ.rotation.set(Math.PI / 2, 0, 0);
			holder.add(torusZ);
		}
		break;
		case "scale":
		{
			var radius = 0.5, height = 25, heightSeg = 16, topSeg = 0;
			var boxSide = 2;

			var boxGeom = new THREE.BoxGeometry(boxSide, boxSide, boxSide);
			var cylinderGeom = new THREE.CylinderGeometry(radius, radius, height, heightSeg, topSeg);						
        	cylinderGeom.applyMatrix( new THREE.Matrix4().makeTranslation(0, (height / 2), 0));
        	boxGeom.applyMatrix( new THREE.Matrix4().makeTranslation(0, height + (boxSide / 2), 0));
        	cylinderGeom.merge(boxGeom);

			//X
			var cylinderX = new THREE.Mesh(cylinderGeom, holder.Xmat);	
			cylinderX.rotation.set(0, 0, -Math.PI / 2);	
			holder.add(cylinderX);

			//Y		
			var cylinderY = new THREE.Mesh(cylinderGeom, holder.Ymat);
			cylinderY.rotation.set(0, 0, 0);
			holder.add(cylinderY);

			//Z
			var cylinderZ = new THREE.Mesh(cylinderGeom, holder.Zmat);
			cylinderZ.rotation.set(Math.PI / 2, 0, 0);
			holder.add(cylinderZ);

			//box	
			var smallBoxSide = 1;
			var smallBoxGeom = new THREE.BoxGeometry(smallBoxSide, smallBoxSide, smallBoxSide);	
			var smallBox = new THREE.Mesh( smallBoxGeom, helperMat );
			holder.add(smallBox);
		}
		break;
		default: console.log("unknown input.");
	}
	return holder;	
}
