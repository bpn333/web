const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const animeName = document.getElementById('animeName');
const animeImage = document.getElementById('animeImage');
const animeUrl = document.getElementById('animeUrl');
const resultsContainer = document.querySelector('.results');
const suggestionsContainer = document.getElementById('suggestions');
animeUrl.style.display = "none";
description = "";
window.addEventListener('popstate', () => {
  location.reload();
});

// Function to read query parameters from the URL
function getQueryParams() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return {
      q: urlParams.get('q'),
      ep: urlParams.get('ep')
  };
}

// Function to populate input field with query parameter from the URL
function populateInputFromQueryParams() {
  const queryParams = getQueryParams();
  if (queryParams.q) {
      const searchInput = document.getElementById('searchInput');
      searchInput.value = queryParams.q;
      performSearch(queryParams.q);
  }
}
// Call the function to populate input field when the page loads
populateInputFromQueryParams();

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
}, 300);

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
                if(getQueryParams().ep!=null){
                  //console.log("both",getQueryParams().ep,getQueryParams().q);
                  const ep=getQueryParams().ep;
                  updateURL(query,ep);
                  loadEpisode(ep);
                }
                else{
                  //console.log("only query")
                  updateURL(query,"");
                }
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
  fetchEpisodes();});

  function fetchEpisodes(){
    document.querySelector('.container').innerHTML = '';
    fetch(animeid)
    .then(response => response.json())
    .then(data => {
      const episodes = data.episodes;
      description = data.description;
  
      if (episodes && episodes.length > 0) {
        //console.log('List of episode numbers:');
        episodes.forEach(episode => {
          //console.log(episode.number);
          const episodeDiv = document.createElement('div');
          episodeDiv.classList.add('episodes');
          episodeDiv.textContent = episode.number;
          
          episodeDiv.addEventListener('click', () => {
            loadEpisode(episode.number);
          });
          document.querySelector('.container').appendChild(episodeDiv);
        });
      } else {
        //console.log('No episodes found.');
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }
function updateURL(newQuery, newEpisode) {
  let newURL = window.location.origin + window.location.pathname;

  if (newQuery) {
      newURL += '?q=' + newQuery;
  }

  if (newEpisode) {
      newURL += newQuery ? '&' : '?'; // Add '&' if 'q' is present, otherwise '?'
      newURL += 'ep=' + newEpisode;
  }

  window.history.pushState({}, '', newURL);
  //console.log(`URL updated: ${newURL}`);
}

function loadEpisode(ep){
  updateURL(firstResult.id,ep);
  //console.log("episode loading ",ep);
  //console.log('Clicked episode number:', episode.number);
  vidLink = `https://api.consumet.org/anime/gogoanime/watch/${firstResult.id}-episode-${ep}`;
  fetch(vidLink)
  .then(response => response.json())
  .then(data => {
  //document.body.innerHTML = `<iframe id="videoplayer" allowfullscreen sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock" src=https://bharadwajpro.github.io/m3u8-player/player/#${videolink}></iframe><p id="description">${description}</p>`
  document.body.innerHTML = `<video id="videoplayer" class="video-js vjs-default-skin" controls preload="auto"></video>
  <select id="qualitySelector">
  <option value="default">Auto</option>
  <option value="360p">360p</option>
  <option value="480p">480p</option>
  <option value="720p">720p</option>
  <option value="1080p">1080p</option>
  <option value="backup">Backup</option>
</select>
<h1>${firstResult.id}-episode-${ep}</h1>
<p id="description">${description}</p>`
  var player = videojs('videoplayer'); //it is kind of necessary idk why
  data.sources.forEach(source => {
      const sourceElement = document.createElement('source');
      sourceElement.src = source.url;
      sourceElement.type = 'application/x-mpegURL';
      sourceElement.setAttribute('res', source.quality);
      player.src(sourceElement);
    });
    
    const qualitySelector = document.getElementById('qualitySelector');
    qualitySelector.addEventListener('change', () => {
      const currentTime = player.currentTime();
      const selectedQuality = qualitySelector.value;
      const sourceElement = player.currentSource();
    
      if (selectedQuality === 'default') {
        player.src({ type: sourceElement.type, src: sourceElement.src });
      } else {
        const selectedSource = data.sources.find(source => source.quality === selectedQuality);
        player.src({ type: sourceElement.type, src: selectedSource.url });
      }
      player.currentTime(currentTime);
      player.play();
    });
  //window.location.href = `https://bharadwajpro.github.io/m3u8-player/player/#${videolink}`;
  //player.play();
  })
  .catch(error => {
  console.error('Error fetching data:', error);
  });
}