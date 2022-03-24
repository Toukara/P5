import { fetchProducts, getCart, store } from "./utilities.js";

let [cart, { setItem }] = store("panier");
let totalQuantity = 0;
let totalPrice = 0;

let totalQuantityHTML = document.getElementById("totalQuantity");
totalQuantityHTML.textContent = totalQuantity;
let totalPriceHTML = document.getElementById("totalPrice");
totalPriceHTML.textContent = totalPrice;
let cartItems = document.getElementById("cart__items");

console.log();

function editItem(id, oldQty, newQty, color, price) {
  // console.log(newQty, oldQty);
  if (oldQty == newQty) {
    return;
  } else {
    let colorIndex = cart[id].findIndex((item) => item.color === color);
    // console.log(cart[id][colorIndex].quantity);
    cart[id][colorIndex].quantity = newQty;
    // console.log(cart[id][colorIndex].quantity);
  }
  console.log(Math.abs(oldQty - newQty));
  newQty > oldQty
    ? getTotalQuantity(totalQuantity + newQty) && getTotalPrice(totalPrice + price * newQty)
    : getTotalQuantity(totalQuantity - newQty) && getTotalPrice(totalPrice - price * newQty);

  setItem(cart);
}

async function deleteItem(id, color, quantity, price) {
  let productArticle = document.querySelector(`[data-id="${id}"]` && `[data-color="${color}"]`);
  while (productArticle.firstChild) {
    productArticle.removeChild(productArticle.lastChild);
  }
  productArticle.remove();

  if (cart[id].length >= 2) {
    let productIndex = cart[id].findIndex((x) => x.color === color);
    cart[id].splice(productIndex, 1);
    console.log("Couleur retiré");
  } else {
    delete cart[id];
    console.log("Produit retiré");
  }
  await getTotalQuantity(totalQuantity - quantity);
  await getTotalPrice(totalPrice - price * quantity);
  setItem(cart);
}

function getTotalQuantity(qty) {
  totalQuantity = parseInt(qty);
  return (totalQuantityHTML.textContent = totalQuantity);
}

function getTotalPrice(price = 0) {
  totalPrice = price;
  return (totalPriceHTML.textContent = Intl.NumberFormat("fr-FR").format(totalPrice));
}

async function displayCart() {
  for (const product of Object.entries(cart)) {
    for (const element of Object.values(product[1])) {
      getTotalQuantity((totalQuantity += element.quantity));

      await fetchProducts(product[0]).then(async (data) => {
        getTotalPrice((totalPrice += data.price * element.quantity));
        let productProperties = {
          id: data._id,
          name: data.name,
          img: data.imageUrl,
          alt: data.altTxt,
          price: data.price,
          description: data.description,
          color: element.color,
          quantity: element.quantity,
        };

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

        product.article.className = "cart__item";
        product.article.dataset.id = productProperties.id;
        product.article.dataset.color = productProperties.color;
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

        product.color.textContent = productProperties.color;
        product.contentDescription.appendChild(product.color);

        product.price.textContent = `${Intl.NumberFormat("fr-FR").format(productProperties.price)} €`;
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
        product.quantityInput.value = productProperties.quantity;
        product.settingsQuantity.appendChild(product.quantityInput);
        product.settingsQuantity.addEventListener("change", (event) => {
          event.preventDefault();

          editItem(
            productProperties.id,
            parseInt(productProperties.quantity),
            parseInt(product.quantityInput.value),
            productProperties.color,
            productProperties.price
          );
        });

        product.settingsDelete.className = "cart__item__content__settings__delete";
        product.contentSettings.appendChild(product.settingsDelete);

        product.delete.className = "deleteItem";
        product.delete.textContent = "Supprimer";
        product.settingsDelete.appendChild(product.delete);
        product.settingsDelete.addEventListener("click", (event) => {
          event.preventDefault();
          deleteItem(
            productProperties.id,
            productProperties.color,
            productProperties.quantity,
            productProperties.price
          );
        });
      });
    }
  }
}

if (cart) {
  displayCart();
}
