const axios = require('axios');
function cargartipodocumento() {

    axios.get('https://localhost:7058/api/TipoDocumentoes')
        .then(function (response) {
            // manejar respuesta exitosa
            let selecttipodoc = document.getElementById('tipodocumento')
            console.log(response);
            for (const datavalue of response.data) {
                let option = document.createElement("option")
                option.value = datavalue['idTipoDocumento']
                option.text = datavalue['tipoDocumento1']
                selecttipodoc.appendChild(option)
            }
        })
        .catch(function (error) {
            // manejar error
            console.log(error);
        })
        .then(function () {
            // siempre sera executado
        });
}
document.addEventListener('DOMContentLoaded', function () {

    cargartipodocumento()

    let btnnewtrabajador = document.getElementById('btnnuevotrabajador')
    btnnewtrabajador.addEventListener('click', () => {
        console.log("hola")
        axios.post('https://localhost:7058/api/Trabajadores', {
            "Nombre": document.getElementById('nombre').value,
            "ApellidoPaterno": document.getElementById('apellidopaterno').value,
            "ApellidoMaterno": document.getElementById('apellidomaterno').value,
            "RazonSocial": document.getElementById('razonsocial').value,
            "TipoDocumento": document.getElementById('tipodocumento').value,
            "NumeroDocumento": document.getElementById('documento').value,
            "Direccion": document.getElementById('direccion').value,
            "FechaNacimiento": document.getElementById('fecha').value,
            "CorreoElectronico": document.getElementById('correo').value
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        // window.location.href = "/Trabajadores/VerTrabajadores.html";
    })
    console.log("hola")
})






