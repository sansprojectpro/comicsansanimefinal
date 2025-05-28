document.addEventListener('DOMContentLoaded', () => {
    const comicTitleReaderElement = document.getElementById('comic-title-reader');
    const chapterTitleElement = document.getElementById('chapter-title');
    const comicPagesElement = document.getElementById('comic-pages');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const chapterSelect = document.getElementById('chapter-select');
    const pageIndicatorElement = document.getElementById('page-indicator');

    let currentComicId = '';
    let currentChapterId = '';
    let currentPageIndex = 0;
    let currentComicData = null;
    let currentChapterPages = [];

    // Mengatur readerMode secara default ke 'continuous-scroll'
    let readerMode = 'continuous-scroll';

    // Ambil data komik dari localStorage
    const allComicsData = JSON.parse(localStorage.getItem('allComicsData')) || [];
    const comicsMap = new Map(allComicsData.map(comic => [comic.id, comic]));

    // Variabel untuk melacak status scroll
    let isScrollingToEnd = false; // Mencegah loop scroll tak terbatas

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    function generatePagesArray(chapterData) {
        const pages = [];
        if (chapterData && chapterData.pagesPath && chapterData.pageCount) {
            for (let i = 1; i <= chapterData.pageCount; i++) {
                const paddingLength = String(chapterData.pageCount).length;
                const pageNumber = String(i).padStart(paddingLength, '0');
                const fullPath = `${chapterData.pagesPath}${pageNumber}${chapterData.pageNameSuffix || ''}.${chapterData.pageExtension || 'jpg'}`;
                pages.push(fullPath);
            }
        }
        return pages;
    }

    function loadComicAndChapter(comicId, chapterId) {
        currentComicData = comicsMap.get(comicId);

        if (currentComicData) {
            comicTitleReaderElement.textContent = currentComicData.title;

            if (currentComicData.chapters && currentComicData.chapters[chapterId]) {
                currentComicId = comicId;
                currentChapterId = chapterId;
                currentChapterPages = generatePagesArray(currentComicData.chapters[chapterId]);

                chapterTitleElement.textContent = currentComicData.chapters[chapterId].title;
                currentPageIndex = 0;
                renderComicPages();
                updateNavigationControls();
                updateChapterDropdown();
                updatePageIndicator();
                window.scrollTo(0, 0); // Pastikan selalu scroll ke atas saat chapter baru dimuat
            } else {
                chapterTitleElement.textContent = 'Chapter Tidak Ditemukan';
                comicPagesElement.innerHTML = '<p>Maaf, chapter ini tidak tersedia untuk komik ini. <a href="index.html">Kembali ke Beranda</a></p>';
                prevPageBtn.style.display = 'none';
                nextPageBtn.style.display = 'none';
                chapterSelect.innerHTML = '<option value="">Chapter Tidak Tersedia</option>';
                chapterSelect.disabled = true;
                pageIndicatorElement.textContent = '';
            }
        } else {
            comicTitleReaderElement.textContent = 'Komik Tidak Ditemukan';
            chapterTitleElement.textContent = '';
            comicPagesElement.innerHTML = '<p>Maaf, komik ini tidak tersedia. <a href="index.html">Kembali ke Beranda</a></p>';
            prevPageBtn.style.display = 'none';
            nextPageBtn.style.display = 'none';
            chapterSelect.innerHTML = '<option value="">Komik Tidak Tersedia</option>';
            chapterSelect.disabled = true;
            pageIndicatorElement.textContent = '';
        }
    }

    function renderComicPages() {
        comicPagesElement.innerHTML = '';

        if (currentChapterPages.length === 0) {
            comicPagesElement.innerHTML = '<p>Tidak ada halaman untuk ditampilkan di chapter ini.</p>';
            return;
        }

        if (readerMode === 'per-page') {
            if (currentPageIndex >= 0 && currentPageIndex < currentChapterPages.length) {
                const pageImage = document.createElement('img');
                pageImage.src = currentChapterPages[currentPageIndex];
                pageImage.alt = `${currentComicData.title} - Halaman ${currentPageIndex + 1}`;
                pageImage.loading = 'eager';
                comicPagesElement.appendChild(pageImage);
            }
        } else if (readerMode === 'continuous-scroll') {
            currentChapterPages.forEach((src, index) => {
                const pageImage = document.createElement('img');
                pageImage.src = src;
                pageImage.alt = `${currentComicData.title} - Halaman ${index + 1}`;
                pageImage.loading = 'lazy';
                pageImage.classList.add('comic-page-image');
                comicPagesElement.appendChild(pageImage);
            });
        }
    }

    function updateNavigationControls() {
        if (readerMode === 'per-page') {
            prevPageBtn.style.display = '';
            nextPageBtn.style.display = '';
            prevPageBtn.disabled = currentPageIndex === 0;
            nextPageBtn.disabled = currentPageIndex === currentChapterPages.length - 1;
        } else {
            prevPageBtn.style.display = 'none';
            nextPageBtn.style.display = 'none';
        }
    }

    function updatePageIndicator() {
        if (readerMode === 'per-page' && currentChapterPages.length > 0) {
            pageIndicatorElement.textContent = `Halaman ${currentPageIndex + 1} dari ${currentChapterPages.length}`;
        } else {
            pageIndicatorElement.textContent = '';
        }
    }

    function updateChapterDropdown() {
        chapterSelect.innerHTML = '';
        if (currentComicData && currentComicData.chapters) {
            // Sort chapter keys to ensure numerical/sequential order for dropdown
            // This is important if chapter IDs are 'chapter1', 'chapter2', 'chapter1.5', etc.
            const sortedChapterKeys = Object.keys(currentComicData.chapters).sort((a, b) => {
                // Custom sorting for chapter IDs like 'chapter1', 'chapter1.5', 'chapter2'
                const parseChapterId = (id) => {
                    const match = id.match(/chapter(\d+)(\.\d+)?/);
                    if (match) {
                        return parseFloat(match[1]) + (match[2] ? parseFloat(match[2]) : 0);
                    }
                    return 0; // Default for non-matching patterns
                };
                return parseChapterId(a) - parseChapterId(b);
            });

            sortedChapterKeys.forEach(chapId => {
                const option = document.createElement('option');
                option.value = chapId;
                option.textContent = currentComicData.chapters[chapId].title;
                if (chapId === currentChapterId) {
                    option.selected = true;
                }
                chapterSelect.appendChild(option);
            });
            chapterSelect.disabled = false;
        } else {
            chapterSelect.disabled = true;
        }
    }

    // Event Listeners untuk navigasi halaman (hanya berlaku untuk mode per-page)
    prevPageBtn.addEventListener('click', () => {
        if (readerMode === 'per-page' && currentPageIndex > 0) {
            currentPageIndex--;
            renderComicPages();
            updateNavigationControls();
            updatePageIndicator();
            window.scrollTo(0, 0);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (readerMode === 'per-page' && currentPageIndex < currentChapterPages.length - 1) {
            currentPageIndex++;
            renderComicPages();
            updateNavigationControls();
            updatePageIndicator();
            window.scrollTo(0, 0);
        }
    });

    // Event Listener untuk perubahan chapter via dropdown
    chapterSelect.addEventListener('change', (event) => {
        const newChapterId = event.target.value;
        if (newChapterId) {
            window.history.pushState(null, '', `reader.html?comic=${currentComicId}&chapter=${newChapterId}`);
            loadComicAndChapter(currentComicId, newChapterId);
        }
    });

    // --- LOGIC BARU: SCROLL KE ATAS SAAT MENCAPAI AKHIR CHAPTER (Continuous Scroll) ---
    // Gunakan Intersection Observer untuk deteksi yang lebih efisien
    let observer;

    function setupIntersectionObserver() {
        if (readerMode !== 'continuous-scroll' || !comicPagesElement) return;

        // Pastikan observer sebelumnya di-disconnect
        if (observer) {
            observer.disconnect();
        }

        // Ambil elemen gambar terakhir
        const lastImage = comicPagesElement.querySelector('.comic-page-image:last-child');

        if (lastImage) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // Jika elemen terakhir sepenuhnya terlihat DAN kita tidak sedang dalam proses scroll
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.99 && !isScrollingToEnd) {
                        // isIntersecting: elemen masuk viewport
                        // intersectionRatio >= 0.99: memastikan elemen hampir atau sepenuhnya terlihat
                        // !isScrollingToEnd: mencegah trigger berulang saat sedang di-scroll otomatis
                        console.log('Reached end of chapter. Scrolling to top.');
                        isScrollingToEnd = true; // Set flag
                        setTimeout(() => { // Beri sedikit jeda agar user melihat chapter selesai
                            window.scrollTo({
                                top: 0,
                                behavior: 'smooth' // Gulir dengan animasi halus
                            });
                        }, 500); // Setengah detik jeda

                        // Setelah scroll selesai, reset flag
                        window.addEventListener('scrollend', function onScrollEnd() {
                            isScrollingToEnd = false;
                            window.removeEventListener('scrollend', onScrollEnd);
                        }, { once: true }); // event sekali jalan
                    }
                });
            }, {
                threshold: 0.99 // Trigger saat 99% dari elemen terlihat
            });

            observer.observe(lastImage);
        }
    }

    // Panggil observer setiap kali chapter dimuat (jika mode continuous)
    // Modifikasi fungsi loadComicAndChapter dan renderComicPages agar memanggil setupIntersectionObserver()
    const originalLoadComicAndChapter = loadComicAndChapter;
    loadComicAndChapter = (...args) => {
        originalLoadComicAndChapter(...args);
        if (readerMode === 'continuous-scroll') {
            // Beri sedikit waktu agar gambar terakhir ter-render
            setTimeout(setupIntersectionObserver, 300);
        }
    };
    // Mengubah currentPageIndex menjadi 0 sudah dilakukan di loadComicAndChapter.

    // Tambahkan pengurutan dropdown chapter agar chapter1.5 datang setelah chapter1
    // (Ini sudah ada di kode sebelumnya, tapi saya pastikan tetap di sini dan berfungsi)
    // Di dalam updateChapterDropdown:

    // Inisialisasi saat halaman dimuat
    const initialComicId = getQueryParam('comic');
    const initialChapterId = getQueryParam('chapter');

    if (initialComicId && initialChapterId) {
        loadComicAndChapter(initialComicId, initialChapterId);
    } else {
        comicTitleReaderElement.textContent = 'Terjadi Kesalahan';
        chapterTitleElement.innerHTML = 'Parameter komik atau chapter tidak ditemukan di URL. Silakan kembali ke halaman <a href="index.html">Beranda</a> dan pilih komik yang ingin dibaca.';
        comicPagesElement.innerHTML = '';
        prevPageBtn.style.display = 'none';
        nextPageBtn.style.display = 'none';
        chapterSelect.disabled = true;
        pageIndicatorElement.textContent = '';
    }
});
