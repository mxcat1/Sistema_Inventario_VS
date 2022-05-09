import * as gridjs from "gridjs";

const tablals = new gridjs.Grid({

    search: {
        enabled: true
    },
    columns: ['Pokemon', 'URL'],
    pagination: {
        enabled: true,
        limit: 15,
        server: {
            url: (prev, page, limit) => `${prev}?limit=${limit}&offset=${page * limit}`
        }
    },
    server: {
        url: 'https://pokeapi.co/api/v2/pokemon',
        then: data => data.results.map(pokemon => [
            pokemon.name, gridjs.html(`<a class="btn btn-primary" href='${pokemon.url}'>${pokemon.name}</a> <a class="btn btn-warning" href='../Registros/EditarRegistro.html'>Editar</a>`)
        ]),
        total: data => data.count
    }
}).render(document.getElementById("table1"));