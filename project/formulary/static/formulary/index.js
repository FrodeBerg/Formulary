document.addEventListener('DOMContentLoaded', () => {
    moveIndicator('-200px');
})
function moveIndicator(move){
    // Move indicator
    document.querySelector("#indicator").style.left = move;

    // Clear categories tab
    document.querySelector("#categories").innerHTML = ""
}

function getFormula(math){
    if (math == "math"){
        moveIndicator("51px");
    } else{
        moveIndicator("200px")
    }

    // get formula
    fetch(`/formula/${math}`)
        .then(response => response.json())
        .then(formulas => {
            categories = document.querySelector("#categories");
            formulas.forEach(element => {
                div = document.querySelector(`#category_${element.category}`);
                if (div == null){
                    div = document.createElement("div");
                    div.setAttribute("id", `#category_${element.category}`)
                    h3 = document.createElement("h3");
                    h3.innerHTML = element.category;
                    div.append(h3);
                    categories.append(div);
                }
                h5 = document.createElement("h5");
                console.log(element.formula)
                h5.innerHTML = element.formula;
                div.append(h5);
            });
    });
}

function showVariables(name){
    document.querySelector("#variable_menu").hidden = false;
    document.querySelector("#variable_text").innerHTML = name;
}

function hideVariables(){
    document.querySelector("#variable_menu").hidden = true;
}

function addVariable(name){
    var li = document.createElement("li");
    li.setAttribute("id", name);
    li.setAttribute("onclick", "removeVariable(this)")
    li.innerHTML = name;

    if (document.querySelector("#variable_text").innerHTML == "Results in:"){
        let results = document.querySelector("#results");
        results.appendChild(li);
    }
    else{
        document.querySelector("#using").append(li)
    }
}

function removeVariable(element){
    element.remove();
}