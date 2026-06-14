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

  global.TempoCommon = global.TempoCommon || {};
  global.TempoCommon.bindSystemTheme = bindSystemTheme;
})(window);
