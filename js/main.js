import { iniciarTema } from './tema.js';
import { carregarReceitas } from './api.js';

const listaReceitas = document.querySelector("#lista-receitas");
let receitas = [];

async function iniciarListaReceitas(){
    listaReceitas.innerHTML = `<p class="mensagem">A carregar receitas...</p>`

    try {
        receitas = await carregarReceitas()
        console.log(receitas);
        mostrarReceitas()
    } catch (erro) {
        listaReceitas.innerHTML = `<p class="mensagem mensagem-erro">Erro. ${erro.message}. Tente novamente mais tarde.</p>`
        
    }
}

function criarCartao(receita){
    const cartao = document.createElement("article");
    cartao.className = "cartao";
    cartao.innerHTML = `
        <div class="cartao-foto">
            <img src="${receita.imagem}">
        </div>
        <div class="cartao-corpo">
            <p class="cartao-categoria"></p>
            <h3 class="cartao-nome"></h3>
            <p class="cartao-tempo"></p>
            <h4>Ingredientes</h4>
            <ul class="cartao-ingredientes"></ul>
            <details>
                <summary>Modo de preparação (${receita.preparacao.length} passos)</summary>
                <ol class="cartao-passos"></ol>
            </details>
        </div>`
    const categoriaReceita = cartao.querySelector(".cartao-categoria");
    const nomeReceita = cartao.querySelector(".cartao-nome");
    const tempoReceita = cartao.querySelector(".cartao-tempo");
    const imagemReceita = cartao.querySelector("img");

    categoriaReceita.textContent = receita.categoria;
    nomeReceita.textContent = receita.nome;
    tempoReceita.textContent = `${receita.tempo} min`;
    imagemReceita.alt = receita.nome;

    const listaIngredientes = cartao.querySelector(".cartao-ingredientes");

    receita.ingredientes.forEach(ingrediente => {
        const ingredienteLi = document.createElement("li");
        ingredienteLi.textContent = ingrediente;
        listaIngredientes.appendChild(ingredienteLi);
    });

    const listaPassos = cartao.querySelector(".cartao-passos");

    receita.preparacao.forEach(passo => {
        const passoLi = document.createElement("li");
        passoLi.textContent = passo;
        listaPassos.appendChild(passoLi);       
    })
    return cartao;
}

function mostrarReceitas(){
    listaReceitas.innerHTML = "";

    if (receitas.length === 0){
        listaReceitas.innerHTML = `<p class="mensagem">Nenhuma receita encontrada</p>`
    } else{
        for (const receita of receitas){
            listaReceitas.appendChild(criarCartao(receita));
        }
    }
}

iniciarTema();
iniciarListaReceitas();