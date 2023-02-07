const BEING_TYPES = Object.freeze({
    Social:Symbol('Social'),
    NonSocial:Symbol('NonSocial')
})



function Faction(max_degree_centrality, being_type, sociabilityDegree){
    this.individuals = []
    this.adjacencyStructure = {}
    this.beingType = being_type
    this.centrality = max_degree_centrality
    this.factionSize = 0
    this.sociabilityDegree = sociabilityDegree
    this.div = null;
    this.individualContainer = null;
    
    this.populateAdjacency = ()=>{
        let memberNames = this.individuals.map((e)=> {return e.name})
        this.adjacencyStructure = new AdjacencyStructure(memberNames, this.centrality)
    }

    this.addIndividual = (individual)=>{
        this.individuals.push(individual)
    }

    this.listIndividuals = ()=>{
        return this.individuals.map((e)=> {return e.name.capitalize()})
    }

    this.populateFaction = (populate_adjacency)=>{
        let IF = new IndividualFactory(4,6)
        
        for (let i = 0; i < this.factionSize; i++){
            this.addIndividual(IF.produceIndividual(this.beingType))
        }
        if (populate_adjacency){
            this.populateAdjacency()
        }
        this.populateDiv();
    }

    this.populateDiv = () => {
        let individual_map = this.listIndividuals();
        let list_element = document.createElement("ul")
        for (let i = 0; i < individual_map.length; i++){
            //Create the basic element
            let individual_element = document.createElement("li")
            let text_element = document.createTextNode(individual_map[i])

            individual_element.appendChild(text_element)
            list_element.appendChild(individual_element)
        }
        this.individualContainer.appendChild(list_element)
    }

    this.setSize = (size)=>{
        this.factionSize = size;
        if (this.individuals.length != size){
            this.populateFaction(false);   
        }
    }

    //Set reference to the GUI to print information to the screen.
    this.setDiv = (div) => {
        this.div = div;
    }
    this.setIndividualContainer = (div)=>{
        this.individualContainer = div;
    }

}

function FactionFactory(){
    this.amount = 3
    this.minCentrality = 2
    this.maxCentrality = 3
    this.minFactionSize = 2
    this.maxFactionSize = 10
    this.factions = []
    this.div = null
    
    //For now I'm only creating social factions
    this.createFaction = ()=>{
        let centrality = randomIntFromInterval(this.minCentrality, this.maxCentrality)
        this.factions.push(new Faction(centrality, BEING_TYPES.Social, (Math.random()*4)+3))
    }

    this.produceFactions = () =>{
        this.factions.remove(0, this.factions.length)
        for (let i = 0; i < this.amount; i++){
            this.createFaction()
        }
    }

    this.recalculateFactionSizes = (requirements) =>{
        for (let r = 0; r < requirements.length; r++){
            this.factions[r].setSize(randomIntFromInterval(requirements[r], requirements[r] * this.factions[r].sociabilityDegree))
        }
    }

    this.setContainer = (div)=>{
        this.div = div;
    }

    this.setUpContainer = () => {
        //Clear the previous contents of the container first
        this.div.replaceChildren();

        for (let f = 0; f < this.factions.length; f++){
            //Create an element for the faction
            let element = document.createElement("div")
            element.classList.add("faction")

            //Make it an accordion
            let button_element = document.createElement("button")
            button_element.classList.add("accordion")
            

            let button_text = document.createTextNode(`Faction ${f}`)
            button_element.appendChild(button_text)

            
            let panel_element = createFactionPanel()


            //Assemble the HTML
            element.appendChild(button_element)
            element.appendChild(panel_element)

            //Enable the accordion
            button_element.addEventListener("click", function(){
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

            //Add this element to the faction container
            this.div.appendChild(element)
            this.factions[f].setDiv(element)
            this.factions[f].setIndividualContainer(panel_element)
        }
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

    //TO DO
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
    

    //TO DO
    this.getTreeLeader = () =>{

    }
}