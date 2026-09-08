import { Link, Route, Routes } from 'react-router-dom';
import { ProjectListPage } from './presentation/pages/ProjectListPage';
import { ProjectPage } from './presentation/pages/ProjectPage';

function NotFound() {
  return (
    <div className="not-found">
      <p>Page not found.</p>
      <Link to="/">Back to projects</Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-title">
          Smart4Qube
        </Link>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProjectListPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/projects/:projectId/*" element={<ProjectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
