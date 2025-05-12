import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { useAuth } from "./context/AuthContext";
import FullPageLoader from "./components/common/FullPageLoader";

function App() {
  const { loading } = useAuth();

  if (loading) return <FullPageLoader />;

  return <RouterProvider router={router} />;
}

export default App;
