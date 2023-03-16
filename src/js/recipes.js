import "../scss/styles.scss";
import * as bootstrap from "bootstrap";

function addRecipe(){
    const cardDiv = document.getElementById("recipe-cards");

    //Card
    let newCard = document.createElement("div");
    newCard.classList.add("card");

    //Image
    let cardImage = document.createElement("img");
    cardImage.setAttribute("src", "https://fastfood.theringer.com/img/items/3.jpg");
    cardImage.setAttribute("height", "250");
    cardImage.classList.add("card-img-top");
    newCard.appendChild(cardImage);

    let randomNum = Math.floor(Math.random() * 50);
    //Card Body
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = "Recipe " + randomNum;
    let cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = "A brief description of recipe " + randomNum;
    let cardButton = document.createElement("a");
    cardButton.classList.add("btn", "btn-success");
    cardButton.textContent = "Open Recipe";
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardButton);
    newCard.appendChild(cardBody);

    cardDiv.appendChild(newCard);
}

export {addRecipe};