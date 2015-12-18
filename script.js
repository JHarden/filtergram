
var imageLoader;
var canvas;
var ctx;
var data;
var imageData;
var originalImageData;

window.onload = function(event){

    console.log('loading..');
    imageLoader = document.getElementById('img_capture');
    imageLoader.addEventListener('change', handleImage, false);
    canvas = document.getElementById('img_canvas');
    ctx = canvas.getContext('2d');

    function handleImage(e){
        var reader = new FileReader();
        reader.onload = function(event){

            var img = new Image();
            img.onload = function(){
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
                img.style.display = 'none';
                imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
                originalImageData = ctx.getImageData(0,0,canvas.width, canvas.height);
                data = imageData.data;

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
                    document.getElementById('redify').value = 0;
                    document.getElementById('greenify').value = 0;
                    document.getElementById('blueify').value = 0;
                    document.getElementById('brightness').value = 1;
                    document.getElementById('alpha').value = 1;
                };

                var invertbtn = document.getElementById('invertbtn');
                invertbtn.addEventListener('click', invert);

                var grayscalebtn = document.getElementById('grayscalebtn');
                grayscalebtn.addEventListener('click', grayscale);

                var resetbtn = document.getElementById('resetbtn');
                resetbtn.addEventListener('click', resetImageData);

                //run reset on image load
                resetImageData();

            }
            img.src = event.target.result;

        }
        reader.readAsDataURL(e.target.files[0]);
    }


    function download() {
        var dt = canvas.toDataURL();
        this.href = dt; //this may not work in the future..
    }
    document.getElementById('download').addEventListener('click', download, false);

};

//using the drag tool, for colour and alpha
function colourOverlay(rgb , val){

    imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    data = imageData.data;

    for (var i = 0,len = data.length; i < len; i += 4) {

        switch(rgb){
            case 'R':
                data[i] = val; break;
            case 'G':
                data[i+1] = val; break;
            case 'B':
                data[i+2] = val; break;
            case 'A':
                data[i+3] = val; break;
        }
    }
    ctx.putImageData(imageData, 0, 0);
};

function brightness (adjustment) {

    console.log('adjustment: ' + adjustment);
    imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
    data = imageData.data;

    for (var i= 0,len = data.length; i<len; i+=4) {

        data[i] += adjustment/5;
        data[i+1] += adjustment/5;
        data[i+2] += adjustment/5;
    }
    ctx.putImageData(imageData, 0, 0);
};

function saveToLocal(){

    localStorage.setItem("imgCanvas",canvas.toDataURL());
}

function loadFromLocal(){

    var img=new Image();
    img.onload=function(){
        ctx.drawImage(img,0,0);
    }
    img.src=localStorage.getItem("imgCanvas");
    canvas.width = img.width;
    canvas.height = img.height;
}