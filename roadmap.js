/*
  Vidya VG portfolio — interactive career roadmap (winding road with pins).
  Edit STOPS to change the road. Each stop becomes a pin; the last one is the goal.
  Wide screens get a horizontal road; narrow screens get a vertical one.
*/
(function () {
  'use strict';

  var STOPS = [
    {
      type: 'education', when: '2006 – 2014', label: 'Degrees & diploma',
      title: 'Education foundations', org: 'Kerala, India',
      points: [
        'BSc Zoology, University of Kerala: First Class with Distinction (2006)',
        'PGDCA, Government Polytechnic College, Cherthala: Distinction (2008)',
        'BLISc, Library & Information Science, Mahatma Gandhi University (2014)'
      ]
    },
    {
      type: 'work', when: '2014 – 2023', label: 'Public-sector data',
      title: 'Nine years of public-sector data', org: 'Government of Kerala · MGNREGS Pathanapuram Block',
      points: [
        "Maintained worker, attendance and wage records for India's largest public employment programme.",
        'Reconciled work-days, wage payments and expenditure accounts.',
        'Prepared monthly progress reports and performance indicators for block officials.'
      ]
    },
    {
      type: 'milestone', when: '2023', label: 'Moved to Scotland',
      title: 'A new start in Scotland', org: 'Winchburgh, West Lothian',
      points: ['Started building UK experience through volunteering and professional analytics qualifications.']
    },
    {
      type: 'volunteering', when: '2023 – 2025', label: 'UK volunteering',
      title: 'UK volunteering', org: 'British Red Cross · Scottish Tech Army',
      points: [
        'Scottish Tech Army: logged and analysed 30+ defects in Jira and Trello within Agile teams improving digital services for charities.',
        'British Red Cross, Linlithgow: kept stock records up to date and served customers.'
      ]
    },
    {
      type: 'work', when: 'Aug 2026 – now', label: 'ESG data analytics',
      title: 'Sustainability Analyst Intern', org: 'Klimado GmbH · Frankfurt (remote)',
      points: [
        'Validated a 3,482-record supplier dataset, finding 60 duplicate companies and 10 incomplete records.',
        'Built Python validation workflows and integrated the Companies House API.',
        'Automated ESG data collection across more than 100 companies.'
      ]
    },
    {
      type: 'certification', when: '2026', label: 'Certified analyst',
      title: 'Professionally certified', org: 'CompTIA · IBM · Microsoft · BCS',
      points: [
        'CompTIA Data+ (DA0-002), September 2026',
        'IBM Data Analyst Professional Certificate',
        'Power BI Professional Certificate',
        'BCS Foundation Certificate in Business Analysis (73%)'
      ]
    },
    {
      type: 'goal', when: 'Next stop', label: 'Data analyst role in Scotland',
      title: 'Next stop: a data analyst role in Scotland', org: 'Data, reporting and planning analyst roles',
      points: [
        'Full UK right to work, with no sponsorship required.',
        'Based in Winchburgh, West Lothian; open to on-site, hybrid and remote roles around Edinburgh.'
      ],
      cta: { text: 'Get in touch', href: '#contact' }
    }
  ];

  var COLORS = {
    education: '#1d4ed8', work: '#0f766e', milestone: '#4b5563',
    volunteering: '#b45309', certification: '#6d28d9', goal: '#c2410c'
  };
  var TYPE_LABEL = {
    education: 'Education', work: 'Work', milestone: 'Milestone',
    volunteering: 'Volunteering', certification: 'Certification', goal: 'Goal'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function wrap(text, max) {
    var words = text.split(' '), lines = [''];
    words.forEach(function (w) {
      var cur = lines[lines.length - 1];
      if (cur && (cur + ' ' + w).length > max) lines.push(w);
      else lines[lines.length - 1] = cur ? cur + ' ' + w : w;
    });
    return lines.slice(0, 2);
  }

  // Smooth road through points, with tangents along the main axis so each pin
  // sits on a bend. axis 'x' = horizontal road, 'y' = vertical road.
  function roadPath(pts, axis) {
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      var c1, c2;
      if (axis === 'x') {
        var dx = (b[0] - a[0]) / 2;
        c1 = [a[0] + dx, a[1]]; c2 = [b[0] - dx, b[1]];
      } else {
        var dy = (b[1] - a[1]) / 2;
        c1 = [a[0], a[1] + dy]; c2 = [b[0], b[1] - dy];
      }
      d += ' C' + c1[0] + ',' + c1[1] + ' ' + c2[0] + ',' + c2[1] + ' ' + b[0] + ',' + b[1];
    }
    return d;
  }

  function layout(wide) {
    var n = STOPS.length, pins = [], lead, tail, W, H, labels = [];
    if (wide) {
      W = 1000; H = 440;
      for (var i = 0; i < n; i++) {
        var top = i % 2 === 1;
        var x = 80 + i * (840 / (n - 1)), y = top ? 175 : 315;
        pins.push([x, y]);
        labels.push({ x: x, anchor: 'middle', top: top, y: top ? 58 : 370, max: 18 });
      }
      lead = [-60, 175]; tail = [1060, n % 2 ? 175 : 315];
      return { W: W, H: H, pins: pins, lead: lead, tail: tail, axis: 'x', labels: labels, road: 36 };
    }
    W = 360; H = 60 + n * 100;
    for (var j = 0; j < n; j++) {
      var px = j % 2 ? 104 : 56, py = 64 + j * 100;
      pins.push([px, py]);
      labels.push({ x: 150, anchor: 'start', top: false, y: py - 22, max: 24 });
    }
    lead = [80, 4]; tail = [80, H - 4];
    return { W: W, H: H, pins: pins, lead: lead, tail: tail, axis: 'y', labels: labels, road: 30 };
  }

  function pinShape(color, active) {
    var s = active ? 1.18 : 1;
    return '<g transform="scale(' + s + ')">' +
      '<path d="M0,0 C-5,-9 -15,-18 -15,-29 A15,15 0 1,1 15,-29 C15,-18 5,-9 0,0 Z" fill="' + color + '" stroke="#fff" stroke-width="2.5"/>' +
      '<circle cx="0" cy="-29" r="6" fill="#fff"/></g>';
  }

  function buildSvg(L, active, animate) {
    var all = [L.lead].concat(L.pins, [L.tail]);
    var last = L.pins.length - 1;
    var past = roadPath(all.slice(0, last + 1), L.axis);      // lead … second-to-last pin
    var future = roadPath(all.slice(last, all.length), L.axis); // second-to-last pin … tail
    var reveal = '';
    if (animate) {
      reveal = L.axis === 'x'
        ? '<clipPath id="rmReveal"><rect x="-80" y="-20" width="0" height="' + (L.H + 40) + '"><animate attributeName="width" from="0" to="' + (L.W + 160) + '" dur="1.4s" fill="freeze"/></rect></clipPath>'
        : '<clipPath id="rmReveal"><rect x="-20" y="-80" width="' + (L.W + 40) + '" height="0"><animate attributeName="height" from="0" to="' + (L.H + 160) + '" dur="1.4s" fill="freeze"/></rect></clipPath>';
    }
    var clip = animate ? ' clip-path="url(#rmReveal)"' : '';
    var road = function (d, ahead) {
      return '<path d="' + d + '" fill="none" stroke="rgba(15,30,25,0.12)" stroke-width="' + (L.road + 10) + '" stroke-linecap="round" transform="translate(0,5)"/>' +
        '<path d="' + d + '" fill="none" stroke="' + (ahead ? '#9aa6a1' : '#2e3436') + '" stroke-width="' + L.road + '" stroke-linecap="round"/>' +
        '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="12 12" stroke-linecap="round" opacity="' + (ahead ? 0.9 : 0.85) + '"/>';
    };

    var pins = L.pins.map(function (p, i) {
      var s = STOPS[i], c = COLORS[s.type], lab = L.labels[i], on = i === active;
      var lines = wrap(s.label, lab.max);
      var ty = lab.y;
      var text =
        '<text x="' + lab.x + '" y="' + ty + '" text-anchor="' + lab.anchor + '" class="rm-when" fill="' + c + '">' + esc(s.when) + '</text>' +
        lines.map(function (ln, k) {
          return '<text x="' + lab.x + '" y="' + (ty + 19 + k * 18) + '" text-anchor="' + lab.anchor + '" class="rm-label">' + esc(ln) + '</text>';
        }).join('');
      var leader = L.axis === 'x'
        ? '<line x1="' + p[0] + '" y1="' + (lab.top ? ty + 19 + lines.length * 18 - 6 : p[1] + 26) + '" x2="' + p[0] + '" y2="' + (lab.top ? p[1] - 52 : ty - 18) + '" stroke="' + c + '" stroke-width="1.5" stroke-dasharray="3 4"/>'
        : '';
      return '<g class="rm-stop' + (on ? ' is-active' : '') + '" data-i="' + i + '" tabindex="0" role="button" aria-pressed="' + on + '" ' +
        'aria-label="' + esc(s.when + ': ' + s.title) + '" style="--rm:' + c + ';animation-delay:' + (animate ? 0.25 + i * 0.15 : 0) + 's">' +
        leader + text +
        '<g transform="translate(' + p[0] + ',' + p[1] + ')">' +
        (on ? '<circle class="rm-ring" r="23" cy="-34" fill="none" stroke="' + c + '" stroke-width="3"/>' : '') +
        pinShape(c, on) +
        (s.type === 'goal' ? '<path d="M-4,-36 v-26 l18,6 -18,6" fill="#fff" stroke="' + c + '" stroke-width="2" transform="translate(22,6)"/>' : '') +
        '</g></g>';
    }).join('');

    return '<svg class="rm-svg" viewBox="0 0 ' + L.W + ' ' + L.H + '" role="group" aria-label="Career roadmap">' +
      '<defs>' + reveal + '</defs>' +
      '<g' + clip + '>' + road(past, false) + road(future, true) + '</g>' +
      pins + '</svg>';
  }

  function panel(i) {
    var s = STOPS[i], c = COLORS[s.type];
    return '<div class="rm-panel-inner" style="--rm:' + c + '">' +
      '<p class="rm-meta"><span class="rm-badge">' + esc(TYPE_LABEL[s.type]) + '</span>' + esc(s.when) + '</p>' +
      '<h3>' + esc(s.title) + '</h3>' +
      '<p class="rm-org">' + esc(s.org) + '</p>' +
      '<ul>' + s.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
      '<div class="rm-nav">' +
      '<button type="button" class="button" data-step="-1"' + (i === 0 ? ' disabled' : '') + '>&larr; Previous</button>' +
      '<span class="rm-count">' + (i + 1) + ' of ' + STOPS.length + '</span>' +
      '<button type="button" class="button" data-step="1"' + (i === STOPS.length - 1 ? ' disabled' : '') + '>Next &rarr;</button>' +
      (s.cta ? '<a class="button primary" href="' + esc(s.cta.href) + '">' + esc(s.cta.text) + '</a>' : '<a class="rm-more" href="#journey">Full timeline</a>') +
      '</div></div>';
  }

  if (typeof window === 'undefined') {
    module.exports = { STOPS: STOPS, layout: layout, buildSvg: buildSvg, panel: panel, wrap: wrap };
    return;
  }

  var state = { active: 4, wide: null, drawn: false };
  var $ = function (id) { return document.getElementById(id); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render(focusIndex) {
    var box = $('rmRoad');
    var wide = box.clientWidth >= 640;
    state.wide = wide;
    var animate = !state.drawn && !reduceMotion;
    box.innerHTML = buildSvg(layout(wide), state.active, animate);
    box.classList.toggle('rm-animate', animate);
    state.drawn = true;
    $('rmPanel').innerHTML = panel(state.active);
    if (focusIndex != null) {
      var el = box.querySelector('.rm-stop[data-i="' + focusIndex + '"]');
      if (el) el.focus();
    }
  }

  function select(i, focus) {
    if (i < 0 || i >= STOPS.length) return;
    state.active = i;
    render(focus ? i : null);
    if (!state.wide && !focus) {
      var p = $('rmPanel');
      if (p.scrollIntoView) p.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  function init() {
    var box = $('rmRoad');
    if (!box) return;
    box.addEventListener('click', function (e) {
      var g = e.target.closest('.rm-stop');
      if (g) select(+g.getAttribute('data-i'), false);
    });
    box.addEventListener('keydown', function (e) {
      var g = e.target.closest('.rm-stop');
      if (!g) return;
      var i = +g.getAttribute('data-i');
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(i, true); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); select(i + 1, true); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); select(i - 1, true); }
    });
    $('rmPanel').addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]');
      if (b) select(state.active + (+b.getAttribute('data-step')), false);
    });
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { if ((box.clientWidth >= 640) !== state.wide) render(); }, 150);
    });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
