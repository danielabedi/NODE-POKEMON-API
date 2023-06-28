const { Pokemon } = require('../db/sequelize')

module.exports = (app) => {
    app.post('/api/pokemons', (req, res) => {
        Pokemon.create(req.body)
          .then(pokemon => {
            const message = `le pokémon ${req.body.name} a bien été crée.` 
            res.json({ message, data: pokemon })
          })
    })
}