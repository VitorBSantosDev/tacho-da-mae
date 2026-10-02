import { iniciarTema } from './tema.js';
import { carregarReceitas } from './api.js';
import { formatarTempo, limparTexto } from './utilitarias.js';
import { criarFavoritos } from './favoritos.js';

const listaReceitas = document.querySelector("#lista-receitas");
let receitas = [];
const filtroPesquisa = document.querySelector("#pesquisa");
const filtroCategoria = document.querySelector("#categoria");
const filtroOrdem = document.querySelector("#ordem");
const filtroResumo = document.querySelector("#resumo-filtro");
const favoritos = criarFavoritos();
const filtroFavorito = document.querySelector("#so-favoritas");

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
            <button class="favorito" type="button"></button>
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
    const botaoFavorito = cartao.querySelector(".favorito");

    categoriaReceita.textContent = receita.categoria;
    nomeReceita.textContent = receita.nome;
    tempoReceita.textContent = `⏱ ${formatarTempo(receita.tempo)}`
    imagemReceita.alt = receita.nome;

    const ehFavorito = favoritos.verificarSeEhFavorito(receita.id);

    botaoFavorito.textContent = ehFavorito ? "♥" : "♡";
    botaoFavorito.setAttribute("aria-label", ehFavorito ? "Tirar dos favoritos" : "Adicionar aos favoritos");

    botaoFavorito.addEventListener("click", () => {
        favoritos.adicionarOuRemover(receita.id);
        mostrarReceitas();
    })

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
    const receitasVisiveis = obterReceitasVisiveis();
    listaReceitas.innerHTML = "";

    if (receitasVisiveis.length === 0){
        listaReceitas.innerHTML = `<p class="mensagem">Nenhuma receita encontrada</p>`
    } else{
        for (const receita of receitasVisiveis){
            listaReceitas.appendChild(criarCartao(receita));
        }
    }
    mostrarResumoFiltro(receitasVisiveis);
}

function mostrarResumoFiltro(receitasVisiveis){
    const quantidade = receitasVisiveis.length;

    if (quantidade === 0){
        filtroResumo.textContent = "0 receitas";
        return;
    }

    const somaTempo = receitasVisiveis.reduce((soma, receita) => soma + receita.tempo, 0);
    const mediaTempo = formatarTempo(Math.round(somaTempo / quantidade));
    const palavraReceita = quantidade === 1 ? "receita" : "receitas";
    const palavraFavorito = favoritos.contarFavoritos() === 1 ? "favorita" : "favoritas"

    filtroResumo.textContent = `${quantidade} ${palavraReceita} · tempo médio ${mediaTempo} · ${favoritos.contarFavoritos()} ${palavraFavorito}`;
}

function obterReceitasVisiveis(){
    const valorPesquisa = limparTexto(filtroPesquisa.value);
    const valorCategoria = filtroCategoria.value;
    const valorOrdem = filtroOrdem.value;
    const valorFavorito = filtroFavorito.checked;

    const receitasFiltradas = receitas.filter(receita => {
        if (!limparTexto(receita.nome).includes(valorPesquisa)){
            return false;
        }
        if (valorCategoria !== "Todas" && receita.categoria !== valorCategoria){
            return false;
        }
        if (valorFavorito && !favoritos.verificarSeEhFavorito(receita.id)){
            return false;
        }
        
        return true;
    })

    const receitasFiltradasOrdenadas = [...receitasFiltradas];

    switch (valorOrdem){
        case "rapidas":
            receitasFiltradasOrdenadas.sort((receitaA, receitaB) => receitaA.tempo - receitaB.tempo)
            break;
        case "demoradas":
            receitasFiltradasOrdenadas.sort((receitaA, receitaB) => receitaB.tempo - receitaA.tempo)
            break;
        default:
            receitasFiltradasOrdenadas.sort((receitaA, receitaB) => receitaA.nome.localeCompare(receitaB.nome));
            break;
    }
    return receitasFiltradasOrdenadas;
}

filtroFavorito.addEventListener("change", mostrarReceitas);
filtroPesquisa.addEventListener("input", mostrarReceitas);
filtroCategoria.addEventListener("change", mostrarReceitas);
filtroOrdem.addEventListener("change", mostrarReceitas);

iniciarTema();
iniciarListaReceitas();