//@todo(tdamron): load data from a file in production

let csv;
let numberOfLines = 0;
let lines;
let nodes = [];
let toc = [];
let tocElements = [];
let lineLabels = [];
let shoppingCart = [];
let cartIcon;
let cartModal;
let zoom;

function preload() {
    csv = loadTable("assets/data.csv", "csv", "header");         
}

function setup() {    
    createCanvas(windowWidth - 40, windowHeight);
    background(250);               

    for (var i = 2; i < csv.getRowCount(); i++) {
        nodes.push(createNode(random(0, windowWidth - 256), random(windowHeight - 128), csv.getString(i, 5), csv.getString(i, 7), csv.getString(i, 6), parseInt(csv.getString(i, 8))));        
    }        

    for (var i = 0; i < nodes.length; i++) {
        toc.push(createTOCEntry(nodes[i].name, nodes[i]));
    }
    
    cart = select("#cart");
    cartModal = select("#cartModal");

    sortTOC();
    drawTOC();    
}

function sortTOC() {
    for (var i = 0; i < toc.length; i++) {
        for (var j = 1; j < toc.length - 1; j++) {
            if (toc[i].node.difficulty < toc[j].node.difficulty) {
                var tmp = toc[i];
                toc[i] = toc[j];
                toc[j] = tmp;
            }
        }
    }
}

function sortShoppingCart() {
    for (var i = 0; i < shoppingCart.length; i++) {
        for (var j = 1; j < shoppingCart.length - 1; j++) {
            if (shoppingCart[i].difficulty < shoppingCart[j].difficulty) {
                var tmp = shoppingCart[i];
                shoppingCart[i] = shoppingCart[j];
                shoppingCart[j] = tmp;
            }
        }
    }
}


function showCart() {
    sortShoppingCart();

    var ret = `<h3 class='trailer-half'>Your learning plan!</h3>`;

    for (var i = 0; i < shoppingCart.length; i++) {
        ret += "<p><a href=\"" + shoppingCart[i].link + "\" target=\"_blank\">" + shoppingCart[i].name + "</a> | URL: " + shoppingCart[i].link + + "</p>\n";
    }   

    ret += `
      </br> 
      </br> 
      <button type="button" onclick="printJS('cartModal', 'html')">
    	Print your learning plan
      </button>
      </br>	 
      <small>Press ESC to close your cart.</small>
    `;
    
    cartModal.html(ret);
}

function draw() {       
    if (shoppingCart.length > 0) {
        cart.removeClass("cartIsEmpty");
        cart.addClass("cartHasItems");
    }

    cart.html(shoppingCart.length);

    clear();    
    growAndShrink();            

    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].name) {            
            stroke(240);    
            strokeWeight(1);               
            drawConnections(nodes[i]);                                    
            stroke(0);            
            fill(nodes[i].color);                 
            circle(nodes[i].xPos, nodes[i].yPos, nodes[i].currentSize);                        
            textSize(12); 
            textAlign(CENTER);                            
            text(nodes[i].name, nodes[i].xPos + 12, nodes[i].yPos - 12, 80, 80);                                                                                            
        }
    }     
}

function drawTOC() {
    var navSideBar = select("#toc");
    for (var i = 0; i < toc.length; i++) {
        if (toc[i].name) {
            var a = createA("#", toc[i].name); 
            
            if (toc[i].node.difficulty < 2) {
                a.id("simple");
            } else if (toc[i].node.difficulty < 4 && toc[i].node.difficulty >= 2) {
                a.id("moderate");
            } else {
                a.id("difficult");
            } 

            a.class("toc-elem side-nav-link");                        
            navSideBar.child(a);
            tocElements.push(a);
        }
    }
}

function activateTOCEntry(name) { 
    for (var i = 0; i < toc.length; i++) {
        toc[i].node.active = false;
        toc[i].node.isGrowing = false;
    }
    
    for (var i = 0; i < toc.length; i++) {
        if (toc[i].name == name) {
            toc[i].node.active = !toc[i].node.active;
        } else {
            toc[i].node.active = false;
        }

        for (var j = 0; j < tocElements.length; j++) {            
            if (tocElements[j].elt.firstChild.data.includes(toc[i].name)) {
                if (toc[i].node.active) {
                    tocElements[j].addClass("bold");
                } else {
                    tocElements[j].removeClass("bold");
                }
            }
        }
    }
}

function growAndShrink() {
    for (var i = 0; i < nodes.length; i++) {
        var distance = dist(nodes[i].xPos, nodes[i].yPos, mouseX, mouseY);        
        
        if (distance <= nodes[i].currentSize/2) {       
            nodes[i].isGrowing = true;
        } else {
            nodes[i].isGrowing = false;
            nodes[i].color = 0;
        }

        if ((nodes[i].isGrowing || nodes[i].active) && nodes[i].currentSize <= nodes[i].maxSize) {
            if (nodes[i].difficulty < 2) {
                nodes[i].color = color(80,186,95);
            } else if (nodes[i].difficulty < 4 && nodes[i].difficulty >= 2) {
                nodes[i].color = color(237,211,23);
            } else {
                nodes[i].color = color(230,82,64);
            }                 
            nodes[i].currentSize += 1;                                  
        } else if ((!nodes[i].isGrowing && !nodes[i].active) && nodes[i].currentSize >= nodes[i].minSize) {
            nodes[i].currentSize -= 3;
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
                            strokeWeight(3);
                            stroke(color(255, 0, 0));                            
                        }                        
                        line(node.xPos, node.yPos, nodes[i].xPos, nodes[i].yPos);                        
                    }
                }
            }
        }
        strokeWeight(1);
    }
}

function doubleClicked() {
    for (var i = 0; i < nodes.length; i++) {
        var distance = dist(nodes[i].xPos, nodes[i].yPos, mouseX, mouseY);        

        if (distance <= nodes[i].currentSize*2) {            
            nodes[i].active = true;
            if (!shoppingCart.includes(nodes[i])) {
                shoppingCart.push(nodes[i]);
            }            
            // window.open(nodes[i].link, '_blank');
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
