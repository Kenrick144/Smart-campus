"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type Teacher = {
  id: number;
  userId?: string | number;
  professionalNumber: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  specialization: string;
  subjects: string[];
  status: "Ativo" | "Inativo";
};

const SUBJECTS = [
  "Matemática",
  "Português",
  "Inglês",
  "Filosofia",
  "História",
  "Geografia",
  "Ciências Naturais",
  "Informática",
  "Educação Física",
  "Artes",
];

const DEPARTMENTS = [
  "Matemática",
  "Línguas",
  "Ciências",
  "Ciências Sociais",
  "Informática",
  "Artes",
  "Educação Física",
];

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 1,
    professionalNumber: "P0001",
    name: "João Silva",
    email: "joao.silva@smartcampus.com",
    phone: "912 345 678",
    department: "Matemática",
    specialization: "Matemática",
    subjects: ["Matemática"],
    status: "Ativo",
  },
  {
    id: 2,
    professionalNumber: "P0002",
    name: "Maria Santos",
    email: "maria.santos@smartcampus.com",
    phone: "913 456 789",
    department: "Matemática",
    specialization: "Matemática",
    subjects: ["Matemática"],
    status: "Ativo",
  },
  {
    id: 3,
    professionalNumber: "P0003",
    name: "Carlos Mendes",
    email: "carlos.mendes@smartcampus.com",
    phone: "914 567 890",
    department: "Línguas",
    specialization: "Português",
    subjects: ["Português"],
    status: "Ativo",
  },
  {
    id: 4,
    professionalNumber: "P0004",
    name: "Rita Fernandes",
    email: "rita.fernandes@smartcampus.com",
    phone: "915 678 901",
    department: "Línguas",
    specialization: "Inglês",
    subjects: ["Inglês"],
    status: "Ativo",
  },
];

const menu = [
  ["🏠", "Painel Principal", "/dashboard"],
  ["👥", "Alunos", "/alunos"],
  ["👨‍🏫", "Professores", "/professor"],
  ["📚", "Turmas", "#"],
  ["📖", "Disciplinas", "/disciplinas"],
  ["🗓️", "Horários", "#"],
  ["📝", "Avaliações", "#"],
  ["✅", "Assiduidade", "#"],
  ["💬", "Comunicações", "#"],
  ["📊", "Relatórios", "/relatorios"],
  ["⚙️", "Configurações", "#"],
];

const STORAGE_KEY = "smartcampus_teachers";
const USERS_STORAGE_KEY = "smartcampus_users";

