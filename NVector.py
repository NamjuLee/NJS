import Rhino

class NVector():
    x = None
    y = None
    z = None
    def __init__(self, _x, _y, _z):
        self.x = _x
        self.y = _y
        self.z = _z

    def ToString(self):
        temp = 'x :' + str(self.x) + ', y :' + str(self.y) + ', z :' + str(self.z)
        print temp
        return temp
    def Add(self, v):
        theX = self.x + v.x
        theY = self.y + v.y
        theZ = self.z + v.z
        self.x += v.x
        self.y += v.y
        self.z += v.z
        return NVector(theX, theY, theZ)
    def Sub(self, v):
        theX = self.x + v.x
        theY = self.y + v.y
        theZ = self.z + v.z
        self.x -= v.x
        self.y -= v.y
        self.z -= v.z
        return NVector(theX, theY, theZ)

    def ToRhino(self):
        return Rhino.Geometry.Point3d(self.x , self.y, self.z);


v1 = NVector(10,1,0)
v2 = NVector(2,2,2)
v1.ToString()

v3 = v1.Sub(v2)
v3.ToString() 

p1 = v1.ToRhino()
p2 = v2.ToRhino()
p3 = v3.ToRhino()