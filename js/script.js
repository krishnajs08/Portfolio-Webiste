(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---- toast ---- */
  var toast = document.getElementById('toast'), tTimer;
  function say(msg) {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(tTimer); tTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }

  /* ---- hero name: per-character entrance ---- */
  var nm = document.getElementById('nm');
  nm.querySelectorAll('.nl').forEach(function (line, li) {
    var txt = line.textContent, frag = document.createDocumentFragment();
    txt.split('').forEach(function (c, i) {
      var s = document.createElement('span');
      s.className = 'ch';
      if (c === ' ') {
        s.innerHTML = '&nbsp;';
      } else {
        s.textContent = c;
      }
      s.style.animation = reduce ? 'none' : 'chIn .85s cubic-bezier(.2,.8,.25,1) forwards';
      s.style.animationDelay = (0.18 + li * 0.22 + i * 0.035) + 's';
      frag.appendChild(s);
    });
    line.textContent = ''; line.appendChild(frag);
  });
  var st = document.createElement('style');
  st.textContent = '@keyframes chIn{to{opacity:1;transform:none}}';
  document.head.appendChild(st);

  /* ---- rotating role ---- */
  var roles = document.getElementById('roles');
  if (roles && !reduce) {
    var items = roles.children;
    if (items.length > 1) {
      var clone = items[0].cloneNode(true);
      roles.appendChild(clone);
      var ri = 0, total = items.length;
      setInterval(function () {
        ri++;
        roles.style.transition = 'transform .7s cubic-bezier(.76,0,.24,1)';
        roles.style.transform = 'translateY(-' + (ri * 1.7) + 'em)';
        if (ri === total - 1) {
          setTimeout(function () {
            roles.style.transition = 'none';
            roles.style.transform = 'translateY(0)';
            ri = 0;
          }, 720);
        }
      }, 2600);
    }
  }

  /* ---- scroll reveal ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* ---- skill marquees ---- */
  var rowA = [['C++', 'var(--pink)'], ['JavaScript', 'var(--peach)'], ['Python', 'var(--mint)'], ['PHP', 'var(--lilac)'],
  ['React.js', 'var(--pink)'], ['Node.js', 'var(--mint)'], ['Express.js', 'var(--lilac)'], ['MongoDB', 'var(--mint)'],
  ['MySQL', 'var(--peach)'], ['Tailwind CSS', 'var(--lilac)'], ['Bootstrap', 'var(--pink)']];
  var rowB = [['RAG', 'var(--lilac)'], ['LLM integration', 'var(--pink)'], ['AI agents', 'var(--mint)'],
  ['Prompt engineering', 'var(--peach)'], ['Vector databases', 'var(--lilac)'], ['LangChain', 'var(--mint)'],
  ['Claude', 'var(--peach)'], ['OpenAI Codex', 'var(--pink)'], ['Google Antigravity', 'var(--lilac)'],
  ['Cursor', 'var(--mint)'], ['REST APIs', 'var(--peach)'], ['MVC', 'var(--pink)'], ['Agile', 'var(--lilac)']];
  function fill(id, items) {
    var el = document.getElementById(id), html = '';
    items.concat(items).forEach(function (it) {
      html += '<span class="tag"><i style="background:' + it[1] + '"></i>' + it[0] + '</span>';
    });
    el.innerHTML = html;
  }
  fill('t1', rowA); fill('t2', rowB);

  /* ---- timeline draw + dots ---- */
  var tl = document.getElementById('tl'), tlfill = document.getElementById('tlfill');
  var items = Array.prototype.slice.call(document.querySelectorAll('.tl-item'));
  var dio = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); dio.unobserve(e.target); } });
  }, { threshold: 0.25 });
  items.forEach(function (i) { dio.observe(i); });

  /* ---- scroll-driven bits ---- */
  var hdr = document.getElementById('hdr'), prog = document.getElementById('prog'),
    totop = document.getElementById('totop'), ticking = false;
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    hdr.classList.toggle('small', y > 40);
    totop.classList.toggle('show', y > window.innerHeight);
    var r = tl.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.min(1, Math.max(0, (vh * 0.72 - r.top) / r.height));
    tlfill.style.height = (p * r.height) + 'px';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  totop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---- custom cursor ---- */
  if (fine && !reduce) {
    document.body.classList.add('has-cursor');
    var dot = document.getElementById('dot'), ring = document.getElementById('ring');
    var mx = 0, my = 0, rx = 0, ry = 0;
    function updateCursor(target) {
      if (!target || !target.closest) return;
      var card = target.closest('.card[data-view]');
      var view = target.closest('[data-view]');
      var hov = target.closest('a,button,input,textarea,.tag,.chip');
      if (card) {
        document.body.classList.add('cur-view');
        document.body.classList.remove('cur-hover');
      } else {
        document.body.classList.toggle('cur-view', !!view && !hov);
        document.body.classList.toggle('cur-hover', !!hov);
      }
    }

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
      updateCursor(e.target);
    }, { passive: true });

    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mouseover', function (e) {
      updateCursor(e.target);
    });

    document.querySelectorAll('.card[data-view]').forEach(function (card) {
      card.addEventListener('mouseleave', function () {
        document.body.classList.remove('cur-view');
      });
    });
  }

  /* ---- card click navigation ---- */
  document.querySelectorAll('.card[data-url]').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a, button')) return;
      var sel = window.getSelection();
      if (sel && sel.toString().trim().length > 0) return;
      var url = card.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    });
  });

  /* ---- magnetic hover ---- */
  if (fine && !reduce) {
    document.querySelectorAll('[data-mag]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + x * 0.22 + 'px,' + y * 0.3 + 'px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transition = 'transform .45s cubic-bezier(.3,1.4,.5,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 460);
      });
    });
  }

  /* ---- card tilt ---- */
  if (fine && !reduce) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(1100px) rotateX(' + (-py * 2.4) + 'deg) rotateY(' +
          (px * 2.8) + 'deg) translateY(-6px)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---- button shine ---- */
  document.querySelectorAll('.btn').forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (reduce) return;
      var r = b.getBoundingClientRect(), s = document.createElement('span');
      s.className = 'shine';
      s.style.left = (e.clientX - r.left) + 'px';
      s.style.top = (e.clientY - r.top) + 'px';
      s.style.width = s.style.height = Math.max(r.width, r.height) / 4 + 'px';
      b.appendChild(s);
      setTimeout(function () { s.remove(); }, 640);
    });
  });

  /* ---- theme toggle ---- */
  function currentTheme() {
    var set = document.documentElement.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    try { localStorage.setItem('kp-theme', theme); } catch (err) { }
  }

  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function (e) {
      var current = currentTheme();
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);

      if (!reduce && window.innerWidth > 0) {
        var rect = themeBtn.getBoundingClientRect();
        var x = (e && typeof e.clientX === 'number' && e.clientX > 0) ? e.clientX : (rect.left + rect.width / 2);
        var y = (e && typeof e.clientY === 'number' && e.clientY > 0) ? e.clientY : (rect.top + rect.height / 2);
        var far = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
        var w = document.createElement('div');
        w.className = 'wipe';
        w.style.left = x + 'px';
        w.style.top = y + 'px';
        w.style.width = (far * 2) + 'px';
        w.style.height = (far * 2) + 'px';
        w.style.background = next === 'dark' ? '#0F0B14' : '#FDF7F4';
        document.body.appendChild(w);

        requestAnimationFrame(function () {
          w.classList.add('go');
        });

        setTimeout(function () {
          w.style.transition = 'opacity .3s ease';
          w.style.opacity = '0';
          setTimeout(function () {
            if (w.parentNode) w.remove();
          }, 320);
        }, 450);
      }
    });
  }

  /* ---- mobile menu ---- */
  var mm = document.getElementById('mm');
  document.getElementById('menubtn').addEventListener('click', function () { mm.classList.add('open'); });
  document.getElementById('mmclose').addEventListener('click', function () { mm.classList.remove('open'); });
  mm.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { mm.classList.remove('open'); });
  });

  /* ---- copy email ---- */
  document.getElementById('copymail').addEventListener('click', function (e) {
    if (!navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText('pangarkarkrishna61@gmail.com').then(function () {
      say('Email copied');
    }, function () { window.location.href = 'mailto:pangarkarkrishna61@gmail.com'; });
  });

  /* ---- contact form — Web3Forms ---- */
  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target;

    /* bot trap */
    if (f.botcheck && f.botcheck.value) return;

    var name = f.name.value.trim();
    var email = f.email.value.trim();
    var message = f.message.value.trim();

    if (!name || !email || !message) {
      say('Fill in all three fields first'); return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      say('That email looks off'); return;
    }

    var btn = f.querySelector('button[type="submit"]');
    var origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    var data = new FormData(f);

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: data
    })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (json.success) {
          say('Message sent! I\'ll reply soon ✉️');
          f.reset();
        } else {
          say('Something went wrong — try emailing directly');
        }
      })
      .catch(function () {
        say('Network error — try emailing directly');
      })
      .finally(function () {
        btn.disabled = false;
        btn.textContent = origText;
      });
  });

  document.getElementById('yr').textContent = new Date().getFullYear();
})();

