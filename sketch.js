// https://kylemcdonald.github.io/cv-examples/
// https://inspirit.github.io/jsfeat/sample_canny_edge.html

let capture;
let buffer;
let result;
let w = 640,
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
    let n = src.data.length;
    dst.loadPixels();
    let srcData = src.data;
    let dstData = dst.pixels;
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
    push();
    stroke('rgba(0,255,0,0.25)');
    strokeWeight(2);
    let xN = floor(width/numbX);
    let yN = floor(height/numbY);
    //detect colors
    colorDetection(numbX,numbY,xN,yN);

    for (let i = 1; i < numbX; i++){
        line(xN*i, 0, xN*i, height);
        /*for (let m = 1; m < numbY; m++){
            ellipse(xN*i,yN*m,100/numb);
        }*/
    }
    for (let j = 1; j < numbY; j++){
        line(0, yN*j, width, yN*j);
    }
    pop();
}

function colorDetection(numbX,numbY,xN,yN) {
    let index = 0;
    let rgba = [];
    let black = color('rgba(0,0,0,1)');
    let c = color(255, 0, 0);
    loadPixels();
    let xPixel = (4 * xN * 2);
    let yPixel = ((yN*2)*(4 * width)*2) ;
    for (let i = 1; i < numbY; i++) {
        for (let j = 1; j < numbX; j++) {
            // loop over
            index = (xPixel*j)+(yPixel*i);
            let x = xN * j;
            let y = yN * i;
            rgba[0] = pixels[index];
            rgba[1] = pixels[index + 1];
            rgba[2] = pixels[index + 2];
            rgba[3]= pixels[index + 3];
            //console.log('pixel:',x,y,"color",r,g,b,a);
            if (!arraysEqual(black.levels,rgba)){
                fill(c);
                ellipse(x, y, 8);
            } else {
                fill(0);
            }
        }
    }
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


/*
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
}*/
