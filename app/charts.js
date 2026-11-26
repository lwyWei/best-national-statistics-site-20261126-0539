// Aldermere Statistics — canvas chart renderers (no library, no network).
// Two renderers, one job each: lineChart draws a time series with a labelled
// axis and value labels; barChart draws one bar per category. Both scale to
// the device pixel ratio so screenshots stay sharp.

window.AlderCharts = (function () {
  var INK = '#1f2a37';
  var GRID = '#dbe2ea';
  var AXIS = '#8a97a5';
  var BLUE = '#1d5fa8';
  var TEAL = '#0e7a6d';
  var AMBER = '#b97a12';

  function setup(canvas, cssHeight) {
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || canvas.parentElement.clientWidth || 600;
    var h = cssHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    return { ctx: ctx, w: w, h: h };
  }

  function niceMax(max) {
    if (max <= 0) return 1;
    var pow = Math.pow(10, Math.floor(Math.log10(max)));
    var n = max / pow;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
    return step * pow;
  }

  // Gridlines run from min to max in 4 steps; min is 0 unless a value is negative.
  function axes(g, labels, min, max, fmt) {
    var padL = 84, padR = 14, padT = 12, padB = 26;
    var plotW = g.w - padL - padR, plotH = g.h - padT - padB;
    var ctx = g.ctx;
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillStyle = AXIS;
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    var steps = 4;
    for (var i = 0; i <= steps; i++) {
      var v = min + (max - min) * i / steps;
      var y = padT + plotH - plotH * i / steps;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
      ctx.fillText(fmt(v), padL - 8, y);
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    labels.forEach(function (lab, i) {
      var x = padL + plotW * (labels.length === 1 ? 0.5 : i / (labels.length - 1));
      ctx.fillText(String(lab), x, padT + plotH + 8);
    });
    return { padL: padL, padR: padR, padT: padT, padB: padB, plotW: plotW, plotH: plotH, min: min, max: max };
  }

  function lineChart(canvas, opts) {
    var g = setup(canvas, opts.height || 260);
    var max = niceMax(Math.max.apply(null, opts.values) * 1.08);
    var box = axes(g, opts.labels, 0, max, opts.fmt);
    var ctx = g.ctx;
    var x = function (i) { return box.padL + box.plotW * (opts.labels.length === 1 ? 0.5 : i / (opts.labels.length - 1)); };
    var y = function (v) { return box.padT + box.plotH - box.plotH * v / max; };
    ctx.strokeStyle = opts.color || BLUE;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    opts.values.forEach(function (v, i) { if (i === 0) ctx.moveTo(x(i), y(v)); else ctx.lineTo(x(i), y(v)); });
    ctx.stroke();
    ctx.fillStyle = opts.color || BLUE;
    opts.values.forEach(function (v, i) {
      ctx.beginPath(); ctx.arc(x(i), y(v), 3.5, 0, Math.PI * 2); ctx.fill();
    });
    // Value labels on first, last and peak points only, so the chart stays
    // readable. The first label sits right of its point and the last left of
    // its point, so neither collides with the axis labels.
    ctx.font = 'bold 11px system-ui, sans-serif';
    ctx.fillStyle = INK;
    ctx.textBaseline = 'bottom';
    var peak = opts.values.indexOf(Math.max.apply(null, opts.values));
    [0, opts.values.length - 1, peak].filter(function (v, i, a) { return a.indexOf(v) === i; }).forEach(function (i) {
      var label = opts.fmt(opts.values[i]);
      if (i === 0) { ctx.textAlign = 'left'; ctx.fillText(label, x(i) + 8, y(opts.values[i]) - 8); }
      else if (i === opts.values.length - 1) { ctx.textAlign = 'right'; ctx.fillText(label, x(i) - 8, y(opts.values[i]) - 8); }
      else { ctx.textAlign = 'center'; ctx.fillText(label, x(i), y(opts.values[i]) - 8); }
    });
    if (opts.second) {
      ctx.strokeStyle = TEAL; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.beginPath();
      opts.second.values.forEach(function (v, i) { if (i === 0) ctx.moveTo(x(i), y(v)); else ctx.lineTo(x(i), y(v)); });
      ctx.stroke(); ctx.setLineDash([]);
    }
  }

  function barChart(canvas, opts) {
    var g = setup(canvas, opts.height || 260);
    var lo = Math.min(0, Math.min.apply(null, opts.values));
    var hi = niceMax(Math.max.apply(null, opts.values) * 1.1);
    // Keep the scale symmetric-ish for a negative low so the zero line sits
    // inside the plot instead of at its edge.
    var min = lo < 0 ? -hi : 0;
    var box = axes(g, opts.labels, min, hi, opts.fmt);
    var ctx = g.ctx;
    var y = function (v) { return box.padT + box.plotH - box.plotH * (v - min) / (hi - min); };
    var zeroY = y(0);
    var n = opts.values.length;
    var slot = box.plotW / n;
    var barW = Math.min(46, slot * 0.62);
    opts.values.forEach(function (v, i) {
      var bx = box.padL + slot * i + (slot - barW) / 2;
      var top = v >= 0 ? y(v) : zeroY;
      var h = Math.abs(zeroY - y(v));
      ctx.fillStyle = (opts.colors && opts.colors[i]) || (v < 0 ? '#b3372e' : (i % 2 ? TEAL : BLUE));
      ctx.fillRect(bx, top, barW, h);
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillStyle = INK;
      ctx.textAlign = 'center';
      if (v >= 0) { ctx.textBaseline = 'bottom'; ctx.fillText(opts.fmt(v), bx + barW / 2, top - 5); }
      else { ctx.textBaseline = 'top'; ctx.fillText(opts.fmt(v), bx + barW / 2, top + h + 5); }
    });
    void AMBER;
  }

  return { lineChart: lineChart, barChart: barChart };
})();
