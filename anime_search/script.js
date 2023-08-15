const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const animeName = document.getElementById('animeName');
const animeImage = document.getElementById('animeImage');
const animeUrl = document.getElementById('animeUrl');
const animeinfo = document.getElementById('animeinfo');
const resultsContainer = document.querySelector('.results');
const suggestionsContainer = document.getElementById('suggestions');
const home = document.getElementById('home');
const animeListDiv = document.getElementById('homescreen');
animeUrl.style.display = "none";
let description;
let episodes;
let old = null;
window.addEventListener('popstate', () => {
  location.reload();
});
home.addEventListener('click',() =>{
  updateURL("","");
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
if(getQueryParams().q == null & getQueryParams().ep == null){
  showAnimes("https://api.consumet.org/anime/gogoanime/top-airing");
}

function showAnimes(url,skip){
  animeListDiv.innerHTML = "";
  fetch(url).then(response => response.json())
  .then(animeData =>{
    animeData.results.forEach(anime => {
    const animeCard = document.createElement('div');
    animeCard.classList.add('anime-card');
    if(skip){
      skip=0;
      return;
    }

    const animeImage = document.createElement('img');
    animeImage.classList.add('anime-image');
    animeImage.src = anime.image;
    animeCard.appendChild(animeImage);

    const animeDetails = document.createElement('div');
    animeDetails.classList.add('anime-details');

    const animeTitle = document.createElement('h2');
    animeTitle.classList.add("anime-title");
    animeTitle.textContent = anime.title;
    animeTitle.addEventListener('click', () => {
      updateURL(anime.id,"");
      location.reload();
    });
    animeDetails.appendChild(animeTitle);
    animeCard.appendChild(animeDetails);
    animeListDiv.appendChild(animeCard);
  });
});
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
                //console.error('Error fetching suggestions:', error);
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
    animeListDiv.innerHTML = "";    //delete home screen
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                firstResult = data.results[0];
                animeid = `https://api.consumet.org/anime/gogoanime/info/${firstResult.id}`;
                fetch(animeid)
                .then(response => response.json())
                .then(data => {
                  animeName.innerHTML = `<h1>${data.title}</h1><br>`;
                  animeinfo.innerHTML = `Release Date: ${data.releaseDate}<br>Language: ${data.subOrDub}<br>${data.type}<br>Status: ${data.status}<br>Name: ${data.otherName}<br>Genres:`;
                  animeImage.src = data.image;
                  animeUrl.style.display = "block";
                  episodes = data.episodes;
                  description = data.description;
                  data.genres.forEach(genre => {
                    const genreElement = document.createElement('div');
                    genreElement.textContent = genre;
                    genreElement.style.cursor = "pointer";
                    genreElement.addEventListener('click',() => {
                      if(old){
                        old.style.color = "yellow";
                      }
                      genreElement.style.color = "green";
                      old = genreElement;
                      showAnimes(`https://api.consumet.org/anime/gogoanime/genre/${genre.replace(/ /g, '-')}`);
                    });
                    animeinfo.appendChild(genreElement);
                  });
                });
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
            }
            // Show results container
            resultsContainer.classList.add('show');
        });
        showAnimes(apiUrl,1);
}
animeUrl.addEventListener('click', () => {
  showepisodes();
});

    function showepisodes(){
      document.querySelector('.container').innerHTML = '';
      if(episodes == 0){
        document.querySelector('.container').style.color = 'red';
        document.querySelector('.container').innerHTML = '<h1>ERROR NO EP FOUND<h1>';
      }
      else{
      episodes.forEach(episode => {
        //console.log(episode.number);
        const episodeDiv = document.createElement('div');
        episodeDiv.classList.add('episodes');
        episodeDiv.textContent = `${firstResult.title} episode ${episode.number}`;
        document.querySelector('.container').appendChild(episodeDiv);
        episodeDiv.addEventListener('click', () => {
          loadEpisode(episode.number);
        });
      });
    }
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
  document.title=`${newQuery}-${newEpisode}`;
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
  document.querySelector(".container").innerHTML = `<video id="videoplayer" class="video-js vjs-default-skin" controls preload="auto"></video>
  <div id="sourceeditor"><button class="navigation" id="prevep"><span class="material-symbols-outlined">
  arrow_back
  </span></button><select id="qualitySelector">
  <option value="default">Auto</option>
  <option value="360p">360p</option>
  <option value="480p">480p</option>
  <option value="720p">720p</option>
  <option value="1080p">1080p</option>
  <option value="backup">Backup</option>
  <option value="others">others</option>
</select><button class="navigation" id="nextep"><span class="material-symbols-outlined">
arrow_forward
</span></button></div>
<h1>${firstResult.title}-episode-${ep}</h1>
<p id="description">${description}</p><input id="input" type="text">
<button id="send">SEND</button><div id="comments"></div>`
secondscrit();
  document.getElementById("nextep").addEventListener("click",() =>{
    episodes.forEach(episode => {
      if(episode.number == parseInt(ep)+1){
        //console.log(episode.number,"found");
        updateURL(firstResult.id,parseInt(ep)+1);
        location.reload();
      }});
  });
  document.getElementById("prevep").addEventListener("click",() =>{
    episodes.forEach(episode => {
      if(episode.number == parseInt(ep)-1){
      updateURL(firstResult.id,parseInt(ep)-1);
      location.reload();
    }});
  });
  var player = videojs('videoplayer'); //it is kind of necessary idk why
  //console.log(data.sources);
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
      } 
      else if(selectedQuality === 'others'){
        fetch(`https://api.consumet.org/anime/gogoanime/servers/${firstResult.id}-episode-${ep}`).then(response => response.json())
        .then(data => {
          window.location.href = `${data[0].url}`;
        });
      }
      else {
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


//2nd script
function secondscrit(){
var deviceIP = "NULL";
animeid = firstResult.id;
ids=null;
var animebin;
oldcommentdata = null;

fetch("https://api.ipify.org?format=json")
  .then(response => response.json())
  .then(data => {
    deviceIP = data.ip;
});
fetch(`https://api.jsonbin.io/v3/b/64dafde18e4aa6225ed028e4`,{
    method: 'GET',
    headers: {
        'X-MASTER-KEY':'$2b$10$mCWrkssvTmzzCTIPfRai/u8I1xxTSqGTztH0zF0tORQ9apnIvNQ6.'
    }
}).then(res => res.json()).then(data => {
    ids=data;
    data.record.forEach(datas =>{
           if(datas.anime == animeid){
            animebin = datas.bin;
            getcomments(animebin);
        }
    });
    animebin=-1;
});

function createbin(){
    const newdata = {
        ip: deviceIP,
        comment: document.getElementById('input').value
    };
    addcomment(document.getElementById('input').value);
    const newdataArray = [];
    newdataArray.push(newdata);
    fetch(`https://api.jsonbin.io/v3/b`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'X-MASTER-KEY':'$2b$10$mCWrkssvTmzzCTIPfRai/u8I1xxTSqGTztH0zF0tORQ9apnIvNQ6.',
            'X-Bin-Name':`${animeid}`,
            'X-Collection-Id':'64db00e1b89b1e2299d0d28d'
        },
        body: JSON.stringify(newdataArray)
    }).then(response => response.json()).then(data =>{
        //console.log(data.metadata.id);
        const newid = {
            anime: animeid,
            bin: data.metadata.id
        };
        ids.record.push(newid);
        const newanime = ids.record.map(record => ({
            anime: record.anime,
            bin: record.bin
        }));
        //console.log(newanime)
        fetch(`https://api.jsonbin.io/v3/b/64dafde18e4aa6225ed028e4`,{
            method: 'PUT',
            headers: {
                'Content-Type':'application/json',
                'X-MASTER-KEY':'$2b$10$mCWrkssvTmzzCTIPfRai/u8I1xxTSqGTztH0zF0tORQ9apnIvNQ6.',
            },
            body: JSON.stringify(newanime)
        });
    });
}

