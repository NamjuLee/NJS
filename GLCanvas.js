

function GLCanvasInit(){
    console.log("this is GL Canvas")



}


function GLWindow(divName){
    var self = this;
    self.divName = divName;

    self.div3d = document.getElementById(self.divName);    

    self.scene = new THREE.Scene();

    self.width=$("#"+self.divName).innerWidth();
    self.height=$("#"+self.divName).innerHeight();

    console.log(self.divName)
    console.log(self.width)
    console.log(self.height)
    self.objects = [];

    self.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    self.camera.aspect = self.width/self.height;
    self.camera.position.set( 0, 2, 5);
    self.camera.updateProjectionMatrix();


    self.renderer = new THREE.WebGLRenderer({alpha: true});
    self.div3d.appendChild( self.renderer.domElement );  

    self.renderer.setSize( self.width, self.height );
    self.renderer.setClearColor(0xbbbbbb, 1);
    // self.renderer.setPixelRatio( window.devicePixelRatio );

    //.........................................controls
    self.controls = new THREE.OrbitControls( self.camera ); //camera mouse rotation control
                    self.controls.target.set( 0, 0, 0 );

                    self.controls.rotateSpeed = 1.0;
                    self.controls.zoomSpeed = 1.2;
                    self.controls.panSpeed = 0.8;

                    self.controls.enableZoom  = true;
                    self.controls.enablePan = true;

                    self.controls.enableDamping = false;
                    self.controls.dampingFactor = 0.15;

                    self.controls.keys = [ 65, 83, 68 ];

    //..........................................selection
    self.renderer.domElement.addEventListener( 'mousemove', function (){
                                                                    self.onDocumentMouseMove( event, self); 
                                                                }, false );
    self.renderer.domElement.addEventListener( 'mousedown', function(){
                                                                    self.onDocumentMouseDown(event, self);
                                                                }, false );
    self.renderer.domElement.addEventListener( 'mouseup', function(){
                                                                    self.onDocumentMouseUp(event, self);
                                                                }, false );
    //....................................resize

    $(window).resize(function () {
        self.width=$("#"+self.divName).innerWidth();
        self.height=$("#"+self.divName).innerHeight();

        self.camera.aspect = self.width/self.height;
        self.camera.updateProjectionMatrix();
        self.renderer.setSize( self.width, self.height );
    });

    self.projector = new THREE.Projector();      //used to project and unproject coordinates from screen to space and back

    self.raycaster = new THREE.Raycaster();

    self.mouse = new THREE.Vector2();            //mouse location in screen space
    self.mouse3d=new THREE.Vector3( 0, 0, 0 );   //mouse location in XYZ space
    self.mouseMoved=false;
    self.mouseXdown=0;
    self.mouseYdown=0;


//.................................................... mouse cube
    var cubegeometry = new THREE.BoxGeometry(5.2,0.02,0.02);
    var cubematerial = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0xffffff, shininess: 30, shading: THREE.FlatShading } );

    self.mouseCube = new THREE.Mesh( cubegeometry, cubematerial );
    self.mouseCube.castShadow = true;
    self.mouseCube.receiveShadow = true;
    self.scene.add( self.mouseCube );


// .....................................................................light
 
    self.theAmbient = GetAmbient()
    self.scene.add(self.theAmbient)

    self.theSpotLight = GetSpotLight()
    self.scene.add(self.theSpotLight)

    self.renderer.shadowMap.enabled = true;
    self.renderer.shadowMap.type = THREE.PCFShadowMap;


//..............................................planeXY
    var planeXYGeometry = GetPlaneXYGeometry()
    self.Add(planeXYGeometry)

