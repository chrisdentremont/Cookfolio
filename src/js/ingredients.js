import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";
import {addIngredientToDb, delIngredientFromDb} from "./firebase";

/**
 * IsEditing - variable for whether the last button clicked was edit(true) or an add new button(false)
 */
let isEditing = false;
/**
 * currentlyEditing - variable of keeping track of the ingredient being edited when in editing mode
 */
let currentlyEditing = "";
/**
 * storedIngredients - variable that keeps track of all ingredient info from the DB
 */
let storedIngredients = {};

/**
 * When the window is loaded event listeners are added to buttons so that they conduct the correct function
 */
window.onload = () => {
    //Add ingredient button on add new form
    const ingredientForm = document.getElementById("ingredientForm");
    ingredientForm.addEventListener("submit", addIngredient);

    //Produce checkbox
    const produceCheckBox = document.getElementById("produceCheck");
    produceCheckBox.addEventListener("click", function(){displaySection(this.id)});

    //Dairy checkbox
    const dairyCheckBox = document.getElementById("dairyCheck");
    dairyCheckBox.addEventListener("click", function(){displaySection(this.id)});

    //Protein checkbox
    const proteinCheckBox = document.getElementById("proteinCheck");
    proteinCheckBox.addEventListener("click", function(){displaySection(this.id)});

    //Starchy foods checkbox
    const starchyCheckBox = document.getElementById("starchy_foodsCheck");
    starchyCheckBox.addEventListener("click", function(){displaySection(this.id)});

    //View all checkbox
    const seeAllCheckbox = document.getElementById("viewAllCheck");
    seeAllCheckbox.addEventListener("click", function(){displaySection(this.id)});

    //Add ingredient button on ingredient control bar
    const changeIngredientAddForm = document.getElementById("addIngredientButton");
    changeIngredientAddForm.addEventListener("click", changeToAdd);
};

/**
 * When the user adds a new ingredient, this method adds the ingredient to the firebase database
 * @param {*} event the click event
 */
function addIngredient(event){
    event.preventDefault();
    let formData = event.target.elements;

    var newIngredient = {
        name: formData[0].value,
        category: formData[1].value,
        quantity: formData[2].value
    };

    if(isEditing){
        addIngredientToDb(newIngredient, currentlyEditing);
    }else{
        addIngredientToDb(newIngredient, "");
    }
    

    document.getElementById("ingredientFormClose").click();
    event.target.reset();
}
/**
 * This method adds ingredients to the sections and creates the sections if needed
 * @param {*} ingredients list of ingredients
 */
function displayIngredients(ingredients) {
    const sections = document.querySelectorAll(".category-section");
    for(let i = 0; i < sections.length; i++){
        while(sections[i].firstChild){
            sections[i].removeChild(sections[i].firstChild);
        }
    }

    //Add back headers
    let produceHeader = document.createElement("h1");
    produceHeader.setAttribute("id", "category-title");
    produceHeader.textContent = "Produce";
    document.getElementById("produce-section").appendChild(produceHeader);
    let dairyHeader = document.createElement("h1");
    dairyHeader.setAttribute("id", "category-title");
    dairyHeader.textContent = "Dairy";
    document.getElementById("dairy-section").appendChild(dairyHeader);
    let proteinHeader = document.createElement("h1");
    proteinHeader.setAttribute("id", "category-title");
    proteinHeader.textContent = "Protein";
    document.getElementById("protein-section").appendChild(proteinHeader);
    let starchyHeader = document.createElement("h1");
    starchyHeader.setAttribute("id", "category-title");
    starchyHeader.textContent = "Starchy Foods";
    document.getElementById("starchy_foods-section").appendChild(starchyHeader);

    let ingredientInfo = ingredients["ingredients"];
    for(var ingredient in ingredientInfo){
        storedIngredients[ingredient] = ingredientInfo[ingredient];

        let categoryName = ingredientInfo[ingredient]["category"].toLowerCase();
        const category = document.getElementById(categoryName + "-section");

        let categoryList = document.getElementById(categoryName + "-list");
        
        let categoryListItem = document.createElement("li");
        categoryListItem.classList.add("list-group-item", "d-flex","align-items-center");
        categoryListItem.setAttribute("id", ingredient);

        //If the category doesn't exist yet it gets created and the ingredient gets added to the appropriate section
        if(categoryList == null){
            category.removeAttribute("hidden");

            const categoryCheckbox = document.getElementById(categoryName+"Check");
            const seeAllCheckbox = document.getElementById("viewAllCheck");
            categoryCheckbox.removeAttribute("disabled");
            seeAllCheckbox.removeAttribute("disabled");
            categoryCheckbox.checked = true;

            categoryList = document.createElement("ul");
            categoryList.classList.add("list-group");
            categoryList.setAttribute("id", categoryName + "-list");
        }

        categoryListItem.textContent = ingredientInfo[ingredient]["name"].charAt(0).toUpperCase() + ingredientInfo[ingredient]["name"].slice(1).toLowerCase();
        
        //Quantity badge
        let quantityBadge = document.createElement("span");
        quantityBadge.classList.add("badge", "bg-primary", "rounded-pill");
        quantityBadge.textContent = ingredientInfo[ingredient]["quantity"];
    
        categoryListItem.appendChild(quantityBadge);

        //Div to move buttons to right side
        let tempDiv = document.createElement("div");
            tempDiv.classList.add("temp-div");

        //Edit Button Creation
        let editButton = document.createElement("button");
        editButton.setAttribute("type","button");
        editButton.classList.add("btn","btn-success");
        editButton.setAttribute("data-bs-toggle","modal");
        editButton.setAttribute("data-bs-target","#ingredientModal");
        editButton.setAttribute("id","editIngredientButton");

        let editIcon = document.createElement("i");
        editIcon.classList.add("bi", "bi-pencil-fill");
        editIcon.setAttribute("height", "15");
        editIcon.setAttribute("width", "15");
        editButton.appendChild(editIcon);

        editButton.addEventListener("click", function(){changeToEdit(this.parentElement.parentElement.id)});

        tempDiv.appendChild(editButton);

        //Delete Button Creation
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");

        let deleteIcon = document.createElement("i");
        deleteIcon.classList.add("bi", "bi-trash-fill");
        deleteIcon.setAttribute("height", "15");
        deleteIcon.setAttribute("width", "15");
        deleteButton.appendChild(deleteIcon);

        deleteButton.addEventListener("click", deleteIngredient);
        
        tempDiv.appendChild(deleteButton);

        //Add Items to category and list
        categoryListItem.appendChild(tempDiv);

        categoryList.appendChild(categoryListItem);
        
        category.appendChild(categoryList);
    }
}

