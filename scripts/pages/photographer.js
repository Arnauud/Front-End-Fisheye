async function getPhotographerData(id) {
  try {
    const response = await fetch("./data/photographers.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const photographer = data.photographers.find((p) => p.id == id);
    return photographer;
  } catch (error) {
    console.error("Failed to fetch photographer data:", error);
  }
}

async function fetchMediaData(photographerId) {
  try {
    const response = await fetch("./data/photographers.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const media = data.media.filter((m) => m.photographerId == photographerId);
    return media;
  } catch (error) {
    console.error("Failed to fetch media data:", error);
    return null;
  }
}

let currentIndex = 0;
let mediaData = [];

async function displayPhotographer() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const photographerId = urlParams.get("id");

    if (!photographerId) {
      console.error("Photographer ID is missing");
      return;
    }

    const photographer = await getPhotographerData(photographerId);
    if (!photographer) {
      console.error("Photographer data not found");
      return;
    }

    mediaData = await fetchMediaData(photographerId);
    if (!mediaData) {
      console.error("Media data not found");
      return;
    }

    const header = document.querySelector(".photograph-header");
    header.innerHTML = "";

    const leftSection = document.createElement("div");
    leftSection.className = "left-section";

    const h1 = document.createElement("h1");
    h1.textContent = photographer.name;

    const h3 = document.createElement("h3");
    h3.textContent = `${photographer.city}, ${photographer.country}`;

    const divTagline = document.createElement("div");
    divTagline.textContent = photographer.tagline;

    leftSection.appendChild(h1);
    leftSection.appendChild(h3);
    leftSection.appendChild(divTagline);

    const centerSection = document.createElement("div");
    centerSection.className = "center-section";

    const button = document.createElement("button");
    button.className = "contact_button";
    button.textContent = "Contactez-moi";
    button.setAttribute("aria-label", `Contact me ${photographer.name}`);
    button.onclick = function () {
      /* eslint-disable no-undef*/
      displayModal();
    };

    centerSection.appendChild(button);

    const img = document.createElement("img");
    img.src = `./assets/photographers/Sample_Photos/Photographers_ID_Photos/${photographer.portrait}`;
    img.alt = photographer.name;

    header.appendChild(leftSection);
    header.appendChild(centerSection);
    header.appendChild(img);

    const likesPriceBox = document.querySelector(".likesPrice");
    likesPriceBox.innerHTML = "";

    const mediaLikes = mediaData.reduce((sum, item) => sum + item.likes, 0);
    const spanLikes = document.createElement("span");
    spanLikes.className = "totalLikes";
    spanLikes.textContent = `Likes: ${mediaLikes} \u2665`;

    const spanPrice = document.createElement("span");
    spanPrice.textContent = `${photographer.price}€ / jour`;

    likesPriceBox.appendChild(spanLikes);
    likesPriceBox.appendChild(spanPrice);

    ////////////////////////////
    /* eslint-disable no-undef*/
    mediaFactory(mediaData);

    ////////////////////////////

    const dropdown = document.querySelector(".custom-dropdown");
    const dropdownList = document.querySelector(".custom-dropdown-list");
    const dropdownOptions = document.querySelectorAll(
      ".custom-dropdown-option"
    );
    const dropdownSelected = document.querySelector(
      ".custom-dropdown-selected"
    );
    const dropdownIcon = dropdownSelected.querySelector("div");

    // Function to refresh dropdown options based on selected item
    function refreshDropdownOptions() {
      const selectedText = dropdownSelected.textContent.trim();

      // Hide all options first
      dropdownOptions.forEach((option) => {
        option.style.display = "none";
      });

      // Show options that are not selected
      dropdownOptions.forEach((option) => {
        if (option.textContent.trim() !== selectedText) {
          option.style.display = "block";
        }
      });
    }

    // Function to toggle the dropdown
    function toggleDropdown() {
      dropdownList.classList.toggle("show");
      const isExpanded = dropdownList.classList.contains("show");
      dropdown.setAttribute("aria-expanded", isExpanded);
      dropdownIcon.className = isExpanded
        ? "fa fa-chevron-up"
        : "fa fa-chevron-down";
      // Refresh the dropdown options when toggling
      if (isExpanded) {
        refreshDropdownOptions();
      }
    }

    dropdown.addEventListener("click", toggleDropdown);

    // Add event listener for keydown events
    dropdown.addEventListener("keydown", (e) => {
      if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
        e.preventDefault(); // Prevent default space bar action
        toggleDropdown();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (dropdownList.classList.contains("show")) {
          dropdownOptions[0].focus();
        } else {
          toggleDropdown();
        }
      } else if (e.key === "Escape") {
        if (dropdownList.classList.contains("show")) {
          toggleDropdown();
          dropdown.focus();
        }
      }
    });
    // Add event listener for the actual selection
    dropdownOptions.forEach((option, index) => {
      option.addEventListener("click", () => {
        const sortBy = option.dataset.value;
        dropdownSelected.textContent = option.textContent;
        dropdownSelected.appendChild(dropdownIcon);
        dropdownList.classList.remove("show");
        dropdown.setAttribute("aria-expanded", "false");
        dropdownIcon.className = "fa fa-chevron-down";
        dropdown.focus();

        if (sortBy === "1") {
          mediaData.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === "2") {
          mediaData.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === "3") {
          mediaData.sort((a, b) => a.title.localeCompare(b.title));
        }
        /* eslint-disable no-undef*/
        mediaFactory(mediaData);
      });

      option.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          option.click();
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          if (index < dropdownOptions.length - 1) {
            dropdownOptions[index + 1].focus();
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (index > 0) {
            dropdownOptions[index - 1].focus();
          } else {
            dropdown.focus();
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          dropdown.setAttribute("aria-expanded", "false");
          dropdownList.classList.remove("show");
          dropdownIcon.className = "fa fa-chevron-down";
          dropdown.focus();
        }
      });
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        dropdownList.classList.remove("show");
        dropdown.setAttribute("aria-expanded", "false");
        dropdownIcon.className = "fa fa-chevron-down";
      }
    });

    createLightbox(); // Initialize lightbox after setting up everything
  } catch (error) {
    console.error("Error displaying photographer:", error);
  }
}

