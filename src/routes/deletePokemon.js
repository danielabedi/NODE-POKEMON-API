const { Pokemon } = require('../db/sequelize')
const pokemon = require('../models/pokemon.js')

module.exports = (app) => {
    app.delete('/api/pokemons/:id', (req, res) => {
        Pokemon.findByPk(req.params.id).then(pokemon => {
            if(pokemon === null) {
                const message = `le pokémon demandé n'existe pas. Réessayez avec un autre idendifiant`
                return res.status(404).json(message)
            }

            const pokemonDeleted = pokemon;
            return Pokemon.destroy({
                        where: { id: pokemon.id }
                   })
                   .then(_ => {
                        const message = `le pokémon avec l'identifiant n°${pokemonDeleted.id} a bien été supprimé.`
                        res.json({message, data: pokemonDeleted })
                   })
        })
        .catch(error => {
            const message = `La liste des pokémons n'a pas pu être supprimé. Réessayez dans quelques instants.`
            res.status(500).json({message, data: error})
          })
    })
}