// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };

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

//Colors
const COLOR_PALETTE = [
    '#FF1D15','#41CC00',
    '#73B3D3','#FFFC31',
    '#F7C59F','#E1E5EE','#FE5F55'
]

function pickAColor(index){
    if (index >= COLOR_PALETTE.length){
        throw 'Too many factions created - extend color pallete range'
    }
    return COLOR_PALETTE[index]
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