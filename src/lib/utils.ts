export const primaryColor = '#4a86cf';
export const defaultDateFormat = 'YYYY/MM/DD';

export function copyToClipboard(text: str, successIcon?: string) {
    navigator.clipboard.writeText(text)

    if (successIcon) {
        document.querySelectorAll(successIcon).forEach(el => {
            el.classList.forEach(c => c.startsWith('gg-') ? el.classList.remove(c) : null)

            el.classList.add('gg-check')
        })
    }
}