/* ---------- about story slideshow ---------- */
(function () {
  var root = document.getElementById('astory');
  if (!root) return;

  var slides = [].slice.call(root.querySelectorAll('.slide'));
  var n = slides.length;
  var barWrap = root.querySelector('.sbars');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = 4800;
  var i = 0, p = 0, last = 0;
  var paused = false, visible = true, swiped = false;

  slides.forEach(function () {
    var b = document.createElement('span');
    b.className = 'sbar';
    b.appendChild(document.createElement('i'));
    barWrap.appendChild(b);
  });
  var bars = [].slice.call(barWrap.children);

  function paint() {
    bars.forEach(function (b, j) {
      var v = j < i ? 1 : (j === i ? (reduce ? 1 : p) : 0);
      b.firstElementChild.style.transform = 'scaleX(' + v + ')';
    });
  }

  function go(k) {
    i = (k + n) % n;
    p = 0;
    slides.forEach(function (s, j) { s.classList.toggle('on', j === i); });
    paint();
  }

  function setPause(v) {
    paused = v;
    root.classList.toggle('hold', v);
  }

  function tick(t) {
    if (!last) last = t;
    var dt = t - last;
    last = t;
    if (!paused && visible && !document.hidden) {
      p += dt / DUR;
      if (p >= 1) go(i + 1); else paint();
    }
    requestAnimationFrame(tick);
  }

  root.querySelector('.prev').addEventListener('click', function () {
    if (swiped) { swiped = false; return; }
    go(i - 1);
  });
  root.querySelector('.next').addEventListener('click', function () {
    if (swiped) { swiped = false; return; }
    go(i + 1);
  });

  var sx = 0;
  root.addEventListener('pointerdown', function (e) { sx = e.clientX; setPause(true); });
  root.addEventListener('pointerup', function (e) {
    var dx = e.clientX - sx;
    if (Math.abs(dx) > 45) { swiped = true; go(dx < 0 ? i + 1 : i - 1); }
    setPause(false);
  });
  root.addEventListener('pointercancel', function () { setPause(false); });
  root.addEventListener('mouseenter', function () { setPause(true); });
  root.addEventListener('mouseleave', function () { setPause(false); });
  root.addEventListener('focusin', function () { setPause(true); });
  root.addEventListener('focusout', function () { setPause(false); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
    }, { threshold: .25 }).observe(root);
  }

  go(0);
  if (!reduce) requestAnimationFrame(tick);
})();

