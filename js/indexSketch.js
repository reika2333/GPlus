let bgSketch = function(p) {
    let gl,noctaves,c;

    p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        gl=this.canvas.getContext('webgl'); 
        gl.disable(gl.DEPTH_TEST);
        noctaves=4;
        c=[];
        p.initc();
        p.test=new p5.Shader(this._renderer,vert,frag);//shaders are loaded
        p.shader(p.test);	
    }
    p.initc = function() {
        for(var i=0;i<22;i++){
            c[i] = p.random(-5,5);
        }
    }
    p.draw = function() {
        p.test.setUniform("iResolution", [p.width,p.height]);//pass some values to the shader
        p.test.setUniform("iTime", p.millis()*.001);
        p.test.setUniform('iMouse',[p.mouseX,p.mouseY]);
        p.test.setUniform("noctaves",noctaves);
        p.test.setUniform("c",c);
        p.shader(p.test);
        p.box(p.width/2);
    }
    // p.mouseReleased = function() {
    //     noctaves = (noctaves==5) ? 4 : noctaves + 1;
	//     if(noctaves==4) p.initc();
    // }
}

let myBg = new p5(bgSketch, 'bgElem')

let textSketch = function(p) {
    let x = 0;
    let y = 0;
    let stepSize = 5.0;
    let letters = "video games are a girl thing.";
    let fontSizeMin = 3;
    let angleDistortion = 0.0;
    let counter = 0;

    p.setup = function() {
        // use full screen size 
        p.createCanvas(p.windowWidth, p.windowHeight);
        // background(220);
        p.smooth();
        p.cursor(p.CROSS);
    
        x = p.mouseX;
        y = p.mouseY;
    
        p.textAlign(p.LEFT);
        p.fill(0);
    }
    p.draw = function() {
        if (p.mouseX) {
            let d = p.dist(x, y, p.mouseX, p.mouseY);
            p.textFont('Arial');
            p.textSize(fontSizeMin + d/2)
            let newLetter = letters.charAt(counter);
            stepSize = p.textWidth(newLetter);
        
            if (d > stepSize) {
              let angle = p.atan2(p.mouseY - y, p.mouseX - x); 
        
              p.push();
              p.translate(x, y);
              p.rotate(angle + p.random(angleDistortion));
              p.text(newLetter, 0, 0);
              p.pop();
        
              counter++;
             if (counter > letters.length - 1) counter = 0;
        
              x = x + p.cos(angle) * stepSize;
              y = y + p.sin(angle) * stepSize; 
            }
        }
    }
    p.mouseOver = function() {
        x = mouseX;
        y = mouseY;
    }
    p.keyPressed = function() {
        if (p.keyCode == p.DELETE || p.keyCode == p.BACKSPACE) p.setup();
        if (p.keyCode == p.UP_ARROW) angleDistortion += 0.1;
        if (p.keyCode == p.DOWN_ARROW) angleDistortion -= 0.1; 
    }
}

let myText = new p5(textSketch, 'textElem')