'use client'

import React, { useState } from "react";
import styles from "./page.module.css"; 

const ChangePasswordPage = () => {
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("As senhas não coincidem.");
        } else {
            alert("Senha alterada com sucesso!");
            window.location.href = "/componentes/login"; 
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h2 className={styles.h2}>Mudar a Senha</h2>
                <form id="passwordForm" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="verificationCode"
                        placeholder="Digite o código de verificação"
                        required
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Digite uma nova senha"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirmar nova senha"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Confirmar</button>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
