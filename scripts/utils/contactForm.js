// Extract the 'id' parameter from the URL
function getPhotographerIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Fetch photographer data from JSON file using the id
async function getPhotographerDataById(id) {
    try {
        const response = await fetch('./data/photographers.json');
        const data = await response.json();

        console.log('Data fetched:', data); // Log the fetched data to see the structure

        const photographer = data.photographers.find(p => p.id == id);

        console.log('Photographer found:', photographer); // Log the found photographer

        return photographer;
    } catch (error) {
        console.error('Failed to fetch photographer data:', error);
    }
}

// Open Window for Contact
async function displayModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "block";

    const photographerId = getPhotographerIdFromUrl();
    const photographer = await getPhotographerDataById(photographerId);

    if (photographer) {
        const h2 = document.getElementById('photographerName');
        h2.textContent = "Contactez-moi " + photographer.name;
    }
}

// Close Window for Contact

function closeModal() {
    const modal = document.getElementById("contact_modal");
    modal.style.display = "none";
}
