import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-blue-600">WorkForceX</h1>
          <p className="text-slate-500">AI-Powered Workforce Liquidity Platform</p>
        </header>
        
        <main className="card bg-white rounded-2xl shadow-md p-6 border border-slate-200">
          <Routes>
            <Route path="/" element={<div className="text-center py-12"><h2 className="text-2xl font-semibold mb-4">Welcome to WorkForceX</h2><p>The platform is currently under construction.</p></div>} />
            {/* Add more routes here */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
