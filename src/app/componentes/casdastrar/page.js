'use client'

import React, { useState } from "react";
import styles from "./page.module.css"; // Import do CSS Module

const Page = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("As senhas não coincidem.");
        } else {
            alert("Cadastro realizado com sucesso!");
            // Não precisamos do useRouter, então, apenas submeteremos e depois o link leva para o login
            window.location.href = "/componentes/login"; // Navegação direta usando o link
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.h2}>Cadastrar-se</h2>
                <form id="registerForm" onSubmit={handleSubmit}>
                    <input
                        className={styles.input}
                        type="text"
                        id="username"
                        placeholder="Nome de usuário"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="email"
                        id="email"
                        placeholder="Seu gmail"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        id="password"
                        placeholder="Criar senha"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        className={styles.input}
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirmar senha"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <input className={styles.submitButton} type="submit" value="Confirmar" />
                </form>
            </div>
        </div>
    );
};

export default Page;
