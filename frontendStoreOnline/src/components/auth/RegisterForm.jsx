import { useState } from "react";
import { registerUser } from "../../api/userAPI";

const RegisterForm = () => {
    const [user, setUser] = useState({nombre: '', correo: '', contrasena: '', direccion: '', telefono: ''});
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(user);
            setMessage('Usuario registrado correctamente');
        } catch (err) {
            setMessage('Error en el registro');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
            <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />
            <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
            <input type="text" name="direccion" placeholder="Dirección" onChange={handleChange} required />
            <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required />

        <button  type="submit">Registrate</button>
        <p>{message}</p>
        </form>
    );
};

export default RegisterForm;