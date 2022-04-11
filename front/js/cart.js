import { fetchProducts, postOrder, store } from "./utilities.js";

let [cart, { setItem }] = store("panier");
let totalQuantity = 0;
let totalPrice = 0;

let totalQuantityHTML = document.getElementById("totalQuantity");
let totalPriceHTML = document.getElementById("totalPrice");
let cartItems = document.getElementById("cart__items");

async function editItem(id, oldQty, newQty, color) {
  if (oldQty == newQty) {
    return;
  } else {
    let colorIndex = cart[id].findIndex((item) => item.color === color);
    cart[id][colorIndex].quantity = newQty;
  }

  (await getTotalQuantity()) && (await getTotalPrice());
  setItem(cart);
}

async function deleteItem(id, color) {
  let productArticle = document.querySelector(`[data-id="${id}"]` && `[data-color="${color}"]`);
  while (productArticle.firstChild) {
    productArticle.removeChild(productArticle.lastChild);
  }
  productArticle.remove();

  if (cart[id].length >= 2) {
    let productIndex = cart[id].findIndex((x) => x.color === color);
    cart[id].splice(productIndex, 1);
  } else {
    delete cart[id];
  }
  (await getTotalQuantity()) && (await getTotalPrice());
  setItem(cart);
}

async function getTotalPrice() {
  totalPrice = 0;

  let products = await fetchProducts();
  for (let id in cart) {
    for (let color in cart[id]) {
      let product = products.find((x) => x._id === id);
      let productPrice = product.price;
      totalPrice += productPrice * cart[id][color].quantity;
    }
  }
  return (totalPriceHTML.innerHTML = Intl.NumberFormat("fr-FR").format(totalPrice));
}

async function getTotalQuantity() {
  totalQuantity = 0;
  for (let id in cart) {
    for (let color in cart[id]) {
      totalQuantity += cart[id][color].quantity;
    }
  }
  return (totalQuantityHTML.innerHTML = totalQuantity);
}

async function displayCart() {
  for (const product of Object.entries(cart)) {
    for (const element of Object.values(product[1])) {
      await fetchProducts(product[0]).then(async (data) => {
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
        product.settingsQuantity.addEventListener("change", () => {
          editItem(
            productProperties.id,
            parseInt(productProperties.quantity),
            parseInt(product.quantityInput.value),
            productProperties.color
          );
        });

        product.settingsDelete.className = "cart__item__content__settings__delete";
        product.contentSettings.appendChild(product.settingsDelete);

        product.delete.className = "deleteItem";
        product.delete.textContent = "Supprimer";
        product.settingsDelete.appendChild(product.delete);
        product.settingsDelete.addEventListener("click", () => {
          deleteItem(productProperties.id, productProperties.color);
        });
      });
    }
  }
  getTotalQuantity();
  getTotalPrice();
}

if (cart) {
  displayCart();

  let nameRegex = new RegExp("^[A-zÀ-ú ,.'-]{3,}$");
  let emailRegex = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );
  let adressRegex = new RegExp("^([0-9]*) ?([a-zA-Z,. ]*) ?([0-9]{5}) ?([a-zA-Z]*)");
  let cityRegex = new RegExp("^[A-zÀ-ú ,.'-]+$");

  let input = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    city: document.getElementById("city"),
    address: document.getElementById("address"),
    email: document.getElementById("email"),
  };

  let errorMsg = {
    firstName: document.getElementById("firstNameErrorMsg"),
    lastName: document.getElementById("lastNameErrorMsg"),
    email: document.getElementById("emailErrorMsg"),
    city: document.getElementById("cityErrorMsg"),
    address: document.getElementById("addressErrorMsg"),
  };

  input.firstName.addEventListener("input", (event) => {
    event.preventDefault();

    if (nameRegex.test(input.firstName.value)) {
      errorMsg.firstName.textContent = "";
    } else {
      errorMsg.firstName.textContent = "Veuillez entrer un prénom valide";
    }
  });

  input.lastName.addEventListener("input", (event) => {
    event.preventDefault();

    if (nameRegex.test(input.lastName.value)) {
      errorMsg.lastName.textContent = "";
    } else {
      errorMsg.lastName.textContent = "Veuillez entrer un nom valide";
    }
  });

  input.address.addEventListener("input", (event) => {
    event.preventDefault();

    if (adressRegex.test(input.address.value)) {
      errorMsg.address.textContent = "";
    } else {
      errorMsg.address.textContent = "Veuillez entrer une adresse valide";
    }
  });

  input.city.addEventListener("input", (event) => {
    event.preventDefault();

    if (cityRegex.test(input.city.value)) {
      errorMsg.city.textContent = "";
    } else {
      errorMsg.city.textContent = "Veuillez entrer une ville valide";
    }
  });

  input.email.addEventListener("input", (event) => {
    event.preventDefault();

    if (emailRegex.test(input.email.value)) {
      errorMsg.email.textContent = "";
    } else {
      errorMsg.email.textContent = "Veuillez entrer un email valide";
    }
  });

  document.getElementById("order").addEventListener("click", (event) => {
    event.preventDefault();

    let contact = {
      firstName: input.firstName.value,
      lastName: input.lastName.value,
      address: input.address.value,
      city: input.city.value,
      email: input.email.value,
    };

    if (
      contact.firstName === "" ||
      contact.lastName === "" ||
      contact.city === "" ||
      contact.address === "" ||
      contact.email === ""
    ) {
      alert("Veuillez remplir tous les champs");
    } else {
      let productArray = [];

      for (let id in cart) {
        productArray.push(id);
      }

      let data = {
        contact: contact,
        products: productArray,
      };

      postOrder(data);
    }
  });
}
