# dungeon
A procedural dungeon generator for the web. 

The construction of the maze is based on Prim's algorithm [as explained](http://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm) as explained by Jamis Buck.

## Current status
Its waaaay early into development. The maze currently only generates the rooms every time the page is loaded. It has a button that toggles the grid. I still need to add a button that generates the rooms on demand, which probably means putting all of the loose iterations onto functions. Thinking about moving all those functions to separate files and keeping the code properly compartmentalized.

## What's in store
- First should be completing the dang maze. It will be very similar to the way it is done by Bob Nystrom in [his post](http://journal.stuffwithstuff.com/2014/12/21/rooms-and-mazes/).
- After that comes the population of those rooms with stuff. By stuff I mean treasures and monsters. Also, put traps in the corridors. I might decide to align these monsters, treasures and traps to a specific ruleset (such as using 3.5e D&D for the stats) or I might choose to make it more general and make it work like suggestions to give more flexibility to GMs.
- Make it interactive? Add some RPG functionality like characters, character progression and a conflict resolution system. This might take a while tho. No promises.

## Update schedule

Hopefully weekly? This is sort of a whenever-free-time-allows kinda deal so it's up the Old Ones to determine that. 

## How can I contribute?

However you wish. Documentation is always welcome, as well as constructive criticism. I'm new to this whole Git thing so I guess I'll be evaluating anything else on a case-by-case basis.

### A caveat
English isn't my first language; Spanish is. I'll try to keep the docs and comments in English but I make no promises regarding the commit messages. Those messages I write them as spur of the moment stuff while trying to be descriptive. So, yeah.
