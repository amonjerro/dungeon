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