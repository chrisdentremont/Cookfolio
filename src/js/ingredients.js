import "../../dist/scss/styles.scss";
import * as bootstrap from "bootstrap";

window.onload = () => {
    const ingredientForm = document.getElementById("ingredientForm");
    ingredientForm.addEventListener("submit", addIngredient);
};

function addIngredient(event) {
    event.preventDefault();
    let formData = event.target.elements;

    let categoryName = formData[1].value.toLowerCase();
    const category = document.getElementById(categoryName + "-section");

    let categoryList = document.getElementById(categoryName + "-list");
    
    let categoryListItem = document.createElement("li");
    categoryListItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    if(categoryList == null){
        category.removeAttribute("hidden");
        categoryList = document.createElement("ul");
        categoryList.classList.add("list-group");
        categoryList.setAttribute("id", categoryName + "-list");
        
        categoryListItem.textContent = formData[0].value.charAt(0).toUpperCase() + formData[0].value.slice(1).toLowerCase();
    }
    else{
        categoryListItem.textContent = formData[0].value.charAt(0).toUpperCase() + formData[0].value.slice(1).toLowerCase();
    }
    
    let quantityBadge = document.createElement("span");
        quantityBadge.classList.add("badge", "bg-primary", "rounded-pill");
        quantityBadge.textContent = formData[2].value;

    categoryListItem.appendChild(quantityBadge);
    categoryList.appendChild(categoryListItem);
    
    category.appendChild(categoryList);

    document.getElementById("ingredientFormClose").click();
    event.target.reset();
}


export {addIngredient};