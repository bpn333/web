const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const animeName = document.getElementById('animeName');
const animeImage = document.getElementById('animeImage');
const animeUrl = document.getElementById('animeUrl');
const resultsContainer = document.querySelector('.results');
const suggestionsContainer = document.getElementById('suggestions');
// Event listener for keydown on searchInput
searchInput.addEventListener('input', event => {
    const keyword = searchInput.value.trim();

    if (keyword !== '') {
        // Simulate fetching suggestions based on the keyword
        const apiUrl = `https://api.consumet.org/anime/gogoanime/${keyword}?page=1`;
        
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const suggestions = data.results.map(result => result.title);
                    displaySuggestions(suggestions);
                } else {
                    suggestionsContainer.innerHTML = '';
                }
            })
            .catch(error => {
                console.error('Error fetching suggestions:', error);
                suggestionsContainer.innerHTML = '';
            });
    } else {
        suggestionsContainer.innerHTML = '';
    }
});

// Function to display suggestions
function displaySuggestions(suggestions) {
    const suggestionItems = suggestions.map(suggestion => {
        return `<div class="suggestion">${suggestion}</div>`;
    }).join('');

    suggestionsContainer.innerHTML = suggestionItems;
}

// Event listener for click on suggestions
suggestionsContainer.addEventListener('click', event => {
    const clickedSuggestion = event.target.textContent;
    searchInput.value = clickedSuggestion;
    suggestionsContainer.innerHTML = '';
    performSearch(clickedSuggestion);
});

// Event listener for search button click
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    performSearch(query);
});

// Function to perform the search
function performSearch(query) {
    const apiUrl = `https://api.consumet.org/anime/gogoanime/${query}?page=1`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const firstResult = data.results[0];
                animeName.innerHTML = `<h1>${firstResult.title}</h1>`;
                animeImage.src = firstResult.image;
                animeUrl.href = firstResult.url;
                //document.body.style.backgroundImage = `url('${firstResult.image}')`;
            } else {
                animeName.textContent = 'No results found.';
                animeImage.src = '';
            }

            // Show results container
            resultsContainer.classList.add('show');
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            animeName.textContent = 'An error occurred.';
            animeImage.src = '';
        });
}
