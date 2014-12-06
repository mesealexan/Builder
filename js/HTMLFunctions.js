var lineCreationButton = document.getElementById('addLine');
var lineEditingButton = document.getElementById('editLine');

var lineCreationOn = false;
function switchLineCreation(){
    if(lineCreationOn===false){
        lineCreationButton.innerHTML = 'Drawing...';
        lineCreationOn = true;

        lineEditingButton.innerHTML = 'Edit Line';
        editLines = false;
        editLine()
    }else{
        lineCreationButton.innerHTML = 'Add Line';
        lineCreationOn = false;

        lineEditingButton.innerHTML = 'Edit Line';
        editLines = false;
        editLine();
    }
}

var editLines = false;
function switchEditLineCreation(){
    if(linesInScene.children.length>0){
        lineCreationOn = false;
        if(editLines===false){
            lineEditingButton.innerHTML = 'Editing...'
            editLines = true
        }else{
            lineEditingButton.innerHTML = 'Edit Line'
            editLines = false
        }
    }
}
