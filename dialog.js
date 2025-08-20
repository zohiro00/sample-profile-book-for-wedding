// ダイアログ機能のJavaScript

const siteDesigns = [
  { id: 'site1', name: 'サンプル1', className: 'design-default' },
  { id: 'site2', name: 'サンプル2', className: 'design-stylish-mono' },
  { id: 'site3', name: 'サンプル3', className: 'design-elegant' }
];

class WeddingDialog {
  constructor() {
    this.siteDesigns = siteDesigns;
    this.selectedSite = this.siteDesigns[0].id;
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
    const siteOptionsHTML = this.siteDesigns.map((design, index) => `
      <div class="site-option ${index === 0 ? 'selected' : ''}" data-site="${design.id}">
        ${design.name}
      </div>
    `).join('');

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
              ${siteOptionsHTML}
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
        accent: '#c75c8b',
        textColor: '#7d415d'
      },
      blue: {
        primary: '#4a90e2',
        secondary: '#87ceeb',
        background: '#f0f8ff',
        accent: '#2c5aa0',
        textColor: '#1c3d5a'
      },
      green: {
        primary: '#5cb85c',
        secondary: '#90ee90',
        background: '#f0fff0',
        accent: '#449d44',
        textColor: '#2e6b2e'
      },
      purple: {
        primary: '#8e44ad',
        secondary: '#dda0dd',
        background: '#f8f0ff',
        accent: '#7d3c98',
        textColor: '#5a2d6e'
      },
      orange: {
        primary: '#ff8c00',
        secondary: '#ffa500',
        background: '#fff8dc',
        accent: '#e67e22',
        textColor: '#8B4513'
      },
      teal: {
        primary: '#20b2aa',
        secondary: '#afeeee',
        background: '#f0ffff',
        accent: '#17a2b8',
        textColor: '#004d4d'
      }
    };

    const colors = palettes[this.selectedPalette];
    
    this.updateElementColors(colors);
  }

  updateElementColors(colors) {
    // CSS変数を更新
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--secondary-color', colors.secondary);
    document.documentElement.style.setProperty('--background-color', colors.background);
    document.documentElement.style.setProperty('--accent-color', colors.accent);
    document.documentElement.style.setProperty('--text-color', colors.textColor);
    document.documentElement.style.setProperty('--light-text-color', colors.secondary);
  }

  replaceImage() {
    const couplePhoto = document.getElementById('couple-photo');
    if (couplePhoto) {
      couplePhoto.src = this.uploadedImage;
    }
  }

  applySiteDesign() {
    const selectedDesign = this.siteDesigns.find(d => d.id === this.selectedSite);
    if (!selectedDesign) {
      console.warn(`Site design with id "${this.selectedSite}" not found.`);
      return;
    }

    // 既存のデザインクラスをすべて削除
    this.siteDesigns.forEach(design => {
      document.body.classList.remove(design.className);
    });

    // 新しいデザインクラスを追加
    document.body.classList.add(selectedDesign.className);
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

