const { formatPrice } = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')


module.exports = {
    create(req, res) {
        // Pegar categprias
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

            if (req.body[key] == "") {
                return res.send("Please, fill all fields!")
            }
        }


        if (req.files.length == 0)
            return res.send('Please, send at least one image')




        let results = await Product.create(req.body)
        const productId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({ ...file, product_id: productId }))

        await Promise.all(filesPromise)

        const get = async () => {
            return Promise.reject('Oops"').catch(err => {
                throw new Error(err);
            })
        };

        get()
            .then(console.log)
            .catch(function (e) {
                console.log(e);
            });



        // results = await Category.all()
        // const categories = results.rows

        return res.redirect(`/products/${productId}/edit`)

    },

    show(req, res) {
        return res.render("products/show")
    },

    async edit(req, res) {
        let results = await Product.find(req.params.id)
        const product = results.rows[0]

        if (!product) return res.send("Product not found!")

        product.old_price = formatPrice(product.old_price)
        product.price = formatPrice(product.price)

        //get categoriess
        results = await Category.all()
        const categories = results.rows


        //get images

        results = await Product.files(product.id)
        let files = results.rows
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }))



        return res.render("products/edit.njk", { product, categories, files })

    },

    async put(req, res) {
        const keys = Object.keys(req.body)


        for (key of keys) {
            //requ.body.key == ""
            if (req.body[key] == "" && key != "removed_files") {
                return res.send("Please, fill all fields!")
            }
        }

        if (req.files.length != 0) {
            const newFilesPromise = req.files.map(file =>
                File.create({ ...file, product_id: req.body.id }))

            await Promise.all(newFilesPromise);
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removed_files.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))


            await Promise.all(removedFilesPromise)
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        if (req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)

            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)

        return res.redirect(`/products/${req.body.id}/edit`)


    },

    async delete(req, res) {
        await Product.delete(req.body.id)

        return res.redirect('/products/create')

    }
}
