import { fetchProducts } from "./utilities.js";

fetchProducts()
  .then(async (data) => {
    for (const article of data) {
      let product = {
        anchor: document.createElement("a"),
        article: document.createElement("article"),
        image: document.createElement("img"),
        name: document.createElement("h3"),
        description: document.createElement("p"),
      };

      document.querySelector(".items").appendChild(product.anchor);
      product.anchor.href = `product.html?id=${article._id}`;

      product.anchor.appendChild(product.article);

      product.article.appendChild(product.image);
      product.image.src = article.imageUrl;
      product.image.alt = article.altTxt;

      product.article.appendChild(product.name);
      product.name.className = "product.name";
      product.name.textContent = article.name;

      product.article.appendChild(product.description);
      product.description.className = "product.name";
      product.description.textContent = article.description;
    }
  })
  .catch(function (error) {
    return error;
  });
