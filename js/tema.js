const CHAVE_TEMA = "tacho-tema";

export function iniciarTema() {
    const botaoTema = document.querySelector('#tema');
    const html = document.documentElement;

    function obterTemaAtual() {
        if (html.dataset.theme) {
            return html.dataset.theme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function aplicarTema(tema) {
        html.dataset.theme = tema;
        botaoTema.textContent = tema === 'dark' ? '☀ Modo claro' : '☾ Modo escuro';
    }

    const guardado = localStorage.getItem(CHAVE_TEMA);
    aplicarTema(guardado || obterTemaAtual());

    botaoTema.addEventListener('click', () => {
        const novoTema = obterTemaAtual() === 'dark' ? 'light' : 'dark';
        aplicarTema(novoTema);
        localStorage.setItem(CHAVE_TEMA, novoTema);
    });
}
