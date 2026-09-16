"use client";

import Link from "next/link";

const menuItems = [
  { icon: "🏠", label: "Dashboard", href: "/dashboard" },
  { icon: "👥", label: "Utilizadores", href: "#" },
  { icon: "📚", label: "Turmas", href: "/turmas" },
  { icon: "🎓", label: "Alunos", href: "/alunos" },
  { icon: "👩‍🏫", label: "Professores", href: "/professor" },
  { icon: "🏫", label: "Salas", href: "/salas" },
  { icon: "🗓️", label: "Horários", href: "#" },
  { icon: "💻", label: "PCs", href: "/computadores" },
  { icon: "✅", label: "Presenças", href: "/presencas" },
  { icon: "▣", label: "QR Codes", href: "/qr-code" },
  { icon: "📊", label: "Relatórios", href: "/relatorios" },
  { icon: "⚙️", label: "Configurações", href: "#" },
  { icon: "📄", label: "Logs", href: "#" },
];

const activities = [
  {
    action: "Login",
    user: "Maria Santos",
    details: "Professor",
    date: "21/05/2025",
    time: "10:30",
  },
  {
    action: "Scan QR",
    user: "João Silva",
    details: "PC-01 - Sala 101",
    date: "21/05/2025",
    time: "10:28",
  },
  {
    action: "Presença",
    user: "Ana Pereira",
    details: "Turma T1",
    date: "21/05/2025",
    time: "10:25",
  },
  {
    action: "Utilização PC",
    user: "Pedro Costa",
    details: "PC-02 - Sala 102",
    date: "21/05/2025",
    time: "10:20",
  },
  {
    action: "Logout",
    user: "Lucas Martins",
    details: "Professor",
    date: "21/05/2025",
    time: "10:15",
  },
];

export default function Dashboard() {
  return (
    <main className="dashboard">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <span>🎓</span>
          <strong>
            SMART
            <br />
            CAMPUS
          </strong>
        </div>

        <div className="profile">
          <div className="profile-avatar">👨‍💼</div>

          <div>
            <strong>Administrador</strong>
            <p>admin@smartcampus.com</p>
            <span className="online">● Online</span>
          </div>
        </div>

        <nav className="menu">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`menu-item ${
                item.label === "Dashboard" ? "active" : ""
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="logout">
          🚪 <span>Sair</span>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <section className="content">
        {/* HEADER */}
        <header className="header">
          <h1>Dashboard - Administrador</h1>

          <div className="header-actions">
            <div className="search">
              🔍
              <input placeholder="Pesquisar..." />
            </div>

            <div className="notification">
              🔔
              <span>3</span>
            </div>

            <div className="admin">
              👨‍💼
              <strong>Administrador</strong>
              <span>⌄</span>
            </div>
          </div>
        </header>

        {/* ESTATÍSTICAS */}
        <section className="stats">
          <Stat icon="👥" title="Total de Alunos" value="352" change="↑ 12 este mês" />
          <Stat
            icon="👩‍🏫"
            title="Total de Professores"
            value="28"
            change="↑ 2 este mês"
          />
          <Stat icon="📚" title="Turmas" value="18" change="↑ 1 este mês" />
          <Stat icon="🏫" title="Salas" value="24" change="→ 0 este mês" />
          <Stat icon="💻" title="PCs" value="40" change="↑ 3 ocupados" />
        </section>

        {/* PAINÉIS */}
        <section className="panels">
          {/* ATIVIDADES */}
          <div className="panel activities-panel">
            <div className="panel-header">
              <h2>Resumo de Atividades</h2>

              <select>
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
              </select>
            </div>

            <div className="legend">
              <span className="legend-blue">● Scans QR</span>
              <span className="legend-green">● Presenças</span>
              <span className="legend-orange">● Utilização de PCs</span>
            </div>

            {/* GRÁFICO SIMPLES E SEGURO */}
            <div className="simple-chart">
              <div className="chart-row">
                <span>100</span>
                <div className="bar">
                  <div className="bar-fill blue" style={{ width: "75%" }} />
                </div>
              </div>

              <div className="chart-row">
                <span>80</span>
                <div className="bar">
                  <div className="bar-fill blue" style={{ width: "62%" }} />
                </div>
              </div>

              <div className="chart-row">
                <span>60</span>
                <div className="bar">
                  <div className="bar-fill blue" style={{ width: "52%" }} />
                </div>
              </div>

              <div className="chart-row">
                <span>40</span>
                <div className="bar">
                  <div className="bar-fill green" style={{ width: "40%" }} />
                </div>
              </div>

              <div className="chart-row">
                <span>20</span>
                <div className="bar">
                  <div className="bar-fill orange" style={{ width: "25%" }} />
                </div>
              </div>

              <div className="chart-row">
                <span>0</span>
                <div className="bar">
                  <div className="bar-fill orange" style={{ width: "12%" }} />
                </div>
              </div>

              <div className="chart-dates">
                <span>15/05</span>
                <span>16/05</span>
                <span>17/05</span>
                <span>18/05</span>
                <span>19/05</span>
                <span>20/05</span>
                <span>21/05</span>
              </div>
            </div>
          </div>

          {/* ESTADO DOS PCS */}
          <div className="panel pc-panel">
            <div className="panel-header">
              <h2>Estado dos PCs</h2>
              <a href="#">Ver todos</a>
            </div>

            <div className="donut">
              <div className="donut-center">
                <strong>40</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="pc-list">
              <div>
                <span>
                  <i className="dot green-dot" /> Livre
                </span>
                <strong>35 (87.5%)</strong>
              </div>

              <div>
                <span>
                  <i className="dot red-dot" /> Ocupado
                </span>
                <strong>3 (7.5%)</strong>
              </div>

              <div>
                <span>
                  <i className="dot yellow-dot" /> Reservado
                </span>
                <strong>1 (2.5%)</strong>
              </div>

              <div>
                <span>
                  <i className="dot gray-dot" /> Manutenção
                </span>
                <strong>1 (2.5%)</strong>
              </div>
            </div>
          </div>

          {/* ATIVIDADES RECENTES */}
          <div className="panel recent-panel">
            <div className="panel-header">
              <h2>Atividades Recentes</h2>
              <a href="#">Ver todas</a>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Ação</th>
                    <th>Utilizador</th>
                    <th>Detalhes</th>
                    <th>Data/Hora</th>
                  </tr>
                </thead>

                <tbody>
                  {activities.map((activity) => (
                    <tr key={`${activity.action}-${activity.time}`}>
                      <td>{activity.action}</td>
                      <td>{activity.user}</td>
                      <td>{activity.details}</td>
                      <td>
                        {activity.date}
                        <br />
                        {activity.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Stat({
  icon,
  title,
  value,
  change,
}: {
  icon: string;
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-bottom">
        <strong>{value}</strong>
        <span>{change}</span>
      </div>
    </div>
  );
}