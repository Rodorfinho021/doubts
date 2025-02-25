'use client';

import React, { useState } from "react";
import styles from "./page.module.css"; 

const NotificacoesPage = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [smsNotifications, setSmsNotifications] = useState(false);

    const handleNotificationsChange = () => {
        setNotificationsEnabled(!notificationsEnabled);
    };

    const handleEmailNotificationsChange = () => {
        setEmailNotifications(!emailNotifications);
    };

    const handleSmsNotificationsChange = () => {
        setSmsNotifications(!smsNotifications);
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
                    <li><a className={styles.links} href="/componentes/tela_perfil">Minha Conta</a></li>
                    <li><a className={styles.links} href=""> Notificações</a></li>
                    <li><a className={styles.links} href=""> Aparência</a></li>
                </ul>
            </div>

            <div className={styles.pai}>
                <div className={styles.content}>
                    <h2 className={styles.h2}>Configurações de Notificações</h2>
                    <label className={styles.switch}>
                        Notificações Gerais
                        <input
                            type="checkbox"
                            checked={notificationsEnabled}
                            onChange={handleNotificationsChange}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <label className={styles.switch}>
                        Pedidos de Amizades
                        <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={handleEmailNotificationsChange}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <label className={styles.switch}>
                        Notificações Canais
                        <input
                            type="checkbox"
                            checked={smsNotifications}
                            onChange={handleSmsNotificationsChange}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default NotificacoesPage;
