document.addEventListener('DOMContentLoaded', () => {

    // --- content.json からデータを読み込む ---
    fetch('../content.json')
        .then(response => response.json())
        .then(data => {
            const venueName = data.text['venue-name'];
            const titleElement = document.querySelector('.isometric-title');
            if (titleElement && venueName) {
                // 各文字をspanで囲む（空白はそのまま）
                titleElement.innerHTML = venueName.split('').map(char =>
                    char === ' ' ? ' ' : `<span class="letter">${char}</span>`
                ).join('');

                // アニメーションの監視を開始
                observeTitleAnimation();
            }
        });

    // --- タイトルアニメーションの監視 ---
    const observeTitleAnimation = () => {
        const titleObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    anime.timeline({
                        easing: 'easeOutExpo',
                    })
                    .add({
                        targets: '.isometric-title .letter',
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 800,
                        delay: anime.stagger(50) // 50msごとに次の文字をアニメーション
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // 50%見えたらトリガー

        const target = document.querySelector('.isometric-title');
        if (target) {
            titleObserver.observe(target);
        }
    };


    // --- セクション1: イントロダクションのアニメーション ---
    const introTimeline = anime.timeline({
        easing: 'easeOutExpo',
    });

    introTimeline
        .add({
            targets: '.wedding-title',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1200,
        })
        .add({
            targets: '.initials',
            opacity: [0, 1],
            scale: [0.5, 1],
            duration: 1200,
        })
        .add({
            targets: '.initials',
            opacity: 0,
            duration: 800,
            delay: 500,
        })
        .add({
            targets: '.wedding-logo',
            opacity: [0, 1],
            scale: [0.2, 1],
            duration: 1000,
        }, '-=800') //前のアニメーションの途中から開始
        .add({
            targets: '.wedding-logo',
            opacity: 0,
            duration: 800,
            delay: 800,
        });


    // --- Intersection Observer の設定 ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // 10%要素が見えたらトリガー
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;

                // --- セクション2: Story のアニメーション ---
                if (target.classList.contains('timeline-item')) {
                    anime({
                        targets: target,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 800,
                        easing: 'easeOutExpo',
                        delay: target.dataset.index * 200 // data-indexに基づいて遅延
                    });
                }

                // --- セクション3: Gallery のアニメーション ---
                if (target.classList.contains('gallery-item')) {
                    anime({
                        targets: target,
                        opacity: [0, 1],
                        translateX: [anime.random(-100, 100), 0],
                        translateY: [anime.random(-100, 100), 0],
                        rotate: [anime.random(-45, 45), 0],
                        scale: [0.8, 1],
                        duration: 1200,
                        easing: 'spring(1, 80, 10, 0)',
                    });
                }

                observer.unobserve(target); // 一度アニメーションしたら監視を解除
            }
        });
    }, observerOptions);


    // --- 監視対象の要素を取得 ---
    const storyItems = document.querySelectorAll('.timeline-item');
    storyItems.forEach((item, index) => {
        item.dataset.index = index; // 遅延用にインデックスを付与
        observer.observe(item);
    });

    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        observer.observe(item);
    });


    // --- セクション3: Gallery のホバーエフェクト ---
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            anime({
                targets: item,
                scale: 1.1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });

        item.addEventListener('mouseleave', () => {
            anime({
                targets: item,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });

});
