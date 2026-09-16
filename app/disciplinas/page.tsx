"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Subject = {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "Ativa" | "Inativa";
};

type Association = {
  id: number;
  subjectId: number;
  className: string;
  workload: string;
  teacher: string;
  coordinator: boolean;
};

const initialSubjects: Subject[] = [
  { id: 1, code: "MAT", name: "Matemática", description: "Matemática do ensino básico", status: "Ativa" },
  { id: 2, code: "POR", name: "Português", description: "Língua Portuguesa e Literatura", status: "Ativa" },
  { id: 3, code: "ING", name: "Inglês", description: "Língua Inglesa", status: "Ativa" },
  { id: 4, code: "HIS", name: "História", description: "História de Portugal e do Mundo", status: "Ativa" },
  { id: 5, code: "GEO", name: "Geografia", description: "Geografia Física e Humana", status: "Ativa" },
  { id: 6, code: "CIE", name: "Ciências Naturais", description: "Ciências da Natureza", status: "Ativa" },
  { id: 7, code: "FIS", name: "Físico-Química", description: "Física e Química", status: "Ativa" },
  { id: 8, code: "EDF", name: "Educação Física", description: "Atividade física e desportiva", status: "Ativa" },
];

const initialAssociations: Association[] = [
  { id: 1, subjectId: 1, className: "9.º A", workload: "4 h/semana", teacher: "João Silva", coordinator: true },
  { id: 2, subjectId: 1, className: "9.º B", workload: "4 h/semana", teacher: "Maria Santos", coordinator: false },
  { id: 3, subjectId: 1, className: "8.º A", workload: "5 h/semana", teacher: "Pedro Costa", coordinator: false },
  { id: 4, subjectId: 1, className: "8.º B", workload: "5 h/semana", teacher: "Ana Ferreira", coordinator: true },
  { id: 5, subjectId: 2, className: "9.º A", workload: "4 h/semana", teacher: "Carlos Mendes", coordinator: true },
  { id: 6, subjectId: 2, className: "9.º B", workload: "4 h/semana", teacher: "Rita Fernandes", coordinator: false },
  { id: 7, subjectId: 2, className: "8.º A", workload: "4 h/semana", teacher: "Carlos Mendes", coordinator: true },
  { id: 8, subjectId: 3, className: "9.º A", workload: "3 h/semana", teacher: "Ana Ferreira", coordinator: true },
  { id: 9, subjectId: 3, className: "8.º B", workload: "3 h/semana", teacher: "Rita Fernandes", coordinator: false },
];

const menu = [
  ["🏠", "Dashboard", "/dashboard"],
  ["👥", "Utilizadores", "/utilizadores"],
  ["📚", "Turmas", "/turmas"],
  ["🎓", "Alunos", "/alunos"],
  ["👨‍🏫", "Professores", "/professor"],
  ["🏫", "Salas", "/salas"],
  ["📅", "Horários", "#"],
  ["💻", "PCs", "/computadores"],
  ["✅", "Presenças", "/presencas"],
  ["▦", "QR Codes", "/qr-code"],
  ["📊", "Relatórios", "/relatorios"],
  ["⚙️", "Configurações", "#"],
  ["📋", "Logs", "#"],
];

