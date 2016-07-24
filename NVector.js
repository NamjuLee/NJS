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



var NJS=NJS || {};

///////////////////////////////////////////////////////////////////////////////// NVector for JS lib

function NVector(_x,_y,_z){
    if(arguments.length == 0){
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    if(arguments.length == 2){
        this.x = _x;
        this.y = _y;
        this.z = 0;        
    }    
    if(arguments.length == 3){
        this.x = _x;
        this.y = _y;
        this.z = _z; 
    }
};
NVector.prototype.ToString = function(){
    console.log("x: " + this.x + " , y: " + this.y +" , z: " + this.z);
};
NVector.prototype.Set = function(v){
    this.x = v.x; 
    this.y = v.y; 
    this.z = v.z;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Scale = function(v){
    this.x *= v; 
    this.y *= v; 
    this.z *= v;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Mult = function(v){
    this.x *= v; 
    this.y *= v; 
    this.z *= v;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Div = function(v){
    this.x /= v; 
    this.y /= v; 
    this.z /= v;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Add = function(v){
    this.x += v.x; 
    this.y += v.y; 
    this.z += v.z;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Sub = function(v){
    this.x -= v.x; 
    this.y -= v.y; 
    this.z -= v.z;
    return new NVector(this.x, this.y, this.z);
};
NVector.prototype.Length = function(){
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
NVector.prototype.Normalize = function(){
    var len = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    this.x = this.x / len; 
    this.y = this.y / len; 
    this.z = this.z / len;
    return NVector(this.x, this.y, this.z);
};
NVector.prototype.Distance = function(v){
    return NVector.Distance(new NVector(this.x, this.y, this.z), v );
};
NVector.prototype.Distance2 = function(v){
    return NVector.Distance2(new NVector(this.x, this.y, this.z), v );
};
NVector.prototype.DotProduct = function(v){
    return NVector.DotProduct(new NVector(this.x, this.y, this.z), v );
};
NVector.prototype.CrossProduct = function(v){
    return NVector.CrossProduct(new NVector(this.x, this.y, this.z), v );
};
NVector.prototype.SquareLength = function(){
    var len = NVector.Length(new NVector(x,y,z));
    return len * len;
};