export default function ProfessoresPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(INITIAL_TEACHERS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [subjectFilter, setSubjectFilter] = useState("Todas");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [users, setUsers] = useState<Array<{ id?: string | number; name?: string; email?: string; role?: string; status?: string }>>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [status, setStatus] = useState<Teacher["status"]>("Ativo");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTeachers(JSON.parse(saved));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    const savedUsers = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch {
        window.localStorage.removeItem(USERS_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
  }, [teachers]);

  // Um Professor nasce em Utilizadores. Esta página apenas cria/atualiza
  // o registo profissional correspondente, sem criar uma segunda conta.
  useEffect(() => {
    const professorUsers = users.filter(
      (user) => String(user.role ?? "").toLowerCase() === "professor"
    );

    if (!professorUsers.length) return;

    setTeachers((current) => {
      const next = [...current];
      let nextId = Math.max(0, ...next.map((teacher) => teacher.id));

      for (const user of professorUsers) {
        const email = String(user.email ?? "").trim();
        const userId = user.id;
        const index = next.findIndex(
          (teacher) =>
            (userId !== undefined && String(teacher.userId) === String(userId)) ||
            (email && teacher.email.toLowerCase() === email.toLowerCase())
        );

        if (index >= 0) {
          next[index] = {
            ...next[index],
            userId: userId ?? next[index].userId,
            name: String(user.name ?? next[index].name),
            email: email || next[index].email,
            status: user.status === "Inativo" ? "Inativo" : "Ativo",
          };
        } else if (email || user.name) {
          nextId += 1;
          next.push({
            id: nextId,
            userId,
            professionalNumber: `P${String(nextId).padStart(4, "0")}`,
            name: String(user.name ?? "Professor"),
            email,
            phone: "",
            department: "",
            specialization: "",
            subjects: [],
            status: user.status === "Inativo" ? "Inativo" : "Ativo",
          });
        }
      }

      return next;
    });
  }, [users]);

  const filteredTeachers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const matchesSearch =
        !query ||
        teacher.name.toLowerCase().includes(query) ||
        teacher.email.toLowerCase().includes(query) ||
        teacher.professionalNumber.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "Todos" || teacher.status === statusFilter;

      const matchesSubject =
        subjectFilter === "Todas" || teacher.subjects.includes(subjectFilter);

      return matchesSearch && matchesStatus && matchesSubject;
    });
  }, [teachers, search, statusFilter, subjectFilter]);

  const totalActive = teachers.filter((teacher) => teacher.status === "Ativo").length;

  function resetForm() {
    setName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setSpecialization("");
    setSubjects([]);
    setStatus("Ativo");
    setEditingId(null);
  }

  function openEditTeacher(teacher: Teacher) {
    setEditingId(teacher.id);
    setName(teacher.name);
    setEmail(teacher.email);
    setPhone(teacher.phone);
    setDepartment(teacher.department);
    setSpecialization(teacher.specialization);
    setSubjects(teacher.subjects);
    setStatus(teacher.status);
    setShowForm(true);
  }

  function toggleSubject(subject: string) {
    setSubjects((current) =>
      current.includes(subject)
        ? current.filter((item) => item !== subject)
        : [...current, subject]
    );
  }

  function saveTeacher(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId === null) return;

    if (!name.trim() || !email.trim() || !department || subjects.length === 0) {
      alert("Preenche o nome, email, departamento e pelo menos uma disciplina.");
      return;
    }

    setTeachers((current) =>
      current.map((teacher) =>
        teacher.id === editingId
          ? {
              ...teacher,
              name: name.trim(),
              email: email.trim(),
              phone: phone.trim(),
              department,
              specialization: specialization.trim(),
              subjects,
              status,
            }
          : teacher
      )
    );

    setShowForm(false);
    resetForm();
  }

  function toggleStatus(id: number) {
    setTeachers((current) =>
      current.map((teacher) =>
        teacher.id === id
          ? { ...teacher, status: teacher.status === "Ativo" ? "Inativo" : "Ativo" }
          : teacher
      )
    );
  }

  return (
    <main className="tp-page">
      <style jsx global>{`
        .tp-page{min-height:100vh;background:#f5f7fb;color:#172033;font-family:Arial,sans-serif;display:flex}
        .tp-sidebar{width:250px;background:#102a56;color:white;padding:22px 14px;box-sizing:border-box;position:sticky;top:0;height:100vh}
        .tp-logo{display:flex;align-items:center;gap:10px;padding:8px 12px 22px;font-weight:800;letter-spacing:1px}
        .tp-logo span{font-size:28px}.tp-logo strong{line-height:1.05}
        .tp-profile{display:flex;gap:10px;align-items:center;padding:12px;background:#173665;border-radius:10px;margin-bottom:18px}
        .tp-avatar{width:40px;height:40px;border-radius:50%;background:#e8eef9;color:#173665;display:grid;place-items:center}
        .tp-profile strong{display:block;font-size:13px}.tp-profile small{display:block;color:#b9c8de;font-size:11px;margin-top:2px}
        .tp-online{color:#67d391!important}
        .tp-menu{display:grid;gap:4px}.tp-menu a{color:#dce7f7;text-decoration:none;padding:11px 12px;border-radius:8px;font-size:13px;display:flex;gap:10px;align-items:center}
        .tp-menu a:hover,.tp-menu .tp-active{background:#1c6de1;color:white}
        .tp-content{flex:1;min-width:0;padding:24px 30px}
        .tp-header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e3e8f0;padding-bottom:18px;margin-bottom:20px}
        .tp-header h1{margin:0;font-size:25px}.tp-header p{margin:5px 0 0;color:#758197;font-size:13px}
        .tp-admin{display:flex;gap:9px;align-items:center;font-size:13px}
        .tp-top-search{display:flex;align-items:center;background:white;border:1px solid #dce3ed;border-radius:8px;padding:7px 10px;width:230px;margin-right:12px}
        .tp-top-search input{border:0;outline:0;width:100%;margin-left:7px}
        .tp-page-title{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .tp-page-title h2{margin:0;font-size:21px}.tp-page-title p{margin:5px 0 0;color:#718096;font-size:13px}
        .tp-primary{border:0;background:#2169d3;color:white;border-radius:7px;padding:10px 15px;font-weight:700;cursor:pointer}.tp-source-note{background:#eef4ff;border:1px solid #d7e5fb;color:#34527a;border-radius:8px;padding:10px 13px;font-size:12px}
        .tp-card{background:white;border:1px solid #e0e6ef;border-radius:10px;box-shadow:0 2px 8px rgba(15,35,65,.04)}
        .tp-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}
        .tp-stat{padding:17px;display:flex;gap:13px;align-items:center}.tp-stat-icon{width:42px;height:42px;border-radius:9px;background:#edf4ff;display:grid;place-items:center;font-size:20px}
        .tp-stat small{display:block;color:#78869b;font-size:11px}.tp-stat strong{font-size:22px}
        .tp-toolbar{padding:14px;display:flex;gap:10px;align-items:center;border-bottom:1px solid #e6ebf2}
        .tp-search{flex:1;display:flex;align-items:center;border:1px solid #d9e1eb;border-radius:7px;padding:8px 10px}.tp-search input{border:0;outline:0;width:100%;margin-left:7px}
        .tp-select{border:1px solid #d9e1eb;border-radius:7px;padding:9px 11px;background:white}
        .tp-table-wrap{overflow:auto}.tp-table{width:100%;border-collapse:collapse;min-width:900px}.tp-table th{background:#f8fafc;text-align:left;color:#66758a;font-size:12px;padding:12px;border-bottom:1px solid #e4e9f0}.tp-table td{padding:13px 12px;border-bottom:1px solid #edf1f5;font-size:13px}
        .tp-name{display:flex;align-items:center;gap:9px}.tp-mini-avatar{width:34px;height:34px;border-radius:50%;background:#eaf1fc;display:grid;place-items:center;color:#245da8;font-weight:800}
        .tp-number{font-size:11px;color:#8490a1}.tp-chips{display:flex;flex-wrap:wrap;gap:5px}.tp-chip{background:#edf4ff;color:#245da8;border-radius:15px;padding:4px 8px;font-size:11px;font-weight:700}
        .tp-status{border-radius:14px;padding:5px 9px;font-size:11px;font-weight:700}.tp-status.active{background:#e7f7ee;color:#18824b}.tp-status.inactive{background:#f1f3f6;color:#6b7280}
        .tp-actions{display:flex;gap:6px}.tp-actions button{border:1px solid #dce3ed;background:white;border-radius:6px;padding:6px 8px;cursor:pointer}
        .tp-empty{text-align:center;color:#7b8798;padding:35px}
        .tp-overlay{position:fixed;inset:0;background:rgba(15,27,46,.48);display:grid;place-items:center;z-index:50;padding:18px}
        .tp-modal{background:white;width:min(850px,96vw);max-height:92vh;overflow:auto;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,.2)}
        .tp-modal-head{display:flex;justify-content:space-between;align-items:flex-start;padding:20px;border-bottom:1px solid #e5eaf1}.tp-modal-head h2{margin:0;font-size:20px}.tp-modal-head p{margin:5px 0 0;color:#758197;font-size:12px}.tp-close{border:0;background:transparent;font-size:25px;cursor:pointer;color:#697586}
        .tp-form{padding:20px}.tp-section{border:1px solid #e1e7ef;border-radius:9px;overflow:hidden;margin-bottom:16px}.tp-section-title{background:#eef4ff;color:#173b8f;padding:10px 13px;font-weight:700;font-size:14px}.tp-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;padding:15px}
        .tp-field label{display:block;font-size:12px;font-weight:700;margin-bottom:6px}.tp-field input,.tp-field select{width:100%;box-sizing:border-box;border:1px solid #d3dce8;border-radius:7px;padding:9px;outline:0}
        .tp-subject-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:15px}.tp-subject{border:1px solid #dce3ed;border-radius:7px;padding:10px;display:flex;gap:8px;align-items:center;font-size:12px;cursor:pointer}.tp-subject.selected{background:#eef4ff;border-color:#78a8ee;color:#1d55a0}
        .tp-info{margin:0 15px 15px;padding:10px;background:#f0f7ff;border-radius:7px;color:#49657e;font-size:12px}
        .tp-modal-actions{display:flex;justify-content:flex-end;gap:9px;padding-top:5px}.tp-secondary{border:1px solid #d6dee9;background:white;border-radius:7px;padding:10px 15px;cursor:pointer}
        @media(max-width:900px){.tp-sidebar{display:none}.tp-content{padding:18px}.tp-stats{grid-template-columns:repeat(2,1fr)}} 
        @media(max-width:600px){.tp-stats{grid-template-columns:1fr}.tp-grid,.tp-subject-grid{grid-template-columns:1fr}.tp-header{align-items:flex-start;gap:10px}.tp-top-search{display:none}}
      `}</style>

      <aside className="tp-sidebar">
        <div className="tp-logo"><span>🎓</span><strong>SMART<br/>CAMPUS</strong></div>
        <div className="tp-profile">
          <div className="tp-avatar">🧑‍💼</div>
          <div><strong>Administrador</strong><small>admin@smartcampus.com</small><small className="tp-online">● Online</small></div>
        </div>
        <nav className="tp-menu">
          {menu.map(([icon,label,href]) => (
            <Link key={label} href={href} className={label === "Professores" ? "tp-active" : ""}>
              <span>{icon}</span>{label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="tp-content">
        <header className="tp-header">
          <div><h1>Professores</h1><p>Início &nbsp;›&nbsp; Professores</p></div>
          <div className="tp-admin">
            <div className="tp-top-search">🔍<input placeholder="Pesquisar..." value={search} onChange={(e)=>setSearch(e.target.value)}/></div>
            🔔 <strong>Administrador</strong>⌄
          </div>
        </header>

        <div className="tp-page-title">
          <div><h2>Gestão de Professores</h2><p>Gerir professores e as disciplinas que cada um leciona.</p></div>
          <div className="tp-source-note">Os professores são criados em <strong>Utilizadores</strong>. Aqui o Administrador gere os dados profissionais.</div>
        </div>

        <div className="tp-stats">
          <div className="tp-card tp-stat"><div className="tp-stat-icon">👨‍🏫</div><div><small>Total de professores</small><strong>{teachers.length}</strong></div></div>
          <div className="tp-card tp-stat"><div className="tp-stat-icon">🟢</div><div><small>Professores ativos</small><strong>{totalActive}</strong></div></div>
          <div className="tp-card tp-stat"><div className="tp-stat-icon">📚</div><div><small>Disciplinas atribuídas</small><strong>{new Set(teachers.flatMap(t=>t.subjects)).size}</strong></div></div>
          <div className="tp-card tp-stat"><div className="tp-stat-icon">🔗</div><div><small>Associações</small><strong>{teachers.reduce((sum,t)=>sum+t.subjects.length,0)}</strong></div></div>
        </div>

        <div className="tp-card">
          <div className="tp-toolbar">
            <div className="tp-search">🔍<input placeholder="Pesquisar por nome, email ou número..." value={search} onChange={(e)=>setSearch(e.target.value)}/></div>
            <select className="tp-select" value={subjectFilter} onChange={(e)=>setSubjectFilter(e.target.value)}>
              <option>Todas</option>{SUBJECTS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="tp-select" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
              <option>Todos</option><option>Ativo</option><option>Inativo</option>
            </select>
          </div>

          <div className="tp-table-wrap">
            <table className="tp-table">
              <thead><tr><th>Professor</th><th>N.º Professor</th><th>Departamento</th><th>Disciplinas que leciona</th><th>Estado</th><th>Ações</th></tr></thead>
              <tbody>
                {filteredTeachers.map((teacher)=>(
                  <tr key={teacher.id}>
                    <td><div className="tp-name"><div className="tp-mini-avatar">{teacher.name.charAt(0)}</div><div><strong>{teacher.name}</strong><div className="tp-number">{teacher.email}</div></div></div></td>
                    <td>{teacher.professionalNumber}</td>
                    <td>{teacher.department}</td>
                    <td><div className="tp-chips">{teacher.subjects.map(s=><span className="tp-chip" key={s}>{s}</span>)}</div></td>
                    <td><span className={`tp-status ${teacher.status === "Ativo" ? "active":"inactive"}`}>● {teacher.status}</span></td>
                    <td><div className="tp-actions"><button title="Editar" onClick={()=>openEditTeacher(teacher)}>✏️</button><button title={teacher.status==="Ativo"?"Desativar":"Ativar"} onClick={()=>toggleStatus(teacher.id)}>{teacher.status==="Ativo"?"🗑️":"🟢"}</button></div></td>
                  </tr>
                ))}
                {!filteredTeachers.length && <tr><td colSpan={6} className="tp-empty">Nenhum professor encontrado.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showForm && (
        <div className="tp-overlay">
          <div className="tp-modal">
            <div className="tp-modal-head">
              <div><h2>Editar Professor</h2><p>Altere os dados profissionais e as disciplinas deste professor.</p></div>
              <button className="tp-close" onClick={()=>{setShowForm(false);resetForm()}}>×</button>
            </div>

            <form className="tp-form" onSubmit={saveTeacher}>
              <section className="tp-section">
                <div className="tp-section-title">👤 Dados pessoais</div>
                <div className="tp-grid">
                  <div className="tp-field"><label>Nome completo *</label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex.: Carlos Mendes" required /></div>
                  <div className="tp-field"><label>Email *</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Ex.: carlos.mendes@smartcampus.com" required /></div>
                  <div className="tp-field"><label>Telefone</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Ex.: 912 345 678" /></div>
                  <div className="tp-field"><label>Estado *</label><select value={status} onChange={e=>setStatus(e.target.value as Teacher["status"])}><option>Ativo</option><option>Inativo</option></select></div>
                </div>
              </section>

              <section className="tp-section">
                <div className="tp-section-title">💼 Dados profissionais</div>
                <div className="tp-grid">
                  <div className="tp-field"><label>Número do professor</label><input value={teachers.find(t=>t.id===editingId)?.professionalNumber || ""} readOnly /></div>
                  <div className="tp-field"><label>Departamento *</label><select value={department} onChange={e=>setDepartment(e.target.value)} required><option value="">Selecionar departamento</option>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></div>
                  <div className="tp-field"><label>Área de especialização</label><input value={specialization} onChange={e=>setSpecialization(e.target.value)} placeholder="Ex.: Desenvolvimento Web" /></div>
                </div>
              </section>

              <section className="tp-section">
                <div className="tp-section-title">📚 Disciplinas que leciona *</div>
                <div className="tp-subject-grid">
                  {SUBJECTS.map(subject=>(
                    <label key={subject} className={`tp-subject ${subjects.includes(subject) ? "selected":""}`}>
                      <input type="checkbox" checked={subjects.includes(subject)} onChange={()=>toggleSubject(subject)} />
                      {subject}
                    </label>
                  ))}
                </div>
                <div className="tp-info">ⓘ Esta informação será usada para filtrar automaticamente os professores quando o Administrador associar uma disciplina a uma turma.</div>
              </section>

              <div className="tp-modal-actions">
                <button type="button" className="tp-secondary" onClick={()=>{setShowForm(false);resetForm()}}>Cancelar</button>
                <button className="tp-primary" type="submit">Guardar alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
