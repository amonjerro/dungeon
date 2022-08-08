function Faction(max_degree_centrality){
    this.individuals = []
    this.adjacencyStructure = {}
    this.centrality = max_degree_centrality
    
    this.populateAdjacency = function(){
        let member_names = this.individuals.map((e)=> {return e.name})
        this.adjacencyStructure = new AdjacencyStructure(member_names, this.centrality)
    }

    this.addIndividual = function(individual){
        this.individuals.push(individual)
    }
}

function IndividualFactory(min, max){

    this.types = {
        's':SocialIndividual,
        'n':NonSocialIndividual
    }

    this.name_length_min = min
    this.name_length_max = max

    this.produceIndividual = function(type){
        let name_length = randomIntFromInterval(this.name_length_min, this.name_length_max)
        let nameGenerator = new MarkovChain(name_length)
        nameGenerator.randomInitialize()
        let individual = new this.types[type](nameGenerator.makeChain())

        individual.randomTraits()

        return individual
    }


}

function SocialIndividual(name){
    this.name = name

    this.traits = {
        'ambition':0,
        'extroversion':0,
        'compunction':0,
        'conformity':0,
        'leadership':0
    }

    this.randomTraits = function(){
        let keys = Object.keys(this.traits)
        for (let k = 0; k < keys.length; k++){
            this.traits[keys[k]] = Math.random()
        }
    }

    this.setName = function(value){
        this.name = value
    }
}

function NonSocialIndividual(name){
    this.name = name



    this.randomTraits = function(){
        let keys = Object.keys(this.traits)
        for (let k = 0; k < keys.length; k++){
            this.traits[keys[k]] = Math.random()
        }
    }

    this.setName = function(value){
        this.name = value
    }
}

function AdjacencyStructure(keys_of_individuals, max_degree_centrality){
    this.adjacencyMap = new Map()
    for(let k = 0; k < keys_of_individuals.length; k++){
        let key = keys_of_individuals[k]
        if (!this.adjacencyMap.get(key)){
            this.adjacencyMap.set(key, [])
        }
        let centrality_for_node = randomIntFromInterval(1, max_degree_centrality)
        for (let i = 0; i < centrality_for_node; i++){
            
            let connection = keys_of_individuals[randomIntFromInterval(0, keys_of_individuals.length -1)]
            while (connection == key || this.adjacencyMap[key].includes(connection)){
                connection = keys_of_individuals[randomIntFromInterval(0, keys_of_individuals.length -1)]
            }
            this.adjacencyMap.get(key).push(connection)
            if (this.adjacency,get(connection)){
                this.adjacencyMap.get(connection).push(key)
            } else {
                this.adjacencyMap.set(connection, [key])
            }
        }
    }

    this.getNodeDegreeCentrality = (key) =>{
        return this.adjacencyMap[key].length
    }

    this.getNodeNeighbors = (key) =>{
        return this.adjacencyMap[key]
    }
}