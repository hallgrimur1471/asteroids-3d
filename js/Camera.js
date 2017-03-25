'use strict';

/* global Utils, gl, mv, lookAt, mult, vec3, perspective, flatten */

class Camera {
  static get VIEW_COCKPIT(){
    return "cockpit_view";
  }
  static get VIEW_FOLLOWING(){
    return "following_view";
  }
  static get VIEW_STATIONARY(){
    return "stationary_view";
  }
  constructor(mouse) {
    this.mouse = mouse;
    
    this.fovy = 50;
    this.aspect = 1;
    this.near = 0.2;
    this.far = 100;
    
    this.setProjection(this.fovy, this.aspect, this.near, this.far);
    
    this.views = [Camera.VIEW_COCKPIT, Camera.VIEW_FOLLOWING, Camera.VIEW_STATIONARY];
  
    this.setView(Camera.VIEW_STATIONARY);
    
    // camera rotation and zoom
    this.rotating = false;
    this.spinY = -10.0;
    this.spinX = 35.0;
    this.origX;
    this.origY;
    this.zoom = -1.0;
    this.zoomSensitivity = 1.0;
    this.addMouseListeners(this);
  }

  setProjection(fovy, aspect, near, far) {
    var proj = perspective( fovy, aspect, near, far );
    gl.uniformMatrix4fv(Utils.proLoc, false, flatten(proj));
  }

  addMouseListeners(self) {
    this.mouse.addMouseDownListener(e => {
      e.preventDefault();
      this.rotating = true;
      this.origX = e.offsetX;
      this.origY = e.offsetY;
    });

    this.mouse.addMouseMoveListener(e => {
      if (this.rotating) {
        this.spinY = (this.spinY + (this.origX-e.offsetX)) % 360;
        this.spinX = (this.spinX - (this.origY-e.offsetY)) % 360;
        this.origX = e.offsetX;
        this.origY = e.offsetY;
      }
    });

    this.mouse.addMouseUpListener(e => {
      this.rotating = false;
    });

    this.mouse.addMouseScrollListener(e => {
      if (e.wheelDelta < 0) {
        self.zoom -= self.zoomSensitivity;
      } else {
        self.zoom += self.zoomSensitivity;
      }
      console.log(`Zoom level set to ${this.zoom}`);
    });
  }
  
  setView(view){
    console.info(`View set to ${view}`);
    this.currentView = view;
    this.updateMouseListeners();
  }
  
  setEntityToFollow(entity){
    this.entityToFollow = entity;
  };
  
  configure() {
    switch (this.currentView) {
      case Camera.VIEW_COCKPIT:
        this.configureCockpitView();
        break;
      case Camera.VIEW_FOLLOWING:
        this.configureFollowingView();
        break;
      case Camera.VIEW_STATIONARY:
        this.configureStationaryView();
        break;
      default:
        console.error(`View: ${this.currentView} is not a defined view.`);
    }
  }
  configureCockpitView(){
    let eye = add(this.entityToFollow.position, scale(0.20, this.entityToFollow.headingVector));
    //eye = add(eye, scale(0.1, this.entityToFollow.upVector));
    const at = add(this.entityToFollow.position, this.entityToFollow.headingVector);
    const up = this.entityToFollow.upVector;
    mv = mult(mv, lookAt(eye, at, up));
    const entity = this.entityToFollow;
  }
  
  configureFollowingView(){
    let eye = add(this.entityToFollow.position, negate(scale(0.8, this.entityToFollow.headingVector)));
    eye = add(eye, scale(0.5, this.entityToFollow.upVector));
    const at = add(this.entityToFollow.position, this.entityToFollow.headingVector);
    const up = this.entityToFollow.upVector;
    mv = mult(mv, lookAt(eye, at, up));
  }
  
  configureStationaryView(){
    const eye =  vec3(0.0, 0.0, this.zoom, 1.0);
  	const at = vec3(0.0, 0.0, this.zoom+0.1, 1.0);
  	const up = vec3(0.0, 1.0, 0.0, 1.0);
  	mv = mult( mv, lookAt( eye, at, up ));

    mv = mult( mv, mult( rotateX(this.spinX), rotateY(this.spinY)));
  }
  
  nextView() {
    const numberOfViews = this.views.length;
    const currentViewIndex = this.views.indexOf(this.currentView);
    
    const nextView = this.views[ (currentViewIndex+1)%numberOfViews ];
    this.setView(nextView);
  }
  
  zoom(event) {
    if (event.deltaY < 0) {
      this.zoom += this.zoomSensitivity;
    } else {
      this.zoom -= this.zoomSensitivity;
    }
    console.log(`Zoom level set to ${this.zoom}`);
  }
  
  updateMouseListeners() {
    switch (this.currentView) {
      case Camera.VIEW_COCKPIT:
        this.mouse.removeMouseScrollListener(this.zoom);
        break;
      case Camera.VIEW_FOLLOWING:
        this.mouse.removeMouseScrollListener(this.zoom);
        break;
      case Camera.VIEW_STATIONARY:
        this.mouse.addMouseScrollListener(this.zoom);
        break;
      default:
        console.error("cannot update camera mouse listeners because " +
                      this.currentView, "is not defined.");
    }
  }
}