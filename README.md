# **Battleship44**

Just <a href="https://en.wikipedia.org/wiki/Battleship_(game)">battleship</a> html5 `game`.  

<img src="screenshots/0.png" alt="screenshot" width="700"/>

## features

Supported `fleet sizes`:

* russian (4, 3, 3, 2, 2, 2, 1, 1, 1, 1)
* classic one (5, 4, 3, 3, 2)
* classic two (5, 4, 3, 2, 2, 1, 1)

Supported `fleet modes`:

* straight fleets
* curved fleets

Supported `langs`:  

* english  
* polish  

Supported `browsers`:  

* development mode: last Chrome version, last Firefox version
* production mode: any <sub>modern</sub> browser

## **architecture**

* back-end (`BE`) and front-end (`FE`) may running both standalone
* or `FE` can be copied into `BE` and run together

## **back-end**

* `BE` is written in `Java 11`
* it is `spring boot` application
* uses `maven` as build automation tool & dependency manager
* required system-wide dependencies: [Java](http://www.oracle.com/technetwork/java/javase/overview/index.html) >= 11, [maven](https://maven.apache.org/) >= 3.3
* install local (project) dependencies: (auto installed while compiling)
* compile (`FE` not included): `mvn package`
* compile with included `FE`: `mvn package -Pfe`
* start: `java -jar target/battleship44-0.0.1.jar <game server properties>`
* available `game server properties`:
  - `--server.port=<port>`
  - `--game.rules.fleet-sizes=<size>` (`russian`, `classic_one`, `classic_two`)
  - `--game.rules.fleet-mode=<mode>` (`straight`, `curved`)
  - `--game.rules.fleet-can-touch-each-other-diagonally=<value>` (`true`, `false`)
  - `--game.rules.show-fields-for-sure-empty=<value>` (`true`, `false`)

## **front-end**

* `FE` is written in `html5+TypeScript4`
* uses `npm`, `webpack` as build automation tool & dependency manager
* required system-wide dependencies: [nodejs](https://nodejs.org/en/) >=10.0.0
* install local (project) dependencies: `npm install`
* compile in `development` mode: `npx webpack --mode development`
* compile in `production` mode: `npx webpack --mode production`
* default backend in `development` mode: `ws://localhost:8080/ws`
* default backend in `production` mode: `protocol + '//' + window.location.host + '/ws`
* compile with a custom backend url: `BACKEND='ws://localhost:8080/ws' npx webpack --mode <mode>`
* start in the standalone mode: `npm start <server port>`

## changelog 
v1.0.0 (released 2016-08-18)  
+ first version  
  
v1.1.0 (released 2016-08-22)  
+ front: general improvements and refactoring  
+ front: handle WinSocket onerror event  
+ front: info about number of players in current game  
+ front: info about current winning ratio  
+ back/front: info about number of players on a server (STAT)  
+ back: add on error controller  
+ back: possible to customize WebSocket conf&policy by .properties file  
  
v1.2.0 (released 2016-08-31)  
+ front: general improvements and refactoring  
+ front: i18n: strings configurable by json files  
+ front: i18n: polish lang support  
+ front: i18n: possible to change lang without reloading page  
+ front: pointer cursor on all flag, and cross-hair on shoot grid  
  
v1.3.0 (released 2016-10-05)   
+ front: re-written & refactored js to TypeScript2  
+ front: source now written with targeting es7, es5 also available (transcompiled)  
+ front: minified js file  
+ back: controller fix (commit/b23803f28d790c34e47c8b8d2cf753f07860c15d)  
  
v1.4.0 (released 2017-05-10)  
+ general: separated front-end/back-end codes, now they can be started separately  
+ front bug fix: WebSocket connection on HTTPS didn't work  
+ front bug fix: URL to flags were incorrect (uppercase)  
  
v1.4.1 (released 2020-09-24)
+ front: updated dependencies  
+ front: development/build process refactored & simplified  
+ front: refactored code to meet [gts](https://github.com/google/gts) rules  
+ back: updated dependencies  
+ back: code updated to java 11  
  
v2.0.0 (unreleased)  
+ general: revised protocol,
+ back/front: a new feature: random fleet location  
+ back/front: a new feature: possibility to change the rules of the game in each game  
  
vX.Y.Z (planned)  
- "availability broadcasting" - look for a waiting player  
- back/front: info which ship sizes has been already shot & which are still to shoot down  
- back/front: a mini chat in game, between players  
- back/front: grid-size is now game-level, not server-level  
  
## protocol
  
→ `TO__ SERVER`  
← `FROM SERVER`  
  
← `HI_. <some_text>`  
  
→ `GAME NEW`  
→ `GAME <game_id>`  
← `GAME OK <game_id>`  
← `400 GAME no-such-game`  
← `400 GAME no-free-slot`  
← `400 GAME you-are-in-game`  
  
← `GAME-RULES grid-size=10x10,fleet-sizes=russian,fleet-mode=curved,...`  
→ `GAME-RULES fleet-sizes=next`  
→ `GAME-RULES fleet-sizes=classic_one`  
← `GAME-RULES fleet-sizes=classic_one`  
← `400 GAME-RULES no-game-set`  
← `400 GAME-RULES game-in-progress`  
← `400 GAME-RULES 2pla-in-game`  
← `400 GAME-RULES invalid-game-rules-change`  
  
→ `GRID 0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,0,0`  
← `GRID OK`  
← `GRID FAIL`  
← `400 GRID no-game-set`  
← `400 GRID game-in-progress`  
← `400 GRID grid-already-set`  
  
→ `GRID RANDOM`  
← `GRID RANDOM 0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,0,0`  
  
← `2PLA`  
← `TOUR START`  
← `TOUR YOU`  
← `TOUR HE`  
  
→ `SHOT [0,2]`  
← `YOU_ [SHIP,0,2],[EMPTY,2,1],[EMPTY,2,2]`  
← `HE__ [EMPTY,2,7]`  
← `400 SHOT no-game-set`  
← `400 SHOT game-waiting`  
← `400 SHOT not-your-tour`  
← `400 SHOT bad-shoot`  
  
← `WON_ YOU`  
← `WON_ HE`  
  
← `1PLA game-interrupted`  
← `1PLA game-not-interrupted`  
  
← `STAT players=10,reserved=1`  
  
→ `PING <ping_msg>`  
← `PONG <ping_msg>`  
  
→ `<bad_command>`  
← `400 unknown-command`  

## documentation
  
* protocol  
* code  
* comments  
