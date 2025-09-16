document.addEventListener("DOMContentLoaded", function () {
  // JSONデータの読み込みと適用
  fetch("../content.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      // 1. テキストコンテンツを反映
      for (const key in data.text) {
        const el = document.getElementById(key);
        if (el) {
          el.innerHTML = data.text[key];
        }
      }

      // 2. 画像パスとその他のパスを反映
      for (const key in data.path) {
        const el = document.getElementById(key);
        // IMG要素のsrc属性を設定
        if (el && el.tagName === 'IMG') {
          el.setAttribute("src", `../${data.path[key]}`);
        }
        // 背景画像用のCSS変数を設定
        else if (key.startsWith('lanthanum-bg')) {
          document.documentElement.style.setProperty(`--${key}`, `url('../${data.path[key]}')`);
        }
      }

      // 3. ページのtitleも自動で設定
      if (data.text.title) {
        document.title = data.text.title;
      }

      // 4. フェードインアニメーションの設定
      setupFadeInAnimation();

    })
    .catch(error => {
      console.error("JSON読み込みまたは処理エラー:", error);
      const bodyElement = document.querySelector('body');
      if(bodyElement) {
          bodyElement.innerHTML = `<p style="color: #d14783; text-align: center; padding: 30px; font-family: 'Noto Serif JP', serif; font-size: 16px;">コンテンツの読み込みに失敗しました。<br>お手数ですが、しばらくしてから再度お試しください。</p>`;
      }
    });

  // フェードインアニメーションの関数
  function setupFadeInAnimation() {
    const fadeInElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);
    fadeInElements.forEach(el => {
      observer.observe(el);
    });
  }
});
