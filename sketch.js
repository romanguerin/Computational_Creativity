//cv-edge-detection computational creativity
// code Roman Guerin, Floor Stolk
let capture;
let img;
let buffer;
let result;
let w = 480,
    h = 480;
let rightBuffer, leftBuffer;
let coordinates = [];
let bool = true;
//console.log(window)

function setup() {
    //camera capture
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
    // 800 x 400 (double width to make room for each "sub-canvas")
    createCanvas(w*2, h);
    // Create both of your off-screen graphics buffers
    rightBuffer = createGraphics(w, h);
    leftBuffer = createGraphics(w, h);
    capture.size(w, h);
    capture.hide();
    buffer = new jsfeat.matrix_t(w, h, jsfeat.U8C1_t);
    //right drawing
    //makeFunctionNodes();
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
    //numb is input of raster
    let numb = floor(rastNumb/10)*10; //rounded
    if (numb === 50){//50 makes mistake so make 60
        numb = 60;
    }
    let numbX = numb;
    let numbY = numb;
    stroke('rgba(0,255,0,0.25)'); //green color
    strokeWeight(2);
    let xN = floor(w/numbX);
    let yN = floor(h/numbY);
    //detect colors
    colorDetection(numbX,numbY,xN,yN);
    //draw raster
    for (let i = 1; i < numbX; i++){
        line(xN*i, 0, xN*i, h);
    }
    for (let j = 1; j < numbY; j++){
        line(0, yN*j, w, yN*j);
    }
}

function colorDetection(numbX,numbY,xN,yN) {
    //color detector if white draw circle
    //and put in array
    let arrInd = 0;
    let index = 0;
    let rgba = [];
    let black = color('rgba(0,0,0,1)');
    let c = color(255, 0, 0);
    // load pixels
    loadPixels();
    let count = 0;
    let cut = ((w*4)*2);
    //paxel is new pixe;
    let paxel = [];
    for (let t = 0; t < pixels.length; t++) {
        if (count <= cut ) {
            paxel.push(pixels[t]);
        } else if (count > (cut*2)-1){
            count = 0;
        }
        count++
    }
    //plus for the extra screen
  let xPixel = (4 * xN * 2);
  let yPixel = ((yN*2)*(4 * w)*2) ;
  for (let i = 1; i < numbY; i++) {
      for (let j = 1; j < numbX; j++) {
          // loop over
          index = (xPixel*j)+(yPixel*i);
          let x = xN * j;
          let y = yN * i;
          rgba[0] = paxel[index];
          rgba[1] = paxel[index + 1];
          rgba[2] = paxel[index + 2];
          rgba[3] = paxel[index + 3];

          //console.log('pixel:',x,y,"color",r,g,b,a);
          if (!arraysEqual(black.levels,rgba)){
              fill(c);
              ellipse(x, y, 6);
              //push array
              if (arrInd === 0) {
                  coordinates = [];
              }
              coordinates.push({'i': arrInd,'x': x, 'y': y })
              arrInd++;
          } else {
              fill(0);
          }
      }
  }
  paxel.length = 0;
}

function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)===JSON.stringify(a2);
}


function draw() {
    // Draw on your buffers however you like
    drawLeftBuffer();
    drawRightBuffer();
    // Paint the off-screen buffers onto the main canvas
    image(leftBuffer, 0, 0);
    image(rightBuffer, 480, 0);
    //ole.log(coordinates);
}

function drawLeftBuffer() {
    //console.log(coordinates.length,coordinates[floor(coordinates.length/2)]);
    image(capture, 0, 0, 480, 480);
    capture.loadPixels();
    if (capture.pixels.length > 0) { // don't forget this!
        result = jsfeatToP5(buffer, result);
        image(result, 0, 0, 480, 480)

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

        raster(rast);
    }
}

function map3D(mapper){
    return map(mapper, 0, 480, 0, 9);
}

function drawRightBuffer() {
    makeFunctionNodes();
    //console.log(nodesAxes);
    let backgroundColour = color(0, 0, 0);
    rightBuffer.background(backgroundColour); // overdraws the previous orientations at the loop rate

    if (bool === true){
    rightBuffer.translate(25, h/3.5);
    rightBuffer.scale(0.65);
    bool = false;
    }

    for (let i=0; i < nodes.length; i++) {
        let px = nodes[i][0];
        let py = nodes[i][1];
        let pz = ceil(nodes[i][2]);
        if (pz > 9){
            pz = 9;
        } else if ( pz < 0){
            pz = 0;
        }
        rightBuffer.fill(nodeColour[pz]);
        rightBuffer.noStroke();
        // the "pixels" are small rectangles which is faster than rendering small circles.
        rightBuffer.rect(px*fscale,py*fscale,nodeSize,nodeSize)
    }

    // Draw axes
    rightBuffer.stroke('white');
    rightBuffer.fill('white');
    rightBuffer.textSize(16);
    rightBuffer.line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[1][0]*fscale,nodesAxes[1][1]*fscale);
    rightBuffer.text("x",nodesAxes[1][0]*fscale,nodesAxes[1][1]*fscale);
    rightBuffer.line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[2][0]*fscale,nodesAxes[2][1]*fscale);
    rightBuffer.text("y",nodesAxes[2][0]*fscale,nodesAxes[2][1]*fscale);
    rightBuffer.line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[3][0]*fscale,nodesAxes[3][1]*fscale);
    rightBuffer.text("z",nodesAxes[3][0]*fscale,nodesAxes[3][1]*fscale);

}
