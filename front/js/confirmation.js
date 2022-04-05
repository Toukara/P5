import { clearCart } from "./utilities.js";

window.onload = function () {
  //get orderID in url
  var url = new URL(window.location.href); //get l'url du site.
  var orderID = url.searchParams.get("id");
  
  if(!orderID) {
    window.location.href = "cart.html";
  }
  clearCart();
  document.getElementById('orderId').textContent = orderID;
};
