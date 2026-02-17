(function (global) {
  function bindSystemTheme(attributeName) {
    var attr = attributeName || 'data-theme';
    if (!global.matchMedia || !global.document || !global.document.documentElement) return;

    var root = global.document.documentElement;
    var mq = global.matchMedia('(prefers-color-scheme: dark)');
    var apply = function () {
      root.setAttribute(attr, mq.matches ? 'dark' : 'light');
    };

    apply();
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply);
  }

  function bindMobileNavCollapse(navSelector, linkSelector) {
    var navSel = navSelector || '#tlNav';
    var linkSel = linkSelector || '.navbar .nav-link';
    if (!global.document) return;

    global.document.addEventListener('click', function (event) {
      var target = event.target;
      if (!target || !target.closest) return;
      var link = target.closest(linkSel);
      if (!link) return;

      var nav = global.document.querySelector(navSel);
      if (!nav || !nav.classList || !nav.classList.contains('show')) return;
      if (!global.bootstrap || !global.bootstrap.Collapse) return;

      var collapse = global.bootstrap.Collapse.getOrCreateInstance(nav);
      collapse.hide();
    });
  }

  global.TempoCommon = global.TempoCommon || {};
  global.TempoCommon.bindSystemTheme = bindSystemTheme;
  global.TempoCommon.bindMobileNavCollapse = bindMobileNavCollapse;
})(window);
