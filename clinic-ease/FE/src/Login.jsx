import { useState } from 'react';
import axios from 'axios';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const url = isLogin
                ? 'http://localhost:8080/api/auth/login'
                : 'http://localhost:8080/api/auth/signup';

            const payload = isLogin
                ? { email, password }
                : { username, email, password };

            const response = await axios.post(url, payload);

            if (isLogin) {
                const { token } = response.data;
                localStorage.setItem('token', token);
                window.location.href = '/'; // Redirect after login
            } else {
                // After signup, auto switch to login
                alert('Signup successful! Please login.');
                setIsLogin(true);
                setUsername('');
                setEmail('');
                setPassword('');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleAuth} style={styles.form}>
                <h2 style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</h2>

                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                />

                {error && <p style={styles.error}>{error}</p>}

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
                </button>

                <p style={styles.toggleText}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span onClick={toggleMode} style={styles.toggleLink}>
                        {isLogin ? ' Sign Up' : ' Login'}
                    </span>
                </p>
            </form>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        boxShadow: '0px 8px 24px rgba(0,0,0,0.2)',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: '#333',
    },
    input: {
        padding: '10px',
        marginBottom: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '1rem',
    },
    button: {
        padding: '10px',
        backgroundColor: '#74ebd5',
        border: 'none',
        borderRadius: '5px',
        fontSize: '1rem',
        color: '#333',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    toggleText: {
        marginTop: '1rem',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#555',
    },
    toggleLink: {
        color: '#007bff',
        marginLeft: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};
