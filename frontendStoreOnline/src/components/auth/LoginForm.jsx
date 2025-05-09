import { useState } from "react";
import { login } from "../../api/userAPI";

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ correo: '', contrasena: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(credentials);
            setMessage('Inicio de sesión exitoso');
        } catch (err) {
            setMessage('Error en el inicio de sesión');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />
            <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
            <button type="submit">Iniciar sesión</button>
            <p>{message}</p>
        </form>
    );
};

export default LoginForm;