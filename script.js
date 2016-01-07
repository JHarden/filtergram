
//onload
var imageLoader;
var canvas;
var ctx;

//onhandleimage
var data;
var imageData;
var originalImageData;
var isDisabled;


window.onload = function(event){

    imageLoader = document.getElementById('img_capture');
    imageLoader.addEventListener('change', handleImage, false);
    canvas = document.getElementById('img_canvas');
    ctx = canvas.getContext('2d');


    function download() {
        var dt = canvas.toDataURL();
        this.href = dt; //this may not work in the future..
    }
    document.getElementById('download').addEventListener('click', download, false);

};


function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){

        var img = new Image();
        img.onload = function(){
            if(img.width<=600){
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
            }else{
                canvas.width = 600;
                canvas.height =img.height * (600/img.width);
                ctx.drawImage(img,0,0,600,img.height * (600/img.width));
            }

            img.style.display = 'none';
            imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
            originalImageData = ctx.getImageData(0,0,canvas.width, canvas.height);
            data = imageData.data;

            //run reset on image load
            resetImageData();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);

    if(isDisabled!=false){
        var el = document.getElementsByTagName('input');
        for(var i = 0;i<el.length;i++){
            console.log(el[i]);
            el[i].disabled=false;
        }
        document.getElementById('invertbtn').disabled=false;
        document.getElementById('grayscalebtn').disabled=false;
        document.getElementById('resetbtn').disabled=false;
        isDisabled = false;
    }

    //show additional controls
    var ctrl = document.getElementById('img_controls');
    ctrl.className = ctrl.className + " active";

    var canv = document.getElementById('canvas_container');
    canv.className = canv.className + " active";
    var filt = document.getElementById('filter_controls');
    filt.className = filt.className + " active";

}

var invert = function() {
    imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        data[i]     = 255 - data[i];     // red
        data[i + 1] = 255 - data[i + 1]; // green
        data[i + 2] = 255 - data[i + 2]; // blue
    }
    ctx.putImageData(imageData, 0, 0);
};

var grayscale = function() {

    imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg; // red
        data[i + 1] = avg; // green
        data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
};

var resetImageData = function(){

    imageData = originalImageData;
    ctx.putImageData(imageData, 0, 0);
    document.getElementById('redify').value = 125;
    document.getElementById('greenify').value = 125;
    document.getElementById('blueify').value = 125;
    document.getElementById('brightness').value = 1;
    document.getElementById('alpha').value = 1;
    var cv = document.getElementsByClassName('colour-val');
    for(var i = 0; i < cv.length; i++){
        cv[i].innerHTML = " ";
    }
};

//using the drag tool, for colour and alpha
function colourOverlay(rgb , val){

    imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    data = imageData.data;

    for (var i = 0,len = data.length; i < len; i += 4) {
        switch(rgb){
            case 'R':
                data[i] = data[i]=val;
                document.getElementById('r_val').innerHTML = val;
                break;
            case 'G':
                data[i+1] = val;
                document.getElementById('g_val').innerHTML = val;
                break;
            case 'B':
                data[i+2] = val;
                document.getElementById('b_val').innerHTML = val;
                break;
            case 'A':
                data[i+3] = val;
                document.getElementById('a_val').innerHTML = val;
                break;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function brightness (adjustment) {
    imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    data = imageData.data;

    for (var i= 0,len = data.length; i<len; i+=4) {
        data[i] += adjustment/5;
        data[i+1] += adjustment/5;
        data[i+2] += adjustment/5;
    }
    ctx.putImageData(imageData, 0, 0);
}

function saveToLocal(){
    localStorage.setItem("imgCanvas",canvas.toDataURL());
}

function loadFromLocal(){

    var img=new Image();
    img.onload=function(){

        if(img.width<=600){
        canvas.width = img.width;
        canvas.height = img.height;
        }else{
            canvas.width = 600;
            img.width = 600;
        }
        ctx.drawImage(img,0,0);
        img.style.display = 'none';
        imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
        originalImageData = ctx.getImageData(0,0,canvas.width, canvas.height);
        data = imageData.data;

        //run reset on image load
        resetImageData();
    };
    img.src=localStorage.getItem("imgCanvas");
    if(isDisabled!=false){
        var el = document.getElementsByTagName('input');
        for(var i = 0;i<el.length;i++){
            console.log(el[i]);
            el[i].disabled=false;
        }
        document.getElementById('invertbtn').disabled=false;
        document.getElementById('grayscalebtn').disabled=false;
        document.getElementById('resetbtn').disabled=false;
        isDisabled = false;
    }
    var ctrl = document.getElementById('img_controls');
    ctrl.className = ctrl.className + " active";
}