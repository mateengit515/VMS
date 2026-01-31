import React, { useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MohsinLogo from '../../images/Mohsin.png';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={MohsinLogo} alt="Team Mohsin Bhai" className="login-logo" />
        <h1 className="login-title">Team Mohsin Bhai!</h1>
        <p className="login-subtitle">Sign in to continue</p>
        <Authenticator
          loginMechanisms={['username']}
          signUpAttributes={['email']}
          hideSignUp={true}
        />
      </div>
    </div>
  );
};

export default Login;
