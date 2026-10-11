(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var textSelector = [
        '.detail-title',
        '.detail-subtitle',
        '.detail-body',
        '.project-disclaimer',
        '.text-section',
        '.project-info'
    ].join(', ');

    var imageSelector = [
        '.project-image-wrapper',
        '.simple-image-wrapper',
        '.fluid-image-wrapper',
        '.video-wrapper',
        '.profile-image-wrapper'
    ].join(', ');

    function excludingNoReveal(el) { return !el.closest('.no-reveal'); }

    var textEls = Array.prototype.filter.call(document.querySelectorAll(textSelector), excludingNoReveal);
    var imageEls = Array.prototype.filter.call(document.querySelectorAll(imageSelector), excludingNoReveal);

    if (!textEls.length && !imageEls.length) return;

    textEls.forEach(function (el) { el.classList.add('reveal'); });
    imageEls.forEach(function (el) { el.classList.add('reveal-image'); });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    textEls.forEach(function (el) { observer.observe(el); });
    imageEls.forEach(function (el) { observer.observe(el); });
})();
