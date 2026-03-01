export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("okai_admin"));

  return (
    <div style={{ padding: "40px" }}>
      <h1>OKAI Admin Dashboard</h1>
      <p>Welcome, {user?.name}</p>
    </div>
  );
}
