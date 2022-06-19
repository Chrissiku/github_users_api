/* eslint-disable quotes */
const APIURL = "https://api.github.com/users/";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
// const axios = "https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.0/axios.min.js";

// Create user card function
const createUserCard = (user) => {
  const userID = user.name || user.login;
  const userBio = user.bio ? `<p>${user.bio}</p>` : "";
  const cardHTML = `
    <div class="card">
    <div class="img">
      <div class="banner"></div>
      <img src="${user.avatar_url}" class="avatar" alt="${user.name}"/>
    </div>
    <div class="user-info">
      <h2>${userID}</h2>
      <p>${userBio}</p>
      <ul>
        <li>${user.followers}<strong>Followers</strong></li>
        <li>${user.following}<strong>Following</strong></li>
        <li>${user.public_repos}<strong>Repos</strong></li>
      </ul>
      <div id="repos"></div>
      <a href="https://github.com/${user.login}" target="_blank" class="follow">View profile</a>
    </div>
  </div>
      `;
  main.innerHTML = cardHTML;
};

// Generate card error function
const createErrorCard = (msg) => {
  const cardHTML = `
          <div class="card error">
              <h1>${msg}</h1>
          </div>
      `;

  main.innerHTML = cardHTML;
};

// Function to add repository to card
const addReposToCard = (repos) => {
  const reposEl = document.getElementById("repos");

  repos.slice(0, 10).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
};

// function to get users repositories
const getRepos = async (username) => {
  try {
    const { data } = await axios(`${APIURL + username}/repos?sort=created`);

    addReposToCard(data);
  } catch (err) {
    createErrorCard("Problem fetching repos");
  }
};

// function to get user
const getUser = async (username) => {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
    getRepos(username);
  } catch (err) {
    if (err.response.status === 404) {
      createErrorCard("No profile with this username");
    }
  }
};

// search user
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = "";
  }
});
