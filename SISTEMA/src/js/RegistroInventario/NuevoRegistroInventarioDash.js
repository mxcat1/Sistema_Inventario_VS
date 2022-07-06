import * as gridjs from "gridjs";
import {esES} from "gridjs/l10n/dist/l10n";
import swal from 'sweetalert';

const axios = require('axios');

function cargarClientes() {

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

function cargaridmax() {

    axios.get('https://localhost:7058/api/RegistrosInventarios/getid')
        .then(function (response) {
            // manejar respuesta exitosa
            let txtidregistro = document.getElementById('registro')
            txtidregistro.value = response.data + 1
        })
        .catch(function (error) {
            // manejar error
            console.log(error);
        })
        .then(function () {
            // siempre sera executado
        });
}

function cargariddetallemax() {
    axios.get('https://localhost:7058/api/DetalleRegistroes/getidmax')
        .then(function (response) {
            // manejar respuesta exitosa
            let txtiddetalle = document.getElementById('detalle')
            txtiddetalle.value = response.data + 1

        })
        .catch(function (error) {
            // manejar error
            console.log(error);
        })
        .then(function () {
            // siempre sera executado
        });
}

function cargarProductos() {

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

document.addEventListener('DOMContentLoaded', function () {
    localStorage.clear();
    cargarClientes()
    cargaridmax()
    cargariddetallemax()
    cargarProductos()
    const tabladetalle = new gridjs.Grid({

        search: {
            enabled: true
        },
        columns: ['Codigo Registro', 'Codigo Producto', 'Cantidad', 'Precio Total'],
        pagination: {
            enabled: true,
            limit: 200,
        },
        data: [],
        language: esES
    }).render(document.getElementById("tabledetelles"));

    const btncrearregistro = document.getElementById('crearregistro')
    const btncreardetalle = document.getElementById('crearregistrodetalle')
    const btnguardare = document.getElementById('guardarregistro')
    const detalleregistro = document.querySelector('.detalle')
    const cbproducto = document.getElementById('producto')
    const nbcantidad = document.getElementById('cantidad')
    const precio = document.getElementById('precio')
    const registroid = document.getElementById('registro')
    let detalleid = document.getElementById('detalle')
    let registrodata
    btncrearregistro.addEventListener('click', () => {
        let txtnotasregistro = document.getElementById('notas')
        let cliente = document.getElementById('cliente')
        localStorage.setItem('registro', JSON.stringify({
            'idRegistroInventario': registroid.value,
            'notas': txtnotasregistro.value,
            'personaRol': cliente.value,
            'fecha': new Date().toISOString(),
            'precioTotal': 0
        }))
        detalleregistro.classList.remove('detalle-registro-none')
        registrodata = JSON.parse(localStorage.getItem('registro'))
        registrodata.detalleRegistros = []
        // console.log(registrodata, detalleid.value)
        // localStorage.setItem('registro', JSON.stringify(registrodata))
    })
    btncreardetalle.addEventListener('click', () => {
        let producto = document.getElementById('producto')
        let cantidad = document.getElementById('cantidad')

        let idregistro = document.getElementById('registro')
        let iddetalle = document.getElementById('detalle')

        registrodata.detalleRegistros.push({
            "idDetalleRegistro": iddetalle.value,
            "registro": idregistro.value,
            "producto": producto.value,
            "pesoDetalleRegistro": 0,
            "cantidad": cantidad.value,
            "precioTotal": precio.value,
        })
        registrodata.precioTotal=parseFloat(registrodata.precioTotal)+parseFloat(precio.value)
        console.log(registrodata)
        localStorage.setItem('registro', JSON.stringify(registrodata))
        let datare = registrodata.detalleRegistros.map(detallereg => [detallereg.idDetalleRegistro, detallereg.producto, detallereg.cantidad, detallereg.precioTotal])
        tabladetalle.updateConfig({
            data: datare
        }).forceRender()
        iddetalle.value = parseInt(iddetalle.value) + 1

    })
    btnguardare.addEventListener('click',()=>{
        swal({
            title: "Está seguro?",
            text: "Una vez Guardado todos los cambios, ¡no podrá recuperar los datos!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    axios.post(`https://localhost:7058/api/RegistrosInventarios`, registrodata)
                        .then(function (response) {
                            console.log(response);
                            // window.location.href = "Registros/ListaRegistro.html"
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                } else {
                    swal("Se cancelaron todos lo cambios").then((value) => {
                        window.location.href = "Registros/ListaRegistro.html"
                    });
                }
            });
    })
    cbproducto.addEventListener('change', (e) => {
        let txtcantidad = document.getElementById('cantidad')
        let txtprecio = document.getElementById('precio')
        console.log('hola', e.target.value)
        axios.get(`https://localhost:7058/api/Productoes/${e.target.value}`)
            .then(function (response) {
                // manejar respuesta exitosa
                txtprecio.value = txtcantidad.value * response.data['precio']
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
        axios.get(`https://localhost:7058/api/Productoes/${sbproducto.value}`)
            .then(function (response) {
                // manejar respuesta exitosa
                txtprecio.value = e.target.value * response.data['precio']
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