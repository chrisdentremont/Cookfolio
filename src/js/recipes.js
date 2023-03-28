import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";
import {addRecipeToDb, delRecipeFromDb} from "./firebase";

let storedRecipes = {};

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
        storedRecipes[recipe] = recipeInfo[recipe];

        //Card
        let newCard = document.createElement("div");
        newCard.classList.add("card", "card-" + recipe);

        //Card Body
        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = recipeInfo[recipe]["name"];

        let cardAddButton = document.createElement("a");
        cardAddButton.classList.add("btn", "btn-success");
        cardAddButton.setAttribute("id", "viewCard-" + recipe)
        cardAddButton.addEventListener("click", function(){viewRecipe(this.id)});
        cardAddButton.textContent = "Open Recipe";

        let cardDelButton = document.createElement("a");
        cardDelButton.classList.add("btn", "btn-danger", "card-" + recipe);
        cardDelButton.textContent = "Delete";
        cardDelButton.addEventListener("click", deleteRecipe);

        cardBody.appendChild(cardTitle);
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

function viewRecipe(cardID){
    let IDnumber = cardID.substring(9);
    let viewRecipeModal = new bootstrap.Modal(document.getElementById('viewRecipeModal'));
    let viewRecipeName = document.getElementById("viewRecipeName");
    let viewRecipeNotes = document.getElementById("viewRecipeNotes");
    let viewRecipeTime = document.getElementById("viewRecipeTime");
    let viewRecipeType = document.getElementById("viewRecipeType");

    viewRecipeName.textContent = storedRecipes[IDnumber]["name"];
    viewRecipeNotes.textContent = storedRecipes[IDnumber]["notes"];
    viewRecipeTime.textContent = "   " + storedRecipes[IDnumber]["time"] + " minutes";
    viewRecipeType.textContent = "   " + storedRecipes[IDnumber]["type"];

    viewRecipeModal.show();
}


export {addRecipe, displayRecipes};