function openLightbox(index) {
  currentIndex = index;
  const lightbox = document.getElementById("lightbox");
  const lightboxContent = lightbox.querySelector(".lightbox-content");
  let lightboxTitle = lightboxContent.querySelector(".lightbox-title");
  let lightboxImage = lightboxContent.querySelector(".lightbox-image");
  const media = mediaData[index];
  if (media.image) {
    if (lightboxImage.tagName !== "IMG") {
      const newImage = document.createElement("img");
      newImage.className = "lightbox-image";
      newImage.setAttribute("aria-label", "image closeup view");
      lightboxContent.replaceChild(newImage, lightboxImage);
      lightboxImage = newImage;
    }
    lightboxImage.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.image}`;
    lightboxImage.alt = media.title;
    lightboxTitle.textContent = media.title;
    lightboxImage.setAttribute("aria-label", media.title);
  } else if (media.video) {
    if (lightboxImage.tagName !== "VIDEO") {
      const newVideo = document.createElement("video");
      newVideo.className = "lightbox-image";
      newVideo.setAttribute("aria-label", "video closeup view");
      newVideo.controls = true;
      lightboxContent.replaceChild(newVideo, lightboxImage);
      lightboxImage = newVideo;
      newVideo.focus();
    }
    lightboxImage.src = `./assets/photographers/Sample_Photos/${media.photographerId}/${media.video}`;
    lightboxImage.alt = media.title;
    lightboxTitle.textContent = media.title;
    lightboxImage.setAttribute("aria-label", media.title);
  }

  lightbox.style.display = "block";
  lightbox.setAttribute("aria-hidden", "false");
}

async function createLightbox() {
  try {
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = "lightbox";
    lightbox.setAttribute("aria-hidden", "true");

    const lightboxContent = document.createElement("div");
    lightboxContent.className = "lightbox-content";

    const closeBtn = document.createElement("span");
    closeBtn.className = "close";
    closeBtn.innerHTML = "&times;";
    closeBtn.setAttribute("role", "button");
    closeBtn.setAttribute("aria-label", "Close dialog");
    closeBtn.addEventListener("click", closeLightbox);

    const prevBtn = document.createElement("a");
    prevBtn.className = "prev";
    prevBtn.innerHTML = "&#10094;";
    prevBtn.setAttribute("role", "button");
    prevBtn.setAttribute("aria-label", "Previous image");
    prevBtn.addEventListener("click", showPrevMedia);

    const nextBtn = document.createElement("a");
    nextBtn.className = "next";
    nextBtn.innerHTML = "&#10095;";
    nextBtn.setAttribute("role", "button");
    nextBtn.setAttribute("aria-label", "Next image");
    nextBtn.addEventListener("click", showNextMedia);

    const lightboxTitle = document.createElement("div");
    lightboxTitle.className = "lightbox-title";
    lightboxTitle.setAttribute("aria-live", "polite");

    const lightboxImage = document.createElement("img");
    lightboxImage.className = "lightbox-image";
    lightboxImage.setAttribute("aria-label", "image closeup view");

    lightboxContent.appendChild(closeBtn);
    lightboxContent.appendChild(prevBtn);
    lightboxContent.appendChild(lightboxImage);
    lightboxContent.appendChild(nextBtn);
    lightboxContent.appendChild(lightboxTitle);
    lightbox.appendChild(lightboxContent);
    document.body.appendChild(lightbox);
  } catch (error) {
    console.error("Error creating lightbox:", error);
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.style.display = "none";
  lightbox.setAttribute("aria-hidden", "true");
}

function showNextMedia() {
  currentIndex = (currentIndex + 1) % mediaData.length;
  openLightbox(currentIndex);
}

function showPrevMedia() {
  currentIndex = (currentIndex - 1 + mediaData.length) % mediaData.length;
  openLightbox(currentIndex);
}

document.addEventListener("keydown", function (event) {
  const lightbox = document.getElementById("lightbox");
  if (lightbox.style.display === "block") {
    if (event.key === "ArrowRight") {
      showNextMedia();
    } else if (event.key === "ArrowLeft") {
      showPrevMedia();
    } else if (event.key === "Escape" || event.key === " ") {
      closeLightbox();
    }
  }
});

displayPhotographer();
