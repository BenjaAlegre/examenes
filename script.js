const API = 'https://bootcamp-2024-2d43236510d5.herokuapp.com'
let dataAlumnos;
let dataExamenes;
let dataPreguntas;

let alumnos;

const getPosts = async () => {
    try {
        const respAlum = await fetch(`${API}/alumnos`);
        const respExa = await fetch(`${API}/examenes`);
        const respResp = await fetch(`${API}/respuestas`);

        const promises = [respAlum, respExa, respResp];
        const promisesJson = promises.map(result => result.json());

        console.log(promisesJson);

        const datos = await Promise.all(promisesJson);

        console.log(datos);

        return datos;
    }
    catch (error) {
        console.log(error);
    }
}

const getData = async () =>
{
    try{
        let data = await getPosts();

        dataAlumnos = data[0];
        dataExamenes = data[1];
        dataPreguntas = data[2];

        sacarDatosAlumno();
        sacarDatosExamen(0);
    }
    catch(err){
        console.log(err);
    }
    

}

const sacarDatosExamen = (idAlumno) => {
    let respuestas = dataPreguntas.data.filter(respuesta => respuesta.idAlumno == alumnos[idAlumno].id);
    let examenesResp = corregirExamen(respuestas); 
    for (let i = 0; i < examenesResp.length; i++) {
        console.log("Puntaje:" + obtenerPuntaje(examenesResp[i]))
        
    }
   
}

const corregirExamen = (respuestas) => {

//let examenes = dataExamenes.data.filter(examenes => examenes.id == alumnos[idAlumno].id)
    let resultado;
    const misExamenes = []
    for (let i = 0; i < dataExamenes.data.length; i++) {
        const unExamen = []
        for (let j = 0; j < respuestas.length; j++) {
            
            if (dataExamenes.data[i].id  === respuestas[j].idExamen) {
                unExamen.push(respuestas[j]);
            }
            
        }
        misExamenes.push(unExamen);
    }
    return misExamenes;
}

const obtenerPuntaje = (examenResp) =>
{  
    const examen = dataExamenes.data.filter((examen) => examen.id == examenResp[0].idExamen);
    const valorDeUnPunto = 10/ examenResp.length;
    let puntaje = 0;
    console.log(valorDeUnPunto);
    for (let i = 0; i < examen[0].preguntas.length; i++) {
        console.log(examen[0].preguntas[i].id);
        console.log(examenResp[i].idPregunta);
        if(examen[0].preguntas[i].id == examenResp[i].idPregunta){
           
            for (let j = 0; j < examen[0].preguntas[i].opciones.length; j++) {
                const respuesta = examen[0].preguntas[i].opciones[j]
               
                if (respuesta.esCorrecta) {
                    if (respuesta.id == examenResp[i].idRespuesta){
                        puntaje += valorDeUnPunto;
                        console.log("biens");
                    } 
                }
            }
        }
        
    }
    return puntaje;
}


const sacarDatosAlumno = () => {

    alumnos = dataAlumnos.data.map(alumno => {
        return {
        id: alumno.id,
          nombre: alumno.nombre,
          apellido: alumno.apellido,
          edad: alumno.edad,
          respuestas: [],
          examen: []
        };
    })
    
    console.log(alumnos);
   
}

const cargarDatosExamen = () => {
    console.log(object);
}

getData();

const getPostPoke = async () => {
    try {
        //const n = 20;
        //const pokemonIds = Array.from({ length: n }, (_, i) => i + 1);
        //const pokemonPromises = pokemonIds.map(id => fetch(API + id).then(resp => resp.json()));

        const response = await fetch(`${API}?limit=${limit}&offset=${offset}`)

       // console.log(response);

        const data = await response.json();

        console.log(data);  

        const pokemonPromises = data.results.map(result => fetch(result.url).then(resp => resp.json()));
        
        console.log(pokemonPromises);

        const pokemons = await Promise.all(pokemonPromises);

        console.log(pokemons);

        mostrarPosts(pokemons);
    }
    catch(error){
        console.log(error);
    }
}


function mostrarPosts(posts) {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = ''; 

    let template = "";

    //const postElement = document.createElement('div');
   // postElement.classList.add('col-md-2', 'mb-2');

    posts.forEach(pokemon => {
        

        template += `<div class= "col-md-2 mb-2">
            <div class="card" >
                <div class="card-body">
                   
                    <h5 class="card-title">Nombre: ${pokemon.name}</h5>
                    <p class="card-text">ID: ${pokemon.id}</p>
                    <p class="card-text">Altura: ${pokemon.height}</p>

                </div>
            </div>
            </div>
        `;
        
    });
    postsContainer.innerHTML = template; 
    postsContainer.appendChild(postElement);

}

document.getElementById('prev').addEventListener('click', () => {
    if (offset >= limit) {
        offset -= limit;
        getPosts();
    } else {
        console.log("No hay nada antes");
    }
});

document.getElementById('next').addEventListener('click', () => {
    offset += limit;
    getPosts();
});
    
