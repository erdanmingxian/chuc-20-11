/* ==========================================================
   20/11 Greeting Website for Anh Khal
   Theme: Impressionist Sunlit Forest & Soaring Light Birds
   - Living canvas with glowing birds of light & golden sun dust
   - Ambient peaceful harp/piano chord synthesis via Web Audio API
========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('natureCanvas');
  const ctx = canvas.getContext('2d');
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundLabel = document.getElementById('soundLabel');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  /* ----------------------------------------------------------
     1. GOLDEN SUNLIGHT PARTICLES & DUST
  ----------------------------------------------------------- */
  const particles = [];
  const PARTICLE_COUNT = 45;

  class SunDust {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
      this.size = Math.random() * 2.8 + 1.2;
      this.vx = (Math.random() - 0.2) * 0.8;
      this.vy = -(Math.random() * 0.9 + 0.4);
      this.alpha = Math.random() * 0.7 + 0.2;
      this.maxAlpha = this.alpha;
      this.fadeSpeed = Math.random() * 0.006 + 0.003;
      this.fadingIn = true;
      this.hue = Math.random() * 25 + 42; // warm yellow/gold hues
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.fadingIn) {
        this.alpha += this.fadeSpeed;
        if (this.alpha >= this.maxAlpha) {
          this.fadingIn = false;
        }
      } else {
        this.alpha -= this.fadeSpeed;
        if (this.alpha <= 0.05) {
          this.reset();
        }
      }

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = `hsl(${this.hue}, 95%, 75%)`;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 70%)`;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new SunDust());
  }

  /* ----------------------------------------------------------
     2. GLOWING BIRDS OF LIGHT (Like in the artwork)
  ----------------------------------------------------------- */
  const birds = [];
  const birdTrails = [];

  class LightBird {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = -80;
      this.y = Math.random() * (canvas.height * 0.6) + 40;
      this.speed = Math.random() * 1.5 + 1.8;
      this.scale = Math.random() * 0.35 + 0.65;
      this.wingAngle = 0;
      this.wingSpeed = Math.random() * 0.08 + 0.09;
      this.angle = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.3 + 0.7;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.wingAngle += this.wingSpeed;

      // Add trail point
      if (Math.random() < 0.65) {
        birdTrails.push({
          x: this.x - 10,
          y: this.y + (Math.random() * 6 - 3),
          size: Math.random() * 2.5 + 1,
          alpha: 0.8,
          color: Math.random() > 0.5 ? '#ffffff' : '#ffe885'
        });
      }

      if (this.x > canvas.width + 100 || this.y < -50 || this.y > canvas.height + 50) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.scale(this.scale, this.scale);

      const wingY = Math.sin(this.wingAngle) * 14;

      // Glowing aura
      ctx.shadowColor = '#fff6bd';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#ffffff';

      ctx.beginPath();
      // Bird head & body
      ctx.ellipse(8, 0, 11, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Top wing
      ctx.beginPath();
      ctx.moveTo(-2, 0);
      ctx.quadraticCurveTo(6, -18 + wingY, 18, -12 + wingY);
      ctx.quadraticCurveTo(4, -4, -2, 0);
      ctx.fill();

      // Bottom wing
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.quadraticCurveTo(4, 16 - wingY, 16, 10 - wingY);
      ctx.quadraticCurveTo(2, 4, -4, 0);
      ctx.fill();

      // Tail
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-20, -5);
      ctx.lineTo(-17, 0);
      ctx.lineTo(-20, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  // Create 3 birds with different initial positions
  for (let i = 0; i < 3; i++) {
    const bird = new LightBird();
    bird.x = Math.random() * canvas.width * 0.8;
    birds.push(bird);
  }

  /* ----------------------------------------------------------
     3. MAIN RENDER LOOP
  ----------------------------------------------------------- */
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Update & draw bird stardust trails
    for (let i = birdTrails.length - 1; i >= 0; i--) {
      const t = birdTrails[i];
      t.alpha -= 0.015;
      t.x -= 0.4;
      if (t.alpha <= 0) {
        birdTrails.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = t.color;
      ctx.shadowColor = t.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Update & draw birds
    birds.forEach(bird => {
      bird.update();
      bird.draw();
    });

    requestAnimationFrame(render);
  }
  render();

  /* ----------------------------------------------------------
     4. PEACEFUL AMBIENT HARP / CHIMES (Web Audio API)
  ----------------------------------------------------------- */
  let audioCtx = null;
  let isPlayingAudio = false;
  let melodyInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Serene pentatonic notes for forest ambiance (D, F#, A, B, C#, E)
  const pentatonicNotes = [
    293.66, // D4
    369.99, // F#4
    440.00, // A4
    493.88, // B4
    554.37, // C#5
    659.25, // E5
    739.99, // F#5
    880.00  // A5
  ];

  function playAmbientNote(freq, time) {
    if (!audioCtx || !isPlayingAudio) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.06, time + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 3.2);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 3.3);
  }

  function playNextArpeggio() {
    if (!isPlayingAudio || !audioCtx) return;
    const now = audioCtx.currentTime;

    // Pick 3-4 gentle cascading notes
    const count = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const note = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
      playAmbientNote(note, now + i * 0.35);
    }
  }

  function toggleAudio() {
    if (isPlayingAudio) {
      isPlayingAudio = false;
      clearInterval(melodyInterval);
      soundBtn.classList.remove('active');
      soundLabel.textContent = 'Bật giai điệu';
    } else {
      initAudio();
      isPlayingAudio = true;
      soundBtn.classList.add('active');
      soundLabel.textContent = 'Tắt giai điệu';
      playNextArpeggio();
      melodyInterval = setInterval(playNextArpeggio, 3600);
    }
  }

  soundBtn.addEventListener('click', toggleAudio);

  // Optional: Gentle click anywhere to start audio if desired
  document.body.addEventListener('click', () => {
    if (!isPlayingAudio && !sessionStorage.getItem('interacted')) {
      sessionStorage.setItem('interacted', 'true');
      toggleAudio();
    }
  }, { once: true });
});
