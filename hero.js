(function () {
    var hero = document.getElementById('hero');
    if (!hero || !document.documentElement.classList.contains('hero-anim')) return;

    var EXTRA_DELAY = 2200; // photo and emoji open up this long after the title starts

    // Title only: every letter sits in its own mask (.w) and slides up, one after the other.
    // Words stay unbreakable (.word); the photo and the emoji are left untouched.
    var title = hero.querySelector('h1.hero-line');
    if (!title) return;

    var index = 0;
    Array.prototype.slice.call(title.childNodes).forEach(function (child) {
        if (child.nodeType !== 3) return;
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(part));
                return;
            }
            var word = document.createElement('span');
            word.className = 'word';
            Array.from(part).forEach(function (letter) {
                var mask = document.createElement('span');
                var inner = document.createElement('span');
                mask.className = 'w';
                inner.className = 'w-in';
                inner.style.setProperty('--i', index++);
                inner.textContent = letter;
                mask.appendChild(inner);
                word.appendChild(mask);
            });
            frag.appendChild(word);
        });
        title.replaceChild(frag, child);
    });
    title.setAttribute('aria-label', title.textContent);
    title.classList.add('is-split');

    function play() {
        hero.classList.add('is-in');
        setTimeout(function () { hero.classList.add('is-extra'); }, EXTRA_DELAY);
    }

    // Wait for the fonts so the letters don't jump when Funnel Display swaps in.
    var started = false;
    function start() {
        if (started) return;
        started = true;
        void hero.offsetWidth; // commit the hidden start state before the transition begins
        play();
    }
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(start);
        setTimeout(start, 1500);
    } else {
        start();
    }
})();
