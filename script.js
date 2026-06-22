let indiceSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicadores = document.querySelectorAll('.indicador');
const tempoTroca = 5000;
let intervalo;

function mostrarSlide(indice) {
    slides.forEach(slide => slide.classList.remove('ativo'));
    indicadores.forEach(ind => ind.classList.remove('ativo'));
    
    if (slides[indice]) slides[indice].classList.add('ativo');
    if (indicadores[indice]) indicadores[indice].classList.add('ativo');
}

function mudarSlide(direcao) {
    indiceSlide += direcao;
    if (indiceSlide >= slides.length) {
        indiceSlide = 0;
    } else if (indiceSlide < 0) {
        indiceSlide = slides.length - 1;
    }
    mostrarSlide(indiceSlide);
}

function irParaSlide(indice) {
    indiceSlide = indice;
    mostrarSlide(indiceSlide);
}

function iniciarCarrossel() {
    intervalo = setInterval(() => {
        mudarSlide(1);
    }, tempoTroca);
}

const carrosselElement = document.querySelector('.carrossel');
if (carrosselElement) {
    carrosselElement.addEventListener('mouseenter', () => clearInterval(intervalo));
    carrosselElement.addEventListener('mouseleave', () => iniciarCarrossel());
}

iniciarCarrossel();


function abrirModal() {
    document.getElementById('modal-produtos').style.display = 'block';
    document.body.style.overflow = 'hidden'; 
}

function fecharModal() {
    document.getElementById('modal-produtos').style.display = 'none';
    if (document.getElementById('modal-detalhes').style.display !== 'block') {
        document.body.style.overflow = 'auto'; 
    }
}

window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal-produtos');
    if (event.target === modal) {
        fecharModal();
    }
});


let categoriaAtual = 'Todos';

function filtrarCategoria(categoria, botao) {
    categoriaAtual = categoria;
    
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('ativo'));
    botao.classList.add('ativo');

    executarFiltroGeral();
}

function filtrarPorTexto() {
    executarFiltroGeral();
}

function executarFiltroGeral() {
    const textoBusca = document.getElementById('busca-modal').value.toLowerCase();
    const cards = document.querySelectorAll('#lista-produtos-modal .card-produto');

    cards.forEach(card => {
        const nomeProduto = card.querySelector('h3').textContent.toLowerCase();
        const categoriaCard = card.getAttribute('data-categoria');

        const bateCategoria = (categoriaAtual === 'Todos' || categoriaCard === categoriaAtual);
        const bateTexto = nomeProduto.includes(textoBusca);

        if (bateCategoria && bateTexto) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}


let carrinho = JSON.parse(localStorage.getItem('lizStore_carrinho')) || [];

function toggleCarrinho() {
    document.getElementById('carrinho-lateral').classList.toggle('aberto');
}

document.body.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON' && event.target.textContent === 'Comprar Agora') {
        const card = event.target.closest('.card-produto');
        if (card) {
            const nome = card.querySelector('h3').textContent;
            const precoTexto = card.querySelector('.preco').textContent;
            const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());
            const imagem = card.querySelector('img').getAttribute('src');
            
            adicionarAoCarrinho(nome, preco, imagem);
        }
    }
});

function adicionarAoCarrinho(nome, preco, imagem) {
    const tamanhoInicial = nome.toLowerCase().includes('plus size') ? 'Plus Size' : 'P';

    const itemExistente = carrinho.find(item => item.nome === nome && item.tamanho === tamanhoInicial);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            imagem: imagem,
            quantidade: 1,
            tamanho: tamanhoInicial
        });
    }

    atualizarCarrinho();
    
    abrirCarrinho(); 
}

function mudarTamanhoCarrinho(index, novoTamanho) {
    carrinho[index].tamanho = novoTamanho;
    atualizarCarrinho();
}

