'use client';

import React, { useState } from "react";
import styles from "./page.module.css"; 

const AparenciaPage = () => {
    const [originalMode, setOriginalMode] = useState(true);
    const [lightMode, setLightMode] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const handleOriginalModeChange = () => {
        setOriginalMode(!originalMode);
        setLightMode(false);
        setDarkMode(false);
    };

    const handleLightModeChange = () => {
        setLightMode(!lightMode);
        setOriginalMode(false);
        setDarkMode(false);
    };

    const handleDarkModeChange = () => {
        setDarkMode(!darkMode);
        setOriginalMode(false);
        setLightMode(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.homeIcon}>
                <a href="/" target="_blank">
                    <img src="/casa.png" alt="Início" className={styles.icone} />
                </a>
            </div>

            <div className={styles.sidebar}>
                <ul>
                    <li><a className={styles.links} href="/">Minha Conta</a></li>
                    <li><a className={styles.links} href="/componentes/notificaoes"> Notificações</a></li>
                    <li><a className={styles.links} href=""> Aparência</a></li>
                </ul>
            </div>

            <div className={styles.pai}>
                <div className={styles.content}>
                    <h2 className={styles.h2} >Configurações de Aparência</h2>
                    <label className={styles.switch}>
                        Modo original
                        <input
                            type="checkbox"
                            checked={originalMode}
                            onChange={handleOriginalModeChange}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <label className={styles.switch}>
                        Modo claro
                        <input
                            type="checkbox"
                            checked={lightMode}
                            onChange={handleLightModeChange}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <label className={styles.switch}>
                        Modo escuro
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={handleDarkModeChange}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default AparenciaPage;
