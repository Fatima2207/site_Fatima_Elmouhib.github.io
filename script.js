// Données simulées d'une API
const mockGamesData = [
  { name: "Fortnite", description: "Jeu de battle royale dynamique et compétitif", image: "images/fortnite (2).jpg" },
  { name: "Minecraft", description: "Jeu de construction et de survie", image: "images/minecraft.jpg" },
  { name: "FIFA", description: "Simulation de football réaliste", image: "images/fifa.jpg" },
  { name: "Call of Duty", description: "Jeu de tir très populaire", image: "images/call.jpg" },
  { name: "League of Legends", description: "Jeu compétitif stratégique", image: "images/league.jpg" }
];

let allGames = [];

// Fonction pour simuler un appel API (fetch)
async function fetchGames() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGamesData);
    }, 1000); // 1 seconde de délai pour simuler le réseau
  });
}

// Affichage des jeux
function displayGames(games) {
  const container = document.getElementById("games-container");
  container.innerHTML = "";

  if (games.length === 0) {
    container.innerHTML = "<p>Aucun jeu trouvé.</p>";
    return;
  }

  games.forEach(game => {
    container.innerHTML += `
      <div class="card">
        <img src="${game.image}" alt="${game.name}">
        <h3>${game.name}</h3>
        <p>${game.description}</p>
      </div>
    `;
  });
}

// Initialisation au chargement de la page
window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById("games-container");
  container.innerHTML = "<p id='loading-message'>Chargement des jeux depuis l'API...</p>";
  
  try {
    allGames = await fetchGames();
    displayGames(allGames);
  } catch (error) {
    container.innerHTML = "<p>Erreur lors du chargement des jeux.</p>";
  }
});

// Filtrage (recherche)
function filterGames() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const filtered = allGames.filter(game => 
    game.name.toLowerCase().includes(query) || 
    game.description.toLowerCase().includes(query)
  );
  displayGames(filtered);
}

// Menu Mobile
function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.toggle("active");
}

// Fermer le menu mobile en cliquant sur un lien
document.querySelectorAll('#nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById("nav-menu").classList.remove("active");
  });
});

// Formulaire de contact
function handleContact(event) {
  event.preventDefault(); // Empêche le rechargement de la page
  
  const email = document.getElementById("email").value;
  if (email) {
    const successMsg = document.getElementById("contact-success");
    successMsg.style.display = "block";
    document.getElementById("contact-form").reset();
    
    // Masquer le message après 3 secondes
    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  }
}

// Ajout d'un avis
function addReview(event) {
  event.preventDefault();

  const game = document.getElementById("review-game").value;
  const name = document.getElementById("review-name").value;
  const text = document.getElementById("review-text").value;

  if (game && name && text) {
    const container = document.getElementById("reviews-container");

    const newReview = document.createElement("div");
    newReview.className = "review";
    newReview.innerHTML = `
      <h3>${game}</h3>
      <p>\u201C${text}\u201D \u2014 ${name}</p>
      <div class="review-actions">
        <button class="btn-edit" onclick="editReview(this)">&#9998; Modifier</button>
        <button class="btn-delete" onclick="deleteReview(this)">&#10006; Supprimer</button>
      </div>
    `;

    container.appendChild(newReview);
    document.getElementById("review-form").reset();
  }
}

// Supprimer un avis
function deleteReview(btn) {
  const review = btn.closest(".review");
  review.style.transition = "opacity 0.4s ease, transform 0.4s ease";
  review.style.opacity = "0";
  review.style.transform = "translateX(50px)";
  setTimeout(() => {
    review.remove();
  }, 400);
}

// Modifier un avis
function editReview(btn) {
  const review = btn.closest(".review");
  const h3 = review.querySelector("h3");
  const p = review.querySelector("p");

  const currentGame = h3.textContent;
  const currentText = p.textContent;

  // Remplacer le contenu par des champs éditables
  h3.style.display = "none";
  p.style.display = "none";
  btn.style.display = "none";

  const editForm = document.createElement("div");
  editForm.className = "edit-form";
  editForm.innerHTML = `
    <input type="text" class="edit-game" value="${currentGame}">
    <textarea class="edit-text">${currentText}</textarea>
    <div class="review-actions">
      <button class="btn-edit" onclick="saveReview(this)">&#10004; Enregistrer</button>
      <button class="btn-delete" onclick="cancelEdit(this)">&#10006; Annuler</button>
    </div>
  `;

  review.insertBefore(editForm, review.querySelector(".review-actions"));
}

// Enregistrer la modification
function saveReview(btn) {
  const review = btn.closest(".review");
  const editForm = review.querySelector(".edit-form");
  const newGame = editForm.querySelector(".edit-game").value;
  const newText = editForm.querySelector(".edit-text").value;

  if (newGame && newText) {
    const h3 = review.querySelector("h3");
    const p = review.querySelector("p");

    h3.textContent = newGame;
    p.textContent = newText;

    h3.style.display = "";
    p.style.display = "";
    review.querySelector(".review-actions:last-child .btn-edit").style.display = "";

    editForm.remove();
  }
}

// Annuler la modification
function cancelEdit(btn) {
  const review = btn.closest(".review");
  const editForm = review.querySelector(".edit-form");

  review.querySelector("h3").style.display = "";
  review.querySelector("p").style.display = "";
  review.querySelector(".review-actions:last-child .btn-edit").style.display = "";

  editForm.remove();
}
