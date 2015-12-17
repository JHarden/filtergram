
Window.onload = function(event){

    console.log('loading..');
    var imageLoader = document.getElementById('img_capture');
    imageLoader.addEventListener('change', handleImage, false);
    var canvas = document.getElementById('img_canvas');
    var ctx = canvas.getContext('2d');


    function handleImage(e){
        var reader = new FileReader();
        reader.onload = function(event){
            var img = new Image();
            img.onload = function(){
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img,0,0);
                img.style.display = 'none';
                var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
                var data = imageData.data;


                var invert = function() {
                    for (var i = 0; i < data.length; i += 4) {
                        data[i]     = 255 - data[i];     // red
                        data[i + 1] = 255 - data[i + 1]; // green
                        data[i + 2] = 255 - data[i + 2]; // blue
                    }
                    ctx.putImageData(imageData, 0, 0);
                };

                var grayscale = function() {
                    for (var i = 0; i < data.length; i += 4) {
                        var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                        data[i] = avg; // red
                        data[i + 1] = avg; // green
                        data[i + 2] = avg; // blue        }
                        ctx.putImageData(imageData, 0, 0);
                    }
                };

                var colourOverlay = function(){

                    for (var i = 0; i < data.length; i += 4) {


                    }
                };

                var invertbtn = document.getElementById('invertbtn');
                invertbtn.addEventListener('click', invert);

                var grayscalebtn = document.getElementById('grayscalebtn');
                grayscalebtn.addEventListener('click', grayscale);

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

}();


