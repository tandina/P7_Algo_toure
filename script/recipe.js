const data = "/data/recipes.json";
import { getTag, getNotify, setNotify } from "./store.js";
let recipes = [];
let backupRecipes = [];
let change = false;

const tagInstr = ["INGREDIENT", "DEVICE", "UTENSILS"];
let prevLen = [0, 0, 0];
let tags = [getTag("INGREDIENT"), getTag("DEVICE"), getTag("UTENSILS")];

const recipeData = document.querySelector("#recipesHome");

const renderRecipe = (where) => {
  where.innerHTML = "";
    for (let i = 0;i < recipes.length;i++) {
    where.innerHTML += `
                        <article class="recipeCard col-3" id="recipeCardUn">
                        <span ${recipes[i].id}></span>
                                <div class="recipePic"></div>
                                <div class="recipeInfo">
                                    <div class="recipeTitle row">
                                        <h2>${recipes[i].name}</h2>
                                        <div class="recipeTime row">
                                            <i class="far fa-clock"></i>
                                            <p class="recipeTimeText">${
                                              recipes[i].time
                                            } min</p>
                                        </div>
                                    </div>
                                    <div class="recipeDetails row">
                                        <div class="ingredients">
                                            ${renderIngredients(recipes[i])}
                                        </div>
                                        <div class="description">
                                            <p class="productDescription">${recipes[i].description.substring(
                                              0,
                                              150
                                            )}...</p>
                                        </div>
                                    </div>
                                </div>
                        </article>
                        `;
  }
};

const ingredientMatchFilter = (ingredients, _filter) => {
  let ret = false;
    for (let i = 0;i < ingredients.length;i++) {
    if (ingredients[i].ingredient.toLowerCase().includes(_filter)) {
      ret = true;
      break ;
    }
  }
  return ret;
};

const utensilMatchFilter = (utensils, _filter) => {
  let ret = false;
    for (let i = 0;i < utensils.length;i++) {
    if (utensils[i].toLowerCase().includes(_filter)) {
      ret = true;
      break ;
    }
  }
  return ret;
};

const recipeMatchTags = (recipe) => {
  if (!tags[0].length && !tags[1].length && !tags[2].length) return true;

  let match = [0, 0, 0];
  for (let i = 0; i < tags[0].length;i++) {
       if (
      ingredientMatchFilter(
        recipe.ingredients,
        tags[0][i].toLowerCase().trim()
      )
    )
      match[0]++;
  }
  for (let i = 0; i < tags[1].length;i++) {
    if (recipe.appliance == tags[1][i])
      match[1]++;
  }
  for (let i = 0; i < tags[2].length;i++) {
    if (utensilMatchFilter(recipe.ustensils, tags[2][i]))
      match[2]++;
  }
  return match[0] || match[2] || match[1];
};

const recipeMatchFilter = (recipe, filter) => {
  if (!filter) return recipeMatchTags(recipe);
  filter = filter.toLowerCase().trim();
  return (
    recipe.name.toLowerCase().includes(filter) ||
    // || recipe.description.toLowerCase().includes(filter)
    ingredientMatchFilter(recipe.ingredients, filter)
  );
};

const searchInput = document.getElementById("searchBar");
searchInput.addEventListener("keydown", (e) => (change = true));

// check for change in input every 100ms
const InputChangeIntervalId = window.setInterval(() => {
  if (change) {
    // case input too small
    if (searchInput.value != "" && searchInput.value.length < 3) {
      change = false;
      return ;
    }
    recipes = backupRecipes;
    recipes = recipes.filter((recipe) =>
      recipeMatchFilter(recipe, searchInput.value)
    );
    renderRecipe(recipeData);
    change = false;
  }
}, 100);

const notificationChangeIntervalId = window.setInterval(() => {
  const removeNotification = [
    getNotify("INGREDIENT"),
    getNotify("DEVICE"),
    getNotify("UTENSILS"),
  ];

  const currentLen = [
    getTag("INGREDIENT").length,
    getTag("DEVICE").length,
    getTag("UTENSILS").length,
  ];
  for (let i = 0; i < 3; i++) {
    if (currentLen[i] != prevLen[i]) {
      const insertTag = getTag(tagInstr[i]);
      tags[i] = insertTag;
      prevLen[i] = currentLen[i];
      currentLen[i] = insertTag.length;
      console.log("change");
      change = true;
    }
  }
}, 10);

const putBalise = (content, balise) => {
  return `<${balise}> ${content} </${balise}>`;
};
// takes one recipe and render its ingredients
const renderIngredients = (recipe) => {
  let render = "";

  // takes one ingredient and return its content
  let renderOneIngredient = (ingredient) => {
    return (
      `<span class="recipeIngredient">${ingredient.ingredient} </span>` +
      (ingredient.hasOwnProperty("quantity")
        ? `:${ingredient.quantity} `
        : ``) +
      (ingredient.hasOwnProperty("unit") ? ` ${ingredient.unit} ` : ``)
    );
  };
  for (let i = 0;i < recipe.ingredients.length;i++) {
    let ingredient = renderOneIngredient(recipe.ingredients[i]);
    render += putBalise(ingredient, "p");
  }
  return render;
};
(async function fetchRecipes() {
  try {
    // after this line, our function will wait for the `fetch()` call to be settled
    // the `fetch()` call will either return a Response or throw an error
    const response = await fetch(data);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // after this line, our function will wait for the `response.json()` call to be settled
    // the `response.json()` call will either return the JSON object or throw an error
    // <p>${test()}:${recipe.quantity} ${recipe.unit}</p>
    recipes = await response.json();
    backupRecipes = recipes;
    renderRecipe(recipeData);
  } catch (error) {
    console.error(`Could not get recipes: ${error}`);
  }
})();
