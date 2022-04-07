const BASE_URL = "http://localhost:3000/api/";

/**
 *
 * @param {string} key Le nom du panier que nous voulons récupérer
 * @returns {item , functions} item retourne le localstorage "panier" , et les functions permettent d'ajouter un produit au panier / ou de supprimer totalement le panier
 * @description Fonction qui permet de récupérer le panier dans le localstorage
 * 
 */

export function store(key) {
  let item = JSON.parse(localStorage.getItem(key)) || {};

  let setItem = (value) => localStorage.setItem(key, JSON.stringify(value)); // function d'ajout de produits au panier.
  let clearStorage = () => localStorage.clear(); // function de suppression du panier.
  return [item, { setItem, clearStorage }]; // retourne le localstorage "panier" , et les functions permettent d'ajouter un produit au panier / ou de supprimer totalement le panier
}

export let getCart = () => store("panier")[0]; // retourne le localstorage "panier"

export let clearCart = () => store("panier")[1].clearStorage(); // supprime le localstorage "panier"

/**
 *
 * @param {string} id l'id du produit demandé ou rien si tout les produits sont demandés
 * @returns {Promise} une promesse qui retourne un objet contenant les données du produit ou de tout les produits
 * @description Fonction qui permet de récupérer les données de l'api.
 * 
 */

export async function fetchProducts(id) {
  let result = await fetch(BASE_URL + `products/${id || ""}`);
  let products = await result.json();
  return products;
}

/**
 * 
 * @param {object} order l'objet contenant les données de la commande
 * @returns {string} l'id de la commande
 * @description Envoie une requête post au serveur pour enregistrer la commande et vide le panier et récupère l'id de la commande.
 */

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
