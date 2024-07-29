document.addEventListener('DOMContentLoaded', function() {
    const navCadastro = document.getElementById('nav-cadastro');
    const navConsulta = document.getElementById('nav-consulta');
    const cadastroScreen = document.getElementById('cadastro');
    const consultaScreen = document.getElementById('consulta');
    const detalhesScreen = document.getElementById('detalhes');
    const cadastroForm = document.getElementById('cadastro-form');
    const itemList = document.getElementById('item-list');
    const itemDetails = document.getElementById('item-details');
    const backToListButton = document.getElementById('back-to-list');

    const apiUrl = 'http://127.0.0.1:5000'; // URL base da sua API Flask

    navCadastro.addEventListener('click', function() {
        cadastroScreen.classList.add('active');
        consultaScreen.classList.remove('active');
        detalhesScreen.classList.remove('active');
    });

    navConsulta.addEventListener('click', function() {
        consultaScreen.classList.add('active');
        cadastroScreen.classList.remove('active');
        detalhesScreen.classList.remove('active');
        loadItems();
    });

    backToListButton.addEventListener('click', function() {
        detalhesScreen.classList.remove('active');
        consultaScreen.classList.add('active');
    });

    cadastroForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const itemName = document.getElementById('item-name').value;
        const itemId = document.getElementById('item-id').value;
        // Enviar dados para a API
        fetch(`${apiUrl}/add_item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: itemName, id: itemId })
        })
        .then(response => response.json())
        .then(data => {
            alert('Item cadastrado com sucesso!');
            cadastroForm.reset();
        })
        .catch(error => console.error('Error:', error));
    });

    function loadItems() {
        // Buscar itens da API
        fetch(`${apiUrl}/get_items`)
        .then(response => response.json())
        .then(data => {
            itemList.innerHTML = '';
            data.forEach(item => {
                const itemRow = document.createElement('div');
                itemRow.className = 'item-row';
                itemRow.innerHTML = `
                    <span>${item.nome}</span>
                    <button onclick="viewItemDetails('${item.id}')">
                        <img src="images/eye-icon.png" alt="View">
                    </button>
                `;
                itemList.appendChild(itemRow);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    window.viewItemDetails = function(itemId) {
        // Buscar detalhes do item da API
        fetch(`${apiUrl}/get_item_history/${itemId}`)
        .then(response => response.json())
        .then(data => {
            itemDetails.innerHTML = data.reverse().map(history => `
                <div class="history-entry">
                    <p>Nome do Item: ${history.nome}</p>
                    <p>Preço Máximo de Compra: ${formatNumber(history.compra)}</p>
                    <p>Preço Mínimo de Venda: ${formatNumber(history.venda)}</p>
                    <p>Data: ${history.atualizado}</p>
                    <p>--------//--------</p>
                </div>
            `).join('');
            consultaScreen.classList.remove('active');
            detalhesScreen.classList.add('active');
        })
        .catch(error => console.error('Error:', error));
    }

    // Inicializar a tela de cadastro como ativa
    navCadastro.click();
});
