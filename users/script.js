const userList = document.getElementById('user-list');

fetch(`https://64da12bce947d30a260ab9fc.mockapi.io/users`)
    .then(response => response.json())
    .then(data => {
        data.forEach(user => {
            const card = createCard(user);
            userList.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error fetching user data:', error);
    });

function createCard(user) {
    const card = document.createElement('div');
    card.classList.add('user-card');

    const avatar = document.createElement('img');
    avatar.src = user.avatar;
    avatar.alt = `${user.name}'s Avatar`;
    avatar.classList.add('user-avatar');

    const userDetails = document.createElement('div');
    userDetails.classList.add('user-details');

    const name = document.createElement('p');
    name.classList.add('user-name');
    name.textContent = user.name;

    const id = document.createElement('p');
    id.textContent = `ID: ${user.id}`;

    userDetails.appendChild(name);
    userDetails.appendChild(id);

    card.appendChild(avatar);
    card.appendChild(userDetails);

    return card;
}
