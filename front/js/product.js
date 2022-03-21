// UTILITIES

const BASE_URL = "http://localhost:3000/api/";


/**
 * 
 * @param {string} key Le nom du panier 
 * @returns {item , functions} item retourne le localstorage "panier" , et les functions permettent d'ajouter et de supprimer un produit du panier
 */
function store(key) {
  let item = JSON.parse(localStorage.getItem(key)) || {};

  let setItem = (value) => localStorage.setItem(key, JSON.stringify(value)); // function d'ajout de produits au panier.
  let removeItem = (key) => localStorage.removeItem(key); // function de supprimer d'un produit au panier.
  let clearStorage = () => localStorage.clear(); //function de clear du panier.

  return [item, { setItem, removeItem, clearStorage }];
}

let getCart = () => store("panier")[0];
let clearCart = () => store("panier")[1].clearStorage();

async function fetchProducts(id) {
  let result = await fetch(BASE_URL + `products/${id || ""}`);
  let products = await result.json();
  return products;
}

// CODE FOR THE PAGE

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

    if (quantity < 1|| !color) {
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
    console.log(cart);
  });
});

// function addToCart() {
//   return (article) => {
//     let cart = JSON.parse(localStorage.getItem("panier")) || {};

//     const product = {
//       color: document.getElementById("colors").value,
//       quantity: parseInt(document.getElementById("quantity").value),
//     };

//     if (!product.quantity || !product.color) {
//       return alert("Veuillez vérifier la quantité et/ou la couleur sélectionnée");
//     }

//     try {
//       let colorIndex = cart[article._id].findIndex((e) => e.color === product.color);

//       if (colorIndex) {
//         cart[article._id][colorIndex].quantity += product.quantity;
//       } else {
//         cart[article._id].push({ color: product.color, quantity: product.quantity });
//       }
//     } catch {
//       if (cart[article._id]) {
//         cart[article._id].push({ color: product.color, quantity: product.quantity });
//       } else {
//         cart[article._id] = [{ color: product.color, quantity: product.quantity }];
//       }
//     } finally {
//       localStorage.setItem("panier", JSON.stringify(cart));
//       console.log("panier updated");
//     }
//   };
// }

// function getArticle() {
//   fetch(`http://localhost:3000/api/products/${idProduct}`)
//     .then((res) => {
//       return res.json();
//     })

//     .then(async function (resultatAPI) {
//       article = await resultatAPI;
//       if (article) {
//         displayProduct(article);
//         addToCartBtn.addEventListener("click", addToCart(article));
//       }
//     });
// }

// getArticle();
