(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var AMOUNT = 0.05; // image overscan / max shift, as a fraction of wrapper height
    var wrappers = Array.prototype.slice.call(document.querySelectorAll('.project-image-wrapper'));
    var items = [];

    wrappers.forEach(function (wrapper) {
        var img = wrapper.querySelector('.project-image');
        if (!img) return;
        wrapper.classList.add('parallax');
        items.push({ wrapper: wrapper, img: img });
    });

    if (!items.length) return;

    var ticking = false;

    function update() {
        ticking = false;
        var vh = window.innerHeight;
        items.forEach(function (item) {
            var rect = item.wrapper.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > vh) return;
            // -1 when the wrapper enters at the bottom, +1 when it leaves at the top
            var progress = 1 - ((rect.top + rect.height / 2) / (vh / 2));
            progress = Math.max(-1, Math.min(1, progress));
            item.img.style.translate = '0 ' + (progress * AMOUNT * rect.height).toFixed(1) + 'px';
        });
    }

    function requestUpdate() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('load', requestUpdate);
    update();
})();
