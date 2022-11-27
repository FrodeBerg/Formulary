document.addEventListener('DOMContentLoaded', () => {
    moveIndicator('-200px');
})
// Global variables
var dict = {
    "results": [],
    "using": []
}
var global_math = "";

function moveIndicator(move){
    if (move == "51px"){
        getFormula("math")
    }
    if (move == "200px"){
        getFormula("physics")
    }
    // Move indicator
    document.querySelector("#indicator").style.left = move;

    // Clear categories tab
    document.querySelector("#categories").innerHTML = "";

    // Clear variable options 
    document.querySelector("#options_using").innerHTML = "";
    document.querySelector("#options_results").innerHTML = "";

    // Clear selected variables
    document.querySelector("#using").innerHTML = `<button onclick="showVariables('using')">Uses:</button>`;
    document.querySelector("#results").innerHTML = `<button onclick="showVariables('results')">Results in:</button>`;

     // Hide variable options
    hideVariables("results");
    hideVariables("using");

    // dict with arrays 
    dict = {
        "results": [],
        "using": []
    }
}

function getFormula(math){

    // Clear categories tab
    document.querySelector("#categories").innerHTML = "";

    global_math = math;

    let results = dict["results"].join("+").toString();
    let using = dict["using"].join("+").toString();
    // get formula
    fetch(`/formula/${math}/?r=${results}&u=${using}`)
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
                    div.setAttribute("id", `category_${element.category}`);
                    h3 = document.createElement("h3");
                    h3.innerHTML = element.category;
                    div.append(document.createElement("hr"));
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
    let tmp = dict[name];
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
        tmp.push(variable);
    } else {
        element.style.backgroundColor = "";     
        button.remove();
        tmp.splice(tmp.indexOf(variable), 1);
    }
    dict[name] = tmp;
  
    console.log(dict);
    getFormula(global_math);
}
