const BASE_URL = "http://localhost:3000/api/";

/**
 *
 * @param {string} key Le nom du panier que nous voulons récupérer
 * @returns {item , functions} item retourne le localstorage "panier" , et les functions permettent d'ajouter un produit au panier
 */
export function store(key) {
  let item = JSON.parse(localStorage.getItem(key)) || {};

  let setItem = (value) => localStorage.setItem(key, JSON.stringify(value)); // function d'ajout de produits au panier.
  return [item, { setItem }];
}

export let getCart = () => store("panier")[0];
// console.log(getCart())

export let clearCart = () => store("panier")[1].clearStorage();

export async function fetchProducts(id) {
  let result = await fetch(BASE_URL + `products/${id || ""}`);
  let products = await result.json();
  return products;
}
