import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";

window.onload = () => {
    const recipeForm = document.getElementById("recipeForm");
    recipeForm.addEventListener("submit", addRecipe);
};

function addRecipe(event){
    event.preventDefault();
    let formData = event.target.elements;

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

    //Card Body
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = formData[0].value;
    let cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = formData[3].value;
    let cardButton = document.createElement("a");
    cardButton.classList.add("btn", "btn-success");
    cardButton.textContent = "Open Recipe";
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardButton);
    newCard.appendChild(cardBody);

    cardDiv.appendChild(newCard);

    document.getElementById("recipeFormClose").click();
    event.target.reset();
}



export {addRecipe};