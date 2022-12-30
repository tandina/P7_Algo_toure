const data = "/data/recipes.json";
import {
  getTag,
  getNotify,
  setNotify,
  setView,
  pendingTagRender,
} from "./store.js";
let recipes = [];
let backupRecipes = [];
let change = false;

const tagInstr = ["INGREDIENT", "DEVICE", "UTENSILS"];
let prevLen = [0, 0, 0];
let prevInstr = "";
let tags = [getTag("INGREDIENT"), getTag("DEVICE"), getTag("UTENSILS")];

const recipeData = document.querySelector("#recipesHome");

const renderRecipe = (where) => {
  console.log("renderRecipe()");
  where.innerHTML = "";
  for (let i = 0; i < recipes.length; i++) {
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
                                            <p class="productDescription">${recipes[
                                              i
                                            ].description.substring(
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
  for (let i = 0; i < ingredients.length; i++) {
    if (ingredients[i].ingredient.toLowerCase().includes(_filter)) {
      ret = true;
      break;
    }
  }
  return ret;
};

const recipeMatchTags = (recipe) => {
  if (!tags[0].length && !tags[1].length && !tags[2].length) return true;

  let match = [0, 0, 0];
  for (let i = 0; i < tags[0].length; i++) {
    if (
      ingredientMatchFilter(recipe.ingredients, tags[0][i].toLowerCase().trim())
    )
      match[0]++;
  }
  for (let i = 0; i < tags[1].length; i++) {
    if (recipe.appliance == tags[1][i]) match[1]++;
  }
  const matchDevice = (tags[1].length && match[1]) || tags[1].length == 0;
  const matchIngredient =
    (match[0] && match[0] == tags[0].length) || tags[0].length == 0;
  const matchUtensils = () => {
    if (!tags[2].length) return true;
    console.log("-x-x-x-x-x start utensils debug");
    let i = 0;
    while (i < recipe.ustensils.length) {
      if (tags[2].includes(recipe.ustensils[i])) return true;
      console.log(recipe.ustensils[i]);
      i++;
    }
    return false;
  };
  return matchDevice && matchIngredient && matchUtensils();
};

// const recipeMatchFilter = (recipe, filter) => {
//   if (!filter) return recipeMatchTags(recipe);
//   filter = filter.toLowerCase().trim();
//   return (
//     recipe.name.toLowerCase().includes(filter) ||
//     // || recipe.description.toLowerCase().includes(filter)
//     ingredientMatchFilter(recipe.ingredients, filter)
//   );
// };

const recipeMatchFilter = (recipe, filter) => {
  if (!filter) return true;
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
      return;
    }
    recipes = [...backupRecipes];
    recipes = recipes.filter(
      (recipe) =>
        recipeMatchFilter(recipe, searchInput.value) && recipeMatchTags(recipe)
    );
    // update view object
    setView(recipes);
    renderRecipe(recipeData);
    // notify concerned tag card for change
    pendingTagRender.setNotify(prevInstr, true);
    // notify other tag cards for change
    for (let i = 0; i < tagInstr.length; i++) {
      if (tagInstr[i] != prevInstr) {
        pendingTagRender.setNotify(tagInstr[i], true);
      }
    }
    change = false;
  }
}, 2);

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
      prevInstr = tagInstr[i];
      currentLen[i] = insertTag.length;
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
  for (let i = 0; i < recipe.ingredients.length; i++) {
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