/**
 * This method is used with the filter checkboxes, if the box was checked it reveals the section, if it is unchecked it hides the section
 * @param {*} checkboxID ID of the checkbox that was selected
 */
function displaySection(checkboxID) {
    const currentCheckBox = document.getElementById(checkboxID);
    
    let tempString = checkboxID.substring(0,checkboxID.indexOf("C"));
    console.log(tempString);
    const section = document.getElementById(tempString + "-section");

    if(checkboxID == "viewAllCheck"){
        //Shows all sections
        if(currentCheckBox.checked){
            document.getElementById("produce-section").removeAttribute("hidden");
            document.getElementById("produceCheck").checked = true;
            document.getElementById("dairy-section").removeAttribute("hidden");
            document.getElementById("dairyCheck").checked = true;
            document.getElementById("protein-section").removeAttribute("hidden");
            document.getElementById("proteinCheck").checked = true;
            document.getElementById("starchy_foods-section").removeAttribute("hidden");
            document.getElementById("starchy_foodsCheck").checked = true;
        }
        else{ //Hides all sections
            document.getElementById("produce-section").hidden = true;
            document.getElementById("produceCheck").checked = false;
            document.getElementById("dairy-section").hidden = true;
            document.getElementById("dairyCheck").checked = false;
            document.getElementById("protein-section").hidden = true;
            document.getElementById("proteinCheck").checked = false;
            document.getElementById("starchy_foods-section").hidden = true;
            document.getElementById("starchy_foodsCheck").checked = false;
        }
    }
    else{
        //Displays selected section
        if(currentCheckBox.checked){
            section.removeAttribute("hidden");
        }
        else { //Hides selected section
            section.hidden = true;
        }
    }
}

/**
 * Changes the modal window to display edit information
 * @param {*} ingredientId Ingredient being edited
 */
function changeToEdit(ingredientId){
    currentlyEditing = ingredientId;
    isEditing = true;
    const ingredient = storedIngredients[ingredientId];
    console.log(ingredient);
    document.getElementById("exampleModalLabel").innerHTML = "Edit an ingredient";
    document.getElementById("ingredientNameBox").setAttribute("value", ingredient["name"]);
    document.getElementById("ingredientType").value = ingredient["category"];
    document.getElementById("quantity").setAttribute("value", ingredient["quantity"]);
    document.getElementById("ingredientFormSubmit").innerHTML = "Save";
}
/**
 * Changes the modal window to display add information
 */
function changeToAdd(){
    isEditing = false;
    document.getElementById("exampleModalLabel").innerHTML = "Add a new ingredient";
    document.getElementById("ingredientNameBox").setAttribute("value", "");
    document.getElementById("ingredientType").value = "produce";
    document.getElementById("quantity").setAttribute("value","");
    document.getElementById("ingredientFormSubmit").innerHTML = "Add Ingredient";
}

/**
 * Deletes the ingredient from the DB and removes it from the visual
 */
function deleteIngredient(event){
    var ingredientID = event.target.parentElement.parentElement.parentElement.id;
    delIngredientFromDb(ingredientID);
}
export {addIngredient, displayIngredients, displaySection, changeToEdit, changeToAdd, deleteIngredient};