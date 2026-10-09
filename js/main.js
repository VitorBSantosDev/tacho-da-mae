import { iniciarTema } from './tema.js';
import { carregarReceitas } from './api.js';
import { criarFavoritos } from './favoritos.js';
import { criarGestorReceitas } from './receitas.js';
import { filtrarEOrdenarReceitas } from './filtros.js';
import { criarCartao } from './cartoes.js';
import { abrirPreparacao, pedirConfirmacaoRemover, iniciarModais } from './modais.js';
import { iniciarFormulario } from './formulario.js';
import { iniciarCopiaSeguranca } from './copiaSeguranca.js';
import { formatarTempo, limparTexto, lerArmazenamento, guardarArmazenamento, converterTextoDespensa } from './utilitarias.js';

const CHAVE_DESPENSA = "tacho-despensa";

const listaReceitas = document.querySelector("#lista-receitas");
const filtroPesquisa = document.querySelector("#pesquisa");
const filtroCategoria = document.querySelector("#categoria");
const filtroOrdem = document.querySelector("#ordem");
const filtroFavorito = document.querySelector("#so-favoritas");
const filtroDespensa = document.querySelector("#despensa");
const filtroReceitasPossiveis = document.querySelector("#so-ingredientes-despensa");
const elementoResumo = document.querySelector("#resumo-filtro");
const botaoReporRemovidas = document.querySelector("#repor-removidas");

const favoritos = criarFavoritos();
const gestorReceitas = criarGestorReceitas();

async function iniciarListaReceitas(){
    listaReceitas.innerHTML = `<p class="mensagem">A carregar receitas...</p>`;

    try {
        gestorReceitas.definirReceitasBase(await carregarReceitas());
        mostrarReceitas();
    } catch (erro) {
        listaReceitas.innerHTML = `<p class="mensagem mensagem-erro">Erro. ${erro.message}. Tente novamente mais tarde.</p>`;
    }
}

function lerCriteriosFiltro(){
    return {
        pesquisa: limparTexto(filtroPesquisa.value),
        categoria: filtroCategoria.value,
        ordem: filtroOrdem.value,
        apenasFavoritas: filtroFavorito.checked,
        apenasPossiveis: filtroReceitasPossiveis.checked,
        ingredientesDespensa: converterTextoDespensa(filtroDespensa.value),
        verificarSeEFavorito: favoritos.verificarSeEFavorito
    };
}

function mostrarReceitas(){
    const criterios = lerCriteriosFiltro();
    const receitasVisiveis = filtrarEOrdenarReceitas(gestorReceitas.obterReceitasDisponiveis(), criterios);
    listaReceitas.innerHTML = "";

    if (receitasVisiveis.length === 0){
        listaReceitas.innerHTML = `<p class="mensagem">Nenhuma receita encontrada</p>`;
    } else {
        for (const receita of receitasVisiveis){
            listaReceitas.appendChild(criarCartao(receita, {
                eFavorito: favoritos.verificarSeEFavorito(receita.id),
                ingredientesDespensa: criterios.ingredientesDespensa,
                aoClicarFavorito: () => alternarFavorito(receita),
                aoClicarRemover: () => pedirConfirmacaoRemover(receita),
                aoClicarPreparacao: () => abrirPreparacao(receita)
            }));
        }
    }

    mostrarResumoFiltro(receitasVisiveis);
    mostrarBotaoReporRemovidas();
}

function mostrarResumoFiltro(receitasVisiveis){
    const quantidade = receitasVisiveis.length;

    if (quantidade === 0){
        elementoResumo.textContent = "0 receitas";
        return;
    }

    const somaTempo = receitasVisiveis.reduce((soma, receita) => soma + receita.tempo, 0);
    const mediaTempo = formatarTempo(Math.round(somaTempo / quantidade));
    const palavraReceita = quantidade === 1 ? "receita" : "receitas";
    const quantidadeFavoritos = favoritos.contarFavoritos();
    const palavraFavorito = quantidadeFavoritos === 1 ? "favorita" : "favoritas";

    elementoResumo.textContent = `${quantidade} ${palavraReceita} · tempo médio ${mediaTempo} · ${quantidadeFavoritos} ${palavraFavorito}`;
}

function mostrarBotaoReporRemovidas(){
    const quantidadeRemovidas = gestorReceitas.contarRemovidas();
    botaoReporRemovidas.hidden = quantidadeRemovidas === 0;
    botaoReporRemovidas.textContent = `Repor receitas removidas (${quantidadeRemovidas})`;
}

function alternarFavorito(receita){
    favoritos.adicionarOuRemover(receita.id);
    mostrarReceitas();
}

function adicionarReceitas(receitasNovas){
    gestorReceitas.adicionarReceitas(receitasNovas);
    mostrarReceitas();
}

function removerReceita(receita){
    if (!receita){
        return;
    }

    gestorReceitas.removerReceita(receita);

    if (favoritos.verificarSeEFavorito(receita.id)){
        favoritos.adicionarOuRemover(receita.id);
    }

    mostrarReceitas();
}

function reporRemovidas(){
    gestorReceitas.reporRemovidas();
    mostrarReceitas();
}

filtroPesquisa.addEventListener("input", mostrarReceitas);
filtroCategoria.addEventListener("change", mostrarReceitas);
filtroOrdem.addEventListener("change", mostrarReceitas);
filtroFavorito.addEventListener("change", mostrarReceitas);
filtroReceitasPossiveis.addEventListener("change", mostrarReceitas);

filtroDespensa.addEventListener("input", () => {
    guardarArmazenamento(localStorage, CHAVE_DESPENSA, filtroDespensa.value);
    mostrarReceitas();
});

botaoReporRemovidas.addEventListener("click", reporRemovidas);

filtroDespensa.value = lerArmazenamento(localStorage, CHAVE_DESPENSA, "");

iniciarTema();
iniciarModais(removerReceita);
iniciarFormulario(receita => adicionarReceitas([receita]));
iniciarCopiaSeguranca(gestorReceitas.obterMinhasReceitas, adicionarReceitas);
iniciarListaReceitas();
