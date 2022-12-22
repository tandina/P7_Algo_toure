import {
  addTag,
  removeTag,
  renderTags,
  getTag,
  setStore,
  getStore,
  getNotify,
  setNotify,
} from "./store.js";
const data = "/data/recipes.json";
// puts content in given balise

const onClick = (value) => {
  console.log(`value is ${value}`);
  addTag("UTENSILS", value);
  renderTags(
    ustensilsTags,
    getStore("UTENSILS")[0],
    "utensils",
    onClick,
    getTag("UTENSILS")
  );
};

// checks if ustensil {check} is already present
const checkDoubleUstensils = (allUstensil, check) => {
  let result = false;
for (let i = 0;i < allUstensil.length;i++) {
    let ustensil = allUstensil[i];
    if (ustensil.name.toLowerCase() == check.toLowerCase()) {
      result = true;
      break ;
    }
  }
  return result;
};

const extractUstensil = (ustensilSet) => {
  let allUstensil = [];
  let currentId = 0;

  ustensilSet.forEach((set) => {
    set.forEach((_set) => {
      currentId = _set.id;
      _set.ustensils.forEach((ustensils) => {
        if (checkDoubleUstensils(allUstensil, ustensils) == false) {
          allUstensil.push({ id: currentId, name: ustensils });
        }
      });
    });
  });
  return allUstensil;
};

const ustensilsTags = document.querySelector("#UstensilCard");
(async function fetchUstensils() {
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
    const ustensilSet = new Set();
    ustensilSet.add(recipes);
    const ustensils = extractUstensil(ustensilSet);
    setStore("UTENSILS", ustensils);

    // console.log(ustensilSet);
    // console.log("here");
    // console.log(ustensils);

    renderTags(
      ustensilsTags,
      getStore("UTENSILS")[0],
      "utensils",
      onClick,
      getTag("UTENSILS")
    );
    setInterval(() => {
      if (!getNotify("UTENSILS")) return;
      renderTags(
        ustensilsTags,
        getStore("UTENSILS")[0],
        "utensils",
        onClick,
        getTag("UTENSILS")
      );
      setNotify("UTENSILS", false);
    }, 100);
  } catch (error) {
    console.error(`Could not get recipes: ${error}`);
  }
})();
