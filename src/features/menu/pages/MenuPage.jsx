import { useState } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useFetch } from "../hooks/useFetch";
import MenuList from "../components/MenuList";

function MenuPage() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  
  // frontend: read the API base URL from the environment
  const API = import.meta.env.VITE_API_URL;
  // 1. Fetch data from backend API if configured, otherwise fallback to /menu.json
  const menuUrl = API ? `${API}/api/menu` : "/menu.json";
  const { data: dishes, isLoading, error } = useFetch(menuUrl);

  // 2. Handle Loading State
  if (isLoading) return <p>Loading menu...</p>;
  
  // 3. Handle Error State
  if (error) return <p>Could not load menu: {error}</p>;

  // 4. Handle Success State (filtering logic)
  // Ensure dishes is not null before filtering
  const filtered = (dishes || []).filter((d) =>
    d.name.toLowerCase().includes(debounced.toLowerCase())
  );

  return (
    <div>
      <h2>Menu</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search dishes..."
      />
      <MenuList dishes={filtered} />
    </div>
  );
}

export default MenuPage;