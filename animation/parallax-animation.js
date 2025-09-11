document.addEventListener('DOMContentLoaded', () => {

    // --- セクション1: V2 イントロダクションのアニメーション ---
    const introTimeline = anime.timeline({
        easing: 'easeInOutExpo',
    });

    introTimeline
        .add({
            targets: '.wedding-title',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 1200,
        }, '-=800')
        .add({
            targets: '.initials',

            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 1500,
        })
        .add({
            targets: '.intro-profile-photo',
            opacity: 0,
            duration: 1000,
            delay: 1000, // しばらく表示
        })
        .add({
            targets: '.transition-wipe',
            scaleY: [0, 1],
            transformOrigin: 'bottom',
            duration: 800,
            complete: () => {
                // ワイプが完了したら、要素の状態を切り替える
                document.querySelector('.intro-profile-photo').style.display = 'none';
                document.querySelector('.intro-part-2').style.opacity = 1;
            }
        }, '-=500') // プロフィール写真のフェードアウトと同時に開始
        .add({
            targets: '.transition-wipe',
            scaleY: [1, 0],
            transformOrigin: 'top',
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
