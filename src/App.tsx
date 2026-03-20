import Home from "./pages/Home";
import LogoutBridge from "./components/LogoutBridge";

function App() {
  const path = window.location.pathname;

  if (path === "/logout-bridge") {
    return <LogoutBridge />;
  }

  return <Home />;
}

export default App;