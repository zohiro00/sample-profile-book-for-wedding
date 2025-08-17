// ダイアログ機能のJavaScript

class WeddingDialog {
  constructor() {
    this.selectedSite = 'site1';
    this.selectedPalette = 'pink';
    this.uploadedImage = null;
    this.init();
  }

  init() {
    this.createDialog();
    this.bindEvents();
    this.showDialog();
  }

  createDialog() {
    const dialogHTML = `
      <div class="dialog-overlay" id="weddingDialog">
        <div class="dialog-content">
          <div class="dialog-header">
            <h2 class="dialog-title">ウェディングサイト設定</h2>
            <p class="dialog-subtitle">
              このサイトはサンプルです。<br>
              個人情報は収集していません。<br>
              <br>
              画面下部の「OK」ボタンをクリックしてください。<br>
              内容変更したい場合は、リロードしてください。<br>
            </p>
          </div>

          <div class="dialog-section">
            <h3 class="dialog-section-title">サイトデザインを選択</h3>
            <div class="site-selection">
              <div class="site-option selected" data-site="site1">
                サンプル1
              </div>
              <div class="site-option" data-site="site2">
                サンプル2
              </div>
              <div class="site-option" data-site="site3">
                サンプル3
              </div>
            </div>
          </div>

          <div class="dialog-section">
            <h3 class="dialog-section-title">カップル写真をアップロード</h3>
            <div class="image-upload-area" id="imageUploadArea">
              <div class="upload-icon">📷</div>
              <div class="upload-text">クリックまたはドラッグ&ドロップで<br>画像をアップロード</div>
              <div class="upload-text">サンプル画像を使用する場合は不要</div>
              <input type="file" class="file-input" id="imageInput" accept="image/*">
            </div>
          </div>

          <div class="dialog-section">
            <h3 class="dialog-section-title">カラーパレットを選択</h3>
            <div class="color-palette-grid">
              <div class="color-palette-option selected" data-palette="pink">
                <div class="palette-preview">
                  <div class="palette-color" style="background-color: #d14783;"></div>
                  <div class="palette-color" style="background-color: #ffb6c1;"></div>
                  <div class="palette-color" style="background-color: #fff0f5;"></div>
                </div>
                <div class="palette-name">ピンク</div>
              </div>
              <div class="color-palette-option" data-palette="blue">
                <div class="palette-preview">
                  <div class="palette-color" style="background-color: #4a90e2;"></div>
                  <div class="palette-color" style="background-color: #87ceeb;"></div>
                  <div class="palette-color" style="background-color: #f0f8ff;"></div>
                </div>
                <div class="palette-name">ブルー</div>
              </div>
              <div class="color-palette-option" data-palette="green">
                <div class="palette-preview">
                  <div class="palette-color" style="background-color: #5cb85c;"></div>
                  <div class="palette-color" style="background-color: #90ee90;"></div>
                  <div class="palette-color" style="background-color: #f0fff0;"></div>
                </div>
                <div class="palette-name">グリーン</div>
              </div>
              <div class="color-palette-option" data-palette="purple">
                <div class="palette-preview">
                  <div class="palette-color" style="background-color: #8e44ad;"></div>
                  <div class="palette-color" style="background-color: #dda0dd;"></div>
                  <div class="palette-color" style="background-color: #f8f0ff;"></div>
                </div>
                <div class="palette-name">パープル</div>
              </div>
              <div class="color-palette-option" data-palette="orange">
                <div class="palette-preview">
                  <div class="palette-color" style="background-color: #ff8c00;"></div>
                  <div class="palette-color" style="background-color: #ffa500;"></div>
                  <div class="palette-color" style="background-color: #fff8dc;"></div>
                </div>
                <div class="palette-name">オレンジ</div>
              </div>
              <div class="color-palette-option" data-palette="teal">
                <div class="palette-preview">
                  <div class="palette-color" style="background-color: #20b2aa;"></div>
                  <div class="palette-color" style="background-color: #afeeee;"></div>
                  <div class="palette-color" style="background-color: #f0ffff;"></div>
                </div>
                <div class="palette-name">ティール</div>
              </div>
            </div>
          </div>

          <div class="dialog-buttons">
            <button class="dialog-button primary" id="applySettings">OK</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', dialogHTML);
  }

  bindEvents() {
    // サイト選択
    document.querySelectorAll('.site-option').forEach(option => {
      option.addEventListener('click', (e) => {
        document.querySelectorAll('.site-option').forEach(opt => opt.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedSite = e.target.dataset.site;
      });
    });

    // カラーパレット選択
    document.querySelectorAll('.color-palette-option').forEach(option => {
      option.addEventListener('click', (e) => {
        document.querySelectorAll('.color-palette-option').forEach(opt => opt.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        this.selectedPalette = e.currentTarget.dataset.palette;
      });
    });

    // 画像アップロード
    const uploadArea = document.getElementById('imageUploadArea');
    const fileInput = document.getElementById('imageInput');

    uploadArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
      this.handleImageUpload(e.target.files[0]);
    });

    // ドラッグ&ドロップ
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      this.handleImageUpload(e.dataTransfer.files[0]);
    });

    // OK ボタン
    document.getElementById('applySettings').addEventListener('click', () => {
      this.applySettings();
    });
  }

  handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください。');
      return;
    }

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズが大きすぎます。5MB以下の画像を選択してください。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedImage = e.target.result;
      
      // プレビュー表示
      const uploadArea = document.getElementById('imageUploadArea');
      uploadArea.innerHTML = `
        <img src="${this.uploadedImage}" class="preview-image" alt="アップロード画像">
        <div class="upload-text">画像がアップロードされました</div>
        <button class="change-image-btn" onclick="document.getElementById('imageInput').click()">画像を変更</button>
      `;
    };
    reader.readAsDataURL(file);
  }

  applySettings() {
    // カラーパレットを適用
    this.applyColorPalette();
    
    // 画像を置き換え
    if (this.uploadedImage) {
      this.replaceImage();
    }
    
    // サイトデザインを適用
    this.applySiteDesign();
    
    // ダイアログを閉じる
    this.hideDialog();
  }

  applyColorPalette() {
    const palettes = {
      pink: {
        primary: '#d14783',
        secondary: '#ffb6c1',
        background: '#fff0f5',
        accent: '#c75c8b'
      },
      blue: {
        primary: '#4a90e2',
        secondary: '#87ceeb',
        background: '#f0f8ff',
        accent: '#2c5aa0'
      },
      green: {
        primary: '#5cb85c',
        secondary: '#90ee90',
        background: '#f0fff0',
        accent: '#449d44'
      },
      purple: {
        primary: '#8e44ad',
        secondary: '#dda0dd',
        background: '#f8f0ff',
        accent: '#7d3c98'
      },
      orange: {
        primary: '#ff8c00',
        secondary: '#ffa500',
        background: '#fff8dc',
        accent: '#e67e22'
      },
      teal: {
        primary: '#20b2aa',
        secondary: '#afeeee',
        background: '#f0ffff',
        accent: '#17a2b8'
      }
    };

    const colors = palettes[this.selectedPalette];
    
    // CSS変数を設定
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--background-color', colors.background);
    document.documentElement.style.setProperty('--accent-color', colors.accent);

    // 既存の色を動的に変更
    this.updateElementColors(colors);
  }

  updateElementColors(colors) {
    // CSS変数を更新
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--background-color', colors.background);
    document.documentElement.style.setProperty('--accent-color', colors.accent);
    document.documentElement.style.setProperty('--light-text-color', colors.secondary);

    // 追加で直接スタイルを適用する要素（CSS変数でカバーできない部分）
    const timelineIcons = document.querySelectorAll('.timeline-icon');
    timelineIcons.forEach(icon => {
      icon.style.backgroundColor = colors.background;
      icon.style.borderColor = colors.secondary;
    });

    const episodeCards = document.querySelectorAll('.episode-card');
    episodeCards.forEach(card => {
      card.style.backgroundColor = colors.background;
      card.style.borderLeftColor = colors.secondary;
    });

    const qaItems = document.querySelectorAll('.qa-item');
    qaItems.forEach(item => {
      item.style.borderBottomColor = colors.secondary;
    });

    const qaIcons = document.querySelectorAll('.qa-icon');
    qaIcons.forEach(icon => {
      icon.style.color = colors.secondary;
    });
  }

  replaceImage() {
    const couplePhoto = document.getElementById('couple-photo');
    if (couplePhoto) {
      couplePhoto.src = this.uploadedImage;
    }
  }

  applySiteDesign() {
    // サイトデザインに応じてCSSクラスを追加
    document.body.className = `site-${this.selectedSite}`;
    
    // 選択されたサイトに応じて追加のスタイルを適用
    if (this.selectedSite === 'site2') {
      this.applySite2Styles();
    } else if (this.selectedSite === 'site3') {
      this.applySite3Styles();
    }
  }

  applySite2Styles() {
    // サイト2用のスタイルを動的に適用
    const style = document.createElement('style');
    style.textContent = `
      .site-site2 .overlay-content-card {
        border-radius: 0;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      }
      .site-site2 .wedding-title {
        font-family: 'M PLUS Rounded 1c', sans-serif;
        text-transform: uppercase;
        letter-spacing: 3px;
      }
      .site-site2 .profile-card {
        border-radius: 0;
        border-left: 5px solid var(--primary-color, #d14783);
      }
    `;
    document.head.appendChild(style);
  }

  applySite3Styles() {
    // サイト3用のスタイルを動的に適用
    const style = document.createElement('style');
    style.textContent = `
      .site-site3 .overlay-content-card {
        border-radius: 50px;
        border: 3px solid var(--secondary-color, #ffb6c1);
      }
      .site-site3 .wedding-title {
        font-family: 'Cormorant Garamond', serif;
        font-style: italic;
        transform: rotate(-2deg);
      }
      .site-site3 .profile-card {
        border-radius: 25px;
        transform: rotate(1deg);
      }
      .site-site3 .profile-card:nth-child(even) {
        transform: rotate(-1deg);
      }
    `;
    document.head.appendChild(style);
  }

  showDialog() {
    const dialog = document.getElementById('weddingDialog');
    setTimeout(() => {
      dialog.classList.add('show');
    }, 100);
  }

  hideDialog() {
    const dialog = document.getElementById('weddingDialog');
    dialog.classList.remove('show');
    setTimeout(() => {
      dialog.remove();
    }, 300);
  }
}

// ページ読み込み完了後にダイアログを表示
document.addEventListener('DOMContentLoaded', () => {
  // 既存のコンテンツ読み込み後にダイアログを表示
  setTimeout(() => {
    new WeddingDialog();
  }, 500);
});