function getcomments(){
fetch(`https://api.jsonbin.io/v3/b/${animebin}`,{
    method: 'GET',
    headers: {
        'X-MASTER-KEY':'$2b$10$mCWrkssvTmzzCTIPfRai/u8I1xxTSqGTztH0zF0tORQ9apnIvNQ6.'
    }
}).then(res => res.json()).then(data => {
    //console.log(data);
    //console.log(animebin)
    data.record.forEach(element => {
          //console.log("your old comment = ",element.comment);
          addcomment(element.comment);
    });
    oldcommentdata = data;
});
}
function addcomment(comment){
  document.getElementById('input').value = '';
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comment');
  commentDiv.textContent = `${comment}`;
  document.getElementById('comments').appendChild(commentDiv);
}
function send(data){
    const records = data.record;
    const newdata = {
        ip: deviceIP,
        comment: document.getElementById('input').value
    };
    addcomment(document.getElementById('input').value);
    records.push(newdata);
    // Flatten the nested structure of the records
    const flattenedRecords = records.map(record => ({
        ip: record.ip,
        comment: record.comment
    }));
    fetch(`https://api.jsonbin.io/v3/b/${animebin}`,{
        method: 'PUT',
        headers: {
            'Content-Type':'application/json',
            'X-MASTER-KEY':'$2b$10$mCWrkssvTmzzCTIPfRai/u8I1xxTSqGTztH0zF0tORQ9apnIvNQ6.',
        },
        body: JSON.stringify(flattenedRecords)
    });
    document.getElementById('input').value = '';
}
document.getElementById('send').addEventListener('click',() => {
    if(document.getElementById('input').value != ''){
        if(animebin){
            send(oldcommentdata);
            //console.log("sending");
        }
        else if(animebin==-1){
            createbin();
            //console.log("creating");
        }
    }
});
}