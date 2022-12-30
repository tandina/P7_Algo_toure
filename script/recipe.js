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
  recipes.forEach((recipe) => {
    where.innerHTML += `
                        <article class="recipeCard col-3" id="recipeCardUn">
                        <span ${recipe.id}></span>
                                <div class="recipePic"></div>
                                <div class="recipeInfo">
                                    <div class="recipeTitle row">
                                        <h2>${recipe.name}</h2>
                                        <div class="recipeTime row">
                                            <i class="far fa-clock"></i>
                                            <p class="recipeTimeText">${
                                              recipe.time
                                            } min</p>
                                        </div>
                                    </div>
                                    <div class="recipeDetails row">
                                        <div class="ingredients">
                                            ${renderIngredients(recipe)}
                                        </div>
                                        <div class="description">
                                            <p class="productDescription">${recipe.description.substring(
                                              0,
                                              150
                                            )}...</p>
                                        </div>
                                    </div>
                                </div>
                        </article>
                        `;
  });
};

const ingredientMatchFilter = (ingredients, _filter) => {
  let ret = false;

  ingredients.forEach((ingredient) => {
    if (ingredient.ingredient.toLowerCase().includes(_filter)) {
      ret = true;
      return;
    }
  });
  return ret;
};

const recipeMatchTags = (recipe) => {
  if (!tags[0].length && !tags[1].length && !tags[2].length) return true;

  let match = [0, 0, 0];

  tags[0].forEach((ingredient) => {
    if (
      ingredientMatchFilter(recipe.ingredients, ingredient.toLowerCase().trim())
    )
      match[0]++;
  });

  tags[1].forEach((appliance) => {
    if (recipe.appliance == appliance) match[1]++;
  });
  const matchDevice = (tags[1].length && match[1]) || tags[1].length == 0;
  const matchIngredient =
    (match[0] && match[0] == tags[0].length) || tags[0].length == 0;
  const matchUtensils = () => {
    if (!tags[2].length) return true;

    let ret = false;
    recipe.ustensils.forEach((ustensil) => {
      if (tags[2].includes(ustensil)) {
        ret = true;
        return;
      }
    });
    return ret;
  };
  return matchDevice && matchIngredient && matchUtensils();
};

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
    tagInstr.forEach((instr) => {
      if (instr != prevInstr) {
        pendingTagRender.setNotify(instr, true);
      }
    });
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
  [0, 0, 0].forEach((_, i) => {
    if (currentLen[i] != prevLen[i]) {
      const insertTag = getTag(tagInstr[i]);
      tags[i] = insertTag;
      prevLen[i] = currentLen[i];
      prevInstr = tagInstr[i];
      currentLen[i] = insertTag.length;
      change = true;
    }
  });
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
  recipe.ingredients.forEach((_ingredient) => {
    let ingredient = renderOneIngredient(_ingredient);
    render += putBalise(ingredient, "p");
  });
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
