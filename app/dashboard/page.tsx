"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/componets/Sibebar";
import { createClient } from "@/lib/supabase/client";

type UserRole =
  | "Aluno"
  | "Professor"
  | "Funcionário"
  | "Administrador Adjunto"
  | "Administrador";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
};

type MenuItem = {
  icon: string;
  label: string;
  href: string;
};

type DashboardStats = {
  totalAlunos: number | null;
  totalProfessores: number | null;
  totalFuncionarios: number | null;
  totalTurmas: number | null;
  totalSalas: number | null;
  totalPCs: number | null;
};

type CountTable =
  | "alunos"
  | "professores"
  | "funcionarios"
  | "turmas"
  | "salas"
  | "pcs";

const initialStats: DashboardStats = {
  totalAlunos: null,
  totalProfessores: null,
  totalFuncionarios: null,
  totalTurmas: null,
  totalSalas: null,
  totalPCs: null,
};

const adminMenu: MenuItem[] = [
  { icon: "🏠", label: "Dashboard", href: "/dashboard" },
  { icon: "👥", label: "Utilizadores", href: "/utilizadores" },
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

function getMenuItems(role: UserRole): MenuItem[] {
  const dashboard: MenuItem = {
    icon: "🏠",
    label: "Dashboard",
    href: "/dashboard",
  };

  switch (role) {
    case "Administrador":
    case "Administrador Adjunto":
      return adminMenu;

    case "Professor":
      return [
        dashboard,
        { icon: "📚", label: "Turmas", href: "/turmas" },
        { icon: "🎓", label: "Alunos", href: "/alunos" },
        { icon: "🗓️", label: "Horários", href: "#" },
        { icon: "✅", label: "Presenças", href: "/presencas" },
        { icon: "▣", label: "QR Codes", href: "/qr-code" },
        { icon: "💻", label: "PCs", href: "/computadores" },
      ];

    case "Funcionário":
      return [
        dashboard,
        { icon: "🏫", label: "Salas", href: "/salas" },
        { icon: "💻", label: "PCs", href: "/computadores" },
        { icon: "✅", label: "Presenças", href: "/presencas" },
        { icon: "▣", label: "QR Codes", href: "/qr-code" },
      ];

    case "Aluno":
      return [
        dashboard,
        { icon: "📚", label: "Turmas", href: "/turmas" },
        { icon: "🗓️", label: "Horários", href: "#" },
        { icon: "✅", label: "Presenças", href: "/presencas" },
      ];
  }
}

function isAdmin(role: UserRole) {
  return (
    role === "Administrador" ||
    role === "Administrador Adjunto"
  );
}

export default function Dashboard() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [stats, setStats] = useState<DashboardStats>(initialStats);

  useEffect(() => {
    let active = true;

    async function countTable(
      table: CountTable
    ): Promise<number | null> {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error(
          `Erro ao contar registos em ${table}:`,
          error.message
        );
        return null;
      }

      return count ?? 0;
    }

    async function loadDashboard() {
      try {
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
          console.error(
            "Não foi possível carregar o perfil:",
            error?.message
          );

          if (active) {
            setPageError(
              "Não foi possível carregar o teu perfil. Verifica a ligação e as permissões da tua conta."
            );
            setLoading(false);
          }

          return;
        }

        const roles: UserRole[] = [
          "Aluno",
          "Professor",
          "Funcionário",
          "Administrador Adjunto",
          "Administrador",
        ];

        if (!roles.includes(data.role as UserRole)) {
          if (active) {
            setPageError(
              "A tua conta não tem um cargo válido configurado."
            );
            setLoading(false);
          }
          return;
        }

        const currentProfile = data as UserProfile;

        if (currentProfile.status !== "Ativo") {
          await supabase.auth.signOut();
          router.replace("/login");
          return;
        }

        if (active) {
          setProfile(currentProfile);
          setLoading(false);
        }

        if (isAdmin(currentProfile.role)) {
          const [
            totalAlunos,
            totalProfessores,
            totalFuncionarios,
            totalTurmas,
            totalSalas,
            totalPCs,
          ] = await Promise.all([
            countTable("alunos"),
            countTable("professores"),
            countTable("funcionarios"),
            countTable("turmas"),
            countTable("salas"),
            countTable("pcs"),
          ]);

          if (active) {
            setStats({
              totalAlunos,
              totalProfessores,
              totalFuncionarios,
              totalTurmas,
              totalSalas,
              totalPCs,
            });
          }
        } else if (currentProfile.role === "Funcionário") {
          const [totalSalas, totalPCs] = await Promise.all([
            countTable("salas"),
            countTable("pcs"),
          ]);

          if (active) {
            setStats((previous) => ({
              ...previous,
              totalSalas,
              totalPCs,
            }));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar o Dashboard:", error);

        if (active) {
          setPageError(
            "Ocorreu um erro ao carregar o Dashboard. Tenta atualizar a página."
          );
          setLoading(false);
        }
      }
    }

    loadDashboard();

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
    return (
      <main className="dashboard">
        <section className="content">
          <p>A carregar o Dashboard...</p>
        </section>
      </main>
    );
  }

  if (pageError || !profile) {
    return (
      <main className="dashboard">
        <section className="content">
          <h1>Não foi possível abrir o Dashboard</h1>
          <p>{pageError || "Não foi possível carregar o perfil."}</p>
          <button type="button" onClick={() => router.replace("/login")}>
            Voltar ao início de sessão
          </button>
        </section>
      </main>
    );
  }

  const menuItems = getMenuItems(profile.role);

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
            <div className="admin">
              <span>👤</span>
              <strong>{profile.name}</strong>
              <span>{profile.role}</span>
            </div>
          </div>
        </header>

        {isAdmin(profile.role) && (
          <AdminDashboard stats={stats} />
        )}

        {profile.role === "Professor" && (
          <RoleDashboard
            title={`Bem-vindo, ${profile.name}`}
            description="Aqui encontrarás os acessos às ferramentas pedagógicas disponíveis para a tua conta."
            links={menuItems}
          />
        )}

        {profile.role === "Funcionário" && (
          <StaffDashboard stats={stats} links={menuItems} />
        )}

        {profile.role === "Aluno" && (
          <RoleDashboard
            title={`Bem-vindo, ${profile.name}`}
            description="Aqui encontrarás os acessos às tuas áreas académicas. Os teus horários, turmas e presenças devem ser apresentados a partir dos registos associados à tua conta."
            links={menuItems}
          />
        )}
      </section>
    </main>
  );
}

