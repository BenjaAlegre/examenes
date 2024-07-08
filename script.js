const API = 'https://bootcamp-2024-2d43236510d5.herokuapp.com/'


const getPosts = async () => {
    try {
        

        const response = await fetch(`${API}?limit=${limit}&offset=${offset}`)

        console.log(response);

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
    
getPosts();