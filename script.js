const produtos = [
    { id: 1, nome: 'Classic Burger', preco: 15.99, descricao: 'Hambúrguer de carne, queijo, alface, tomate e molho especial.', imagem: 'images/Hambúrguer de Carne Clássico-1.jpg' },
    { id: 2, nome: 'Cheeseburger Duplo', preco: 18.99, descricao: 'Dois hambúrgueres, queijo cheddar duplo, picles e molho.', imagem: 'images/Cheeseburger Duplo-2.jpg' },
    // ... (outros produtos)
];

const menuDiv = document.getElementById('menu');
const orderDiv = document.getElementById('order');
const totalSpan = document.getElementById('total');
const paymentMethod = document.getElementById('payment-method');
const changeContainer = document.getElementById('change-container');

let pedido = [];

const renderMenu = () => {
    menuDiv.innerHTML = '';
    produtos.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="mb-2">
            <h5>${produto.nome}</h5>
            <p>${produto.descricao}</p>
            <p class="text-primary">R$ ${produto.preco.toFixed(2)}</p>
            <button class="btn btn-primary btn-sm" onclick="adicionarAoPedido(${produto.id})">Adicionar</button>
        `;
        menuDiv.appendChild(div);
    });
};

const adicionarAoPedido = (id) => {
    const produto = produtos.find(p => p.id === id);
    const itemNoPedido = pedido.find(p => p.id === id);
    if (itemNoPedido) {
        itemNoPedido.quantidade++;
    } else {
        pedido.push({ ...produto, quantidade: 1 });
    }
    atualizarPedido();
};

const atualizarPedido = () => {
    orderDiv.innerHTML = '';
    pedido.forEach(item => {
        const div = document.createElement('div');
        div.className = 'mb-2';
        div.innerHTML = `
            <h6>${item.nome}</h6>
            <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
            <div class="quantity-control">
                <button class="btn btn-sm btn-secondary" onclick="removerDoPedido(${item.id})">-</button>
                <span>${item.quantidade}</span>
                <button class="btn btn-sm btn-secondary" onclick="removerDoPedido(${item.id}, true)">+</button>
                <button class="btn btn-danger btn-sm" onclick="removerDoPedido(${item.id}, false)">Remover</button>
            </div>
        `;
        orderDiv.appendChild(div);
    });
    totalSpan.innerText = pedido.reduce((total, item) => total + (item.preco * item.quantidade), 0).toFixed(2);
    atualizarContadorCarrinho();
};

const removerDoPedido = (id, adicionar = false) => {
    const itemNoPedido = pedido.find(p => p.id === id);
    if (adicionar) {
        itemNoPedido.quantidade++;
    } else {
        itemNoPedido.quantidade--;
    }
    if (itemNoPedido.quantidade <= 0) {
        pedido = pedido.filter(p => p.id !== id);
    }
    atualizarPedido();
};

document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProdutos = produtos.filter(produto => produto.nome.toLowerCase().includes(searchTerm));
    menuDiv.innerHTML = '';
    filteredProdutos.forEach(produto => {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.innerHTML = `
            <img src="${produto.imagem}" alt="${produto.nome}" class="mb-2">
            <h5>${produto.nome}</h5>
            <p>${produto.descricao}</p>
            <p class="text-primary">R$ ${produto.preco.toFixed(2)}</p>
            <button class="btn btn-primary btn-sm" onclick="adicionarAoPedido(${produto.id})">Adicionar</button>
        `;
        menuDiv.appendChild(div);
    });
});

paymentMethod.addEventListener('change', (e) => {
    changeContainer.classList.toggle('d-none', e.target.value !== 'Dinheiro');
});

document.getElementById('send-whatsapp').addEventListener('click', () => {
    const nome = document.getElementById('client-name').value;
    const cpf = document.getElementById('client-cpf').value;
    const telefoneCliente = document.getElementById('client-phone').value; // Telefone do cliente
    const endereco = document.getElementById('client-address').value;
    const metodoPagamento = paymentMethod.value;
    const troco = document.getElementById('change').value;

    // Verifica se há itens no pedido
    if (pedido.length === 0) {
        alert('Você deve adicionar pelo menos um item ao pedido.');
        return;
    }

    if (!nome || !cpf || !telefoneCliente || !endereco || !metodoPagamento) {
        alert('Por favor, preencha todos os campos de dados do cliente.');
        return;
    }

    const pedidoStr = pedido.map(item => `${item.nome} (x${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}`).join('\n');
    const totalStr = `Total: R$ ${totalSpan.innerText}`;
    const mensagem = `Olá, gostaria de fazer o pedido:\n\n${pedidoStr}\n\n${totalStr}\n\nNome: ${nome}\nCPF: ${cpf}\nTelefone: ${telefoneCliente}\nEndereço: ${endereco}\nMétodo de pagamento: ${metodoPagamento}${troco ? `\nTroco para: R$ ${troco}` : ''}`;

    const numeroDestino = '5592988356730'; // Substitua por seu número de WhatsApp, incluindo o código do país (55 para Brasil)
    
    // Cria o link do WhatsApp com o número do destinatário
    const whatsappUrl = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`;

    // Abre o WhatsApp com a mensagem
    window.open(whatsappUrl, '_blank');
});

