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

    // Hide info 
    info = document.getElementById("info_form");
    info.hidden = true;
    // Move indicator
    document.querySelector("#indicator").style.left = move;

    // Clear categories tab
    document.querySelector("#categories").innerHTML = "";

    // Clear variable options 
    document.querySelector("#options_using").innerHTML = "";
    document.querySelector("#options_results").innerHTML = "";

    // Clear selected variables
    document.querySelector("#using").innerHTML = "";
    document.querySelector("#results").innerHTML = "";

     // Hide variable options
    hideVariables("results");
    hideVariables("using");

    document.getElementById('variables').className = "inactive";
    document.getElementById('results_button').removeAttribute("class");
    document.getElementById('using_button').removeAttribute("class");

    // Reset dict with arrays 
    dict["results"] = [];
    dict["using"] = [];

    // Get appropriate formulas
    if (move == "51px"){
        getFormula("math")
    }
    if (move == "200px"){
        getFormula("physics")
    }
    if (move == "-50px"){
        info.hidden = false;
    }
}

function getFormula(math){


    global_math = math;

    let results = dict["results"].join("+").toString();
    let using = dict["using"].join("+").toString();

    // get formula
    fetch(`/formula/${math}/?r=${results}&u=${using}`)
    .then(response => response.json())
    .then(formulas => {

        // Clear categories tab
        document.querySelector("#categories").innerHTML = "";

        categories = document.querySelector("#categories");

        // Check if any formulas
        if (formulas.formulas.length < 1){
            h2 = document.createElement("h2");
            h2.innerHTML = "No formulas Found";
            categories.append(h2);
        }

        // Normal Formulas
        if (formulas.isCombined == false){
            formulas.formulas.forEach(element => {
                normalFormula(element);
                createFormula(element, "0px", 1);                                                
            });    
            MathJax.typeset();  
            return;          
        }

        // Combined Formulas
        for (let i = 0; i < formulas.combinedFormula.length; i++){
            div = document.createElement("div");
            h2 = document.createElement("h2");
            h2.innerHTML = formulas.combinedFormula[i];
            div.append(document.createElement("hr"));
            div.append(h2);
            categories.append(div);                    
            spaces = 0
            formulas.formulas[i].forEach(element => {
                spaces += 20;
                createFormula(element, `${spaces}px`, i + 1);
            })
        }
        MathJax.typeset();                
    });
}

function normalFormula(element){

    // Add variables to using option
    element.using.forEach(variable => {
        formulaVariables(variable, "using");
    });

    // Add variables to product option
    element.product.forEach(variable => {
        formulaVariables(variable, "results");
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
}

// Creates only valid variables 
function formulaVariables(variable, name){
    button = document.getElementById(`${name}_${variable}`);
    if (button == null){
        button = document.createElement("button");
        button.setAttribute("id", `${name}_${variable}`);
        button.setAttribute("onclick", `add("${variable}", "${name}")`)
        button.innerHTML = "\\[" + variable + "\\]";
        document.getElementById(`options_${name}`).append(button);
    } 
}

function createFormula(element, marginLeft, index) {

    ul = document.createElement("ul");
    ul.setAttribute("class", "formulaList");

    // Formula
    p1 = document.createElement("p");
    p1.setAttribute("onmouseover", `showVariableDescription(this, '${element.id}i${index}')`)
    p1.setAttribute("onmouseout", `hideVariableDescription(this, '${element.id}i${index}')`)
    p1.innerHTML = element.formula;
    p1.setAttribute("class", "formula");

    // Variable description
    p2 = document.createElement("p");
    element.variableDescription.forEach(description => {
        p2.innerHTML += description + "</br>";
    })
    p2.setAttribute("class", "formulaVariables");
    p2.setAttribute("id", `${element.id}i${index}`)

    // Formula description
    p3 = document.createElement("p");
    p3.innerHTML = element.description;
    p3.setAttribute("class", "formulaDescription");                
    ul.append(p1, p2, p3);
    ul.style.marginLeft = marginLeft;
    div.append(ul);   
    hideVariableDescription(p1, element.id + "i" + index);     
}

// Show description on hover
function showVariableDescription(element, id){
    console.log(id);
    document.getElementById(id).style.display = "inline-block";
    element.style.left = "10px";
}
// Hide description on unhover
function hideVariableDescription(element, id){
    console.log(id);
    document.getElementById(id).style.display = "none";
    element.style.left = "0px";

}

// When variable options clicked
function showVariables(name){
    document.getElementById('results_button').removeAttribute("class");
    document.getElementById('using_button').removeAttribute("class");

    // Show Active
    button = document.getElementById(`options_${name}`);
    variables = document.querySelector('#variables');
    if (button.style.display == "none" | variables.className == "inactive"){
        variables.className = "inactive"; 
        // Hide variable options
        hideVariables("results");
        hideVariables("using");        
        button.style.display = "inline-block";    
        document.getElementById(`${name}_button`).className = "check";  
        setTimeout(() => {
            variables.className = "active";            
        }, 100);

    }else {       
        variables.className = "inactive";           
    }
}
function hideVariables(name){
    document.getElementById(`options_${name}`).style.display = "none";
}

// Add variable to sort
function add(variable, name){
    let tmp = dict[name];
    element = document.querySelector(`#${name}_${variable}`);
    button = document.getElementById(`active_${name}_${variable}`);
    list = document.getElementById(name);
    element.removeAttribute("class");  

    // Create/remove, select and deselect button
    if (button == null){
        console.log(document.getElementById(name).childElementCount)
        if (list.childElementCount >= 6){
            return
        }
        button = document.createElement("button");
        button.setAttribute("id", `active_${name}_${variable}`);
        button.innerHTML = "\\[" + variable + "\\]";
        button.setAttribute("onclick", `add("${variable}", "${name}")`);
        if (name == "results"){
            list.append(button);            
        } else {
            list.prepend(button);  
        }

        element.className = "check";     
        tmp.push(variable);
    } else {
        tmp.splice(tmp.indexOf(variable), 1);  
        button.remove();
    }

    // Actual data updating
    dict[name] = tmp;
  
    console.log(dict);
    getFormula(global_math);
    MathJax.typeset();
}
