var max_consecutive_consonants = 3
var max_consecutive_vowels = 2
const VOWELS = ['a','e','i','o','u']
const CONSONANTS = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','y','z']

const VOWEL_CONSONANT_MARKOV_CHAIN = new Map([
    ['v', new Map([['v',0.2],['c', 0.8]])],
    ['c', new Map([['v',0.4],['c',0.6]])]
])

const LETTER_TO_LETTER_MARKOV_VALUES = new Map([
    ['a',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['b',{
        'v':[
            ['a',0.24],['e',0.24],['o',0.24],['i',0.24],['u',0.04]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.1],['f',0.05],
            ['g',0],['h',0.01],['j',0],['k',0],
            ['l',0.10],['m',0.15],['n',0.05],['p',0.05],
            ['q',0],['r',0.12],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.01],['y',0],
            ['z',0]
        ]
    }],
    ['c',{
        'v':[
            ['a',0.3],['e',0.3],['o',0.3],['i',0.05],['u',0.05]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['d',{
        'v':[
            ['a',0.22],['e',0.22],['o',0.22],['i',0.12],['u',0.22]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['e',{
        'v':[
            ['a',0.25],['e',0.35],['o',0.15],['i',0.15],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['f',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['g',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['h',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['i',{
        'v':[
            ['a',0.15],['e',0.5],['o',0.15],['i',0.1],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['j',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['k',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['l',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['m',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['n',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['o',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.3],['i',0.2],['u',0.3]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['p',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['q',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['r',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['s',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['t',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['u',{
        'v':[
            ['a',0.1],['e',0.2],['o',0.4],['i',0.2],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['v',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['w',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['x',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['y',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
    ['y',{
        'v':[
            ['a',0.1],['e',0.1],['o',0.1],['i',0.6],['u',0.1]
        ],
        'c':[
            ['b',0.10],['c',0.05],['d',0.07],['f',0.05],
            ['g',0.07],['h',0.01],['j',0.01],['k',0.01],
            ['l',0.10],['m',0.10],['n',0.05],['p',0.05],
            ['q',0.01],['r',0.07],['s',0.12],['t',0.07],
            ['v',0.01],['w',0.01],['x',0.02],['y',0.01],
            ['z',0.01]
        ]
    }],
])

function MarkovChain(length){
    this.currentState = null
    this.builtChain = ''
    this.onConsonant = false
    this.consecutiveVowels = 0
    this.consecutiveConsonants = 0

    this.addConsonant = function(){
        this.consecutiveConsonants++
        this.consecutiveVowels = 0
        this.onConsonant = true
    }
    this.addVowel = function(){
        this.onConsonant = false
        this.consecutiveVowels++
        this.consecutiveConsonants = 0
    }

    this.makeChain = function(){
        this.builtChain = ''
        let nextLetterType = ''
        let nextLetter = ''

        if (this.currentState == null){
            throw 'Uninitialized Markov Chain'
        }

        for (let i = 0; i < length; i++){
            nextLetterType = this.getNextLetterType(Math.random())
            nextLetter = this.getNextLetter(nextLetterType, Math.random())
            this.builtChain += nextLetter
        }
        return this.builtChain
    }

    this.getNextLetterType = function(roll){
        if (this.consecutiveConsonants == max_consecutive_consonants){
            this.addVowel()
            return 'v';
        } else if (this.consecutiveVowels == max_consecutive_vowels){
            this.addConsonant()
            return 'c';
        } else {
            if (this.onConsonant){
                if(VOWEL_CONSONANT_MARKOV_CHAIN.get('c').get('v') > roll){
                    this.addVowel()
                    return 'v';
                } else {
                    this.addConsonant()
                    return 'c';
                }
            } else {
                if(VOWEL_CONSONANT_MARKOV_CHAIN.get('v').get('v') > roll){
                    this.addVowel()
                    return 'v';
                } else {
                    this.addConsonant()
                    return 'c';
                }
            }
        }
    }

    this.getNextLetter = function(letterType, roll){
        let contenders = LETTER_TO_LETTER_MARKOV_VALUES.get(this.currentState)[letterType]
        let remainder_roll = roll
        let counter = 0
        let nextLetter = ''
        while(remainder_roll > 0 || counter < contenders.length-1){
            if (contenders[counter][1] > remainder_roll){
                nextLetter = contenders[counter][0]
                break;
            } else {
                remainder_roll -= contenders[counter][1]
            }
            counter ++
        }
        if (nextLetter == ''){
            return contenders[contenders.length-1][0]
        } else {
            return nextLetter
        }
    }

    this.setCurrentState = function(letter){
        this.currentState = letter
    }

    this.randomInitialize = function(){
        let concatenated = VOWELS.concat(CONSONANTS)
        let idx = Math.floor(Math.random()*concatenated.length)
        this.currentState = concatenated[idx]
    }
}