export default function Disciplinas() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [associations, setAssociations] = useState<Association[]>(initialAssociations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [associationSubjectFilter, setAssociationSubjectFilter] = useState("Todas");
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(1);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showAssociationForm, setShowAssociationForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [viewSubject, setViewSubject] = useState<Subject | null>(null);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subjectStatus, setSubjectStatus] = useState<Subject["status"]>("Ativa");

  const [className, setClassName] = useState("");
  const [associationSubjectId, setAssociationSubjectId] = useState("");
  const [workload, setWorkload] = useState("");
  const [teacher, setTeacher] = useState("");
  const [coordinator, setCoordinator] = useState(false);

  const filteredSubjects = useMemo(
    () =>
      subjects.filter((subject) => {
        const q = search.toLowerCase().trim();
        const matchesSearch =
          !q ||
          subject.code.toLowerCase().includes(q) ||
          subject.name.toLowerCase().includes(q) ||
          subject.description.toLowerCase().includes(q);
        const matchesStatus = statusFilter === "Todas" || subject.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [subjects, search, statusFilter]
  );

  const selectedSubject = subjects.find((subject) => subject.id === selectedSubjectId) ?? null;

  const selectedAssociations = associations.filter(
    (association) => association.subjectId === selectedSubjectId
  );

  const filteredAssociations = useMemo(() => {
    if (associationSubjectFilter === "Todas") return associations;
    return associations.filter(
      (association) => association.subjectId === Number(associationSubjectFilter)
    );
  }, [associations, associationSubjectFilter]);

  function openNewSubject() {
    setEditingSubject(null);
    setCode("");
    setName("");
    setDescription("");
    setSubjectStatus("Ativa");
    setShowSubjectForm(true);
  }

  function openEditSubject(subject: Subject) {
    setEditingSubject(subject);
    setCode(subject.code);
    setName(subject.name);
    setDescription(subject.description);
    setSubjectStatus(subject.status);
    setShowSubjectForm(true);
  }

  function closeSubjectForm() {
    setShowSubjectForm(false);
    setEditingSubject(null);
  }

  function saveSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();

    if (!cleanCode || !cleanName) {
      alert("Preenche o código e o nome da disciplina.");
      return;
    }

    const duplicate = subjects.some(
      (subject) =>
        subject.id !== editingSubject?.id &&
        (subject.code.toLowerCase() === cleanCode.toLowerCase() ||
          subject.name.toLowerCase() === cleanName.toLowerCase())
    );

    if (duplicate) {
      alert("Já existe uma disciplina com esse código ou nome.");
      return;
    }

    if (editingSubject) {
      setSubjects((current) =>
        current.map((subject) =>
          subject.id === editingSubject.id
            ? { ...subject, code: cleanCode, name: cleanName, description: description.trim(), status: subjectStatus }
            : subject
        )
      );
      setSelectedSubjectId(editingSubject.id);
    } else {
      const id = Math.max(0, ...subjects.map((subject) => subject.id)) + 1;
      const newSubject: Subject = {
        id,
        code: cleanCode,
        name: cleanName,
        description: description.trim(),
        status: subjectStatus,
      };
      setSubjects((current) => [...current, newSubject]);
      setSelectedSubjectId(id);
    }

    closeSubjectForm();
  }

  function toggleSubjectStatus(subject: Subject) {
    const nextStatus = subject.status === "Ativa" ? "Inativa" : "Ativa";
    setSubjects((current) =>
      current.map((item) => (item.id === subject.id ? { ...item, status: nextStatus } : item))
    );
  }

  function openAssociationForm() {
    setClassName("");
    setAssociationSubjectId(selectedSubjectId ? String(selectedSubjectId) : "");
    setWorkload("");
    setTeacher("");
    setCoordinator(false);
    setShowAssociationForm(true);
  }

  function saveAssociation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subjectId = Number(associationSubjectId);

    if (!subjectId || !className.trim() || !workload.trim() || !teacher.trim()) {
      alert("Preenche a disciplina, turma, carga horária e professor.");
      return;
    }

    const duplicate = associations.some(
      (association) =>
        association.subjectId === subjectId &&
        association.className.toLowerCase() === className.trim().toLowerCase()
    );

    if (duplicate) {
      alert("Esta disciplina já está associada a essa turma.");
      return;
    }

    const id = Math.max(0, ...associations.map((association) => association.id)) + 1;

    setAssociations((current) => [
      ...current,
      {
        id,
        subjectId,
        className: className.trim(),
        workload: workload.trim(),
        teacher: teacher.trim(),
        coordinator,
      },
    ]);

    setShowAssociationForm(false);
  }

  function deleteAssociation(id: number) {
    if (!confirm("Eliminar esta associação da disciplina com a turma?")) return;
    setAssociations((current) => current.filter((association) => association.id !== id));
  }

  return (
    <main className="sc-page">
      <aside className="sc-sidebar">
        <div className="sc-logo">
          <span>🎓</span>
          <strong>SMART<br />CAMPUS</strong>
        </div>

        <div className="sc-profile">
          <div className="sc-avatar">🧑‍💼</div>
          <div>
            <strong>Administrador</strong>
            <small>admin@smartcampus.com</small>
            <small className="sc-online">● Online</small>
          </div>
        </div>

        <nav className="sc-menu">
          {menu.map(([icon, label, href]) => (
            <Link key={label} href={href} className={label === "Disciplinas" ? "sc-active" : ""}>
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="sc-logout">↪ Sair</div>
      </aside>

      <section className="sc-content">
        <header className="sc-header">
          <div>
            <h1>Disciplinas</h1>
            <p>Início &nbsp;›&nbsp; Disciplinas</p>
          </div>

          <div className="sc-header-actions">
            <div className="sc-search">
              🔍
              <input
                placeholder="Pesquisar..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="sc-bell">🔔<b>3</b></div>
            <div className="sc-admin">🧑‍💼 <strong>Administrador</strong>⌄</div>
          </div>
        </header>

        <section className="sc-card sc-list-card">
          <div className="sc-card-heading">
            <div>
              <h2>📚 &nbsp;Lista de Disciplinas</h2>
              <p>Gerir as disciplinas do estabelecimento de ensino.</p>
            </div>
            <button className="sc-primary" onClick={openNewSubject}>＋ Nova Disciplina</button>
          </div>

          <div className="sc-toolbar">
            <div className="sc-table-search">
              🔍
              <input
                placeholder="Pesquisar por código, nome ou descrição..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option>Todas</option>
              <option>Ativa</option>
              <option>Inativa</option>
            </select>
            <button className="sc-light-button" onClick={() => { setSearch(""); setStatusFilter("Todas"); }}>
              ↻ Limpar
            </button>
          </div>

          <div className="sc-table-wrap">
            <table className="sc-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome da Disciplina</th>
                  <th>Descrição</th>
                  <th>Estado</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className={selectedSubjectId === subject.id ? "sc-selected-row" : ""}
                    onClick={() => setSelectedSubjectId(subject.id)}
                  >
                    <td><strong>{subject.code}</strong></td>
                    <td><strong>{subject.name}</strong></td>
                    <td>{subject.description || "—"}</td>
                    <td>
                      <span className={subject.status === "Ativa" ? "sc-status-active" : "sc-status-inactive"}>
                        {subject.status}
                      </span>
                    </td>
                    <td>
                      <div className="sc-actions" onClick={(event) => event.stopPropagation()}>
                        <button title="Consultar" onClick={() => setViewSubject(subject)}>👁️</button>
                        <button title="Editar" onClick={() => openEditSubject(subject)}>✏️</button>
                        <button title={subject.status === "Ativa" ? "Desativar" : "Ativar"} onClick={() => toggleSubjectStatus(subject)}>
                          {subject.status === "Ativa" ? "🗑️" : "🟢"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredSubjects.length && (
                  <tr>
                    <td colSpan={5} className="sc-empty">Nenhuma disciplina encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="sc-pagination">
            <span>A mostrar {filteredSubjects.length} de {subjects.length} registos</span>
            <div>
              <button disabled>Anterior</button>
              <button className="sc-page-number">1</button>
              <button disabled>Seguinte</button>
            </div>
          </div>
        </section>

        <section className="sc-bottom-grid">
          <div className="sc-card sc-classes-card">
            <div className="sc-card-heading">
              <div>
                <h2>👥 &nbsp;Turmas e Disciplinas</h2>
                <p>Consulte todas as disciplinas associadas às turmas, com os respetivos professores.</p>
              </div>
              <button className="sc-primary" onClick={openAssociationForm}>＋ Associar à Turma</button>
            </div>

            <div className="sc-association-toolbar">
              <label>Filtrar por disciplina</label>
              <select
                value={associationSubjectFilter}
                onChange={(event) => setAssociationSubjectFilter(event.target.value)}
              >
                <option value="Todas">Todas as disciplinas</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} — {subject.name}
                  </option>
                ))}
              </select>
              <span>
                {filteredAssociations.length} associação(ões)
              </span>
            </div>

            <div className="sc-table-wrap">
              <table className="sc-table sc-small-table">
                <thead>
                  <tr>
                    <th>Turma</th>
                    <th>Disciplina</th>
                    <th>Carga Horária</th>
                    <th>Professor</th>
                    <th>Coord. Disciplina</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssociations.map((association) => {
                    const subject = subjects.find((item) => item.id === association.subjectId);
                    return (
                      <tr key={association.id}>
                        <td>{association.className}</td>
                        <td><strong>{subject ? subject.name : "—"}</strong></td>
                        <td>{association.workload}</td>
                        <td>{association.teacher}</td>
                        <td>
                          <span className={association.coordinator ? "sc-coord-yes" : "sc-coord-no"}>
                            {association.coordinator ? "Sim" : "Não"}
                          </span>
                        </td>
                        <td>
                          <div className="sc-actions">
                            <button title="Eliminar" onClick={() => deleteAssociation(association.id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {!filteredAssociations.length && (
                    <tr>
                      <td colSpan={6} className="sc-empty">
                        Nenhuma associação encontrada para este filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="sc-footer">Smart Campus © 2025 - Todos os direitos reservados.</footer>
      </section>

      {showSubjectForm && (
        <div className="sc-overlay">
          <div className="sc-modal">
            <div className="sc-modal-head">
              <div>
                <h2>{editingSubject ? "Editar Disciplina" : "Nova Disciplina"}</h2>
                <p>Preencha os dados da disciplina.</p>
              </div>
              <button onClick={closeSubjectForm}>×</button>
            </div>
            <form onSubmit={saveSubject}>
              <div className="sc-two-columns">
                <div className="sc-field">
                  <label>Código *</label>
                  <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ex.: MAT" required />
                </div>
                <div className="sc-field">
                  <label>Nome *</label>
                  <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Matemática" required />
                </div>
              </div>
              <div className="sc-field">
                <label>Descrição</label>
                <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descrição da disciplina..." />
              </div>
              <div className="sc-field">
                <label>Estado</label>
                <select value={subjectStatus} onChange={(event) => setSubjectStatus(event.target.value as Subject["status"])}>
                  <option>Ativa</option>
                  <option>Inativa</option>
                </select>
              </div>
              <div className="sc-modal-actions">
                <button type="button" className="sc-gray-button" onClick={closeSubjectForm}>Cancelar</button>
                <button type="submit" className="sc-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssociationForm && (
        <div className="sc-overlay">
          <div className="sc-modal">
            <div className="sc-modal-head">
              <div>
                <h2>🔗 &nbsp;Associar Disciplina à Turma</h2>
                <p>Selecione uma disciplina existente e defina os detalhes da associação.</p>
              </div>
              <button onClick={() => setShowAssociationForm(false)}>×</button>
            </div>

            <form onSubmit={saveAssociation}>
              <div className="sc-two-columns">
                <div className="sc-field">
                  <label>Turma *</label>
                  <select value={className} onChange={(event) => setClassName(event.target.value)} required>
                    <option value="">Selecionar turma</option>
                    <option>9.º A</option>
                    <option>9.º B</option>
                    <option>8.º A</option>
                    <option>8.º B</option>
                    <option>7.º A</option>
                    <option>7.º B</option>
                  </select>
                </div>

                <div className="sc-field">
                  <label>Disciplina *</label>
                  <select value={associationSubjectId} onChange={(event) => setAssociationSubjectId(event.target.value)} required>
                    <option value="">Selecione uma disciplina...</option>
                    {subjects.filter((subject) => subject.status === "Ativa").map((subject) => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sc-field">
                  <label>Carga Horária *</label>
                  <div className="sc-input-unit">
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex.: 4"
                      value={workload.replace(" h/semana", "")}
                      onChange={(event) => setWorkload(event.target.value ? `${event.target.value} h/semana` : "")}
                      required
                    />
                    <span>h/semana</span>
                  </div>
                </div>

                <div className="sc-field">
                  <label>Professor *</label>
                  <select value={teacher} onChange={(event) => setTeacher(event.target.value)} required>
                    <option value="">Selecione um professor...</option>
                    <option>João Silva</option>
                    <option>Maria Santos</option>
                    <option>Pedro Costa</option>
                    <option>Ana Ferreira</option>
                  </select>
                </div>
              </div>

              <label className="sc-check">
                <input type="checkbox" checked={coordinator} onChange={(event) => setCoordinator(event.target.checked)} />
                <span>Definir como coordenador da disciplina nesta turma</span>
              </label>

              <div className="sc-modal-actions">
                <button type="button" className="sc-gray-button" onClick={() => setShowAssociationForm(false)}>Cancelar</button>
                <button type="submit" className="sc-primary">🔗 Associar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewSubject && (
        <div className="sc-overlay">
          <div className="sc-modal">
            <div className="sc-modal-head">
              <div>
                <h2>Detalhes da Disciplina</h2>
                <p>{viewSubject.code} — {viewSubject.name}</p>
              </div>
              <button onClick={() => setViewSubject(null)}>×</button>
            </div>
            <div className="sc-details">
              <div><span>Código</span><strong>{viewSubject.code}</strong></div>
              <div><span>Nome</span><strong>{viewSubject.name}</strong></div>
              <div><span>Descrição</span><strong>{viewSubject.description || "—"}</strong></div>
              <div><span>Estado</span><strong>{viewSubject.status}</strong></div>
              <div><span>Turmas associadas</span><strong>{associations.filter((a) => a.subjectId === viewSubject.id).length}</strong></div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        * { box-sizing: border-box; }
        .sc-page { min-height:100vh; display:flex; background:#f5f7fb; color:#102047; font-family:Arial,sans-serif; }
        .sc-sidebar { width:230px; min-height:100vh; background:linear-gradient(180deg,#071a42,#06245d); color:white; padding:25px 15px; position:fixed; left:0; top:0; bottom:0; overflow-y:auto; }
        .sc-logo { display:flex; align-items:center; gap:10px; margin-bottom:35px; }
        .sc-logo span { font-size:30px; }
        .sc-logo strong { font-size:20px; line-height:18px; }
        .sc-profile { display:flex; align-items:center; gap:10px; margin-bottom:25px; }
        .sc-avatar { width:42px; height:42px; border-radius:50%; background:white; display:flex; align-items:center; justify-content:center; font-size:22px; }
        .sc-profile strong,.sc-profile small { display:block; }
        .sc-profile strong { font-size:13px; }
        .sc-profile small { font-size:10px; margin-top:3px; color:#cbd5e1; }
        .sc-online { color:#22c55e !important; }
        .sc-menu { display:flex; flex-direction:column; gap:5px; }
        .sc-menu a { color:white; text-decoration:none; padding:11px 12px; border-radius:7px; display:flex; align-items:center; gap:12px; font-size:14px; }
        .sc-menu a:hover,.sc-menu .sc-active { background:#2463e9; }
        .sc-logout { margin-top:20px; padding:11px 12px; font-size:14px; }
        .sc-content { margin-left:230px; width:calc(100% - 230px); padding:22px 30px; }
        .sc-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; }
        .sc-header h1 { margin:0; font-size:29px; }
        .sc-header p { margin:5px 0 0; color:#64748b; font-size:14px; }
        .sc-header-actions { display:flex; align-items:center; gap:20px; }
        .sc-search,.sc-table-search { display:flex; align-items:center; gap:10px; border:1px solid #dce2eb; background:white; border-radius:9px; padding:11px 14px; }
        .sc-search { width:300px; }
        .sc-search input,.sc-table-search input { border:0; outline:0; width:100%; font-size:14px; color:#102047; }
        .sc-bell { position:relative; font-size:21px; }
        .sc-bell b { position:absolute; top:-9px; right:-9px; background:red; color:white; border-radius:50%; min-width:20px; height:20px; display:flex; align-items:center; justify-content:center; font-size:11px; }
        .sc-admin { display:flex; gap:8px; align-items:center; white-space:nowrap; }
        .sc-card { background:white; border:1px solid #e1e7ef; border-radius:14px; box-shadow:0 5px 18px rgba(16,32,71,.05); }
        .sc-list-card { padding:20px; }
        .sc-card-heading { display:flex; justify-content:space-between; align-items:center; gap:20px; }
        .sc-card-heading h2 { margin:0; font-size:21px; }
        .sc-card-heading p { margin:6px 0 0; color:#64748b; font-size:14px; }
        button { font:inherit; cursor:pointer; }
        .sc-primary { border:0; background:#2463e9; color:white; border-radius:8px; padding:11px 17px; font-weight:700; }
        .sc-primary:hover { background:#1d56d1; }
        .sc-toolbar { display:grid; grid-template-columns:1fr 290px auto; gap:12px; margin:20px 0 12px; }
        .sc-toolbar select,.sc-field select { background:white; }
        .sc-toolbar select,.sc-light-button,.sc-gray-button { border:1px solid #d7deea; border-radius:8px; padding:11px 14px; color:#17305e; }
        .sc-light-button { background:white; }
        .sc-table-wrap { overflow:auto; }
        .sc-table { width:100%; border-collapse:collapse; font-size:14px; }
        .sc-table th { background:#f1f5f9; color:#203657; text-align:left; font-size:13px; padding:12px 14px; border-bottom:1px solid #dce3ed; }
        .sc-table td { padding:13px 14px; border-bottom:1px solid #e5e9ef; color:#263d62; }
        .sc-table tbody tr { cursor:pointer; transition:.15s; }
        .sc-table tbody tr:hover,.sc-table .sc-selected-row { background:#f8fbff; }
        .sc-status-active,.sc-status-inactive,.sc-coord-yes,.sc-coord-no { display:inline-block; padding:5px 10px; border-radius:20px; font-size:12px; font-weight:700; }
        .sc-status-active,.sc-coord-yes { background:#c9f7dc; color:#138047; }
        .sc-status-inactive,.sc-coord-no { background:#edf1f5; color:#64748b; }
        .sc-actions { display:flex; gap:7px; }
        .sc-actions button { width:38px; height:34px; border:0; border-radius:6px; background:#eef3f8; }
        .sc-actions button:hover { background:#dfe9f6; }
        .sc-empty { text-align:center; padding:28px !important; color:#64748b !important; }
        .sc-pagination { display:flex; justify-content:space-between; align-items:center; padding:15px 5px 0; color:#64748b; font-size:13px; }
        .sc-pagination button { border:1px solid #d7deea; background:white; padding:8px 13px; border-radius:7px; margin-left:6px; color:#64748b; }
        .sc-pagination button:disabled { opacity:.55; cursor:not-allowed; }
        .sc-pagination .sc-page-number { background:#2463e9; color:white; border-color:#2463e9; }
        .sc-bottom-grid { display:grid; grid-template-columns:1fr; gap:18px; margin-top:18px; }
        .sc-form-card,.sc-classes-card { padding:20px; }
        .sc-form-card form { margin-top:18px; }
        .sc-two-columns { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .sc-field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
        .sc-field label { font-size:13px; font-weight:700; }
        .sc-field input,.sc-field textarea,.sc-field select { width:100%; border:1px solid #cfd8e5; border-radius:7px; padding:10px 12px; outline:none; color:#17305e; font-size:14px; }
        .sc-field input:focus,.sc-field textarea:focus,.sc-field select:focus { border-color:#2463e9; box-shadow:0 0 0 3px rgba(36,99,233,.1); }
        .sc-field textarea { min-height:110px; resize:vertical; }
        .sc-input-unit { display:flex; align-items:stretch; }
        .sc-input-unit input { border-radius:7px 0 0 7px !important; }
        .sc-input-unit span { display:flex; align-items:center; padding:0 12px; background:#edf1f5; border:1px solid #cfd8e5; border-left:0; border-radius:0 7px 7px 0; color:#64748b; font-size:13px; white-space:nowrap; }
        .sc-form-actions,.sc-modal-actions { display:flex; justify-content:flex-end; gap:10px; margin-top:8px; }
        .sc-gray-button { background:#edf1f5; border:0; }
        .sc-association-toolbar { display:flex; align-items:center; gap:10px; margin:18px 0 12px; padding:12px 14px; background:#f8fafc; border:1px solid #e1e7ef; border-radius:9px; }
        .sc-association-toolbar label { font-size:13px; font-weight:700; color:#203657; white-space:nowrap; }
        .sc-association-toolbar select { min-width:280px; border:1px solid #cfd8e5; border-radius:7px; padding:10px 12px; background:white; color:#17305e; outline:none; }
        .sc-association-toolbar select:focus { border-color:#2463e9; box-shadow:0 0 0 3px rgba(36,99,233,.1); }
        .sc-association-toolbar > span { margin-left:auto; color:#64748b; font-size:13px; }
        .sc-selected-subject { display:flex; justify-content:space-between; align-items:center; background:#eef5ff; border:1px solid #d8e7ff; padding:11px 13px; border-radius:8px; margin:18px 0 12px; font-size:13px; }
        .sc-selected-subject > div { display:flex; flex-direction:column; gap:4px; }
        .sc-selected-hint { color:#64748b; font-size:12px; font-weight:400; }
        .sc-teacher-strip { display:flex; justify-content:space-between; align-items:center; gap:18px; margin:0 0 14px; padding:12px 14px; background:#f8fafc; border:1px solid #e1e7ef; border-radius:9px; }
        .sc-teacher-strip > div:first-child { display:flex; flex-direction:column; gap:4px; min-width:210px; }
        .sc-teacher-strip small { color:#64748b; font-size:12px; }
        .sc-teacher-list { display:flex; flex-wrap:wrap; justify-content:flex-end; gap:7px; }
        .sc-teacher-chip { display:inline-flex; align-items:center; padding:7px 10px; border-radius:20px; background:#e8f0ff; color:#2455a5; font-size:12px; font-weight:700; }
        .sc-no-teachers { color:#64748b; font-size:12px; }
        .sc-selected-subject span { color:#64748b; }
        .sc-small-table { font-size:13px; }
        .sc-small-table th,.sc-small-table td { padding:10px 9px; }
        .sc-info { margin-top:18px; padding:14px; border:1px solid #b9ddff; background:#eef8ff; color:#25507a; border-radius:8px; }
        .sc-footer { text-align:center; padding:25px 0 10px; color:#7b8799; font-size:12px; }
        .sc-overlay { position:fixed; inset:0; background:rgba(10,25,55,.48); display:flex; align-items:center; justify-content:center; z-index:100; padding:20px; }
        .sc-modal { width:min(620px,100%); background:white; border-radius:14px; box-shadow:0 25px 70px rgba(0,0,0,.2); padding:22px; }
        .sc-modal-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
        .sc-modal-head h2 { margin:0; font-size:21px; }
        .sc-modal-head p { margin:5px 0 0; color:#64748b; }
        .sc-modal-head button { border:1px solid #d7deea; background:white; border-radius:8px; width:42px; height:42px; font-size:24px; color:#475569; }
        .sc-check { display:flex; align-items:center; gap:10px; padding:12px; background:#f7f9fc; border:1px solid #e1e7ef; border-radius:8px; margin-top:4px; font-size:14px; }
        .sc-check input { width:17px; height:17px; }
        .sc-details { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .sc-details div { background:#f7f9fc; border:1px solid #e1e7ef; border-radius:8px; padding:13px; }
        .sc-details span,.sc-details strong { display:block; }
        .sc-details span { color:#64748b; font-size:12px; margin-bottom:5px; }
        .sc-details strong { font-size:14px; }
        @media (max-width: 1000px) {
          .sc-bottom-grid { grid-template-columns:1fr; }
          .sc-toolbar { grid-template-columns:1fr; }
          .sc-header-actions { gap:10px; }
          .sc-search { width:220px; }
        }
        @media (max-width: 760px) {
          .sc-sidebar { width:75px; padding:20px 10px; }
          .sc-logo strong,.sc-profile > div:last-child,.sc-menu a:not(.sc-active)::after { display:none; }
          .sc-menu a { justify-content:center; }
          .sc-content { margin-left:75px; width:calc(100% - 75px); padding:18px; }
          .sc-header { align-items:flex-start; gap:15px; flex-direction:column; }
          .sc-header-actions { width:100%; }
          .sc-search { flex:1; width:auto; }
          .sc-two-columns,.sc-details { grid-template-columns:1fr; }
          .sc-teacher-strip { align-items:flex-start; flex-direction:column; }
          .sc-association-toolbar { align-items:flex-start; flex-direction:column; }
          .sc-association-toolbar select { width:100%; min-width:0; }
          .sc-association-toolbar > span { margin-left:0; }
          .sc-teacher-list { justify-content:flex-start; }
        }
      `}</style>
    </main>
  );
}
