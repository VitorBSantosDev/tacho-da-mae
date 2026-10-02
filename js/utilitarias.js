export function formatarTempo(minutos){
    const minutosHora = 60;
    const horas = Math.floor(minutos / minutosHora);
    const minutosRestantes = minutos % minutosHora;

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