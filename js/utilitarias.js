export function formatarTempo(minutos){
    const MINUTOS_HORA = 60;
    const horas = Math.floor(minutos / MINUTOS_HORA);
    const minutosRestantes = minutos % MINUTOS_HORA;

    if (horas < 1){
        return `${minutosRestantes} min`;
    }else if (minutosRestantes === 0){
        return `${horas} h`;
    }else{
        return `${horas} h ${minutosRestantes} min`;
    }
}

export function limparTexto(texto){
    return texto.toLowerCase().trim();
}

export function guardarLocalStorage(chave, valor){
    try {
        const valorString = JSON.stringify(valor);
        localStorage.setItem(chave, valorString);       
    } catch (erro) {
        console.warn(`Erro: ${erro.message} | ${chave}.`)
    }

}

export function lerLocalStorage(chave, valorDefeito){
    try {
        const valorGuardado = localStorage.getItem(chave);

        if (valorGuardado === null) {
            return  valorDefeito;
        }

        const valorTratado = JSON.parse(valorGuardado);

        return valorTratado;
        
    } catch (erro) {
        return valorDefeito;
    }
}