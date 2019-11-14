let bgSketch = function(p) {
    const scl = 20;

    // use this to make circles overlap
    const MAIN_SCALE = .85;
    let y = 0;

    let WW, WH;

    let damping = 0.06;
    let mx = 0, my = 0;
    // let mouseIsDown = false;

    let gfx;
    let images = [];
    let curr = 0;

    let history = new Array(0);

    let truthPos;

    let rowsPerFrame = 2;

    function getQuery(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
        if(r!=null)return  unescape(r[2]); return null;
    }

    p.setup = function() {
        p.createCanvas(p.windowWidth, 1670);
	    [WW, WH] = [p.windowWidth, 1670];
	    p.newGfx();	
    }
    p.preload = function() {
        [0].forEach(i => {
            let fn = `../img/bg/${getQuery('id')}.jpg`;
            images[i] = p.loadImage(fn, function(_img){
                _img.loadPixels();
            });
        });
        
    // 	img = p.loadImage('0.png', function(_img){
    // 		_img.loadPixels();
    // 		gfx = createGraphics(_img.width * scl, _img.height * scl);
    // 		gfx.noStroke();
    // 	});
    }
    p.newGfx = function() {
        gfx = p.createGraphics(200 * scl, 200 * scl);
        gfx.noStroke();
        
        truthPos = p.createVector(p.floor(p.random(60, 100)), p.floor(p.random(50,60)));
    }
    p.drawTruth = function (){
        p.noStroke();
        let c = images[curr].pixels[(truthPos.y * images[curr].width + truthPos.x) *4];
        let sz = p.map(c, 0, 255, 0, scl);
        
        for(let i = 0; i < history.length-1; i++){	  
            let currX = history[i].x + truthPos.x * scl;
            let currY = history[i].y + truthPos.y * scl;
            let nextX = history[i+1].x + truthPos.x * scl;
            let nextY = history[i+1].y + truthPos.y * scl;
            
            let col = 209 * (i/history.length)
            p.stroke(255, 0, 0, c);
            p.strokeWeight(sz * MAIN_SCALE);
            p.line(currX, currY, nextX, nextY);
            
            // fill(255, 0, 0, c);
            // noStroke();
            // ellipse(currX, currY, sz);
        }
    }
    p.drawTransparency = function (){
        p.noStroke();
        p.fill(0, 20);
        p.rect(0, 0, WW, WH);
    }
    p.draw = function () {
        if(images[curr].width === 0) return;
        
        if(y < images[curr].height){
            let idx;
            
            let img = images[curr];
        
            let targetY = y + rowsPerFrame;
            
            for(let row = y; row < targetY; row++, y++){
            
                if(row >= img.height) break;
                
                for(let x = 0; x < img.width; x++){
                    idx = ((row * img.width) + x) * 4;
                    let c = img.pixels[idx];
                    let sz = p.map(c, 0, 255, 0, scl);
                    
                    gfx.fill(c);
                    gfx.ellipse(x * scl, row * scl, sz * MAIN_SCALE, sz* MAIN_SCALE);
                }
            }
        }
        
        p.drawTransparency();
        
        let dx = p.mouseX - mx;
        let vx = dx * damping;
        mx += vx;
        
        let dy = p.mouseY - my;
        let vy = dy * damping;
        my += vy;
        
        let tmx = p.map(mx, 0, WW, 0, -gfx.width/2);
        let tmy = p.map(my, 0, WH, 0, -gfx.height/2);
        
        p.image(gfx, tmx, tmy);
        
        
        if(history.length < 10){
            history.push({x:tmx, y:tmy});
        }
        else{
            history.shift();
            history.push({x:tmx, y:tmy});
        }
        
        p.drawTruth();
    }
}

let myBg = new p5(bgSketch, 'bgElem')