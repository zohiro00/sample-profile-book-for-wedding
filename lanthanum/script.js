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

      // 4. アニメーションの初期化
      initializeAnimations();

    })
    .catch(error => {
      console.error("JSON読み込みまたは処理エラー:", error);
      const bodyElement = document.querySelector('body');
      if(bodyElement) {
          bodyElement.innerHTML = `<p style="color: #d14783; text-align: center; padding: 30px; font-family: 'Noto Serif JP', serif; font-size: 16px;">コンテンツの読み込みに失敗しました。<br>お手数ですが、しばらくしてから再度お試しください。</p>`;
      }
    });

  // アニメーション関連の関数
  function initializeAnimations() {

    // 1. 雲オーバーレイのアニメーション
    const cloudOverlay = document.getElementById('cloud-overlay');
    if (cloudOverlay) {
      anime({
        targets: cloudOverlay,
        opacity: [1, 0],
        duration: 2000,
        easing: 'easeInOutQuad',
        complete: () => {
          cloudOverlay.style.pointerEvents = 'none';
        }
      });
    }

    // 2. メインタイトルのアニメーション
    const namesElement = document.querySelector('.main-visual .names');
    if (namesElement) {
        // テキストを文字ごとにspanで囲む
        namesElement.innerHTML = namesElement.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

        anime.timeline({loop: false})
          .add({
            targets: '.main-visual .names .letter',
            translateY: [-100,0],
            opacity: [0,1],
            easing: "easeOutExpo",
            duration: 1400,
            delay: (el, i) => 30 * i + 1500 // 1.5秒後から開始
          });
    }

    // 3. スクロールに応じた表示アニメーション
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  }
});
