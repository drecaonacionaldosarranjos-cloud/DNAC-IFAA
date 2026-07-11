// ===== SISTEMA DE GESTÃO MUSICAL IFAA =====
// Estado global da aplicação

const appState = {
    currentUser: null,
    currentRole: null,
    publications: [],
    messages: [],
    users: {
        'nacional': { name: 'Director Emiliano Cupaia Lumbungululo', role: 'Director Nacional', password: '1234' },
        'adjunto': { name: 'Mimoso Kambungo', role: 'Director Adjunto', password: '1234' },
        'secretario': { name: 'Eduardo Ngongoyove Gabriel', role: 'Secretário', password: '1234' },
        'literatura': { name: 'Bozzy Supia', role: 'Director da Correção de Literatura', password: '1234' },
        'compositor1': { name: 'João Silva', role: 'Compositor', password: '1234', provincia: 'Luanda', municipio: 'Viana' },
        'arranjador1': { name: 'Maria Santos', role: 'Arranjador', password: '1234', provincia: 'Bengo', municipio: 'Icolo e Bengo' }
    }
};

// ===== INICIALIZAÇÃO =====
function initApp() {
    const root = document.getElementById('root');
    if (!appState.currentUser) {
        root.innerHTML = renderLogin();
        setupLoginListeners();
    } else {
        root.innerHTML = renderDashboard();
        setupDashboardListeners();
    }
}

// ===== LOGIN =====
function renderLogin() {
    return `
        <div class="login-container">
            <div class="login-header">
                <h1>🎵 IFAA</h1>
                <p>Sistema de Gestão Musical</p>
                <p style="font-size: 12px; margin-top: 10px; color: #999;">Direção Nacional dos Arranjos e Composição</p>
            </div>
            <form id="loginForm">
                <div class="form-group">
                    <label>Selecione sua função:</label>
                    <select id="roleSelect" required>
                        <option value="">-- Escolha uma função --</option>
                        <option value="nacional">Director Nacional</option>
                        <option value="adjunto">Director Adjunto</option>
                        <option value="secretario">Secretário</option>
                        <option value="literatura">Director da Correção de Literatura</option>
                        <option value="compositor1">Compositor</option>
                        <option value="arranjador1">Arranjador</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Senha:</label>
                    <input type="password" id="passwordInput" placeholder="Digite a senha" required>
                </div>
                <button type="submit" class="btn-login">Entrar no Sistema</button>
            </form>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #999;">
                <p><strong>Credenciais de demonstração:</strong></p>
                <p>Função: Qualquer uma acima</p>
                <p>Senha: 1234</p>
            </div>
        </div>
    `;
}

function setupLoginListeners() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.getElementById('roleSelect').value;
        const password = document.getElementById('passwordInput').value;
        
        const user = appState.users[role];
        if (user && user.password === password) {
            appState.currentUser = user.name;
            appState.currentRole = user.role;
            initApp();
        } else {
            alert('Credenciais inválidas!');
        }
    });
}

