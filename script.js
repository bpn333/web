const apiUrl = `https://api.github.com/repos/bipin333/web/contents`;

fetch(apiUrl)
  .then(response => response.json())
  .then(contents => {
    const folders = contents.filter(item => item.type === 'dir');
    folders.forEach(folder => {
      //document.body.innerHTML += `<div class="mypage" <a href="https://bipin333.github.io/web/${folder.name}">${folder.name}</a><div>`
      const SiteDiv = document.createElement('div');
      SiteDiv.classList.add('mypage');
      SiteDiv.textContent = `${folder.name}`;
      document.querySelector('.container').appendChild(SiteDiv);
      SiteDiv.addEventListener('click', () =>{
        window.location.href = `https://bipin333.github.io/web/${folder.name}`;
      });
    });
  });