let fscale = 24; // a scale factor
// nodes settings
let nodeColour = [
    "#FF0000",
    "#ff5900",
    "#ffc800",
    "#95ff00",
    "#00ff55",
    "#00d9ff",
    "#001aff",
    "#5900ff",
    "#9d00ff",
    "#ff00d5"
]
let nodeSize = 2;
let xMin = 0;
let xMax = 9;
let yMin = 0;
let yMax = 9;
let dx = 0.2; // x distance between nodes
let dy = 0.2; // y distance between nodes
let nodes, nodesAxes;
let zAxes = [];

// the function to be plotted
function f(x,y)	{
    let z = ((Math.sin(x/3.2)*9)+(Math.sin(y/3.2)*9)-10);
    if (z < 0){z = 0}
    return z;
    //return ((Math.sin(x/3.2)*9)+(Math.sin(y/3.2)*9));
    //return (3*Math.sin(Math.sqrt(x*x+y*y)))/(Math.sqrt(x*x+y*y))+4;
    //return ((Math.sin(x/3.2)*9)+(Math.sin((y/-1.6)+4.7)*4.5-4.5));

}

function functionNodesConstructor() {
    // filling the nodes array with function points [x,y,z] where z = f(x,y).
    this.nodes = new Array();
    let px = 0;
    let py = 0;
    for (let i = 0; i < coordinates.length; i++){
        px = map3D(coordinates[i].x);
        py = map3D(coordinates[i].y);
        zAxes.push(f(px,py));
        this.nodes[i] = [px, py, f(px,py)];
    }
}

function makeFunctionNodes() {
    let shape = new functionNodesConstructor();
    nodes = shape.nodes;
    nodesAxes = [[0,0,0],[xMax,0,0],[0,yMax,0],[0,0,xMax]];
    rotateX3D(140 * Math.PI / 180);
    rotateY3D(150 * Math.PI / 180);
    rotateZ3D(150 * Math.PI / 180);
}

// Rotate shape around the z-axis
function rotateZ3D(theta) {
    //if (window.console && window.console.log) { console.log("rotZ="+theta) }
    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);

    for (let n=0; n<nodes.length; n++) {
        let node = nodes[n];
        let x = node[0];
        let y = node[1];
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
    let sinTheta = Math.sin(-theta);
    let cosTheta = Math.cos(-theta);

    for (let n=0; n<nodes.length; n++) {
        let node = nodes[n];
        let x = node[0];
        let z = node[2];
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
    let sinTheta = Math.sin(-theta);
    let cosTheta = Math.cos(-theta);

    for (let n=0; n<nodes.length; n++) {
        let node = nodes[n];
        let y = node[1];
        let z = node[2];
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


