// ──────────────────────────────────────────────────────
// Nav scroll
// ──────────────────────────────────────────────────────
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav?.classList.toggle('scrolled', scrollY > 16), { passive: true });

// ──────────────────────────────────────────────────────
// Floating particles (canvas)
// ──────────────────────────────────────────────────────
const canvas = document.getElementById('particles');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const PARTICLE_COUNT = 50;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.05;
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.fadeDir * 0.002;
            if (this.opacity <= 0.02 || this.opacity >= 0.45) this.fadeDir *= -1;
            if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(196,80,95,${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ──────────────────────────────────────────────────────
// Marquee fill
// ──────────────────────────────────────────────────────
// ── Marquee ─────────────────────────────────────────────────────────────────
const row1El = document.getElementById('marquee-row1');
if (row1El) {
    const mods = [
        'Antinuke','Antiraid','Moderation','AutoMod',
        'Leveling','Tickets','TempVoice','Giveaways',
        'Starboard','Logging','Reaction Roles','Welcome',
        'Counters','Snipe','FakePerms'
    ];
    const items = mods.map(m =>
        `<span class="strip-word">${m}</span><span class="strip-slash">/</span>`
    ).join('');
    row1El.innerHTML = items + items;
}


// ──────────────────────────────────────────────────────
// Scroll reveal with stagger
// ──────────────────────────────────────────────────────
const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealIO.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));
// Also observe cards and panel rows that don't have .reveal yet
document.querySelectorAll('.card, .panel-row, .stat-item').forEach(el => {
    if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        revealIO.observe(el);
    }
});

// ──────────────────────────────────────────────────────
// Card mouse glow tracking
// ──────────────────────────────────────────────────────
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
    });
});

// ──────────────────────────────────────────────────────
// Fetch live stats + Counter animation (stats section)
// ──────────────────────────────────────────────────────
(async () => {
    // Fetch real server count before starting counter animations
    try {
        const res = await fetch('/stats.json?_=' + Date.now());
        if (res.ok) {
            const data = await res.json();
            const el = document.getElementById('serverCount');
            if (el && data.servers) {
                el.dataset.count = data.servers;
            }
        }
    } catch (e) {
        // Silently fall back to the hardcoded value in data-count
    }

    // Now start counter animations with the correct data
    const counterIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count) || 0;
                const suffix = el.dataset.suffix || '';
                const prefix = el.dataset.prefix || '';
                const duration = 2000;
                const start = performance.now();

                if (target === 0) {
                    el.textContent = prefix + '0' + suffix;
                    counterIO.unobserve(el);
                    return;
                }

                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out expo
                    const ease = 1 - Math.pow(2, -10 * progress);
                    const current = Math.round(target * ease);
                    el.textContent = prefix + current.toLocaleString() + (progress >= 1 ? suffix : '');
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                counterIO.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num[data-count]').forEach(el => counterIO.observe(el));
})();

// ──────────────────────────────────────────────────────
// Smooth parallax on floating cards
// ──────────────────────────────────────────────────────
const floatingContainer = document.querySelector('.hero-right');
if (floatingContainer && window.innerWidth > 900) {
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        const cards = floatingContainer.querySelectorAll('.float-card');
        cards.forEach((card, i) => {
            const depth = (i + 1) * 4;
            card.style.transform = card.style.transform.replace(/translate\([^)]+\)/g, '') ||
                card.style.transform;
            // Apply subtle mouse-follow offset
            const offsetX = x * depth;
            const offsetY = y * depth;
            if (card.classList.contains('float-card-1')) {
                card.style.transform = `translateX(calc(-50% + ${offsetX}px)) translateY(${offsetY}px)`;
            } else if (card.classList.contains('float-card-2')) {
                card.style.transform = `translateY(${offsetY}px) translateX(${offsetX}px) rotate(-1deg)`;
            } else {
                card.style.transform = `translateY(${offsetY}px) translateX(${offsetX}px) rotate(1deg)`;
            }
        });
    }, { passive: true });
}

// ──────────────────────────────────────────────────────
// Smooth scroll for anchor links
// ──────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ──────────────────────────────────────────────────────
// Commands page logic
// ──────────────────────────────────────────────────────
const navItems = document.querySelectorAll('.cmd-nav-item');
const sections = document.querySelectorAll('.cmd-section');
const heading = document.getElementById('cmdHeading');
const countEl = document.getElementById('cmdCount');

// Sidebar counts
function updateNavCounts() {
    navItems.forEach(item => {
        const cat = item.dataset.category;
        const countSpan = item.querySelector('.nav-count');
        if (!countSpan) return;
        if (cat === 'all') {
            countSpan.textContent = document.querySelectorAll('.cmd-card').length;
        } else {
            const sec = document.querySelector(`.cmd-section[data-category="${cat}"]`);
            countSpan.textContent = sec ? sec.querySelectorAll('.cmd-card').length : 0;
        }
    });
}
updateNavCounts();

