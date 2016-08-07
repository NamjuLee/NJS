/*
* Copyright (c) 2009 NJ Namju Lee [www.njstudio.co.kr] 
*
* nj.namju@gmailc.om
*
* This software is provided 'as-is', without any express or implied
* warranty. In no event will the authors be held liable for any damages
* arising from the use of this software.
*
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
*
*    1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
*
*    2. Altered source versions must be plainly marked as such, and must not
*    be misrepresented as being the original software.
*
*    3. This notice may not be removed or altered from any source
*    distribution.
*/



// example 
var np01 = null;
function NPolylineInit(){
  console.log("NPolyline works");
  np01 = new NPolyline();
  np01.Add(new NVector(0,0,0));
  np01.Add(new NVector(10,20,0));
  np01.Add(new NVector(0,10,0));
  np01.Add(new NVector(5,20,0));
  np01.Add(new NVector(9,9,0));
  np01.AddToScene();
}


////////////////////////////////////////////////////////////////////////////
function NPolyline(){
  this.id = NPolyline.GetID();
  this.pts = [];
  this.isClosed = true;
  this.mesh = null;
  this.geometry = null;
  this.linesMaterial = null;
  this.numberForIter = 0; // this show how many iteration that you did to meet the opimal num.
  NPolyline.listNPolyline.push(this);
}
NPolyline.prototype.Add = function(v){
  if (this.pts.length > 1){
    if (this.isClosed){
      this.Open();
      this.pts.push(v);
      this.Closed();
    }else{
      this.pts.push(v);
    }
  }else{
    this.pts.push(v);
  }
}
NPolyline.prototype.ToString = function(){
  if(this.isClosed) return "this is a closed ployline, and the length is " + this.ComputeLength() + ", and the area is " + this.ComputeArea() + ", and it has " + this.pts.Count + " points." ;
  else return "this is a open ployline, and the length is " + this.ComputeLength() + ", and it has " + this.pts.Length + " points." ;
}
NPolyline.prototype.Closed = function(){
  this.isClosed = true;
  if(this.pts[0].Distance(this.pts[this.pts.length - 1]) != 0) this.pts.push(this.pts[0]);
}
NPolyline.prototype.Open = function(){
  this.isClosed = false;
  if(this.pts.length > 1) if (this.pts[0].Distance(this.pts[this.pts.length - 1]) == 0) this.pts.pop();
}
NPolyline.prototype.GetClosedPtFromPt = function(v){
  let index = 0;
  let dis = this.pts[0].Distance(v);
  for (let i = 1, c = this.pts.length; i < c; ++i){
    let temp = this.pts[i].Distance(v);
    if (dis > temp){
      dis = temp;
      index = i;
    }
  }
  return this.pts[index];
}
NPolyline.prototype.GetCenterPt = function(){
  let pt = [0,0,0];
  if(this.pts[0].Distance(this.pts[this.pts.length-1]) == 0){
    let c = this.pts.length;
    for(var i =0; i < c; ++i){
        pt[0] += this.pts[i].x;
        pt[1] += this.pts[i].y;
        pt[2] += this.pts[i].z;
    }
    // return modeling.entities.point([pt[0]/c-1,pt[1]/c-1,pt[2]/c-1]);
    return new NVector(pt[0]/c-1,pt[1]/c-1,pt[2]/c-1);
  }else{
    let c = this.pts.length;
    for(var i =0; i < c; ++i){
        pt[0] += this.pts[i].x;
        pt[1] += this.pts[i].y;
        pt[2] += this.pts[i].z;
    }
    // return modeling.entities.point([pt[0]/c,pt[1]/c,pt[2]/c]);
    return new NVector(pt[0]/c,pt[1]/c,pt[2]/c);
  }
}
NPolyline.prototype.GetVectorGridbyOptimizationWithDistance=function(targetNum){
    let vecs = []

    let vecBound = this.GetBoundingBox();
    let resDistance = (vecBound.pts[1].x - vecBound.pts[0].x) / 10;

    // tolerance
    let numTor = targetNum * 0.1;
    let numTorForStep = 0.000005;

    let numForTotalLoop = 0;
    while (numForTotalLoop < 100)
    {
        this.numberForIter = numForTotalLoop;
        vecs = this.GetVectorGridByDis(resDistance);
        if (targetNum < vecs.length)
        {
            let numInrease = 0.1 + ((vecs.length - targetNum) * numTorForStep);

            resDistance += numInrease;
        }
        else if (vecs.length < targetNum)
        {
            let numInrease = 0.1 + ((vecs.length - targetNum) * numTorForStep);
            resDistance -= numInrease;
        }
        if (vecs.length < targetNum + numTor && vecs.length > targetNum - numTor) break;
        numForTotalLoop++;
    }

    return vecs;
}
NPolyline.prototype.GetVectorGridByDis=function(distance){
    if (distance < 0.05) distance = 0.05; 
    let vecs = [];

    let vecBound = this.GetBoundingBox();
    let p1 = vecBound.pts[0];
    let p2 = vecBound.pts[2];

    let xTotal = (p2.x - p1.x);
    let yTotal = (p2.y - p1.y);

    let xNumForLoop = xTotal / distance;
    let yNumForLoop = yTotal / distance;

    let xOff = distance * 0.5;
    let yOff = distance * 0.5;

    for (let y = 0; y < yNumForLoop; ++y)
    {
        for (let x = 0; x < xNumForLoop; ++x)
        {
            let v = new NVector(p1.x + xOff + (x * distance), p1.y + yOff + (y * distance), 0);
            if (this.IsInside(v)) vecs.push(v);
        }
    }
    return vecs;
}
NPolyline.prototype.IsInside=function(v){
    let x = v.x, y = v.y;
    let inside = false;
    for (let i = 0, j = this.pts.length - 1; i < this.pts.length; j = i++){
        let xi = this.pts[i].x, yi = this.pts[i].y;
        let xj = this.pts[j].x, yj = this.pts[j].y;
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}
NPolyline.prototype.GetBoundingBox=function(){
    if (this.pts.length == 0){
        return null;
    }
    let pl = new NPolyline();
    let min = new NVector(this.pts[0].x, this.pts[0].y, this.pts[0].z);
    let max = new NVector(this.pts[0].x, this.pts[0].y, this.pts[0].z);
    for (let i = 0, c = this.pts.length; i < c; ++i){
        if (min.x > this.pts[i].x) min.x = this.pts[i].x;
        if (max.x < this.pts[i].x) max.x = this.pts[i].x;

        if (min.y > this.pts[i].y) min.y = this.pts[i].y;
        if (max.y < this.pts[i].y) max.y = this.pts[i].y;

        if (min.z > this.pts[i].z) min.z = this.pts[i].z;
        if (max.z < this.pts[i].z) max.z = this.pts[i].z;
    }
    pl.Add(min);
    pl.Add(new NVector(min.x, max.y, 0));
    pl.Add(max);
    pl.Add(new NVector(max.x, min.y, 0));
    return pl;
}
NPolyline.prototype.ComputeArea = function(){ // !!!!this doe not consider concave
  let area = 0.0;
  if(this.pts[0].Distance(this.pts[this.pts.length-1]) == 0){
    let cPt = this.GetCenterPt();
    let tempPts = this.pts;
    tempPts.push(new NVector(cPt.__data__.point[0], cPt.__data__.point[1], cPt.__data__.point[2]));
    for (let i = 0, c = tempPts.length; i < c - 2; ++i){
        let d0 = tempPts[c -1].Distance(tempPts[i]);
        let d1 = tempPts[c -1].Distance(tempPts[i + 1]);
        let d2 = tempPts[i].Distance(tempPts[i + 1]);
        area += this.GetAreaByThreeLength(d0, d1, d2);
    }
    return area;
  } else{
    return "it need to be closed to compute the area."
  }
}
NPolyline.prototype.GetAreaByThreeLength = function(len1, len2, len3){   // using Heron's Formula
    let a = (len1 + len2 + len3) * 0.5;
    return Math.sqrt(a * (a - len1) * (a - len2) * (a - len3));
}
NPolyline.prototype.ComputeLength = function(){
  let totalLength = 0.0;
  for(let i = 0, c = this.pts.length; i < c -1 ; ++i){
    totalLength += this.pts[i+1].Distance(this.pts[i])
  }
  return totalLength;
}
NPolyline.prototype.ToVecs = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c ; ++i){
    nvecs.push(new NVector(this.pts[i].x, this.pts[i].y, this.pts[i].z));
  }
  return nvecs;
}
NPolyline.prototype.ToFluxPoint = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c ; ++i){
    nvecs.push(modeling.entities.point([this.pts[i].x, this.pts[i].y, this.pts[i].z]));
  }
  return nvecs;
}
NPolyline.prototype.ToFluxLine = function(){
  let nvecs = [];
  for(let i = 0, c = this.pts.length; i < c - 1 ; ++i){
    let p1 = modeling.entities.point([this.pts[i].x, this.pts[i].y, this.pts[i].z]);
    let p2 = modeling.entities.point([this.pts[i+1].x, this.pts[i+1].y, this.pts[i+1].z]);
    nvecs.push(modeling.entities.line(p1,p2));
  }
  return nvecs;
}
NPolyline.prototype.ToFluxMesh = function(){
  let Vertices = this.ToFluxPoint();
  let mesh = modeling.entities.mesh();
  if (this.pts[0].Distance(this.pts[this.pts.length -1]) == 0){
    for(let i = 0; i < Vertices.length -1; ++i) {
        mesh.vertex(Vertices[i]);
    }
    for(let j = 0; j < Vertices.length -3; ++j) {
        mesh.face(0, j+1, j+2);
    }
  }else{
    for(let i = 0; i < Vertices.length ; ++i) {
        mesh.vertex(Vertices[i]);
    }
    for(let j = 0; j < Vertices.length -2; ++j) {
        mesh.face(0, j+1, j+2);
    }
  }
  this.mesh = mesh;
  return mesh;
}
//////////////////////////////////////////////////////////////////////////////// static 
NPolyline.BuildWithVecs = function(vecs){
  var np = new NPolyline();
  for(let i = 0, c = vecs.length; i < c ; ++i){
    np.Add(new NVector(vecs[i].x, vecs[i].y, vecs[i].z));
  }
  return np;
}
NPolyline.BuildWithFluxPoint = function(vecs){
  var np = new NPolyline();
  for(let i = 0, c = vecs.length; i < c ; ++i){
    np.Add(new NVector(vecs[i].point[0], vecs[i].point[1], vecs[i].point[2] ));
  }
  return np;
}
NPolyline.BuildWithFluxLine = function(Nln){
  var np = new NPolyline();
  for(let i = 0, c = Nln.length; i < c ; ++i){
    np.Add(new NVector(Nln[i].point[0], Nln[i].point[1], Nln[i].point[2] ));
  }
  return np;
}

