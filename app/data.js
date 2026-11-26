// Aldermere National Statistics Office — all datasets for the site.
// Every figure is an original, internally consistent series for the fictional
// country of Aldermere, compiled by its National Statistics Office.
// Source line shown on every page: "Aldermere National Statistics Office".
// Years run 2015–2025 unless a table says otherwise.

window.ALDERMERE = (function () {
  var YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

  var DATA = {
    meta: {
      country: 'Aldermere',
      office: 'Aldermere National Statistics Office',
      capital: 'Dunmere',
      currency: 'Aldermere crown (ALC)',
      updated: '26 November 2026',
      sourceNote: 'Source: Aldermere National Statistics Office. Figures are final unless marked provisional (p).'
    },
    years: YEARS,

    // Headline indicators, 2025 (with 2024 for the change shown on cards).
    headline: [
      { id: 'pop', label: 'Population', value: '8.42m', change: '+0.6%', year: 2025, page: 'population', note: 'Mid-year estimate, 30 June 2025' },
      { id: 'gdp', label: 'GDP', value: 'ALC 587bn', change: '+2.4% real', year: 2025, page: 'economy', note: 'Nominal GDP, current prices' },
      { id: 'gdppc', label: 'GDP per capita', value: 'ALC 69,700', change: '+1.8%', year: 2025, page: 'economy', note: 'Nominal, current prices' },
      { id: 'unemp', label: 'Unemployment rate', value: '4.1%', change: '-0.3 pts', year: 2025, page: 'economy', note: 'Labour Force Survey, ages 15–74' },
      { id: 'cpi', label: 'Inflation (CPI)', value: '2.8%', change: '-0.4 pts', year: 2025, page: 'prices', note: 'Annual average, all items' },
      { id: 'trade', label: 'Trade balance', value: 'ALC +16.0bn', change: '+ALC 2.1bn', year: 2025, page: 'trade', note: 'Goods and services, balance of payments' },
      { id: 'life', label: 'Life expectancy', value: '82.4 yrs', change: '+0.3 yrs', year: 2025, page: 'health', note: 'At birth, both sexes' },
      { id: 'edu', label: 'Tertiary attainment', value: '54.2%', change: '+1.1 pts', year: 2025, page: 'education', note: 'Ages 25–34 with a degree' }
    ],

    population: {
      total: [7.81, 7.88, 7.95, 8.02, 8.09, 8.14, 8.19, 8.25, 8.31, 8.37, 8.42],
      births: [91200, 90400, 89800, 89100, 88300, 84900, 83200, 84100, 85300, 86200, 87100],
      deaths: [68400, 69100, 69800, 70500, 71200, 74900, 73800, 72600, 71400, 70800, 70100],
      netMigration: [18400, 19100, 20300, 21800, 22600, 9800, 12900, 21400, 24800, 26100, 27400],
      ageGroups2025: [
        { group: '0–14', share: 16.4 }, { group: '15–24', share: 11.8 },
        { group: '25–44', share: 27.1 }, { group: '45–64', share: 26.3 },
        { group: '65–79', share: 13.2 }, { group: '80+', share: 5.2 }
      ],
      medianAge2025: 41.6,
      density2025: 96
    },

    economy: {
      gdpNominal: [412, 428, 447, 468, 489, 471, 498, 529, 556, 574, 587],
      realGrowth: [2.1, 2.6, 2.9, 3.1, 2.4, -3.8, 4.2, 3.5, 2.9, 2.6, 2.4],
      gdpPerCapita: [52700, 54300, 56200, 58400, 60400, 57900, 60800, 64100, 66900, 68600, 69700],
      unemployment: [6.8, 6.4, 5.9, 5.4, 5.0, 6.9, 6.1, 5.2, 4.7, 4.4, 4.1],
      employmentRate: [71.2, 71.8, 72.5, 73.1, 73.8, 71.9, 73.4, 74.9, 75.8, 76.3, 76.8],
      sectors2025: [
        { sector: 'Services', share: 71.4 }, { sector: 'Manufacturing', share: 14.8 },
        { sector: 'Construction', share: 5.9 }, { sector: 'Agriculture & fishing', share: 2.6 },
        { sector: 'Energy & mining', share: 3.1 }, { sector: 'Other', share: 2.2 }
      ],
      govDebtPctGdp2025: 48.6,
      govDeficitPctGdp2025: 1.9
    },

    prices: {
      cpiIndex: [100.0, 101.4, 103.1, 105.2, 107.3, 107.9, 110.4, 115.9, 120.1, 124.0, 127.5],
      inflation: [1.4, 1.4, 1.7, 2.0, 2.0, 0.6, 2.3, 5.0, 3.6, 3.2, 2.8],
      basket2025: [
        { item: 'Housing & utilities', weight: 24.1 }, { item: 'Food & drink', weight: 17.8 },
        { item: 'Transport', weight: 13.5 }, { item: 'Recreation & culture', weight: 9.6 },
        { item: 'Health', weight: 7.4 }, { item: 'Clothing & footwear', weight: 5.2 },
        { item: 'Other goods & services', weight: 22.4 }
      ],
      housePriceIndex2025: 148.2,
      housePriceChange2025: 3.9
    },

    trade: {
      exports: [168, 174, 183, 192, 199, 181, 196, 208, 213, 209, 214],
      imports: [159, 164, 172, 181, 188, 172, 183, 194, 199, 195, 198],
      partners2025: [
        { partner: 'Nordland', exports: 38.4, imports: 31.2 },
        { partner: 'Vestra', exports: 29.7, imports: 27.9 },
        { partner: 'Caldonia', exports: 22.1, imports: 19.8 },
        { partner: 'Ostara', exports: 17.6, imports: 16.4 },
        { partner: 'Meridia', exports: 14.9, imports: 13.7 },
        { partner: 'All other partners', exports: 91.3, imports: 89.0 }
      ],
      topExports2025: [
        { good: 'Machinery & equipment', share: 24.6 },
        { good: 'Pharmaceuticals', share: 15.2 },
        { good: 'Food & beverages', share: 12.8 },
        { good: 'Chemicals', share: 9.4 },
        { good: 'Timber & paper', share: 7.1 },
        { good: 'Other goods', share: 30.9 }
      ]
    },

    health: {
      lifeExpectancy: [80.9, 81.1, 81.3, 81.5, 81.7, 81.4, 81.8, 82.0, 82.1, 82.1, 82.4],
      infantMortality: [3.9, 3.8, 3.7, 3.6, 3.5, 3.6, 3.4, 3.3, 3.2, 3.2, 3.1],
      bedsPer1000: 4.2,
      doctorsPer1000: 4.6,
      healthSpendPctGdp2025: 10.8,
      smokingRate2025: 14.2,
      obesityRate2025: 21.6
    },

    education: {
      tertiaryAttainment: [44.1, 45.3, 46.8, 48.0, 49.2, 50.1, 51.0, 52.0, 52.8, 53.1, 54.2],
      upperSecondary2025: 89.7,
      earlyLeavers2025: 6.8,
      educationSpendPctGdp2025: 5.4,
      pupilsPerTeacher2025: 13.8,
      adultLearning2025: 18.9
    },

    regions: [
      { name: 'Dunmere', pop: 2.14, gdpPc: 84200, unemp: 3.6, area: 1840, note: 'Capital region' },
      { name: 'Northgate', pop: 1.32, gdpPc: 61400, unemp: 4.5, area: 5210, note: 'Industrial north' },
      { name: 'Eastvale', pop: 1.08, gdpPc: 58900, unemp: 4.8, area: 4380, note: 'Farming & food' },
      { name: 'Southmoor', pop: 0.96, gdpPc: 63200, unemp: 4.0, area: 3970, note: 'Coastal south' },
      { name: 'Westhaven', pop: 0.88, gdpPc: 57100, unemp: 5.1, area: 3120, note: 'Port & logistics' },
      { name: 'Highfell', pop: 0.74, gdpPc: 54800, unemp: 5.4, area: 6890, note: 'Mountain region' },
      { name: 'Lakeshire', pop: 0.69, gdpPc: 56300, unemp: 4.9, area: 4560, note: 'Lakes & tourism' },
      { name: 'Port Alba', pop: 0.61, gdpPc: 66800, unemp: 3.9, area: 2210, note: 'Harbour city' }
    ],

    releases: [
      { date: '2026-12-03', title: 'Consumer price index — November 2026', status: 'Upcoming', time: '08:00' },
      { date: '2026-12-10', title: 'Labour Force Survey — Q3 2026', status: 'Upcoming', time: '08:00' },
      { date: '2026-12-17', title: 'National accounts — Q3 2026 (revised)', status: 'Upcoming', time: '08:00' },
      { date: '2027-01-08', title: 'Population estimate — 1 January 2027', status: 'Upcoming', time: '08:00' },
      { date: '2027-01-15', title: 'Foreign trade — December 2026', status: 'Upcoming', time: '08:00' },
      { date: '2026-11-26', title: 'Consumer price index — October 2026', status: 'Published', time: '08:00' },
      { date: '2026-11-19', title: 'Labour Force Survey — October 2026', status: 'Published', time: '08:00' },
      { date: '2026-11-12', title: 'National accounts — Q3 2026 (first estimate)', status: 'Published', time: '08:00' },
      { date: '2026-11-05', title: 'Foreign trade — October 2026', status: 'Published', time: '08:00' },
      { date: '2026-10-29', title: 'Regional GDP — 2025', status: 'Published', time: '08:00' }
    ]
  };

  // Search index: every headline figure plus the main page topics.
  DATA.indicators = DATA.headline.map(function (h) {
    return { name: h.label, value: h.value, year: h.year, page: h.page, note: h.note };
  }).concat([
    { name: 'Age structure', value: 'Median age 41.6', year: 2025, page: 'population', note: 'Share by age group, 2025' },
    { name: 'Net migration', value: '+27,400', year: 2025, page: 'population', note: 'Immigrants minus emigrants' },
    { name: 'Government debt', value: '48.6% of GDP', year: 2025, page: 'economy', note: 'General government gross debt' },
    { name: 'House prices', value: '+3.9%', year: 2025, page: 'prices', note: 'Annual change, house price index' },
    { name: 'Exports', value: 'ALC 214bn', year: 2025, page: 'trade', note: 'Goods and services' },
    { name: 'Infant mortality', value: '3.1 per 1,000', year: 2025, page: 'health', note: 'Deaths under age 1 per 1,000 live births' },
    { name: 'Early school leavers', value: '6.8%', year: 2025, page: 'education', note: 'Ages 18–24, at most lower secondary' },
    { name: 'Regional GDP per capita', value: 'ALC 54,800–84,200', year: 2025, page: 'regions', note: 'Range across the eight regions' }
  ]);

  DATA.balance = function (yearIndex) {
    return +(DATA.trade.exports[yearIndex] - DATA.trade.imports[yearIndex]).toFixed(1);
  };

  return DATA;
})();
