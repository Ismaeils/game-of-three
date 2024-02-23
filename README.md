# Overview 
The purpose of this simple app is to simulate a game between clients connected via WebSockets.

## Description
This app follows a simple structure to enable several clients to make a WebSocket connection to the backend server.
![Simple system design diagram](docs/1.png?raw=true "Simple system design")

### Simple flow
![Simple flow diagram](docs/2.png?raw=true "Simple flow design")

## How to run this?

```bash
$ docker-compose up --build
```

## What's nice about this implementation
- More than two clients could connect to the server and they will be grouped in to pairs automatically
- MongoDB was chosen to laverage its flexibility given that there was not a rigid db design in hand and also because this is one of the cases where using Mongo makes sense because there is not that many relationships in data conceptually
- NestJS internal cache store was used to simulate using an external service like Redis; the intentional purpose was to include a caching service that would take off the load of the db and keep the interim changes via the socket to hit the caching layer first, and of course retrieving data comes from cache layer first

## What's not nice about this implementation
***but i had originally intended to do them***
- Error handling
- Proper unit and integration tests
- Player component could be more sophisticated and stored in DB as well, and that would be a good starting point to introduce functions like; restart game if the two players are present, make a leaderboard with scores for each player
- Implementation of the CacheService could be more clever (im using nestjs internal cache store). For example; add redis as an external service and actually manage all related socket interim-states in-memory and sync everything periodically
- Theoritically, this small app could be overengineered enough to make it into a microservice architecture with a MessageBroker to make this as asynchronous as possible



