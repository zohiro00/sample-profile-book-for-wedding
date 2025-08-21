document.addEventListener("DOMContentLoaded", function () {
  // グローバルにコンテンツデータを保持
  window.weddingContentData = null;

  // コンテンツを適用するグローバル関数
  window.applyContentData = function(data) {
    if (!data) {
      console.error("No content data provided to apply.");
      return;
    }

    // テキストの反映
    for (const key in data.text) {
      const el = document.getElementById(key);
      if (el) {
        el.innerHTML = data.text[key];
      }
    }

    // パスの反映（画像）
    for (const key in data.path) {
      const el = document.getElementById(key);
      if (el && el.tagName === 'IMG') {
        el.setAttribute("src", data.path[key]);
      }
    }

    // ページのtitleも自動で設定
    if (data.text.title) {
      document.title = data.text.title;
    }
  }

  // パスワード認証（簡易）
  // if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {    const password = prompt("パスワードを入力してください:");
  //   if (password !== "0607") {
  //     alert("パスワードが間違っています。");
  //     document.body.innerHTML = "<p style='text-align:center; padding:50px;'>パスワードが違います。 エスコートカードを見てください。</p>";
  //     return; // 処理を中断
  //   }
  // }

  // JSONデータの読み込みと適用
  fetch("content.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      window.weddingContentData = data; // データをグローバルに保存
      window.applyContentData(window.weddingContentData); // コンテンツを適用

      // フェードインアニメーションの設定
      setupFadeInAnimation();

      // デフォルトのギャラリービューを設定
      if (window.setupGalleryView) {
        window.setupGalleryView('carousel');
      } else {
        console.warn('setupGalleryView is not available on initial load.');
      }

    })
    .catch(error => {
      console.error("JSON読み込みまたは処理エラー:", error);
      const bodyElement = document.querySelector('body');
      if(bodyElement) {
          bodyElement.innerHTML = `<p style="color: #d14783; text-align: center; padding: 30px; font-family: 'Noto Serif JP', serif; font-size: 16px;">コンテンツの読み込みに失敗しました。<br>お手数ですが、しばらくしてから再度お試しください。</p>`;
      }
    });

  // フェードインアニメーションの関数
  window.setupFadeInAnimation = function() {
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
          // observerInstance.unobserve(entry.target); // 表示後は監視解除
        }
      });
    }, observerOptions);

    fadeInElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Settings Icon Logic
  const settingsIcon = document.getElementById('settings-icon');

  if (settingsIcon) {
    // 1. Add click listener to reload
    settingsIcon.addEventListener('click', () => {
      location.reload();
    });

    // 2. Function to toggle visibility
    const toggleSettingsIconVisibility = () => {
      const dialog = document.getElementById('weddingDialog');
      if (dialog) {
        settingsIcon.classList.add('hidden');
      } else {
        settingsIcon.classList.remove('hidden');
      }
    };

    // 3. MutationObserver to watch for dialog
    const observer = new MutationObserver((mutationsList, observer) => {
      for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          // Check if nodes were added or removed
          toggleSettingsIconVisibility();
        }
      }
    });

    // Start observing the body for child list changes
    observer.observe(document.body, { childList: true });

    // 4. Initial check
    toggleSettingsIconVisibility();
  }
});