function alterarQuantidade(index, mudanca) {
    carrinho[index].quantidade += mudanca;

    if (carrinho[index].quantidade <= 0) {
        carrinho.splice(index, 1); 
    }

    atualizarCarrinho(); 
}
 function atualizarCarrinho() {
    localStorage.setItem('lizStore_carrinho', JSON.stringify(carrinho));
    const conteinerItens = document.getElementById('itens-carrinho');
    const contagemCarrinho = document.getElementById('contagem-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');

    if (!conteinerItens) return;

    conteinerItens.innerHTML = '';
    let total = 0;
    let totalItens = 0;

    carrinho.forEach((item, index) => {
        total += item.preco * item.quantidade;
        totalItens += item.quantidade;

        const divItem = document.createElement('div');
        divItem.classList.add('item-carrinho');
        
        divItem.style.display = 'flex';
        divItem.style.alignItems = 'center';
        divItem.style.padding = '12px 0';
        divItem.style.borderBottom = '1px solid #f3f3f3';

        
        const ehPlusSize = item.nome.toLowerCase().includes('plus size');
        let seletorTamanhoHTML = '';
        
        if (ehPlusSize) {
            seletorTamanhoHTML = `
                <span style="font-size: 11px; background: #f5f5f7; padding: 4px 10px; border-radius: 50px; color: #555; font-weight: 600; border: 1px solid #e5e5ea; letter-spacing: 0.3px;">
                    Tam: Plus Size
                </span>`;
        } else {
            seletorTamanhoHTML = `
                <div style="display: flex; align-items: center; gap: 4px;">
                    <span style="font-size: 11px; color: #8e8e93; font-weight: 500;">Tam:</span>
                    <select onchange="mudarTamanhoCarrinho(${index}, this.value)" style="padding: 4px 24px 4px 8px; font-size: 12px; font-weight: 600; border-radius: 6px; border: 1px solid #e5e5ea; cursor: pointer; font-family: 'Montserrat', sans-serif; background-color: #fff; color: #333; outline: none; appearance: none; -webkit-appearance: none; background-image: url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%23333333\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"></polyline></svg>'); background-repeat: no-repeat; background-position: right 8px center;">
                        <option value="P" ${item.tamanho === 'P' ? 'selected' : ''}>P</option>
                        <option value="M" ${item.tamanho === 'M' ? 'selected' : ''}>M</option>
                        <option value="G" ${item.tamanho === 'G' ? 'selected' : ''}>G</option>
                        <option value="GG" ${item.tamanho === 'GG' ? 'selected' : ''}>GG</option>
                    </select>
                </div>
            `;
        }

        divItem.innerHTML = `
            <img src="${item.imagem}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px; border: 1px solid #f0f0f0;">
            
            <div style="flex: 1; margin-left: 14px; display: flex; flex-direction: column; gap: 4px;">
                <h4 style="font-size: 13px; margin: 0; font-weight: 600; color: #1c1c1e; line-height: 1.3;">${item.nome}</h4>
                <p style="font-size: 13px; color: #ff6b6b; font-weight: 700; margin: 0;">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                <div style="display: flex; align-items: center; margin-top: 2px;">
                    ${seletorTamanhoHTML}
                </div>
            </div>
            
            <div style="display: flex; align-items: center; background: #f5f5f7; border-radius: 50px; padding: 2px; border: 1px solid #e5e5ea;">
                <button onclick=\"alterarQuantidade(${index}, -1)\" style=\"width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; background: transparent; font-size: 14px; font-weight: 500; color: #555; transition: all 0.2s; border-radius: 50px;\" onmouseover=\"this.style.background='#e5e5ea'\" onmouseout=\"this.style.background='transparent'\">-</button>
                <span style="font-size: 12px; font-weight: 700; min-width: 22px; text-align: center; color: #1c1c1e; font-family: 'Montserrat', sans-serif;">${item.quantidade}</span>
                <button onclick=\"alterarQuantidade(${index}, 1)\" style=\"width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; background: transparent; font-size: 14px; font-weight: 500; color: #555; transition: all 0.2s; border-radius: 50px;\" onmouseover=\"this.style.background='#e5e5ea'\" onmouseout=\"this.style.background='transparent'\">+</button>
            </div>
        `;

        conteinerItens.appendChild(divItem);
    });

    if (contagemCarrinho) contagemCarrinho.textContent = totalItens;
    if (totalCarrinho) totalCarrinho.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    
    if (typeof verificarFreteGratis === "function") {
        verificarFreteGratis(totalItens);
    }
}
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        mensagem += `• ${item.quantidade}x ${item.nome} (Tamanho: ${item.tamanho}) - R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    });

    mensagem += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    
    const numeroWhats = "5516996357475"; 
    const url = `https://api.whatsapp.com/send?phone=${numeroWhats}&text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
}

function buscarDoCabecalho() {
    const textoCabecalho = document.getElementById('busca-cabecalho').value;
    const buscaModal = document.getElementById('busca-modal');
    
    if (textoCabecalho.trim() !== "") {
        abrirModal();
        
        buscaModal.value = textoCabecalho;
        categoriaAtual = 'Todos';
        document.querySelectorAll('.btn-filtro').forEach(btn => {
            if(btn.textContent === 'Todos') btn.classList.add('ativo');
            else btn.classList.remove('collapse');
        });
        
        executarFiltroGeral();
    }
}

function abrirDetalhes(elemento) {
    const card = elemento.closest('.card-produto');
    
    const nome = card.querySelector('h3').textContent;
    const precoTexto = card.querySelector('.preco').textContent;
    const imagem = card.querySelector('img').getAttribute('src');
    
    const descricao = card.getAttribute('data-descricao') || "T-shirt Premium exclusiva da Liz Store. Conforto, versatilidade e estilo garantidos para o seu dia a dia.";

    document.getElementById('detalhe-img').src = imagem;
    document.getElementById('detalhe-img').alt = nome;
    document.getElementById('detalhe-nome').textContent = nome;
    document.getElementById('detalhe-preco').textContent = precoTexto;
    document.getElementById('detalhe-descricao').textContent = descricao;

    const btnComprar = document.getElementById('detalhe-btn-comprar');
    btnComprar.onclick = function() {
        const precoNumerico = parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());
        adicionarAoCarrinho(nome, precoNumerico, imagem);
        fecharModalDetalhes();
    };

    document.getElementById('modal-detalhes').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function fecharModalDetalhes() {
    document.getElementById('modal-detalhes').style.display = 'none';
    
    if (document.getElementById('modal-produtos').style.display !== 'block') {
        document.body.style.overflow = 'auto';
    }
}

window.addEventListener('click', function(event) {
    const modalDetalhes = document.getElementById('modal-detalhes');
    if (event.target === modalDetalhes) {
        fecharModalDetalhes();
    }
});

document.addEventListener('DOMContentLoaded', atualizarCarrinho);