// https://kylemcdonald.github.io/cv-examples/
// https://inspirit.github.io/jsfeat/sample_canny_edge.html

var capture;
var buffer;
var result;
var w = 640,
    h = 480;

function setup() {
    frameRate(10);
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function() {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    createCanvas(w, h);
    capture.size(w, h);
    capture.hide();
    buffer = new jsfeat.matrix_t(w, h, jsfeat.U8C1_t);
}

function jsfeatToP5(src, dst) {
    if (!dst || dst.width !== src.cols || dst.height !== src.rows) {
        dst = createImage(src.cols, src.rows);
    }
    var n = src.data.length;
    dst.loadPixels();
    var srcData = src.data;
    var dstData = dst.pixels;
    for (var i = 0, j = 0; i < n; i++) {
        var cur = srcData[i];
        dstData[j++] = cur;
        dstData[j++] = cur;
        dstData[j++] = cur;
        dstData[j++] = 255;
    }
    dst.updatePixels();
    return dst;
}

function raster(rastNumb) {
    let numb = rastNumb;
    let numbX = numb * 1.33333333333;
    let numbY = numb;
    let black = color('rgba(0,0,0,1)');
    push();
    stroke('rgba(0,255,0,0.25)');
    strokeWeight(2);
    let xN = width/numbX;
    let yN = height/numbY;
    let c;
    //old
    /*for (let i = 1; i < numbX; i++){
        line(xN*i, 0, xN*i, height);
    }
    for (let j = 1; j < numbY; j++){
        line(0, yN*j, width, yN*j);
    }*/
    //code
    for (let k = 1; k < numbX; k++){
        for (let m = 1; m < numbY; m++){
            //c = get(k, m);
            //if(!arraysEqual(c,black.levels)){
            //} else {
            //}
            ellipse(xN*k,yN*m,100/numb);
        }
    }
    pop()
    //colorDetection(numbX,numbY);
}

function colorDetection(numbX,numbY){
    let c = get(50, 90);
    let black = color('rgba(0,0,0,1)');
    if(!arraysEqual(c,black.levels)){
        console.log("color",c);
        console.log("black",black.levels);
    }
   fill(c);
    noStroke();
    rect(25, 25, 50, 50);
}

function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)===JSON.stringify(a2);
}

function draw() {
    image(capture, 0, 0, 640, 480);
    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!
        let blurSize = select('#blurSize').elt.value;
        let lowThreshold = select('#lowThreshold').elt.value;
        let highThreshold = select('#highThreshold').elt.value;
        let rast = select('#raster').elt.value;

        blurSize = map(blurSize, 0, 100, 1, 12);
        lowThreshold = map(lowThreshold, 0, 100, 0, 255);
        highThreshold = map(highThreshold, 0, 100, 0, 255);
        rast = map(rast, 0, 100, 10, 60);

        jsfeat.imgproc.grayscale(capture.pixels, w, h, buffer);
        jsfeat.imgproc.gaussian_blur(buffer, buffer, blurSize, 0);
        jsfeat.imgproc.canny(buffer, buffer, lowThreshold, highThreshold);
        let n = buffer.rows * buffer.cols;
        // uncomment the following lines to invert the image
       // for (var i = 0; i < n; i++) {
       //     buffer.data[i] = 255 - buffer.data[i];
       // }
        result = jsfeatToP5(buffer, result);
        image(result, 0, 0, 640, 480);
        raster(rast);
    }
}
