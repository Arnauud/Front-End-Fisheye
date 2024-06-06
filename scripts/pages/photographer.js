//Mettre le code JavaScript lié à la page photographer.html

async function getPhotographerData(id) {
    try {
        const response = await fetch('./data/photographers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // call up the JSON file and wait for a response
        const photographer = data.photographers.find(p => p.id == id); 
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
        if (photographer || mediaData) {
            const header = document.querySelector('.photograph-header');

            // Clear any existing content
            header.innerHTML = '';

            // Create h1 for photographer's name
            const h1 = document.createElement('h1');
            h1.textContent = photographer.name;

            // Create h3 for city and country
            const h3 = document.createElement('h3');
            h3.textContent = `${photographer.city}, ${photographer.country}`;

            // Create div for tagline
            const divTagline = document.createElement('div');
            divTagline.textContent = photographer.tagline;

            // Create button for contact
            const button = document.createElement('button');
            button.className = 'contact_button';
            button.textContent = 'Contactez-moi';
            button.onclick = function() {
                displayModal();
            };

            // Create img for photographer's portrait
            const img = document.createElement('img');
            img.src = `./assets/photographers/Sample_Photos/Photographers_ID_Photos/${photographer.portrait}`;
            img.alt = photographer.name;

            // Append elements to header
            header.appendChild(h1);
            header.appendChild(h3);
            header.appendChild(divTagline);
            header.appendChild(button);
            header.appendChild(img);


            const priceFooter = document.querySelector('.price');
            // clear the price Footer
            priceFooter.innerHTML = '';

            // create span for photographer's price
            const span = document.createElement('span');
            span.textContent = `${mediaData.price}€ / jour`

            // Append span to priceFooter
            priceFooter.appendChild(span);

        }
    }
}

displayPhotographer();

