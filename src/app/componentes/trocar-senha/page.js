'use client'

import React, { useState } from "react";
import styles from "./page.module.css"; 

const ResetPasswordPage = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Código de confirmação enviado para: ${email}`);
        
      
        window.location.href = "/componentes/mudarsenha"; 
    };

    return (
        <div className={styles.container}>
            <div className={styles.formBox}>
                <h2 className={styles.h2}>Trocar senha do usuário</h2>
                <form id="resetForm" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="email"
                        placeholder="Insira email cadastrado"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>Confirmar</button>
                    <p className={styles.p}>Ao confirmar o e-mail você receberá um código de confirmação</p>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
