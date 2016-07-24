using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NJSOpenGL
{
    public class NVector
    {
        public double x = 0.0;
        public double y = 0.0;
        public double z = 0.0;

        public NVector()
        {
            x = 0.0;
            y = 0.0;
            z = 0.0;
        }
        public NVector(double _x, double _y)
        {
            x = _x;
            y = _y;
            z = 0.0;
        }
        public NVector(double _x, double _y, double _z)
        {
            x = _x;
            y = _y;
            z = _z;
        }
        public void Set(double _x, double _y, double _z)
        {
            x = _x;
            y = _y;
            z = _z;
        }
        public NVector Mult(double s)
        {
            x *= s;
            y *= s;
            z *= s;
            return new NVector(x, y, z);
        }
        public NVector Scale(double s)
        {
            x *= s;
            y *= s;
            z *= s;
            return new NVector(x, y, z);
        }
        public NVector Div(double v)
        {
            x /= v;
            y /= v;
            z /= v;
            return new NVector(x, y, z);
        }
        public NVector Add(NVector v)
        {
            x += v.x;
            y += v.y;
            z += v.z;
            return new NVector(x, y, z);
        }
        public NVector Sub(NVector v)
        {
            x -= v.x;
            y -= v.y;
            z -= v.z;
            return new NVector(x, y, z);
        }
        public double Length()
        {
            return Math.Sqrt(x * x + y * y + z * z);

        }
        public void Normalize()
        {
            double len = Math.Sqrt((x * x) + (y * y) + (z * z));
            x /= len;
            y /= len;
            z /= len;
        }
        public double Distance(NVector v)
        {
            return NVector.Distance(new NVector(x, y, z), v);
        }
        public double Distance2(NVector v)
        {
            return NVector.Distance2(new NVector(x, y, z), v);
        }
        public double DotProduct(NVector v)
        {
            return NVector.DotProduct(new NVector(x, y, z), v);
        }
        public NVector CrossProduct(NVector v)
        {
            return NVector.CrossProduct(new NVector(x, y, z), v);
        }
        public double SquareLength()
        {
            double len = NVector.Length(new NVector(x, y, z));
            return len * len;
        }
        public override string ToString()
        {
            return base.ToString() + (" X: " + this.x + ", Y: " + this.y + ", Z: " + this.z);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////// converter
        public Rhino.Geometry.Point3d ToRhino()
        {
            return new Rhino.Geometry.Point3d(x, y, z);
        }
        //////////////////////////////////////////////////////////////////////////////////////////////// static method
        public static NVector ZAxis()
        {
            return new NVector(0, 0, 1);
        }
        public static NVector Zero()
        {
            return new NVector(0, 0, 0);
        }
        public static NVector Origin()
        {
            return new NVector(0, 0, 0);
        }
        public static NVector Add(NVector v1, NVector v2)
        {
            return new NVector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
        }
        public static NVector Sub(NVector v1, NVector v2)
        {
            return new NVector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
        }
        public static double Length(NVector v)
        {
            return Math.Sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        }
        public static NVector Normalize(NVector v)
        {
            double len = Math.Sqrt((v.x * v.x) + (v.y * v.y) + (v.z * v.z));
            return new NVector(v.x / len, v.y / len, v.z / len);
        }
        public static double Distance(NVector v1, NVector v2)
        {
            return (Math.Abs(Math.Sqrt(((v2.x - v1.x) * (v2.x - v1.x)) + ((v2.y - v1.y) * (v2.y - v1.y)) + ((v2.z - v1.z) * (v2.z - v1.z)))));
        }
        public static double Distance2(NVector v1, NVector v2)
        {
            return ((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y) + (v1.z - v2.z) * (v1.z - v2.z));
        }
        public static double DotProduct(NVector v1, NVector v2)
        {
            return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
        }
        public static NVector CrossProduct(NVector v1, NVector v2)
        {
            return new NVector(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
        }

    }// end NVector Class


} // Namescape end;
