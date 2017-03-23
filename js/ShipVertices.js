/* global vec3, vec2, gl, flatten, Utils, mv, mult, scale4, translate */

class ShipVertices {
  constructor(color){
    this.scale = 1.0;
    this.width = this.scale*3.0;
    this.height = this.scale*1.0;
    this.noseLength = this.scale*4.0;
    this.concave = this.scale*0.5;

    this.centerOfRotation = 0.5;

    this.vertices = [
      vec3( 0.0,  this.height, -this.concave + this.centerOfRotation),
      vec3( this.width,  0.0,  this.height + this.centerOfRotation),
      vec3( 0.0, -this.height, -this.concave + this.centerOfRotation),

      vec3( 0.0,  this.height, -this.concave + this.centerOfRotation),
      vec3( 0.0, -this.height, -this.concave + this.centerOfRotation),
      vec3(-this.width,  0.0,  this.height + this.centerOfRotation),


      vec3(-this.width,  0.0,  this.height + this.centerOfRotation),
      vec3( 0.0,  this.height, -this.concave + this.centerOfRotation),
      vec3( 0.0,  0.0, -this.noseLength + this.centerOfRotation),

      vec3( this.width,  0.0,  this.height + this.centerOfRotation),
      vec3( 0.0,  this.height, -this.concave + this.centerOfRotation),
      vec3( 0.0,  0.0, -this.noseLength + this.centerOfRotation),

      vec3(-this.width,  0.0,  this.height + this.centerOfRotation),
      vec3( 0.0, -this.height, -this.concave + this.centerOfRotation),
      vec3( 0.0,  0.0, -this.noseLength + this.centerOfRotation),

      vec3( this.width,  0.0,  this.height + this.centerOfRotation),
      vec3( 0.0, -this.height, -this.concave + this.centerOfRotation),
      vec3( 0.0,  0.0, -this.noseLength + this.centerOfRotation),
    ];

    this.lineVertices = [
      vec3(-this.width, 0.0,  this.height + this.centerOfRotation),
      vec3( 0.0, this.height, -this.concave + this.centerOfRotation),
      vec3( 0.0, this.height, -this.concave + this.centerOfRotation),
      vec3( this.width, 0.0,  this.height + this.centerOfRotation),
      vec3( this.width, 0.0,  this.height + this.centerOfRotation),
      vec3( 0.0,-this.height, -this.concave + this.centerOfRotation),
      vec3( 0.0,-this.height, -this.concave + this.centerOfRotation),
      vec3(-this.width, 0.0,  this.height + this.centerOfRotation),

//      vec3( 0.0, this.height, -this.concave + this.centerOfRotation),
//      vec3( 0.0,-this.height, -this.concave + this.centerOfRotation),

      vec3(-this.width, 0.0,  this.height + this.centerOfRotation),
      vec3( 0.0, 0.0, -this.noseLength + this.centerOfRotation),

      vec3( this.width, 0.0,  this.height + this.centerOfRotation),
      vec3( 0.0, 0.0, -this.noseLength + this.centerOfRotation),

      vec3( 0.0, this.height, -this.concave + this.centerOfRotation),
      vec3( 0.0, 0.0, -this.noseLength + this.centerOfRotation),

      vec3( 0.0,-this.height, -this.concave + this.centerOfRotation),
      vec3( 0.0, 0.0, -this.noseLength + this.centerOfRotation),
//
//      vec3( 0.0, 0.0, -this.noseLength + this.centerOfRotation),
//      vec3( )
    ];

    this.color = color;
    
    this.vBuffer;
    this.lBuffer;

    this.linePoints;

    this.init();
  }
  
  init() {
    this.vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );

    this.lBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.lBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.lineVertices), gl.STATIC_DRAW );
  }

  draw() {
    Utils.draw(this.vBuffer, this.color, this.vertices.length);
    Utils.drawLines(this.lBuffer, vec4(0.0, 1.0, 0.0, 1.0), this.lineVertices.length);
  }
}