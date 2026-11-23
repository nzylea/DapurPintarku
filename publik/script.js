
/* =========================================
   DAPURPINTARKU
   JAVASCRIPT - FITUR WEBSITE
========================================= */

// 1. DATA RESEP

const recipes = [
  {
    id: 1,
    name: "Nasi Goreng Telur",
    ingredients: ["nasi", "telur", "bawang", "kecap"],
    time: "20 menit",
    difficulty: "Mudah",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=700",
    description: "Nasi goreng sederhana dengan telur dan bumbu pilihan.",
    steps: [
      "Siapkan nasi, telur, bawang, dan kecap.",
      "Tumis bawang hingga harum.",
      "Masukkan telur dan orak-arik.",
      "Masukkan nasi dan kecap.",
      "Aduk hingga matang dan sajikan."
    ]
  },
  {
    id: 2,
    name: "Sup Ayam Sayur",
    ingredients: ["ayam", "wortel", "kentang", "bawang"],
    time: "35 menit",
    difficulty: "Mudah",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=700",
    description: "Sup hangat dengan ayam dan aneka sayuran.",
    steps: [
      "Potong ayam dan sayuran.",
      "Rebus ayam hingga matang.",
      "Masukkan wortel dan kentang.",
      "Tambahkan bawang dan bumbu.",
      "Masak hingga sayuran empuk."
    ]
  },
  {
    id: 3,
    name: "Telur Dadar Sayur",
    ingredients: ["telur", "wortel", "bawang"],
    time: "15 menit",
    difficulty: "Mudah",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700",
    description: "Telur dadar dengan campuran sayuran.",
    steps: [
      "Kocok telur dalam mangkuk.",
      "Tambahkan wortel dan bawang.",
      "Aduk hingga tercampur.",
      "Panaskan sedikit minyak.",
      "Goreng hingga kedua sisi matang."
    ]
  },
  {
    id: 4,
    name: "Tumis Kangkung",
    ingredients: ["kangkung", "bawang", "cabai"],
    time: "15 menit",
    difficulty: "Mudah",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=700",
    description: "Tumis sayuran sederhana untuk menu sehari-hari.",
    steps: [
      "Bersihkan kangkung.",
      "Iris bawang dan cabai.",
      "Tumis bawang hingga harum.",
      "Masukkan kangkung.",
      "Aduk hingga matang."
    ]
  },
  {
    id: 5,
    name: "Ayam Goreng",
    ingredients: ["ayam", "bawang", "garam"],
    time: "40 menit",
    difficulty: "Sedang",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700",
    description: "Ayam goreng rumahan dengan bumbu sederhana.",
    steps: [
      "Bersihkan ayam.",
      "Siapkan bumbu dan marinasi ayam.",
      "Masak ayam hingga bumbu meresap.",
      "Goreng hingga matang.",
      "Sajikan bersama nasi."
    ]
  },
  {
    id: 6,
    name: "Kentang Tumis",
    ingredients: ["kentang", "bawang", "cabai"],
    time: "25 menit",
    difficulty: "Mudah",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700",
    description: "Olahan kentang sederhana dengan bumbu tumis.",
    steps: [
      "Kupas dan potong kentang.",
      "Siapkan bawang dan cabai.",
      "Tumis bumbu hingga harum.",
      "Masukkan kentang dan aduk.",
      "Masak hingga kentang matang."
    ]
  }
];

// 2. MENGAMBIL ELEMEN HTML

const ingredientInput = document.getElementById("ingredientInput");
const addIngredientBtn = document.getElementById("addIngredientBtn");
const ingredientList = document.getElementById("ingredientList");
const foodImage = document.getElementById("foodImage");
const imagePreview = document.getElementById("imagePreview");
const recommendBtn = document.getElementById("recommendBtn");
const recipeResults = document.getElementById("recipeResults");
const statusMessage = document.getElementById("statusMessage");
const weeklyMenu = document.getElementById("weeklyMenu");
const favoriteResults = document.getElementById("favoriteResults");
const recipeDetail = document.getElementById("recipeDetail");
const detailContent = document.getElementById("detailContent");

// 3. PENYIMPANAN DATA

let ingredients = [];

let favorites = JSON.parse(
  localStorage.getItem("dapurFavorites") || "[]"
);

// 4. MENAMPILKAN BAHAN

