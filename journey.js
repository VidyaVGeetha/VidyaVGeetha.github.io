/*
  Vidya VG portfolio — interactive career journey and qualifications.
  All content lives in JOURNEY below. Edit it there; the timeline, the
  "at a glance" counters and the qualification cards all update from it.

  Fields:
    type     work | volunteering | certification | education | milestone
    date     text shown on the page ('' = show "Completed" instead)
    sort     YYYY-MM used only for ordering
    title, org, note
    details  bullet points shown when the item is opened
    covers   (certifications / education) what the qualification covers
    skills   short skill tags
    verify   link to a credential page (Credly, Coursera, BCS) — leave '' to hide
    open     true = details open when the page loads
*/
(function () {
  'use strict';

  var JOURNEY = [
    {
      type: 'education', date: '2006', sort: '2006-06',
      title: 'BSc Zoology', org: 'University of Kerala, India', note: 'First Class with Distinction',
      covers: 'Scientific method, field and laboratory recording, and biostatistics: careful observation and measurement.',
      skills: ['Scientific method', 'Biostatistics', 'Accurate recording']
    },
    {
      type: 'education', date: '2008', sort: '2008-06',
      title: 'Postgraduate Diploma in Computer Applications (PGDCA)',
      org: 'Government Polytechnic College, Cherthala · State Board of Technical Education, Kerala', note: 'Distinction',
      covers: 'Computer fundamentals, programming, database management and office applications.',
      skills: ['Programming basics', 'Databases', 'Office software']
    },
    {
      type: 'education', date: '2014', sort: '2014-02',
      title: 'Bachelor of Library & Information Science (BLISc)', org: 'Mahatma Gandhi University, India',
      covers: 'Organising, classifying, cataloguing and retrieving information: the foundations of good data management.',
      skills: ['Information management', 'Classification', 'Information retrieval']
    },
    {
      type: 'work', date: 'Mar 2014 – May 2023', sort: '2014-03', open: true,
      title: 'IT Assistant – Data Analysis & Reporting',
      org: 'Government of Kerala · MGNREGS Pathanapuram Block, India',
      details: [
        "Maintained worker, attendance and wage records for India's largest public employment programme.",
        'Reconciled work-days, wage payments and expenditure accounts, investigating discrepancies and correcting records.',
        'Prepared monthly progress reports and performance indicators for block officials, tracking employment delivered against targets.',
        "Entered and checked data in the scheme's national management information system, meeting monthly reporting deadlines."
      ]
    },
    {
      type: 'milestone', date: '2023', sort: '2023-06',
      title: 'Moved to Scotland', org: 'Winchburgh, West Lothian',
      details: ['Started building UK experience through volunteering and professional analytics qualifications.']
    },
    {
      type: 'volunteering', date: 'Dec 2023 – Sep 2024', sort: '2023-12',
      title: 'Shop Volunteer', org: 'British Red Cross · Linlithgow',
      details: ['Kept stock and replenishment records up to date and served customers in a busy charity shop.']
    },
    {
      type: 'volunteering', date: 'Sep 2024 – Aug 2025', sort: '2024-09',
      title: 'Volunteer QA & Data Analyst', org: 'Scottish Tech Army',
      details: [
        'Logged, prioritised and analysed 30+ defects in Jira and Trello within Agile teams improving digital services for charities.',
        'Analysed user feedback and testing data to inform product improvements.'
      ]
    },
    // The three certificates below have no month yet: add it to `date` and
    // correct `sort` so they sit in the right place on the timeline.
    {
      type: 'certification', date: '', sort: '2026-07',
      title: 'IBM Data Analyst Professional Certificate', org: 'IBM · Coursera',
      covers: 'Excel, SQL, Python (Pandas), data visualisation and dashboards in IBM Cognos Analytics, ending in a capstone project.',
      skills: ['Excel', 'SQL', 'Python', 'IBM Cognos'], verify: ''
    },
    {
      type: 'certification', date: '', sort: '2026-07',
      title: 'Power BI Professional Certificate', org: 'Microsoft · Coursera',
      covers: 'Preparing data with Power Query, building data models, writing DAX measures and designing interactive reports.',
      skills: ['Power BI', 'Power Query', 'DAX', 'Data modelling'], verify: ''
    },
    {
      type: 'certification', date: '', sort: '2026-07', note: 'Passed (73%)',
      title: 'BCS Foundation Certificate in Business Analysis', org: 'BCS, The Chartered Institute for IT',
      covers: 'The business analysis role, stakeholder analysis, investigating and modelling business needs, and defining requirements.',
      skills: ['Requirements', 'Stakeholders', 'Process modelling'], verify: ''
    },
    {
      type: 'work', date: 'Aug 2026 – present', sort: '2026-08', open: true,
      title: 'Sustainability Analyst Intern', org: 'Klimado GmbH · Frankfurt (remote)',
      details: [
        'Validated a 3,482-record supplier dataset, identifying 60 duplicate companies, 10 incomplete records and further inconsistencies for investigation.',
        'Built repeatable Python validation and correction workflows that improved data accuracy and reduced manual checking.',
        'Integrated the Companies House API to verify company information automatically.',
        'Mapped 656 industry records against 975 EU NACE reference codes, resolving 59 duplicate codes and 34 leading-zero discrepancies.',
        'Automated data collection for ESG research across more than 100 companies.'
      ]
    },
    {
      type: 'certification', date: 'Sep 2026', sort: '2026-09',
      title: 'CompTIA Data+ (DA0-002)', org: 'CompTIA',
      covers: 'Data concepts and environments, data acquisition and preparation, analysis, visualisation and reporting, and data governance and quality.',
      skills: ['Data analysis', 'Data quality', 'Governance', 'Reporting'], verify: ''
    }
  ];

  var TYPES = {
    work: { label: 'Work', plural: 'Work' },
    volunteering: { label: 'Volunteering', plural: 'Volunteering' },
    certification: { label: 'Certification', plural: 'Certifications' },
    education: { label: 'Education', plural: 'Education' },
    milestone: { label: 'Milestone', plural: 'Milestones' }
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function count(type) {
    return JOURNEY.filter(function (j) { return j.type === type; }).length;
  }

  if (typeof window === 'undefined') {
    module.exports = { JOURNEY: JOURNEY, count: count };
    return;
  }

  var state = { filter: 'all', newestFirst: true, open: {}, qTab: 'certification', qOpen: {} };
  JOURNEY.forEach(function (j, i) { j.id = 'jr' + i; if (j.open) state.open[j.id] = true; });
  var $ = function (id) { return document.getElementById(id); };

  // ---------- AT A GLANCE ----------

  function renderGlance() {
    var stats = [
      ['work', '9', 'years of public-sector data work'],
      ['volunteering', count('volunteering'), 'UK volunteer roles'],
      ['certification', count('certification'), 'professional certifications'],
      ['education', count('education'), 'degrees & diplomas']
    ];
    $('jrGlance').innerHTML = stats.map(function (s) {
      var on = state.filter === s[0];
      return '<button type="button" class="jr-stat jr-' + s[0] + '" data-filter="' + s[0] + '" aria-pressed="' + on + '">' +
        '<strong>' + esc(s[1]) + '</strong><span>' + esc(s[2]) + '</span></button>';
    }).join('');
  }

  // ---------- FILTERS ----------

  function renderFilters() {
    var opts = [['all', 'All', JOURNEY.length]].concat(
      ['work', 'volunteering', 'certification', 'education'].map(function (t) {
        return [t, TYPES[t].plural, count(t)];
      }));
    $('jrFilters').innerHTML = opts.map(function (o) {
      return '<button type="button" class="pf-chip jr-chip jr-' + o[0] + '" data-filter="' + o[0] + '" aria-pressed="' + (state.filter === o[0]) + '">' +
        '<i aria-hidden="true"></i>' + esc(o[1]) + ' <span>' + o[2] + '</span></button>';
    }).join('');
    $('jrOrder').textContent = state.newestFirst ? 'Newest first' : 'Oldest first';
  }

  // ---------- TIMELINE ----------

  function visible() {
    var list = JOURNEY.filter(function (j) {
      return state.filter === 'all' || j.type === state.filter || (j.type === 'milestone' && state.filter === 'work');
    });
    list.sort(function (a, b) { return state.newestFirst ? b.sort.localeCompare(a.sort) : a.sort.localeCompare(b.sort); });
    return list;
  }

  function itemBody(j) {
    var parts = [];
    if (j.details) parts.push('<ul>' + j.details.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>');
    if (j.covers) parts.push('<p>' + esc(j.covers) + '</p>');
    if (j.skills) parts.push('<div class="pf-tags">' + j.skills.map(function (s) { return '<span class="pf-tag">' + esc(s) + '</span>'; }).join('') + '</div>');
    if (j.verify) parts.push('<a href="' + esc(j.verify) + '" target="_blank" rel="noreferrer">Verify credential</a>');
    return parts.join('');
  }

  function renderTimeline() {
    var list = visible();
    var lastYear = null;
    var html = list.map(function (j) {
      var year = j.sort.slice(0, 4);
      var marker = '';
      if (year !== lastYear) { marker = '<li class="jr-year" aria-hidden="true"><span>' + year + '</span></li>'; lastYear = year; }
      var body = itemBody(j);
      var isOpen = !!state.open[j.id];
      var toggle = body
        ? '<button type="button" class="jr-toggle" data-id="' + j.id + '" aria-expanded="' + isOpen + '" aria-controls="' + j.id + '-body">' +
          (isOpen ? 'Hide details' : 'Show details') + '</button>' +
          '<div class="jr-details" id="' + j.id + '-body"' + (isOpen ? '' : ' hidden') + '>' + body + '</div>'
        : '';
      return marker +
        '<li class="jr-item jr-' + j.type + '">' +
        '<span class="jr-dot" aria-hidden="true"></span>' +
        '<div class="jr-card">' +
        '<p class="jr-meta"><span class="jr-type">' + esc(TYPES[j.type].label) + '</span>' + esc(j.date || 'Completed') + '</p>' +
        '<h3>' + esc(j.title) + '</h3>' +
        '<p class="jr-org">' + esc(j.org) + (j.note ? ' · <strong>' + esc(j.note) + '</strong>' : '') + '</p>' +
        toggle +
        '</div></li>';
    }).join('');
    $('jrList').innerHTML = html;
    var anyClosed = list.some(function (j) { return itemBody(j) && !state.open[j.id]; });
    $('jrExpand').textContent = anyClosed ? 'Expand all' : 'Collapse all';
  }

  function renderJourney() {
    renderGlance();
    renderFilters();
    renderTimeline();
  }

  // ---------- QUALIFICATIONS ----------

  function renderQualifications() {
    var tabs = [['certification', 'Certifications'], ['education', 'Education']];
    $('qTabs').innerHTML = tabs.map(function (t) {
      return '<button type="button" class="pf-chip q-tab" data-tab="' + t[0] + '" aria-pressed="' + (state.qTab === t[0]) + '">' +
        esc(t[1]) + ' <span>' + count(t[0]) + '</span></button>';
    }).join('');

    var list = JOURNEY.filter(function (j) { return j.type === state.qTab; })
      .sort(function (a, b) { return b.sort.localeCompare(a.sort); });

    $('qGrid').innerHTML = list.map(function (j) {
      var isOpen = !!state.qOpen[j.id];
      return '<article class="dashboard-card q-card jr-' + j.type + '">' +
        '<span>' + esc(j.org) + '</span>' +
        '<h3>' + esc(j.title) + '</h3>' +
        '<p class="jr-org">' + esc([j.date || 'Completed', j.note].filter(Boolean).join(' · ')) + '</p>' +
        '<button type="button" class="jr-toggle" data-qid="' + j.id + '" aria-expanded="' + isOpen + '" aria-controls="' + j.id + '-q">' +
        (isOpen ? 'Hide details' : 'What it covers') + '</button>' +
        '<div class="jr-details" id="' + j.id + '-q"' + (isOpen ? '' : ' hidden') + '>' + itemBody({ covers: j.covers, skills: j.skills, verify: j.verify }) + '</div>' +
        '</article>';
    }).join('');
  }

  // ---------- EVENTS ----------

  function setFilter(f) {
    state.filter = state.filter === f && f !== 'all' ? 'all' : f;
    renderJourney();
  }

  function bind() {
    $('jrGlance').addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]');
      if (b) setFilter(b.getAttribute('data-filter'));
    });
    $('jrFilters').addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]');
      if (b) setFilter(b.getAttribute('data-filter'));
    });
    $('jrOrder').addEventListener('click', function () {
      state.newestFirst = !state.newestFirst;
      renderFilters();
      renderTimeline();
    });
    $('jrExpand').addEventListener('click', function () {
      var list = visible().filter(function (j) { return itemBody(j); });
      var anyClosed = list.some(function (j) { return !state.open[j.id]; });
      list.forEach(function (j) { state.open[j.id] = anyClosed; });
      renderTimeline();
    });
    $('jrList').addEventListener('click', function (e) {
      var b = e.target.closest('[data-id]');
      if (!b) return;
      var id = b.getAttribute('data-id');
      state.open[id] = !state.open[id];
      renderTimeline();
    });
    $('qTabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]');
      if (!b) return;
      state.qTab = b.getAttribute('data-tab');
      renderQualifications();
    });
    $('qGrid').addEventListener('click', function (e) {
      var b = e.target.closest('[data-qid]');
      if (!b) return;
      var id = b.getAttribute('data-qid');
      state.qOpen[id] = !state.qOpen[id];
      renderQualifications();
    });
  }

  function init() {
    if (!$('jrList')) return;
    bind();
    renderJourney();
    if ($('qGrid')) renderQualifications();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
