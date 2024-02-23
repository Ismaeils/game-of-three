# Overview 
The purpose of this simple app is to simulate a game between clients connected via WebSockets.

## Description
This app follows a simple structure to enable several clients to make a WebSocket connection to the backend server. The game enters a state of recursive loop once a first move was drawn from either player. Their turns switch consecutively. See the demo GIF down below.

### Game events
- `player:ready` -> this will set the player as ready for playing and will place them into an empty game (if there is no incomplete game to pair them with), if there was an existing incomplete game, this event will pair them into that incomplete game and the game will be `READY` 
- `start:game` -> this can be trigerred by either available ready player, it can also be used by a lonely player who hasn't been paired with a second player yet and in that case, their first draw is the first move of the game and so the second player once `READY`, the game will resume automatically until someone wins. The starting player could have a starting number to start with as well, if there was no input for that event, the game will just generate a random initial number.

## How to run this?

```bash
$ docker-compose up --build
```

## What's nice about this implementation
- More than two clients could connect to the server and they will be grouped into pairs automatically
- MongoDB was chosen to laverage its flexibility given that there was not a rigid db design in hand and also because this is one of the cases where using Mongo makes sense because there is not that many relationships in data conceptually
- NestJS internal cache store was used to simulate using an external service like Redis; the intentional purpose was to include a caching service that would take off the load of the db and keep the interim changes via the socket to hit the caching layer first, and of course retrieving data comes from cache layer first

## What's not nice about this implementation
***but i had originally intended to do them***
- Error handling
- Proper unit and integration tests
- Player component could be more sophisticated and stored in DB as well, and that would be a good starting point to introduce functions like; restart game if the two players are present, make a leaderboard with scores for each player
- Implementation of the CacheService could be more clever (im using nestjs internal cache store). For example; add redis as an external service and actually manage all related socket interim-states in-memory and sync everything periodically
- Theoritically, this small app could be overengineered enough to make it into a microservice architecture with a MessageBroker to make this as asynchronous as possible

## Small Demo
![Simple flow diagram](docs/3.gif?raw=true)

## Simple diagrams
![Simple system design diagram](docs/1.png?raw=true "Simple system design")
![Simple flow diagram](docs/2.png?raw=true "Simple flow design")



