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
        const mediaData = await fetchMediaData(photographerId);
        const mediaLikes = mediaData.reduce((sum,item) => sum + item.likes, 0);
                // Sort mediaData based on sortBy parameter


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

            // create span for photographer's likes
            const spanLikes = document.createElement('span');
            spanLikes.textContent = `Likes : ${mediaLikes} \u2665`;

            // create span for photographer's price
            const spanPrice = document.createElement('span');
            spanPrice.textContent = `${photographer.price}€ / jour`


            // Append span to priceFooter
            likesPriceBox.appendChild(spanLikes);
            likesPriceBox.appendChild(spanPrice);



/////// GETTING PHOTOGRAPHER PORTFOLIO ///////
const portfolio = document.querySelector('.portfolio');

// Clear any existing content
portfolio.innerHTML = '';

// Iterate over each media item
mediaData.forEach(media => {
    // Create an article element for each media item
    const article = document.createElement('article');

    // Check if media.image is defined and is a string
    if (media.image && typeof media.image === 'string') {
        // Check if the image is a JPEG file
        const isJPEG = media.image.toLowerCase().endsWith('.jpg') || media.image.toLowerCase().endsWith('.jpeg');

        if (isJPEG) {
            // Create an image element
            const image = document.createElement('img');
            // Set the source of the image
            image.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.image}`;
            // Append the image to the article
            article.appendChild(image);
        }
    }

    // Check if media.video is defined and is a string
    if (media.video && typeof media.video === 'string') {
        // Check if the video is an MP4 file
        const isMP4 = media.video.toLowerCase().endsWith('.mp4');

        if (isMP4) {
            // Create a container div for the video
            const videoContainer = document.createElement('div');
            
            // Create a video element
            const video = document.createElement('video');
            // Set video attributes
            video.controls = true;
            video.loop = true;
            video.muted = true;

            // Set the video source
            const source = document.createElement('source');
            source.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.video}`;
            source.type = 'video/mp4';
            // Append the source to the video element
            video.appendChild(source);

            // Append the video element to the container
            videoContainer.appendChild(video);
            // Append the container to the article
            article.appendChild(videoContainer);
        }
    }

    // Create a div for title and likes
    const divTitleLikes = document.createElement('div');
    divTitleLikes.className = 'divTitleLikes';

    // Create a span for the title
    const titleImg = document.createElement('span');
    titleImg.textContent = media.title;

    // Create a span for the likes
    const imgLikes = document.createElement('span');
    imgLikes.textContent = `${media.likes} \u2665`;

    // Append title and likes to the div
    divTitleLikes.appendChild(titleImg);
    divTitleLikes.appendChild(imgLikes);

    // Append the div to the article
    article.appendChild(divTitleLikes);

    // Append the article to the portfolio
    portfolio.appendChild(article);
});
            }
        }
    }

displayPhotographer();





