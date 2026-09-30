export function iniciarTema() {
    const botao = document.querySelector('#tema');
    const html = document.documentElement;

    function temaAtual() {
        if (html.dataset.theme) {
            return html.dataset.theme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function aplicar(tema) {
        html.dataset.theme = tema;
        botao.textContent = tema === 'dark' ? '☀ Modo claro' : '☾ Modo escuro';
    }

    const guardado = localStorage.getItem('tacho-tema');
    aplicar(guardado || temaAtual());

    botao.addEventListener('click', () => {
        const novo = temaAtual() === 'dark' ? 'light' : 'dark';
        aplicar(novo);
        localStorage.setItem('tacho-tema', novo);
    });
}
