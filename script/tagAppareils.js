import {
  addTag,
  removeTag,
  renderTags,
  getTag,
  setStore,
  getStore,
  getNotify,
  setNotify,
  pendingTagRender,
  filterView,
  getView,
} from "./store.js";
const data = "/data/recipes.json";

const onClick = (value) => {
  addTag("DEVICE", value);
  pendingTagRender.setNotify("DEVICE", true);
};

window.setInterval(() => {
  if (
    !pendingTagRender.getNotify("DEVICE") //||
  )
    return;
  renderTags(
    appliancesTags,
    getStore("DEVICE")[0],
    "device",
    onClick,
    filterView(getView(), "DEVICE")
  );
  pendingTagRender.setNotify("DEVICE", false);
}, 2);

// checks if ingredient {check} is already present
const checkDoubleAppliance = (allAppliance, check) => {
  let result = false;

  for (let i = 0; i < allAppliance.length; i++) {
    let appliance = allAppliance[i];
    if (appliance.name.toLowerCase() == check.toLowerCase()) {
      result = true;
      break;
    }
  }
  return result;
};

const extractAppliance = (applianceSet) => {
  let allAppliance = [];
  let currentId = 0;
  applianceSet.forEach((set) => {
    set.forEach((_set) => {
      currentId = _set.id;
      if (checkDoubleAppliance(allAppliance, _set.appliance) == false) {
        allAppliance.push({ id: currentId, name: _set.appliance });
      }
    });
  });
  return allAppliance;
};

const appliancesTags = document.querySelector("#AppareilsCard");
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
    const applianceSet = new Set();
    applianceSet.add(recipes);
    const appliancesUn = extractAppliance(applianceSet);
    setStore("DEVICE", appliancesUn);

    renderTags(
      appliancesTags,
      getStore("DEVICE")[0],
      "device",
      onClick,
      getTag("DEVICE")
    );
  } catch (error) {
    console.error(`Could not get recipes: ${error}`);
  }
})();
