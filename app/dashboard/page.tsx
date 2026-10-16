"use client";

import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: "Aluno" | "Professor" | "Funcionário" | "Administrador Adjunto" | "Administrador";
  status: string;
};

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
  const router = useRouter();
  const supabase = createClient();

  const [totalAlunos, setTotalAlunos] = useState<number | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData.user) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("id, name, email, role, status")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (error || !data) {
        console.error("Não foi possível carregar o perfil.");
        if (active) setLoading(false);
        return;
      }

      if (data.status !== "Ativo") {
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      if (active) {
        setProfile(data as UserProfile);
        setLoading(false);
      }
    }

    loadProfile();

    async function loadTotalAlunos() {
      const { count, error } = await supabase
        .from("alunos")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Não foi possível contar os alunos.");
        return;
      }

      if (active) {
        setTotalAlunos(count ?? 0);
      }
    }

    loadTotalAlunos();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return <main className="dashboard">A carregar o teu perfil...</main>;
  }

  if (!profile) {
    return (
      <main className="dashboard">
        <p>Não foi possível carregar o perfil.</p>
        <button onClick={() => router.replace("/login")}>
          Voltar ao início de sessão
        </button>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <Sidebar
        name={profile.name}
        email={profile.email}
        menuItems={menuItems}
        onLogout={handleLogout}
      />

      <section className="content">
        <header className="header">
          <h1>Dashboard - {profile.role}</h1>

          <div className="header-actions">
            <div className="search">
              🔍
              <input placeholder="Pesquisar..." />
            </div>

            <div className="notification">🔔</div>

            <div className="admin">
              👨‍💼
              <strong>{profile.name}</strong>
              <span>⌄</span>
            </div>
          </div>
        </header>

        <section className="stats">
          <Stat
            icon="👥"
            title="Total de Alunos"
            value={totalAlunos === null ? "—" : String(totalAlunos)}
            change={totalAlunos === null ? "A carregar..." : "Registos na base de dados"}
          />
          <Stat
            icon="👩‍🏫"
            title="Total de Professores"
            value="—"
            change="Dados por ligar"
          />
          <Stat
            icon="📚"
            title="Turmas"
            value="—"
            change="Dados por ligar"
          />
          <Stat
            icon="🏫"
            title="Salas"
            value="—"
            change="Dados por ligar"
          />
          <Stat
            icon="💻"
            title="PCs"
            value="—"
            change="Dados por ligar"
          />
        </section>

        <section className="panels">
          <div className="panel activities-panel">
            <div className="panel-header">
              <h2>Resumo de Atividades</h2>
            </div>
            <p>Os dados de atividade serão ligados à base de dados.</p>
          </div>

          <div className="panel pc-panel">
            <div className="panel-header">
              <h2>Estado dos PCs</h2>
            </div>
            <p>O estado dos computadores será carregado da base de dados.</p>
          </div>

          <div className="panel recent-panel">
            <div className="panel-header">
              <h2>Atividades Recentes</h2>
            </div>
            <p>As atividades recentes serão carregadas da base de dados.</p>
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