import * as gridjs from "gridjs";
import {esES} from "gridjs/l10n/dist/l10n";
import axios from "axios";
import swal from 'sweetalert';

const tablals = new gridjs.Grid({

    search: {
        enabled: true
    },
    columns: ['Nombre', 'Apellidos', 'Tipo de Documento', 'Nro de Documento', 'Acciones'],
    pagination: {
        enabled: true,
        limit: 8,
        server: {
            url: (prev, page, limit) => `${prev}?limit=${limit}&offset=${page * limit}`
        }
    },
    server: {
        url: 'https://localhost:7058/api/Cliente',
        then: data => data.map(clientes => [
            clientes.nombre, `${clientes.apellidoPaterno} ${clientes.apellidoMaterno}`, clientes.tipoDocumentoNavigation.tipoDocumento1, clientes.numeroDocumento,
            gridjs.html(`<button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modaleditcliente" data-bs-whatever="${clientes.idPersona}">Editar</button> <button type="button" onclick="eliminarcli(${clientes.idPersona})" class="btn btn-danger btn-eliminar" >Eliminar</button>`)
        ]),
        total: data => data.count
    },
    language: esES
}).render(document.getElementById("table1"));

document.addEventListener('DOMContentLoaded', function () {
    const modaleditar = document.getElementById('modaleditcliente')
    const btneditar = document.getElementById('btneditarcliente')
    modaleditar.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget
        // Extract info from data-bs-* attributes
        const recipient = button.getAttribute('data-bs-whatever')
        // If necessary, you could initiate an AJAX request here
        // and then do the updating in a callback.
        axios.get(`https://localhost:7058/api/Cliente/${recipient}`)
            .then(function (response) {
                // manejar respuesta exitosa
                console.log(response);
                let datospersona = response.data
                let fechanac = new Date(datospersona['fechaNacimiento']);
                const formatDate = (fechanac) => {
                    let dia,mes
                    if (fechanac.getDate() < 10) {
                        dia = 0 + fechanac.getDate().toString()
                    } else {
                        dia = fechanac.getDate()
                    }
                    if ((fechanac.getMonth()+1) < 10) {
                        mes = 0 + (fechanac.getMonth()+1).toString()
                    } else {
                        mes = fechanac.getMonth()+1
                    }
                    let formatted_date = fechanac.getFullYear() + "-" + mes + "-" + dia
                    return formatted_date;
                }

                document.getElementById('idpersona').value = recipient
                const modalTitle = modaleditar.querySelector('.modal-title')
                modalTitle.textContent = `Editar Cliente ${response.data['nombre']} ${response.data['apellidoPaterno']} ${response.data['apellidoMaterno']}`
                const nombretxtmodal = modaleditar.querySelector('#nombre')
                nombretxtmodal.value = datospersona['nombre']
                const apellidopatxtmodal = modaleditar.querySelector('#apellidopaterno')
                apellidopatxtmodal.value = datospersona['apellidoPaterno']
                const apellidomatxtmodal = modaleditar.querySelector('#apellidomaterno')
                apellidomatxtmodal.value = datospersona['apellidoMaterno']
                const razontxtmodal = modaleditar.querySelector('#razonsocial')
                razontxtmodal.value = datospersona['razonSocial']
                const tipodoctxtmodal = modaleditar.querySelector('#tipodocumento')
                tipodoctxtmodal.value = datospersona['tipoDocumento']
                const nrodoctxtmodal = modaleditar.querySelector('#documento')
                nrodoctxtmodal.value = datospersona['numeroDocumento']
                const directxtmodal = modaleditar.querySelector('#direccion')
                directxtmodal.value = datospersona['direccion']
                const fechanactxtmodal = modaleditar.querySelector('#fecha')
                fechanactxtmodal.value = formatDate(fechanac)
                console.log(formatDate(fechanac))
                const correotxtmodal = modaleditar.querySelector('#correo')
                correotxtmodal.value = datospersona['correoElectronico']
            })
            .catch(function (error) {
                // manejar error
                console.log(error);
            })
            .then(function () {
                // siempre sera executado
            });
        //
        // Update the modal's content.
        // const modalTitle = exampleModal.querySelector('.modal-title')
        // const modalBodyInput = exampleModal.querySelector('.modal-body input')
        //
        // modalTitle.textContent = `New message to ${recipient}`
        // modalBodyInput.value = recipient
    })
    btneditar.addEventListener("click", () => {
        swal({
            title: "Est?? seguro?",
            text: "Una vez Guardado todos los cambios, ??no podr?? recuperar los datos!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                let idpersona = document.getElementById('idpersona').value
                if (willDelete) {
                    axios.put(`https://localhost:7058/api/Cliente/${idpersona}`, {
                        "idPersona": idpersona,
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
                            window.location.href = "/Clientes/VerClientes.html"
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                } else {
                    swal("Se cancelaron todos lo cambios").then((value) => {
                        window.location.href = "/Clientes/VerClientes.html"
                    });
                }
            });
    })

})