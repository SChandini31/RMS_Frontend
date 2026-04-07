import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import UsersPage from "./pages/users/UsersPage";
import PublicationsPage from "./pages/publications/PublicationsPage";
import AuditLogsPage from "./pages/audit/AuditLogsPage";
import MetricsPage from "./pages/metrics/MetricsPage";
import AddPublicationPage from "./pages/publications/AddPublicationPage";
import AddUsersPage from "./pages/users/AddUsersPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="/publications/add" element={<AddPublicationPage />} />
        <Route path="/users/add" element={<AddUsersPage />} />
      </Routes>
    </Router>
  );
}

export default App;