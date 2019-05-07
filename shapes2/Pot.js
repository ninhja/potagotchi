// import CSG from "CSGMesh.js";
// import THREE from "build/three.js";

// User defined class
// to store element and its priority
class Pot {
    constructor(_geometry, _geomType, _material, _wallThickness)
    {
      this.outerGeom = _geometry;
      this.geomType = _geomType;
      this.material = _material;
      this.outerMesh = new THREE.Mesh(_geometry, _material);

      this.innerGeom;
      this.innerMesh;

      this.bottomPlateGeom;
      this.bottomPlateMesh;

      this.groupedMeshes = new THREE.Group();

      this.groupedMeshes.castShadow = true; //default is false
			this.groupedMeshes.receiveShadow = false; //default

      this.shelledMesh;
      this.wallThickness = _wallThickness;
      console.log('wallThickness:' + this.wallThickness);

      this.shell();
    }
    setPosition(x, y, z) {
      this.groupedMeshes.position.set(x, y, z);
    }

    // adds the child shape to its parent, then adds child to scene
    addChild(parent, child) {
      parent.add(child);
    }

    shell() {
      var outerSize = this.getSize();

      this.innerGeom = (function(geomType) {
        var innerSize;
        var bottomPlate;

        switch(geomType) {
          case 'cube':
            // innerSize = outerSize - (2 * this.wallThickness);
            innerSize = outerSize - (2 * this.wallThickness);

            this.bottomPlateGeom = new THREE.CubeGeometry( outerSize, this.wallThickness, outerSize );
            this.bottomPlateMesh = new THREE.Mesh(bottomPlateGeom, material);
            this.bottomPlateMesh.position.set(outerMesh.position.x, outerMesh.position.y, outerMesh.position.z);
            this.bottomPlateMesh.position.setY(outerMesh.position.y - (outerSize/2) + (this.wallThickness/2));

            return new THREE.CubeGeometry( innerSize, 50, innerSize );
          case 'cylinder':
            innerSize = outerSize - this.wallThickness;

            this.bottomPlateGeom = new THREE.CylinderGeometry( outerSize, outerSize, this.wallThickness, 32, 32 );
            this.bottomPlateMesh = new THREE.Mesh(bottomPlateGeom, material);
            this.bottomPlateMesh.position.set(this.outerMesh.position.x, this.outerMesh.position.y, this.outerMesh.position.z);
            this.bottomPlateMesh.position.setY(this.outerMesh.position.y - (outerSize/2) + (this.wallThickness/2));

            return new THREE.CylinderGeometry( innerSize, innerSize, 50, 32, 32 );
          case 'sphere':
            innerSize = outerSize - this.wallThickness*2;

            this.bottomPlateGeom = new THREE.CylinderGeometry( innerSize, innerSize, this.wallThickness, 32, 32)
            this.bottomPlateMesh = new THREE.Mesh(bottomPlateGeom, material);
            this.bottomPlateMesh.position.set(this.outerMesh.position.x, this.outerMesh.position.y, this.outerMesh.position.z);
            this.bottomPlateMesh.position.setY(this.outerMesh.position.y - (outerSize) + (this.wallThickness*1.5));

            return new THREE.CylinderGeometry( innerSize, innerSize, 50, 32, 32);
        }
      })(this.geomType);

      this.innerMesh = new THREE.Mesh(innerGeom);
      this.shelledMesh = doCSG( object,innerMesh, 'subtract',object.material);

      this.groupedMeshes.add(shelledMesh);
      this.groupedMeshes.add(bottomPlateMesh);

      scene.add(groupedMeshes);

    }

    doCSG(a,b,op,mat){
       var bspA = CSG.fromMesh( a );
       var bspB = CSG.fromMesh( b );
       var bspC = bspA[op]( bspB );
       var result = CSG.toMesh( bspC, a.matrix );
       result.material = mat;
       result.castShadow  = result.receiveShadow = true;
       return result;
    }

    // helper function for creating a new object.
    // turns the solid geometry into a shell, with specified wall thickness
    getSize() {
      switch(this.geomType) {
        case 'cube':
          return this.outerGeom.parameters.width;
        case 'cylinder':
          return this.outerGeom.parameters.radiusTop;
        case 'sphere':
          return this.outerGeom.parameters.radius;
      }
    }
}
