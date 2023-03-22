import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";
import {addRecipeToDb, delRecipeFromDb} from "./firebase";

window.onload = () => {
    const recipeForm = document.getElementById("recipeForm");
    recipeForm.addEventListener("submit", addRecipe);
};

function displayRecipes(recipes){
    const cardDiv = document.getElementById("recipe-cards");
    while(cardDiv.firstChild){
        cardDiv.removeChild(cardDiv.firstChild);
    }

    let recipeInfo = recipes["recipes"];
    for(var recipe in recipeInfo){
        //Card
        let newCard = document.createElement("div");
        newCard.classList.add("card", "card-" + recipe);

        //Card Body
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = recipeInfo[recipe]["name"];

        let cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = recipeInfo[recipe]["notes"];

        let cardAddButton = document.createElement("a");
        cardAddButton.classList.add("btn", "btn-success");
        cardAddButton.textContent = "Open Recipe";

        let cardDelButton = document.createElement("a");
        cardDelButton.classList.add("btn", "btn-danger", "card-" + recipe);
        cardDelButton.textContent = "Delete";
        cardDelButton.addEventListener("click", deleteRecipe);

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardAddButton);
        cardBody.appendChild(cardDelButton);
        newCard.appendChild(cardBody);

        cardDiv.appendChild(newCard);
    }
}

function addRecipe(event){
    event.preventDefault();
    let formData = event.target.elements;

    var newRecipe = {
        name: formData[0].value,
        type: formData[1].value,
        time: formData[2].value,
        notes: formData[3].value
    };

    addRecipeToDb(newRecipe);

    document.getElementById("recipeFormClose").click();
    event.target.reset();
}

function deleteRecipe(event){
    var cardID = event.target.classList[2].substring(5);
    delRecipeFromDb(cardID);
}


export {addRecipe, displayRecipes};