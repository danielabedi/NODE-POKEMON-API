const { Pokemon } = require('../db/sequelize')

module.exports = (app) => {
    app.post('/api/pokemons', (req, res) => {
        Pokemon.create(req.body)
          .then(pokemon => {
            const message = `le pokémon ${req.body.name} a bien été crée.` 
            res.json({ message, data: pokemon })
          })
          .catch(error => {
            const message = `La liste des pokémons n'a pas pu être ajouté. Réessayez dans quelques instants.`
            res.status(500).json({message, data: error})
          })
    })
}