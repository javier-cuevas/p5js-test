let img;
var points = [];
var EPSILON = 0.0001;
var density = 120;

//Angle Bridage
var mult

function preload() {
  img = loadImage('04.png');
}

function setup() {
	createCanvas(691, 777);
	//img.resize(canvas.width/1.1/1.8, canvas.height/1.1/1.8);
  
  pg = createGraphics(691, 700);
  pg.image(img, 0, 0);
  //pg.filter(BLUR, 50);
  img = pg;
  image(img, 0, 0);
	background(0);
	angleMode(DEGREES)
	//noiseDetail(1)
	
	var space = width /density;
	for (var x=0; x<width; x+= space){
		for (var y=0; y<height; y+= space){
            var particle = new Object();
			particle.pos = createVector(x + random(-10,10), y + random(-10,10));
            particle.vel = createVector(random(-3, 3), random(-3, 3));
            particle.speed = random(-1, 1)>0?2:-2;//better result if move different direction.
            particle.size = random(5, 8);
            particle.col = color(img.get(particle.pos.x, particle.pos.y));
			points.push(particle);
		}
	}
	
	mult = random(0.01, 0.1)

}

function curl(x, y){//vortex based on image gradient.
  //Find rate of change in X direction
  var n1 = brightness(color(img.get(x + 1, y)));
  var n2 = brightness(color(img.get(x - 1, y)));
  n1 += noise(x*mult + EPSILON, y*mult);
  n2 += noise(x*mult - EPSILON, y*mult);

  //Average to find approximate derivative
  var a = (n1 - n2)/(2 * EPSILON);

  //Find rate of change in Y direction
  n1 = brightness(color(img.get(x, y + 1)));
  n2 = brightness(color(img.get(x, y - 1)));
  n1 += noise(x*mult, y + EPSILON*mult); 
  n2 += noise(x*mult, y - EPSILON*mult); 

  //Average to find approximate derivative
  var b = (n1 - n2)/(2 * EPSILON);

  return new createVector(b, -a);
}

function draw() {
  fill(0, 40);
  rect(0, 0, width, height);
	noStroke()
	//fill(255)
	
	for(var i=0; i<points.length; i++){
		
        var p = points[i];
		var c = color(img.get(p.pos.x, p.pos.y));
		
		var r = red(c);   //map(points[i].x, 0, width, r1, r2)
		var g = green(c); //map(points[i].y, 0, height, g1, g2)
		var b = blue(c);  //map(points[i].y, 0, width, b1, b2)
		var a = map(dist(width /2, height /2, p.pos.x, p.pos.y), 0, 380, 255, 0)
		//var alpha = (sin(i/318)*255)+100
        
        var pc = p.col;
        var pr = red(pc)/255.0;
        var pg = green(pc)/255.0;
        var pb = blue(pc)/255.0;
        var pa = alpha(pc)/255.0;
      
		//fill(fc);
		
        //curl noise version
        var cvec = curl(p.pos.x,p.pos.y);
        var cvecMag = cvec.mag();
        var vec = cvec.normalize();
      if(!mouseIsPressed){
        p.color = color(r,g,b, a*pa);
        p.col = c;
        if(cvecMag > 500){
          p.vel = (vec)
        }
        //perin noise version
        else{
        var angle = map(noise(p.pos.x * mult, p.pos.y * mult),0,1, 0, 720)
        p.vel = (createVector(cos(angle)*p.speed, sin(angle)*p.speed))
        }
      }
        p.pos.add(p.vel);
		
		if (dist(width/2, height/2, p.pos.x, p.pos.y) < 600){ 
          //var radius = pow(1-brightness(c)/255.0 ,10)*10;
          fill(p.col);
			ellipse(p.pos.x, p.pos.y, p.size*brightness(c)/255.0*2);
		}
      if(random(1000)<1){
       // p.pos = createVector(random(width), random(height));
      }
	}
}