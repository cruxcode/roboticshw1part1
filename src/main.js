class Figure {

}

class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Line extends Figure {
    m;
    c;
    // Lines must be expressed in y = mx + c format
    constructor(slope, intercept) {
        super();
        this.c = intercept;
        this.m = slope;
    }
}

class Segment extends Figure {
    x1;
    y1;
    x2;
    y2;
    // Start and end point are needed for segment
    constructor(x1, y1, x2, y2) {
        super();
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

class Circle extends Figure {
    a;  // x center
    b;  // y center
    r;  // radius
    constructor(a, b, r) {
        super();
        this.a = a;
        this.b = b;
        this.r = r;
    }
}

/**
 * 
 * @param {Segment} s
 * @returns {Line}
 */
function convSegToLine(s) {
    let m = (s.y2 - s.y1) / (s.x2 - s.x1);
    let c = (s.y1 * s.x2 - s.y2 * s.x1) / (s.x2 - s.x1);
    return new Line(m, c);
}

/**
 * 
 * @param {Circle} c 
 * @param {Segment} s
 * @returns {Point[]} 
 */
function segCircleIntersect(c, s) {
    let l = convSegToLine(s);
    let p = lineCircleIntersect(c, l);
    if (p == undefined) {
        return;
    }
    let res = [];
    for (let i = 0; i < p.length; ++i) {
        if (pointOnSeg(s, p[i])) {
            res.push(p[i]);
        }
    }
    if (res.length == 0) {
        return;
    }
    return res;
}

/**
 * 
 * @param {Segment} s 
 * @param {Point} p
 * @return {boolean} 
 */
function pointOnSeg(s, p) {
    let smallx = s.x1 <= s.x2 ? s.x1 : s.x2;
    let bigx = s.x1 >= s.x2 ? s.x1 : s.x2;
    let smally = s.y1 <= s.y2 ? s.y1 : s.y2;
    let bigy = s.y1 >= s.y2 ? s.y1 : s.y2;
    if (smallx <= p.x && bigx >= p.x && smally <= p.y && bigy >= p.y) {
        return true;
    } else {
        return false;
    }
}

/**
 * 
 * @param {Circle} c 
 * @param {Line} l
 * @returns {Point[]}
 */
function lineCircleIntersect(c, l) {
    let acap = (l.m) ** 2 + 1;
    let z = l.c - c.b;
    let bcap = 2 * (z * l.m - c.a);
    let ccap = (c.a) ** 2 + (z) ** 2 - (c.r) ** 2;
    let det = bcap ** 2 - 4 * acap * ccap;
    if (det < 0) {
        return;
    }
    let rootx = (-1 * bcap + det ** 0.5) / (2 * acap);
    let rooty = l.m * rootx + l.c;
    let res = [];
    res.push(new Point(rootx, rooty));
    rootx = (-1 * bcap - det ** 0.5) / (2 * acap);
    rooty = l.m * rootx + l.c;
    res.push(new Point(rootx, rooty));
    return res;
}

/**
 * 
 * @param {Circle} c1 
 * @param {Circle} c2
 * @returns {boolean} 
 */
function circleCircleIntersect(c1, c2) {
    if ((c1.a - c2.a) ** 2 + (c1.b - c2.b) ** 2 <= (c1.r + c2.r) ** 2) {
        return true;
    }
    return false;
}

/**
 * 
 * @param {Segment} s1 
 * @param {Segment} s2
 * @returns {Point}
 */
function segSegIntersects(s1, s2) {
    let l1 = convSegToLine(s1);
    let l2 = convSegToLine(s2);
    let inter = lineLineIntersects(l1, l2);
    if (inter) {
        if (pointOnSeg(s1, inter) && pointOnSeg(s2, inter)) {
            return inter;
        }
    }
}

/**
 * 
 * @param {Line} l1 
 * @param {Line} l2
 * @returns {Point} 
 */
function lineLineIntersects(l1, l2) {
    if (l1.m - l2.m == 0) {
        return;
    }
    let x = (l2.c - l1.c) / (l1.m - l2.m);
    let y = l1.m * x + l1.c;
    return new Point(x, y);
}
/**
 * @property {Point} base
 * @property {number} link1len
 * @property {number} link2len
 */
class ManRobo {
    base;
    link1len;
    link2len;
    constructor(base, link1len, link2len) {
        this.base = base;
        this.link1len = link1len;
        this.link2len = link2len;
    }
}

/**
 * @property {Figure[]} parts
 */
class Obstacle {
    parts;
    constructor(parts) {
        this.parts = parts;
    }
    /**
     * 
     * @param {Figure} part 
     */
    addPart(part) {
        if (part != undefined)
            this.parts(part);
    }
}

/**
 * @property {number} theta1
 * @property {number} theta2
 */
class ManRoboConfig {
    theta1;
    theta2;
    constructor(theta1, theta2) {
        this.theta1 = theta1;
        this.theta2 = theta2;
    }
}

/**
 * 
 * @param {ManRobo} robo 
 * @param {Obstacle} o
 * @returns {number[][2]} 
 */
function getRO(robo, o) {
    let res = [];
    for (let q1 = 0; q1 < 360; ++q1) {
        let a = Math.cos(q1*Math.PI/180) * robo.link1len + robo.base.x;
        let b = Math.sin(q1*Math.PI/180) * robo.link1len + robo.base.y;
        let r = robo.link2len;
        let circle = new Circle(a, b, r);
        let q2 = {};
        // check if circle intersects with any obstacle part
        for (let i = 0; i < o.parts.length; ++i) {
            if (o.parts[i] instanceof Line) {
                let intersects = lineCircleIntersect(circle, o.parts[i]);
            }
            if (o.parts[i] instanceof Circle) {
                let intersects = circleCircleIntersect(circle, o.parts[i]);
                if(intersects){
                    for (let q2cap = 0; q2cap < 360; q2cap++) {
                        let x2 = Math.cos((q1 + q2cap)*Math.PI/180) * robo.link2len + a;
                        let y2 = Math.sin((q1 + q2cap)*Math.PI/180) * robo.link2len + b;
                        let s2 = new Segment(a, b, x2, y2);
                        let tmp = segCircleIntersect(o.parts[i], s2);
                        if (tmp) {
                            q2[q2cap] = true;
                        }
                    }
                }
            }
            if (o.parts[i] instanceof Segment) {
                let intersects = segCircleIntersect(circle, o.parts[i]);
                if (intersects) {
                    for (let q2cap = 0; q2cap < 360; q2cap++) {
                        let x2 = Math.cos((q1 + q2cap)*Math.PI/180) * robo.link2len + a;
                        let y2 = Math.sin((q1 + q2cap)*Math.PI/180) * robo.link2len + b;
                        let s2 = new Segment(a, b, x2, y2);
                        let tmp = segSegIntersects(o.parts[i], s2);
                        if (tmp) {
                            q2[q2cap] = true;
                        }
                    }
                }
            }
        }
        // add q1, q2 to res
        let q2s = Object.keys(q2);
        for (let i = 0; i < q2s.length; ++i) {
            res.push([q1, parseInt(q2s[i])]);
        }
    }
    return res;
}

function isIntersection(robo, o, q1, q2) {
    let a = Math.cos(q1*Math.PI/180) * robo.link1len + robo.base.x;
    let b = Math.sin(q1*Math.PI/180) * robo.link1len + robo.base.y;
    let r = robo.link2len;
    let circle = new Circle(a, b, r);
    // check if circle intersects with any obstacle part
    for (let i = 0; i < o.parts.length; ++i) {
        if (o.parts[i] instanceof Line) {
            let intersects = lineCircleIntersect(circle, o.parts[i]);
        }
        if (o.parts[i] instanceof Circle) {
            let intersects = circleCircleIntersect(circle, o.parts[i]);
        }
        if (o.parts[i] instanceof Segment) {
            let intersects = segCircleIntersect(circle, o.parts[i]);
            if (intersects) {
                let x2 = Math.cos((q1 + q2)*Math.PI/180) * robo.link2len + a;
                let y2 = Math.sin((q1 + q2)*Math.PI/180) * robo.link2len + b;
                let s2 = new Segment(a, b, x2, y2);
                console.log(s2);
                let tmp = segSegIntersects(o.parts[i], s2);
                if (tmp) {
                    return tmp;
                }
            }
        }
    }
}


let r = new ManRobo(new Point(0, 0), 2, 2);
// traingle
let o = new Obstacle([new Segment(2, 2.5, 3, 2.5), new Segment(2, 2.5, 3, 5), new Segment(3, 2.5, 3, 5)]);
let triangle = getRO(r, o);
// lower rectangle
o = new Obstacle([new Segment(-0.5, -1.5, 1.5, -1.5), new Segment(-0.5, -1.5, -0.5, -2), new Segment(1.5, -1.5, 1.5, -2)]);
let rect = getRO(r, o);
// upper circle
o = new Obstacle([new Circle(-1.5, 1, 0.5)]);
let upper = getRO(r, o);
// lower circle
o = new Obstacle([new Circle(-1.5, -1, 0.5)]);
let lower = getRO(r, o);

function datafy(intersection){
    let data = [];
    for (let i = 0; i < intersection.length; ++i) {
        data.push({ x: intersection[i][0], y: intersection[i][1] })
    }
    return data;
}

var ctx = document.getElementById('myChart').getContext('2d');
var scatterChart = new Chart(ctx, {
    type: "scatter",
    data: {
        datasets: [
            {
                label: "Triangle",
                data: datafy(triangle),
                fill: "rgba(255, 0, 0, 1)"
            },
            {
                label: "Rectangle",
                data: datafy(rect)
            },
            {
                label: "Upper Circle",
                data: datafy(upper)
            },
            {
                label: "Lower Circle",
                data: datafy(lower)
            }
        ]
    },
    options: {
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                ticks: {
                    max: 360
                }
            }],
            yAxes: [{
                ticks: {
                    max: 360
                }
            }]
        }
    }
})
var pgCtx = document.getElementById('playGround').getContext('2d');

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Obstacle} o 
 */
