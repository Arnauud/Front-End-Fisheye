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

async function displayPhotographer() {
    const urlParams = new URLSearchParams(window.location.search); // ??
    const photographerId = urlParams.get('id');
    if (photographerId) {
        const photographer = await getPhotographerData(photographerId);
        if (photographer) {
            document.querySelector('.photograph-header').innerHTML = `
                <h1>${photographer.name}</h1>
                <h3>${photographer.city}, ${photographer.country}</h3>
                <div>${photographer.tagline}</div>
                <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
                <img src="./assets/photographers/Sample_Photos/Photographers_ID_Photos/${photographer.portrait}" alt="${photographer.name}">
            `;
        } else {
            console.error('Photographer not found');
        }
    } else {
        console.error('No photographer ID found in URL');
    }
}

displayPhotographer();

