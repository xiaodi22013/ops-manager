import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleKeycloakLogin = () => {
    setIsLoading(true);
    // Simulate redirect to Identity Provider
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'ADMIN');
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 w-full max-w-md text-center border border-slate-200">
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-50 rounded-full">
                <ShieldCheck size={48} className="text-primary" />
            </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
        <p className="text-slate-500 mb-8">OpsManager Platform Access</p>

        <button
          onClick={handleKeycloakLogin}
          disabled={isLoading}
          className={`
            w-full flex items-center justify-center gap-3 py-3 px-6 rounded-lg text-white font-medium shadow-lg transition-all
            ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-blue-600 active:scale-95'}
          `}
        >
          {isLoading ? (
            <span className="animate-pulse">Redirecting to SSO...</span>
          ) : (
            <>
              <Lock size={20} />
              <span>Login with Keycloak SSO</span>
            </>
          )}
        </button>

        <div className="mt-8 text-xs text-slate-400">
          <p>Protected by Enterprise SSO.</p>
          <p>Contact IT support for access issues.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;