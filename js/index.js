//@todo(tdamron): load data from a file in production

let csv = `
ID,Start time,Completion time,Email,Name,What is the name of this resource?,Link to resource,What type of resource is this?,"How would you rank this resources difficulty? (Note: not sure how difficult this resource is? Take a guess! Your answer will be validated later.)

1 - Extremely simple
5 - Very difficult"
1,7/2/20 11:00:22,7/2/20 11:01:24,tri11103@esri.com,Tristan Damron,Esri - Instructional Resources for Schools,https://www.esri.com/en-us/industries/education/schools/instructional-resources,AGOL;Cartography;,3
2,7/2/20 11:01:25,7/2/20 11:03:11,tri11103@esri.com,Tristan Damron,GIS Fundamentals - Complete Learning Plan,https://www.esri.com/training/catalog/5b73407f8659c25ea7014330/gis-fundamentals/,ArcGIS Pro;AGOL;Data Science;Cartography;,4
3,7/2/20 11:03:12,7/2/20 11:03:58,tri11103@esri.com,Tristan Damron,ArcGIS Pro Fundamentals - Complete Learning Plan,https://www.esri.com/training/catalog/5b733d0c8659c25ea7013df9/arcgis-pro-fundamentals/,ArcGIS Pro;Data Science;Cartography;,3
4,7/2/20 11:03:59,7/2/20 11:05:04,tri11103@esri.com,Tristan Damron,Getting Started with ArcGIS Pro - Esri Web Course,https://www.esri.com/training/catalog/57630435851d31e02a43f007/getting-started-with-arcgis-pro/,ArcGIS Pro;ArcMap;Data Science;,3
5,7/2/20 11:05:05,7/2/20 11:05:52,tri11103@esri.com,Tristan Damron,Esri Library,https://compass.esri.com/resources/esripress/Pages/Home.aspx#InplviewHash4809f385-1dc4-44e1-8df5-83f9d2f9bbe1=,ArcGIS Pro;ArcGIS Enterprise;AGOL;ArcMap;Indoors;Space Planner;Maritime;Aviation;Bathymetry;Topography;Defense Mapping;INSPIRE;Python;Data Science;Cartography;Graphic Design;Writing;,2
6,7/2/20 11:06:25,7/2/20 11:07:02,tri11103@esri.com,Tristan Damron,ArcGIS Indoors: Loading Floor Plan Data - Esri Web Course,https://www.esri.com/training/catalog/5ecd6ae0dbabbe0afc9feb81/arcgis-indoors%3A-loading-floor-plan-data/,ArcGIS Pro;ArcGIS Enterprise;AGOL;Indoors;Python;,4
7,7/2/20 15:59:03,7/2/20 15:59:44,tri11103@esri.com,Tristan Damron,How to make area cartogram maps in ArcGIS (ArcMap),https://www.gislounge.com/how-to-make-area-cartogram-maps-in-arcgis/,ArcMap;Cartography;,2
8,7/2/20 16:00:43,7/2/20 16:03:19,tri11103@esri.com,Tristan Damron,The Basics of GIS - ArcGIS Pro,https://www.youtube.com/watch?v=BFYG9oEV1EE,ArcGIS Pro;,1
9,7/2/20 16:03:51,7/2/20 16:07:31,tri11103@esri.com,Tristan Damron,Understanding Map Scale,https://www.gislounge.com/understanding-scale/,Cartography;,1
`;
let numberOfLines = 0;
let lines;
let nodes = [];
let toc = [];
let lineLabels = [];
let zoom;

function setup() {
    lines = csv.split('\n');    
    createCanvas(windowWidth - 40, windowHeight);
    background(250);       
    for (var i = 2; i < lines.length; i++) {
        nodes.push(createNode(random(windowWidth/5 + 30, windowWidth - 64), random(windowHeight - 30), lines[i].split(",")[5], lines[i].split(",")[7], lines[i].split(",")[6], parseInt(lines[i].split(",")[8])))                
    }        

    for (var i = 0; i < nodes.length; i++) {
        toc.push(createTOCEntry(nodes[i].name, nodes[i]));
    }
}

function draw() {    
    clear();    
    growAndShrink();    
    hoverTOCEntry();

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].name) {
            fill(0);
            stroke(150);    
            strokeWeight(1);               
            drawConnections(nodes[i]);            
            // let c = color(random(255), random(255), random(255));
            // fill(c);
            stroke(0);
            fill(nodes[i].color);
            circle(nodes[i].xPos, nodes[i].yPos, nodes[i].currentSize);                        
            textSize(12); 
            textAlign(CENTER);           
            text(nodes[i].name, nodes[i].xPos + 12, nodes[i].yPos - 12, 80, 80);                                                                                            
        }
    } 
    
    drawTOC();
    // scale(zoom);
}