function renderIngredients() {
  ingredientList.innerHTML = "";

  if (ingredients.length === 0) {
    ingredientList.innerHTML =
      '<p class="empty-message">Belum ada bahan yang ditambahkan.</p>';
    return;
  }

  ingredients.forEach((item, index) => {
    const tag = document.createElement("div");
    tag.className = "ingredient-tag";

    const name = document.createElement("span");
    name.textContent = item;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "×";
    remove.setAttribute("aria-label", "Hapus " + item);

    remove.addEventListener("click", () => {
      ingredients.splice(index, 1);
      renderIngredients();
    });

    tag.append(name, remove);
    ingredientList.appendChild(tag);
  });
}

// 5. MENAMBAHKAN BAHAN

function addIngredient() {
  const value = ingredientInput.value.trim().toLowerCase();

  if (!value) {
    statusMessage.textContent = "Masukkan nama bahan terlebih dahulu.";
    return;
  }

  if (ingredients.includes(value)) {
    statusMessage.textContent = "Bahan tersebut sudah ditambahkan.";
    return;
  }

  ingredients.push(value);
  ingredientInput.value = "";
  statusMessage.textContent = "";

  renderIngredients();
}

addIngredientBtn.addEventListener("click", addIngredient);

ingredientInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addIngredient();
  }
});

// 6. PREVIEW FOTO

let selectedImage = null;

foodImage.addEventListener("change", () => {
  const file = foodImage.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    statusMessage.textContent = "Silakan pilih file gambar.";
    foodImage.value = "";
    return;
  }

  if (selectedImage) {
    URL.revokeObjectURL(selectedImage);
  }

  selectedImage = URL.createObjectURL(file);

  imagePreview.innerHTML = "";

  const image = document.createElement("img");
  image.src = selectedImage;
  image.alt = "Pratinjau bahan makanan";

  imagePreview.appendChild(image);

  statusMessage.textContent =
    "Foto berhasil dipilih. Pengenalan AI akan dihubungkan melalui backend.";
});

// 7. MENCARI REKOMENDASI RESEP

function findRecipes() {
  if (ingredients.length === 0) {
    statusMessage.textContent =
      "Tambahkan bahan makanan terlebih dahulu.";
    return;
  }

  const matchedRecipes = recipes
    .map((recipe) => {
      const matched = recipe.ingredients.filter((item) =>
        ingredients.some((userItem) =>
          userItem.includes(item) || item.includes(userItem)
        )
      );

      return {
        ...recipe,
        matchedCount: matched.length
      };
    })
    .filter((recipe) => recipe.matchedCount > 0)
    .sort((a, b) => b.matchedCount - a.matchedCount);

  renderRecipes(matchedRecipes);

  if (matchedRecipes.length > 0) {
    statusMessage.textContent =
      "Ditemukan " + matchedRecipes.length + " resep yang cocok!";
  } else {
    statusMessage.textContent =
      "Belum ditemukan resep yang cocok. Coba bahan lainnya.";
  }
}

recommendBtn.addEventListener("click", findRecipes);

// 8. MENAMPILKAN KARTU RESEP

function renderRecipes(data) {
  recipeResults.innerHTML = "";

  if (data.length === 0) {
    recipeResults.innerHTML = `
      <div class="empty-card">
        <span>🥗</span>
        <h3>Belum ada resep yang cocok</h3>
        <p>Coba tambahkan bahan makanan lainnya.</p>
      </div>
    `;
    return;
  }

  data.forEach((recipe) => {
    const card = document.createElement("article");
    card.className = "recipe-card";

    const image = document.createElement("img");
    image.src = recipe.image;
    image.alt = recipe.name;
    image.loading = "lazy";

    const content = document.createElement("div");
    content.className = "recipe-content";

    const title = document.createElement("h3");
    title.textContent = recipe.name;

    const description = document.createElement("p");
    description.textContent = recipe.description;

    const meta = document.createElement("div");
    meta.className = "recipe-meta";
    meta.textContent =
      "⏱ " + recipe.time + " • " + recipe.difficulty;

    const actions = document.createElement("div");
    actions.className = "recipe-actions";

    const detailButton = document.createElement("button");
    detailButton.className = "detail-button";
    detailButton.textContent = "Lihat Resep";
    detailButton.addEventListener("click", () => {
      showRecipeDetail(recipe.id);
    });

    const favoriteButton = document.createElement("button");
    favoriteButton.className = "favorite-button";
    favoriteButton.textContent =
      favorites.includes(recipe.id) ? "❤️" : "♡";

    favoriteButton.setAttribute("aria-label", "Simpan favorit");

    favoriteButton.addEventListener("click", () => {
      toggleFavorite(recipe.id);
      favoriteButton.textContent =
        favorites.includes(recipe.id) ? "❤️" : "♡";
    });

    actions.append(detailButton, favoriteButton);
    content.append(title, description, meta, actions);
    card.append(image, content);

    recipeResults.appendChild(card);
  });
}

