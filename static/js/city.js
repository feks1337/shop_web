const CityManager = (() => {
    const CITIES = ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань'];

    function getCookie(name) {
        const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
        return m ? decodeURIComponent(m[1]) : null;
    }
    function setCookie(name, value, days = 365) {
        document.cookie =
            `${name}=${encodeURIComponent(value)}; path=/; max-age=${days * 86400}; SameSite=Lax`;
    }
    function updateLabel() {
        const el = document.getElementById('city-label');
        if (el) el.textContent = getCookie('city') || 'не выбран';
    }
    function openModal() {
        const modal = document.getElementById('cityModal');
        const select = document.getElementById('citySelect');
        const current = getCookie('city');
        if (current && CITIES.includes(current)) select.value = current;
        document.getElementById('city-cancel').style.display = current ? 'inline' : 'none';
        modal.style.display = 'flex';
    }
    function closeModal() {
        document.getElementById('cityModal').style.display = 'none';
    }
    function confirmCity() {
        const val = document.getElementById('citySelect').value;
        setCookie('city', val);
        updateLabel();
        closeModal();
    }
    document.addEventListener('DOMContentLoaded', () => {
        updateLabel();
        if (!getCookie('city')) openModal();
    });
    return { openModal, closeModal, confirmCity };
})();