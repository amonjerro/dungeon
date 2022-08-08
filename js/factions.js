const BEING_TYPES = Object.freeze({
    Social:Symbol('Social'),
    NonSocial:Symbol('NonSocial')
})


function Faction(max_degree_centrality, being_type, faction_size){
    this.individuals = []
    this.adjacencyStructure = {}
    this.beingType = being_type
    this.centrality = max_degree_centrality
    this.factionSize = faction_size
    
    this.populateAdjacency = ()=>{
        let memberNames = this.individuals.map((e)=> {return e.name})
        this.adjacencyStructure = new AdjacencyStructure(memberNames, this.centrality)
    }

    this.addIndividual = (individual)=>{
        this.individuals.push(individual)
    }

    this.listIndividuals = ()=>{
        return this.individuals.map((e)=> {return e.name})
    }

    this.populateFaction = ()=>{
        let IF = new IndividualFactory(4,6)
        
        for (let i = 0; i < this.factionSize; i++){
            this.addIndividual(IF.produceIndividual(this.beingType))
        }

        this.populateAdjacency()
    }
}

function IndividualFactory(min, max){

    this.name_length_min = min
    this.name_length_max = max

    this.produceIndividual = (type)=>{
        let name_length = randomIntFromInterval(this.name_length_min, this.name_length_max)
        let nameGenerator = new MarkovChain(name_length)
        nameGenerator.randomInitialize()

        let individual = null
        if (type == BEING_TYPES.Social){
            individual = new SocialIndividual(nameGenerator.makeChain())
        } else if (type == BEING_TYPES.NonSocial){
            individual = new NonSocialIndividual(nameGenerator.makeChain())
        }

        if (!individual){
            throw 'Individual type is not properly specified'
        }

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

    this.randomTraits = ()=>{
        let keys = Object.keys(this.traits)
        for (let k = 0; k < keys.length; k++){
            this.traits[keys[k]] = Math.random()
        }
    }

    this.setName = (value)=>{
        this.name = value
    }
}

function NonSocialIndividual(name){
    this.name = name

    this.traits = {
        'territorialness':0,
        'ferocity':0,
        'cunning':0
    }

    this.randomTraits = function(){
        let keys = Object.keys(this.traits)
        for (let k = 0; k < keys.length; k++){
            this.traits[keys[k]] = Math.random()
        }
    }

    this.setName = (value)=>{
        this.name = value
    }
}

function AdjacencyStructure(keys_of_individuals, max_degree_centrality){
    this.adjacencyMap = new Map()
    this.degreeCentralityTree = {}

    for(let k = 0; k < keys_of_individuals.length; k++){
        let key = keys_of_individuals[k]
        if (!this.adjacencyMap.get(key)){
            this.adjacencyMap.set(key, [])
        }
        let centrality_for_node = randomIntFromInterval(1, max_degree_centrality)
        for (let i = 0; i < centrality_for_node; i++){
            
            let connection = keys_of_individuals[randomIntFromInterval(0, keys_of_individuals.length -1)]
            while (connection == key || this.adjacencyMap.get(key).includes(connection)){
                connection = keys_of_individuals[randomIntFromInterval(0, keys_of_individuals.length -1)]
            }
            this.adjacencyMap.get(key).push(connection)
            if (this.adjacencyMap.get(connection)){
                this.adjacencyMap.get(connection).push(key)
            } else {
                this.adjacencyMap.set(connection, [key])
            }
        }
    }

    this.getNodeDegreeCentrality = (key) =>{
        return this.adjacencyMap.get(key).length
    }

    this.getNodeNeighbors = (key) =>{
        return this.adjacencyMap.get(key)
    }

    this.getTreeLeader = () =>{

    }
}