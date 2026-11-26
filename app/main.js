// Aldermere Statistics — boot: hash router, indicator search, CSV download.
// The site is plain static files: no network request is made anywhere here.
// CSV files are generated in the browser from the data already loaded.

(function () {
  var D = window.ALDERMERE;

  function route() {
    var hash = window.location.hash || '#/';
    var path = hash.replace(/^#\/?/, '').split('?')[0];
    window.AlderViews.render(path);
  }

  // ---- search: filters the indicator index as the user types ----
  var input = document.getElementById('search');
  var box = document.getElementById('search-results');

  function closeSearch() { box.hidden = true; box.innerHTML = ''; }

  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    if (q.length < 2) { closeSearch(); return; }
    var hits = D.indicators.filter(function (it) {
      return it.name.toLowerCase().indexOf(q) !== -1 || it.note.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 6);
    if (!hits.length) {
      box.innerHTML = '<button type="button" disabled>No indicator matches “' + input.value.replace(/</g, '&lt;') + '”.</button>';
      box.hidden = false;
      return;
    }
    box.innerHTML = '';
    hits.forEach(function (it) {
      var b = document.createElement('button');
      b.type = 'button';
      var name = document.createElement('b'); name.textContent = it.name + ' — ' + it.value;
      var note = document.createElement('span'); note.textContent = it.note + ' · ' + it.year;
      b.appendChild(name); b.appendChild(note);
      b.addEventListener('click', function () {
        closeSearch(); input.value = '';
        window.location.hash = '#/' + it.page;
      });
      box.appendChild(b);
    });
    box.hidden = false;
  });
  input.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeSearch(); input.blur(); } });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.searchbox')) closeSearch();
  });

  // ---- CSV download: buttons carry data-csv="<id>" registered by the views ----
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-csv]');
    if (!btn) return;
    var spec = (window.ALDER_CSV || {})[btn.getAttribute('data-csv')];
    if (!spec) return;
    var lines = [spec.header.join(',')];
    spec.rows.forEach(function (r) { lines.push(r.join(',')); });
    var blob = new Blob([lines.join('\n') + '\n'], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = spec.filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });

  window.addEventListener('hashchange', route);
  route();
})();
