document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchButton');
    const repoList = document.getElementById('repoList');

    fetchButton.addEventListener('click', async () => {
        try {
            const response = await fetch('https://api.github.com/users/gaurabsap/repos');
            const data = await response.json();

            if (response.ok) {
                repoList.innerHTML = ''; // Clear previous content
                data.forEach(repo => {
                    const repoItem = document.createElement('div');
                    repoItem.className = 'repo';
                    repoItem.innerHTML = `<h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3><p>${repo.description}</p>`;
                    repoList.appendChild(repoItem);
                });
            } else {
                repoList.innerHTML = '<p>Error fetching repositories</p>';
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });
});
