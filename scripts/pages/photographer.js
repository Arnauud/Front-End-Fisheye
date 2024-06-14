async function getPhotographerData(id) {
    try {
        const response = await fetch('./data/photographers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const photographer = data.photographers.find(p => p.id == id);
        return photographer;
    } catch (error) {
        console.error('Failed to fetch photographer data:', error);
    }
}

async function fetchMediaData(photographerId) {
    try {
        const response = await fetch('./data/photographers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const media = data.media.filter(m => m.photographerId == photographerId);
        return media;
    } catch (error) {
        console.error('Failed to fetch media data:', error);
        return null;
    }
}


// Creating a lightbox functinon display
function createLightbox(media) {
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.style.display = 'none'; // to be hidden initially but then displayed on click
    

    const lightboxContent = document.createElement('div');
    lightboxContent.className = 'lightbox-content';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeLightbox);
    closeBtn.setAttribute('aria-label', `Close dialog`); 

    const lightboxImage = document.createElement('img');
    lightboxImage.className = 'lightbox-image';
    lightboxImage.alt = '';
    lightboxImage.setAttribute('aria-label', 'image closeup view'); 

    const prevBtn = document.createElement('a');
    prevBtn.className = 'prev';
    prevBtn.innerHTML = '&#10094;';
    prevBtn.addEventListener('click', showPrevMedia);
    prevBtn.setAttribute('aria-label', `Previous image`); 

    const nextBtn = document.createElement('a');
    nextBtn.className = 'next';
    nextBtn.innerHTML = '&#10095;';
    nextBtn.addEventListener('click', showNextMedia);
    nextBtn.setAttribute('aria-label', `Next image`);

    const lightboxTitle = document.createElement('h2');
    lightboxTitle.className = 'lightbox-title';
    lightboxTitle.innerHTML = '';
    lightboxTitle.setAttribute('aria-label', `NEED THE TITLE !!!!!!!!`); 


    lightboxContent.appendChild(closeBtn);
    lightboxContent.appendChild(lightboxImage);
    lightboxContent.appendChild(nextBtn);
    lightboxContent.appendChild(prevBtn);
    lightboxContent.appendChild(lightboxTitle)
    lightbox.appendChild(lightboxContent);
    
    const mainElement = document.querySelector('main'); // Target the <main> element
    mainElement.appendChild(lightbox); // Append lightbox to the <main> element
}

let currentIndex = 0;
let mediaData = [];

async function displayPhotographer() {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');

    if (photographerId) {
        const photographer = await getPhotographerData(photographerId);
        mediaData = await fetchMediaData(photographerId);
        if (!mediaData) return;

        let mediaLikes = mediaData.reduce((sum, item) => sum + item.likes, 0);

        if (photographer) {
            const header = document.querySelector('.photograph-header');
            header.innerHTML = '';

            const leftSection = document.createElement('div');
            leftSection.className = 'left-section';

            const h1 = document.createElement('h1');
            h1.textContent = photographer.name;

            const h3 = document.createElement('h3');
            h3.textContent = `${photographer.city}, ${photographer.country}`;

            const divTagline = document.createElement('div');
            divTagline.textContent = photographer.tagline;

            const centerSection = document.createElement('div');
            centerSection.className = 'center-section';

            leftSection.appendChild(h1);
            leftSection.appendChild(h3);
            leftSection.appendChild(divTagline);

            const button = document.createElement('button');
            button.className = 'contact_button';
            button.textContent = 'Contactez-moi';
            button.setAttribute('aria-label', `Contact me ${photographer.name}`);
            button.onclick = function () {
                displayModal();
            };

            centerSection.appendChild(button);

            const img = document.createElement('img');
            img.src = `./assets/photographers/Sample_Photos/Photographers_ID_Photos/${photographer.portrait}`;
            img.alt = photographer.name;

            header.appendChild(leftSection);
            header.appendChild(centerSection);
            header.appendChild(img);

            const likesPriceBox = document.querySelector('.likesPrice');
            likesPriceBox.innerHTML = '';

            const spanLikes = document.createElement('span');
            spanLikes.textContent = `Likes: ${mediaLikes} \u2665`;

            const spanPrice = document.createElement('span');
            spanPrice.textContent = `${photographer.price}€ / jour`;

            likesPriceBox.appendChild(spanLikes);
            likesPriceBox.appendChild(spanPrice);

            function displayPortfolio(mediaData) {
                const portfolio = document.querySelector('.portfolio');
                portfolio.innerHTML = '';

                mediaData.forEach((media, index) => {
                    const article = document.createElement('article');

                    if (media.image && typeof media.image === 'string') {
                        const isJPEG = media.image.toLowerCase().endsWith('.jpg') || media.image.toLowerCase().endsWith('.jpeg');
                        if (isJPEG) {
                            const image = document.createElement('img');
                            image.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.image}`;
                            image.dataset.index = index;
                            article.appendChild(image);

                            // Event listener for lightbox
                            image.addEventListener('click', function () {
                                openLightbox(index);
                            });
                        }
                    }

                    if (media.video && typeof media.video === 'string') {
                        const isMP4 = media.video.toLowerCase().endsWith('.mp4');
                        if (isMP4) {
                            const videoContainer = document.createElement('div');
                            const video = document.createElement('video');
                            video.controls = true;
                            video.loop = true;
                            video.muted = true;

                            const source = document.createElement('source');
                            source.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.video}`;
                            source.type = 'video/mp4';
                            video.dataset.index = index;
                            video.appendChild(source);
                            videoContainer.appendChild(video);
                            article.appendChild(videoContainer);

                            // Event listener for lightbox
                            videoContainer.addEventListener('click', function () {
                                openLightbox(index);
                            });
                        }
                    }

                    const titleLikes = document.createElement('div');
                    titleLikes.className = 'titleLikes';

                    const titleImg = document.createElement('span');
                    titleImg.textContent = media.title;

                    const imgLikes = document.createElement('span');
                    imgLikes.textContent = `${media.likes} \u2665`;
                    imgLikes.style.cursor = 'pointer';

                    const likeClickHandler = function () {
                        if (!imgLikes.classList.contains('clicked')) {
                            media.likes += 1;
                            imgLikes.textContent = `${media.likes} \u2665`;
                            mediaLikes += 1;
                            spanLikes.textContent = `Likes: ${mediaLikes} \u2665`;
                            imgLikes.classList.add('clicked');
                        }
                    };

                    imgLikes.addEventListener('click', likeClickHandler);

                    titleLikes.appendChild(titleImg);
                    titleLikes.appendChild(imgLikes);
                    article.appendChild(titleLikes);
                    portfolio.appendChild(article);
                });
            }

            displayPortfolio(mediaData);

            const dropdown = document.getElementById('photographer-select');
            dropdown.addEventListener('change', () => {
                const sortBy = dropdown.value;

                if (sortBy === '1') {
                    mediaData.sort((a, b) => b.likes - a.likes);
                } else if (sortBy === '2') {
                    mediaData.sort((a, b) => new Date(b.date) - new Date(a.date));
                } else if (sortBy === '3') {
                    mediaData.sort((a, b) => a.title.localeCompare(b.title));
                }

                displayPortfolio(mediaData);
            });
        }
    }
}

function openLightbox(index) {
    currentIndex = index;
    const lightbox = document.getElementById('lightbox');
    let lightboxImage = lightbox.querySelector('.lightbox-image');
    const media = mediaData[index];

    if (media.image) {
        lightboxImage.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.image}`;
        lightboxImage.alt = media.title;
        lightboxTitle.innerHTML = media.image
    } else if (media.video) {
        lightboxImage.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.video}`;
        lightboxImage.alt = media.title;
        lightboxImage = document.createElement('video');
        lightboxImage.controls = true;
        lightboxImage.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.video}`;
        lightboxTitle.innerHTML = media.video
    }
    createLightbox(media);

    lightbox.style.display = 'block';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
}

function showNextMedia() {
    currentIndex = (currentIndex + 1) % mediaData.length;
    openLightbox(currentIndex);
}

function showPrevMedia() {
    currentIndex = (currentIndex - 1 + mediaData.length) % mediaData.length;
    openLightbox(currentIndex);
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
        showNextMedia();
    } else if (event.key === 'ArrowLeft') {
        showPrevMedia();
    } else if (event.key === 'Escape') {
        closeLightbox();
    }
});

displayPhotographer();
