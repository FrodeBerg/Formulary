document.addEventListener('DOMContentLoaded', () => {
    moveIndicator('200px');
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

    document.getElementById('results').children[0].style.backgroundColor = "";
    document.getElementById('using').children[0].style.backgroundColor = "";
    document.getElementById('variables').hidden = true;

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
            // Combined Formulas
            if (formulas.isCombined){
                if (formulas.combinedFormula.length < 1){
                    h2 = document.createElement("h2");
                    h2.innerHTML = "No formulas Found";
                    categories.append("h2");
                }
                for (let i = 0; i < formulas.combinedFormula.length; i++){
                    div = document.createElement("div");
                    h2 = document.createElement("h2");
                    h2.innerHTML = formulas.combinedFormula[i];
                    div.append(document.createElement("hr"));
                    div.append(h2);
                    categories.append(div);                    
                    spaces = ""
                    formulas.formulas[i].forEach(element => {
                        spaces += "20px";
                        createFormula(element, spaces, i + 1);
                    })
                }
            }
            // Normal Formulas
            if (formulas.isCombined == false){
                    formulas.formulas.forEach(element => {
                    // Add variables to using option
                    element.using.forEach(variable => {
                        button = document.getElementById(`using_${variable}`);
                        if (button == null){
                            button = document.createElement("button");
                            button.setAttribute("id", `using_${variable}`);
                            button.setAttribute("onclick", `add("${variable}", "using")`)
                            button.innerHTML =  "\\[" + variable + "\\]";
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
                            button.innerHTML = "\\[" + variable + "\\]";
                            document.getElementById("options_results").append(button);
                        }
                    });

                    // Add every category and related formulas
                    div = document.querySelector(`#category_${element.tag}`);
                    if (div == null){
                        div = document.createElement("div");
                        div.setAttribute("id", `category_${element.tag}`);
                        h3 = document.createElement("h3");
                        h3.innerHTML = element.category;
                        div.append(document.createElement("hr"));
                        div.append(h3);
                        categories.append(div);
                    }

                    createFormula(element, "0px", 1);                                                
                });                
            }
            MathJax.typeset();                    
    });
}

function createFormula(element, marginLeft, index) {

    // Formula and description
    ul = document.createElement("ul");
    ul.setAttribute("class", "formulaList");
    p3 = document.createElement("p");
    element.variableDescription.forEach(description => {
        p3.innerHTML += description + "</br>";
    })
    p3.setAttribute("class", "formulaVariables");
    p3.setAttribute("id", `${element.id}i${index}`)
    p1 = document.createElement("p");
    p1.setAttribute("onmouseover", `showVariableDescription(this, '${element.id}i${index}')`)
    p1.setAttribute("onmouseout", `hideVariableDescription(this, '${element.id}i${index}')`)
    p1.innerHTML = element.formula;
    p1.setAttribute("class", "formula");
    p2 = document.createElement("p");
    p2.innerHTML = element.description;
    p2.setAttribute("class", "formulaDescription");                
    ul.append(p1);
    ul.append(p3);
    ul.append(p2);
    ul.style.marginLeft = marginLeft;
    div.append(ul);   
    hideVariableDescription(p1, element.id + "i" + index);     
}

function showVariableDescription(element, id){
    console.log(id);
    document.getElementById(id).style.display = "inline-block";
    element.style.left = "10px";
}
function hideVariableDescription(element, id){
    console.log(id);
    document.getElementById(id).style.display = "none";
    element.style.left = "0px";

}
function showVariables(name){
    document.getElementById('results').children[0].style.backgroundColor = "";
    document.getElementById('using').children[0].style.backgroundColor = "";
    // Show Active
    button = document.getElementById(`options_${name}`);
    variables = document.querySelector('#variables');
    if (button.style.display == "none"){
        // Hide variable options
        hideVariables("results");
        hideVariables("using");        
        button.style.display = "inline-block";    
        document.getElementById(`${name}`).children[0].style.backgroundColor = "grey";  
        variables.hidden = false;  
    }else {
        button.style.display = "none";        
        variables.hidden = true;               
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
        button.innerHTML = "\\[" + variable + "\\]";
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
    MathJax.typeset();
}
