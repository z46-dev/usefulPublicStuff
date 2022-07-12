const fireworks = (function () {
    document.body.innerHTML = "";
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";
    const canvas = document.createElement("canvas");
    canvas.style.margin = "0px";
    canvas.style.padding = "0px";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resetCanvas() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        ctx.lineJoin = ctx.lineCap = "round";
    }

    function lerp(a, b, x, syncWithFps = false) {
        if (syncWithFps) {
            if (global.fps < 20) global.fps = 20;
            x /= global.fps / 120;
        }
        return a + x * (b - a);
    }
    window.addEventListener("resize", resetCanvas);
    window.addEventListener("orientationchange", () => {
        resetCanvas();
    });
    resetCanvas();
    const missiles = {};
    const particles = {};
    let id = 0;
    class Particle {
        constructor(parent, angle) {
            this.x = parent.x;
            this.y = parent.y;
            this.vx = Math.cos(angle);
            this.vy = Math.sin(angle);
            this.color = parent.color;
            this.alpha = parent.alpha;
            this.size = parent.size / 3;
            this.maxTick = Math.random() * 100 + 100;
            this.tick = this.maxTick;
            this.id = id++;
            particles[this.id] = this;
        }
        move() {
            this.vy = lerp(this.vy, 1, .01);
            this.x += this.vx * 3;
            this.y += this.vy * 3;
            this.alpha = this.tick / this.maxTick;
            if (--this.tick < 0) {
                delete particles[this.id];
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x + .5 | 0, this.y + .5 | 0);
            ctx.beginPath();
            ctx.arc(0, 0, this.size + .5 | 0, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    class Missile {
        constructor() {
            this.x = innerWidth / 4 + Math.random() * innerWidth / 2;
            this.y = innerHeight;
            this.vx = Math.random() - .5;
            this.vy = -1;
            this.size = 5 + Math.random() * 5;
            this.color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
            this.id = id++;
            missiles[this.id] = this;
        }
        move() {
            this.x += this.vx * 5;
            this.y += this.vy * 5;
            if (this.y < innerHeight / 2 && Math.random() > .9 + (this.y / innerWidth / 2) / 1.5) {
                for (let i = 0, l = Math.random() * 11 + 5; i < l; i++) {
                    new Particle(this, (Math.PI * 2) / l * i);
                }
                delete missiles[this.id];
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.translate(this.x + .5 | 0, this.y + .5 | 0);
            ctx.beginPath();
            ctx.arc(0, 0, this.size + .5 | 0, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    let enabled = false;

    function drawLoop() {
        ctx.fillStyle = "rgba(0, 0, 0, .175)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (Object.keys(missiles).length < 10 && Math.random() > .95) {
            new Missile();
        }
        for (const id in missiles) {
            const missile = missiles[id];
            missile.move();
            missile.draw();
        }
        for (const id in particles) {
            const particle = particles[id];
            particle.move();
            particle.draw();
        }
        //realCtx.clearRect(0, 0, realCanvas.width, realCanvas.height);
        //realCtx.globalAlpha = .25;
        //realCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
        //realCtx.globalAlpha = 1;
        enabled && requestAnimationFrame(drawLoop);
    }
    return {
        start: function () {
            enabled = true;
            drawLoop();
        },
        stop: function () {
            realCtx.clearRect(0, 0, realCanvas.width, realCanvas.height);
            enabled = false;
            missiles = {};
            particles = {};
            window.removeEventListener("resize", resetCanvas);
        }
    }
})();
