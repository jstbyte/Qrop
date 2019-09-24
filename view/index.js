const Cropper = require("cropperjs");
const { ipcRenderer } = require("electron");


let image = document.getElementById('img');
let canvas;
// Initialization.
image.addEventListener("load",()=>{
    canvas = new Cropper(image, {
        dragMode:'move',
        ready(){
            this.cropper.clear();
        }
    });
})

// Connect With Main Thread.
ipcRenderer.on("GET_IMAGE", (event, data)=>{
    image.src = "file:///"+ data;
});


let cn = document.getElementById("container");
cn.addEventListener("dblclick", e=>{
    canvas.crop();
    ipcRenderer.send("SAVE", canvas.getCroppedCanvas().toDataURL('image/jpeg'));
    canvas.destroy();
});


// Button Function.
const crop = ()=> {canvas.setDragMode('crop')}
const move = ()=> {canvas.setDragMode('move')}
const zoomIn = ()=> {canvas.zoom(0.1)}
const zoomOut = ()=> {canvas.zoom(-0.1)}
const rotateLeft = ()=> {canvas.rotate(-0.5)}
const rotateRight = ()=> {canvas.rotate(0.5)}
const reset = ()=> {canvas.clear()}
const setRatio = ()=> {
    let inputRatio = document.getElementById("rin");
    if(inputRatio.style.visibility != "visible"){
        inputRatio.style.visibility = "visible";
    }else{
        inputRatio.style.visibility = "hidden";
    } 
};
const aspectRatio = ()=>{
    let w = parseFloat(document.getElementById('w').value);
    let h = parseFloat(document.getElementById('h').value);
    if( w>0 && h>0 ){
        canvas.setAspectRatio(w/h);
    }else{
        canvas.setAspectRatio(NaN);
    }
}
// Register Button.
document.getElementById("crop").addEventListener("click", crop);
document.getElementById("move").addEventListener("click", move);
document.getElementById("zoomIn").addEventListener("click", zoomIn);
document.getElementById("zoomOut").addEventListener("click", zoomOut);
document.getElementById("rotateLeft").addEventListener("click", rotateLeft);
document.getElementById("rotateRight").addEventListener("click", rotateRight);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("setRatio").addEventListener("click", setRatio);
document.getElementById("w").addEventListener("keyup", aspectRatio);
document.getElementById("h").addEventListener("keyup", aspectRatio);

// Request For Image Path.
ipcRenderer.send("GIVE_IMAGE");

