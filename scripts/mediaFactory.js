function mediaFactory(mediaData) {
    const portfolio = document.querySelector('.portfolio');
    portfolio.innerHTML = '';

    mediaData.forEach((media, index) => {
        const article = document.createElement('article');
        article.setAttribute('tabindex', '0');
        article.setAttribute('role', 'button');
        article.setAttribute('aria-label', `Media item: ${media.title}`);
        article.classList.add('media-item');

        if (media.image && typeof media.image === 'string') {
            const isJPEG = media.image.toLowerCase().endsWith('.jpg') || media.image.toLowerCase().endsWith('.jpeg');
            if (isJPEG) {
                const image = document.createElement('img');
                image.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.image}`;
                image.setAttribute('arial-label', `${media.title}, close up view`);
                image.dataset.index = index;
                article.appendChild(image);

                image.addEventListener('click', function () {
                    openLightbox(index);
                });
                article.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(index);
                    }
                });
            }
        }

        if (media.video && typeof media.video === 'string') {
            const isMP4 = media.video.toLowerCase().endsWith('.mp4');
            if (isMP4) {
                const videoContainer = document.createElement('div');
                const video = document.createElement('video');
                video.controls = false;
                video.loop = true;
                video.muted = true;

                const source = document.createElement('source');
                source.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.video}`;
                source.type = 'video/mp4';
                source.setAttribute('arial-label', `${media.title}, close up view`);
                video.dataset.index = index;
                video.appendChild(source);
                videoContainer.appendChild(video);
                article.appendChild(videoContainer);

                videoContainer.addEventListener('click', function () {
                    openLightbox(index);
                });
                article.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        openLightbox(index);
                    }
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
        imgLikes.setAttribute('role', 'button');
        imgLikes.setAttribute('tabindex', '0');
        imgLikes.setAttribute('aria-label', `like`);

        const likeClickHandler = function () {
            const totalLikesElement = document.querySelector('.totalLikes');
            if (!imgLikes.classList.contains('clicked')) {
                media.likes += 1;
                imgLikes.textContent = `${media.likes} \u2665`;
                const mediaLikes = mediaData.reduce((sum, item) => sum + item.likes, 0);
                totalLikesElement.textContent = `Likes: ${mediaLikes} \u2665`;
                imgLikes.classList.add('clicked');
            }
        };

        imgLikes.addEventListener('click', likeClickHandler);
        imgLikes.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                likeClickHandler();
            }
        });

        titleLikes.appendChild(titleImg);
        titleLikes.appendChild(imgLikes);
        article.appendChild(titleLikes);
        portfolio.appendChild(article);
    });
}