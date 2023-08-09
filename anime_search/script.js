const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const animeName = document.getElementById('animeName');
const animeImage = document.getElementById('animeImage');
const resultsContainer = document.querySelector('.results');

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    const apiUrl = `https://api.consumet.org/anime/gogoanime/${query}?page=1`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                const firstResult = data.results[0];
                animeName.textContent = firstResult.title;
                animeImage.src = firstResult.image;
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
});
