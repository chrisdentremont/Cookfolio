import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";
import {addIngredientToDb, delIngredientFromDb} from "./firebase";

///
///TODO
///
window.onload = () => {
    const ingredientForm = document.getElementById("ingredientForm");
    ingredientForm.addEventListener("submit", addIngredient);

    const produceCheckBox = document.getElementById("produceCheck");
    produceCheckBox.addEventListener("click", function(){displaySection(this.id)});

    const dairyCheckBox = document.getElementById("dairyCheck");
    dairyCheckBox.addEventListener("click", function(){displaySection(this.id)});

    const proteinCheckBox = document.getElementById("proteinCheck");
    proteinCheckBox.addEventListener("click", function(){displaySection(this.id)});

    const starchyCheckBox = document.getElementById("starchy_foodsCheck");
    starchyCheckBox.addEventListener("click", function(){displaySection(this.id)});

    const seeAllCheckbox = document.getElementById("viewAllCheck");
    seeAllCheckbox.addEventListener("click", function(){displaySection(this.id)})
};

///
///TODO
///
function addIngredient(event){
    event.preventDefault();
    let formData = event.target.elements;

    var newIngredient = {
        name: formData[0].value,
        category: formData[1].value,
        quantity: formData[2].value
    };

    addIngredientToDb(newIngredient);

    document.getElementById("ingredientFormClose").click();
    event.target.reset();
}
///
///TODO
///
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
        let categoryName = ingredientInfo[ingredient]["category"].toLowerCase();
        const category = document.getElementById(categoryName + "-section");

        let categoryList = document.getElementById(categoryName + "-list");
        
        let categoryListItem = document.createElement("li");
        categoryListItem.classList.add("list-group-item", "d-flex","align-items-center");


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

            categoryListItem.textContent = ingredientInfo[ingredient]["name"].charAt(0).toUpperCase() + ingredientInfo[ingredient]["name"].slice(1).toLowerCase();
            
            
        }
        else{
            categoryListItem.textContent = ingredientInfo[ingredient]["name"].charAt(0).toUpperCase() + ingredientInfo[ingredient]["name"].slice(1).toLowerCase();
        }

        let quantityBadge = document.createElement("span");
        quantityBadge.classList.add("badge", "bg-primary", "rounded-pill");
        quantityBadge.textContent = ingredientInfo[ingredient]["quantity"];
    
        categoryListItem.appendChild(quantityBadge);

        //Div to move buttons to right side
        let tempDiv = document.createElement("div");
            tempDiv.classList.add("temp-div");

        //Edit Button Creation
        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");

        let editIcon = document.createElement("i");
        editIcon.classList.add("bi", "bi-pencil-fill");
        editIcon.setAttribute("height", "15");
        editIcon.setAttribute("width", "15");
        editButton.appendChild(editIcon);

        tempDiv.appendChild(editButton);

        //Delete Button Creation
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");

        let deleteIcon = document.createElement("i");
        deleteIcon.classList.add("bi", "bi-trash-fill");
        deleteIcon.setAttribute("height", "15");
        deleteIcon.setAttribute("width", "15");
        deleteButton.appendChild(deleteIcon);

        tempDiv.appendChild(deleteButton);

        //Add Items to category and list
        categoryListItem.appendChild(tempDiv);

        categoryList.appendChild(categoryListItem);
        
        category.appendChild(categoryList);
    }
}

///
///TODO
///
function displaySection(checkboxID) {
    const currentCheckBox = document.getElementById(checkboxID);
    
    let tempString = checkboxID.substring(0,checkboxID.indexOf("C"));
    console.log(tempString);
    const section = document.getElementById(tempString + "-section");

    if(checkboxID == "viewAllCheck"){
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
        else{
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
        if(currentCheckBox.checked){
            section.removeAttribute("hidden");
        }
        else {
            section.hidden = true;
        }
    }
}

export {addIngredient, displayIngredients, displaySection};