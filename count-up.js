(function () {
    // Numbers section: each .stat-value counts up from 0 once it scrolls into view.
    // data-count = final value, data-decimals, data-prefix and data-suffix are optional.
    var values = document.querySelectorAll('.stat-value[data-count]');
    if (!values.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // keep the final numbers

    var DURATION = 1800;

    function format(el, n) {
        var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        return (el.getAttribute('data-prefix') || '') + n.toFixed(decimals) + (el.getAttribute('data-suffix') || '');
    }

    function ease(t) { // ease-out expo
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function run(el) {
        var target = parseFloat(el.getAttribute('data-count'));
        var start = null;
        function step(now) {
            if (start === null) start = now;
            var p = Math.min((now - start) / DURATION, 1);
            el.textContent = format(el, target * ease(p));
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = format(el, target);
        }
        requestAnimationFrame(step);
    }

    values.forEach(function (el) { el.textContent = format(el, 0); });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var group = entry.target.querySelectorAll('.stat-value[data-count]');
            Array.prototype.forEach.call(group, function (el, i) {
                setTimeout(function () { run(el); }, i * 120);
            });
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.5 });

    var seen = [];
    values.forEach(function (el) {
        var box = el.closest('.detail-stats') || el;
        if (seen.indexOf(box) === -1) { seen.push(box); observer.observe(box); }
    });
})();
