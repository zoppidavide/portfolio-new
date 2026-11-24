(function () {
    // Hover chip that follows the cursor with a little easing.
    // Any element with data-chip-label / data-chip-icon triggers it.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var EASE = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.16;

    var chip = document.createElement('div');
    chip.className = 'cursor-chip';
    chip.setAttribute('aria-hidden', 'true');
    chip.innerHTML = '<div class="cursor-chip-body"><img alt="" /><span></span></div>';
    document.body.appendChild(chip);

    var icon = chip.querySelector('img');
    var label = chip.querySelector('span');

    var target = { x: 0, y: 0 };
    var pos = { x: 0, y: 0 };
    var active = null;
    var running = false;

    function frame() {
        pos.x += (target.x - pos.x) * EASE;
        pos.y += (target.y - pos.y) * EASE;
        chip.style.transform = 'translate3d(' + pos.x.toFixed(1) + 'px,' + pos.y.toFixed(1) + 'px,0)';
        if (active || Math.abs(target.x - pos.x) > 0.1 || Math.abs(target.y - pos.y) > 0.1) {
            requestAnimationFrame(frame);
        } else {
            running = false;
        }
    }

    function run() {
        if (!running) {
            running = true;
            requestAnimationFrame(frame);
        }
    }

    function show(el, e) {
        active = el;
        label.textContent = el.getAttribute('data-chip-label');
        icon.src = el.getAttribute('data-chip-icon');
        // First appearance: start at the cursor instead of flying in from the last spot
        if (!chip.classList.contains('is-visible')) {
            pos.x = target.x = e.clientX;
            pos.y = target.y = e.clientY;
        }
        chip.classList.add('is-visible');
        run();
    }

    function hide() {
        active = null;
        chip.classList.remove('is-visible');
    }

    document.addEventListener('mousemove', function (e) {
        var el = e.target.closest && e.target.closest('[data-chip-label]');
        if (el) {
            if (el !== active) show(el, e);
            target.x = e.clientX;
            target.y = e.clientY;
            run();
        } else if (active) {
            hide();
        }
    });

    document.addEventListener('mouseleave', hide);
    window.addEventListener('blur', hide);
})();
