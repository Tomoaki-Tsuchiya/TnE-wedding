/**
 * テーマ（見た目）の切り替え。<head> 内で css/style.css の直後に読み込む。
 *
 * 優先順位: URL の ?theme=xxx > 前回選んだテーマ > DEFAULT_THEME
 * 新しいテーマを試すときは themes/<name>.css を作り、下の THEMES に1行足す。
 */
(function () {
  var DEFAULT_THEME = "chic";

  var THEMES = {
    chic: {
      label: "Chic",
      css: "themes/chic.css",
      themeColor: "#1f1d1c",
      petals: false
    },
    pastel: {
      label: "Pastel",
      css: null, // css/style.css そのもの（v0.1-pastel の見た目）
      themeColor: "#fbeef4",
      petals: { colors: ["#f7c6d6", "#f3b3c8", "#e2d0f5", "#d9c3f0", "#fde3ec"] }
    }
  };

  var KEY = "wi-theme";
  var name = null;
  try {
    var param = new URLSearchParams(location.search).get("theme");
    if (param && THEMES[param]) {
      name = param;
      localStorage.setItem(KEY, param);
    } else {
      var saved = localStorage.getItem(KEY);
      if (saved && THEMES[saved]) name = saved;
    }
  } catch (e) {}
  if (!name) name = DEFAULT_THEME;

  var theme = THEMES[name];
  document.documentElement.setAttribute("data-theme", name);
  // 同期的に書き出して、テーマ適用前の画面が一瞬見えるのを防ぐ
  if (theme.css) document.write('<link rel="stylesheet" href="' + theme.css + '">');
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme.themeColor);

  window.THEMES = THEMES;
  window.ACTIVE_THEME = Object.assign({ name: name }, theme);
})();
