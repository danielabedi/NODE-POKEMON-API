const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const { Sequelize, DataTypes } = require('sequelize')
const { success, getUniqueId } = require('./helper')
let pokemons = require('./src/db/mock-pokemon')
const PokemonModel = require('./src/models/pokemon')

const app = express()
const port = 3000

const sequelize = new Sequelize(
  'pokedex',
  'root',
  '',
  {
    host: 'localhost',
    dialect: 'mariadb',
    dialectoptions:{
      timezone: 'Etc/GMT-2'
    },
    logging: false
  }
)

sequelize.authenticate()
   .then(_ => console.log('la connexion a la base de données a été bien établie.'))
   .catch(error => console.error(`impossible de se connecte a la base de données ${error}`))

const Pokemon = PokemonModel(sequelize, DataTypes)

sequelize.sync({force: true})
   .then(_ => {
    console.log('la base de données "pokedex" a bien été synchronisée.')
    
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types.join()
      }).then(bulbizarre => console.log(bulbizarre.toJSON()))
    })
  })

app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))
  .use(bodyParser.json())

app.get('/', (req, res) => res.send('hello, express2 !'))

//on retourne la liste des pokémons au format json, avec un message :
app.get('/api/pokemons', (req, res) => {
    const message = 'la liste des pokémons a bien été réccupérée.'
    res.json(success(message, pokemons))
})

app.get('/api/pokemon/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'un pokémon a bien été trouvé.'
    res.json(success(message, pokemon))
})

app.post('/api/pokemons', (req, res) => {
  const id = getUniqueId(pokemons)
  const pokemoncreated = { ...req.body, ...{id: id, created: new Date()}}
  pokemons.push(pokemoncreated)
  const message = `le pokémon ${pokemoncreated.name} a bien été crée.`
  res.json(success(message, pokemoncreated))
})

app.put('/api/pokemon/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const pokemonUpdated = { ...req.body, id: id }
  pokemons = pokemons.map(pokemon => {
    return pokemon.id === id ? pokemonUpdated : pokemon
  })
  const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`
  res.json(success(message, pokemonUpdated))
})

app.delete('/api/pokemon/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
  pokemons.filter(pokemon => pokemon.id !== id)
  const message = `le pokémon ${pokemonDeleted.name} a bien été supprimé.`
  res.json(success(message, pokemonDeleted))
})
 

app.listen(port, () => console.log(`notre application node est démarrée sur : http://localhost:${port}`))