function drawObstacle(ctx, o) {
    for (let i = 0; i < o.parts.length; ++i) {
        if (o.parts[i] instanceof Line) {

        }
        if (o.parts[i] instanceof Circle) {

        }
        if (o.parts[i] instanceof Segment) {
            ctx.beginPath();
            ctx.moveTo(o.parts[i].x1 * 10, 360 - o.parts[i].y1 * 10);
            ctx.lineTo(o.parts[i].x2 * 10, 360 - o.parts[i].y2 * 10);
            ctx.stroke();
        }
    }
}
/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {ManRobo} r
 */
function drawRobo(ctx, r) {
    ctx.beginPath();
    ctx.arc(r.base.x * 10, 360 - r.base.y * 10, 5, 0, 360);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r.base.x * 10, 360 - r.base.y * 10);
    ctx.lineTo(r.link1len * 10, 360);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(r.link1len * 10 - 2.5, 360, 5, 0, 360);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(r.base.x * 10 + r.link1len * 10, 360 - r.base.y * 10);
    ctx.lineTo(r.base.x * 10 + r.link1len * 10 + r.link2len * 10, 360);
    ctx.stroke();
}

drawObstacle(pgCtx, o);
drawRobo(pgCtx, r);

console.log(isIntersection(r, o, 1, 6));