"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";


export default function Sidebar() {
  const [mensagem, setMensagem] = useState("");
  const [mensagens, setMensagens] = useState([]);
  const [mostrarMais, setMostrarMais] = useState(false);

  const enviarMensagem = () => {
    if (mensagem.trim() !== "") {
      setMensagens([...mensagens, mensagem]);
      setMensagem("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      enviarMensagem();
    }
  };

  const canais = [
    { nome: "Curso", image: "/download.jpg"  },
    { nome: "Noticias", image: "/images.jpg" },
    { nome: "Java", image: "/download (1).jpg" },
    { nome: "Python", image: "/download.png" },
    { nome: "React", image: "/download.png" }
  ];

  return (
    <div className={styles.divPrincipal}>
      <div className={styles.conteinerLateral}>
        <h1 className="t">Canais</h1>
        
        {canais.slice(0, mostrarMais ? canais.length : 2).map((canal, index) => (
          <div key={index} className={styles.carde}>
            <button className={styles.botao}>
              <div className={styles.carImg}>
                <Image src={canal.image} alt={canal.nome} className={styles.modificaImg} width={50} height={50} />
              </div>
              <p>{canal.nome}</p>
            </button>
          </div>
        ))}

        <button onClick={() => setMostrarMais(!mostrarMais)} className={styles.mostrarMais}>
          {mostrarMais ? "Mostrar Menos" : "Mostrar Mais"}
        </button>

        <Image className={styles.logo} src="/logo.jpeg" alt="Logo" width={200} height={200} />

        <div className={styles.iconeConteiner}>
          <Link href="/componentes/aparencia" >
            <Image src="/engrenagem.png" alt="Configuração" className={styles.icone} width={40} height={40} />
          </Link>
          <Link href="/componentes/notificaoes" >
            <Image src="/sino.png" alt="Notificações" className={styles.icone} width={40} height={40} />
          </Link>
          <Link href="/">
            <Image src="/casa.png" alt="Início" className={styles.icone} width={40} height={40} />
          </Link>
        </div>
      </div>

      <div className={styles.mensagensContainer}>
        {mensagens.map((msg, index) => (
          <div key={index} className={styles.mensagem}>{msg}</div>
        ))}
      </div>

      <div className={styles.menssagemBarra}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          className={styles.menssagemInput}
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className={styles.botaoEnviar} onClick={enviarMensagem}>
          Enviar
        </button>
      </div>
    </div>
  );
}

