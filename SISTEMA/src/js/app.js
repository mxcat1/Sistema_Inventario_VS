import * as bootstrap from 'bootstrap/dist/js/bootstrap'
import * as Chart from 'chart.js/dist/chart';
import * as gridjs from "gridjs";
// Importando css
import "gridjs/dist/theme/mermaid.css";
// Importando modulos
import './graficos'
//Codigo base



new gridjs.Grid({

    search: {
        enabled: true
    },
    columns: ['Pokemon', 'URL'],
    pagination: {
        enabled: true,
        limit: 5,
        server: {
            url: (prev, page, limit) => `${prev}?limit=${limit}&offset=${page * limit}`
        }
    },
    server: {
        url: 'https://pokeapi.co/api/v2/pokemon',
        then: data => data.results.map(pokemon => [
            pokemon.name, gridjs.html(`<a class="btn btn-primary" href='${pokemon.url}'>Link to ${pokemon.name}</a>`)
        ]),
        total: data => data.count
    }
}).render(document.getElementById("table1"));
