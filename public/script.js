let filtroAtual = 'todas';
let funcionariosMap = {};
const prioridadeMap = { 1: 'Baixa', 2: 'Média', 3: 'Alta', 4: 'Crítica' };

async function carregarFuncionarios() {
    try {
    const response = await fetch('/api/funcionarios');
    const funcionarios = await response.json();
    funcionariosMap = {};
    funcionarios.forEach(f => {
        funcionariosMap[f.funcionario_id] = f.nome;
    });
    const tbody = document.getElementById('corpoFuncionarios');

    if (funcionarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum funcionário</td></tr>';
        return;
    }

    tbody.innerHTML = funcionarios.map(f => `
        <tr>
        <td>${f.nome}</td>
        <td>${f.email}</td>
        <td>
            <button class="btn-small" onclick="abrirModalEditarFuncionario(${f.funcionario_id}, '${f.nome}', '${f.email}')">Editar</button>
            <button class="btn-small btn-danger" onclick="deletarFuncionario(${f.funcionario_id})">Deletar</button>
        </td>
        </tr>
    `).join('');
    } catch (error) {
    console.error('Erro:', error);
    }
}

async function carregarTarefas(endpoint = '/api/tarefas') {
    try {
    const response = await fetch(endpoint);
    const tarefas = await response.json();
    const tbody = document.getElementById('corpoTarefas');

    if (tarefas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">Nenhuma tarefa</td></tr>';
        return;
    }

    tbody.innerHTML = tarefas.map(t => {
      const status = t.status || 'pendente';
      const statusBtn = status === 'concluida' ? '✅ Concluída' : '⏳ Pendente';
      return `<tr>
        <td>${t.nomeTarefa}</td>
        <td>${t.descricaoTarefa}</td>
        <td>${t.prazoTarefa}</td>
        <td>${prioridadeMap[t.prioridadeTarefa] || 'N/A'}</td>
        <td>${t.funcionario_id ? funcionariosMap[t.funcionario_id] || 'Desconhecido' : 'N/A'}</td>
        <td><button class="btn-small" onclick="toggleStatusTarefa(${t.tarefa_id}, '${status}')">${statusBtn}</button></td>
        <td>
            <button class="btn-small" onclick="abrirModalEditarTarefa(${t.tarefa_id}, '${t.nomeTarefa}', '${t.descricaoTarefa}', '${t.prazoTarefa}', ${t.prioridadeTarefa}, ${t.funcionario_id || 'null'})">Editar</button>
            <button class="btn-small btn-danger" onclick="deletarTarefa(${t.tarefa_id})">Deletar</button>
        </td>
        </tr>`;
    }).join('');
    } catch (error) {
    console.error('Erro:', error);
    }
}

async function deletarFuncionario(id) {
    if (!confirm('Tem certeza que deseja deletar este funcionário?')) return;
    try {
    const response = await fetch(`/api/funcionarios/${id}`, { method: 'DELETE' });
    if (response.ok) {
        carregarFuncionarios();
    } else {
        alert('Erro ao deletar funcionário');
    }
    } catch (error) {
    console.error('Erro:', error);
    }
}

async function deletarTarefa(id) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;
    try {
    const response = await fetch(`/api/tarefas/${id}`, { method: 'DELETE' });
    if (response.ok) {
        carregarTarefas(`/api/tarefas/${filtroAtual === 'todas' ? '' : filtroAtual}`);
    } else {
        alert('Erro ao deletar tarefa');
    }
    } catch (error) {
    console.error('Erro:', error);
    }
}

async function abrirModalEditarFuncionario(id, nome, email) {
    document.getElementById('editarFuncionarioId').value = id;
    document.getElementById('editarNomeFuncionario').value = nome;
    document.getElementById('editarEmailFuncionario').value = email;
    document.getElementById('modalEditarFuncionario').style.display = 'block';
}

async function abrirModalEditarTarefa(id, nomeTarefa, descricao, prazo, prioridade, responsavelId) {
    document.getElementById('editarTarefaId').value = id;
    document.getElementById('editarNomeTarefa').value = nomeTarefa;
    document.getElementById('editarDescricaoTarefa').value = descricao;
    document.getElementById('editarPrazoTarefa').value = prazo;
    document.getElementById('editarPrioridadeTarefa').value = prioridade;
    document.getElementById('editarResponsavelTarefa').value = responsavelId || '';
    document.getElementById('modalEditarTarefa').style.display = 'block';
}

function fecharModais() {
    document.getElementById('modalEditarFuncionario').style.display = 'none';
    document.getElementById('modalEditarTarefa').style.display = 'none';
}

document.getElementById('formFuncionario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nomeFuncionario').value;
    const email = document.getElementById('emailFuncionario').value;
    const msgDiv = document.getElementById('msgFuncionario');

    try {
    const response = await fetch('/api/funcionarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email })
    });

    if (response.ok) {
        msgDiv.innerHTML = '<p class="success">Funcionário criado!</p>';
        document.getElementById('formFuncionario').reset();
        carregarFuncionarios();
        setTimeout(() => msgDiv.innerHTML = '', 3000);
    } else {
        msgDiv.innerHTML = '<p class="error">Erro ao criar funcionário</p>';
    }
    } catch (error) {
    msgDiv.innerHTML = '<p class="error">Erro ao criar funcionário</p>';
    }
});

