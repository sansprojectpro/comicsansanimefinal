document.addEventListener('DOMContentLoaded', () => {
    const latestComicsGrid = document.getElementById('latest-comics-grid');
    const allComicsGrid = document.getElementById('all-comics-grid');
    const comicSearchInput = document.getElementById('comic-search'); // Ambil elemen input pencarian
    const searchButton = document.getElementById('search-button'); // Ambil elemen tombol pencarian

    // Elemen filter dan pengurutan baru
    const genreFilterSelect = document.getElementById('genre-filter');
    const statusFilterSelect = document.getElementById('status-filter');
    const sortOrderSelect = document.getElementById('sort-order');

    // **Data Komik Global (Definisi untuk semua komik dan chapter)**
    // Ini adalah data simulasi. Di aplikasi nyata, ini akan datang dari API/database.
    const allComicsData = [
        {
            id: 'Sakamoto Days',
            title: 'Sakamoto Days',
            genre: ['Aksi', 'Komedi', 'Thriller'],
            status: 'Ongoing',
            sinopsis: 'Taro Sakamoto adalah pembunuh utama, ditakuti oleh penjahat dan dikagumi oleh pembunuh bayaran. Tapi suatu hari … dia jatuh cinta! Pensiun, menikah, menjadi ayah, dan kemudian … Sakamoto bertambah gemuk! Pria gemuk yang menjalankan toko lingkungan sebenarnya adalah mantan pembunuh bayaran legendaris! Bisakah dia melindungi keluarganya dari bahaya? Bersiaplah untuk mengalami serial komedi aksi jenis baru!',
            thumbnail: 'comics/Sakamoto Days/sakamotodays.jpg',
            isLatest: true,
            chapters: {
                'chapter1': { title: 'Chapter 1: Keluarga Baru', pagesPath: 'comics/Sakamoto Days/chapter1/', pageCount: 20, pageNameSuffix: '', pageExtension: 'jpg' },
                'chapter2': { title: 'Chapter 2: Kembali Beraksi', pagesPath: 'comics/Sakamoto Days/chapter2/', pageCount: 22, pageNameSuffix: '', pageExtension: 'jpg' },
                'chapter3': { title: 'Chapter 3: Ujian Pertama', pagesPath: 'comics/Sakamoto Days/chapter3/', pageCount: 18, pageNameSuffix: '', pageExtension: 'jpg' }
            }
        },
        {
            id: 'Tokyo Revengers',
            title: 'Tokyo Revengers',
            genre: ['Aksi', 'Sci-Fi', 'Drama'],
            status: 'Ongoing',
            sinopsis: 'Hanagaki Takemichi kembali ke masa lalu untuk menyelamatkan kekasihnya dari geng Tokyo Manji. Bisakah dia mengubah takdir?',
            thumbnail: 'comics/Tokyo Revengers/Tokyo Revengers.png',
            isLatest: false,
            chapters: {
                'chapter1': { title: 'Chapter 1: Tokyo Revengers', pagesPath: 'comics/Tokyo Revengers/chapter1/', pageCount: 65, pageNameSuffix: '.kiryuu.id', pageExtension: 'jpg' },
                'chapter2': { title: 'Chapter 2: Tokyo Revengers', pagesPath: 'comics/Tokyo Revengers/chapter2/', pageCount: 45, pageNameSuffix: '.kiryuu.id', pageExtension: 'jpg' },
                'chapter3': { title: 'Chapter 3: Tokyo Revengers', pagesPath: 'comics/Tokyo Revengers/chapter3/', pageCount: 28, pageNameSuffix: '.kiryuu.id', pageExtension: 'jpg' }
            }
        },
        {
            id: 'Boruto Naruto Next Generations',
            title: 'Boruto Naruto Next Generations',
            genre: ['Aksi', 'Petualangan', 'Fantasi'],
            status: 'Ongoing',
            sinopsis: 'Naruto adalah seorang shinobi muda dengan bakat nakal yang tidak bisa diperbaiki. Dia mencapai mimpinya untuk menjadi ninja terhebat di desa dan wajahnya ada di atas monumen Hokage. Tapi ini bukan ceritanya … Seorang ninja generasi baru siap naik panggung, dipimpin oleh putra Naruto sendiri, Boruto!',
            thumbnail: 'comics/Boruto Naruto Next Generations/Boruto Naruto Next Generations.jpg',
            isLatest: false,
            chapters: {
                'chapter1': { title: 'Chapter 1: Boruto Naruto Next Generations', pagesPath: 'comics/Boruto Naruto Next Generations/chapter1/', pageCount: 57, pageNameSuffix: '.kiryuu.id', pageExtension: 'jpg' },
                'chapter1.5': { title: 'Chapter 1.5: Boruto Naruto Next Generations', pagesPath: 'comics/Boruto Naruto Next Generations/chapter1.5/', pageCount: 25, pageNameSuffix: '.kiryuu.id', pageExtension: 'jpg' },
                'chapter2': { title: 'Chapter 2: Boruto Naruto Next Generations', pagesPath: 'comics/Boruto Naruto Next Generations/chapter2/', pageCount: 46, pageNameSuffix: '.kiryuu.id', pageExtension: 'jpg' }
            }
        },
        {
            id: 'Chainsaw Man',
            title: 'Chainsaw Man',
            genre: ['Aksi', 'Horor', 'Supernatural'],
            status: 'Ongoing',
            sinopsis: 'Pemuda pingsan + setan anjing gergaji = Manusia Gergaji! Kehidupan kemiskinan Denji berubah selamanya saat ia bergabung dengan anjing gergaji peliharaannya, Pochita! Sekarang dia tinggal di kota besar dan seorang Pemburu Iblis resmi.',
            thumbnail: 'comics/Chainsaw Man/ChainsawMan.jpg',
            isLatest: true,
            chapters: {
                'chapter1': { title: 'Chapter 1: Chainsaw Man', pagesPath: 'comics/Chainsaw Man/chapter1/', pageCount: 55, pageNameSuffix: '.kiryuu.id', pageExtension: 'jpg' },
                'chapter2': { title: 'Chapter 2: Chainsaw Man', pagesPath: 'comics/Chainsaw Man/chapter2/', pageCount: 28, pageNameSuffix: '.kiryuu.id', pageExtension: 'jpg' },
                'chapter3': { title: 'Chapter 3: Chainsaw Man', pagesPath: 'comics/Chainsaw Man/chapter3/', pageCount: 26, pageNameSuffix: '.kiryuu.id', pageExtension: 'jpg' }
            }
        },
        {
            id: 'Kyou mo Veranda de',
            title: 'Kyou mo Veranda de',
            genre: ['Romantis', 'Slice of Life', 'Komedi'],
            status: 'Ongoing',
            sinopsis: 'Seorang desainer freelance suka melepas penat dari pekerjaannya dengan berkebun di balkon. Di sanalah ia mulai berbincang dengan tetangga barunya di sebelah, hanya lewat tembok pembatas—tanpa pernah melihat wajahnya.',
            thumbnail: 'comics/Kyou mo Veranda de/Kyou mo Veranda de.jpg',
            isLatest: true,
            chapters: {
                'chapter1': { title: "Chapter 1: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter1/", pageCount: 22, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter2': { title: "Chapter 2: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter2/", pageCount: 17, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter3': { title: "Chapter 3: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter3/", pageCount: 15, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter4': { title: "Chapter 4: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter4/", pageCount: 15, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter5': { title: "Chapter 5: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter5/", pageCount: 15, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter6': { title: "Chapter 6: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter6/", pageCount: 15, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter7': { title: "Chapter 7: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter7/", pageCount: 16, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter8': { title: "Chapter 8: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter8/", pageCount: 15, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter9': { title: "Chapter 9: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter9/", pageCount: 16, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter10': { title: "Chapter 10: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter10/", pageCount: 16, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter11': { title: "Chapter 11: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter11/", pageCount: 16, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter12': { title: "Chapter 12: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter12/", pageCount: 16, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter12.5': { title: "Chapter 12.5: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter12.5/", pageCount: 6, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter13': { title: "Chapter 13: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter13/", pageCount: 16, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter14': { title: "Chapter 14: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter14/", pageCount: 16, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter15': { title: "Chapter 15: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter15/", pageCount: 16, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter16': { title: "Chapter 16: Kyou mo Veranda de", pagesPath: "comics/Kyou mo Veranda de/chapter16/", pageCount: 15, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" }
            }
        },
        {
            id: 'Dungeon Porter',
            title: 'Dungeon Porter',
            genre: ['Aksi', 'Petualangan', 'Fantasi'],
            status: 'Ongoing',
            sinopsis: 'Di dunia di mana hanya mereka yang memiliki bakat alami yang dapat menjadi petualang yang menaklukkan dungeon. Dunia mendefinisikan ‘Nagi’ sebagai seorang porter yang tidak bisa menjadi petualang.',
            thumbnail: 'comics/Dungeon Porter/Dungeon Porter.jpg',
            isLatest: true,
            chapters: {
                'chapter1': { title: "Chapter 1: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter1/", pageCount: 25, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter1.3': { title: "Chapter 1.3: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter1.3/", pageCount: 40, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter1.5': { title: "Chapter 1.5: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter1.5/", pageCount: 39, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter2': { title: "Chapter 2: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter2/", pageCount: 31, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter2.3': { title: "Chapter 2.3: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter2.3/", pageCount: 29, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter2.5': { title: "Chapter 2.5: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter2.5/", pageCount: 31, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter3': { title: "Chapter 3: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter3/", pageCount: 40, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter3.5': { title: "Chapter 3.5: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter3.5/", pageCount: 41, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter4': { title: "Chapter 4: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter4/", pageCount: 19, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter5': { title: "Chapter 5: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter5/", pageCount: 34, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter6': { title: "Chapter 6: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter6/", pageCount: 28, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter7': { title: "Chapter 7: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter7/", pageCount: 31, pageNameSuffix: ".kiryuu.one", pageExtension: "jpg" },
                'chapter8': { title: "Chapter 8: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter8/", pageCount: 47, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter9': { title: "Chapter 9: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter9/", pageCount: 61, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter10': { title: "Chapter 10: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter10/", pageCount: 17, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter11': { title: "Chapter 11: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter11/", pageCount: 22, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter12': { title: "Chapter 12: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter12/", pageCount: 16, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter13': { title: "Chapter 13: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter13/", pageCount: 30, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter14': { title: "Chapter 14: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter14/", pageCount: 19, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter15': { title: "Chapter 15: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter15/", pageCount: 28, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter16': { title: "Chapter 16: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter16/", pageCount: 26, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter17': { title: "Chapter 17: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter17/", pageCount: 22, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter18': { title: "Chapter 18: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter18/", pageCount: 17, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" },
                'chapter19': { title: "Chapter 19: Dungeon Porter", pagesPath: "comics/Dungeon Porter/chapter19/", pageCount: 20, pageNameSuffix: ".kiryuu01.com", pageExtension: "jpg" }
            }
        }
        // Tambahkan lebih banyak data komik di sini jika ada
    ];

    // --- UTILITIES ---

    // Fungsi untuk membuat elemen comic-card
    function createComicCard(comic) {
        // Mendapatkan ID chapter pertama untuk link "Baca Sekarang"
        // Memastikan ada chapter sebelum mencoba mengaksesnya
        const chapterKeys = Object.keys(comic.chapters);
        const firstChapterId = chapterKeys.length > 0 ? chapterKeys[0] : '';
        const readerLink = firstChapterId ? `reader.html?comic=${comic.id}&chapter=${firstChapterId}` : '#'; // Link ke reader.html

        const comicCard = `
            <div class="comic-card">
                <a href="${readerLink}">
                    <img src="${comic.thumbnail}" alt="Sampul ${comic.title}">
                    <h3>${comic.title} <span class="status ${comic.status.toLowerCase()}">${comic.status}</span></h3>
                    <p class="genre">${comic.genre.join(', ')}</p>
                    <p class="sinopsis">${comic.sinopsis}</p>
                </a>
            </div>
        `;
        return comicCard;
    }

    // Fungsi untuk merender komik ke dalam grid tertentu
    function renderComicsToGrid(comicsArray, targetGridElement) {
        targetGridElement.innerHTML = ''; // Kosongkan grid sebelum menambahkan
        if (comicsArray.length === 0) {
            targetGridElement.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1 / -1; color: var(--text-light);">Maaf, tidak ada komik yang ditemukan.</p>';
            return;
        }
        comicsArray.forEach(comic => {
            targetGridElement.insertAdjacentHTML('beforeend', createComicCard(comic));
        });
    }

    // --- INISIALISASI TAMPILAN KOMIK PADA SAAT LOAD HALAMAN ---

    // Load komik ke bagian "Chapter Terbaru"
    if (latestComicsGrid) {
        const latestComics = allComicsData.filter(comic => comic.isLatest);
        renderComicsToGrid(latestComics, latestComicsGrid);
    }

    // Load semua komik ke bagian "Semua Komik" saat awal
    if (allComicsGrid) {
        // Panggil fungsi untuk mengisi dropdown genre saat awal
        populateGenreFilter();
        // Render semua komik tanpa filter/sort di awal
        applyFiltersAndSort(); // Panggil ini untuk render awal semua komik
    }

    // --- FUNGSI PENCARIAN ---

    function performSearch() {
        const searchTerm = comicSearchInput.value.toLowerCase();
        
        // Cek apakah ada istilah pencarian
        if (searchTerm.length > 0) {
            const filteredComics = allComicsData.filter(comic =>
                comic.title.toLowerCase().includes(searchTerm)
            );
            renderComicsToGrid(filteredComics, allComicsGrid);
            // Reset filter dan sort saat pencarian dilakukan untuk menampilkan hasil pencarian saja
            if (genreFilterSelect) genreFilterSelect.value = 'all';
            if (statusFilterSelect) statusFilterSelect.value = 'all';
            if (sortOrderSelect) sortOrderSelect.value = 'default';
            document.getElementById('all-comics').scrollIntoView({ behavior: 'smooth' });
        } else {
            // Jika kolom pencarian kosong, terapkan filter dan sort yang sedang aktif
            applyFiltersAndSort();
        }
    }

    // Event listener untuk tombol pencarian
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    // Event listener untuk tombol Enter di input pencarian
    if (comicSearchInput) {
        comicSearchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
        // Opsional: re-render ketika input pencarian dikosongkan secara manual
        comicSearchInput.addEventListener('input', () => {
            if (comicSearchInput.value === '') {
                applyFiltersAndSort(); // Terapkan filter/sort yang aktif
            }
        });
    }

    // --- FUNGSI FILTER DAN PENGURUTAN ---

    // Fungsi untuk mengisi dropdown genre secara dinamis
    function populateGenreFilter() {
        const allGenres = new Set(); // Menggunakan Set untuk memastikan genre unik
        allComicsData.forEach(comic => {
            comic.genre.forEach(g => allGenres.add(g));
        });

        // Hapus opsi yang sudah ada kecuali "Semua Genre"
        // Pastikan genreFilterSelect ada sebelum memanipulasinya
        if (genreFilterSelect) {
            while (genreFilterSelect.options.length > 1) {
                genreFilterSelect.remove(1);
            }

            // Tambahkan genre yang unik ke dropdown
            Array.from(allGenres).sort().forEach(genre => { // Urutkan genre secara alfabetis
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                genreFilterSelect.appendChild(option);
            });
        }
    }

    // Fungsi utama untuk menerapkan semua filter dan pengurutan
    function applyFiltersAndSort() {
        let filteredAndSortedComics = [...allComicsData]; // Salin data asli agar tidak merubahnya

        const selectedGenre = genreFilterSelect ? genreFilterSelect.value : 'all';
        const selectedStatus = statusFilterSelect ? statusFilterSelect.value : 'all';
        const selectedSortOrder = sortOrderSelect ? sortOrderSelect.value : 'default';
        const currentSearchTerm = comicSearchInput ? comicSearchInput.value.toLowerCase() : '';

        // 1. Terapkan Pencarian (jika ada input di kolom pencarian)
        // Periksa apakah ada input pencarian DAN pengguna belum memilih filter/sort lain
        // Ini agar pencarian menjadi prioritas utama jika sedang digunakan
        if (currentSearchTerm.length > 0 &&
            selectedGenre === 'all' && selectedStatus === 'all' && selectedSortOrder === 'default') {
             filteredAndSortedComics = filteredAndSortedComics.filter(comic =>
                comic.title.toLowerCase().includes(currentSearchTerm)
            );
        } else {
            // Jika tidak ada pencarian aktif (atau filter/sort aktif), terapkan filter dan sort
            // 2. Terapkan Filter Genre
            if (selectedGenre !== 'all') {
                filteredAndSortedComics = filteredAndSortedComics.filter(comic =>
                    comic.genre.includes(selectedGenre)
                );
            }

            // 3. Terapkan Filter Status
            if (selectedStatus !== 'all') {
                filteredAndSortedComics = filteredAndSortedComics.filter(comic =>
                    comic.status === selectedStatus
                );
            }

            // 4. Terapkan Pengurutan
            if (selectedSortOrder === 'az') {
                filteredAndSortedComics.sort((a, b) => a.title.localeCompare(b.title));
            } else if (selectedSortOrder === 'za') {
                filteredAndSortedComics.sort((a, b) => b.title.localeCompare(a.title));
            }
            // "default" tidak perlu pengurutan tambahan karena sudah diurutkan dari data awal
            // atau jika data diurutkan ulang karena filter, itu sudah sesuai keinginan
        }

        // Render hasil akhir ke grid
        renderComicsToGrid(filteredAndSortedComics, allComicsGrid);
    }

    // Event listeners untuk perubahan pada dropdown filter dan sort
    if (genreFilterSelect) {
        genreFilterSelect.addEventListener('change', applyFiltersAndSort);
    }
    if (statusFilterSelect) {
        statusFilterSelect.addEventListener('change', applyFiltersAndSort);
    }
    if (sortOrderSelect) {
        sortOrderSelect.addEventListener('change', applyFiltersAndSort);
    }

    // --- AKHIR FUNGSI FILTER DAN PENGURUTAN ---

    // Simpan data komik ke localStorage agar bisa diakses oleh reader.js
    localStorage.setItem('allComicsData', JSON.stringify(allComicsData));
});
