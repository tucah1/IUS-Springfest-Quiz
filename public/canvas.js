let circles = [],
    circle = {},
    overlapping = false,
    NumCircles = 40,
    protection = 10000,
    counter = 0,
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight;
let canvas;

function windowResized() {
    circles = [];
    while (circles.length < NumCircles && counter < protection) {
        circle = {
            x: random(windowWidth),
            y: random(windowHeight),
            r: random(3, 15)
        };
        overlapping = false;

        // check that it is not overlapping with any existing circle
        // another brute force approach
        for (var i = 0; i < circles.length; i++) {
            var existing = circles[i];
            var d = dist(circle.x, circle.y, existing.x, existing.y);
            if (d < circle.r + existing.r) {
                // They are overlapping
                overlapping = true;
                // do not add to array
                break;
            }
        }

        // add valid circles to array
        if (!overlapping) {
            circles.push(circle);
        }

        counter++;
    }

    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.style('z-index', '-1');
    // populate circles array
    // brute force method continues until # of circles target is reached
    // or until the protection value is reached
    while (circles.length < NumCircles && counter < protection) {
        circle = {
            x: random(width),
            y: random(height),
            r: random(3, 15)
        };
        overlapping = false;

        // check that it is not overlapping with any existing circle
        // another brute force approach
        for (var i = 0; i < circles.length; i++) {
            var existing = circles[i];
            var d = dist(circle.x, circle.y, existing.x, existing.y);
            if (d < circle.r + existing.r) {
                // They are overlapping
                overlapping = true;
                // do not add to array
                break;
            }
        }

        // add valid circles to array
        if (!overlapping) {
            circles.push(circle);
        }

        counter++;
    }
}

function draw() {
    background('rgb(250, 251, 234)');
    noStroke();

    fill('rgba(23, 174, 238, 0.3)');
    for (let i = 0; i < circles.length / 3; i++) {
        ellipse(circles[i].x, circles[i].y, circles[i].r * 2, circles[i].r * 2);
    }

    fill('rgba(255, 198, 65, 0.6)');
    for (
        let i = Math.round(circles.length / 3);
        i < Math.round(circles.length / 3 + circles.length / 3);
        i++
    ) {
        ellipse(circles[i].x, circles[i].y, circles[i].r * 2, circles[i].r * 2);
    }

    fill('rgba(138, 190, 23, 0.4)');
    for (
        let i = Math.round(circles.length / 3 + circles.length / 3);
        i < circles.length;
        i++
    ) {
        ellipse(circles[i].x, circles[i].y, circles[i].r * 2, circles[i].r * 2);
    }
}