document.getElementById('formEditarFuncionario').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editarFuncionarioId').value;
    const nome = document.getElementById('editarNomeFuncionario').value;
    const email = document.getElementById('editarEmailFuncionario').value;

    try {
    const response = await fetch(`/api/funcionarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email })
    });

    if (response.ok) {
        carregarFuncionarios();
        fecharModais();
    } else {
        alert('Erro ao atualizar funcionário');
    }
    } catch (error) {
    console.error('Erro:', error);
    }
});

document.getElementById('formTarefa').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nomeTarefa = document.getElementById('nomeTarefa').value;
    const descricaoTarefa = document.getElementById('descricaoTarefa').value;
    const prazoTarefa = document.getElementById('prazoTarefa').value;
    const prioridadeTarefa = parseInt(document.getElementById('prioridadeTarefa').value);
    const funcionario_id = parseInt(document.getElementById('responsavelTarefa').value) || null;
    const msgDiv = document.getElementById('msgTarefa');

    try {
    const response = await fetch('/api/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id })
    });

    if (response.ok) {
        msgDiv.innerHTML = '<p class="success">Tarefa criada!</p>';
        document.getElementById('formTarefa').reset();
        carregarTarefas();
        setTimeout(() => msgDiv.innerHTML = '', 3000);
    } else {
        msgDiv.innerHTML = '<p class="error">Erro ao criar tarefa</p>';
    }
    } catch (error) {
    msgDiv.innerHTML = '<p class="error">Erro ao criar tarefa</p>';
    }
});

document.getElementById('formEditarTarefa').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editarTarefaId').value;
    const nomeTarefa = document.getElementById('editarNomeTarefa').value;
    const descricaoTarefa = document.getElementById('editarDescricaoTarefa').value;
    const prazoTarefa = document.getElementById('editarPrazoTarefa').value;
    const prioridadeTarefa = parseInt(document.getElementById('editarPrioridadeTarefa').value);
    const funcionario_id = parseInt(document.getElementById('editarResponsavelTarefa').value) || null;

    try {
    const response = await fetch(`/api/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomeTarefa, descricaoTarefa, prazoTarefa, prioridadeTarefa, funcionario_id })
    });

    if (response.ok) {
        carregarTarefas(`/api/tarefas/${filtroAtual === 'todas' ? '' : filtroAtual}`);
        fecharModais();
    } else {
        alert('Erro ao atualizar tarefa');
    }
    } catch (error) {
    console.error('Erro:', error);
    }
});

document.getElementById('btnTodasTarefas').addEventListener('click', () => {
    filtroAtual = 'todas';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    carregarTarefas('/api/tarefas');
});

document.getElementById('btnTarefasAndamento').addEventListener('click', () => {
    filtroAtual = 'em-andamento';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    carregarTarefas('/api/tarefas/em-andamento');
});

document.getElementById('btnTarefasConcluidas').addEventListener('click', () => {
    filtroAtual = 'concluidas';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    carregarTarefas('/api/tarefas/concluidas');
});

document.getElementById('btnTarefasAtrasadas').addEventListener('click', () => {
    filtroAtual = 'atrasadas';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    carregarTarefas('/api/tarefas/atrasadas');
});

document.getElementById('btnTarefasProximas').addEventListener('click', () => {
    filtroAtual = 'proximas';
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    carregarTarefas('/api/tarefas/proximas');
});

document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', fecharModais);
});

window.addEventListener('click', (e) => {
    const modalFuncionario = document.getElementById('modalEditarFuncionario');
    const modalTarefa = document.getElementById('modalEditarTarefa');
    if (e.target === modalFuncionario) modalFuncionario.style.display = 'none';
    if (e.target === modalTarefa) modalTarefa.style.display = 'none';
});

async function carregarFuncionariosParaSelect() {
    try {
    const response = await fetch('/api/funcionarios');
    const funcionarios = await response.json();
    const optionsHtml = '<option value="">Sem responsável</option>' +
        funcionarios.map(f => `<option value="${f.funcionario_id}">${f.nome}</option>`).join('');

    document.getElementById('responsavelTarefa').innerHTML = optionsHtml;
    document.getElementById('editarResponsavelTarefa').innerHTML = optionsHtml;
    } catch (error) {
    console.error('Erro:', error);
    }
}

async function carregarKPIs() {
  try {
    const response = await fetch('/api/kpis');
    const data = await response.json();
    document.getElementById('kpiTaxaConclusao').textContent = data.taxaConclusao + '%';
    document.getElementById('kpiAtrasadas').textContent = data.tarefasAtrasadas;
  } catch (error) {
    console.error('Erro ao carregar KPIs:', error);
  }
}

async function toggleStatusTarefa(id, statusAtual) {
  const novoStatus = statusAtual === 'pendente' ? 'concluida' : 'pendente';
  try {
    const response = await fetch(`/api/tarefas/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: novoStatus })
    });
    if (response.ok) {
      carregarTarefas();
      carregarKPIs();
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

carregarFuncionarios();
carregarTarefas();
carregarFuncionariosParaSelect();
carregarKPIs();
