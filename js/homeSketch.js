let bgSketch = function(p) {
    let gl,noctaves,c;

    p.setup = function() {
        let el = document.querySelector('#bgElem')
        p.createCanvas(p.windowWidth, 3720, p.WEBGL);
        gl=this.canvas.getContext('webgl'); 
        gl.disable(gl.DEPTH_TEST);
        noctaves=3;
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
        p.test.setUniform("iResolution", [p.width,3720]);//pass some values to the shader
        p.test.setUniform("iTime", p.millis()*.001);
        // p.test.setUniform('iMouse',[p.mouseX,p.mouseY]);
        p.test.setUniform("noctaves",noctaves);
        p.test.setUniform("c",c);
        p.shader(p.test);
        p.box(3720);
    }
    // p.mouseReleased = function() {
    //     noctaves = (noctaves==5) ? 4 : noctaves + 1;
	//     if(noctaves==4) p.initc();
    // }
}

let myBg = new p5(bgSketch, 'bgElem')