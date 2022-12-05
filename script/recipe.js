const data = '/data/recipes.json';
let recipes = [];
let backupRecipes = [];
let change = false;
const recipeData = document.querySelector('#recipesHome');

const renderRecipe = (where) => {
    where.innerHTML = '';
    recipes.forEach(recipe => {
        where.innerHTML += `
                        <article class="recipeCard col-3" id="recipeCardUn">
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
            ;

    });
}

const recipeMatchFilter = (recipe, filter) => {
    filter = filter.toLowerCase().trim();
    const ingredientMatchFilter = (ingredients, _filter) => {
        let ret = false;
        ingredients.forEach(ingredient => {
            if (ingredient.ingredient.toLowerCase().includes(_filter)) {
                ret = true;
                return;
            }
        })
        return (ret);
    }
    return (recipe.name.toLowerCase().includes(filter)
        // || recipe.description.toLowerCase().includes(filter)
        || ingredientMatchFilter(recipe.ingredients, filter));
}



const searchInput = document.getElementById("searchBar")
searchInput.addEventListener("keydown", e => change = true);

// check for change in input every 100ms
const intervalId = window.setInterval(() => {
    if (change) {
        recipes = backupRecipes;
        recipes = recipes.filter(recipe => recipeMatchFilter(recipe, searchInput.value));
        renderRecipe(recipeData);
        change = false;
    }
}, 100);


const putBalise = (content, balise) => {
    return (`<${balise}> ${content} </${balise}>`);
}
// takes one recipe and render its ingredients
const renderIngredients = (recipe) => {
    let render = "";

    // takes one ingredient and return its content
    let renderOneIngredient = (ingredient) => {
        return (`<span class="recipeIngredient">${ingredient.ingredient} </span>`
            + ((ingredient.hasOwnProperty("quantity") ? `:${ingredient.quantity} ` : ``))
            + ((ingredient.hasOwnProperty("unit") ? ` ${ingredient.unit} ` : ``)));
    }
    recipe.ingredients.forEach(current => {
        let ingredient = renderOneIngredient(current);
        render += putBalise(ingredient, 'p');
    });
    return (render);
}
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

    }
    catch (error) {
        console.error(`Could not get recipes: ${error}`);
    }

})();

