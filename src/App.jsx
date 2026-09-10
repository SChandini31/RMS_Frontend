import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import UsersPage from "./pages/users/UsersPage";
import PublicationsPage from "./pages/publications/PublicationsPage";
import AuditLogsPage from "./pages/audit/AuditLogsPage";
import AuditLogsListPage from "./pages/audit/AuditLogsListPage";
import MetricsPage from "./pages/metrics/MetricsPage";
import AddPublicationPage from "./pages/publications/AddPublicationPage";
import JournalPublicationPage from "./pages/publications/JournalPublicationPage";
import BookPublicationPage from "./pages/publications/BookPublicationPage";
import BookChapterPublicationPage from "./pages/publications/BookChapterPublicationPage";
import ConferencePublicationPage from "./pages/publications/ConferencePublicationPage";
import ConsultancyPublicationPage from "./pages/publications/ConsultancyPublicationPage";
import PatentPublicationPage from "./pages/publications/PatentPublicationPage";
import ResearchCollaborationPage from "./pages/publications/ResearchCollaborationPage";
import ResearchProjectsPage from "./pages/publications/ResearchProjectsPage";
import AddUsersPage from "./pages/users/AddUsersPage";
import ResearchSupportPublicationPage from "./pages/publications/ResearchSupportPublicationPage";


function App() {
  return (
    <NotificationProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/audit-logs/logs" element={<AuditLogsListPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="/publications/add" element={<AddPublicationPage />} />
        <Route path="/publications/add/journal" element={<JournalPublicationPage />} />
        <Route path="/publications/add/book" element={<BookPublicationPage />} />
        <Route path="/publications/add/book-chapter" element={<BookChapterPublicationPage />} />
        <Route path="/publications/add/conference" element={<ConferencePublicationPage />} /> 
        <Route path="/publications/add/consultancy" element={<ConsultancyPublicationPage />} />
        <Route path="/publications/add/patent" element={<PatentPublicationPage />} />
        <Route path="/publications/add/research-collaboration" element={<ResearchCollaborationPage />} />
        <Route path="/publications/add/research-project" element={<ResearchProjectsPage />} />
        <Route path="/publications/add/research-support" element={<ResearchSupportPublicationPage/>} />
        <Route path="/users/add" element={<AddUsersPage />} />
      </Routes>
    </Router>
    </NotificationProvider>
  );
}

export default App;