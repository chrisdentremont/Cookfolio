import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";
import {addIngredientToDb, delIngredientFromDb} from "./firebase";

window.onload = () => {
    const ingredientForm = document.getElementById("ingredientForm");
    ingredientForm.addEventListener("submit", addIngredient);
};

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
        categoryListItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        if(categoryList == null){
            category.removeAttribute("hidden");
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
        categoryList.appendChild(categoryListItem);
        
        category.appendChild(categoryList);
    }
}


export {addIngredient, displayIngredients};