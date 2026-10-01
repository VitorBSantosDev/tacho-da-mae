import { iniciarTema } from './tema.js';
import { carregarReceitas } from './api.js';

const listaReceitas = document.querySelector("#lista-receitas");
let receitas = [];

async function iniciarListaReceitas(){
    listaReceitas.innerHTML = `<p class="mensagem">A carregar receitas...</p>`

    try {
        receitas = await carregarReceitas()
        console.log(receitas);
        listaReceitas.innerHTML = `<p class="mensagem">${receitas.length} receitas carregadas</p>`
    } catch (erro) {
        listaReceitas.innerHTML = `<p class="mensagem mensagem-erro">Erro. ${erro.message}. Tente novamente mais tarde.</p>`
        
    }
}

iniciarTema();
iniciarListaReceitas();