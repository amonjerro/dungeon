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