// .....................................................................


    self.Init();
    self.render();
}
GLWindow.prototype.onDocumentMouseMove = function ( event , self) {
    var x=event.clientX;
    var y=event.clientY;

    if (Math.abs(self.mouseXdown-x)>10 || Math.abs(self.mouseYdown-y)>10) self.mouseMoved=true;

    event.preventDefault();

    var mouseIntersection=self.getIntersectionAtScreenCoordinates(x, y);
    if (mouseIntersection) 
        self.mouse3d=mouseIntersection.point;

    self.mouseCube.position.copy( self.mouse3d );
    self.theSpotLight.position.set( self.mouse3d.x, self.mouse3d.y+1.0, self.mouse3d.z+2.0 );
}
GLWindow.prototype.onDocumentMouseDown=function( event , self ) {
    self.mouseMoved=false;

    self.mouseXdown=event.clientX;
    self.mouseYdown=event.clientY;
}
GLWindow.prototype.onDocumentMouseUp=function( event , self ) {
    if(self.mouseMoved) return;
    var x=event.clientX;
    var y=event.clientY;

    var mouseIntersection = self.getIntersectionAtScreenCoordinates(x, y);

    if (event.button==0) {
        var matrix=getMatrixAtScreenCoordinates(x,y);
        addTripodWithMatrix(matrix);        
    }
    else {
        if (mouseIntersection.object!=self.planeXY) {
            self.scene.remove( mouseIntersection.object );
            self.objects.splice( self.objects.indexOf( mouseIntersection.object ), 1 );
        }
    }
}
//................................................................................. coordinates transform
GLWindow.prototype.getIntersectionAtScreenCoordinates=function(x,y) {
    var self = this;
    var nx = ( x / self.width ) * 2 - 1;
    var ny = - ( y / self.height ) * 2 + 1;
    var vector = new THREE.Vector3( nx, ny, 0.5 );

    // self.projector.unprojectVector( vector, self.camera );
    
    self.raycaster = new THREE.Raycaster( self.camera.position, vector.sub( self.camera.position ).normalize() );


    var intersects = self.raycaster.intersectObjects( self.objects );

    if ( intersects.length > 0 ) {
        return intersects[ 0 ];
    }

    return null;
}
GLWindow.prototype.getPointAtScreenCoordinates=function(x,y) {
    
    var intersects = getIntersectionAtScreenCoordinates(x, y);

    if ( intersects ) {
        return intersects.point;
    }

    return null;
}
GLWindow.prototype.Add=function(obj){
    var self = this;
    self.objects.push(obj);
    self.scene.add(obj);
}
GLWindow.prototype.Remove=function(obj){
    var self = this;
    self.objects.push(obj);
    self.scene.add(obj);
}

GLWindow.prototype.render=function() {
    var self = this;
    self.controls.update();
    requestAnimationFrame( function (){self.render();});

    self.Update();
    self.renderer.render(self.scene, self.camera);
}


//................................................................................. public 
GLWindow.prototype.Init=function() {
    console.log("this is Init")

    var self = this;
    var cubegeometry = new THREE.BoxGeometry(0.2,0.2,0.2);
    var cubematerial = new THREE.MeshPhongMaterial( { ambient: 0x030303, color: 0xdddddd, specular: 0xffffff, shininess: 30, shading: THREE.FlatShading } );
    var newcube = new THREE.Mesh( cubegeometry, cubematerial );
    newcube.castShadow = true;
    newcube.receiveShadow = true;
    this.Add(newcube);


};
GLWindow.prototype.Update=function() {
    // console.log(this.objects.length)


};


function updateGround() {

    t+=0.1;
    var x,z;
     for ( var i = 0, l = groundGeometry.vertices.length; i < l; i ++ ) {
        x=groundGeometry.vertices[ i ].x;
        z=groundGeometry.vertices[ i ].z;
        var dx=x-mouse3d.x;
        var dz=z-mouse3d.z;
        var d=Math.sqrt(dx*dx+dz*dz);
        var mu=Math.exp(-0.3*d*d)*2.0;
        groundGeometry.vertices[ i ].y = Math.random() * 0.01+Math.cos(t+x*3.0)*0.2-0.4-mu;

    }

    groundGeometry.computeFaceNormals();
    groundGeometry.computeVertexNormals();
    groundGeometry.verticesNeedUpdate = true;
    groundGeometry.normalsNeedUpdate = true;
}