////////////////////////////////////////////////////////////////////////////// for Three JS lib

NPolyline.prototype.AddToGlobalScene = function(){ // Three JS
    this.geometry = new THREE.Geometry();
    for (var i = 0, c = this.pts.length ; i < c; ++i) {
      this.geometry.vertices.push(new THREE.Vector3(this.pts[i].x, this.pts[i].y, this.pts[i].z))
    }
    this.linesMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: .3, linewidth: 1.1 } ); // color: 0x787878
    this.mesh = new THREE.Line( this.geometry, this.linesMaterial );
    this.mesh.name = this.id;
    scene.add( this.mesh );
}
NPolyline.prototype.RemoveFromGlobalScene = function(){  // Three JS
    var o = scene.getObjectByName(this.mesh.name);
    scene.remove(o);
    NPolyline.RemoveObjectFromList(this)
};
}
////////////////////////////////////////////////////////////////////////////// Add locally
NPolyline.prototype.AddToLocalScene = function(){  // Three JS 
    this.geometry = new THREE.Geometry();

    for (var i = 0, c = this.pts.length ; i < c; ++i) {
      this.geometry.vertices.push(new THREE.Vector3(this.pts[i].x, this.pts[i].y, this.pts[i].z))
    }
    this.linesMaterial = new THREE.LineBasicMaterial( { color: 0x000000, opacity: .3, linewidth: 1.1 } ); // color: 0x787878
    this.mesh = new THREE.Line( this.geometry, this.linesMaterial );
    this.mesh.name = this.id;
    return this.mesh;
}
NPolyline.prototype.RemoveFromLocalScene = function(){  // Three JS
    NPolyline.RemoveObjectFromList(this)
    return this.mesh;
};
////////////////////////////////////////////////////////////////////////////// static function
NPolyline.RemoveObjectFromList=function(obj){  // Three JS
    var olist = [];
    for(var i =0, c = NPolyline.listNPolyline.length; i < c; ++i){
        if(NPolyline.listNPolyline[i].id != obj.id) olist.push(NPolyline.listNPolyline[i]);
    }
    NPolyline.listNPolyline = olist;
};
NPolyline.listNPolyline = [];
NPolyline.IDNum = 0;
NPolyline.GetID = function(){
  return "NPolyline_" + (NPolyline.IDNum++)
};