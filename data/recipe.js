const data='/data/recipes.json';
// const recipeData = document.querySelector('#recipesHome');
//       (async function fetchRecipes() {
//         try {
//             // after this line, our function will wait for the `fetch()` call to be settled
//             // the `fetch()` call will either return a Response or throw an error
//             const response = await fetch(data);
//             if (!response.ok) {
//                 throw new Error(`HTTP error: ${response.status}`);
//             }
            
//             // after this line, our function will wait for the `response.json()` call to be settled
//             // the `response.json()` call will either return the JSON object or throw an error
//             const recipes = await response.json();
//             recipes.forEach(recipe => {
//                         recipeData.innerHTML += `
//                         <article class="recipeCard">
//                                 <div class="recipePic"></div>
//                                 <div class="recipeInfo">
//                                     <div class="recipeTitle">
//                                         <h2>${recipe.name}</h2>
//                                         <div class="recipeTime">
//                                             <i class="far fa-clock"></i>
//                                             <p>${recipe.time} min</p>
//                                         </div>
//                                     </div>
//                                     <div class="recipeDetails">
//                                         <div class="ingredients">
//                                         <p>${recipe.ingredient}:${recipe.quantity} ${recipe.unit}</p>
//                                         </div>
//                                         <div class="description">
//                                             <p class="productDescription">${recipe.description}</p>
//                                         </div>
//                                     </div>
//                                 </div>
//                         </article>
//                         `
//             });
//         }
//         catch(error) {
//           console.error(`Could not get recipes: ${error}`);
//         }
        
//       })();
const isObject = function(val) {
    if (val === null) {
        return false;
    }
    return (typeof val === 'object');
};

const objProps = function(obj) {
    for (let val in obj) {
        if (isObject(obj[val])) {
            objProps(obj[val]);
        } else {
            console.log(val,obj[val]);
        }
    };
};