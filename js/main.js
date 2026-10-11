(function () {
  "use strict";

  var C = window.WEDDING;
  var AUTH_KEY = "wi-auth";
  var LANG_KEY = "wi-lang";
  var TZ = "Asia/Tokyo";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  // ---------- 言語 ----------
  var lang = (function () {
    try { var saved = localStorage.getItem(LANG_KEY); if (saved === "ja" || saved === "en") return saved; } catch (e) {}
    return (navigator.language || "ja").toLowerCase().indexOf("ja") === 0 ? "ja" : "en";
  })();

  function t(key, vars) {
    var s = (I18N[lang] && I18N[lang][key]) || I18N.ja[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }

  function loc(obj) { return obj ? (obj[lang] || obj.ja || "") : ""; }

  function formatDate(iso, withWeekday) {
    var d = new Date(iso);
    var opts = { timeZone: TZ, year: "numeric", month: "long", day: "numeric" };
    if (withWeekday) opts.weekday = lang === "ja" ? "short" : "long";
    return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", opts).format(d);
  }

  function dateDots(iso) {
    var p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" })
      .format(new Date(iso));
    return p.replace(/-/g, ".");
  }

  function bindings() {
    var g = C.couple.groom, b = C.couple.bride;
    return {
      initials: C.couple.initials,
      initialsCompact: C.couple.initials.replace(/\s+/g, ""),
      namesShort: g.short + " &amp; " + b.short,
      groomShort: g.short,
      brideShort: b.short,
      namesLocal: lang === "ja" ? g.ja + "<span class=\"dot\">・</span>" + b.ja : g.en + " &amp; " + b.en,
      namesSign: lang === "ja" ? g.ja + "<br>" + b.ja : g.en + "<br>" + b.en,
      dateLong: formatDate(C.weddingDate, true),
      dateDots: dateDots(C.weddingDate),
      venueName: loc(C.venue.name),
      venueAddress: loc(C.venue.address),
      venueAccess: loc(C.venue.access),
      dressCode: loc(C.dressCode),
      notes: loc(C.notes)
    };
  }

  function applyLang() {
    document.documentElement.lang = lang;
    var vars = { deadline: formatDate(C.rsvpDeadline, true) };
    $$("[data-i18n]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n"), vars); });
    $$("[data-i18n-placeholder]").forEach(function (el) { el.placeholder = t(el.getAttribute("data-i18n-placeholder")); });
    $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    var b = bindings();
    $$("[data-bind]").forEach(function (el) { el.innerHTML = b[el.getAttribute("data-bind")] || ""; });
    $$("[data-only]").forEach(function (el) { el.hidden = el.getAttribute("data-only") !== lang; });
    $$("#langToggle [data-lang]").forEach(function (el) { el.classList.toggle("is-active", el.getAttribute("data-lang") === lang); });
    renderSchedule();
    renderMovie();
    if (submitBtn && !submitBtn.disabled) submitBtn.textContent = t("rsvp.submit");
  }

  $("#langToggle").addEventListener("click", function () {
    lang = lang === "ja" ? "en" : "ja";
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    applyLang();
  });

  // ---------- 合言葉 ----------
  var gate = $("#gate"), envScreen = $("#envelopeScreen"), main = $("#main");

  function storedKey() { try { return sessionStorage.getItem(AUTH_KEY) || ""; } catch (e) { return ""; } }

  $("#gateForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("#gateInput");
    var key = normalizePassphrase(input.value);
    sha256Hex(key).then(function (hash) {
      if (hash !== C.passphraseHash) {
        $("#gateError").textContent = t("gate.error");
        input.classList.remove("shake"); void input.offsetWidth; input.classList.add("shake");
        return;
      }
      try { sessionStorage.setItem(AUTH_KEY, key); } catch (err) {}
      $("#gateError").textContent = "";
      swapScreen(gate, envScreen);
    });
  });

  function swapScreen(from, to, done) {
    from.classList.add("is-leaving");
    setTimeout(function () {
      from.hidden = true;
      from.classList.remove("is-leaving");
      to.hidden = false;
      to.classList.add("is-entering");
      requestAnimationFrame(function () { requestAnimationFrame(function () { to.classList.remove("is-entering"); }); });
      if (done) done();
    }, reduceMotion ? 0 : 600);
  }

  // ---------- 封筒 ----------
  var envelope = $("#envelope");
  var opened = false;
  function openEnvelope() {
    if (opened) return;
    opened = true;
    envelope.classList.add("is-open");
    setTimeout(function () { swapScreen(envScreen, main, onMainShown); }, reduceMotion ? 300 : 2600);
  }
  envelope.addEventListener("click", openEnvelope);
  envelope.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
  });

  function onMainShown() {
    window.scrollTo(0, 0);
    setupReveal();
  }

  // ---------- 写真 ----------
  $("#heroImg").src = C.photos.hero;

  var gallery = $("#gallery");
  C.photos.gallery.forEach(function (src, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gallery-item";
    btn.innerHTML = "<img src=\"" + src + "\" alt=\"\" loading=\"lazy\" decoding=\"async\">";
    btn.setAttribute("aria-label", "Photo " + (i + 1));
    btn.addEventListener("click", function () { openLightbox(src); });
    gallery.appendChild(btn);
  });

  function openLightbox(src) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.innerHTML = "<img src=\"" + src + "\" alt=\"\"><button type=\"button\" aria-label=\"Close\">×</button>";
    var close = function () { box.classList.remove("is-open"); setTimeout(function () { box.remove(); }, 300); };
    box.addEventListener("click", close);
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("is-open"); });
  }

  // ---------- ムービー ----------
  function renderMovie() {
    var el = $("#movie");
    var v = C.video || {};
    if (v.youtubeId) {
      if (el.querySelector("iframe")) return;
      el.innerHTML =
        "<button type=\"button\" class=\"movie-play\" aria-label=\"" + t("movie.play") + "\">" +
        "<img src=\"https://i.ytimg.com/vi/" + encodeURIComponent(v.youtubeId) + "/hqdefault.jpg\" alt=\"\" loading=\"lazy\">" +
        "<span class=\"play-icon\"></span></button>";
      el.querySelector("button").addEventListener("click", function () {
        el.innerHTML = "<iframe src=\"https://www.youtube-nocookie.com/embed/" + encodeURIComponent(v.youtubeId) +
          "?autoplay=1&playsinline=1&rel=0\" title=\"Movie\" allow=\"autoplay; encrypted-media; picture-in-picture\" allowfullscreen></iframe>";
      });
    } else if (v.mp4) {
      if (el.querySelector("video")) return;
      el.innerHTML = "<video controls playsinline preload=\"metadata\"" + (v.poster ? " poster=\"" + v.poster + "\"" : "") +
        "><source src=\"" + v.mp4 + "\" type=\"video/mp4\"></video>";
    } else {
      el.innerHTML = "<div class=\"movie-soon\"><span class=\"play-icon\"></span><p>" + t("movie.soon") + "</p></div>";
    }
  }

  // ---------- ご案内 ----------
  function renderSchedule() {
    $("#schedule").innerHTML = C.schedule.map(function (s) {
      return "<dt>" + t("schedule." + s.key) + "</dt><dd>" + s.time + "</dd>";
    }).join("");
  }

  $("#mapFrame").src = "https://www.google.com/maps?q=" + encodeURIComponent(C.venue.mapQuery) + "&output=embed";
  $("#mapLink").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.venue.mapQuery);

  // ---------- カウントダウン ----------
  var target = new Date(C.weddingDate).getTime();
  var cd = {};
  $$("[data-cd]").forEach(function (el) { cd[el.getAttribute("data-cd")] = el; });
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      $("#countdown").hidden = true;
      $("#countdownDone").hidden = false;
      return false;
    }
    var s = Math.floor(diff / 1000);
    cd.d.textContent = Math.floor(s / 86400);
    cd.h.textContent = String(Math.floor(s % 86400 / 3600)).padStart(2, "0");
    cd.m.textContent = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
    cd.s.textContent = String(s % 60).padStart(2, "0");
    return true;
  }
  if (tick()) { var timer = setInterval(function () { if (!tick()) clearInterval(timer); }, 1000); }

  // ---------- 出欠フォーム ----------
  var form = $("#rsvpForm");
  var submitBtn = $("#rsvpSubmit");
  var errEl = $("#rsvpError");

  if (Date.now() > new Date(C.rsvpDeadline).getTime()) {
    form.hidden = true;
    $("#rsvpClosed").hidden = false;
  }

  form.addEventListener("change", function (e) {
    if (e.target.name === "attendance") {
      form.classList.toggle("is-decline", e.target.value === "decline");
    }
    if (e.target.name === "companions") {
      $(".companion-names", form).hidden = e.target.value === "0";
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errEl.textContent = "";
    var fd = new FormData(form);
    var data = {};
    fd.forEach(function (v, k) { data[k] = typeof v === "string" ? v.trim() : v; });

    if (!data.attendance || !data.side || !data.name || !data.email) {
      errEl.textContent = t("rsvp.errRequired");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errEl.textContent = t("rsvp.errEmail");
      return;
    }
    if (data.attendance === "decline") {
      data.companions = "0"; data.companionNames = ""; data.allergies = "";
    }
    data.lang = lang;
    data.key = storedKey();

    submitBtn.disabled = true;
    submitBtn.textContent = t("rsvp.sending");

    send(data).then(function () {
      form.hidden = true;
      $("#rsvpDone").hidden = false;
      $("#rsvpDone").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    }).catch(function (err) {
      console.error(err);
      errEl.textContent = t("rsvp.errSend");
    }).then(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = t("rsvp.submit");
    });
  });

  function send(data) {
    if (!C.rsvpEndpoint) {
      console.info("[RSVP demo mode] rsvpEndpoint が未設定のため送信していません", data);
      return new Promise(function (r) { setTimeout(r, 700); });
    }
    // text/plain で送ると CORS のプリフライトが発生せず、Apps Script でも受け取れる
    return fetch(C.rsvpEndpoint, { method: "POST", body: JSON.stringify(data) })
      .then(function (res) { return res.json(); })
      .then(function (json) { if (!json.ok) throw new Error(json.error || "failed"); });
  }

  // ---------- スクロールで表示 ----------
  function setupReveal() {
    var items = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    items.forEach(function (el) { io.observe(el); });
  }

  // ---------- 花びら ----------
  (function petals() {
    if (reduceMotion) return;
    var canvas = $("#petals");
    var ctx = canvas.getContext("2d");
    var colors = ["#f7c6d6", "#f3b3c8", "#e2d0f5", "#d9c3f0", "#fde3ec"];
    var list = [], w, h, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = innerWidth * dpr;
      h = canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
    }
    function make(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -20 * dpr,
        r: (5 + Math.random() * 6) * dpr,
        vy: (0.35 + Math.random() * 0.6) * dpr,
        vx: (Math.random() - 0.3) * 0.5 * dpr,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.03,
        sway: Math.random() * Math.PI * 2,
        c: colors[(Math.random() * colors.length) | 0]
      };
    }
    function draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, 0.6 + 0.4 * Math.sin(p.sway));
      ctx.fillStyle = p.c;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.moveTo(0, p.r);
      ctx.bezierCurveTo(-p.r, p.r * 0.2, -p.r * 0.7, -p.r, 0, -p.r * 0.6);
      ctx.bezierCurveTo(p.r * 0.7, -p.r, p.r, p.r * 0.2, 0, p.r);
      ctx.fill();
      ctx.restore();
    }
    function loop() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        p.sway += 0.02;
        p.x += p.vx + Math.sin(p.sway) * 0.4 * dpr;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > h + 20 * dpr || p.x > w + 30 * dpr || p.x < -30 * dpr) list[i] = make(false);
        draw(p);
      }
      requestAnimationFrame(loop);
    }
    resize();
    addEventListener("resize", resize);
    var count = innerWidth < 600 ? 16 : 26;
    for (var i = 0; i < count; i++) list.push(make(true));
    loop();
  })();

  // ---------- 起動 ----------
  applyLang();

  // 同じセッション内で認証済みなら合言葉と封筒を飛ばす
  var saved = storedKey();
  if (saved) {
    sha256Hex(saved).then(function (hash) {
      if (hash === C.passphraseHash) {
        gate.hidden = true;
        main.hidden = false;
        onMainShown();
      }
    });
  }
})();