function AdminDashboard({ stats }: { stats: DashboardStats }) {
  return (
    <>
      <section className="stats">
        <Stat
          icon="🎓"
          title="Total de Alunos"
          value={formatCount(stats.totalAlunos)}
          change="Registos na base de dados"
        />
        <Stat
          icon="👩‍🏫"
          title="Total de Professores"
          value={formatCount(stats.totalProfessores)}
          change="Registos na base de dados"
        />
        <Stat
          icon="👥"
          title="Funcionários"
          value={formatCount(stats.totalFuncionarios)}
          change="Registos na base de dados"
        />
        <Stat
          icon="📚"
          title="Turmas"
          value={formatCount(stats.totalTurmas)}
          change="Registos na base de dados"
        />
        <Stat
          icon="🏫"
          title="Salas"
          value={formatCount(stats.totalSalas)}
          change="Registos na base de dados"
        />
        <Stat
          icon="💻"
          title="PCs"
          value={formatCount(stats.totalPCs)}
          change="Registos na base de dados"
        />
      </section>

      <section className="panels">
        <div className="panel activities-panel">
          <div className="panel-header">
            <h2>Resumo de Atividades</h2>
          </div>
          <p>
            Os dados de exemplo foram removidos para evitar mostrar
            atividades fictícias. Este painel será ligado à tabela
            logs quando confirmarmos os seus campos.
          </p>
        </div>

        <div className="panel pc-panel">
          <div className="panel-header">
            <h2>Estado dos PCs</h2>
          </div>
          <div className="donut-center">
            <strong>{formatCount(stats.totalPCs)}</strong>
            <span>Total de PCs</span>
          </div>
          <p>
            A distribuição entre livres, ocupados, reservados e em
            manutenção depende do campo de estado existente na tabela
            pcs, que ainda precisamos de confirmar.
          </p>
        </div>

        <div className="panel recent-panel">
          <div className="panel-header">
            <h2>Atividades Recentes</h2>
          </div>
          <p>
            As atividades serão apresentadas aqui depois de ligarmos
            este painel aos registos reais da tabela logs.
          </p>
        </div>
      </section>
    </>
  );
}

function StaffDashboard({
  stats,
  links,
}: {
  stats: DashboardStats;
  links: MenuItem[];
}) {
  return (
    <>
      <section className="stats">
        <Stat
          icon="🏫"
          title="Salas"
          value={formatCount(stats.totalSalas)}
          change="Registos na base de dados"
        />
        <Stat
          icon="💻"
          title="PCs"
          value={formatCount(stats.totalPCs)}
          change="Registos na base de dados"
        />
      </section>

      <RoleDashboard
        title="Área de Funcionário"
        description="Acede às áreas operacionais disponíveis para o teu cargo."
        links={links}
      />
    </>
  );
}

function RoleDashboard({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links: MenuItem[];
}) {
  return (
    <section className="panels">
      <div className="panel">
        <div className="panel-header">
          <h2>{title}</h2>
        </div>
        <p>{description}</p>

        <nav className="menu">
          {links
            .filter((item) => item.href !== "/dashboard")
            .map((item) =>
              item.href === "#" ? (
                <span className="menu-item" key={item.label}>
                  <span>{item.icon}</span>
                  {item.label} — ainda não disponível
                </span>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="menu-item"
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              )
            )}
        </nav>
      </div>
    </section>
  );
}

function formatCount(value: number | null) {
  return value === null ? "—" : String(value);
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
