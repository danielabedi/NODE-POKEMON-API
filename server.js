const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const {success, getUniqueId} = require('./helper')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000


app
  .use(favicon(__dirname + '/favicon.ico'))
  .use(morgan('dev'))

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
  const pokemoncreated = { ...req.body, ...{id: id, created: new Data()}}
  pokemons.push(pokemoncreated)
  const message = `le pokémon ${pokemoncreated.name} a bien été crée.`
  res.json(success(message, pokemoncreated))
})

app.listen(port, () => console.log(`notre application node est démarrée sur : http://localhost:${port}`))