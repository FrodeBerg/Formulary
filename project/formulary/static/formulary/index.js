document.addEventListener('DOMContentLoaded', () => {
    moveIndicator('-200px');
})


function moveIndicator(move){
    // Move indicator
    document.querySelector("#indicator").style.left = move;

    // Clear categories tab
    document.querySelector("#categories").innerHTML = "";

    // Clear variable options 
    document.querySelector("#options_using").innerHTML = "";
    document.querySelector("#options_results").innerHTML = "";

     // Hide variable options
    hideVariables("results");
    hideVariables("using");

    // arrays with variables
    var results = [];
    var using = [];
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
                // Add variables to using option
                element.using.forEach(variable => {
                    button = document.getElementById(`using_${variable}`);
                    if (button == null){
                        button = document.createElement("button");
                        button.setAttribute("id", `using_${variable}`);
                        button.setAttribute("onclick", `add("${variable}", "using")`)
                        button.innerHTML = variable;
                        document.getElementById("options_using").append(button);
                    }
                });

                // Add variables to product option
                element.product.forEach(variable => {
                    button = document.getElementById(`results_${variable}`);
                    if (button == null){
                        button = document.createElement("button");
                        button.setAttribute("id", `results_${variable}`);
                        button.setAttribute("onclick", `add("${variable}", "results")`)
                        button.innerHTML = variable;
                        document.getElementById("options_results").append(button);
                    }
                });

                // Add every category and related formulas
                div = document.querySelector(`#category_${element.category}`);
                if (div == null){
                    div = document.createElement("div");
                    div.setAttribute("id", `#category_${element.category}`);
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


    // Show Active
    button = document.getElementById(`options_${name}`);
    if (button.style.display == "none"){
        // Hide variable options
        hideVariables("results");
        hideVariables("using");        
        button.style.display = "inline-block";        
    }else {
        button.style.display = "none";             
    }

}

function hideVariables(name){
    document.getElementById(`options_${name}`).style.display = "none";
}

function add(variable, name){
    element = document.querySelector(`#${name}_${variable}`);
    button = document.getElementById(`active_${name}_${variable}`);
    // Create/ remove, select and deselect button
    if (button == null){
        button = document.createElement("button");
        button.setAttribute("id", `active_${name}_${variable}`);
        button.innerHTML = variable;
        button.setAttribute("onclick", `add("${variable}", "${name}")`);
        document.querySelector(`#${name}`).append(button);
        element.style.backgroundColor = "grey";      
    } else {
        element.style.backgroundColor = "";     
        button.remove();
    }
}