function updateCount() {
    const visible = [...document.querySelectorAll('.cmd-card')].filter(c => c.style.display !== 'none').length;
    if (countEl) countEl.textContent = visible + ' commands';
}

navItems.forEach(item => item.addEventListener('click', () => {
    const t = item.dataset.category;
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    if (heading) heading.textContent = t === 'all' ? 'Commands' : item.querySelector('.nav-label')?.textContent || item.textContent;
    sections.forEach(s => s.style.display = (t === 'all' || s.dataset.category === t) ? '' : 'none');
    updateCount();
}));

const search = document.getElementById('cmdSearch');
search?.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim();
    document.querySelectorAll('.cmd-card').forEach(card => {
        card.style.display = (!q || card.textContent.toLowerCase().includes(q)) ? '' : 'none';
    });
    sections.forEach(s => {
        const vis = [...s.querySelectorAll('.cmd-card')].some(c => c.style.display !== 'none');
        s.style.display = vis ? '' : 'none';
    });
    updateCount();
});

updateCount();

// ──────────────────────────────────────────────────────
// Copy command
// ──────────────────────────────────────────────────────
function copyCmd(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
        const svg = btn.querySelector('svg');
        const originalHTML = svg.innerHTML;
        svg.innerHTML = '<polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        btn.style.color = '#6be89b';
        btn.style.borderColor = 'rgba(80,196,120,0.3)';
        setTimeout(() => {
            svg.innerHTML = originalHTML;
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 1200);
    });
}

// ──────────────────────────────────────────────────────
// Command Detail Modal
// ──────────────────────────────────────────────────────
const modal = document.getElementById('cmdModal');
const modalName = document.getElementById('modalName');
const modalCategory = document.getElementById('modalCategory');
const modalDesc = document.getElementById('modalDesc');
const modalUsage = document.getElementById('modalUsage');
const modalUsageCopy = document.getElementById('modalUsageCopy');
const modalArgsWrap = document.getElementById('modalArgsWrap');
const modalArgs = document.getElementById('modalArgs');
const modalPerms = document.getElementById('modalPerms');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.cmd-card').forEach(card => {
    card.addEventListener('click', () => {
        if (!modal) return;
        const name = card.dataset.cmd || '';
        const desc = card.dataset.desc || '';
        const usage = card.dataset.usage || '';
        const category = card.dataset.categoryName || '';
        const perms = card.dataset.perms || 'None';
        let args = [];
        try { args = JSON.parse(card.dataset.args || '[]'); } catch(e) {}

        modalName.textContent = name;
        modalCategory.textContent = category;
        modalDesc.textContent = desc;
        modalUsage.textContent = usage;

        if (args.length > 0) {
            modalArgsWrap.style.display = '';
            modalArgs.innerHTML = args.map(a => `
                <div class="cmd-modal-arg">
                    <div class="cmd-modal-arg-left">
                        <span class="cmd-modal-arg-name">${a.name}</span>
                        <span class="cmd-modal-arg-type">${a.type}</span>
                    </div>
                    <span class="cmd-modal-arg-badge ${a.required ? 'required' : 'optional'}">${a.required ? 'Required' : 'Optional'}</span>
                </div>
            `).join('');
        } else {
            modalArgsWrap.style.display = 'none';
            modalArgs.innerHTML = '';
        }

        modalPerms.innerHTML = `<span class="cmd-modal-perm">${perms}</span>`;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
}

modalUsageCopy?.addEventListener('click', () => {
    const text = modalUsage?.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
        const svg = modalUsageCopy.querySelector('svg');
        const originalHTML = svg.innerHTML;
        svg.innerHTML = '<polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
        modalUsageCopy.style.color = '#6be89b';
        modalUsageCopy.style.borderColor = 'rgba(80,196,120,0.3)';
        setTimeout(() => {
            svg.innerHTML = originalHTML;
            modalUsageCopy.style.color = '';
            modalUsageCopy.style.borderColor = '';
        }, 1200);
    });
});

// Instantly remove .html from the URL bar for a cleaner aesthetic
if (window.location.pathname.endsWith('.html')) {
    const newPath = window.location.pathname.slice(0, -5);
    window.history.replaceState({}, '', newPath === '' ? '/' : newPath + window.location.search + window.location.hash);
}

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}


// Docs Mobile Sidebar Toggle
const docsHamburger = document.getElementById('docsHamburger');
const docsSidebar = document.getElementById('sidebar');
if (docsHamburger && docsSidebar) {
  docsHamburger.addEventListener('click', () => {
    docsSidebar.classList.toggle('active');
    document.body.style.overflow = docsSidebar.classList.contains('active') ? 'hidden' : '';
  });
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      docsSidebar.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

