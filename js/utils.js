//Helpers
function randomIntFromInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randomOddIntFromInterval(min, max){
    let offset = Math.random() > 0.5 ? 1 : -1;
    let outcome = Math.floor(Math.random()*(max-min+1)+min)
    if (outcome % 2 == 0){
        outcome += offset
    }
    return outcome
}

//Markov Chain evaluator
function evaluate(l){
    let s = 0
    for (let i=0; i < l.length; i++){
        s += l[i][1]
    }
    return s
}

var accordion = document.getElementsByClassName("accordion")

for(let i = 0; i < accordion.length; i++){
    accordion[i].addEventListener("click", function(){
        this.classList.toggle("active")
        var panel = this.nextElementSibling;
        if(panel.style.maxHeight){
            panel.style.maxHeight = null;
            panel.style.paddingTop = "0px";
        } else {
            panel.style.maxHeight = panel.scrollHeight + 'px'
            panel.style.paddingTop = "10px";
        }
    }) 
}