
// Início da accordionList -----------------------------------------------------------
const accordionTitles = document.querySelectorAll('.js-accordion dt');

// Inicializa o primeiro item da lista
accordionTitles[0].classList.add('active');
accordionTitles[0].nextElementSibling.classList.add('active');

// Adiciona evento de clique em cada título da lista
accordionTitles.forEach(title => {
    title.addEventListener('click', toggleAccordion);
});

function toggleAccordion() {
    this.classList.toggle('active');
    this.nextElementSibling.classList.toggle('active');
}
// Fim da accordionList -----------------------------------------------------------------