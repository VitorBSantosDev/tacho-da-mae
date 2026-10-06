import { iniciarTema } from './tema.js';
import { carregarReceitas } from './api.js';
import { formatarTempo, limparTexto, validarReceita, lerLocalStorage, guardarLocalStorage, converterTextoParaLista, reduzirImagem, guardarSessionStorage, lerSessionStorage, apagarSessionStorage } from './utilitarias.js';
import { criarFavoritos } from './favoritos.js';

const listaReceitas = document.querySelector("#lista-receitas");
let receitas = [];
const filtroPesquisa = document.querySelector("#pesquisa");
const filtroCategoria = document.querySelector("#categoria");
const filtroOrdem = document.querySelector("#ordem");
const filtroResumo = document.querySelector("#resumo-filtro");
const favoritos = criarFavoritos();
const filtroFavorito = document.querySelector("#so-favoritas");
const formAdicionarReceita = document.querySelector("#form-adicionar-receita");
const listaErros = document.querySelector("#erros");
const mensagemSucesso = document.querySelector("#mensagem-sucesso");
const CHAVE_MINHAS_RECEITAS = "tacho-minhas-receitas";
let minhasReceitas = lerLocalStorage(CHAVE_MINHAS_RECEITAS, []);
const CHAVE_REMOVIDAS = "tacho-removidas";
let removidas = lerLocalStorage(CHAVE_REMOVIDAS, []);
const btnReporRemovidas = document.querySelector("#repor-removidas");
const CHAVE_RASCUNHO = "tacho-rascunho";


async function iniciarListaReceitas(){
    listaReceitas.innerHTML = `<p class="mensagem">A carregar receitas...</p>`

    try {
        receitas = await carregarReceitas()
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
            <button class="remover" type="button">Remover receita</button>
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

    const btnRemoverReceita = cartao.querySelector(".remover");

    btnRemoverReceita.addEventListener("click", () => {
        if (confirm(`Remover ${receita.nome}?`)){
            removerReceita(receita);
        }
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

function removerReceita(receitaRemover){
    if (receitaRemover.id.startsWith("minha-")){
        minhasReceitas = minhasReceitas.filter(receita => receita.id !== receitaRemover.id);
        guardarLocalStorage(CHAVE_MINHAS_RECEITAS, minhasReceitas);
    } else{
        removidas = [...removidas, receitaRemover.id];
        guardarLocalStorage(CHAVE_REMOVIDAS, removidas);
    }
    if (favoritos.verificarSeEhFavorito(receitaRemover.id)){
        favoritos.adicionarOuRemover(receitaRemover.id);
    }
    mostrarReceitas();
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
    btnReporRemovidas.hidden = removidas.length === 0;
    btnReporRemovidas.textContent = `Repor receitas removidas (${removidas.length})`
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
    const receitasCombinadas = [...receitas, ...minhasReceitas];

    const receitasFiltradas = receitasCombinadas.filter(receita => {
        if (removidas.includes(receita.id)){
            return false;
        }
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

function guardarRascunho(){
    const rascunhoGuardado = {
        nome: formAdicionarReceita.nome.value, 
        categoria: formAdicionarReceita.categoria.value, 
        tempo: formAdicionarReceita.tempo.value, 
        ingredientes: formAdicionarReceita.ingredientes.value, 
        preparacao: formAdicionarReceita.preparacao.value
    };

    guardarSessionStorage(CHAVE_RASCUNHO, rascunhoGuardado);
}

function reporRascunho(){
    const rascunho = lerSessionStorage(CHAVE_RASCUNHO, null);

    if (rascunho === null){
        return;
    }

    formAdicionarReceita.nome.value = rascunho.nome;
    formAdicionarReceita.categoria.value = rascunho.categoria;
    formAdicionarReceita.tempo.value = rascunho.tempo;
    formAdicionarReceita.ingredientes.value = rascunho.ingredientes;
    formAdicionarReceita.preparacao.value = rascunho.preparacao;
}

filtroFavorito.addEventListener("change", mostrarReceitas);
filtroPesquisa.addEventListener("input", mostrarReceitas);
filtroCategoria.addEventListener("change", mostrarReceitas);
filtroOrdem.addEventListener("change", mostrarReceitas);
formAdicionarReceita.addEventListener("input", guardarRascunho);

formAdicionarReceita.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    
    const receitaNova = {
        id: `minha-${Date.now()}`, 
        nome: formAdicionarReceita.nome.value.trim(), 
        categoria: formAdicionarReceita.categoria.value, 
        imagem: "img/sem-imagem.svg", 
        tempo: Number(formAdicionarReceita.tempo.value), 
        ingredientes: converterTextoParaLista(formAdicionarReceita.ingredientes.value), 
        preparacao: converterTextoParaLista(formAdicionarReceita.preparacao.value)};
    const erros = validarReceita(receitaNova);

    if (erros.length > 0){
        listaErros.innerHTML = erros.map(erro => `<li>${erro}</li>`).join("");
        listaErros.hidden = false;
        mensagemSucesso.hidden = true;
        return;
    }

    const ficheiro = formAdicionarReceita.imagem.files[0];

    if (ficheiro){
        try {
            receitaNova.imagem = await reduzirImagem(ficheiro);
        } catch (erro) {
            listaErros.innerHTML = `<li>${erro.message}</li>`;
            listaErros.hidden = false;
            mensagemSucesso.hidden = true;
            return;
        }
    }

    listaErros.hidden = true;
    minhasReceitas = [...minhasReceitas, receitaNova];
    guardarLocalStorage(CHAVE_MINHAS_RECEITAS, minhasReceitas);
    formAdicionarReceita.reset();
    apagarSessionStorage(CHAVE_RASCUNHO);
    mostrarReceitas();
    
    mensagemSucesso.textContent = `A receita "${receitaNova.nome}" foi adicionada com sucesso.`;
    mensagemSucesso.hidden = false;
    setTimeout(() => {
        mensagemSucesso.hidden = true;
    }, 5000);
});
btnReporRemovidas.addEventListener("click", () => {
    removidas = [];
    guardarLocalStorage(CHAVE_REMOVIDAS, removidas);
    mostrarReceitas();
})

iniciarTema();
iniciarListaReceitas();
reporRascunho();