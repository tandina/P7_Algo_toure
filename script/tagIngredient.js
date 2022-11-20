// const data='/data/recipes.json';
// puts content in given balise

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
          console.log(recipes);
          const ingredientSet = new Set;
          ingredientSet.add(recipes);
          
          console.log(ingredientSet);
         

          // ingredientSet.forEach(value => {
          //   console.log(value);
          //   ingredientsTags.innerHTML += `
          //               <p><span ${value.id}></span>${value.ingredient}</p>
          //               `
          // });

          

      }
      catch(error) {
        console.error(`Could not get recipes: ${error}`);
      }
      
    })();
