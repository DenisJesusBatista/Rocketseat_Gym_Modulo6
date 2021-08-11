const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports = {
    create(req, res) {
        // Pegar categproas
        Category.all()
            .then(function (results) {

                const categories = results.rows

                return res.render("products/create.njk", { categories })

            }).catch(function (err) {
                throw new Error(err)
            })

        // return res.render("products/create.njk")

    },

    async post(req, res) {
        //Logica de salvar
        const keys = Object.keys(req.body)


        for (key of keys) {
            //requ.body.key == ""
            if (req.body[key] == "") {
                return res.send("Please, fill all fields!")
            }
        }

        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        results = await Category.all()
        const categories = results.rows

        return res.render("products/create.njk", { productId, categories })

    }
}