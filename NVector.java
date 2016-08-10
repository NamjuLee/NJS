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

import java.util.*;

public class NVector
{
    public double x = 0.0;
    public double y = 0.0;
    public double z = 0.0;
    
    public int valStroke = 2;
    public int valStrokeWeight = 2;
    
    public NVector(){
        x = 0.0;
        y = 0.0;
        z = 0.0;
    }
    public NVector(double _x, double _y){
        x = _x;
        y = _y;
        z = 0.0;
    }
    public NVector(double _x, double _y, double _z){
        x = _x;
        y = _y;
        z = _z;
    }
    public void Set(double _x, double _y, double _z){
        x = _x;
        y = _y;
        z = _z;
    }
    public NVector Scale(double s){
        x *= s;
        y *= s;
        z *= s;
        return new NVector(x,y,z);
    }
    public NVector Mult(double v){
        x *= v;
        y *= v;
        z *= v;
        return new NVector(x,y,z);
    }
    public NVector Div(double v){
        x /= v;
        y /= v;
        z /= v;
        return new NVector(x,y,z);
    }
    public NVector Add(NVector v){
        x += v.x;
        y += v.y;
        z += v.z;
        return new NVector(x,y,z);
    }
    public NVector Sub(NVector v){
        x -= v.x;
        y -= v.y;
        z -= v.z;
        return new NVector(x,y,z);
    }
    public double Length(){
        return Math.sqrt(x * x + y * y + z * z);
        
    }
    public void Normalize(){
        double len = Math.sqrt((x * x) + (y * y) + (z * z));
        x /= len;
        y /= len;
        z /= len;
    }
    public double Distance(NVector v){
      return NVector.Distance( new NVector(x,y,z) , v);
    }
    public double Distance2(NVector v){
      return NVector.Distance2( new NVector(x,y,z) , v);
    }
    public double DotProduct(NVector v){
      return NVector.DotProduct( new NVector(x,y,z) , v);
    }
    public NVector CrossProduct(NVector v){
      return NVector.CrossProduct( new NVector(x,y,z) , v);
    }
    public double SquareLength(){
      double len = NVector.Length(new NVector(x,y,z));
      return len * len;
    }
    public double FadeExp(NVector attractor, double fade){
      NVector v = new NVector(x,y,z);
      v.Sub(attractor);
       NVector dv = v;
       return Math.exp(-fade * dv.SquareLength());
    }
    
    //////////////////////////////////////////////////////////////////////////////////////////////// static method
    
