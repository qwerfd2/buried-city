var cp = cp || {};

cp.Vect = function(x, y){
    this.x = x;
    this.y = y;
}
cp.Vect.prototype.add = function(v){
    this.x += v.x;
    this.y += v.y;
    return this;
}
cp.Vect.prototype.sub = function(v){
    this.x -= v.x;
    this.y -= v.y;
    return this;
}
cp.Vect.prototype.neg = function(){
    this.x = -this.x;
    this.y = -this.y;
    return this;
}
cp.Vect.prototype.mult = function(s){
    this.x *= s;
    this.y *= s;
    return this;
}
cp.Vect.prototype.rotate = function(v){
    this.x = this.x * v.x - this.y * v.y;
    this.y = this.x * v.y + this.y * v.x;
    return this;
}
cp.Vect.prototype.project = function(v){
    this.mult(cp.vdot(this, v) / cp.vlengthsq(v));
    return this;
}

cp.v = function(x, y){
    return new cp.Vect(x, y);
}
cp.vzero  = cp.v(0,0);

cp.v.add = cp.vadd;
cp.v.clamp = cp.vclamp;
cp.v.cross = cp.vcross;
cp.v.dist = cp.vdist;
cp.v.distsq = cp.vdistsq;
cp.v.dot = cp.vdot;
cp.v.eql = cp.veql;
cp.v.forangle = cp.vforangle;
cp.v.len = cp.vlength;
cp.v.lengthsq = cp.vlengthsq;
cp.v.lerp = cp.vlerp;
cp.v.lerpconst = cp.vlerpconst;
cp.v.mult = cp.vmult;
cp.v.near = cp.vnear;
cp.v.neg = cp.vneg;
cp.v.normalize = cp.vnormalize;
cp.v.normalize_safe = cp.vnormalize_safe;
cp.v.perp = cp.vperp;
cp.v.project = cp.vproject;
cp.v.rotate = cp.vrotate;
cp.v.pvrperp = cp.vrperp;
cp.v.slerp = cp.vslerp;
cp.v.slerpconst = cp.vslerpconst;
cp.v.sub = cp.vsub;
cp.v.toangle = cp.vtoangle;
cp.v.unrotate = cp.vunrotate;
cp.v.str = function(v){
    return "(" + v.x.toFixed(3) + ", " + v.y.toFixed(3) + ")";
}

cp.clamp01 = cp.fclamp01;

cp.BoxShape2 = function(body, box)
{
    var verts = [
        box.l, box.b,
        box.l, box.t,
        box.r, box.t,
        box.r, box.b
    ];

    return new cp.PolyShape(body, verts, cp.vzero);
};

cp.BoxShape = function(body, width, height)
{
    var hw = width/2;
    var hh = height/2;

    return cp.BoxShape2(body, new cp.BB(-hw, -hh, hw, hh));
};

cp.StaticBody = function()
{
    return new cp.Body(Infinity, Infinity);
};

cp.BB = function(l, b, r, t)
{
    this.l = l;
    this.b = b;
    this.r = r;
    this.t = t;
};

cp.bb = function(l, b, r, t) {
    return new cp.BB(l, b, r, t);
};

var _proto = cp.Base.prototype;

cc.defineGetterSetter(_proto, "handle", _proto.getHandle);

