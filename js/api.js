export async function carregarReceitas(){
    const resposta = await fetch("dados.json");
    
    if (!resposta.ok){
        throw new Error(`Erro. ${resposta.status}. Tente novamente mais tarde.`)
    }

    const receitas = await resposta.json()

    return receitas;
}