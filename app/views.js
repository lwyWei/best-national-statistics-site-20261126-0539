// Aldermere Statistics — hash router and page renderers.
// One module, one job per page function: each builds its page's HTML from
// ALDERMERE (data.js) and draws its charts with AlderCharts (charts.js).
// Every link in the navigation reaches a page; every control on a page works.

window.AlderViews = (function () {
  var D = window.ALDERMERE;
  var YEARS = D.years;
  var SRC = D.meta.sourceNote;

  var econYearEnd = 2025;   // economy page: year selector state
  var dashMetric = 'gdp';   // dashboard: main chart metric
  var regionSort = { key: 1, dir: -1 }; // regions table: column, direction
  var releaseFilter = 'all';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function fmtInt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function fmt1(n) { return (Math.round(n * 10) / 10).toFixed(1); }
  function fmtMoney(n) { return 'ALC ' + fmtInt(n) + 'bn'; }
  function sourceLine() { return '<p class="source">' + esc(SRC) + ' Updated ' + esc(D.meta.updated) + '.</p>'; }
  function head(title, intro) {
    return '<div class="page-head"><h1>' + esc(title) + '</h1><p>' + esc(intro) + '</p></div>';
  }
  function csvButton(id, label) {
    return '<button class="btn ghost" data-csv="' + id + '">' + esc(label || 'Download CSV') + '</button>';
  }
  function registerCsv(id, filename, header, rows) {
    window.ALDER_CSV = window.ALDER_CSV || {};
    window.ALDER_CSV[id] = { filename: filename, header: header, rows: rows };
  }
  function seriesRows(values, label) {
    return YEARS.map(function (y, i) { return [y, values[i]]; });
  }

  // ---------- shared pieces ----------

  function indicatorCards() {
    return '<div class="cards">' + D.headline.map(function (h) {
      var up = h.change.charAt(0) !== '-';
      return '<a class="card" href="#/' + h.page + '">' +
        '<div class="label">' + esc(h.label) + '</div>' +
        '<div class="value">' + esc(h.value) + '</div>' +
        '<div class="change ' + (up ? 'up' : 'down') + '">' + esc(h.change) + ' vs 2024</div>' +
        '<div class="note">' + esc(h.note) + ' · ' + h.year + '</div></a>';
    }).join('') + '</div>';
  }

  function yearTable(values, fmt, label, highlightYear) {
    var rows = YEARS.map(function (y, i) {
      var cls = y === highlightYear ? ' class="hl"' : '';
      return '<tr' + cls + '><td>' + y + '</td><td>' + fmt(values[i]) + '</td></tr>';
    }).join('');
    return '<div class="table-wrap"><table class="data"><thead><tr><th>Year</th><th>' + esc(label) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }

  function drawAfter(html, drawFns) {
    var view = document.getElementById('view');
    view.innerHTML = html;
    drawFns.forEach(function (fn) { fn(); });
    window.scrollTo(0, 0);
  }

  // ---------- dashboard ----------

  function dashChartData() {
    if (dashMetric === 'pop') return { labels: YEARS, values: D.population.total, fmt: function (v) { return fmt1(v) + 'm'; }, title: 'Population, millions, 2015–2025' };
    if (dashMetric === 'cpi') return { labels: YEARS, values: D.prices.inflation, fmt: function (v) { return fmt1(v) + '%'; }, title: 'Inflation (CPI), annual %, 2015–2025' };
    return { labels: YEARS, values: D.economy.gdpNominal, fmt: function (v) { return 'ALC ' + fmtInt(v) + 'bn'; }, title: 'GDP, ALC billion, current prices, 2015–2025' };
  }

  function renderDashboard() {
    var cd = dashChartData();
    var latest = D.releases.filter(function (r) { return r.status === 'Published'; }).slice(0, 4);
    var html = head('Aldermere in figures', 'The official statistics of Aldermere — population, economy, prices, trade, health, education and the regions — published by the National Statistics Office.') +
      indicatorCards() +
      '<div class="grid2">' +
      '<section class="panel"><h2>' + esc(cd.title) + '</h2>' +
      '<div class="controls" role="group" aria-label="Choose indicator">' +
      '<button class="btn' + (dashMetric === 'gdp' ? '' : ' ghost') + '" data-metric="gdp">GDP</button>' +
      '<button class="btn' + (dashMetric === 'pop' ? '' : ' ghost') + '" data-metric="pop">Population</button>' +
      '<button class="btn' + (dashMetric === 'cpi' ? '' : ' ghost') + '" data-metric="cpi">Inflation</button></div>' +
      '<canvas id="dash-chart" class="chart" height="260"></canvas>' +
      '<p class="chart-note">' + esc(cd.title) + '. ' + esc(SRC) + '</p></section>' +
      '<section class="panel"><h2>Latest releases</h2>' +
      latest.map(function (r) {
        return '<p><span class="pill">' + esc(r.status) + '</span> <a href="#/releases">' + esc(r.title) + '</a><br><span class="updated">' + esc(r.date) + ' · ' + esc(r.time) + '</span></p>';
      }).join('') +
      '<p><a href="#/releases">See the full release calendar →</a></p>' +
      '<h3>At a glance, 2025</h3><div class="kv">' +
      '<div><b>8.42m</b><span>People live in Aldermere</span></div>' +
      '<div><b>ALC 69,700</b><span>GDP per person</span></div>' +
      '<div><b>82.4 years</b><span>Life expectancy at birth</span></div>' +
      '</div></section></div>' +
      '<section class="panel"><h2>Population by year</h2><canvas id="dash-pop" class="chart" height="220"></canvas>' +
      '<p class="chart-note">Mid-year population, millions. ' + esc(SRC) + '</p></section>' +
      sourceLine();
    drawAfter(html, [
      function () { window.AlderCharts.lineChart(document.getElementById('dash-chart'), { labels: cd.labels, values: cd.values, fmt: cd.fmt, height: 260 }); },
      function () { window.AlderCharts.barChart(document.getElementById('dash-pop'), { labels: YEARS, values: D.population.total, fmt: function (v) { return fmt1(v) + 'm'; }, height: 220 }); }
    ]);
    document.querySelectorAll('[data-metric]').forEach(function (b) {
      b.addEventListener('click', function () { dashMetric = b.getAttribute('data-metric'); renderDashboard(); });
    });
  }

  // ---------- population ----------

  function renderPopulation() {
    registerCsv('pop', 'aldermere-population-2015-2025.csv',
      ['Year', 'Population (millions)', 'Births', 'Deaths', 'Net migration'],
      YEARS.map(function (y, i) { return [y, D.population.total[i], D.population.births[i], D.population.deaths[i], D.population.netMigration[i]]; }));
    var html = head('Population', 'How many people live in Aldermere, how the population changes each year, and who they are by age.') +
      '<div class="kv"><div><b>8.42m</b><span>Population, 30 June 2025</span></div>' +
      '<div><b>41.6 years</b><span>Median age, 2025</span></div>' +
      '<div><b>96 / km²</b><span>Population density, 2025</span></div></div>' +
      '<section class="panel"><h2>Population, 2015–2025</h2>' +
      '<canvas id="pop-chart" class="chart" height="260"></canvas>' +
      '<p class="chart-note">Mid-year estimate, millions. ' + esc(SRC) + '</p></section>' +
      '<div class="grid2"><section class="panel"><h2>Age structure, 2025</h2>' +
      '<canvas id="age-chart" class="chart" height="260"></canvas>' +
      '<p class="chart-note">Share of the population by age group, %. ' + esc(SRC) + '</p></section>' +
      '<section class="panel"><h2>Births, deaths and migration</h2>' +
      '<div class="table-wrap"><table class="data"><thead><tr><th>Year</th><th>Births</th><th>Deaths</th><th>Net migration</th></tr></thead><tbody>' +
      YEARS.map(function (y, i) {
        return '<tr' + (y === 2025 ? ' class="hl"' : '') + '><td>' + y + '</td><td>' + fmtInt(D.population.births[i]) + '</td><td>' + fmtInt(D.population.deaths[i]) + '</td><td>+' + fmtInt(D.population.netMigration[i]) + '</td></tr>';
      }).join('') + '</tbody></table></div>' +
      '<p>In 2025 Aldermere gained 17,000 people from natural change (87,100 births minus 70,100 deaths) and 27,400 from net migration.</p>' +
      csvButton('pop') + '</section></div>' +
      '<p><a href="#/regions">See the population of each region →</a></p>' + sourceLine();
    drawAfter(html, [
      function () { window.AlderCharts.lineChart(document.getElementById('pop-chart'), { labels: YEARS, values: D.population.total, fmt: function (v) { return fmt1(v) + 'm'; }, height: 260 }); },
      function () { window.AlderCharts.barChart(document.getElementById('age-chart'), { labels: D.population.ageGroups2025.map(function (a) { return a.group; }), values: D.population.ageGroups2025.map(function (a) { return a.share; }), fmt: function (v) { return fmt1(v) + '%'; }, height: 260 }); }
    ]);
  }

  // ---------- economy ----------

  function renderEconomy() {
    var endIdx = YEARS.indexOf(econYearEnd);
    var labels = YEARS.slice(0, endIdx + 1);
    registerCsv('gdp', 'aldermere-gdp-2015-2025.csv',
      ['Year', 'GDP nominal (ALC bn)', 'Real growth (%)', 'GDP per capita (ALC)', 'Unemployment rate (%)', 'Employment rate (%)'],
      YEARS.map(function (y, i) { return [y, D.economy.gdpNominal[i], D.economy.realGrowth[i], D.economy.gdpPerCapita[i], D.economy.unemployment[i], D.economy.employmentRate[i]]; }));
    var opts = YEARS.map(function (y) { return '<option value="' + y + '"' + (y === econYearEnd ? ' selected' : '') + '>' + y + '</option>'; }).join('');
    var html = head('Economy', 'National accounts, growth, jobs and government finances — the economy of Aldermere in one place.') +
      '<div class="kv"><div><b>ALC 587bn</b><span>GDP, 2025, current prices</span></div>' +
      '<div><b>+2.4%</b><span>Real GDP growth, 2025</span></div>' +
      '<div><b>4.1%</b><span>Unemployment rate, 2025</span></div></div>' +
      '<section class="panel"><h2>GDP and growth</h2>' +
      '<div class="controls"><label for="econ-year">Show data up to</label>' +
      '<select id="econ-year">' + opts + '</select>' + csvButton('gdp') + '</div>' +
      '<canvas id="gdp-chart" class="chart" height="260"></canvas>' +
      '<p class="chart-note">GDP, ALC billion, current prices. ' + esc(SRC) + '</p>' +
      '<h3>Real GDP growth, % per year</h3><canvas id="growth-chart" class="chart" height="200"></canvas></section>' +
      '<div class="grid2"><section class="panel"><h2>GDP by sector, 2025</h2>' +
      '<canvas id="sector-chart" class="chart" height="240"></canvas>' +
      '<p class="chart-note">Share of gross value added, %. Services dominate the Aldermere economy. ' + esc(SRC) + '</p></section>' +
      '<section class="panel"><h2>Jobs and government</h2>' +
      '<p><b>Employment rate</b> (ages 20–64): <b>76.8%</b> in 2025, up from 71.2% in 2015.</p>' +
      '<p><b>Unemployment</b> fell every year since 2020, from 6.9% to 4.1% in 2025 (Labour Force Survey).</p>' +
      '<p><b>Government debt:</b> 48.6% of GDP in 2025. <b>Deficit:</b> 1.9% of GDP.</p>' +
      yearTable(D.economy.unemployment, function (v) { return fmt1(v) + '%'; }, 'Unemployment rate, %', 2025) +
      '</section></div>' + sourceLine();
    drawAfter(html, [
      function () { window.AlderCharts.lineChart(document.getElementById('gdp-chart'), { labels: labels, values: D.economy.gdpNominal.slice(0, endIdx + 1), fmt: function (v) { return 'ALC ' + fmtInt(v) + 'bn'; }, height: 260 }); },
      function () { window.AlderCharts.barChart(document.getElementById('growth-chart'), { labels: labels, values: D.economy.realGrowth.slice(0, endIdx + 1), fmt: function (v) { return fmt1(v) + '%'; }, height: 200 }); },
      function () { window.AlderCharts.barChart(document.getElementById('sector-chart'), { labels: D.economy.sectors2025.map(function (s) { return s.sector; }), values: D.economy.sectors2025.map(function (s) { return s.share; }), fmt: function (v) { return fmt1(v) + '%'; }, height: 240 }); }
    ]);
    document.getElementById('econ-year').addEventListener('change', function (e) {
      econYearEnd = parseInt(e.target.value, 10); renderEconomy();
    });
  }

  // ---------- prices ----------

  function renderPrices() {
    registerCsv('cpi', 'aldermere-cpi-2015-2025.csv',
      ['Year', 'CPI index (2015=100)', 'Inflation (%)'],
      YEARS.map(function (y, i) { return [y, D.prices.cpiIndex[i], D.prices.inflation[i]]; }));
    var html = head('Prices', 'Consumer prices, inflation and what households pay — the cost of living in Aldermere.') +
      '<div class="kv"><div><b>2.8%</b><span>Inflation, annual average 2025</span></div>' +
      '<div><b>127.5</b><span>CPI, 2015 = 100, 2025</span></div>' +
      '<div><b>+3.9%</b><span>House prices, 2025</span></div></div>' +
      '<section class="panel"><h2>Inflation (CPI), 2015–2025</h2>' +
      '<canvas id="cpi-chart" class="chart" height="260"></canvas>' +
      '<p class="chart-note">Annual average change in the consumer price index, %. Inflation peaked at 5.0% in 2022 and has fallen since. ' + esc(SRC) + '</p>' +
      csvButton('cpi') + '</section>' +
      '<div class="grid2"><section class="panel"><h2>What is in the basket, 2025</h2>' +
      '<canvas id="basket-chart" class="chart" height="240"></canvas>' +
      '<p class="chart-note">Weights in the CPI basket, %. ' + esc(SRC) + '</p></section>' +
      '<section class="panel"><h2>CPI index by year</h2>' +
      yearTable(D.prices.cpiIndex, function (v) { return fmt1(v); }, 'CPI (2015 = 100)', 2025) +
      '</section></div>' +
      '<div class="callout"><b>How to read this:</b> the CPI tracks the price of a fixed basket of goods and services bought by a typical Aldermere household. A 2.8% inflation rate means the basket cost 2.8% more in 2025 than in 2024.</div>' +
      sourceLine();
    drawAfter(html, [
      function () { window.AlderCharts.lineChart(document.getElementById('cpi-chart'), { labels: YEARS, values: D.prices.inflation, fmt: function (v) { return fmt1(v) + '%'; }, height: 260 }); },
      function () { window.AlderCharts.barChart(document.getElementById('basket-chart'), { labels: D.prices.basket2025.map(function (b) { return b.item; }), values: D.prices.basket2025.map(function (b) { return b.weight; }), fmt: function (v) { return fmt1(v) + '%'; }, height: 240 }); }
    ]);
  }

  // ---------- trade ----------

  function renderTrade() {
    var balances = YEARS.map(function (y, i) { return D.balance(i); });
    registerCsv('trade', 'aldermere-trade-2015-2025.csv',
      ['Year', 'Exports (ALC bn)', 'Imports (ALC bn)', 'Balance (ALC bn)'],
      YEARS.map(function (y, i) { return [y, D.trade.exports[i], D.trade.imports[i], balances[i]]; }));
    var html = head('Trade', 'What Aldermere sells to the world and buys from it — exports, imports and the trading partners that matter most.') +
      '<div class="kv"><div><b>ALC 214bn</b><span>Exports, 2025</span></div>' +
      '<div><b>ALC 198bn</b><span>Imports, 2025</span></div>' +
      '<div><b>ALC +16.0bn</b><span>Trade surplus, 2025</span></div></div>' +
      '<section class="panel"><h2>Exports and imports, 2015–2025</h2>' +
      '<canvas id="trade-chart" class="chart" height="260"></canvas>' +
      '<p class="chart-note">Goods and services, ALC billion. Solid line: exports; dashed line: imports. ' + esc(SRC) + '</p>' +
      '<h3>Trade balance, ALC billion</h3><canvas id="balance-chart" class="chart" height="200"></canvas>' +
      csvButton('trade') + '</section>' +
      '<div class="grid2"><section class="panel"><h2>Trading partners, 2025</h2>' +
      '<div class="table-wrap"><table class="data"><thead><tr><th>Partner</th><th>Exports</th><th>Imports</th></tr></thead><tbody>' +
      D.trade.partners2025.map(function (p) { return '<tr><td>' + esc(p.partner) + '</td><td>ALC ' + fmt1(p.exports) + 'bn</td><td>ALC ' + fmt1(p.imports) + 'bn</td></tr>'; }).join('') +
      '</tbody></table></div><p>Nordland is Aldermere’s largest partner in both directions.</p></section>' +
      '<section class="panel"><h2>What Aldermere exports, 2025</h2>' +
      '<canvas id="goods-chart" class="chart" height="240"></canvas>' +
      '<p class="chart-note">Share of goods exports, %. ' + esc(SRC) + '</p></section></div>' + sourceLine();
    drawAfter(html, [
      function () { window.AlderCharts.lineChart(document.getElementById('trade-chart'), { labels: YEARS, values: D.trade.exports, fmt: function (v) { return 'ALC ' + fmtInt(v) + 'bn'; }, height: 260, second: { values: D.trade.imports } }); },
      function () { window.AlderCharts.barChart(document.getElementById('balance-chart'), { labels: YEARS, values: balances, fmt: function (v) { return 'ALC ' + fmt1(v) + 'bn'; }, height: 200 }); },
      function () { window.AlderCharts.barChart(document.getElementById('goods-chart'), { labels: D.trade.topExports2025.map(function (g) { return g.good; }), values: D.trade.topExports2025.map(function (g) { return g.share; }), fmt: function (v) { return fmt1(v) + '%'; }, height: 240 }); }
    ]);
  }

  // ---------- health ----------

  function renderHealth() {
    var html = head('Health', 'How long people in Aldermere live and how healthy they are — life expectancy, infant mortality and the health system.') +
      '<div class="kv"><div><b>82.4 years</b><span>Life expectancy at birth, 2025</span></div>' +
      '<div><b>3.1 per 1,000</b><span>Infant mortality, 2025</span></div>' +
      '<div><b>10.8% of GDP</b><span>Health spending, 2025</span></div></div>' +
      '<section class="panel"><h2>Life expectancy, 2015–2025</h2>' +
      '<canvas id="life-chart" class="chart" height="260"></canvas>' +
      '<p class="chart-note">Years at birth, both sexes. Life expectancy rose 1.5 years in a decade, with a dip in 2020. ' + esc(SRC) + '</p></section>' +
      '<div class="grid2"><section class="panel"><h2>Infant mortality</h2>' +
      '<canvas id="infant-chart" class="chart" height="240"></canvas>' +
      '<p class="chart-note">Deaths under age 1 per 1,000 live births. ' + esc(SRC) + '</p></section>' +
      '<section class="panel"><h2>The health system, 2025</h2>' +
      '<p><b>Hospital beds:</b> 4.2 per 1,000 people. <b>Doctors:</b> 4.6 per 1,000 people.</p>' +
      '<p><b>Smoking:</b> 14.2% of adults smoke daily, down from 19.8% in 2015.</p>' +
      '<p><b>Obesity:</b> 21.6% of adults, up from 18.9% in 2015 — the office flags this as the main rising risk.</p>' +
      yearTable(D.health.lifeExpectancy, function (v) { return fmt1(v) + ' yrs'; }, 'Life expectancy', 2025) +
      '</section></div>' + sourceLine();
    drawAfter(html, [
      function () { window.AlderCharts.lineChart(document.getElementById('life-chart'), { labels: YEARS, values: D.health.lifeExpectancy, fmt: function (v) { return fmt1(v) + ' yrs'; }, height: 260 }); },
      function () { window.AlderCharts.lineChart(document.getElementById('infant-chart'), { labels: YEARS, values: D.health.infantMortality, fmt: function (v) { return fmt1(v); }, height: 240 }); }
    ]);
  }

  // ---------- education ----------

  function renderEducation() {
    var html = head('Education', 'Schooling and degrees in Aldermere — who finishes school, who goes on to university, and what it costs.') +
      '<div class="kv"><div><b>54.2%</b><span>Ages 25–34 with a degree, 2025</span></div>' +
      '<div><b>89.7%</b><span>Upper secondary completion, 2025</span></div>' +
      '<div><b>5.4% of GDP</b><span>Education spending, 2025</span></div></div>' +
      '<section class="panel"><h2>Tertiary attainment, 2015–2025</h2>' +
      '<canvas id="edu-chart" class="chart" height="260"></canvas>' +
      '<p class="chart-note">Share of ages 25–34 with a tertiary degree, %. Ten points higher than in 2015. ' + esc(SRC) + '</p></section>' +
      '<div class="grid2"><section class="panel"><h2>Schooling, 2025</h2>' +
      '<p><b>Early school leavers:</b> 6.8% of ages 18–24 left with at most lower secondary education.</p>' +
      '<p><b>Pupils per teacher:</b> 13.8 in primary and secondary schools.</p>' +
      '<p><b>Adult learning:</b> 18.9% of adults aged 25–64 took part in education or training in the last four weeks.</p></section>' +
      '<section class="panel"><h2>Tertiary attainment by year</h2>' +
      yearTable(D.education.tertiaryAttainment, function (v) { return fmt1(v) + '%'; }, 'Ages 25–34 with a degree, %', 2025) +
      '</section></div>' + sourceLine();
    drawAfter(html, [
      function () { window.AlderCharts.lineChart(document.getElementById('edu-chart'), { labels: YEARS, values: D.education.tertiaryAttainment, fmt: function (v) { return fmt1(v) + '%'; }, height: 260 }); }
    ]);
  }

  // ---------- regions ----------

  function regionRowsSorted() {
    var rows = D.regions.slice();
    var keys = ['name', 'pop', 'gdpPc', 'unemp', 'area'];
    var key = keys[regionSort.key];
    rows.sort(function (a, b) {
      var d = key === 'name' ? (a.name < b.name ? -1 : 1) : (a[key] - b[key]);
      return d * regionSort.dir;
    });
    return rows;
  }

  function renderRegions() {
    var rows = regionRowsSorted();
    var body = rows.map(function (r) {
      return '<tr><td>' + esc(r.name) + '</td><td>' + fmt1(r.pop) + '</td><td>ALC ' + fmtInt(r.gdpPc) + '</td><td>' + fmt1(r.unemp) + '%</td><td>' + fmtInt(r.area) + '</td><td>' + esc(r.note) + '</td></tr>';
    }).join('');
    var html = head('Regions', 'Aldermere’s eight regions compared — population, income and jobs, from the capital region of Dunmere to the mountains of Highfell.') +
      '<section class="panel"><h2>All regions, 2025</h2>' +
      '<p>Click a column heading to sort the table. The chart below shows the same population figures.</p>' +
      '<div class="table-wrap"><table class="data" id="regions-table"><thead><tr>' +
      '<th class="sortable" data-col="0">Region</th><th class="sortable" data-col="1">Population (m)</th>' +
      '<th class="sortable" data-col="2">GDP per capita</th><th class="sortable" data-col="3">Unemployment</th>' +
      '<th class="sortable" data-col="4">Area (km²)</th><th>Character</th></tr></thead><tbody>' + body + '</tbody></table></div>' +
      '<p>Dunmere holds a quarter of the population and the highest income per person; Highfell is the largest region by area and the least dense.</p></section>' +
      '<section class="panel"><h2>Population by region, millions</h2>' +
      '<canvas id="region-chart" class="chart" height="260"></canvas>' +
      '<p class="chart-note">Mid-year population, 2025. ' + esc(SRC) + '</p></section>' + sourceLine();
    drawAfter(html, [
      function () { window.AlderCharts.barChart(document.getElementById('region-chart'), { labels: D.regions.map(function (r) { return r.name; }), values: D.regions.map(function (r) { return r.pop; }), fmt: function (v) { return fmt1(v) + 'm'; }, height: 260 }); }
    ]);
    document.querySelectorAll('#regions-table th.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var col = parseInt(th.getAttribute('data-col'), 10);
        if (regionSort.key === col) regionSort.dir = -regionSort.dir;
        else { regionSort.key = col; regionSort.dir = col === 0 ? 1 : -1; }
        renderRegions();
      });
    });
  }

  // ---------- releases ----------

  function renderReleases() {
    var list = D.releases.filter(function (r) { return releaseFilter === 'all' || (releaseFilter === 'upcoming' ? r.status === 'Upcoming' : r.status === 'Published'); });
    var rows = list.map(function (r) {
      return '<tr><td>' + esc(r.date) + '</td><td>' + esc(r.title) + '</td><td><span class="pill' + (r.status === 'Upcoming' ? ' soon' : '') + '">' + esc(r.status) + '</span></td><td>' + esc(r.time) + '</td></tr>';
    }).join('');
    var html = head('Release calendar', 'When the National Statistics Office publishes each figure — and what has already come out. All releases appear at 08:00 Aldermere time.') +
      '<div class="controls" role="group" aria-label="Filter releases">' +
      '<button class="btn' + (releaseFilter === 'all' ? '' : ' ghost') + '" data-filter="all">All releases</button>' +
      '<button class="btn' + (releaseFilter === 'upcoming' ? '' : ' ghost') + '" data-filter="upcoming">Upcoming</button>' +
      '<button class="btn' + (releaseFilter === 'published' ? '' : ' ghost') + '" data-filter="published">Published</button></div>' +
      '<section class="panel"><div class="table-wrap"><table class="data"><thead><tr><th>Date</th><th>Release</th><th>Status</th><th>Time</th></tr></thead><tbody>' + rows + '</tbody></table></div></section>' +
      '<div class="callout"><b>How releases work:</b> every figure is published at 08:00 on its release day, at the same time for everyone, with a short note explaining what changed and why. Revisions are announced in advance and marked on the affected page.</div>' +
      sourceLine();
    drawAfter(html, []);
    document.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () { releaseFilter = b.getAttribute('data-filter'); renderReleases(); });
    });
  }

  // ---------- methods ----------

  function renderMethods() {
    var html = head('Methods & sources', 'How Aldermere’s statistics are made — the sources behind every figure on this site, and the rules for revising them.') +
      '<section class="panel"><h2>Sources</h2>' +
      '<p>Every figure on this site comes from the Aldermere National Statistics Office and its surveys and registers:</p>' +
      '<div class="table-wrap"><table class="data"><thead><tr><th>Topic</th><th>Main source</th><th>Frequency</th></tr></thead><tbody>' +
      '<tr><td>Population</td><td>Population register, mid-year estimates</td><td>Annual</td></tr>' +
      '<tr><td>Economy</td><td>National accounts; business surveys</td><td>Quarterly</td></tr>' +
      '<tr><td>Prices</td><td>Consumer price survey, 42,000 prices a month</td><td>Monthly</td></tr>' +
      '<tr><td>Trade</td><td>Customs declarations; services survey</td><td>Monthly</td></tr>' +
      '<tr><td>Health</td><td>Deaths register; health service records</td><td>Annual</td></tr>' +
      '<tr><td>Education</td><td>School census; graduate register</td><td>Annual</td></tr>' +
      '<tr><td>Regions</td><td>Regional accounts; population register</td><td>Annual</td></tr>' +
      '</tbody></table></div></section>' +
      '<section class="panel"><h2>Methods</h2>' +
      '<p><b>Population</b> is the usually resident population at 30 June, from the population register adjusted for under-registration.</p>' +
      '<p><b>GDP</b> follows the System of National Accounts: the value of all final goods and services produced in Aldermere. Real growth removes price change using the previous year’s prices.</p>' +
      '<p><b>CPI inflation</b> compares the cost of a fixed basket of goods and services with a year earlier; the basket is re-weighted every January.</p>' +
      '<p><b>Unemployment</b> follows the Labour Force Survey definition: without work, available to start within two weeks, and actively looking in the last four weeks.</p></section>' +
      '<section class="panel"><h2>Revisions</h2>' +
      '<p>Figures are revised when better data arrives. First estimates are marked provisional (p) until the next release. Every revision is listed on the affected page with the old and new value and the reason.</p>' +
      '<p><b>Contact:</b> Aldermere National Statistics Office, Statistics House, Dunmere. Figures on this site are free to reuse with the source line.</p></section>' +
      sourceLine();
    drawAfter(html, []);
  }

  // ---------- router ----------

  var PAGES = {
    '': renderDashboard,
    'population': renderPopulation,
    'economy': renderEconomy,
    'prices': renderPrices,
    'trade': renderTrade,
    'health': renderHealth,
    'education': renderEducation,
    'regions': renderRegions,
    'releases': renderReleases,
    'methods': renderMethods
  };

  function render(route) {
    var fn = PAGES[route] || PAGES[''];
    fn();
    document.querySelectorAll('#mainnav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-route') === route);
    });
    document.title = (route ? route.charAt(0).toUpperCase() + route.slice(1) + ' — ' : '') + 'Aldermere Statistics';
  }

  return { render: render, seriesRows: seriesRows };
})();
