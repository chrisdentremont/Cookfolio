import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";
import {addRecipeToDb, delRecipeFromDb} from "./firebase";

/**
 * A dictionary containing recipe data to be referenced when displaying
 * and interacting with recipe cards.
 * 
 * Key contains the recipe ID and the value contains the recipe fields.
 */
let storedRecipes = {};

/**
 * When the page is fully loaded, get the recipe form from the DOM and add 
 * the submit listener.
 */
window.onload = () => {
    const recipeForm = document.getElementById("recipeForm");
    recipeForm.addEventListener("submit", addRecipe);
};

/**
 * Takes in an Object containing recipe information and creates cards to display the information.
 * 
 * A card contains the title and two buttons: a view and delete button.
 * A modal is opened when the view button is clicked and displays recipe information.
 * 
 * @param {*} recipes The Object containing information about every recipe
 */
function displayRecipes(recipes){
    const cardDiv = document.getElementById("recipe-cards");
    //Clear existing cards to display new ones
    while(cardDiv.firstChild){
        cardDiv.removeChild(cardDiv.firstChild);
    }

    //Get Object containing recipe information
    let recipeInfo = recipes["recipes"];
    for(var recipe in recipeInfo){
        //Add recipe information to public Object so that other functions can use it.
        storedRecipes[recipe] = recipeInfo[recipe]; 

        //Create a new card
        let newCard = document.createElement("div");
        newCard.classList.add("paper", "card-" + recipe);

        //Create a new card body to house recipe title & buttons
        let cardBody = document.createElement("div");
        cardBody.classList.add("d-inline-flex", "flex-column");

        //Create card title
        let cardTitle = document.createElement("h5");
        cardTitle.textContent = recipeInfo[recipe]["name"];

        //Create div to house control buttons
        let cardButtons = document.createElement("div");
        cardButtons.classList.add("d-flex", "flex-row", "mt-auto");

        //Create the view button that opens a modal when clicked
        //Modal contains every piece of information about recipe
        let cardViewButton = document.createElement("a");
        cardViewButton.classList.add("btn", "btn-success", "p-2");
        cardViewButton.setAttribute("id", "viewCard-" + recipe)
        cardViewButton.addEventListener("click", function(){viewRecipe(this.id)});
        cardViewButton.textContent = "Open Recipe";

        //Create the delete button that deletes the linked recipe from the Firebase database
        let cardDelButton = document.createElement("a");
        cardDelButton.classList.add("btn", "btn-danger", "p-2", "card-" + recipe);
        cardDelButton.textContent = "Delete";
        cardDelButton.addEventListener("click", deleteRecipe);

        //Add buttons to button div
        cardButtons.appendChild(cardViewButton);
        cardButtons.appendChild(cardDelButton);

        //Add elements to card body div and add the card body div to the overall card div
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardButtons);
        newCard.appendChild(cardBody);

        cardDiv.appendChild(newCard); //Add new card div to main div where all cards are housed
    }
}

/**
 * Collects information from the recipe creation form and sends it to a function
 * in the Firebase script to be added to the user database.
 * 
 * @param {*} event The form submit event - contains entered recipe information
 */
function addRecipe(event){
    event.preventDefault(); //Prevent page from reloading
    let formData = event.target.elements;

    //Create new object containing recipe information
    var newRecipe = {
        name: formData[0].value,
        type: formData[1].value,
        time: formData[2].value,
        notes: formData[3].value
    };

    //Send new recipe object to function in Firebase script
    addRecipeToDb(newRecipe);

    document.getElementById("recipeFormClose").click(); //Close the recipe creation modal - click() simulates this
    event.target.reset(); //Reset recipe creation form
}

/**
 * Retrieves ID from the clicked delete button in order to identify recipe being deleted,
 * and calls a function from Firebase script to delete the recipe object from
 * user database.
 * 
 * @param {*} event Event that contains information about the button that was clicked
 */
function deleteRecipe(event){
    var cardID = event.target.classList[3].substring(5);
    delRecipeFromDb(cardID);
}

/**
 * Collects information about a recipe to view and opens a modal 
 * containing information about the recipe.
 * 
 * @param {*} cardID ID of the recipe to collect information about
 */
function viewRecipe(cardID){
    let IDnumber = cardID.substring(9); //Get recipe ID

    //Get view modal elements from DOM to set appropriate values
    let viewRecipeModal = new bootstrap.Modal(document.getElementById('viewRecipeModal'));
    let viewRecipeName = document.getElementById("viewRecipeName");
    let viewRecipeNotes = document.getElementById("viewRecipeNotes");
    let viewRecipeTime = document.getElementById("viewRecipeTime");
    let viewRecipeType = document.getElementById("viewRecipeType");

    viewRecipeName.textContent = storedRecipes[IDnumber]["name"];
    viewRecipeNotes.textContent = storedRecipes[IDnumber]["notes"];

    //If time was not entered, set default value of '--'
    if(storedRecipes[IDnumber]["time"] != ""){
        viewRecipeTime.textContent = "   " + storedRecipes[IDnumber]["time"] + " minutes";
    }else{
        viewRecipeTime.textContent = "   -- minutes";
    }
    
    viewRecipeType.textContent = "   " + storedRecipes[IDnumber]["type"];

    //Show view modal
    viewRecipeModal.show();
}


export {addRecipe, displayRecipes};