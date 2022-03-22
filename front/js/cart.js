import { fetchProducts, getCart, store } from "./utilities.js";

let cart = getCart();

// console.table(cart);

let totalQuantity = 0;
let totalPrice = 0;

let totalQuantityHTML = document.getElementById("totalQuantity");
let totalPriceHTML = document.getElementById("totalPrice");

if (cart) {
  for (const product of Object.entries(cart)) {
    for (const element of Object.values(product[1])) {
      totalQuantity += element.quantity;

      await fetchProducts(product[0]).then(async (data) => {
        totalPrice += data.price * element.quantity;
        // console.log(data.price, element.quantity, data.price * element.quantity);
        console.log("total price : ", totalPrice);

        let productProperties = {
          id: data._id,
          name: data.name,
          img: data.imageUrl,
          alt: data.altTxt,
          price: data.price,
          description: data.description,
        };

        let cartItems = document.getElementById("cart__items");

        let product = {
          article: document.createElement("article"),
          divImage: document.createElement("div"),
          image: document.createElement("img"),
          content: document.createElement("div"),
          contentDescription: document.createElement("div"),
          title: document.createElement("h2"),
          color: document.createElement("p"),
          price: document.createElement("p"),
          contentSettings: document.createElement("div"),
          settingsQuantity: document.createElement("div"),
          quantity: document.createElement("p"),
          quantityInput: document.createElement("input"),
          settingsDelete: document.createElement("div"),
          delete: document.createElement("p"),
        };

        // console.log(productProperties);

        product.article.className = "cart__item";
        product.article.dataset.id = productProperties.id;
        cartItems.appendChild(product.article);

        product.divImage.className = "cart__item__img";
        product.article.appendChild(product.divImage);

        product.image.src = productProperties.img;
        product.image.alt = productProperties.alt;
        product.divImage.appendChild(product.image);

        product.content.className = "cart__item__content";
        product.article.appendChild(product.content);

        product.contentDescription.className = "cart__item__content__description";
        product.content.appendChild(product.contentDescription);

        product.title.textContent = productProperties.name;
        product.contentDescription.appendChild(product.title);

        product.color.textContent = element.color;
        product.contentDescription.appendChild(product.color);

        product.price.textContent = `${productProperties.price} €`;
        product.contentDescription.appendChild(product.price);

        product.contentSettings.className = "cart__item__content__settings";
        product.content.appendChild(product.contentSettings);

        product.settingsQuantity.className = "cart__item__content__settings__quantity";
        product.contentSettings.appendChild(product.settingsQuantity);

        product.quantity.textContent = "Qté :";
        product.settingsQuantity.appendChild(product.quantity);

        product.quantityInput.type = "number";
        product.quantityInput.className = "itemQuantity";
        product.quantityInput.name = "itemQuantity";
        product.quantityInput.min = "1";
        product.quantityInput.max = "100";
        product.quantityInput.value = element.quantity;
        product.settingsQuantity.appendChild(product.quantityInput);

        product.settingsDelete.className = "cart__item__content__settings__delete";
        product.contentSettings.appendChild(product.settingsDelete);

        product.delete.className = "deleteItem";
        product.delete.textContent = "Supprimer";
        product.settingsDelete.appendChild(product.delete);
      });
    }

    totalQuantityHTML.textContent = totalQuantity;
    totalPriceHTML.textContent = Intl.NumberFormat("fr-FR").format(totalPrice);
  }
}
