// // const data='/data/recipes.json';
   

// checks if ingredient {check} is already present
const checkDoubleAppliance = (allAppliance, check) => {
  let result = false;
  allAppliance.forEach(appliance => {
      if (appliance.name.toLowerCase() == check.toLowerCase()) {
          result = true;
          return ;
      }
  });
  return result;
}

const	extractAppliance = (applianceSet) => {
  let allAppliance = [];
  let currentId = 0;
  console.log(allAppliance);
  applianceSet.forEach(set => {
      set.forEach(_set => {
        currentId = _set.id;
        if (checkDoubleAppliance(allAppliance, _set.appliance) == false) {
          allAppliance.push({id: currentId, name: _set.appliance});
          
      }});
  });
  return (allAppliance);
  
}

const appliancesTags = document.querySelector('#AppareilsCard');
(async function fetchAppliances() {
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
        // console.log(recipes);
        const applianceSet = new Set;
        applianceSet.add(recipes);
        const appliancesUn = extractAppliance(applianceSet);
        
        console.log(applianceSet);
        console.log("here");
        console.log(appliancesUn);

        appliancesUn.forEach(value => {
          appliancesTags.innerHTML += `
                      <p><span ${value.id}></span>${value.name}</p>
                      `
        });

        

    }
    catch(error) {
      console.error(`Could not get recipes: ${error}`);
    }
    
  })();