Object.defineProperties(cp.Space.prototype,
                {
                    "gravity" : {
                        get : function(){
                            return this.getGravity();
                        },
                        set : function(newValue){
                            this.setGravity(newValue);
                        },
                        enumerable : true,
                        configurable : true
                    },
                    "iterations" : {
                        get : function(){
                            return this.getIterations();
                        },
                        set : function(newValue){
                            this.setIterations(newValue);
                        },
                        enumerable : true,
                        configurable : true
                    },
                    "damping" : {
                        get : function(){
                            return this.getDamping();
                        },
                        set : function(newValue){
                            this.setDamping(newValue);
                        },
                        enumerable : true,
                        configurable : true
                    },
                    "staticBody" : {
                        get : function(){
                            return this.getStaticBody();
                        },
                        enumerable : true,
                        configurable : true
                    },
                    "idleSpeedThreshold" : {
                        get : function(){
                            return this.getIdleSpeedThreshold();
                        },
                        set : function(newValue){
                            this.setIdleSpeedThreshold(newValue);
                        },
                        enumerable : true,
                        configurable : true
                    },
                    "sleepTimeThreshold": {
                        get : function(){
                            return this.getSleepTimeThreshold();
                        },
                        set : function(newValue){
                            this.setSleepTimeThreshold(newValue);
                        },
                        enumerable : true,
                        configurable : true
                    },
                    "collisionSlop": {
                        get : function(){
                            return this.getCollisionSlop();
                        },
                        set : function(newValue){
                            this.setCollisionSlop(newValue);
                        },
                        enumerable : true,
                        configurable : true
                    },
                    "collisionBias": {
                        get : function(){
                            return this.getCollisionBias();
                        },
                        set : function(newValue){
                            this.setCollisionBias(newValue);
                        },
                        enumerable : true,
                        configurable : true
                    },
                    "collisionPersistence": {
                        get : function(){
                            return this.getCollisionPersistence();
                        },
                        set : function(newValue){
                            this.setCollisionPersistence(newValue);
                        },
                        enumerable : true,
                        configurable : true
                    },
                    "enableContactGraph": {
                        get : function(){
                            return this.getEnableContactGraph();
                        },
                        set : function(newValue){
                            this.setEnableContactGraph(newValue);
                        },
                        enumerable : true,
                        configurable : true
                    }
                });

_proto = cp.Body.prototype;
cc.defineGetterSetter(_proto, "a", _proto.getAngle, _proto.setAngle);
cc.defineGetterSetter(_proto, "w", _proto.getAngVel, _proto.setAngVel);
cc.defineGetterSetter(_proto, "p", _proto.getPos, _proto.setPos);
cc.defineGetterSetter(_proto, "v", _proto.getVel, _proto.setVel);
cc.defineGetterSetter(_proto, "f", _proto.getForce, _proto.setForce);
cc.defineGetterSetter(_proto, "t", _proto.getTorque, _proto.setTorque);
cc.defineGetterSetter(_proto, "v_limit", _proto.getVelLimit, _proto.setVelLimit);
cc.defineGetterSetter(_proto, "w_limit", _proto.getAngVelLimit, _proto.setAngVelLimit);
cc.defineGetterSetter(_proto, "space", _proto.getSpace);
cc.defineGetterSetter(_proto, "rot", _proto.getRot);
cc.defineGetterSetter(_proto, "m", _proto.getMass, _proto.setMass);
cc.defineGetterSetter(_proto, "i", _proto.getMoment, _proto.setMoment);

_proto = cp.Shape.prototype;
cc.defineGetterSetter(_proto, "body", _proto.getBody, _proto.setBody);
cc.defineGetterSetter(_proto, "group", _proto.getGroup, _proto.setGroup);
cc.defineGetterSetter(_proto, "collision_type", _proto.getCollisionType, _proto.setCollisionType);
cc.defineGetterSetter(_proto, "layers", _proto.getLayers, _proto.setLayers);
cc.defineGetterSetter(_proto, "sensor", _proto.getSensor, _proto.setSensor);
cc.defineGetterSetter(_proto, "space", _proto.getSpace);
cc.defineGetterSetter(_proto, "surface_v", _proto.getSurfaceVelocity, _proto.setSurfaceVelocity);
cc.defineGetterSetter(_proto, "e", _proto.getElasticity, _proto.setElasticity);
cc.defineGetterSetter(_proto, "u", _proto.getFriction, _proto.setFriction);
_proto.cacheData = _proto.update;

_proto = cp.CircleShape.prototype;
_proto.type  = "circle";
cc.defineGetterSetter(_proto, "r", _proto.getRadius);
cc.defineGetterSetter(_proto, "c", _proto.getOffset);

_proto = cp.SegmentShape.prototype;
_proto.type = "segment";
cc.defineGetterSetter(_proto, "a", _proto.getA);
cc.defineGetterSetter(_proto, "b", _proto.getB);
cc.defineGetterSetter(_proto, "n", _proto.getNormal);
cc.defineGetterSetter(_proto, "r", _proto.getRadius);

_proto = cp.PolyShape.prototype;
_proto.type = "poly";

