// const data='/data/recipes.json';
// puts content in given balise
const tagBalise = (content, balise) => {
  return `<${balise}>${content}`;
};
// takes one recipe and render its ingredients
const renderIngredientsTags = (recipe) => {
  let render = "";

  // takes one ingredient and return its content
  const renderOneIngredientTags = (ingredient) => {
    return `<span class="recipeIngredientTags">${ingredient.ingredient} </span>`;
    // + ((ingredient.hasOwnProperty("quantity") ? `:${ingredient.quantity} ` : ``))
    // + ((ingredient.hasOwnProperty("unit") ? ` ${ingredient.unit} ` : ``)));
  };
  for (let i = 0; i < recipe.ingredients.length;i++) {
    const ingredientTag = renderOneIngredientTags(recipe.ingredients[i]);
    render += tagBalise(ingredientTag, "p");
  }
  return render;
};

const ingredientsTags = document.querySelector("#ingredientCard");
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
    const recipes = await response.json();
    for (let i = 0;i < recipes.length;i++) {
      ingredientsTags.innerHTML += `
            <p><span ${recipes[i].id}></span>${renderIngredientsTags(recipes[i])}</p>
                        `;
    }
  } catch (error) {
    console.error(`Could not get recipes: ${error}`);
  }
})();
