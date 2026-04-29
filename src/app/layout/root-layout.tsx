import { NavLink, Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div>
      <header>
        <h1>CafeOps Dashboard</h1>
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/inventory">Inventory</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
