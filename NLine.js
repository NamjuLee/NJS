
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


function NLine(v1, v2){
	this.ptStart = v1 ===undefined ? [0,0,0] : v1;
	this.ptEnd = v2 ===undefined ? null : v2;
};
NLine.prototype.ToFluxLine = function(){
	let p1 = modeling.entities.point([this.ptStart.x, this.ptStart.y, this.ptStart.z]);
	let p2 = modeling.entities.point([this.ptEnd.x, this.ptEnd.y, this.ptEnd.z]);
	return modeling.entities.line(p1,p2);
};
NLine.prototype.ToString = function(){
    console.log("x: " + this.x + " , y: " + this.y +" , z: " + this.z);
};

NLine.GetPtFromIntersectionFromTwoLine = function(l1, l2){
	if (CheckIntersection(l1.ptStart.x, l1.ptStart.y, l1.ptEnd.x, l1.ptEnd.y, l2.ptStart.x, l2.ptStart.y, l2.ptEnd.x, l2.ptEnd.y)) return p;
	return p;
}
//https://github.com/psalaets/line-intersect
NLine.CheckIntersection = function( x1, y1, x2, y2, x3, y3, x4, y4){
	var denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
	var numeA = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3));
	var numeB = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3));
	if (denom == 0) {
	  if (numeA == 0 && numeB == 0) {
	    p = NVector.Origin();
	    return false; //colinear();
	  }
	  p = NVector.Origin();
	  return false; // parallel();
	}
	var uA = numeA / denom;
	var uB = numeB / denom;
	if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
	  var x = x1 + (uA * (x2 - x1));
	  var y = y1 + (uA * (y2 - y1));
	  return new NVector(x, y, 0);
	}
	p = NVector.Origin();
	return false;
}

