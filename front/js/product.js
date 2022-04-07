import { fetchProducts, store } from "./utilities.js";

var url = new URL(window.location.href); //get l'url du site.

fetchProducts(url.searchParams.get("id")).then(async (data) => {
  let article = {
    image: document.createElement("img"),
    name: document.getElementById("title"),
    price: document.getElementById("price"),
    description: document.getElementById("description"),
  };

  document.title = data.name;

  article.name.textContent = data.name;
  article.price.textContent = data.price;
  article.description.textContent = data.description;

  article.image.src = data.imageUrl;
  article.image.alt = data.altTxt;

  document.querySelector(".item__img").appendChild(article.image);

  // Ajout des couleurs.
  for (const color of data.colors) {
    let articleColor = document.createElement("option");
    articleColor.textContent = color;
    articleColor.value = color;

    document.querySelector("#colors").appendChild(articleColor);
  }

  // Ajout du bouton pour ajouter un article au panier.
  let button = document.getElementById("addToCart");
  button.addEventListener("click", () => {
    let [cart, { setItem }] = store("panier");

    let color = document.getElementById("colors").value;
    let quantity = parseInt(document.getElementById("quantity").value);

    if (quantity < 1 || !color) {
      return alert("Veuillez vérifier la quantité et/ou la couleur sélectionnée");
    }

    cart[data._id] = cart[data._id] || [];
    let colorIndex = cart[data._id]?.findIndex((item) => item.color === color);

    if (colorIndex === -1) {
      cart[data._id].push({ color, quantity });
    } else {
      cart[data._id][colorIndex].quantity += quantity;
    }

    setItem(cart);
  });
});
