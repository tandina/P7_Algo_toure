// const data='/data/recipes.json';
// puts content in given balise
const tagBalise = (content, balise) => {
    return (`<${balise}>${content}`);
}
// takes one recipe and render its ingredients
const renderIngredientsTags = (recipe) => {
    let render = "";

    // takes one ingredient and return its content
    const renderOneIngredientTags = (ingredient) => {
            return (`<span class="recipeIngredientTags">${ingredient.ingredient} </span>`
            // + ((ingredient.hasOwnProperty("quantity") ? `:${ingredient.quantity} ` : ``))
            // + ((ingredient.hasOwnProperty("unit") ? ` ${ingredient.unit} ` : ``)));
    )};
    recipe.ingredients.forEach(current => {
        const ingredientTag = renderOneIngredientTags(current);
        render += tagBalise(ingredientTag, 'p');
    });
    return (render);
}

const ingredientsTags = document.querySelector('#ingredientCard');
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
            recipes.forEach(recipe => {
                ingredientsTags.innerHTML += `
                        <p><span ${recipe.id}></span>${renderIngredientsTags(recipe)}</p>
                        `
            });
        }
        catch(error) {
          console.error(`Could not get recipes: ${error}`);
        }
        
      })();
