document.addEventListener('DOMContentLoaded', () => {
    const comicTitleReaderElement = document.getElementById('comic-title-reader');
    const chapterTitleElement = document.getElementById('chapter-title');
    const comicPagesElement = document.getElementById('comic-pages');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const chapterSelect = document.getElementById('chapter-select');

    let currentComicId = '';
    let currentChapterId = '';
    let currentPageIndex = 0; // Menggunakan index, dimulai dari 0
    let currentComicData = null;
    let currentChapterPages = []; // Akan berisi array path gambar yang digenerate

    // Ambil data komik dari localStorage
    const allComicsData = JSON.parse(localStorage.getItem('allComicsData')) || [];
    const comicsMap = new Map(allComicsData.map(comic => [comic.id, comic]));

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Fungsi untuk menghasilkan array path halaman berdasarkan data chapter
    function generatePagesArray(chapterData) {
        const pages = [];
        if (chapterData && chapterData.pagesPath && chapterData.pageCount) {
            for (let i = 1; i <= chapterData.pageCount; i++) {
                // Perbaiki padding agar sesuai dengan jumlah digit halaman terbanyak.
                // Misal, jika pageCount 40, angka tertinggi 40 (2 digit).
                // Jika pageCount 120, angka tertinggi 120 (3 digit).
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
                
                // Panggil generatePagesArray untuk mengisi currentChapterPages
                currentChapterPages = generatePagesArray(currentComicData.chapters[chapterId]);
                
                chapterTitleElement.textContent = currentComicData.chapters[chapterId].title;
                currentPageIndex = 0; // Selalu mulai dari halaman pertama chapter baru
                renderPage();
                updateNavigationControls();
                updateChapterDropdown();
            } else {
                chapterTitleElement.textContent = 'Chapter Tidak Ditemukan';
                comicPagesElement.innerHTML = '<p>Maaf, chapter ini tidak tersedia untuk komik ini. <a href="index.html">Kembali ke Beranda</a></p>';
                prevPageBtn.disabled = true;
                nextPageBtn.disabled = true;
                chapterSelect.innerHTML = '<option value="">Chapter Tidak Tersedia</option>';
                chapterSelect.disabled = true; // Nonaktifkan dropdown
            }
        } else {
            comicTitleReaderElement.textContent = 'Komik Tidak Ditemukan';
            chapterTitleElement.textContent = '';
            comicPagesElement.innerHTML = '<p>Maaf, komik ini tidak tersedia. <a href="index.html">Kembali ke Beranda</a></p>';
            prevPageBtn.disabled = true;
            nextPageBtn.disabled = true;
            chapterSelect.innerHTML = '<option value="">Komik Tidak Tersedia</option>';
            chapterSelect.disabled = true; // Nonaktifkan dropdown
        }
    }

    function renderPage() {
        comicPagesElement.innerHTML = ''; // Bersihkan konten sebelumnya
        if (currentChapterPages.length > 0 && currentPageIndex >= 0 && currentPageIndex < currentChapterPages.length) {
            const pageImage = document.createElement('img');
            pageImage.src = currentChapterPages[currentPageIndex];
            pageImage.alt = `${currentComicData.title} - Halaman ${currentPageIndex + 1}`;
            comicPagesElement.appendChild(pageImage);
        } else {
            // Tampilkan pesan jika tidak ada halaman atau indeks di luar batas
            comicPagesElement.innerHTML = '<p>Tidak ada halaman untuk ditampilkan di chapter ini.</p>';
        }
    }

    function updateNavigationControls() {
        // Tombol sebelumnya dinonaktifkan jika di halaman pertama (index 0)
        prevPageBtn.disabled = currentPageIndex === 0;
        // Tombol selanjutnya dinonaktifkan jika di halaman terakhir
        nextPageBtn.disabled = currentPageIndex === currentChapterPages.length - 1;
    }

    function updateChapterDropdown() {
        chapterSelect.innerHTML = ''; // Bersihkan dropdown
        if (currentComicData && currentComicData.chapters) {
            for (const chapId in currentComicData.chapters) {
                const option = document.createElement('option');
                option.value = chapId;
                option.textContent = currentComicData.chapters[chapId].title;
                if (chapId === currentChapterId) {
                    option.selected = true;
                }
                chapterSelect.appendChild(option);
            }
            chapterSelect.disabled = false; // Aktifkan dropdown jika ada chapter
        } else {
            chapterSelect.disabled = true; // Nonaktifkan jika tidak ada chapter
        }
    }

    // Event Listeners untuk navigasi halaman
    prevPageBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            renderPage();
            updateNavigationControls();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        // Pastikan ada halaman selanjutnya yang bisa diakses
        if (currentPageIndex < currentChapterPages.length - 1) {
            currentPageIndex++;
            renderPage();
            updateNavigationControls();
        }
    });

    // Event Listener untuk perubahan chapter via dropdown
    chapterSelect.addEventListener('change', (event) => {
        const newChapterId = event.target.value;
        if (newChapterId) { // Pastikan chapter yang dipilih bukan opsi kosong
            // Perbarui URL browser tanpa memuat ulang halaman penuh
            window.history.pushState(null, '', `reader.html?comic=${currentComicId}&chapter=${newChapterId}`);
            loadComicAndChapter(currentComicId, newChapterId);
        }
    });

    // Inisialisasi saat halaman dimuat
    const initialComicId = getQueryParam('comic');
    const initialChapterId = getQueryParam('chapter');

    if (initialComicId && initialChapterId) {
        // Jika parameter ada, coba muat komik dan chapter
        loadComicAndChapter(initialComicId, initialChapterId);
    } else {
        // Tampilkan pesan error dan nonaktifkan kontrol jika parameter URL tidak lengkap
        comicTitleReaderElement.textContent = 'Terjadi Kesalahan';
        chapterTitleElement.innerHTML = 'Parameter komik atau chapter tidak ditemukan di URL. Silakan kembali ke halaman <a href="index.html">Beranda</a> dan pilih komik yang ingin dibaca.';
        comicPagesElement.innerHTML = ''; // Kosongkan area halaman
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        chapterSelect.disabled = true;
    }
});