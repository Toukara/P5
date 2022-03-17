var str = window.location.href;
var url = new URL(str);
var idProduct = url.searchParams.get("id");
console.log(idProduct);
let article = "";

function getArticle() {
  fetch("http://localhost:3000/api/products/" + idProduct)
    .then((res) => {
      return res.json();
    })

    .then(async function (resultatAPI) {
      article = await resultatAPI;
      console.table(article);
      if (article) {
        displayProduct(article);
      }
    })
    .catch((error) => {
      console.log("Erreur de la requête API");
    });
}

function displayProduct(article) {
  let productImage = document.createElement("img");

  document.querySelector(".item__img").appendChild(productImage);
  

  productImage.src = article.imageUrl;
  productImage.alt = article.altTxt;
}

getArticle()
displayProduct()