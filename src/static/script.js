// Variáveis globais
let selectedFile = null;
let downloadUrl = null;

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    const fileInput = document.getElementById('fileInput');
    const uploadArea = document.getElementById('uploadArea');
    const uploadBtn = document.getElementById('uploadBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    // Event listeners para upload de arquivo
    fileInput.addEventListener('change', handleFileSelect);
    uploadBtn.addEventListener('click', uploadFile);
    downloadBtn.addEventListener('click', downloadReport);

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        validateAndShowFile(file);
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('uploadArea').classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('uploadArea').classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById('uploadArea').classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        validateAndShowFile(files[0]);
    }
}

function validateAndShowFile(file) {
    // Validar tipo de arquivo
    const allowedTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    const allowedExtensions = ['.xlsx', '.xls'];
    
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        showError('Tipo de arquivo não permitido. Use apenas arquivos .xlsx ou .xls');
        return;
    }
    
    // Validar tamanho (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
        showError('Arquivo muito grande. O tamanho máximo é 50MB');
        return;
    }
    
    selectedFile = file;
    showFileInfo(file);
    hideError();
}

function showFileInfo(file) {
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    fileInfo.classList.remove('d-none');
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function uploadFile() {
    if (!selectedFile) {
        showError('Nenhum arquivo selecionado');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // Mostrar loading
    showLoading();
    hideError();
    hideSuccess();
    
    try {
        const response = await fetch('/api/analise/upload', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            downloadUrl = result.download_url;
            showResults(result.resumo);
            showSuccess('Arquivo processado com sucesso!');
            document.getElementById('downloadBtn').style.display = 'inline-block';
        } else {
            showError(result.error || 'Erro ao processar arquivo');
        }
        
    } catch (error) {
        showError('Erro de conexão: ' + error.message);
    } finally {
        hideLoading();
    }
}

function showResults(resumo) {
    const resultsSection = document.getElementById('resultsSection');
    
    // Preencher métricas principais
    document.getElementById('totalFornecedores').textContent = resumo.metricas_gerais.total_fornecedores;
    document.getElementById('totalItens').textContent = resumo.metricas_gerais.total_itens.toLocaleString('pt-BR');
    document.getElementById('valorTotal').textContent = formatCurrency(resumo.metricas_gerais.valor_total);
    document.getElementById('coberturaMedia').textContent = resumo.metricas_gerais.cobertura_media.toFixed(1);
    
    // Preencher distribuição por faixas
    const faixasDiv = document.getElementById('faixasDistribuicao');
    faixasDiv.innerHTML = `
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>✅ Até 44 dias</span>
                <span class="fw-bold">${resumo.distribuicao_faixas.ate_44_dias.quantidade} (${resumo.distribuicao_faixas.ate_44_dias.percentual.toFixed(1)}%)</span>
            </div>
            <div class="progress mb-2" style="height: 8px;">
                <div class="progress-bar bg-success" style="width: ${resumo.distribuicao_faixas.ate_44_dias.percentual}%"></div>
            </div>
        </div>
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>⚠️ Entre 45-70 dias</span>
                <span class="fw-bold">${resumo.distribuicao_faixas.entre_45_70_dias.quantidade} (${resumo.distribuicao_faixas.entre_45_70_dias.percentual.toFixed(1)}%)</span>
            </div>
            <div class="progress mb-2" style="height: 8px;">
                <div class="progress-bar bg-warning" style="width: ${resumo.distribuicao_faixas.entre_45_70_dias.percentual}%"></div>
            </div>
        </div>
        <div class="mb-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>❌ Acima de 71 dias</span>
                <span class="fw-bold">${resumo.distribuicao_faixas.acima_71_dias.quantidade} (${resumo.distribuicao_faixas.acima_71_dias.percentual.toFixed(1)}%)</span>
            </div>
            <div class="progress mb-2" style="height: 8px;">
                <div class="progress-bar bg-danger" style="width: ${resumo.distribuicao_faixas.acima_71_dias.percentual}%"></div>
            </div>
        </div>
    `;
    
    // Preencher recomendações
    const recomendacoesDiv = document.getElementById('recomendacoes');
    recomendacoesDiv.innerHTML = `
        <div class="row text-center">
            <div class="col-4">
                <div class="status-badge status-aprovar w-100 mb-2">
                    ✅ APROVAR
                </div>
                <div class="fw-bold">${resumo.recomendacoes.aprovar} fornecedores</div>
            </div>
            <div class="col-4">
                <div class="status-badge status-revisar w-100 mb-2">
                    ⚠️ REVISAR
                </div>
                <div class="fw-bold">${resumo.recomendacoes.revisar} fornecedores</div>
            </div>
            <div class="col-4">
                <div class="status-badge status-rejeitar w-100 mb-2">
                    ❌ REJEITAR
                </div>
                <div class="fw-bold">${resumo.recomendacoes.rejeitar} fornecedores</div>
            </div>
        </div>
        <div class="mt-3 text-center">
            <small class="text-muted">
                Economia potencial: <strong>${formatCurrency(resumo.recomendacoes.economia_potencial)}</strong>
            </small>
        </div>
    `;
    
    // Preencher informações das filiais
    const filiaisDiv = document.getElementById('filiaisInfo');
    let filiaisHtml = '<div class="row">';
    
    resumo.filiais.forEach(filial => {
        filiaisHtml += `
            <div class="col-md-6 mb-3">
                <div class="card border-0 bg-light">
                    <div class="card-body">
                        <h6 class="card-title">${filial.nome}</h6>
                        <div class="small text-muted">
                            <div>📦 ${filial.itens} itens</div>
                            <div>📅 ${filial.cobertura_media.toFixed(1)} dias (média)</div>
                            <div>💰 ${formatCurrency(filial.valor)}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    filiaisHtml += '</div>';
    filiaisDiv.innerHTML = filiaisHtml;
    
    // Mostrar seção de resultados
    resultsSection.classList.remove('d-none');
}

function downloadReport() {
    if (downloadUrl) {
        window.open(downloadUrl, '_blank');
    }
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('uploadBtn').disabled = true;
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('uploadBtn').disabled = false;
}

function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    errorAlert.classList.remove('d-none');
    
    // Auto-hide após 5 segundos
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    document.getElementById('errorAlert').classList.add('d-none');
}

function showSuccess(message) {
    const successAlert = document.getElementById('successAlert');
    const successMessage = document.getElementById('successMessage');
    
    successMessage.textContent = message;
    successAlert.classList.remove('d-none');
    
    // Auto-hide após 3 segundos
    setTimeout(() => {
        hideSuccess();
    }, 3000);
}

function hideSuccess() {
    document.getElementById('successAlert').classList.add('d-none');
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}
