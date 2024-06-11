//Mettre le code JavaScript lié à la page photographer.html

async function getPhotographerData(id) {
    try {
        const response = await fetch('./data/photographers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // call up the JSON file and wait for a response
        const photographer = data.photographers.find(p => p.id == id); 
        console.log(photographer)
        //through this JSON file find an ID. "P" is the name of the 
        //function and we're looking for p.id to match P. 
        //difference between == and === one is 'loose' the other is strict 
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


async function displayPhotographer() {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get('id');

    if (photographerId) {
        const photographer = await getPhotographerData(photographerId);
        let mediaData = await fetchMediaData(photographerId);
        if (!mediaData) return;

        const mediaLikes = mediaData.reduce((sum, item) => sum + item.likes, 0);

        if (photographer) {
            const header = document.querySelector('.photograph-header');

            // Clear any existing content
            header.innerHTML = '';

            // Create a div for the left section
            const leftSection = document.createElement('div');
            leftSection.className = 'left-section';

            // Create h1 for photographer's name
            const h1 = document.createElement('h1');
            h1.textContent = photographer.name;

            // Create h3 for city and country
            const h3 = document.createElement('h3');
            h3.textContent = `${photographer.city}, ${photographer.country}`;

            // Create div for tagline
            const divTagline = document.createElement('div');
            divTagline.textContent = photographer.tagline;

            // Create a div for the center section (for the button)
            const centerSection = document.createElement('div');
            centerSection.className = 'center-section';

            // Append elements to left section
            leftSection.appendChild(h1);
            leftSection.appendChild(h3);
            leftSection.appendChild(divTagline);

            // Create button for contact
            const button = document.createElement('button');
            button.className = 'contact_button';
            button.textContent = 'Contactez-moi';
            button.setAttribute('aria-label', `Contact me ${photographer.name}`); 
            button.onclick = function() {
                displayModal();
            };

            // Append button to center section
            centerSection.appendChild(button);

            // Create img for photographer's portrait
            const img = document.createElement('img');
            img.src = `./assets/photographers/Sample_Photos/Photographers_ID_Photos/${photographer.portrait}`;
            img.alt = photographer.name;
            

            // Append elements to header
            header.appendChild(leftSection);
            header.appendChild(centerSection);
            header.appendChild(img);

            const likesPriceBox = document.querySelector('.likesPrice');

            // Create span for photographer's likes
            const spanLikes = document.createElement('span');
            spanLikes.textContent = `Likes : ${mediaLikes} \u2665`;

            // Create span for photographer's price
            const spanPrice = document.createElement('span');
            spanPrice.textContent = `${photographer.price}€ / jour`;

            // Append span to likesPriceBox
            likesPriceBox.appendChild(spanLikes);
            likesPriceBox.appendChild(spanPrice);

            // Function to display the portfolio
            function displayPortfolio(mediaData) {
                const portfolio = document.querySelector('.portfolio');
                portfolio.innerHTML = '';

                mediaData.forEach(media => {
                    const article = document.createElement('article');

                    if (media.image && typeof media.image === 'string') {
                        const isJPEG = media.image.toLowerCase().endsWith('.jpg') || media.image.toLowerCase().endsWith('.jpeg');
                        if (isJPEG) {
                            const image = document.createElement('img');
                            image.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.image}`;
                            article.appendChild(image);
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
                            video.appendChild(source);
                            videoContainer.appendChild(video);
                            article.appendChild(videoContainer);
                        }
                    }

                    const titleLikes = document.createElement('div');
                    titleLikes.className = 'titleLikes';

                    const titleImg = document.createElement('span');
                    titleImg.textContent = media.title;

                    const imgLikes = document.createElement('span');
                    imgLikes.textContent = `${media.likes} \u2665`;

                    titleLikes.appendChild(titleImg);
                    titleLikes.appendChild(imgLikes);
                    article.appendChild(titleLikes);
                    portfolio.appendChild(article);
                });
            }

            // Initial display of portfolio
            displayPortfolio(mediaData);

            // Add event listener to the dropdown menu
            const dropdown = document.getElementById('photographer-select');
            dropdown.addEventListener('change', () => {
                const sortBy = dropdown.value;

                // Sort the mediaData based on the selected option
                if (sortBy === '1') {
                    mediaData.sort((a, b) => b.likes - a.likes);

                } else if (sortBy === '2') {
                    mediaData.sort((a, b) => new Date(b.date) - new Date(a.date));
                } else if (sortBy === '3') {
                    mediaData.sort((a, b) => a.title.localeCompare(b.title));
                }


                // Display the sorted portfolio
                displayPortfolio(mediaData);
            });
        }
    }
}

displayPhotographer();