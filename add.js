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
let zAxis = [];
//let yArray = [];

function sortOnY() {
    let sum = 1;
    for (let i = 0; i < (coordinates.length); i++) {
        for (let j = coordinates.length - 1; j > 0; j--) {
            if (coordinates[i].y === coordinates[j].y && coordinates[i].scoreY === undefined && coordinates[j].scoreY === undefined) {
                coordinates[i].scoreY = sum;
                coordinates[j].scoreY = sum;
                sum++;
                break;
            }
        }
        if (i < coordinates.length - 1) {
            if (coordinates[i].y !== coordinates[i + 1].y) {
                sum = 1;
            }
        }
    }
}

function sortOnX(){
    sortOnY();
    let sum = 1;
    coordinates.sort(function (a, b) {
        return a.x - b.x;
    })

    for (let i = 0; i < (coordinates.length); i++){
        for (let j = coordinates.length -1; j > 0; j--){
            if (coordinates[i].x === coordinates[j].x && coordinates[i].scoreX === undefined && coordinates[j].scoreX === undefined){
                coordinates[i].scoreX = sum;
                coordinates[j].scoreX = sum;
                sum++;
                break;
            }
        }
        if ( i < coordinates.length -1){
            if (coordinates[i].x !== coordinates[i + 1].x){
                sum = 1;
            }
        }
    }
}

function zAxisPlot(i) {
   let sum = (coordinates[i].scoreX + coordinates[i].scoreY)/2;
    //let sum = coordinates[i].scoreY;
    if (sum > 9){
        sum = 9;
    } else if ( sum < 0 || isNaN(sum) || sum === undefined){
        sum = 0;
    }
    return sum

}

function functionNodesConstructor() {
    // filling the nodes array with function points [x,y,z] where z = f(x,y).
    this.nodes = new Array();
    let px = 0;
    let py = 0;
    let pz = 0;
    for (let i = 0; i < coordinates.length; i++){
        px = map3D(coordinates[i].x);
        py = map3D(coordinates[i].y);
        //new pz
        //pz = coordinates[i].scoreX;
        pz = zAxisPlot(i);
        zAxis.push(pz);
        // recheck
        this.nodes[i] = [px, py, pz];
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


/*///////////////////////////////
const browsers = [
    { name: 1, year: 2008 },
    { name: 2, year: 2004 },
    { name: 3, year: 2004 },
    { name: 1, year: 1995 },
    { name: 1, year: 2004 },
    { name: 2, year: 2015 }
];

let sorted = _.groupBy(browsers, 'year', 'name');
//let sorted = _.sortBy(browsers, ['name', 'year'], ['asc', 'asc']);
for (let i = 0; i < sorted.length; i++){
    sorted[i] = _.sortBy(sorted[i], 'year', 'name');
}
console.log(sorted);*/

