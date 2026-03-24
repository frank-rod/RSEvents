/* ============================================
   RS AUDIOVISUAL — JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile menu toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Reveal on scroll (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const parent = entry.target.parentElement;
                const siblings = parent.querySelectorAll('.reveal');
                let delay = 0;
                siblings.forEach((sib, i) => {
                    if (sib === entry.target) {
                        delay = i * 100;
                    }
                });

                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // =============================================
    // VORTEX EFFECT — Exact 1:1 port from React
    // =============================================

    // --- Simplex Noise 3D ---
    const F3 = 1.0 / 3.0;
    const G3 = 1.0 / 6.0;
    const grad3 = [
        [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
        [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
        [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];

    const perm = new Uint8Array(512);
    const permMod12 = new Uint8Array(512);
    const p = new Uint8Array(256);

    for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
    for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        permMod12[i] = perm[i] % 12;
    }

    function noise3D(xin, yin, zin) {
        let n0, n1, n2, n3;
        const s = (xin + yin + zin) * F3;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const k = Math.floor(zin + s);
        const t = (i + j + k) * G3;
        const X0 = i - t, Y0 = j - t, Z0 = k - t;
        const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;

        let i1, j1, k1, i2, j2, k2;
        if (x0 >= y0) {
            if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
            else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
            else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
        } else {
            if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
            else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
            else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
        }

        const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2*G3, y2 = y0 - j2 + 2*G3, z2 = z0 - k2 + 2*G3;
        const x3 = x0 - 1 + 3*G3, y3 = y0 - 1 + 3*G3, z3 = z0 - 1 + 3*G3;

        const ii = i & 255, jj = j & 255, kk = k & 255;

        let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
        if (t0 < 0) n0 = 0;
        else {
            t0 *= t0;
            const gi0 = permMod12[ii + perm[jj + perm[kk]]];
            n0 = t0 * t0 * (grad3[gi0][0]*x0 + grad3[gi0][1]*y0 + grad3[gi0][2]*z0);
        }

        let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
        if (t1 < 0) n1 = 0;
        else {
            t1 *= t1;
            const gi1 = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]];
            n1 = t1 * t1 * (grad3[gi1][0]*x1 + grad3[gi1][1]*y1 + grad3[gi1][2]*z1);
        }

        let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
        if (t2 < 0) n2 = 0;
        else {
            t2 *= t2;
            const gi2 = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]];
            n2 = t2 * t2 * (grad3[gi2][0]*x2 + grad3[gi2][1]*y2 + grad3[gi2][2]*z2);
        }

        let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
        if (t3 < 0) n3 = 0;
        else {
            t3 *= t3;
            const gi3 = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]];
            n3 = t3 * t3 * (grad3[gi3][0]*x3 + grad3[gi3][1]*y3 + grad3[gi3][2]*z3);
        }

        return 32 * (n0 + n1 + n2 + n3);
    }

    // --- Vortex config (exact React defaults) ---
    const particleCount = 700;
    const particlePropCount = 9;
    const particlePropsLength = particleCount * particlePropCount;
    const rangeY = 100;
    const baseTTL = 50;
    const rangeTTL = 150;
    const baseSpeed = 0.0;
    const rangeSpeed = 1.5;
    const baseRadius = 1;
    const rangeRadius = 2;
    const baseHue = 220;
    const rangeHue = 100;
    const noiseSteps = 3;
    const xOff = 0.00125;
    const yOff = 0.00125;
    const zOff = 0.0005;
    const backgroundColor = '#000000';
    const TAU = 2 * Math.PI;

    let tick = 0;
    let particleProps = new Float32Array(particlePropsLength);
    let center = [0, 0];

    const rand = (n) => n * Math.random();
    const randRange_ = (n) => n - rand(2 * n);
    const fadeInOut = (t, m) => {
        const hm = 0.5 * m;
        return Math.abs(((t + hm) % m) - hm) / hm;
    };
    const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

    const canvas = document.getElementById('vortexCanvas');
    const ctx = canvas.getContext('2d');

    // Use an offscreen canvas for glow compositing to avoid feedback loop
    const offCanvas = document.createElement('canvas');
    const offCtx = offCanvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        offCanvas.width = canvas.width;
        offCanvas.height = canvas.height;
        center[0] = 0.5 * canvas.width;
        center[1] = 0.5 * canvas.height;
    }

    function initParticle(i) {
        const x = rand(canvas.width);
        const y = center[1] + randRange_(rangeY);
        const hue = baseHue + rand(rangeHue);
        particleProps.set([x, y, 0, 0, 0, baseTTL + rand(rangeTTL), baseSpeed + rand(rangeSpeed), baseRadius + rand(rangeRadius), hue], i);
    }

    function initParticles() {
        tick = 0;
        particleProps = new Float32Array(particlePropsLength);
        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            initParticle(i);
        }
    }

    function drawParticle(x, y, x2, y2, life, ttl, radius, hue) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineWidth = radius;
        ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    function updateParticle(i) {
        const i2 = 1+i, i3 = 2+i, i4 = 3+i, i5 = 4+i, i6 = 5+i, i7 = 6+i, i8 = 7+i, i9 = 8+i;

        const x = particleProps[i];
        const y = particleProps[i2];
        const n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
        const vx = lerp(particleProps[i3], Math.cos(n), 0.5);
        const vy = lerp(particleProps[i4], Math.sin(n), 0.5);
        let life = particleProps[i5];
        const ttl = particleProps[i6];
        const speed = particleProps[i7];
        const x2 = x + vx * speed;
        const y2 = y + vy * speed;
        const radius = particleProps[i8];
        const hue = particleProps[i9];

        drawParticle(x, y, x2, y2, life, ttl, radius, hue);

        life++;

        particleProps[i] = x2;
        particleProps[i2] = y2;
        particleProps[i3] = vx;
        particleProps[i4] = vy;
        particleProps[i5] = life;

        if (x2 > canvas.width || x2 < 0 || y2 > canvas.height || y2 < 0 || life > ttl) {
            initParticle(i);
        }
    }

    function renderGlow() {
        // Copy current canvas to offscreen
        offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
        offCtx.drawImage(canvas, 0, 0);

        // Glow pass 1
        ctx.save();
        ctx.filter = 'blur(8px) brightness(200%)';
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(offCanvas, 0, 0);
        ctx.restore();

        // Glow pass 2
        ctx.save();
        ctx.filter = 'blur(4px) brightness(200%)';
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(offCanvas, 0, 0);
        ctx.restore();
    }

    function renderToScreen() {
        // Copy current state to offscreen
        offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
        offCtx.drawImage(canvas, 0, 0);

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(offCanvas, 0, 0);
        ctx.restore();
    }

    function drawVortex() {
        tick++;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlePropsLength; i += particlePropCount) {
            updateParticle(i);
        }

        renderGlow();
        renderToScreen();

        window.requestAnimationFrame(drawVortex);
    }

    resizeCanvas();
    initParticles();
    drawVortex();

    window.addEventListener('resize', resizeCanvas);

    // --- Active nav link on scroll ---
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = 'var(--accent-secondary)';
                } else {
                    link.style.color = '';
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNav);

    // --- Contact form ---
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const mensaje = document.getElementById('mensaje').value;

        const whatsappMsg = encodeURIComponent(
            `Hola, soy ${nombre}.\n` +
            `Email: ${email}\n` +
            (telefono ? `Teléfono: ${telefono}\n` : '') +
            `\nMensaje: ${mensaje}`
        );

        window.open(`https://wa.me/529983943934?text=${whatsappMsg}`, '_blank');

        contactForm.reset();
    });
});
