const axios = require('axios');
document.addEventListener('DOMContentLoaded', function () {

    let btnnewproducto = document.getElementById('btnnuevoproducto')
    btnnewproducto.addEventListener('click', () => {
        console.log("hola")
        axios.post('https://localhost:7058/api/Productoes', {
            "NombreProducto": document.getElementById('nombreproducto').value,
            "DescripcionProducto": document.getElementById('descripcionproducto').value,
            "Precio": document.getElementById('precioproducto').value,
        })
            .then(function (response) {
                console.log(response);
                window.location.href = "/Productos/VerProductos.html"
            })
            .catch(function (error) {
                console.log(error);
            });
        // window.location.href = "/Trabajadores/VerTrabajadores.html";
    })
    console.log("hola")
})






