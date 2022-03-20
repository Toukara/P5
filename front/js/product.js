var str = window.location.href;
var url = new URL(str);
var idProduct = url.searchParams.get("id");

let article = "";

let addToCartBtn = document.getElementById("addToCart");

//
let product = get


 fetch(`http://localhost:3000/api/products/${idProduct}`)
    .then((res) => {
      return res.json();
    })

    .then(async function (resultatAPI) {
      article = await resultatAPI;
      if (article) {
        displayProduct(article);
        addToCartBtn.addEventListener("click", addToCart(article));
      }
    });
//



function displayProduct(article) {
  let productImage = document.createElement("img");
  let productName = document.getElementById("title");
  let productPrice = document.getElementById("price");
  let productDescription = document.getElementById("description");

  document.querySelector(".item__img").appendChild(productImage);

  productImage.src = article.imageUrl;
  productImage.alt = article.altTxt;

  productName.textContent = article.name;

  productPrice.textContent = article.price;

  productDescription.textContent = article.description;

  for (const colors of article.colors) {
    let productColors = document.createElement("option");

    document.querySelector("#colors").appendChild(productColors);

    productColors.value = colors;
    productColors.textContent = colors;
  }
}

function addToCart() {
  return (article) => {
    let cart = JSON.parse(localStorage.getItem("panier")) || {};

    const product = {
      color: document.getElementById("colors").value,
      quantity: parseInt(document.getElementById("quantity").value),
    };

    if (!product.quantity || !product.color) {
      return alert("Veuillez vérifier la quantité et/ou la couleur sélectionnée");
    }

    try {
      let colorIndex = cart[article._id].findIndex((e) => e.color === product.color);

      if (colorIndex) {
        cart[article._id][colorIndex].quantity += product.quantity;
      } else {
        cart[article._id].push({ color: product.color, quantity: product.quantity });
      }
    } catch {
      if (cart[article._id]) {
        cart[article._id].push({ color: product.color, quantity: product.quantity });
      } else {
        cart[article._id] = [{ color: product.color, quantity: product.quantity }];
      }
    } finally {
      localStorage.setItem("panier", JSON.stringify(cart));
      console.log("panier updated");
    }
  };
}

function getArticle() {
  fetch(`http://localhost:3000/api/products/${idProduct}`)
    .then((res) => {
      return res.json();
    })

    .then(async function (resultatAPI) {
      article = await resultatAPI;
      if (article) {
        displayProduct(article);
        addToCartBtn.addEventListener("click", addToCart(article));
      }
    });
}

getArticle();