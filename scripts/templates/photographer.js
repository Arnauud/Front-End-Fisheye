/* eslint-disable no-unused-vars */
function photographerTemplate(data) {
  const { name, id, city, country, tagline, price, portrait } = data;

  const picture = `./assets/photographers/Sample_Photos/Photographers_ID_Photos/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const a = document.createElement("a");
    a.href = `photographer.html?id=${id}`;
    a.setAttribute("aria-label", `View details of ${name}`);
    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", "");
    const h2 = document.createElement("h2");
    h2.textContent = name;

    a.appendChild(img);
    a.appendChild(h2);

    article.appendChild(a);

    const h3 = document.createElement("h3");
    h3.textContent = `${city}, ${country}`;
    const div = document.createElement("div");
    div.textContent = tagline;
    const p = document.createElement("p");
    p.textContent = `${price}€/jour`;

    article.appendChild(h3);
    article.appendChild(div);
    article.appendChild(p);

    return article;
  }
  return { getUserCardDOM };
}
