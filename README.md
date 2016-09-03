#**Battleship44**  

##compile & run

* It is `spring boot` application.
* Back-end uses `maven` as build automation tool & dependency manager. 
* Front-end uses `npm` as build automation tool & dependency manager.
* Front-end is written in `TypeScript2`, and final compiled .js file is `not` provided.

### compile-dependencies
Back-end compile dependencies:

* [java development kit](http://www.oracle.com/technetwork/java/javase/overview/index.html) >=1.8
* [maven](https://maven.apache.org/) >= 3.3 (wrapper is provided)


Front-end (TypeScript files) compile dependencies:

* [nodejs, npm](https://nodejs.org/en/) (probably any version)


### compile-steps
* first front-end, then back-end

Front-end, compilng TS files and dependency JS collecting:  

* install all front-end compile-dependencies
* go to app main directory
* execute `npm run install-update`
* execute `npm run collect-compile`
* execute `npm run clean-fail` <sub><sup>(optionally, will fail, don't worry)</sup></sub>

Back-end, compiling app:

* generally steps are [as in any spring boot app](http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#build-tool-plugins-maven-packaging)
* install all back-end compile-dependencies
* go to app main directory
* run `mvn clean package`

### run-dependencies
* [java se runtime environment >=1.8](http://www.oracle.com/technetwork/java/javase/overview/index.html)

### run-steps
* go to app main directory
* execute `java -jar target/battleship44-0.0.1.jar`

##changelog 
v1.0  
+ first version  
  
v1.1  
+ front: general improvements and refactoring  
+ front: handle WinSocket onerror event  
+ front: info about number of players in current game  
+ front: info about current winning ratio  
+ back/front: info about number of players on server (STAT)  
+ back: add on error controller  
+ back: possible to customize WebSocket conf&policy by .properties file  
  
v1.2  
+ front: general improvements and refactoring  
+ front: i18n: strings configurable by json files  
+ front: i18n: polish lang support  
+ front: i18n: possible to change lang without page reload  
+ front: pointer cursor on all flag, and cross-hair on shoot grid  
  
v1.3  
- front: re-written & refactored js to TypeScript(compiled as ES6) (Chrome52+ tested)  
  
v1.x  
- back/front: info which ship sizes are already shot & which are still to shoot down  
- back/front: mini chat in game, between players  
  
v2.0  
- back/front: fleet-type is now game-level, not server-level  
- back/front: grid-size is now game-level, not server-level  
  
v2.1  
- back/front: able to set custom (game-level) fleet-type (sizes) & grid-size  

##protocol

→ `TO__ SERVER`  
← `FROM SERVER`  
  
← `HI_. <some_text>`  
  
→ `GAME NEW`  
→ `GAME <game_id>`  
← `GAME OK <game_id>`  
← `GAME FAIL no-such-game`  
← `GAME FAIL no-free-slot`  
← `400_ you-are-in-game`  
  
→ `GRID 0,1,0,1,1,1,0,1,0,1,0,1,1,0,0,0,0`  
← `GRID OK`  
← `GRID FAIL`  
← `400_ no-game-set`  
← `400_ game-in-progress`  
← `400_ grid-already-set`  
  
← `2PLA`  
← `TOUR START`  
← `TOUR YOU`  
← `TOUR HE`  
  
→ `SHOT [0,2]`  
← `YOU_ [HIT,0,2],[EMPTY,2,1],[EMPTY,2,2]`  
← `HE__ [EMPTY,2,7]`  
← `400_ no-game-set`  
← `400_ game-waiting`  
← `400_ not-your-tour`  
← `400_ bad-shoot`  
  
← `WON_ YOU`  
← `WON_ HE`  
  
← `1PLA game-interrupted`  
← `1PLA game-not-interrupted`  
  
← `STAT players=10,reserved=1`  
  
→ `PING <ping_msg>`  
← `PONG <ping_msg>`  
  
→ `<bad_command>`  
← `400_ unknown-command`  
