// 使用 IIFE 包裹以避免全局变量污染
(function () {
  var loadingBar = document.querySelector(".loading-bar");
  var progress = document.querySelector(".loading-bar .progress");
  var timer = null;
  let pjax;

  // 初始化加载动画相关元素
  function initAni() {
    loadingBar = document.querySelector(".loading-bar");
    progress = document.querySelector(".loading-bar .progress");
  }

  // 停止加载动画
  function endLoad() {
    clearInterval(timer);
    progress.style.width = "100%";
    loadingBar.classList.remove("loading");

    setTimeout(function () {
      progress.style.width = 0;
    }, 400);
  }

  // 初始化 PJAX
  function initPjax() {
    try {
      const Pjax = window.Pjax || function () { };
      pjax = new Pjax({
        selectors: [
          "head meta",
          "head title",
          "nav .ul",
          ".container",
          ".pjax-reload"
        ],
        cacheBust: false
      });
    } catch (e) {
      console.log('PJAX 初始化出错：' + e);
    }
  }

  // translate-js 翻译系统
  //// 初始化翻译系统
  function initTranslate() {
    try {
      translate.service.use('client.edge');
      translate.listener.start();
      translate.setAutoDiscriminateLocalLanguage();
      translate.language.setLocal('chinese_simplified');
      translate.language.setUrlParamControl();
      translate.ignore.class.push('notTranslate');
      translate.nomenclature.append('chinese_simplified', 'english', `
                主页=home
                关于=about
            `);
      translate.execute();
    } catch (e) {
      console.error('翻译系统出错：' + e);
    }
  }
  //// 获取用户使用的语种并转换为 giscus 可识别的标记
  const getCurrentLanguage = function () {
    var lang = translate.language.getCurrent();
    var giscus_lang = "zh-CN";
    switch (lang) {
      case "chinese_simplified":
        giscus_lang = "zh-CN";
        break;
      case "chinese_traditional":
        giscus_lang = "zh-TW";
        break;
      case "english":
        giscus_lang = "en";
        break;
      case "spanish":
        giscus_lang = "es";
        break;
      case "japanese":
        giscus_lang = "ja";
        break;
      case "korean":
        giscus_lang = "ko";
        break;
      case "french":
        giscus_lang = "fr";
        break;
      case "arabic":
        giscus_lang = "ar";
        break;
      case "catalan":
        giscus_lang = "ca";
        break;
      case "danish":
        giscus_lang = "da";
        break;
      case "deutsch":
        giscus_lang = "de";
        break;
      case "persian":
        giscus_lang = "fa";
        break;
      case "greek":
        giscus_lang = "gr";
        break;
      case "serbian":
        giscus_lang = "hbs";
        break;
      case "hebrew":
        giscus_lang = "he";
        break;
      case "hungarian":
        giscus_lang = "hu";
        break;
      case "italian":
        giscus_lang = "it";
        break;
      default:
        giscus_lang = "zh-CN";
        break;
    }
    return giscus_lang;
  }

  // Giscus 评论系统
  var SetupGiscus = function (giscus_lang) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://giscus.app/client.js";

    script.setAttribute("data-repo", "Wedot-Engine/Wedot-Engine.github.io");
    script.setAttribute("data-repo-id", "R_kgDONDfw-A");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDONDfw-M4Cjpk1");

    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "1");
    script.setAttribute("data-reactions-enabled", "0");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "cobalt");
    script.setAttribute("data-lang", giscus_lang);

    script.crossOrigin = "anonymous";
    script.async = true;

    document.getElementById("giscus-container").appendChild(script);
  }

  // Darkmode.js 深色模式
  function initDarkmode() {
    try {
      const Darkmode = window.Darkmode || function () {
        console.warn('Darkmode.js 不存在？');
        return;
      };
      var darkmode = new Darkmode();
      document.body.addEventListener('click', function (event) {
        if (event.target.id === 'dark_b') {
          try {
            darkmode.toggle();
          } catch (e) {
            console.error('Darkmode.js 出错：' + e);
          }
        }
      });
    } catch (e) {
      console.error('初始化 Darkmode.js 出错：' + e);
    }
  }

  // 初始化
  function initialize() {
    // initDarkmode();
    initPjax();
    initAni();
    initTranslate();
    if (document.getElementById("giscus-container") != null) {
      SetupGiscus(getCurrentLanguage());   //// 初始化评论系统
    }
  }


  // 触发器
  //// 网页加载完毕后触发
  window.addEventListener('DOMContentLoaded', () => initialize());
  //// Pjax 开始时执行的函数
  document.addEventListener("pjax:send", function () {
    var loadingBarWidth = 20;
    var MAX_LOADING_WIDTH = 95;

    loadingBar.classList.add("loading");
    progress.style.width = loadingBarWidth + "%";

    clearInterval(timer);
    timer = setInterval(function () {
      loadingBarWidth += 3;

      if (loadingBarWidth > MAX_LOADING_WIDTH) {
        loadingBarWidth = MAX_LOADING_WIDTH;
      }

      progress.style.width = loadingBarWidth + "%";
    }, 500);
  });
  //// 翻译执行完成后触发
  translate.listener.renderTaskFinish = function (_task) {
    if (document.getElementById("giscus-container") != null) {
      SetupGiscus(getCurrentLanguage());   //// 初始化评论系统
    }
  }
  //// 监听 Pjax 完成后加载
  document.addEventListener("pjax:complete", function () {
    endLoad();
    if (document.getElementById("giscus-container") != null) {
      SetupGiscus(getCurrentLanguage());   //// 初始化评论系统
    }
    translate.execute();
    translate.selectLanguageTag.refreshRender();
  });
})();