// ===== DASHBOARD PRINCIPAL =====
function renderDashboard() {
    const userInfo = appState.users[Object.keys(appState.users).find(k => appState.users[k].name === appState.currentUser)];
    
    return `
        <div class="dashboard-wrapper">
            ${renderHeader()}
            ${renderWelcomeBanner(userInfo)}
            <div class="main-content">
                <div class="dashboard-layout">
                    ${renderSidebar()}
                    <div class="content-area" id="mainContent">
                        ${renderDashboardContent()}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderHeader() {
    return `
        <div class="header">
            <div class="header-content">
                <div class="header-title">Direção Nacional dos Arranjos e Composição da Igreja Fé Apostólica Americana em Angola</div>
                <div class="header-user">
                    <div class="user-badge">${appState.currentRole}</div>
                    <button class="btn-logout" onclick="logout()">Sair</button>
                </div>
            </div>
        </div>
    `;
}

function renderWelcomeBanner(userInfo) {
    return `
        <div class="welcome-banner">
            <h2>🙏 Seja bem-vindo ao Trabalho do Nosso Grande Deus</h2>
            <p><strong>${userInfo.name}</strong> - ${userInfo.role}</p>
        </div>
    `;
}

function renderSidebar() {
    let menuItems = '';
    
    if (['Director Nacional', 'Director Adjunto', 'Secretário'].includes(appState.currentRole)) {
        menuItems = `
            <li class="nav-item"><a class="nav-link active" onclick="switchTab('dashboard')"><span class="nav-icon">📊</span>Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('arranjos')"><span class="nav-icon">🎼</span>Arranjos</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('composicoes')"><span class="nav-icon">✍️</span>Composições</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('traducoes')"><span class="nav-icon">🌐</span>Traduções</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('revisao')"><span class="nav-icon">📝</span>Revisão</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('aprovacao')"><span class="nav-icon">✅</span>Aprovação</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('chat')"><span class="nav-icon">💬</span>Chat</a></li>
            ${appState.currentRole === 'Secretário' ? '<li class="nav-item"><a class="nav-link" onclick="switchTab('relatorios')"><span class="nav-icon">📑</span>Relatórios</a></li>' : ''}
        `;
    } else if (appState.currentRole === 'Director da Correção de Literatura') {
        menuItems = `
            <li class="nav-item"><a class="nav-link active" onclick="switchTab('dashboard')"><span class="nav-icon">📊</span>Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('minhasrevisoes')"><span class="nav-icon">📝</span>Minhas Revisões</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('chat')"><span class="nav-icon">💬</span>Chat</a></li>
        `;
    } else if (['Compositor', 'Arranjador'].includes(appState.currentRole)) {
        menuItems = `
            <li class="nav-item"><a class="nav-link active" onclick="switchTab('dashboard')"><span class="nav-icon">📊</span>Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('minhascontribuicoes')"><span class="nav-icon">📤</span>Minhas Contribuições</a></li>
            <li class="nav-item"><a class="nav-link" onclick="switchTab('chat')"><span class="nav-icon">💬</span>Chat</a></li>
        `;
    }
    
    return `
        <div class="sidebar">
            <div class="sidebar-title">📍 Menu</div>
            <ul class="nav-menu">
                ${menuItems}
            </ul>
        </div>
    `;
}

function renderDashboardContent() {
    if (['Director Nacional', 'Director Adjunto', 'Secretário'].includes(appState.currentRole)) {
        return `
            <div id="dashboard" class="tab-content active">
                <h2 class="section-title">📊 Dashboard de Controle</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 10px;">📚</div>
                        <div style="font-size: 24px; font-weight: 700; margin-bottom: 5px;" id="totalArranjos">0</div>
                        <div style="font-size: 13px; opacity: 0.9;">Total de Arranjos</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 10px;">🎵</div>
                        <div style="font-size: 24px; font-weight: 700; margin-bottom: 5px;" id="totalComposicoes">0</div>
                        <div style="font-size: 13px; opacity: 0.9;">Total de Composições</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 10px;">✅</div>
                        <div style="font-size: 24px; font-weight: 700; margin-bottom: 5px;" id="totalAprovados">0</div>
                        <div style="font-size: 13px; opacity: 0.9;">Aprovados</div>
                    </div>
                </div>
                ${renderAllPublications()}
            </div>
            <div id="arranjos" class="tab-content">
                <h2 class="section-title">🎼 Arranjos</h2>
                ${renderAllPublications()}
            </div>
            <div id="composicoes" class="tab-content">
                <h2 class="section-title">✍️ Composições</h2>
                ${renderAllPublications()}
            </div>
            <div id="traducoes" class="tab-content">
                <h2 class="section-title">🌐 Traduções</h2>
                <p style="color: #999; text-align: center; padding: 40px;">Nenhuma tradução registrada no momento.</p>
            </div>
            <div id="revisao" class="tab-content">
                <h2 class="section-title">📝 Revisão da Letra</h2>
                ${renderAllPublications()}
            </div>
            <div id="aprovacao" class="tab-content">
                <h2 class="section-title">✅ Aprovação da Composição</h2>
                ${renderAllPublications()}
            </div>
            <div id="chat" class="tab-content">
                <h2 class="section-title">💬 Chat em Tempo Real</h2>
                ${renderChat()}
            </div>
            ${appState.currentRole === 'Secretário' ? `<div id="relatorios" class="tab-content">
                <h2 class="section-title">📑 Relatórios</h2>
                ${renderRelatorios()}
            </div>` : ''}
        `;
    } else if (appState.currentRole === 'Director da Correção de Literatura') {
        return `
            <div id="dashboard" class="tab-content active">
                <h2 class="section-title">📊 Minhas Atribuições</h2>
                ${renderAllPublications()}
            </div>
            <div id="minhasrevisoes" class="tab-content">
                <h2 class="section-title">📝 Minhas Revisões</h2>
                ${renderRevisaoLiteratura()}
            </div>
            <div id="chat" class="tab-content">
                <h2 class="section-title">💬 Chat em Tempo Real</h2>
                ${renderChat()}
            </div>
        `;
    } else if (['Compositor', 'Arranjador'].includes(appState.currentRole)) {
        return `
            <div id="dashboard" class="tab-content active">
                <h2 class="section-title">📊 Meu Perfil</h2>
                ${renderPerfilCompositorArranjador()}
            </div>
            <div id="minhascontribuicoes" class="tab-content">
                <h2 class="section-title">📤 Minhas Contribuições</h2>
                ${renderFormularioEnvio()}
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
                ${renderMinhasPublications()}
            </div>
            <div id="chat" class="tab-content">
                <h2 class="section-title">💬 Chat em Tempo Real</h2>
                ${renderChat()}
            </div>
        `;
    }
}

// ===== RENDERIZAÇÕES ESPECÍFICAS =====

function renderPerfilCompositorArranjador() {
    const user = appState.users[Object.keys(appState.users).find(k => appState.users[k].name === appState.currentUser)];
    return `
        <div class="form-section">
            <div class="form-section-title">Dados Pessoais</div>
            <div class="form-row">
                <div class="form-group">
                    <label>Nome Completo</label>
                    <input type="text" value="${user.name}" disabled style="background: #e9ecef;">
                </div>
                <div class="form-group">
                    <label>Função</label>
                    <input type="text" value="${user.role}" disabled style="background: #e9ecef;">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Telefone</label>
                    <input type="tel" value="${user.telefone || '+244 923 456 789'}" disabled style="background: #e9ecef;">
                </div>
                <div class="form-group">
                    <label>Província</label>
                    <input type="text" value="${user.provincia || ''}" disabled style="background: #e9ecef;">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Município</label>
                    <input type="text" value="${user.municipio || ''}" disabled style="background: #e9ecef;">
                </div>
            </div>
        </div>
    `;
}

function renderFormularioEnvio() {
    const isCompositor = appState.currentRole === 'Compositor';
    return `
        <div class="form-section">
            <div class="form-section-title">📤 ${isCompositor ? 'Enviar Composição' : 'Enviar Arranjo'}</div>
            <form id="submitForm" onsubmit="submitPublicacao(event)">
                <div class="form-row full">
                    <div class="form-group">
                        <label>Título da Canção *</label>
                        <input type="text" id="songTitle" placeholder="Digite o título da canção" required>
                    </div>
                </div>
                
                <div class="form-row full">
                    <div class="form-group">
                        <label>Pessoa que Trabalhou a Pauta *</label>
                        <input type="text" id="workPerson" placeholder="Nome da pessoa" required>
                    </div>
                </div>
                
                ${!isCompositor ? `
                <div class="form-row full">
                    <div class="form-group">
                        <label>Letra da Composição</label>
                        <textarea id="lyrics" placeholder="Cole ou digite a letra aqui..."></textarea>
                    </div>
                </div>
                ` : ''}
                
                <div class="form-section-title" style="margin-top: 20px;">📄 Pauta (PDF, Word ou Imagem)</div>
                <div class="upload-area" id="sheetUploadArea" ondrop="handleDrop(event, 'sheet')" ondragover="handleDragOver(event)">
                    <div class="upload-icon">📄</div>
                    <div class="upload-text">Arraste a pauta ou clique para selecionar</div>
                    <div class="upload-hint">Formatos: PDF, DOC, DOCX, JPG, PNG (máx 10MB)</div>
                    <input type="file" id="sheetInput" class="file-input" accept=".pdf,.doc,.docx,.jpg,.png" onchange="handleFileSelect(event, 'sheet')">
                </div>
                <div id="sheetPreview"></div>
                
                <div class="form-section-title" style="margin-top: 20px;">🎵 Áudio</div>
                <div class="upload-area" id="audioUploadArea" ondrop="handleDrop(event, 'audio')" ondragover="handleDragOver(event)">
                    <div class="upload-icon">🎵</div>
                    <div class="upload-text">Arraste o áudio ou clique para selecionar</div>
                    <div class="upload-hint">Formatos: MP3, WAV, OGG (máx 50MB)</div>
                    <input type="file" id="audioInput" class="file-input" accept=".mp3,.wav,.ogg" onchange="handleFileSelect(event, 'audio')">
                </div>
                <div id="audioPreview"></div>
                
                <div class="btn-group">
                    <button type="submit" class="btn btn-primary btn-block">📤 Enviar Contribuição</button>
                    <button type="reset" class="btn btn-secondary btn-block">🔄 Limpar</button>
                </div>
            </form>
        </div>
    `;
}

function renderRevisaoLiteratura() {
    return `
        <div style="display: grid; gap: 20px;">
            ${appState.publications.filter(p => p.status === 'pending').map((pub, idx) => `
                <div class="publication-card">
                    <div class="publication-header">
                        <div>
                            <div class="publication-title">🎵 ${pub.title}</div>
                            <div class="publication-meta">
                                <span>👤 ${pub.author}</span>
                                <span>📅 ${new Date(pub.date).toLocaleDateString('pt-AO')}</span>
                                <span class="status-badge status-in-review">Em Revisão</span>
                            </div>
                        </div>
                    </div>
                    <div class="publication-body">
                        <div style="margin-bottom: 15px;">
                            <strong>Letra Original:</strong>
                            <p style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 8px; max-height: 150px; overflow-y: auto;">${pub.lyrics || 'Sem letra'}</p>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <strong>Minha Revisão:</strong>
                            <textarea id="revision_${idx}" placeholder="Digite sua revisão da letra..." style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; min-height: 100px; font-family: monospace; font-size: 13px;"></textarea>
                        </div>
                        ${pub.audio ? `
                        <div style="margin-bottom: 15px;">
                            <strong>🎵 Áudio:</strong>
                            <div class="audio-player">
                                <audio controls>
                                    <source src="${pub.audio}" type="audio/mpeg">
                                    Seu navegador não suporta áudio HTML5.
                                </audio>
                            </div>
                        </div>
                        ` : ''}
                        <div class="btn-group">
                            <button class="btn btn-success" onclick="approveWithRevision(${idx})">✅ Aprovar Revisão</button>
                            <button class="btn btn-danger" onclick="rejectRevision(${idx})">❌ Rejeitar</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderMinhasPublications() {
    return `
        <div style="display: grid; gap: 20px;">
            ${appState.publications.filter(p => p.author === appState.currentUser).map((pub, idx) => `
                <div class="publication-card">
                    <div class="publication-header">
                        <div>
                            <div class="publication-title">🎵 ${pub.title}</div>
                            <div class="publication-meta">
                                <span>📅 ${new Date(pub.date).toLocaleDateString('pt-AO')}</span>
                                <span class="status-badge ${pub.status === 'approved' ? 'status-approved' : pub.status === 'rejected' ? 'status-rejected' : 'status-pending'}">${pub.status === 'approved' ? '✅ Aprovado' : pub.status === 'rejected' ? '❌ Rejeitado' : '⏳ Pendente'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="publication-body">
                        <p><strong>Pauta de:</strong> ${pub.workPerson}</p>
                        <p style="color: #666; font-size: 13px; margin-top: 8px;">Status: ${pub.status === 'approved' ? 'Publicação aprovada' : pub.status === 'rejected' ? 'Não foi aprovado' : 'Aguardando revisão'}</p>
                        ${pub.audio ? `
                        <div style="margin-top: 15px;">
                            <strong>🎵 Áudio:</strong>
                            <div class="audio-player">
                                <audio controls>
                                    <source src="${pub.audio}" type="audio/mpeg">
                                    Seu navegador não suporta áudio HTML5.
                                </audio>
                            </div>
                        </div>
                        ` : ''}
                        ${pub.literatureComment ? `
                        <div style="margin-top: 15px; background: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; border-radius: 6px;">
                            <strong>💬 Comentário do Dr. Literatura:</strong>
                            <p style="margin-top: 8px; font-size: 13px;">${pub.literatureComment}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
            ${appState.publications.filter(p => p.author === appState.currentUser).length === 0 ? `
                <p style="color: #999; text-align: center; padding: 40px;">Você ainda não enviou nenhuma contribuição.</p>
            ` : ''}
        </div>
    `;
}

function renderAllPublications() {
    return `
        <div style="display: grid; gap: 20px;">
            ${appState.publications.map((pub, idx) => `
                <div class="publication-card">
                    <div class="publication-header">
                        <div>
                            <div class="publication-title">🎵 ${pub.title}</div>
                            <div class="publication-meta">
                                <span>👤 ${pub.author}</span>
                                <span>📅 ${new Date(pub.date).toLocaleDateString('pt-AO')}</span>
                                <span class="status-badge ${pub.status === 'approved' ? 'status-approved' : pub.status === 'rejected' ? 'status-rejected' : 'status-pending'}">${
                                    pub.status === 'approved' ? '✅ Aprovado' : 
                                    pub.status === 'rejected' ? '❌ Rejeitado' : 
                                    pub.status === 'reviewing' ? '👀 Em Revisão' :
                                    '⏳ Pendente'
                                }</span>
                            </div>
                        </div>
                    </div>
                    <div class="publication-body">
                        <p><strong>Pauta de:</strong> ${pub.workPerson}</p>
                        ${pub.audio ? `
                        <div style="margin-top: 15px;">
                            <strong>🎵 Áudio:</strong>
                            <div class="audio-player">
                                <audio controls>
                                    <source src="${pub.audio}" type="audio/mpeg">
                                    Seu navegador não suporta áudio HTML5.
                                </audio>
                            </div>
                        </div>
                        ` : ''}
                        ${pub.literatureComment && appState.currentRole === 'Director da Correção de Literatura' ? `
                        <div style="margin-top: 15px; background: #f0f4ff; padding: 15px; border-left: 4px solid #667eea; border-radius: 6px;">
                            <strong>💬 Minha Revisão:</strong>
                            <p style="margin-top: 8px; font-size: 13px;">${pub.literatureComment}</p>
                        </div>
                        ` : pub.literatureComment ? `
                        <div style="margin-top: 15px; background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 6px;">
                            <strong>💬 Revisão do Dr. Literatura:</strong>
                            <p style="margin-top: 8px; font-size: 13px;">${pub.literatureComment}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
            ${appState.publications.length === 0 ? `
                <p style="color: #999; text-align: center; padding: 40px;">Nenhuma publicação registrada no momento.</p>
            ` : ''}
        </div>
    `;
}

function renderChat() {
    return `
        <div class="chat-container">
            <div class="chat-messages" id="chatMessages">
                ${appState.messages.map(msg => `
                    <div class="message ${msg.sender === appState.currentUser ? 'sent' : 'received'}">
                        <div>
                            <div class="message-bubble">${msg.text}</div>
                            <div class="message-time" style="text-align: ${msg.sender === appState.currentUser ? 'right' : 'left'};">${msg.time}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="chat-input">
                <input type="text" id="chatInput" placeholder="Digite sua mensagem..." onkeypress="handleChatKeypress(event)">
                <button onclick="sendChatMessage()">Enviar</button>
            </div>
        </div>
    `;
}

function renderRelatorios() {
    return `
        <div class="form-section">
            <div class="form-section-title">📊 Gerar Relatório</div>
            <div class="form-row">
                <div class="form-group">
                    <label>Tipo de Relatório:</label>
                    <select id="reportType">
                        <option value="geral">Relatório Geral</option>
                        <option value="aprovacoes">Relatório de Aprovações</option>
                        <option value="contributors">Relatório de Contribuidores</option>
                        <option value="timeline">Linha Temporal</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Período:</label>
                    <select id="reportPeriod">
                        <option value="mes">Este Mês</option>
                        <option value="trimestre">Este Trimestre</option>
                        <option value="ano">Este Ano</option>
                        <option value="custom">Personalizado</option>
                    </select>
                </div>
            </div>
            <div class="btn-group">
                <button class="btn btn-primary" onclick="generateReport()">📊 Gerar Relatório</button>
                <button class="btn btn-info" onclick="exportReportPDF()">📥 Exportar PDF</button>
            </div>
        </div>
        
        <div style="margin-top: 30px;">
            <h3 style="color: #333; margin-bottom: 15px;">📋 Relatórios Recentes</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Período</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${new Date().toLocaleDateString('pt-AO')}</td>
                            <td>Relatório Geral</td>
                            <td>Julho 2026</td>
                            <td><button class="btn btn-sm btn-info">Ver</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ===== FUNCIONALIDADES =====

function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeTab = document.getElementById(tabName);
    if (activeTab) activeTab.classList.add('active');
    
    const activeBtn = event.target;
    if (activeBtn && activeBtn.classList) activeBtn.classList.add('active');
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    event.target.classList.add('dragover');
}

function handleDrop(e, type) {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById(`${type}UploadArea`).classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById(`${type}Input`).files = files;
        handleFileSelect({target: {files: files}}, type);
    }
}

function handleFileSelect(event, type) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewDiv = document.getElementById(`${type}Preview`);
        let previewHTML = `
            <div class="file-preview">
                <div class="file-icon">${type === 'sheet' ? '📄' : '🎵'}</div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button class="file-remove" onclick="removeFile('${type}')">Remover</button>
            </div>
        `;
        
        if (type === 'audio') {
            previewHTML += `
                <div class="audio-player">
                    <audio controls>
                        <source src="${e.target.result}" type="${file.type}">
                        Seu navegador não suporta áudio HTML5.
                    </audio>
                </div>
            `;
        }
        
        previewDiv.innerHTML = previewHTML;
    };
    reader.readAsDataURL(file);
}

function removeFile(type) {
    document.getElementById(`${type}Input`).value = '';
    document.getElementById(`${type}Preview`).innerHTML = '';
}

function submitPublicacao(event) {
    event.preventDefault();
    
    const title = document.getElementById('songTitle').value;
    const workPerson = document.getElementById('workPerson').value;
    const lyrics = document.getElementById('lyrics')?.value || '';
    const sheetFile = document.getElementById('sheetInput').files[0];
    const audioFile = document.getElementById('audioInput').files[0];
    
    if (!title || !workPerson) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newPublication = {
            title: title,
            author: appState.currentUser,
            workPerson: workPerson,
            lyrics: lyrics,
            audio: e.target.result,
            date: new Date(),
            status: 'pending',
            literatureComment: ''
        };
        
        appState.publications.push(newPublication);
        alert('✅ Contribuição enviada com sucesso!');
        document.getElementById('submitForm').reset();
        document.getElementById('sheetPreview').innerHTML = '';
        document.getElementById('audioPreview').innerHTML = '';
        updateDashboard();
    };
    
    if (audioFile) {
        reader.readAsDataURL(audioFile);
    } else {
        const newPublication = {
            title: title,
            author: appState.currentUser,
            workPerson: workPerson,
            lyrics: lyrics,
            audio: null,
            date: new Date(),
            status: 'pending',
            literatureComment: ''
        };
        
        appState.publications.push(newPublication);
        alert('✅ Contribuição enviada com sucesso!');
        document.getElementById('submitForm').reset();
        document.getElementById('sheetPreview').innerHTML = '';
        updateDashboard();
    }
}

function approveWithRevision(idx) {
    const revision = document.getElementById(`revision_${idx}`).value;
    if (!revision.trim()) {
        alert('Por favor, digite a revisão!');
        return;
    }
    
    appState.publications[idx].literatureComment = revision;
    appState.publications[idx].status = 'reviewing';
    alert('✅ Revisão enviada! Aguardando aprovação do Director Nacional.');
    updateDashboard();
}

function rejectRevision(idx) {
    if (confirm('Tem certeza que deseja rejeitar esta publicação?')) {
        appState.publications[idx].status = 'rejected';
        alert('❌ Publicação rejeitada.');
        updateDashboard();
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    
    if (text) {
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        
        appState.messages.push({
            sender: appState.currentUser,
            text: text,
            time: time
        });
        
        input.value = '';
        updateDashboard();
        
        setTimeout(() => {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

function generateReport() {
    const type = document.getElementById('reportType').value;
    const period = document.getElementById('reportPeriod').value;
    alert(`📊 Relatório ${type} gerado para o período: ${period}`);
}

function exportReportPDF() {
    alert('📥 Exportando relatório em PDF...');
}

function updateDashboard() {
    const root = document.getElementById('root');
    root.innerHTML = renderDashboard();
    setupDashboardListeners();
}

function setupDashboardListeners() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update stats
    const arranjos = appState.publications.filter(p => p.author).length;
    document.getElementById('totalArranjos').textContent = arranjos;
    document.getElementById('totalComposicoes').textContent = arranjos;
    document.getElementById('totalAprovados').textContent = appState.publications.filter(p => p.status === 'approved').length;
}

function logout() {
    appState.currentUser = null;
    appState.currentRole = null;
    initApp();
}

// ===== INICIAR APLICAÇÃO =====
initApp();
