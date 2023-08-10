const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const animeName = document.getElementById('animeName');
const animeImage = document.getElementById('animeImage');
const animeUrl = document.getElementById('animeUrl');
const resultsContainer = document.querySelector('.results');
const suggestionsContainer = document.getElementById('suggestions');
animeUrl.style.display = "none";
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
                firstResult = data.results[0];
                animeName.innerHTML = `<h1>${firstResult.title}</h1>`;
                animeImage.src = firstResult.image;
                animeUrl.style.display = "block";
                animeid = `https://api.consumet.org/anime/gogoanime/info/${firstResult.id}`;
                //animeUrl.href = firstResult.url;
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
animeUrl.addEventListener('click', () => {
    document.querySelector('.container').innerHTML = '';
    fetch(animeid)
    .then(response => response.json())
    .then(data => {
      const episodes = data.episodes;
  
      if (episodes && episodes.length > 0) {
        console.log('List of episode numbers:');
        episodes.forEach(episode => {
          console.log(episode.number);
          const episodeDiv = document.createElement('div');
          episodeDiv.classList.add('episodes');
          episodeDiv.textContent = episode.number;
          
          episodeDiv.addEventListener('click', () => {
            console.log('Clicked episode number:', episode.number);
            vidLink = `https://api.consumet.org/anime/gogoanime/watch/${firstResult.id}-episode-${episode.number}`;
            fetch(vidLink)
            .then(response => response.json())
            .then(data => {
            videolink = getHighestQualityUrl(data);
            window.location.href = `https://bharadwajpro.github.io/m3u8-player/player/#${videolink}`;
            })
            .catch(error => {
            console.error('Error fetching data:', error);
            });
          });
          
          document.querySelector('.container').appendChild(episodeDiv);
        });
      } else {
        console.log('No episodes found.');
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});
// Function to get the highest quality URL
function getHighestQualityUrl(data) {
    const highestQualitySource = data.sources.reduce((maxQualitySource, source) => {
      const qualityRank = { "default": 0, "360p": 1, "480p": 2, "720p": 3, "1080p": 4 };
      return qualityRank[source.quality] > qualityRank[maxQualitySource.quality] ? source : maxQualitySource;
    });
  
    return highestQualitySource.url;
  }