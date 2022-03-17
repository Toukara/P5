async function fetchArticles() {
  const resAPI = await fetch("http://localhost:3000/api/products");
  return await resAPI.json();
}

async function displayArticles() {
  await fetchArticles()
    .then((resultAPI) => {
      const articles = resultAPI;

      for (const article of articles) {
        let productAnchor = document.createElement("a");
        let productArticle = document.createElement("article");
        let productImg = document.createElement("img");
        let productName = document.createElement("h3");
        let productDescription = document.createElement("p");

        document.querySelector(".items").appendChild(productAnchor);
        productAnchor.appendChild(productArticle);
        productArticle.appendChild(productImg);
        productArticle.appendChild(productName);
        productArticle.appendChild(productDescription);

        productAnchor.href = `product.html?id=${article._id}`;

        productImg.src = article.imageUrl;
        productImg.alt = article.altTxt;

        productName.className = "productName";
        productName.textContent = article.name;

        productDescription.className = "productName";
        productDescription.textContent = article.description;
      }
    })
    .catch(function (error) {
      return error;
    });
}

displayArticles();
