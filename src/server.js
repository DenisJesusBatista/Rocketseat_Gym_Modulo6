const express = require('express')
const nunjucks = require('nunjucks')
const routes = require("./routes")
const methodOverride = require("method-override")


/*Chamar a função pra dentro do servidor*/

const server = express();

server.use(express.urlencoded({ extended: true }))

/*Usando arquivos staticos*/
server.use(express.static('public'));

server.use(methodOverride("_method"))

server.use(routes);


server.set("view engine", "njk");

nunjucks.configure("src/app/views", {
    express: server,
    autoescape: false,
    noCache: true
});


/*Iniciar o servidor*/
server.listen(5000, function () {
    console.log("server is running")

});