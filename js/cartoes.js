import { formatarTempo, identificarIngredientesEmFalta, verificarTemIngredientesBase, preencherLista } from "./utilitarias.js";

export function criarCartao(receita, opcoes){
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
            <p class="cartao-despensa" hidden></p>
            <h4>Ingredientes</h4>
            <ul class="cartao-ingredientes"></ul>
            <button class="ver-preparacao" type="button">Ver preparação (${receita.preparacao.length} passos)</button>
            <button class="remover" type="button">Remover receita</button>
        </div>`;

    const categoriaReceita = cartao.querySelector(".cartao-categoria");
    const nomeReceita = cartao.querySelector(".cartao-nome");
    const tempoReceita = cartao.querySelector(".cartao-tempo");
    const imagemReceita = cartao.querySelector("img");
    const botaoFavorito = cartao.querySelector(".favorito");
    const etiquetaDespensa = cartao.querySelector(".cartao-despensa");
    const listaIngredientes = cartao.querySelector(".cartao-ingredientes");
    const botaoRemoverReceita = cartao.querySelector(".remover");
    const botaoPreparacao = cartao.querySelector(".ver-preparacao");

    categoriaReceita.textContent = receita.categoria;
    nomeReceita.textContent = receita.nome;
    tempoReceita.textContent = `⏱ ${formatarTempo(receita.tempo)}`;
    imagemReceita.alt = receita.nome;

    prepararBotaoFavorito(botaoFavorito, opcoes.eFavorito, opcoes.aoClicarFavorito);
    preencherEtiquetaDespensa(etiquetaDespensa, receita, opcoes.ingredientesDespensa);
    preencherLista(listaIngredientes, receita.ingredientes);

    botaoRemoverReceita.addEventListener("click", opcoes.aoClicarRemover);
    botaoPreparacao.addEventListener("click", opcoes.aoClicarPreparacao);

    return cartao;
}

function prepararBotaoFavorito(botao, eFavorito, aoClicar){
    botao.textContent = eFavorito ? "♥" : "♡";
    botao.setAttribute("aria-label", eFavorito ? "Tirar dos favoritos" : "Adicionar aos favoritos");
    botao.addEventListener("click", aoClicar);
}

function preencherEtiquetaDespensa(etiqueta, receita, ingredientesDespensa){
    if (ingredientesDespensa.length === 0 || !verificarTemIngredientesBase(receita)){
        return;
    }

    const emFalta = identificarIngredientesEmFalta(receita, ingredientesDespensa);

    if (emFalta.length === 0){
        etiqueta.textContent = "✓ Tem tudo o que precisa";
        etiqueta.classList.add("cartao-despensa-ok");
    } else {
        etiqueta.textContent = `Falta: ${emFalta.join(", ")}`;
        etiqueta.classList.add("cartao-despensa-falta");
    }

    etiqueta.hidden = false;
}
