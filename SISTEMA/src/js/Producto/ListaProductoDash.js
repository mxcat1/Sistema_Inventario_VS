import * as gridjs from "gridjs";
import {esES} from "gridjs/l10n/dist/l10n";
import axios from "axios";
import swal from 'sweetalert';

const tablals = new gridjs.Grid({

    search: {
        enabled: true
    },
    columns: ['Nombre Producto', 'Descripcion del Producto', 'Precio', 'Acciones'],
    pagination: {
        enabled: true,
        limit: 8,
        server: {
            url: (prev, page, limit) => `${prev}?limit=${limit}&offset=${page * limit}`
        }
    },
    server: {
        url: 'https://localhost:7058/api/Productoes',
        then: data => data.map(productos => [
            productos.nombreProducto, productos.descripcionProducto, `S/. ${productos.precio}`,
            gridjs.html(`<button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modaleditproducto" data-bs-whatever="${productos.idProducto}">Editar</button> <button type="button" onclick="eliminarpro(${productos.idProducto})" class="btn btn-danger btn-eliminar" >Eliminar</button>`)
        ]),
        total: data => data.count
    },
    language: esES
}).render(document.getElementById("table1"));

document.addEventListener('DOMContentLoaded', function () {
    const modaleditar = document.getElementById('modaleditproducto')
    const btneditar = document.getElementById('btneditarproducto')
    modaleditar.addEventListener('show.bs.modal', event => {
        // Button that triggered the modal
        const button = event.relatedTarget
        // Extract info from data-bs-* attributes
        const recipient = button.getAttribute('data-bs-whatever')
        // If necessary, you could initiate an AJAX request here
        // and then do the updating in a callback.
        axios.get(`https://localhost:7058/api/Productoes/${recipient}`)
            .then(function (response) {
                // manejar respuesta exitosa
                console.log(response);
                let datospersona = response.data

                document.getElementById('idproducto').value = recipient
                const modalTitle = modaleditar.querySelector('.modal-title')
                modalTitle.textContent = `Editar Producto ${response.data['nombreProducto']}`
                const nombreProductotxtmodal = modaleditar.querySelector('#nombreproducto')
                nombreProductotxtmodal.value = datospersona['nombreProducto']
                const descripProductotxtmodal = modaleditar.querySelector('#descripcionproducto')
                descripProductotxtmodal.value = datospersona['descripcionProducto']
                const precioProductotxtmodal = modaleditar.querySelector('#precioproducto')
                precioProductotxtmodal.value = datospersona['precio']
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
            title: "Está seguro?",
            text: "Una vez Guardado todos los cambios, ¡no podrá recuperar los datos!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                let idproducto = document.getElementById('idproducto').value
                if (willDelete) {
                    axios.put(`https://localhost:7058/api/Productoes/${idproducto}`, {
                        "idProducto": idproducto,
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
                } else {
                    swal("Se cancelaron todos lo cambios").then((value) => {
                        window.location.href = "/Productos/VerProductos.html"
                    });
                }
            });
    })

})