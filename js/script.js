const input = document.getElementById("input-busca");
const form = document.getElementById("busca");
let areas_por_jogo = {};
let select_jogos = document.getElementById("games");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("resultados").hidden = true;

    buscarPokemon();
})

input.addEventListener("input", (e) => {
    e.preventDefault();
    document.getElementById("resultados").hidden = true;

    buscarPokemon();
})

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function buscarPokemon() {
    try {
        const busca = input.value;
        document.getElementById("resultados").hidden = false;

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${busca}`);

        if(!response.ok){
            throw new Error("Pokémon não encontrado.");
        }

        const dados_pokemon = await response.json();

        //imagem pokemon
        const img_url = dados_pokemon.sprites.front_default;
        document.getElementById("img").src = img_url;

        //numero pokedex
        const num_pokedex = dados_pokemon.id;
        document.getElementById("num-pokedex").textContent = `Número na Pokédex: ${num_pokedex}`;

        //nome pokemon
        const nome = dados_pokemon.name;
        document.getElementById("nome").textContent = `Nome: ${capitalizeFirstLetter(nome)}`;

        //tipos pokemon
        const array_tipos = dados_pokemon.types;
        const nomesDosTipos = array_tipos.map(tipo => tipo.type.name);
        const tipos = nomesDosTipos.map(tipo => capitalizeFirstLetter(tipo)).join(", ");
        document.getElementById("tipos").textContent = `Tipos: ${tipos}`;

        //habilidades pokemon
        const array_habilidades = dados_pokemon.abilities;
        const nomeDasHabilidades = array_habilidades.map(habilidade => habilidade.ability.name);
        const habilidades = nomeDasHabilidades.map(tipo => capitalizeFirstLetter(tipo)).join(", ");
        document.getElementById("habilidades").textContent = `Habilidades: ${habilidades}`;

        //areas por jogo
        const response_encounters = await fetch(dados_pokemon.location_area_encounters);
        const dados_encounters = await response_encounters.json();

        const encontros_por_area = dados_encounters.map(indice => {
           const nome_areas = indice.location_area.name;

           const jogos = indice.version_details.map(detalhe => detalhe.version.name);

           return {
            area: nome_areas,
            jogos: jogos
           }
        });

        console.log(encontros_por_area);

        areas_por_jogo = encontros_por_area.reduce((acumulador, encontro) => {

            encontro.jogos.forEach(jogo => {

                if (!acumulador[jogo]) {
                    acumulador[jogo] = [];
                }

                acumulador[jogo].push(encontro.area);

            });

            return acumulador;

        }, {});

        select_jogos.innerHTML = "";
        
        Object.entries(areas_por_jogo).forEach(([chave, valor]) => {
            const option = document.createElement("option");
            option.value = chave;
            option.textContent = `pokémon ${chave}`;

            select_jogos.appendChild(option);
        });

    } catch (erro) {
        document.getElementById("erro").textContent = `Erro: ${erro.message}`;
    }
}

select_jogos.addEventListener("change", () => {
    const opcao = select_jogos.value;

    document.getElementById("encontros").textContent = `Encontros: ${areas_por_jogo[opcao].join(", ")}`;
});""