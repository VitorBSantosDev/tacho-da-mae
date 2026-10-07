const INGREDIENTES_BASICOS = ["sal", "pimenta", "agua", "azeite"];
const SEM_ACENTO = {
    á: "a", à: "a", â: "a", ã: "a",
    é: "e", ê: "e",
    í: "i",
    ó: "o", ô: "o", õ: "o",
    ú: "u",
    ç: "c"
};
const REGRAS_PLURAL = [
    { plural: "oes", singular: "ao" },
    { plural: "aes", singular: "ao" },
    { plural: "eis", singular: "el" },
    { plural: "res", singular: "r" },
    { plural: "zes", singular: "z" },
    { plural: "ns",  singular: "m" },
    { plural: "s",   singular: "" }
];

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

export function guardarSessionStorage(chave, valor) {
    try {
        const valorString = JSON.stringify(valor);
        sessionStorage.setItem(chave, valorString);       
    } catch (erro) {
        console.warn(`Erro: ${erro.message} | ${chave}.`)
    }
}

export function lerSessionStorage (chave, valorDefeito) {
    try {
        const valorGuardado = sessionStorage.getItem(chave);

        if (valorGuardado === null) {
            return  valorDefeito;
        }

        const valorTratado = JSON.parse(valorGuardado);

        return valorTratado;
        
    } catch (erro) {
        return valorDefeito;
    }
}

export function apagarSessionStorage (chave) {
    try {
        sessionStorage.removeItem(chave);
    } catch (erro) {
        console.warn(`Erro: ${erro.message} | ${chave}.`)
    }
}

export function validarReceita(receita){
    const listaErros = [];

    if (receita.nome.length < 3){
        listaErros.push("O nome precisa de pelo menos 3 letras.");
    }
    if (isNaN(receita.tempo) || receita.tempo <= 0){
        listaErros.push("O tempo tem de ser um número maior que 0.");
    }
    if (receita.ingredientes.length === 0){
        listaErros.push("Escreva pelo menos um ingrediente.");
    }
    if (receita.preparacao.length === 0){
        listaErros.push("Escreva pelo menos um passo da preparação.");
    }

    return listaErros;
}

export function converterTextoParaLista(texto){
    return texto.split("\n").map(linha => linha.trim()).filter(linha => linha !== "");
}

export function converterTextoDespensa(texto){
    return texto.split(",").map(ingrediente => normalizarIngrediente(ingrediente)).filter(ingrediente => ingrediente !== "");
}

export function separarPorVirgulas(texto){
    return texto.split(",").map(ingrediente => ingrediente.trim()).filter(ingrediente => ingrediente !== "");
}

export function reduzirImagem(ficheiro, largura = 400, altura = 300){
    return createImageBitmap(ficheiro)
        .then(imagem => {
            const tela = document.createElement("canvas");
            tela.width = largura;
            tela.height = altura;

            const escala = Math.max(largura / imagem.width, altura / imagem.height);
            const novaLargura = imagem.width * escala;
            const novaAltura = imagem.height * escala;

            const x = (largura - novaLargura) / 2;
            const y = (altura - novaAltura) / 2;

            const contexto = tela.getContext("2d");
            contexto.drawImage(imagem, x, y, novaLargura, novaAltura);

            return tela.toDataURL("image/jpeg", 0.7);
        })
        .catch(() => {
            throw new Error("O ficheiro escolhido não é uma imagem válida.");
        });
}

export function tirarAcentos(texto){
    return texto
        .split("")
        .map(letra => SEM_ACENTO[letra] ?? letra)
        .join("");
}

export function normalizarIngrediente(texto) {
    const ingredienteLimpo = limparTexto(texto);
    const ingredienteSemAcentos = tirarAcentos(ingredienteLimpo);

    for (const regra of REGRAS_PLURAL) {
        if (ingredienteSemAcentos.endsWith(regra.plural)) {
            return ingredienteSemAcentos.slice(0, -regra.plural.length) + regra.singular;
        }
    }

    return ingredienteSemAcentos;
}

export function identificarIngredientesEmFalta(receita, despensa){
    const ingredientesBase = receita.ingredientesBase ?? [];
    return ingredientesBase.filter(ingrediente => {
        const ingredienteNormalizado = normalizarIngrediente(ingrediente);
        return !INGREDIENTES_BASICOS.includes(ingredienteNormalizado) && !despensa.includes(ingredienteNormalizado);
    });
}