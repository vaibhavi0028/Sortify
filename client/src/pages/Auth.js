import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Auth.css";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const variants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 100 : -100,
    }),
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction > 0 ? -100 : 100,
    }),
  };

  const direction = location.pathname === "/auth/signup" ? 1 : -1;

  return (
    <div className="auth-container">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {location.pathname === "/auth/signup" ? (
          <motion.div
            key="signup"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.5 }}
          >
            <SignUp navigate={navigate} />
          </motion.div>
        ) : location.pathname === "/auth/signin" ? (
          <motion.div
            key="signin"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={direction}
            transition={{ duration: 0.5 }}
          >
            <SignIn navigate={navigate} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const SignIn = ({ navigate }) => {
  const [password, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({ name: "", email: "" });

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/;
    return emailPattern.test(email);
  };

  const handleSignIn = () => {
    let errors = { password: "", email: "" };

    if (!password) {
      errors.password = "Please enter your password.";
    }
    if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
    
    if (errors.password || errors.email) {
      setError(errors);
      return;
    }

    setError({ password: "", email: "" });
    navigate("/dashboard");
  };

  return (
    <div className="auth-row">
      <div className="auth-image"></div>
      <div className="auth-form">
        <h1>Sign In</h1>
        
        <div className="input-control">
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {error.email && <p style={{ color: 'red', margin: '10px 0 0 0'  }}>{error.email}</p>}
        </div>
        <div className="input-control">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setName(e.target.value)} />
          {error.password && <p style={{ color: 'red', margin: '10px 0 0 0'  }}>{error.password}</p>}
        </div>
        <div className="forgot-password">Forgot Password?</div>
        <div className="submit-button">
          <button onClick={handleSignIn}>Sign In</button>
          <p>
            Don't have an account?{" "}
            <Link to="/auth/signup" style={{ textDecoration: 'none', color: 'inherit' }}>
              <b className="forgot-password">Sign Up</b>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const SignUp = ({ navigate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,3}$/;
    return emailPattern.test(email);
  };

  const handleSignUp = () => {
    let errors = { name: "", email: "", password: "", confirmPassword: "" };

    if (!name) {
      errors.name = "Please enter your name.";
    }
    if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!password) {
      errors.password = "Please enter a password.";
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (errors.name || errors.email || errors.password || errors.confirmPassword) {
      setError(errors);
      return;
    }

    setError({ name: "", email: "", password: "", confirmPassword: "" });
    navigate("/dashboard");
  };

  return (
    <div className="auth-row">
      <div className="auth-image"></div>
      <div className="auth-form">
        <h1>Sign Up</h1>
        <div className="input-control">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          {error.name && <p style={{ color: 'red', margin: '10px 0 0 0'  }}>{error.name}</p>}
        </div>
        <div className="input-control">
          <label>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {error.email && <p style={{ color: 'red', margin: '10px 0 0 0'  }}>{error.email}</p>}
        </div>
        <div className="input-control">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error.password && <p style={{ color: 'red', margin: '10px 0 0 0'  }}>{error.password}</p>}
        </div>
        <div className="input-control">
          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {error.confirmPassword && <p style={{ color: 'red', margin: '10px 0 0 0'  }}>{error.confirmPassword}</p>}
        </div>
        <div className="submit-button">
          <button onClick={handleSignUp}>Sign Up</button>
          <p>
            Already have an account?{" "}
            <Link to="/auth/signin" style={{ textDecoration: 'none', color: 'inherit' }}>
              <b className="forgot-password">Sign In</b>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
