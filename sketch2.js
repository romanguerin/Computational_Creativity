var fscale = 24; // a scale factor
// nodes settings
var nodeColour = "#FF0000";
var nodeSize = 2;
var xMin = 0;
var xMax = 9;
var yMin = 0;
var yMax = 9;
var dx = 0.2; // x distance between nodes
var dy = 0.2; // y distance between nodes
var nodes, nodesAxes;
var widthCanvas, heightCanvas;

// the function to be plotted
function f(x,y)	{
    return (5*Math.sin(Math.sqrt(x*x+y*y)))/(Math.sqrt(x*x+y*y));
}

function setup() {
    //widthCanvas = 480; // windowWidth p5.js?
    //heightCanvas = 480; // windowHeight p5.js?
    //widthCanvas = window.innerWidth;
    //heightCanvas = window.innerHeight;
    //var myCanvas = createCanvas2(widthCanvas, heightCanvas);
    //myCanvas.appendChild('myContainer');
    makeFunctionNodes();
}


function functionNodesConstructor() {
    // filling the nodes array with function points [x,y,z] where z = f(x,y).
    var i = 0;
    this.nodes = new Array();
    for (var x = xMin; x <= xMax; x += dx) {
        for (var y = yMin; y <= yMax; y += dy) {
            this.nodes[i] = [x, y, f(x,y)];
            ++i;
        }
    }
}

function makeFunctionNodes() {
    var shape = new functionNodesConstructor();
    nodes = shape.nodes;
    nodesAxes = [[0,0,0],[xMax,0,0],[0,yMax,0],[0,0,xMax]];
    rotateX3D(295 * Math.PI / 180);
    rotateY3D(30 * Math.PI / 180);
    //rotateZ3D(30 * Math.PI / 180);
}

// Rotate shape around the z-axis
function rotateZ3D(theta) {
    //if (window.console && window.console.log) { console.log("rotZ="+theta) }
    var sinTheta = Math.sin(theta);
    var cosTheta = Math.cos(theta);

    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var y = node[1];
        node[0] = x * cosTheta - y * sinTheta;
        node[1] = y * cosTheta + x * sinTheta;
    }
    for (n=0; n<nodesAxes.length; n++) {
        node = nodesAxes[n];
        x = node[0];
        y = node[1];
        node[0] = x * cosTheta - y * sinTheta;
        node[1] = y * cosTheta + x * sinTheta;
    }
}

// Rotate shape around the y-axis
function rotateY3D(theta) {
    //if (window.console && window.console.log) { console.log("rotY="+theta) }
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);

    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + x * sinTheta;
    }
    for (n=0; n<nodesAxes.length; n++) {
        node = nodesAxes[n];
        x = node[0];
        z = node[2];
        node[0] = x * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + x * sinTheta;
    }
}

// Rotate shape around the x-axis
function rotateX3D(theta) {
    //if (window.console && window.console.log) { console.log("rotX="+theta) }
    var sinTheta = Math.sin(-theta);
    var cosTheta = Math.cos(-theta);

    for (var n=0; n<nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
    for (n=0; n<nodesAxes.length; n++) {
        node = nodesAxes[n];
        y = node[1];
        z = node[2];
        node[1] = y * cosTheta - z * sinTheta;
        node[2] = z * cosTheta + y * sinTheta;
    }
}


function draw() { // By default, p5.js loops through draw() continuously at 60 frames per second, which is quite a load for the processor.
    var backgroundColour = color(0, 0, 0);
    background(backgroundColour); // overdraws the previous orientations at the loop rate
    translate(widthCanvas/2, heightCanvas/2); // shift the canvas widthCanvas/2 px right and heightCanvas/2 px down, so position (0,0) is at the center of the canvas

    // Draw nodes
    fill(nodeColour);
    noStroke();
    // sort the nodes by their z value so that the "deepest" nodes are drawn first and those closest to the viewer are drawn last.
    // nodes.sort(function(a, b){return a[2]-b[2]});
    for (var i=0; i < nodes.length; i++) {
        var px = nodes[i][0];
        var py = nodes[i][1];
        // the "pixels" are small rectangles which is faster than rendering small circles.
        rect(px*fscale,py*fscale,nodeSize,nodeSize)
    }

    // Draw axes
    stroke('white');
    fill('white');
    textSize(16);
    line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[1][0]*fscale,nodesAxes[1][1]*fscale);
    text("x",nodesAxes[1][0]*fscale,nodesAxes[1][1]*fscale);
    line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[2][0]*fscale,nodesAxes[2][1]*fscale);
    text("y",nodesAxes[2][0]*fscale,nodesAxes[2][1]*fscale);
    line(nodesAxes[0][0]*fscale,nodesAxes[0][1]*fscale,nodesAxes[3][0]*fscale,nodesAxes[3][1]*fscale);
    text("z",nodesAxes[3][0]*fscale,nodesAxes[3][1]*fscale);

}


function mouseDragged() {
    rotateY3D((mouseX - pmouseX) * Math.PI / 180);
    rotateX3D((mouseY - pmouseY) * Math.PI / 180);
}
function touchMoved() {
    rotateY3D((mouseX - pmouseX) * Math.PI / 180);
    rotateX3D((mouseY - pmouseY) * Math.PI / 180);
    // prevent default
    return false;
}
