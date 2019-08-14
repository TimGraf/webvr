/*
 * Register custom A-Frame components.
 */

// Add ability to set opacity on custom objects
AFRAME.registerComponent('model-opacity', {
  schema: {default: 1.0},
  init: function() {
    this.el.addEventListener('model-loaded', this.update.bind(this));
  },
  update: function () {
    var mesh = this.el.getObject3D('mesh');
    var data = this.data;
    if (!mesh) { return; }
    mesh.traverse(function (node) {
      if (node.isMesh) {
        node.material.opacity = data;
        node.material.transparent = data < 1.0;
        node.material.needsUpdate = true;
      }
    });
  }
});

AFRAME.registerComponent('model-moveable', {
  init: function() {
    this.positionDiff = this.positionDiff.bind(this);
    
    this.el.addEventListener('mousedown', evt => {
      this.raycaster = this.raycasterHold;

      let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
      let elPos = this.el.object3D.position;

      this.initDiff = this.positionDiff(elPos, intersection.point);
    });
    this.el.addEventListener('mouseup', evt => {
      this.raycaster = null;
      this.initDiff = null;
    });/*
    this.el.addEventListener('triggerdown', evt => {
      this.raycaster = this.raycasterHold;

      let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
      let elPos = this.el.object3D.position;

      this.initDiff = this.positionDiff(elPos, intersection.point);
    });
    this.el.addEventListener('triggerup', evt => {
      this.raycaster = null;
      this.initDiff = null;
    });*/
    this.el.addEventListener('raycaster-intersected', evt => {
      this.raycasterHold = evt.detail.el;
    });
    this.el.addEventListener('raycaster-intersected-cleared', evt => {
      this.raycasterHold = null;
    });
  },
  tick: function() {
    if (!this.raycaster) { return; }

    let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
    
    if (!intersection) { return; }

    this.el.object3D.position.x = (intersection.point.x + this.initDiff.x);
    this.el.object3D.position.z = (intersection.point.z + this.initDiff.z);
  },
  positionDiff: function(pos1, pos2) {
    let diff = {};
  
    diff.x = pos1.x - pos2.x;
    diff.z = pos1.z - pos2.z;
  
    return diff;
  }
});
