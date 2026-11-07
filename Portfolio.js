/*
  Vidya VG portfolio — project dashboard, live GitHub explorer and videos.
  The page shows a saved snapshot instantly, then refreshes from GitHub.
  Edit the four settings below; nothing else needs changing.
*/
(function () {
  'use strict';

  // ---------- SETTINGS ----------

  var GITHUB_USER = 'VidyaVGeetha';

  // Repositories that should never appear on the page.
  var HIDE = [
    'VidyaVGeetha.github.io',
    'Aice-wordcloud-text-visualization',
    'IMIGRATION_APP'
  ];

  // Shown first, with a "Featured" badge.
  var FEATURED = [
    'website-traffic-forecasting-powerbi',
    'vehicle-co2-emissions-root-cause-analysis-powerbi',
    'nhs-healthcare-analytics-powerbi',
    'NHS_Prescription_Data_Analysis',
    'scotland-uk-airport-recovery-dashboard',
    'powerbi-performance-optimization-adventure-works'
  ];

  // Project demo videos. The section stays hidden until at least one is added.
  // YouTube:   { title: 'NHS dashboard demo', embed: 'https://www.youtube-nocookie.com/embed/VIDEO_ID', repo: 'nhs-healthcare-analytics-powerbi' }
  // LinkedIn:  { title: 'Wildfire dashboard demo', embed: 'https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:1234567890' }
  // Own file:  { title: 'Airport dashboard demo', file: 'assets/videos/airport-dashboard.mp4' }
  var VIDEOS = [];

  // ---------- SKILL RULES ----------

  var SKILLS = [
    { name: 'Power BI', re: /power\s?bi|\bdax\b|power query|adventure\s?works/i },
    { name: 'Python', re: /python|pandas|numpy|scikit|plotly|\bdash\b|streamlit|seaborn|matplotlib|folium|pywaffle|beautifulsoup/i, langs: ['Python', 'Jupyter Notebook'] },
    { name: 'SQL & Databases', re: /\bsql\b|sqlite|postgres|database|ms access|microsoft access|primary key|star schema/i },
    { name: 'Dashboards', re: /dashboard|streamlit|\bdash\b|cognos/i },
    { name: 'Data Cleaning & Quality', re: /clean|missing|duplicate|imputation|profil|validat|outlier|normali|wrangl|\betl\b|transformation/i },
    { name: 'Data Visualisation', re: /visuali|chart|plots?\b|treemap|waffle|word\s?cloud|mapping|folium|seaborn/i },
    { name: 'Forecasting & ML', re: /forecast|regression|predict|machine learning|scikit|time series|churn|cluster/i },
    { name: 'APIs & Web Scraping', re: /\bapis?\b|scrap|requests|beautifulsoup|json/i },
    { name: 'Environment & ESG', re: /co2|emission|sustainab|\besg\b|wildfire|net zero/i },
    { name: 'Health & Public Data', re: /\bnhs\b|health|prescription|public sector|immigration|crime|airport/i },
    { name: 'IBM Cognos', re: /cognos/i },
    { name: 'Excel', re: /excel/i }
  ];

  // ---------- SAVED SNAPSHOT (used until GitHub responds, or if it can't) ----------
  // [name, description, language, last updated]
  var SNAPSHOT = [
    ['customers-employee-relationships', 'Microsoft Access database lab: table creation, primary keys and one-to-many relationships with referential integrity.', '', '2026-06-23'],
    ['Facebook-Performance-Analysis', 'Facebook performance dashboard.', '', '2026-06-17'],
    ['nhs-healthcare-analytics-powerbi', 'NHS healthcare analytics in Power BI: admissions trends, department analysis and time intelligence (YTD, YoY).', '', '2026-06-17'],
    ['python-powerbi-sales-analytics', 'Python-powered sales analytics in Power BI using pandas and matplotlib custom visuals.', '', '2026-05-18'],
    ['adventure-works-sales-customer-analytics-dashboard', 'Power BI executive dashboard: sales trends, customer distribution, payment methods and product categories.', '', '2026-05-08'],
    ['vehicle-co2-emissions-root-cause-analysis-powerbi', 'Root-cause analysis of vehicle CO2 emissions with Power BI Key Influencers and Decomposition Tree.', '', '2026-05-06'],
    ['website-traffic-forecasting-powerbi', 'Power BI analysis of website traffic trends with time-series forecasting of future visits.', '', '2026-05-01'],
    ['powerbi-sales-customer-insights', 'Power BI dashboard of sales, customer demographics and regional patterns using Top N, binning and clustering.', '', '2026-04-30'],
    ['powerbi-performance-optimization-adventure-works', 'Found and fixed Power BI performance bottlenecks with Performance Analyzer and efficient data modelling.', '', '2026-04-28'],
    ['powerbi-sales-marketing-dashboard', 'Power BI dashboard of sales performance, regional trends and marketing effectiveness.', '', '2026-04-14'],
    ['powerbi-sales-performance-customer-insights-dashboard', 'Interactive Power BI report on sales, customer behaviour and order trends using DAX.', '', '2026-04-14'],
    ['powerbi-sales-aggregation-performanceOptimization', 'Power BI performance optimisation with aggregated tables built in Power Query.', '', '2026-03-31'],
    ['powerbi-role-playing-dimension-sales-analysis', 'Role-playing dimensions and USERELATIONSHIP in Power BI to analyse sales by shipping date.', '', '2026-03-18'],
    ['powerbi-sales-running-total-analysis', 'AdventureWorks sales analysis with DAX running totals and revenue measures.', '', '2026-03-15'],
    ['powerbi-quarterly-sales-analysis', 'Power BI data modelling and DAX calculated columns for quarterly sales patterns.', '', '2026-03-13'],
    ['powerbi-dax-customer-churn-risk-analysis', 'Customer churn risk detection with Power BI DAX logic, data validation and segmentation.', '', '2026-03-12'],
    ['powerbi-adventureworks-star-schema-model', 'Star schema data model in Power BI with relationship configuration.', '', '2026-03-10'],
    ['powerbi-etl-sales-data-transformation-adventureworks', 'End-to-end Power Query ETL: clean, transform, append and merge sales sources with data profiling.', '', '2026-03-06'],
    ['powerbi-sales-data-profiling', 'Data profiling and validation in Power Query, including locale-based currency transformation.', '', '2026-03-05'],
    ['powerbi-sales-product-merge-analysis', 'Power Query merge (left outer join) to enrich sales data with product attributes.', '', '2026-03-02'],
    ['powerbi-sales-data-consolidation', 'Sales data consolidation with Power Query append after an acquisition scenario.', '', '2026-02-27'],
    ['powerbi-product-color-analysis', 'Pivot and unpivot transformations in Power Query for a product colour dashboard.', '', '2026-02-27'],
    ['PowerBI_sales_data_transformation', 'Power Query data cleaning: missing values, data types and standardised categories.', '', '2026-02-26'],
    ['PowerBI-AdventureWorks-Sales-Dashboard', 'Interactive Power BI sales dashboard: product categories, order totals and revenue.', '', '2026-02-19'],
    ['IBM-Cognos-Survey-Analytics-Dashboard', 'Survey data cleaned in Python and visualised in multi-tab IBM Cognos dashboards.', 'Jupyter Notebook', '2026-01-24'],
    ['ibm-cognos-sales-dashboard', 'Sales performance dashboard in IBM Cognos Analytics.', '', '2026-01-21'],
    ['Data-Visualization---Career-and-Technology-Trends-in-Developer-Survey', 'Visualising career, compensation and technology trends in developer survey data.', 'Jupyter Notebook', '2026-01-17'],
    ['global-salary-analysis-outlier-detection', 'EDA of developer salaries with cleaning, missing values and IQR outlier detection.', 'Jupyter Notebook', '2026-01-13'],
    ['stackdev-analytics', 'Cleaning, transforming and analysing a large developer survey dataset.', 'Jupyter Notebook', '2026-01-12'],
    ['stackoverflow-survey-analysis-project', 'Data cleaning, EDA and insights from a developer survey.', 'Jupyter Notebook', '2026-01-06'],
    ['survey-data-cleaning-and-feature-engineering', 'Data wrangling and feature engineering on developer survey data.', 'Jupyter Notebook', '2026-01-04'],
    ['stackoverflow-survey-data-cleaning-normalization', 'Duplicate removal, missing-value imputation and normalisation of survey data.', 'Jupyter Notebook', '2026-01-02'],
    ['Stack-Overflow-Survey-Data-Cleaning-Duplicates-Missing-Values-Handling', 'Detecting duplicates and imputing missing values in survey data.', 'Jupyter Notebook', '2026-01-01'],
    ['Stack-Overflow-Survey-Missing-Values-Analysis-Employment-Imputation', 'Missing-value detection and mode imputation for employment data.', 'Jupyter Notebook', '2026-01-01'],
    ['survey-data-cleaning-and-analysis', 'Duplicate removal, missing values and normalised salary analysis.', 'Jupyter Notebook', '2025-12-31'],
    ['survey-duplicate-detection-and-data-cleaning-python', 'Duplicate detection and data cleaning case study with Python and Pandas.', 'Jupyter Notebook', '2025-12-31'],
    ['programming-language-salary-analysis-web-scraping', 'Scraping and analysing programming language salary data with Requests and BeautifulSoup.', 'Jupyter Notebook', '2025-12-29'],
    ['web-data-extraction-links-images-tables', 'Web scraping links, images and tables with Python, Requests and BeautifulSoup.', 'Jupyter Notebook', '2025-12-28'],
    ['job-market-analysis-using-apis-python', 'Job market analysis with a Flask API, Python and Pandas, exported to an Excel report.', 'Jupyter Notebook', '2025-12-28'],
    ['python-api-requests-lab', 'HTTP GET and POST requests in Python with headers, parameters and JSON.', 'Jupyter Notebook', '2025-12-27'],
    ['astronaut-api-data-exploration', 'Retrieving and processing JSON data from a public API.', 'Jupyter Notebook', '2025-12-27'],
    ['automobile-sales-analysis-dashboard', 'Interactive Python Dash and Plotly dashboard of automobile sales in recession periods.', 'Python', '2025-12-22'],
    ['NHS_Prescription_Data_Analysis', 'NHS Scotland prescription data from the Open Data API, with an interactive Streamlit dashboard and Health Board map.', 'Jupyter Notebook', '2025-12-22'],
    ['Tesla-GameStop-Stock-Analysis', 'Stock and revenue data via yfinance and web scraping, visualised with Plotly.', 'Python', '2025-12-22'],
    ['flight-delay-dashboard', 'Python Dash and Plotly dashboard of airline delay causes by year.', 'Python', '2025-12-22'],
    ['recession-impact-on-automobile-sales', 'EDA of recession impacts on automobile sales with Pandas, Seaborn and Folium.', 'Jupyter Notebook', '2025-12-21'],
    ['australia-wildfire-dashboard-analysis', 'Interactive Dash and Plotly dashboard of Australian wildfire activity.', 'Python', '2025-12-15'],
    ['australia-wildfire-analysis-python', 'EDA and visualisation of historical Australian wildfires.', 'Jupyter Notebook', '2025-12-13'],
    ['scotland-uk-airport-recovery-dashboard', 'Streamlit dashboard of how Scottish airports recovered from COVID-19 compared with major UK hubs.', 'Jupyter Notebook', '2025-12-05'],
    ['Plotly-Visualizations-Beginners', 'Interactive Plotly charts: scatter, line, histogram, bubble, pie and sunburst.', 'Jupyter Notebook', '2025-11-29'],
    ['treemap-visualization-sales', 'Treemap visualisation of hierarchical sales data with Plotly Express.', 'Jupyter Notebook', '2025-11-18'],
    ['san-francisco-crime-mapping-folium', 'Geospatial mapping of San Francisco incident data with Folium.', 'Jupyter Notebook', '2025-11-18'],
    ['uk-used-car-price-regression', 'EDA and regression modelling of UK used car prices.', 'Jupyter Notebook', '2025-11-13'],
    ['seaborn-categorical-plots-canada-immigration', 'Categorical data visualisation with Seaborn on Canadian immigration data.', 'Jupyter Notebook', '2025-11-12'],
    ['WordCloud-Analysis-Canada_Immigration', 'Word cloud of immigration to Canada by country, 1980–2013.', 'Jupyter Notebook', '2025-11-11'],
    ['Alice-wordcloud-text-visualization', 'Word cloud text visualisation of Alice\u2019s Adventures in Wonderland.', '', '2025-11-11'],
    ['Waffle-Chart-Visualization-in-Python-Using-Matplotlib-and-PyWaffle', 'Waffle charts of immigration totals with Matplotlib and PyWaffle.', 'Jupyter Notebook', '2025-11-10']
  ];

  // ---------- HELPERS ----------

  var ACRONYMS = {
    nhs: 'NHS', uk: 'UK', us: 'US', api: 'API', apis: 'APIs', co2: 'CO2', sql: 'SQL', ibm: 'IBM',
    eda: 'EDA', etl: 'ETL', dax: 'DAX', kpi: 'KPI', esg: 'ESG', ai: 'AI', ml: 'ML', yoy: 'YoY', ytd: 'YTD'
  };

  function prettify(name) {
    return name
      .replace(/powerbi/gi, 'Power BI ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(function (w, i) {
        var lower = w.toLowerCase();
        if (ACRONYMS[lower]) return ACRONYMS[lower];
        if (i > 0 && /^(and|in|of|on|for|the|to|by|with|vs|a)$/.test(lower)) return lower;
        if (w === 'BI') return w;
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(' ');
  }

  function classify(repo) {
    var text = [repo.name.replace(/[-_]/g, ' '), repo.description, (repo.topics || []).join(' ')].join(' ');
    var found = [];
    SKILLS.forEach(function (s) {
      if (s.re.test(text) || (s.langs && s.langs.indexOf(repo.language) !== -1)) found.push(s.name);
    });
    if (!found.length) found.push('Data Visualisation');
    return found;
  }

  function normalise(r) {
    var repo = {
      name: r.name,
      description: r.description || '',
      language: r.language || '',
      topics: r.topics || [],
      updated: r.updated,
      url: 'https://github.com/' + GITHUB_USER + '/' + r.name
    };
    repo.title = prettify(repo.name);
    repo.skills = classify(repo);
    repo.featured = FEATURED.indexOf(repo.name) !== -1;
    return repo;
  }

  function fromSnapshot() {
    return SNAPSHOT.map(function (s) {
      return normalise({ name: s[0], description: s[1], language: s[2], updated: s[3] });
    });
  }

  function keep(repos) {
    return repos.filter(function (r) { return HIDE.indexOf(r.name) === -1; });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function fmtDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function ago(iso) {
    var days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (isNaN(days)) return '';
    if (days <= 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 31) return days + ' days ago';
    var months = Math.floor(days / 30.4);
    if (months < 12) return months + (months === 1 ? ' month ago' : ' months ago');
    var years = Math.floor(months / 12);
    return years + (years === 1 ? ' year ago' : ' years ago');
  }

  // Node test hook: expose pure functions without touching the DOM.
  if (typeof window === 'undefined') {
    module.exports = { prettify: prettify, classify: classify, fromSnapshot: fromSnapshot, keep: keep, ago: ago };
    return;
  }

  // ---------- STATE ----------

  var state = { repos: [], skill: 'All', query: '', sort: 'latest', limit: 12, source: 'snapshot', syncedAt: null };
  var $ = function (id) { return document.getElementById(id); };

  // ---------- RENDER: DASHBOARD ----------

  function skillCounts(repos) {
    var counts = {};
    repos.forEach(function (r) { r.skills.forEach(function (s) { counts[s] = (counts[s] || 0) + 1; }); });
    return SKILLS.map(function (s) { return { name: s.name, count: counts[s.name] || 0 }; })
      .filter(function (s) { return s.count > 0; })
      .sort(function (a, b) { return b.count - a.count; });
  }

  function renderDashboard() {
    var repos = state.repos;
    var counts = skillCounts(repos);
    var count = function (name) {
      var c = counts.filter(function (x) { return x.name === name; })[0];
      return c ? c.count : 0;
    };
    var latest = repos.slice().sort(function (a, b) { return b.updated.localeCompare(a.updated); })[0];

    $('pfKpis').innerHTML = [
      [repos.length, 'public projects'],
      [counts.length, 'skill areas covered'],
      [count('Power BI'), 'Power BI projects'],
      [count('Python'), 'Python projects'],
      [latest ? ago(latest.updated) : '–', 'last project update']
    ].map(function (k) {
      return '<div class="pf-kpi"><strong>' + esc(k[0]) + '</strong><span>' + esc(k[1]) + '</span></div>';
    }).join('');

    var max = counts.length ? counts[0].count : 1;
    $('pfSkillBars').innerHTML = counts.map(function (s) {
      var pct = Math.max(4, Math.round((s.count / max) * 100));
      return '<button type="button" class="pf-bar" data-skill="' + esc(s.name) + '" aria-label="Show ' + esc(s.count) + ' ' + esc(s.name) + ' projects">' +
        '<span class="pf-bar-label">' + esc(s.name) + '</span>' +
        '<span class="pf-bar-track"><span class="pf-bar-fill" style="width:' + pct + '%"></span></span>' +
        '<span class="pf-bar-count">' + s.count + '</span></button>';
    }).join('');

    var recent = repos.slice().sort(function (a, b) { return b.updated.localeCompare(a.updated); }).slice(0, 5);
    $('pfRecent').innerHTML = recent.map(function (r) {
      return '<li><a href="' + esc(r.url) + '" target="_blank" rel="noreferrer">' + esc(r.title) + '</a>' +
        '<span>' + esc(ago(r.updated)) + '</span></li>';
    }).join('');
  }

  // ---------- RENDER: EXPLORER ----------

  function renderChips() {
    var counts = skillCounts(state.repos);
    var chips = [{ name: 'All', count: state.repos.length }].concat(counts);
    $('pfChips').innerHTML = chips.map(function (c) {
      var on = c.name === state.skill;
      return '<button type="button" class="pf-chip" data-skill="' + esc(c.name) + '" aria-pressed="' + on + '">' +
        esc(c.name) + ' <span>' + c.count + '</span></button>';
    }).join('');
  }

  function filtered() {
    var q = state.query.toLowerCase();
    var list = state.repos.filter(function (r) {
      if (state.skill !== 'All' && r.skills.indexOf(state.skill) === -1) return false;
      if (!q) return true;
      return (r.title + ' ' + r.description + ' ' + r.skills.join(' ') + ' ' + r.language).toLowerCase().indexOf(q) !== -1;
    });
    list.sort(function (a, b) {
      if (state.sort === 'name') return a.title.localeCompare(b.title);
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.updated.localeCompare(a.updated);
    });
    return list;
  }

  function renderExplorer() {
    renderChips();
    var list = filtered();
    var shown = list.slice(0, state.limit);
    $('pfCount').textContent = list.length + (list.length === 1 ? ' project' : ' projects') +
      (state.skill !== 'All' ? ' · ' + state.skill : '');

    $('pfGrid').innerHTML = shown.length ? shown.map(function (r) {
      return '<article class="dashboard-card pf-card">' +
        (r.featured ? '<span class="pf-badge">Featured</span>' : '') +
        '<h3>' + esc(r.title) + '</h3>' +
        (r.description ? '<p>' + esc(r.description) + '</p>' : '') +
        '<div class="pf-tags">' + r.skills.map(function (s) { return '<span class="pf-tag">' + esc(s) + '</span>'; }).join('') + '</div>' +
        '<p class="pf-meta">Updated ' + esc(fmtDate(r.updated)) + '</p>' +
        '<a href="' + esc(r.url) + '" target="_blank" rel="noreferrer">View on GitHub</a>' +
        '</article>';
    }).join('') : '<p class="pf-empty">No projects match that search.</p>';

    var more = $('pfMore');
    more.hidden = list.length <= state.limit;
    more.textContent = 'Show ' + Math.min(12, list.length - state.limit) + ' more';
  }

  function renderStatus(text) {
    if (text) { $('pfStatus').textContent = text; return; }
    $('pfStatus').textContent = state.source === 'live'
      ? 'Live from GitHub · checked ' + state.syncedAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : 'Showing saved project list · GitHub is not reachable right now';
  }

  function renderAll() {
    renderDashboard();
    renderExplorer();
    renderStatus();
  }

  // ---------- RENDER: VIDEOS ----------

  function renderVideos() {
    var section = $('videos');
    if (!section || !VIDEOS.length) return;
    $('pfVideos').innerHTML = VIDEOS.map(function (v) {
      var media = v.file
        ? '<video controls preload="metadata" src="' + esc(v.file) + '"></video>'
        : '<iframe src="' + esc(v.embed) + '" title="' + esc(v.title) + '" loading="lazy" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>';
      var link = v.repo
        ? '<a href="https://github.com/' + GITHUB_USER + '/' + esc(v.repo) + '" target="_blank" rel="noreferrer">View project</a>'
        : '';
      return '<figure class="pf-video">' + media + '<figcaption><strong>' + esc(v.title) + '</strong>' + link + '</figcaption></figure>';
    }).join('');
    section.hidden = false;
    var navLink = $('navVideos');
    if (navLink) navLink.hidden = false;
  }

  // ---------- LIVE GITHUB DATA ----------

  var CACHE_KEY = 'pf-github-repos-v1';
  var CACHE_MINUTES = 30;

  function readCache() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data: data })); } catch (e) { /* storage unavailable */ }
  }

  function fetchPage(page, signal) {
    var url = 'https://api.github.com/users/' + GITHUB_USER + '/repos?per_page=100&sort=pushed&page=' + page;
    return fetch(url, { signal: signal, headers: { Accept: 'application/vnd.github+json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('GitHub ' + res.status);
        return res.json();
      });
  }

  function fetchAll() {
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
    var all = [];
    function next(page) {
      return fetchPage(page, ctrl && ctrl.signal).then(function (items) {
        all = all.concat(items);
        if (items.length === 100 && page < 3) return next(page + 1);
        return all;
      });
    }
    return next(1).then(function (items) {
      clearTimeout(timer);
      return items
        .filter(function (r) { return !r.fork && !r.archived; })
        .map(function (r) {
          return { name: r.name, description: r.description, language: r.language, topics: r.topics, updated: r.pushed_at || r.updated_at };
        });
    }, function (err) { clearTimeout(timer); throw err; });
  }

  function useLive(raw, syncedAt) {
    state.repos = keep(raw.map(normalise));
    state.source = 'live';
    state.syncedAt = syncedAt;
    renderAll();
  }

  function loadLive() {
    var cached = readCache();
    if (cached && Date.now() - cached.t < CACHE_MINUTES * 60000) {
      useLive(cached.data, new Date(cached.t));
      return;
    }
    renderStatus('Checking GitHub for the latest projects…');
    fetchAll().then(function (raw) {
      writeCache(raw);
      useLive(raw, new Date());
    }).catch(function () {
      if (cached) { useLive(cached.data, new Date(cached.t)); return; }
      state.source = 'snapshot';
      renderStatus();
    });
  }

  // ---------- EVENTS ----------

  function selectSkill(skill, scroll) {
    state.skill = skill;
    state.limit = 12;
    renderExplorer();
    if (scroll) $('all-projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function bind() {
    $('pfSkillBars').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-skill]');
      if (btn) selectSkill(btn.getAttribute('data-skill'), true);
    });
    $('pfChips').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-skill]');
      if (btn) selectSkill(btn.getAttribute('data-skill'), false);
    });
    $('pfSearch').addEventListener('input', function (e) {
      state.query = e.target.value.trim();
      state.limit = 12;
      renderExplorer();
    });
    $('pfSort').addEventListener('change', function (e) {
      state.sort = e.target.value;
      renderExplorer();
    });
    $('pfMore').addEventListener('click', function () {
      state.limit += 12;
      renderExplorer();
    });
  }

  function init() {
    if (!$('pfGrid')) return;
    state.repos = keep(fromSnapshot());
    bind();
    renderAll();
    renderVideos();
    loadLive();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();