_proto = cp.Constraint.prototype;
cc.defineGetterSetter(_proto, "a", _proto.getA);
cc.defineGetterSetter(_proto, "b", _proto.getB);
cc.defineGetterSetter(_proto, "space", _proto.getSpace);
cc.defineGetterSetter(_proto, "maxForce", _proto.getMaxForce, _proto.setMaxForce);
cc.defineGetterSetter(_proto, "errorBias", _proto.getErrorBias, _proto.setErrorBias);
cc.defineGetterSetter(_proto, "maxBias", _proto.getMaxBias, _proto.setMaxBias);

_proto = cp.PinJoint.prototype;
cc.defineGetterSetter(_proto, "anchr1", _proto.getAnchr1, _proto.setAnchr1);
cc.defineGetterSetter(_proto, "anchr2", _proto.getAnchr2, _proto.setAnchr2);
cc.defineGetterSetter(_proto, "dist", _proto.getDist, _proto.setDist);

_proto = cp.SlideJoint.prototype;
cc.defineGetterSetter(_proto, "anchr1", _proto.getAnchr1, _proto.setAnchr1);
cc.defineGetterSetter(_proto, "anchr2", _proto.getAnchr2, _proto.setAnchr2);
cc.defineGetterSetter(_proto, "min", _proto.getMin, _proto.setMin);
cc.defineGetterSetter(_proto, "max", _proto.getMax, _proto.setMax);

_proto = cp.PivotJoint.prototype;
cc.defineGetterSetter(_proto, "anchr1", _proto.getAnchr1, _proto.setAnchr1);
cc.defineGetterSetter(_proto, "anchr2", _proto.getAnchr2, _proto.setAnchr2);

_proto = cp.GrooveJoint.prototype;
cc.defineGetterSetter(_proto, "anchr2", _proto.getAnchr2, _proto.setAnchr2);
cc.defineGetterSetter(_proto, "grv_a", _proto.getGrooveA, _proto.setGrooveA);
cc.defineGetterSetter(_proto, "grv_b", _proto.getGrooveB, _proto.setGrooveB);

_proto = cp.DampedSpring.prototype;
cc.defineGetterSetter(_proto, "anchr1", _proto.getAnchr1, _proto.setAnchr1);
cc.defineGetterSetter(_proto, "anchr2", _proto.getAnchr2, _proto.setAnchr2);
cc.defineGetterSetter(_proto, "damping", _proto.getDamping, _proto.setDamping);
cc.defineGetterSetter(_proto, "restLength", _proto.getRestLength, _proto.setRestLength);
cc.defineGetterSetter(_proto, "stiffness", _proto.getStiffness, _proto.setStiffness);

_proto = cp.DampedRotarySpring.prototype;
cc.defineGetterSetter(_proto, "restAngle", _proto.getRestAngle, _proto.setRestAngle);
cc.defineGetterSetter(_proto, "stiffness", _proto.getStiffness, _proto.setStiffness);
cc.defineGetterSetter(_proto, "damping", _proto.getDamping, _proto.setDamping);

_proto = cp.RotaryLimitJoint.prototype;
cc.defineGetterSetter(_proto, "min", _proto.getMin, _proto.setMin);
cc.defineGetterSetter(_proto, "max", _proto.getMax, _proto.setMax);

_proto = cp.RatchetJoint.prototype;
cc.defineGetterSetter(_proto, "angle", _proto.getAngle, _proto.setAngle);
cc.defineGetterSetter(_proto, "phase", _proto.getPhase, _proto.setPhase);
cc.defineGetterSetter(_proto, "ratchet", _proto.getRatchet, _proto.setRatchet);

_proto = cp.GearJoint.prototype;
cc.defineGetterSetter(_proto, "phase", _proto.getPhase, _proto.setPhase);
cc.defineGetterSetter(_proto, "ratio", _proto.getRatio, _proto.setRatio);

_proto = cp.SimpleMotor.prototype;
cc.defineGetterSetter(_proto, "rate", _proto.getRate, _proto.setRate);

_proto = cp.Arbiter.prototype;
cc.defineGetterSetter(_proto, "e", _proto.getElasticity, _proto.setElasticity);
cc.defineGetterSetter(_proto, "u", _proto.getFriction, _proto.setFriction);
cc.defineGetterSetter(_proto, "surface_vr", _proto.getSurfaceVelocity, _proto.setSurfaceVelocity);

_proto = null;