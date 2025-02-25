'use client'

import React, { useState } from "react";
import styles from "./page.module.css";

const LoginPage = () => {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Usuário: ${usuario}\nSenha: ${senha}`);

      
        window.location.href = "/"; 
    };

    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <h2 className={styles.h2}>Login</h2>
                <div className={styles.inputGroup}>
                    <label htmlFor="usuario">Usuário</label>
                    <input
                        type="text"
                        id="usuario"
                        name="usuario"
                        required
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        required
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                </div>
               
                <button type="submit" className={styles.submitButton}>Entrar</button>
                <div className={styles.forgotPassword}>
                    <a href="/componentes/trocar-senha">Esqueceu a senha?</a>
                </div>
                <div className={styles.register}>
                    <a href="/componentes/casdastrar">Cadastrar-se</a>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
