const data='/data/recipes.json';
// puts content in given balise
const putBalise = (content, balise) => {
    return (`<${balise}> ${content} </${balise}>`);
}
// takes one recipe and render its ingredients
const renderIngredients = (recipe) => {
    let render = "";

    // takes one ingredient and return its content
    const renderOneIngredient = (ingredient) => {
            return (`<span class="recipeIngredient">${ingredient.ingredient} </span>`
            + ((ingredient.hasOwnProperty("quantity") ? `:${ingredient.quantity} ` : ``))
            + ((ingredient.hasOwnProperty("unit") ? ` ${ingredient.unit} ` : ``)));
    }
    recipe.ingredients.forEach(current => {
        const ingredient = renderOneIngredient(current);
        render += putBalise(ingredient, 'p');
    });
    return (render);
}
const recipeData = document.querySelector('#recipesHome');
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
                        recipeData.innerHTML += `
                        <article class="recipeCard col-3">
                        <span ${recipe.id}></span>
                                <div class="recipePic"></div>
                                <div class="recipeInfo">
                                    <div class="recipeTitle row">
                                        <h2>${recipe.name}</h2>
                                        <div class="recipeTime row">
                                            <i class="far fa-clock"></i>
                                            <p class="recipeTimeText">${recipe.time} min</p>
                                        </div>
                                    </div>
                                    <div class="recipeDetails row">
                                        <div class="ingredients">
                                            ${renderIngredients(recipe)}
                                        </div>
                                        <div class="description">
                                            <p class="productDescription">${recipe.description.substring(0, 150)}...</p>
                                        </div>
                                    </div>
                                </div>
                        </article>
                        `
            });
        }
        catch(error) {
          console.error(`Could not get recipes: ${error}`);
        }
        
      })();
