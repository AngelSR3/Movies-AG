const CLAVE_API = 'd36a9448af2572539b431a295be6f50f';
const URL_BASE = 'https://api.themoviedb.org/3';
let paginaActual = 1;

document.getElementById('populares').addEventListener('click', () => {
    obtenerPeliculas('popular');
});

document.getElementById('mejor-valoradas').addEventListener('click', () => {
    obtenerPeliculas('top_rated');
});

document.getElementById('proximos-estrenos').addEventListener('click', () => {
    obtenerPeliculas('upcoming');
});

document.getElementById('cartelera').addEventListener('click', () => {
    obtenerPeliculas('now_playing');
});

document.getElementById('anterior').addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        obtenerPeliculas(currentCategory);
    }
});

document.getElementById('siguiente').addEventListener('click', () => {
    paginaActual++;
    obtenerPeliculas(currentCategory);
});

let currentCategory = 'popular';

async function consultarApi(endpoint, params = {}) {
    const url = new URL(`${URL_BASE}${endpoint}`);
    url.search = new URLSearchParams({ api_key: CLAVE_API, page: paginaActual, ...params }).toString();
    
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) {
            throw new Error(`Error en la solicitud: ${respuesta.statusText}`);
        }
        return await respuesta.json();
    } catch (error) {
        console.error('Error al realizar la consulta:', error.message);
        return null;
    }
}

async function obtenerPeliculas(categoria) {
    currentCategory = categoria;
    const datos = await consultarApi(`/movie/${categoria}`);
    mostrarPeliculas(datos.results);
}

function mostrarPeliculas(peliculas) {
    const contenedor = document.getElementById('contenedor-peliculas');
    contenedor.innerHTML = '';
    peliculas.forEach(pelicula => {
        const div = document.createElement('div');
        div.className = 'pelicula';
        div.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${pelicula.poster_path}" alt="${pelicula.title}">
            <h3>${pelicula.title}</h3>
            <p>Rating: ${pelicula.vote_average}</p>
        `;
        contenedor.appendChild(div);
    });
}

obtenerPeliculas(currentCategory);