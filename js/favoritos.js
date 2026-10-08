import { lerLocalStorage, guardarLocalStorage } from "./utilitarias.js"

const CHAVE_FAVORITOS = "tacho-favoritos";

export function criarFavoritos(){
    let listaFavoritos = lerLocalStorage(CHAVE_FAVORITOS, []);

    function adicionarOuRemover(id){
        if (listaFavoritos.includes(id)){
            listaFavoritos = listaFavoritos.filter(favorito => favorito !== id);
        } else{
            listaFavoritos = [...listaFavoritos, id];
        }

        guardarLocalStorage(CHAVE_FAVORITOS, listaFavoritos);
    }

    function verificarSeEFavorito(id){
        return listaFavoritos.includes(id);
    }

    function contarFavoritos(){
        return listaFavoritos.length;
    }

    return {adicionarOuRemover, verificarSeEFavorito: verificarSeEFavorito, contarFavoritos}
}
