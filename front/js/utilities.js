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

export async function fetchProducts(id) {
  let result = await fetch(BASE_URL + `products/${id || ""}`);
  let products = await result.json();
  return products;
}