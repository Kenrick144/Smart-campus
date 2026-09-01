import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2563eb, #1e3a8a)",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: "50px",
          borderRadius: "20px",
          textAlign: "center",
          width: "600px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            marginBottom: "20px",
          }}
        >
          🎓 Smart Campus
        </h1>

        <h2>Gestão Inteligente via QR Code</h2>

        <p
          style={{
            marginTop: "20px",
            fontSize: "18px",
          }}
        >
          Sistema de gestão escolar desenvolvido para a PAP.
        </p>

        <Link href="/login">
          <button
            style={{
              marginTop: "35px",
              padding: "15px 35px",
              fontSize: "18px",
              borderRadius: "10px",
              border: "none",
              background: "#22c55e",
              color: "white",
              cursor: "pointer",
            }}
          >
            Entrar no Sistema
          </button>
        </Link>
      </div>
    </main>
  );
}