function drawTOC() {
    fill(255);
    stroke(100);
    rect(0, 0, windowWidth/5, windowHeight)
    textSize(12);    
    for (var i = 0; i < toc.length; i++) {
        if (toc[i].name) {
            toc[i].xPos = 10        
            toc[i].yPos = (i * 45);
            fill(toc[i].node.color);                
            text(toc[i].name, toc[i].xPos, toc[i].yPos, windowWidth/5 - 10);
        }
    }
}

function hoverTOCEntry() {
    for (var i = 0; i < toc.length; i++) {
        var distance = dist((windowWidth/5 - 10) / 2, toc[i].yPos, mouseX, mouseY);        
        
        if (distance <= 30) {   
            if (toc[i].node.difficulty < 2) {
                toc[i].node.color = color(0, 255, 0);
            } else if (nodes[i].difficulty < 4 && nodes[i].difficulty >= 2) {
                toc[i].node.color = color(255, 255, 0);
            } else {
                toc[i].node.color = color(255, 0, 0);
            }

            toc[i].node.active = true;
        } else {
            // toc[i].node.color = 0;
            toc[i].node.active = false;
        }
    }
}

function growAndShrink() {
    for (var i = 0; i < nodes.length; i++) {
        var distance = dist(nodes[i].xPos, nodes[i].yPos, mouseX, mouseY);        
        
        if (distance <= nodes[i].currentSize/2) {
            if (nodes[i].difficulty < 2) {
                nodes[i].color = color(0, 255, 0);
            } else if (nodes[i].difficulty < 4 && nodes[i].difficulty >= 2) {
                nodes[i].color = color(255, 255, 0);
            } else {
                nodes[i].color = color(255, 0, 0);
            }            
            nodes[i].isGrowing = true;
        } else {
            nodes[i].isGrowing = false;
            nodes[i].color = 0;
        }


        if (!nodes[i].active) {
            if (nodes[i].isGrowing && nodes[i].currentSize <= nodes[i].maxSize) {
                nodes[i].currentSize += 1;                                  
            } else if (!nodes[i].isGrowing && nodes[i].currentSize >= nodes[i].minSize) {
                nodes[i].currentSize -= 3;
            }                
        } else {
            fill(255);
            stroke(100);            
        }
    }
}

function mouseDragged() {
    for (var i = 0; i < nodes.length; i++) {
        var distance = dist(nodes[i].xPos, nodes[i].yPos, mouseX, mouseY);        

        if (distance <= nodes[i].currentSize*2) {
            nodes[i].isMoving = true;
        } else {
            nodes[i].isMoving = false;
        }

        if (nodes[i].isMoving) {
            nodes[i].xPos = mouseX;
            nodes[i].yPos = mouseY;
        }
    }
}

function drawConnections(node) {     
    if (node.categories) {
        var categories = node.categories.split(";");        
        for (var i = 0; i < nodes.length; i++) {                        
            if (nodes[i].categories) {                
                var compareToCategories = nodes[i].categories.split(";");                
                for (var j = 0; j < categories.length; j++) {                                             
                    if (categories[j] && compareToCategories.includes(categories[j])) {
                        if (node.active || node.isGrowing) {
                            stroke(color(255, 0, 0));
                            strokeWeight(3);
                        }                        
                        line(node.xPos, node.yPos, nodes[i].xPos, nodes[i].yPos);                        
                    }
                }
            }
        }
    }
}

function doubleClicked() {
    for (var i = 0; i < nodes.length; i++) {
        var distance = dist(nodes[i].xPos, nodes[i].yPos, mouseX, mouseY);        

        if (distance <= nodes[i].currentSize*2) {            
            window.open(nodes[i].link, '_blank');
        }
    }
}

function mouseWheel(event) {
    // @todo(tdamron): Zoom in and out
    return false;
}

function createTOCEntry(_name, _node) {
    let TOCEntry = {
        name: _name,
        node: _node,
        xPos: 0,
        yPos: 0
    }

    return TOCEntry;
}

function createNode(x, y, n, cats, l, diff) {
    let Node = {
        xPos : x,
        yPos : y,
        name: n,
        categories: cats,
        maxSize: 20,
        minSize: 10,
        currentSize: 10,
        isGrowing: false,
        isMoving: false,
        link: l,
        active: false,
        difficulty: diff,
        color: 0
    }

    return Node;
}
