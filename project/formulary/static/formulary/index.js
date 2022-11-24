document.addEventListener('DOMContentLoaded', () => {
    moveIndicator('-200px');
})
function moveIndicator(move){
    // Move indicator
    document.querySelector("#indicator").style.left = move;

    let subject = ""
    // Fetch data 
    if (move='51px'){
        subject = "math";
    }else if (move='200px'){
        subject = "physics";
    } else {
        return;
    }
    fetch(`/${subject}`)
    .then(response => response.json())
    .then((category, variable) => {
        category.forEach(element => {
            console.log(element);
            var div = document.createElement("div");
            div.innerHTML= `<h3>${element.category}</h3>`;
            element.formula.forEach(element => {
                li = document.createElement("li");
                li.innerHTML = element;
                div.append(li);
            });
            document.querySelector("#categories").append(ul);
        });
    })
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