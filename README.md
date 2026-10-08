# Tacho da Mãe

## Sobre o projeto

Projeto desenvolvido no âmbito do módulo de Programação em Javascript no programa UPSKILL - Digital Skills & Jobs resultante da parceria entre o Instituto do Emprego e Formação Profissional, a Universidade Politécnica do Cávado e Ave e a Deloitte.

É uma aplicação web de receitas tradicionais que permite ao utilizador navegar pelas receitas guardadas, marcar como favoritas, adicionar as suas próprias receitas, e ver o que consegue cozinhar com os ingredientes que tem em casa.

## GitHub pages

[vitorbsantosdev.github.io/tacho-da-mae](https://vitorbsantosdev.github.io/tacho-da-mae/)

## Correr localmente

Para correr o programa localmente, siga os seguintes passos pela ordem apresentada:

1. **Clonar o repositório:** no Git Bash, introduza o comando:

   ```bash
   git clone https://github.com/VitorBSantosDev/tacho-da-mae.git
   ```

2. **Abrir a pasta** `tacho-da-mae` no VS Code.
3. **Instalar a extensão Live Server**, se ainda não estiver instalada.
4. **Abrir com o Live Server:** botão direito no `index.html` → "Open with Live Server".

Nota: não abra o ficheiro `index.html` com duplo clique, uma vez que o `fetch` do ficheiro `dados.json` e os `import` dos módulos só funcionam através de um servidor, e com o ficheiro aberto diretamente o browser bloqueia-os.

## Funcionalidades

* pesquisa por nome, filtro por categoria e ordenação (nome, mais rápidas, mais demoradas);
* favoritos (♥), com o filtro "Só favoritas";
* resumo com o número de receitas, o tempo médio e o número de favoritas;
* modo de preparação numa janela (modal), com a imagem da receita;
* adicionar receitas próprias, com validação e fotografia opcional (reduzida automaticamente);
* remover receitas, com uma janela de confirmação, e repor as removidas;
* **despensa:** escrever o que tens em casa e ver as receitas que consegues fazer, e o que falta;
* rascunho do formulário (não se perde ao recarregar a página);
* modo claro e escuro;
* adaptado para telemóvel e tablet;
* botões flutuantes para voltar ao topo e para adicionar uma receita.

## Tecnologias

- HTML5, CSS3 (variáveis, Flexbox, Grid, media queries) e JavaScript ES6+;
- módulos ES (`import`/`export`);
- `fetch` + `async/await` para ler o `dados.json`, e Promises com `.then()/.catch()` para as imagens;
- `localStorage` e `sessionStorage`;
- `<dialog>` para as janelas modais;
- `canvas` para reduzir as fotografias.

## Estrutura dos ficheiros

```
├── index.html
├── style.css
├── dados.json
├── img/
├── js/main.js
├── js/api.js
├── js/utilitarias.js
├── js/favoritos.js
├── js/tema.js
```

## Como os dados são guardados

* **as receitas iniciais** vêm do `dados.json` (apenas leitura);
* **as receitas novas, as removidas, os favoritos, a despensa e o tema** ficam guardadas no **`localStorage`** (permanente, só neste browser);
* **o rascunho do formulário** fica no **`sessionStorage`** (desaparece ao fechar o separador).

As receitas novas são guardadas no `localStorage` em vez do ficheiro `dados.json` porque o browser não pode alterar ficheiros, e o GitHub Pages não tem servidor.

As chaves utilizadas são `tacho-favoritos`, `tacho-minhas-receitas`, `tacho-removidas`, `tacho-despensa`, `tacho-tema` e `tacho-rascunho`.

## Requisitos do projeto

Onde cada um dos requisitos do enunciado é cumprido no código:

| Requisito                                     | Como é cumprido                                                                                                                                                                                                                                                                                                                     | Onde                                                                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **1. Lógica e controlo de fluxo**      | `if/else` nos filtros e na validação; `switch` na ordenação das receitas; operadores ternários no botão de favorito e no singular/plural do resumo; ciclos `for...of` e `forEach`; `map`, `filter` e `reduce` (soma dos tempos para o tempo médio)                                                              | `main.js` (`obterReceitasVisiveis`, `mostrarResumoFiltro`, `criarCartao`), `utilitarias.js`                    |
| **2. Manipulação de dados simples**   | formatação do tempo (`75` → "1 h 15 min"); pesquisa sem distinção de maiúsculas (`toLowerCase`, `trim`); validação do formulário (`isNaN`, comprimento do nome); conversão de texto para número (`Number`); normalização de ingredientes (acentos, singular/plural); booleanos das checkboxes (`.checked`)  | `utilitarias.js` (`formatarTempo`, `limparTexto`, `validarReceita`, `tirarAcentos`, `normalizarIngrediente`) |
| **3. Manipulação de dados complexos** | arrays de objetos (receitas); ordenação feita sobre uma cópia (`[...receitasFiltradas]`); junção de arrays com spread (`[...receitas, ...minhasReceitas]`); adicionar e remover itens sem alterar o array original (spread e `filter`)                                                                                    | `main.js`, `favoritos.js`                                                                                            |
| **4. Manipulação do DOM**             | cartões criados com `document.createElement`, template strings, `innerHTML`, `textContent` e `appendChild`; listas de ingredientes, passos e erros geradas dinamicamente; `classList` e `hidden` para mostrar estados                                                                                                    | `main.js` (`criarCartao`, `mostrarReceitas`, `abrirPreparacao`)                                                  |
| **5. Reatividade e eventos**            | `input` (pesquisa, despensa, rascunho do formulário), `change` (selects e checkboxes), `click` (favorito, ver preparação, remover, repor, modais, tema) e `submit` (adicionar receita); propagação de eventos no formulário; badges de estado ("Tem tudo" / "Falta")                                                   | `main.js`, `tema.js`                                                                                                 |
| **6. Scope e closures**                 | `criarFavoritos` guarda a lista de favoritos numa variável privada, acessível só pelas funções que devolve; `const`/`let` usados conforme o valor muda ou não; constantes privadas ao módulo (sem `export`); variáveis no topo do módulo partilhadas entre eventos (`temporizadorSucesso`, `receitaPorRemover`) | `favoritos.js`, `utilitarias.js`, `main.js`                                                                        |
| **7. Assincronismo**                    | `fetch` do `dados.json` com `async/await` e `try/catch`; Promise com `.then()/.catch()` para reduzir a fotografia (`createImageBitmap` + `canvas`); `await` dessa Promise no envio do formulário; `setTimeout`/`clearTimeout` na mensagem de sucesso                                                            | `api.js` (`carregarReceitas`), `utilitarias.js` (`reduzirImagem`), `main.js`                                   |
| **8. Modularização**                  | código dividido em 5 módulos ligados com `import`/`export`; funções utilitárias reutilizáveis num ficheiro próprio                                                                                                                                                                                                         | `js/`                                                                                                                  |
| **Persistência de dados**              | `localStorage` para favoritos, receitas novas, receitas removidas, despensa e tema; `sessionStorage` para o rascunho do formulário                                                                                                                                                                                              | `utilitarias.js`, `favoritos.js`, `tema.js`, `main.js`                                                           |

## Autor

**Vitor Santos**
[linkedin.com/in/vitor-b-santos](https://linkedin.com/in/vitor-b-santos) · [github.com/VitorBSantosDev](https://github.com/VitorBSantosDev)
