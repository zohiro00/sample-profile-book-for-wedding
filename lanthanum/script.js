document.addEventListener("DOMContentLoaded", function () {
  // JSONデータの読み込みと適用
  fetch("../content.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // 1. テキストコンテンツを反映
      try {
        for (const key in data.text) {
          const el = document.getElementById(key);
          if (el) {
            el.innerHTML = data.text[key];
          }
        }
      } catch (e) {
        console.error("Error setting text content:", e);
        throw e; // Re-throw to be caught by the outer catch
      }

      // 2. 画像パスとその他のパスを反映
      try {
        for (const key in data.path) {
          const el = document.getElementById(key);
          if (el && el.tagName === 'IMG') {
            el.setAttribute("src", `../${data.path[key]}`);
          } else if (key.startsWith('lanthanum-bg') || key.startsWith('lanthanum-footer')) {
            document.documentElement.style.setProperty(`--${key}`, `url('../${data.path[key]}')`);
          }
        }
      } catch (e) {
        console.error("Error setting paths:", e);
        throw e;
      }

      // 3. ページのtitleも自動で設定
      if (data.text.title) {
        document.title = data.text.title;
      }

      // 4. 動的コンテンツの追加
      try {
        populateTimeline(data.text.timeline_items);
      } catch (e) {
        console.error("Error in populateTimeline:", e);
        throw e;
      }

      // 5. アニメーションの初期化
      try {
        initializeAnimations();
      } catch (e) {
        console.error("Error in initializeAnimations:", e);
        throw e;
      }

    })
    .catch(error => {
      console.error("Top-level catch:", error);
      const bodyElement = document.querySelector('body');
      if(bodyElement) {
          bodyElement.innerHTML = `<p style="color: #d14783; text-align: center; padding: 30px; font-family: 'Noto Serif JP', serif; font-size: 16px;">コンテンツの読み込みに失敗しました。<br>お手数ですが、しばらくしてから再度お試しください。</p>`;
      }
    });

  // アニメーション関連の関数
  function initializeAnimations() {
    const cloudOverlay = document.getElementById('cloud-overlay');
    if (cloudOverlay) {
      anime({
        targets: cloudOverlay,
        opacity: [1, 0],
        duration: 3000,
        easing: 'easeInOutQuad',
        complete: () => {
          cloudOverlay.style.pointerEvents = 'none';
        }
      });
    }
    const namesElement = document.querySelector('.main-visual .names');
    if (namesElement) {
        namesElement.innerHTML = namesElement.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
        anime.timeline({loop: false})
          .add({
            targets: '.main-visual .names .letter',
            translateY: [-100,0],
            opacity: [0,1],
            easing: "easeOutExpo",
            duration: 1400,
            delay: (el, i) => 30 * i + 1500
          });
    }
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

  function populateTimeline(timelineItems) {
    const container = document.getElementById('timeline-container');
    if (!container || !timelineItems) return;
    const iconMap = {
      "披露宴開始": "home", "ケーキ入刀": "cake", "再入場": "videocam",
      "余興": "golf_course", "お開き": "logout"
    };
    let timelineHTML = '';
    timelineItems.forEach(item => {
      const iconKey = Object.keys(iconMap).find(key => item.event.includes(key)) || '披露宴開始';
      const iconName = iconMap[iconKey];
      const iconFile = `${iconName}_35dp_E3E3E3_FILL0_wght400_GRAD0_opsz40.svg`;
      timelineHTML += `
        <div class="timeline-item">
          <div class="timeline-icon">
            <img src="../images/${iconFile}" alt="Timeline Icon" />
          </div>
          <div class="timeline-content">
            <h4>${item.time}</h4>
            <p>${item.event}</p>
          </div>
        </div>`;
    });
    container.innerHTML = timelineHTML;
  }
});
