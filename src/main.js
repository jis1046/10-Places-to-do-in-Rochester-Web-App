const dataPlaces = 'data/places.json';
const listContainer = document.getElementById('list-container');
const detailsContainer = document.getElementById('details-container'); 
const favoritesContainer = document.getElementById('favorites-container');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

//fetch data from places.json
async function fetchPlaces() {
    try {
        const response = await fetch(dataPlaces);
        const data = await response.json();
        const places = data.places;

        //display list of places
        if (listContainer) {
            displayPlacesListData(places);
        }

        //display details of a place
        if (detailsContainer) {
            //get the place id from the query string
            const params = new URLSearchParams(window.location.search);
            const placeId = parseInt(params.get("id"));
            const place = places.find(p => p.id === placeId);
            if (place) {
                displayPlaceDetails(place);
            } 
            else {
                detailsContainer.innerHTML = `<p>Place not found.</p>`;
            }
        }

        //display favorites
        if (favoritesContainer) {
            const favoritePlaces = places.filter(place => favorites.includes(place.id));
            displayFavoritesList(favoritePlaces);
        }
            
        
    }
 catch (error) {
    console.error('Error fetching places', error);
    }
}

fetchPlaces();

//toggle favorite
function toggleFavorite(placeId, starIconElement) {
    const index = favorites.indexOf(placeId);
    const isNowFavorite = index === -1;

    if (isNowFavorite) {
        favorites.push(placeId);
    } else {
        favorites.splice(index, 1);
    }

    //update local storage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    if (starIconElement) {
        starIconElement.src = isNowFavorite
            ? "assets/icons/highlighted_star.png"
            : "assets/icons/unhighlighted_star.png";
}
    if (favoritesContainer) {
        fetchPlaces();
    }
    //displayFavorites();
}

//display favorites

function displayFavorites() {
    const allStars = document.querySelectorAll('.unhighlighted-star-icon');
    allStars.forEach(star => {
        const id = parseInt(star.parentElement.innerText);
        if (favorites.includes(id)) {
            star.src = "assets/icons/highlighted_star.png";
        } else {
            star.src = "assets/icons/unhighlighted_star.png";
        }
    });
}

//display places list data
function displayPlacesListData(places) {
    //listContainer.innerHTML = '';

    places.forEach((place) => {

        const isFavorite = favorites.includes(place.id);
        const starIconSrc = isFavorite ? 'highlighted_star.png' : 'unhighlighted_star.png';

        const placeItem = document.createElement('div');
        placeItem.classList.add('place-item');

        placeItem.innerHTML = `
        <div class="image-wrapper">
            <img src="${place.image}" alt="${place.name}" class="place-image">
            <img src="assets/icons/${starIconSrc}" data-id="${place.id}" alt="favorite star" class="star-icon-overlay">
        </div>
        <h2>${place.name}</h2>
        <p>${place.description}</p>
`;

        placeItem.addEventListener('click', () => {
            window.location.href = `details.html?id=${place.id}`;
        });

        const starIcon = placeItem.querySelector('.star-icon-overlay');
        starIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            //const placeId = parseInt(event.target.dataset.id);
            toggleFavorite(place.id, starIcon);
        });

        listContainer.appendChild(placeItem);
    });

    //displayFavorites();
}

//display place details
function displayPlaceDetails(place) {
    const isFavorited = favorites.includes(place.id);
    const starIconSrc = isFavorited 
        ? "assets/icons/highlighted_star.png"
        : "assets/icons/unhighlighted_star.png";

        detailsContainer.innerHTML = `
       
            <div class="image-wrapper">
                <img src="${place.image}" alt="${place.name}" class="detail-image">
                <a href="mainPage.html">
                    <img src="assets/icons/arrow.png" class="back-arrow-icon" alt="Back to home">
                </a>
                <img src="${starIconSrc}" class="star-icon-overlay" data-id="${place.id}" alt="favorite icon">
            <div class="place-card">
                <h2>${place.name}</h2>
                <p>${place.description}</p>
                <p><strong>Address:</strong> ${place.address}</p>
                <p><strong>Visit website:</strong> <a href="${place.website}" target="_blank">${place.website}</a></p>
            </div>
        </div>
    `;

    const starIcon = detailsContainer.querySelector('.star-icon-overlay');
    starIcon.addEventListener('click', () => {
        toggleFavorite(place.id, starIcon);
    });
        //displayFavorites();
}

//display favorites list
function displayFavoritesList(places) {

    if (places.length === 0) {
        favoritesContainer.innerHTML = `<h1 id = "no-favorites-message">No favorites selected</h1>`;
        console.log("No favorites to display.");
        return;
    }

    places.forEach((place) => {
        const isFavorite = favorites.includes(place.id);
        const starIconSrc = isFavorite ? 'highlighted_star.png' : 'unhighlighted_star.png';

        const placeItem = document.createElement('div');
        placeItem.classList.add('place-item');

        placeItem.innerHTML = `
            <div class="image-wrapper">
                <img src="${place.image}" alt="${place.name}" class="place-image">
                <img src="assets/icons/${starIconSrc}" data-id="${place.id}" alt="favorite star" class="star-icon-overlay">
            </div>
            <h2>${place.name}</h2>
            <p>${place.description}</p>
        `;

        placeItem.addEventListener('click', () => {
            window.location.href = `details.html?id=${place.id}`;
        });

        const starIcon = placeItem.querySelector('.star-icon-overlay');
        starIcon.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleFavorite(place.id, starIcon);
        });

        favoritesContainer.appendChild(placeItem);
    });
}




//register service worker
if(navigator.serviceWorker.controller){
    navigator.serviceWorker.controller.postMessage('Hello from the client page');
}


const currentPage = window.location.pathname;

if (currentPage.includes("mainPage.html")) {
    document.getElementById('nav-home')?.classList.add('active');
}

if (currentPage.includes("favorites.html")) {
    document.getElementById('nav-favorites')?.classList.add('active');
}