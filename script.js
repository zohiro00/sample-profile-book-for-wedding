document.addEventListener("DOMContentLoaded", function () {
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
      // テキストの反映
      for (const key in data.text) {
        const el = document.getElementById(key);
        if (el) {
          el.innerHTML = data.text[key]; // HTMLタグを許可
        } else {
          console.warn(`Element with ID "${key}" not found for text content.`);
        }
      }

      // パスの反映（画像）
      for (const key in data.path) {
        const el = document.getElementById(key);
        if (el && el.tagName === 'IMG') {
          el.setAttribute("src", data.path[key]);
        } else if (el) {
           console.warn(`Element with ID "${key}" is not an IMG tag but path was provided.`);
        } else {
          console.warn(`Element with ID "${key}" not found for image path.`);
        }
      }

      // ページのtitleも自動で設定
      if (data.text.title) {
        document.title = data.text.title;
      }

      // フェードインアニメーションの設定
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
          // observerInstance.unobserve(entry.target); // 表示後は監視解除
        }
      });
    }, observerOptions);

    fadeInElements.forEach(el => {
      observer.observe(el);
    });
  }
});