/* ===== animated code screen ===== */
(function () {
  var codeEl = document.getElementById('csCode');
  var progressEl = document.getElementById('csProgress');
  var pctEl = document.getElementById('csPct');
  if (!codeEl) return;

  /* code lines to animate – syntax already wrapped with span classes */
  var LINES = [
    '<span class="cs-kw">import</span> <span class="cs-pu">{ </span><span class="cs-fn">useState</span><span class="cs-pu"> }</span> <span class="cs-kw">from</span> <span class="cs-str">\'react\'</span>',
    '<span class="cs-kw">import</span> <span class="cs-fn">Timeline</span> <span class="cs-kw">from</span> <span class="cs-str">\'./Timeline\'</span>',
    '',
    '<span class="cs-cm">// Portfolio component</span>',
    '<span class="cs-kw">const</span> <span class="cs-fn">Portfolio</span> <span class="cs-pu">= () =&gt; {</span>',
    '  <span class="cs-kw">const</span> <span class="cs-pu">[</span><span class="cs-nm">active</span><span class="cs-pu">,</span> <span class="cs-fn">setActive</span><span class="cs-pu">]</span>',
    '    <span class="cs-pu">= </span><span class="cs-fn">useState</span><span class="cs-pu">(</span><span class="cs-nm">0</span><span class="cs-pu">)</span>',
    '',
    '  <span class="cs-kw">const</span> <span class="cs-nm">items</span> <span class="cs-pu">= [</span>',
    '    <span class="cs-pu">{</span> <span class="cs-fn">role</span><span class="cs-pu">:</span> <span class="cs-str">\'SWE\'</span> <span class="cs-pu">},</span>',
    '    <span class="cs-pu">{</span> <span class="cs-fn">role</span><span class="cs-pu">:</span> <span class="cs-str">\'Intern\'</span> <span class="cs-pu">},</span>',
    '    <span class="cs-pu">{</span> <span class="cs-fn">role</span><span class="cs-pu">:</span> <span class="cs-str">\'B.E. CS\'</span> <span class="cs-pu">}]</span>',
    '',
    '  <span class="cs-kw">return</span> <span class="cs-pu">(</span>',
    '    <span class="cs-rtn">&lt;Timeline</span>',
    '      <span class="cs-fn">data</span><span class="cs-pu">={</span><span class="cs-nm">items</span><span class="cs-pu">}</span>',
    '      <span class="cs-fn">active</span><span class="cs-pu">={</span><span class="cs-nm">active</span><span class="cs-pu">}</span>',
    '    <span class="cs-rtn">/&gt;</span>',
    '  <span class="cs-pu">)</span>',
    '<span class="cs-pu">}</span>',
    '',
    '<span class="cs-kw">export default</span> <span class="cs-fn">Portfolio</span>'
  ];

  var DELAY_BETWEEN = 220; /* ms per line */
  var currentLine = 0;
  var animating = false;
  var progressTimer = null;
  var pct = 0;

  function resetScreen() {
    codeEl.innerHTML = '';
    currentLine = 0;
    pct = 0;
    if (progressEl) progressEl.style.width = '0%';
    if (pctEl) pctEl.textContent = '0%';
  }

  function addLine() {
    /* remove cursor from previous line */
    var prevCursor = codeEl.querySelector('.cs-cursor');
    if (prevCursor) prevCursor.remove();

    if (currentLine >= LINES.length) {
      /* sequence done — pause, then restart */
      setTimeout(function () {
        resetScreen();
        animating = false;
        /* restart after brief pause */
        setTimeout(startAnimation, 900);
      }, 2200);
      return;
    }

    var span = document.createElement('span');
    span.className = 'cs-line';
    span.style.animationDelay = '0s'; /* fire immediately */
    span.innerHTML = LINES[currentLine] + '<span class="cs-cursor"></span>';
    codeEl.appendChild(span);
    currentLine++;

    /* update progress bar */
    pct = Math.round((currentLine / LINES.length) * 100);
    if (progressEl) progressEl.style.width = pct + '%';
    if (pctEl) pctEl.textContent = pct + '%';

    /* schedule next line */
    progressTimer = setTimeout(addLine, DELAY_BETWEEN);
  }

  function startAnimation() {
    if (animating) return;
    animating = true;
    resetScreen();
    addLine();
  }

  /* trigger once when the code screen enters viewport */
  var started = false;
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !started) {
        started = true;
        startAnimation();
        obs.disconnect();
        /* restart loop automatically via resetScreen/startAnimation */
        started = false; /* allow future loops */
      }
    }, { threshold: 0.3 });
    var screen = document.getElementById('codeScreen');
    if (screen) obs.observe(screen);
  } else {
    /* fallback: start immediately */
    startAnimation();
  }
})();