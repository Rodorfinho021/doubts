'use client'

import styles from "./page.module.css";
import { useState } from "react";

export default function Page() {
  const [requests, setRequests] = useState([
    { id: "request1", username: "Usuario01", status: null },
    { id: "request2", username: "Usuario02", status: null },
  ]);

  const respond = (id, message) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: message } : req
      )
    );
  };

  return (
    <div className={styles.container}>
   
      <div className={styles.leftPanel}>
        <div className={styles.logo}>N</div>
        <div className={styles.iconeContainer}>
          <a href="/" target="">
            <img src="/simbolo-de-interface-da-roda-dentada-de-configuracao.png" alt="Configuração" className={styles.icone} />
          </a>
          <a href="/componentes/aparencia" target="">
            <img src="/sino.png" alt="Notificações" className={styles.icone} />
          </a>
          <a href="/" target="">
            <img src="/casa.png" alt="Início" className={styles.icone} />
          </a>
        </div>
      </div>


      <div className={styles.rightPanel}>
        <div className={styles.header}>Pedidos de amizade</div>
        {requests.map((req) => (
          <div key={req.id} className={styles.friendRequest}>
            {req.status ? (
              <span
                style={{ fontWeight: "bold", color: req.status.includes("aceito") ? "#4caf50" : "#f44336" }}
              >
                {req.status}
              </span>
            ) : (
              <>
                <div className={styles.profile}>
                  <div className={styles.profileIcon}></div>
                  <div className={styles.username}>{req.username}</div>
                </div>
                <div className={styles.buttons}>
                  <button className={styles.acceptBtn} onClick={() => respond(req.id, "Pedido aceito!")}>Aceitar</button>
                  <button className={styles.declineBtn} onClick={() => respond(req.id, "Pedido recusado!")}>Recusar</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