// Limita o campo de endereço a 300 caracteres
document.getElementById('client-address').setAttribute('maxlength', '300');
document.getElementById('client-name').setAttribute('maxlength', '80');

// Função para limitar a entrada no campo de troco para 3 números
document.getElementById('change').addEventListener('input', function (e) {
    const value = e.target.value;
    if (value.length > 3) {
        e.target.value = value.slice(0, 3); // Trunca para os 3 primeiros dígitos
    }
});

const atualizarContadorCarrinho = () => {
    const totalItens = pedido.reduce((total, item) => total + item.quantidade, 0);
    document.getElementById('cart-item-count').innerText = totalItens;
};

const cartIcon = document.getElementById('cart-icon');
const cartPopup = document.getElementById('cart-popup');
const cartItemsDiv = document.getElementById('cart-items');
const closePopupBtn = document.getElementById('close-popup');
const finalizeOrderBtn = document.getElementById('finalize-order');

// Função para mostrar o popup com os itens do pedido
const mostrarCarrinho = () => {
    cartItemsDiv.innerHTML = '';
    if (pedido.length === 0) {
        cartItemsDiv.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        pedido.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${item.nome}</strong> (x${item.quantidade}) - R$ ${(item.preco * item.quantidade).toFixed(2)}`;
            cartItemsDiv.appendChild(div);
        });
    }
    cartPopup.classList.remove('d-none'); // Remove a classe 'd-none' para exibir o popup
    cartPopup.classList.add('show'); // Adiciona a classe 'show' se você estiver usando para estilização
};

// Evento para abrir o popup ao clicar no ícone
cartIcon.addEventListener('click', () => {
    mostrarCarrinho();
});

// Evento para fechar o popup com o botão de fechar
closePopupBtn.addEventListener('click', () => {
    cartPopup.classList.add('d-none'); // Adiciona a classe 'd-none' para esconder o popup
    cartPopup.classList.remove('show'); // Remove a classe 'show' se estiver usando
});

// Evento para finalizar o pedido e focar no campo de nome
finalizeOrderBtn.addEventListener('click', () => {
    if (pedido.length === 0) {
        alert('Você deve adicionar pelo menos um item ao pedido.');
        return;
    }
    closePopupBtn.click(); // Fecha o popup
    document.getElementById('client-name').focus(); // Foca no campo de nome
});

// Fecha o popup ao clicar fora dele
window.addEventListener('click', (event) => {
    if (!cartPopup.contains(event.target) && event.target !== cartIcon) {
        cartPopup.classList.add('d-none'); // Adiciona a classe 'd-none' se clicar fora do popup
        cartPopup.classList.remove('show'); // Remove a classe 'show' se estiver usando
    }
});

// Evita que o popup feche ao clicar dentro dele
cartPopup.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Chama a função para renderizar o menu
renderMenu();
