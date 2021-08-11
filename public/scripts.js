const input = document.querySelector('input[name="price"]')
input.addEventListener("keydown", function (e) {


    setTimeout(function () {
        let { value } = e.target


        value = value.replace(/\D/g, "")

        /*Aplicar regra de moeda*/
        value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value / 100)

        e.target.value = value

    }, 1)
})