    public static NVector ZAxis(){
      return new NVector(0,0,1);
    }
    public static NVector Zero(){
      return new NVector(0,0,0);
    }   
    public static double Falloff(NVector pt, NVector attractor, double strength, double falloff){
        NVector v = attractor.Sub(pt);
        double dist = v.Length();
        return dist * (strength * (Math.exp(-falloff * dist * dist)));
    }
    public static NVector Attractor(NVector pt, NVector attractor, double strength, double falloff){
        NVector v = attractor.Sub(pt);
        v.Normalize();
        double dist = v.Length();
        return (v.Scale((strength * Math.exp(-falloff * dist * dist))));
    }
    public static NVector Explosion(NVector pt, NVector explosion, double strength, double falloff){
        NVector v = explosion.Sub(pt);
        v.Normalize();
        double dist = v.Length();
        return (v.Scale( -(strength * Math.exp(-falloff * dist * dist))));
    }
    public static NVector Rotor(NVector pt, NVector rotor, double strength, double falloff){
        NVector v = rotor.Sub(pt);
        v.Normalize();
        v.Rotate(3.141592 / 2, NVector.ZAxis());
        double dist = v.Length();
        return (v.Scale((strength * (Math.exp(-falloff * dist * dist)))));
    }
    ////////////////////////////////////////////////////////////////////////// processing 
    public void Render(){
      MouseInteraction();
      point((float)x,(float)y,(float)z);
    }
    public void MouseInteraction(){
     strokeWeight(9); 
    }
    /////////////////////////////////////////////////////////////////////////// static mathods
    public static NVector ZAxis(){
      return new NVector(0,0,1);
    } 
    public static NVector Add(NVector v1, NVector v2){
        return new NVector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    public static NVector Sub(NVector v1, NVector v2){
        return new NVector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    public static NVector Div(NVector v1, double val){
        return new NVector(v1.x / val, v1.y / val.y, v1.z / val);
    }
    public static NVector Mult(NVector v1, double val){
        return new NVector(v1.x * val, v1.y * val.y, v1.z * val);
    }
    public static NVector Scale(NVector v1, double val){
        return new NVector(v1.x * val, v1.y * val.y, v1.z * val);
    }
    public static double Length(NVector v){
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
    public static NVector Normalize(NVector v){
        double len = Math.sqrt((v.x * v.x) + (v.y * v.y) + (v.z * v.z));
        return new NVector(v.x / len , v.y / len, v.z / len);
    }
    public static double Distance(NVector v1, NVector v2){
        return (Math.abs(Math.sqrt(((v2.x - v1.x) * (v2.x - v1.x)) + ((v2.y - v1.y) * (v2.y - v1.y)) + ((v2.z - v1.z) * (v2.z - v1.z)))));
    }
    public static double Distance2(NVector v1, NVector v2){
        return ((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y) + (v1.z - v2.z) * (v1.z - v2.z));
    }
    public static double DotProduct(NVector v1, NVector v2){
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    public static NVector CrossProduct(NVector v1, NVector v2){
       return new NVector( v1.y * v2.z - v1.z * v2.y , v1.z * v2.x - v1.x * v2.z , v1.x * v2.y - v1.y * v2.x);
    }
    public static double FadeExp(NVector fieldPoint, NVector attractor, double fade){
        fieldPoint.Sub(attractor);
        return Math.exp(-fade * fieldPoint.SquareLength());
    }
    public static double Falloff(NVector pt, NVector attractor, double strength, double falloff){
        NVector v = attractor.Sub(pt);
        double dist = v.Length();
        return dist * (strength * (Math.exp(-falloff * dist * dist)));
    }
    public static NVector Attractor(NVector pt, NVector attractor, double strength, double falloff){
        NVector v = attractor.Sub(pt);
        v.Normalize();
        double dist = v.Length();
        return (v.Scale((strength * Math.exp(-falloff * dist * dist))));
    }
    public static NVector Explosion(NVector pt, NVector explosion, double strength, double falloff){
        NVector v = explosion.Sub(pt);
        v.Normalize();
        double dist = v.Length();
        return (v.Scale( -(strength * Math.exp(-falloff * dist * dist))));
    }
    public static NVector Rotor(NVector pt, NVector rotor, double strength, double falloff){
        NVector v = rotor.Sub(pt);
        v.Normalize();
        v.Rotate(3.141592 / 2, NVector.ZAxis());
        double dist = v.Length();
        return (v.Scale((strength * (Math.exp(-falloff * dist * dist)))));
    }
    //////////////////////////////////////////////////////////////////////////////////////// Vector Utility 
    public static NVector GetMidNVector(NVector v1, NVector v2){
        return new NVector(v1.x + v2.x * 0.5, v1.y + v2.y * 0.5, v1.z + v2.z * 0.5);
    }
    public static ArrayList<NVector> RemoveOverlapedVector(ArrayList<NVector> vectors){
        ArrayList<NVector> vList = new ArrayList<NVector>();
        vList.add(vectors.get(0));
        for (int i = 0; i < vectors.size(); i++){
            int count = 0;
            for (int j = 0; j < vList.size(); j++){
                if (vList.get(j) == vectors.get(i)){
                    count++;
                }
            }
            if (count == 0){
                vList.add(vectors.get(i));
            }
        }
        return vList;
    }
     public static NVector GetVectorFromDegree(double degree){
        NVector v = new NVector();
        v.x = Math.cos(degree * (3.14159265358979 / 180.0));
        v.y = Math.sin(degree * (3.14159265358979 / 180.0));
        v.z = Math.tan(degree * (3.14159265358979 / 180.0));
        v.Normalize();
        return v;
    }
     public static ArrayList<NVector> GetVectorFromDegreeList(ArrayList<Double> degrees){
         ArrayList<NVector> vs = new  ArrayList<NVector>();
        for(int i = 0, c = degrees.size(); i < c -1 ; ++i ){
            NVector v = NVector.GetVectorFromDegree(degrees.get(i));
            vs.add(v);
        }
        return vs;
    };
    //#region Get divided Vectors
    public static ArrayList<NVector> GetDivideNVector(NVector v1, NVector v2, int num){
        ArrayList<NVector> vList = new ArrayList<NVector>();
        //vList.add(v1);

        NVector v = new NVector(v2.x - v1.x, v2.y - v1.y, v2.z - v1.z);
        NVector vd = new NVector(v.x / num, v.y / num, v.z / num);
        
        for (int i = 0; i < num; i++){
            vList.add(new NVector(v1.x + (vd.x * i) , v1.y + (vd.y * i), v1.z + (vd.z * i)));
        }
        //vList.Add(v2);
        return vList;
    };
    //#endregion

    //region closet index from vector or point lists
    public static int GetClosestIndexFromPTS (NVector p, ArrayList<NVector>targetPTs){
        int ClosestIndex = 0;
        ArrayList<Double> dis = new ArrayList<Double>();

        for (int i = 0; i < targetPTs.size() -1; ++i){
            dis.add(NVector.Distance2(p,targetPTs.get(i) ));
        }
        double temp = 10000;
        for (int i = 0; i < dis.size() -1; ++i){
            if (dis.get(i) < temp){
                temp = dis.get(i);
                ClosestIndex = i;
            }
        }
        return ClosestIndex;
    }
    public static NVector GetCenterVecFromVecs(ArrayList<NVector> vecs ) {
        NVector nv = new NVector();
        for (NVector v : vecs){
            nv.Add(v);
        }
        nv.Div((double)vecs.size());
        return nv;
    } 
}