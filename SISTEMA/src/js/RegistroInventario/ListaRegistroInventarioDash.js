import * as gridjs from "gridjs";
import {esES} from "gridjs/l10n/dist/l10n";
import axios from "axios";
import swal from 'sweetalert';
import moment from "moment";

function cargarClientesedit() {

    axios.get('https://localhost:7058/api/Cliente')
        .then(function (response) {
            // manejar respuesta exitosa
            let selecttipodoc = document.getElementById('cliente')
            for (const datavalue of response.data) {
                let option = document.createElement("option")
                option.value = datavalue['personasRoles'][0]['idPersonaRol']
                option.text = `${datavalue['nombre']} ${datavalue['apellidoPaterno']} ${datavalue['apellidoMaterno']}`
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

function cargarProductosparaedit() {

    axios.get('https://localhost:7058/api/Productoes')
        .then(function (response) {
            // manejar respuesta exitosa
            let selectproducto = document.getElementById('producto')
            for (const datavalue of response.data) {
                let option = document.createElement("option")
                option.value = datavalue['idProducto']
                option.text = `${datavalue['nombreProducto']} Precio: S/.${datavalue['precio']}`
                selectproducto.appendChild(option)
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

const tablaregistros = new gridjs.Grid({

    search: {
        enabled: true
    },
    columns: ['Fecha', 'Cliente', 'Notas', 'Precio Total', 'Acciones'],
    pagination: {
        enabled: true,
        limit: 8,
        server: {
            url: (prev, page, limit) => `${prev}?limit=${limit}&offset=${page * limit}`
        }
    },
    server: {
        url: 'https://localhost:7058/api/RegistrosInventarios',
        then: data => data.map(registros => [
            moment(registros.fecha).format('YYYY-MM-DD'), `${registros.personaRolNavigation.personaNavigation.nombre} ${registros.personaRolNavigation.personaNavigation.apellidoPaterno} ${registros.personaRolNavigation.personaNavigation.apellidoMaterno}`, registros.notas, `S/. ${registros.precioTotal}`,
            gridjs.html(`<button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modaltablaDetalleRegistros" data-bs-whatever="${registros.idRegistroInventario}">Editar</button> <button type="button" onclick="eliminarregistro(${registros.idRegistroInventario})" class="btn btn-danger btn-eliminar" >Eliminar</button>`)
        ]),
        total: data => data.count
    },
    language: esES
}).render(document.getElementById("tableregistros"));

document.addEventListener('DOMContentLoaded', function () {
    cargarProductosparaedit()
    cargarClientesedit()
    localStorage.clear()
    const btnsaveregistro = document.getElementById('btnsaveregistro')
    const btnsavedetregistro = document.getElementById('btnsavedetregistro')
    const modaltabledet = document.getElementById('modaltablaDetalleRegistros')
    const modaleditdet = document.getElementById('modalEditDetalleRegistro')
    const idregistro = document.getElementById('registro')
    let txtnotasregistro = document.getElementById('notas')
    let cliente = document.getElementById('cliente')
    let fecha = document.getElementById('fecha')
    let precioregistro = document.getElementById('precioregistro')
    const cbproducto = document.getElementById('producto')
    const nbcantidad = document.getElementById('cantidad')
    let precio = document.getElementById('precio')
    let detalleid = document.getElementById('detalle')
    const tabladetalles = new gridjs.Grid({
        search: {
            enabled: true
        },
        columns: ['Codigo Detalle', 'Codigo Registro', 'Producto', 'Cantidad', 'Precio Total', 'Acciones'],
        data: [
            ['', '', '', '', '', ''],
        ],
        language: esES
    }).render(document.getElementById("tablaDetalleRegistro"));

    modaltabledet.addEventListener('shown.bs.modal', event => {
        const button = event.relatedTarget
        // Extract info from data-bs-* attributes
        const recipient = button.getAttribute('data-bs-whatever')

        axios.get(`https://localhost:7058/api/RegistrosInventarios/${recipient}`)
            .then(function (response) {
                // manejar respuesta exitosa
                idregistro.value = response.data['idRegistroInventario']
                txtnotasregistro.value = response.data['notas']
                fecha.value = moment(response.data['fecha']).format('YYYY-MM-DD')
                cliente.value = response.data['personaRol']
                precioregistro.value = response.data['precioTotal']
                localStorage.setItem('preciototalRegistro', response.data['precioTotal'])
                localStorage.setItem('preciototalDetalleRegistro', '0')
                console.log(response.data['precioTotal'])
            })
            .catch(function (error) {
                // manejar error
                console.log(error);
            })
            .then(function () {
                // siempre sera executado
            });

        tabladetalles.updateConfig({
            pagination: {
                enabled: true,
                limit: 4,
                server: {
                    url: (prev, page, limit) => `${prev}?limit=${limit}&offset=${page * limit}`
                }
            },
            server: {
                url: `https://localhost:7058/api/DetalleRegistroes/getDetalleregistro/${recipient}`,
                then: data => data.map(registrosdet => [
                    registrosdet.idDetalleRegistro, registrosdet.registro, registrosdet.productoNavigation.nombreProducto, registrosdet.cantidad, `S/. ${registrosdet.precioTotal}`,
                    gridjs.html(`<button type="button" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalEditDetalleRegistro" data-bs-whatever="${registrosdet.idDetalleRegistro}">Editar</button> <button type="button" onclick="eliminarregistrodetalle(${registrosdet.idDetalleRegistro})" class="btn btn-danger btn-eliminar" >Eliminar</button>`)
                ]),
                total: data => data.count
            },
        }).forceRender()
    })
    modaleditdet.addEventListener('shown.bs.modal', event => {
        const button = event.relatedTarget
        // Extract info from data-bs-* attributes
        const recipient = button.getAttribute('data-bs-whatever')
        axios.get(`https://localhost:7058/api/DetalleRegistroes/${recipient}`)
            .then(function (response) {
                // manejar respuesta exitosa
                detalleid.value = recipient
                cbproducto.value = response.data['producto']
                nbcantidad.value = response.data['cantidad']
                precio.value = response.data['precioTotal']
                console.log(response.data['precioTotal'])
            })
            .catch(function (error) {
                // manejar error
                console.log(error);
            })
            .then(function () {
                // siempre sera executado
            });
    })
    btnsaveregistro.addEventListener('click', event => {
        swal({
            title: "Está seguro?",
            text: "Una vez Guardado todos los cambios, ¡no podrá recuperar los datos!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.put(`https://localhost:7058/api/RegistrosInventarios/${idregistro.value}`, {
                        'idRegistroInventario': idregistro.value,
                        'notas': txtnotasregistro.value,
                        'personaRol': cliente.value,
                        'fecha': fecha.value,
                        'precioTotal': precioregistro.value
                    })
                        .then(function (response) {
                            console.log(response);
                            window.location.href = "ListaRegistro.html"
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                } else {
                    swal("Se cancelaron todos lo cambios").then((value) => {
                        window.location.href = "ListaRegistro.html"
                    });
                }
            });
    })
    btnsavedetregistro.addEventListener('click', event => {
        const iddetalleregistro = document.getElementById('detalle')
        let actualizarprecio = `https://localhost:7058/api/RegistrosInventarios/${idregistro.value}`
        let actualizardetalleregistro = `https://localhost:7058/api/DetalleRegistroes/${iddetalleregistro.value}`
        let dataregistro = {
            'idRegistroInventario': idregistro.value,
            'notas': txtnotasregistro.value,
            'personaRol': cliente.value,
            'fecha': fecha.value,
            'precioTotal': precioregistro.value
        }
        let datadetalleregistro = {
            'idDetalleRegistro': iddetalleregistro.value,
            'registro': idregistro.value,
            'producto': cbproducto.value,
            'pesoDetalleRegistro': 0,
            'cantidad': nbcantidad.value,
            'precioTotal': precio.value
        }
        let llamadaeditregistro = axios.put(actualizarprecio, dataregistro)
        let llamadaeditdetalleregistro = axios.put(actualizardetalleregistro, datadetalleregistro)
        swal({
            title: "Está seguro?",
            text: "Una vez Guardado todos los cambios, ¡no podrá recuperar los datos!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.all([llamadaeditregistro, llamadaeditdetalleregistro])
                        .then(axios.spread((...responses) => {
                                const responseOne = responses[0];
                                const responseTwo = responses[1];

                                console.log(responseOne, responseTwo)
                                window.location.href = "ListaRegistro.html"
                            })
                        ).catch(errors => {
                        console.error(errors)
                    })
                } else {
                    swal("Se cancelaron todos lo cambios").then((value) => {
                        window.location.href = "ListaRegistro.html"
                    });
                }
            });
    })
    cbproducto.addEventListener('change', (e) => {
        let txtcantidad = document.getElementById('cantidad')
        let txtprecio = document.getElementById('precio')
        localStorage.setItem('preciototalDetalleRegistro', txtprecio.value)
        console.log('hola', e.target.value)
        axios.get(`https://localhost:7058/api/Productoes/${e.target.value}`)
            .then(function (response) {
                // manejar respuesta exitosa
                txtprecio.value = txtcantidad.value * response.data['precio']
                let anteriorprecio = localStorage.getItem('preciototalDetalleRegistro')
                precioregistro.value = (parseFloat(precioregistro.value) - parseFloat(anteriorprecio)) + parseFloat(txtprecio.value)
                console.log(response.data['precio'])

            })
            .catch(function (error) {
                // manejar error
                console.log(error);
            })
            .then(function () {
                // siempre sera executado
            });
    })
    nbcantidad.addEventListener('change', (e) => {
        let txtprecio = document.getElementById('precio')
        let sbproducto = document.getElementById('producto')
        localStorage.setItem('preciototalDetalleRegistro', txtprecio.value)
        axios.get(`https://localhost:7058/api/Productoes/${sbproducto.value}`)
            .then(function (response) {
                // manejar respuesta exitosa
                txtprecio.value = e.target.value * response.data['precio']
                let anteriorprecio = localStorage.getItem('preciototalDetalleRegistro')
                precioregistro.value = (parseFloat(precioregistro.value) - parseFloat(anteriorprecio)) + parseFloat(txtprecio.value)
                console.log(response.data['precio'])
            })
            .catch(function (error) {
                // manejar error
                console.log(error);
            })
            .then(function () {
                // siempre sera executado
            });
    })

})