// 9. DETAIL RESEP

function showRecipeDetail(id) {
  const recipe = recipes.find((item) => item.id === id);

  if (!recipe) return;

  const ingredientsHTML = recipe.ingredients
    .map((item) => `<li>${item}</li>`)
    .join("");

  const stepsHTML = recipe.steps
    .map((step) => `<li>${step}</li>`)
    .join("");

  detailContent.innerHTML = `
    <div class="detail-card">
      <img src="${recipe.image}" alt="${recipe.name}">
      <h2>${recipe.name}</h2>
      <p>${recipe.description}</p>
      <p>⏱ ${recipe.time} | ${recipe.difficulty}</p>

      <h3>Bahan-bahan</h3>
      <ul>${ingredientsHTML}</ul>

      <h3>Langkah Memasak</h3>
      <ol>${stepsHTML}</ol>

      <button class="close-detail" id="closeDetail">
        Tutup Resep
      </button>
    </div>
  `;

  recipeDetail.hidden = false;
  recipeDetail.scrollIntoView({ behavior: "smooth" });

  document.getElementById("closeDetail").addEventListener("click", () => {
    recipeDetail.hidden = true;
  });
}

// 10. FAVORIT

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((item) => item !== id);
  } else {
    favorites.push(id);
  }

  localStorage.setItem(
    "dapurFavorites",
    JSON.stringify(favorites)
  );

  renderFavorites();
}

function renderFavorites() {
  const favoriteRecipes = recipes.filter((recipe) =>
    favorites.includes(recipe.id)
  );

  renderRecipeCollection(favoriteRecipes, favoriteResults);
}

// 11. MENAMPILKAN KOLEKSI RESEP

function renderRecipeCollection(data, container) {
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML =
      '<p class="empty-message">Belum ada resep favorit.</p>';
    return;
  }

  data.forEach((recipe) => {
    const card = document.createElement("article");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}" loading="lazy">
      <div class="recipe-content">
        <h3>${recipe.name}</h3>
        <p>${recipe.description}</p>
        <button class="detail-button" type="button">
          Lihat Resep
        </button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => {
      showRecipeDetail(recipe.id);
    });

    container.appendChild(card);
  });
}

// 12. MENU MINGGUAN

function renderWeeklyMenu() {
  const days = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu"
  ];

  const mealIdeas = [
    ["Nasi Goreng Telur", "Sup Ayam Sayur", "Telur Dadar Sayur"],
    ["Roti dan Telur", "Tumis Kangkung", "Ayam Goreng"],
    ["Telur Dadar Sayur", "Sup Ayam Sayur", "Kentang Tumis"],
    ["Nasi Goreng Telur", "Ayam Goreng", "Tumis Kangkung"],
    ["Roti dan Telur", "Kentang Tumis", "Sup Ayam Sayur"],
    ["Telur Dadar Sayur", "Nasi Goreng Telur", "Ayam Goreng"],
    ["Kentang Tumis", "Sup Ayam Sayur", "Tumis Kangkung"]
  ];

  weeklyMenu.innerHTML = "";

  days.forEach((day, index) => {
    const card = document.createElement("div");
    card.className = "day-card";

    const title = document.createElement("h3");
    title.textContent = day;

    const meals = [
      "🌅 Sarapan: " + mealIdeas[index][0],
      "☀️ Makan siang: " + mealIdeas[index][1],
      "🌙 Makan malam: " + mealIdeas[index][2]
    ];

    card.appendChild(title);

    meals.forEach((meal) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = meal;
      card.appendChild(paragraph);
    });

    weeklyMenu.appendChild(card);
  });
}

// 13. MENJALANKAN FITUR SAAT HALAMAN DIBUKA

renderIngredients();
renderFavorites();
renderWeeklyMenu();

console.log("DapurPintarku berhasil dimuat!");
