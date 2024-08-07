// Extract the 'id' parameter from the URL
function getPhotographerIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Fetch photographer data from JSON file using the id
async function getPhotographerDataById(id) {
  try {
    const response = await fetch("./data/photographers.json");
    const data = await response.json();

   // console.log("Data fetched:", data); // Log the fetched data to see the structure

    const photographer = data.photographers.find((p) => p.id == id);

    if (!photographer) {
      throw new Error(`Photographer with id ${id} not found`);
    }

    // console.log("Photographer found:", photographer); // Log the found photographer

    return photographer;
  } catch (error) {
    console.error("Failed to fetch photographer data:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

// Open Window for Contact

/* eslint-disable no-unused-vars */
async function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
  document.addEventListener("keydown", handleEscapeKey);

  try {
    const photographerId = getPhotographerIdFromUrl();
    if (!photographerId) {
      throw new Error("Photographer ID is missing in the URL");
    }

    const photographer = await getPhotographerDataById(photographerId);

    if (photographer) {
      const h2 = document.getElementById("photographerName");
      h2.textContent = "Contactez-moi " + photographer.name;
    }
  } catch (error) {
    console.error("Failed to display modal:", error);
    modal.style.display = "none"; // Hide the modal if there was an error
  }
}
function handleEscapeKey(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

// Close Window for Contact
function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
  document.removeEventListener("keydown", handleEscapeKey);
}

// Form Modal management
let errorMessage = {
  firstName: "Veuillez entrer 2 caractères ou plus pour le champ du Prénom",
  lastName: "Veuillez entrer 2 caractères ou plus pour le champ du Nom",
  email: "Rentrez un e-mail valide",
  yourMessage: "Veuillez entrer un message valide",
};

// (1) Le champ Prénom a un minimum de 2 caractères / n'est pas vide.
function firstNameValidation() {
  let firstNameInput = document.getElementById("firstname");
  let errorMessageElement = document.getElementById("first-error");
  let firstName = firstNameInput.value;

  if (firstName.length > 2 && firstName !== "") {
    /* eslint-disable no-undef*/
    firstNameCheck = true;
    errorMessageElement.style.display = "none";
    firstNameInput.classList.remove("error");
    console.log(firstName);
  } else {
    console.log(errorMessage.firstName);
    /* eslint-disable no-undef*/
    firstNameCheck = false;
    errorMessageElement.style.display = "block";
    firstNameInput.classList.add("error");
    errorMessageElement.textContent = errorMessage.firstName;
    return null;
  }
}

// (2) Le champ du nom de famille a un minimum de 2 caractères / n'est pas vide.
function lastNameValidation() {
  let lastNameInput = document.getElementById("lastName");
  let errorMessageElement = document.getElementById("last-error");
  let lastName = lastNameInput.value;

  if (lastName.length > 2 && lastName !== "") {
    /* eslint-disable no-undef*/
    lastNameCheck = true;
    errorMessageElement.style.display = "none";
    lastNameInput.classList.remove("error");
    console.log(lastName);
  } else {
    console.log(errorMessage.lastName);
    /* eslint-disable no-undef*/
    lastNameCheck = false;
    errorMessageElement.style.display = "block";
    lastNameInput.classList.add("error");
    errorMessageElement.textContent = errorMessage.lastName;
  }
}

// (3) L'adresse électronique est valide.
function emailValidation() {
  let emailInput = document.getElementById("email");
  let emailRegExp = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+");
  let errorMessageElement = document.getElementById("email-error");
  let email = emailInput.value;

  if (emailRegExp.test(email)) {
    /* eslint-disable no-undef*/
    validationEmailCheck = true;
    errorMessageElement.style.display = "none";
    emailInput.classList.remove("error");
    console.log(email);
  } else {
    console.log(errorMessage.email);
    /* eslint-disable no-undef*/
    validationEmailCheck = false;
    errorMessageElement.style.display = "block";
    emailInput.classList.add("error");
    errorMessageElement.textContent = errorMessage.email;
  }
}

// Message Validation
function yourMessage() {
  let yourMessage = document.getElementById("message");
  let errorMessageElement = document.getElementById("message-error");
  let consoleMessage = yourMessage.value;

  if (yourMessage.value.length > 2) {
    errorMessageElement.style.display = "none";
    yourMessage.classList.remove("error");
    /* eslint-disable no-undef*/
    yourCheckMessage = true;
    console.log(consoleMessage);
  } else {
    console.log(errorMessage.yourMessage);
    errorMessageElement.style.display = "block";
    yourMessage.classList.add("error");
    errorMessageElement.textContent = errorMessage.yourMessage;
    /* eslint-disable no-undef*/
    yourCheckMessage = false;
  }
}

//Le formulaire doit être valide quand l'utilisateur clique sur "Submit"
function formValidation() {
  let formValidationBtn = document.querySelector(".form_contact_button");

  if (formValidationBtn) {
    formValidationBtn.addEventListener("click", (event) => {
      event.preventDefault();

      // THESE ARE ALL THE FUNCTIONS TO PICK UP
      firstNameValidation();
      lastNameValidation();
      emailValidation();
      yourMessage();
      /* eslint-disable no-undef*/
      if (
        firstNameCheck === true &&
        lastNameCheck === true &&
        validationEmailCheck === true &&
        yourCheckMessage === true
      ) {
        closeModal();
        console.log("Submit Sent");
      } else {
        console.log("Form is not valid");
      }
    });
  } else {
    console.error("Submit button not found");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  formValidation();
});
