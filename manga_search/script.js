document.getElementById('search').addEventListener('click',()=>{
    showResult(`https://api.consumet.org/manga/mangadex/${document.getElementById('input').value}`);
});
function showResult(url){
    document.getElementById('results').innerHTML = "";
    fetch(url).then(responce => responce.json()).then(data =>{
        console.log(data);
        data.results.forEach(manga =>{
            const mangaCard = document.createElement('div');
            mangaCard.classList.add('manga-card');
            const mangaTitle = document.createElement('h2');
            mangaTitle.classList.add('manga-title');
            mangaTitle.textContent = manga.title;
            mangaTitle.addEventListener('click',()=>{
                console.log(manga.id);
                showchapters(`https://api.consumet.org/manga/mangadex/info/${manga.id}`);
            });
            const mangaInfo = document.createElement('div');
            mangaInfo.classList.add('manga-info');
            mangaInfo.textContent = manga.description;
            mangaCard.appendChild(mangaTitle);
            mangaCard.appendChild(mangaInfo);
            document.getElementById('results').appendChild(mangaCard);
        });
    });
}
function showchapters(url){
    document.getElementById('results').innerHTML = "";
    fetch(url).then(responce => responce.json()).then(data =>{
        console.log(data);
        const mangaCard = document.createElement('div');
        mangaCard.classList.add('manga-card');
        const mangaImg = document.createElement('img');
        mangaImg.classList.add('manga-img');
        mangaImg.src = data.image;
        const mangaTitle = document.createElement('h2');
        mangaTitle.classList.add('manga-title');
        mangaTitle.textContent = data.title;
        const chapterr = document.createElement('div');
        chapterr.classList.add('manga-chapters');
        data.chapters.forEach(chapter =>{
            const chap = document.createElement('div');
            chap.classList.add('manga-chapter');
            chap.textContent = chapter.chapterNumber + chapter.title;
            chap.addEventListener('click',()=>{
                readchapter(`https://api.consumet.org/manga/mangadex/read/${chapter.id}`);
            });
            chapterr.appendChild(chap);
        });
        mangaCard.appendChild(mangaImg);
        mangaCard.appendChild(mangaTitle);
        mangaCard.appendChild(chapterr);
        document.getElementById('results').appendChild(mangaCard);
    });
}
function readchapter(url){
    document.getElementById('results').innerHTML = "";
    fetch(url).then(responce => responce.json()).then(data =>{
        data.forEach(img =>{
            const page = document.createElement('img');
            page.classList.add('page');
            page.src=img.img;
            document.getElementById('results').appendChild(page);
        });
    });
}