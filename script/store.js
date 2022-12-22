// wil store tags selected by user

let store = [
  [], // ingredient
  [], // device
  [], // utensils
];

// for re render notification
let notify = [false, false, false];

let IngredientTags = [];
let DeviceTags = [];
let UtensilsTags = [];

export const getNotify = (where) => {
  switch (where) {
    case "INGREDIENT":
      return notify[0];
    case "DEVICE":
      return notify[1];
    case "UTENSILS":
      return notify[2];
    default:
      return;
  }
};

export const setNotify = (where, what) => {
  switch (where) {
    case "INGREDIENT":
      notify[0] = what;
      return;
    case "DEVICE":
      notify[1] = what;
      return;
    case "UTENSILS":
      notify[2] = what;
      return;
    default:
      return;
  }
};

export const setStore = (where, what) => {
  switch (where) {
    case "INGREDIENT":
      store[0] = [...store[0], what];
      break;
    case "DEVICE":
      store[1] = [...store[1], what];
      break;
    case "UTENSILS":
      store[2] = [...store[2], what];
      break;
    default:
      return;
  }
};

export const getStore = (where) => {
  switch (where) {
    case "INGREDIENT":
      return store[0];
    case "DEVICE":
      return store[1];
    case "UTENSILS":
      return store[2];
    default:
      return;
  }
};

export const addTag = (where, tag) => {
  switch (where) {
    case "INGREDIENT":
      IngredientTags = [...IngredientTags, tag];
      break;
    case "DEVICE":
      DeviceTags = [...DeviceTags, tag];
      break;
    case "UTENSILS":
      UtensilsTags = [...UtensilsTags, tag];
      break;
    default:
      return;
  }
};

export const removeTag = (where, index) => {
  let src;
  let newArr = [];
  switch (where) {
    case "INGREDIENT":
      src = IngredientTags;
      break;
    case "DEVICE":
      src = DeviceTags;
      break;
    case "UTENSILS":
      src = UtensilsTags;
      break;
    default:
      return;
  }
  for (let i = 0;i < src.length;i++) {
    if (i != index)
      newArr.push(src[i]);
  }
  if (where == "INGREDIENT")
    IngredientTags = newArr;
  else if (where == "DEVICE")
    DeviceTags = newArr;
  else
    UtensilsTags = newArr;
};

export const getTag = (where) => {
  switch (where) {
    case "INGREDIENT":
      return IngredientTags;
    case "DEVICE":
      return DeviceTags;
    case "UTENSILS":
      return UtensilsTags;
    default:
      throw `${where} tag does not exist`;
  }
};

// used to remove a tag then re render elements concerned
const reRender = (value, color) => {
  const findWhere = [
    "blue",
    "INGREDIENT",
    "green",
    "DEVICE",
    "red",
    "UTENSILS",
  ];
  const where = findWhere.indexOf(color) + 1;
  const index = getTag(findWhere[where]).indexOf(value);
  removeTag(findWhere[where], index);

  searchBarTags();
  setNotify(findWhere[where], true);
};

const searchBarTags = () => {
  const container = document.querySelector(".tags-container");
  container.innerHTML = "";

  const renderOneTag = (color, value, index) => {
    const button = document.createElement("div");
    const close = document.createElement("div");

    close.classList.add("tag-closeBtn");
    button.classList.add(`${color}Tag`);
    close.innerHTML += `<img src=images/close.svg alt="close-button">`;
    button.innerHTML += `<div class="tag-description"><p>${value}</p></div>`;
    button.appendChild(close);
    close.addEventListener("click", () => reRender(value, color));
    container.appendChild(button);
  };

  let i = 0;
  let y = 0;
  let color;
  let where = [""];
  while (i < 3) {
    // pick label color
    switch (i++) {
      case 0:
        color = "blue";
        where = IngredientTags;
        break;
      case 1:
        color = "green";
        where = DeviceTags;
        break;
      case 2:
        color = "red";
        where = UtensilsTags;
        break;
      default:
        return;
    }
    //no tags present in array. we check next values
    if (!where.length) continue;

    // render tag with selected color
    for (let index = 0;index < where.length;index++) {
      renderOneTag(color, where[index], index);
    }
  }
};

export const renderTags = (query, base, tagName, onClick, regex) => {
  if (!query) return;

  query.innerHTML = "";
  const isInRegex = (check, regex) => {
    return regex.includes(check);
  };

  // remove selected tags from tags base
  let tmp = [];
  for (let i = 0; i < base.length;i++) {
    if (!isInRegex(base[i].name, regex))
      tmp.push(base[i]);
  }
  base = tmp;

  for (let index = 0; index < base.length;index++) {
    query.innerHTML += `
        <div class="tagLabel" id=${tagName}-tag-wrapper${index}>
                      <p class="tagText"><span id=${tagName}-tag${index}></span>${base[index].name}</p>
        </div>
                      `;

  }

  for (let index = 0; index < base.length;index++) {
    document
      .getElementById(`${tagName}-tag-wrapper${index}`)
      .addEventListener("click", () => {
        onClick(base[index].name);
        searchBarTags();
      });
  }
};
