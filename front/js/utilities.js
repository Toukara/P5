const BASE_URL = "http://localhost:3000/api/";

/**
 *
 * @param {string} key Le nom du panier que nous voulons récupérer
 * @returns {item , functions} item retourne le localstorage "panier" , et les functions permettent d'ajouter un produit au panier / ou de supprimer totalement le panier
 */
export function store(key) {
  let item = JSON.parse(localStorage.getItem(key)) || {};

  let setItem = (value) => localStorage.setItem(key, JSON.stringify(value)); // function d'ajout de produits au panier.
  let clearStorage = () => localStorage.clear(); // function de suppression du panier.
  return [item, { setItem  , clearStorage}];
}

export let getCart = () => store("panier")[0];
// console.log(getCart())

export let clearCart = () => store("panier")[1].clearStorage();

export async function fetchProducts(id) {
  let result = await fetch(BASE_URL + `products/${id || ""}`);
  let products = await result.json();
  return products;
}

export async function postOrder(body) {
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  fetch("http://localhost:3000/api/products/order", options)
    .then((res) => res.json())
    .then((data) => (window.location.href = `confirmation.html?id=${data.orderId}`));
}
