'use client'
import { useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import styls from "./teste.css"


export default function PerfilUsuario() {
  const [foto, setFoto] = useState("https://via.placeholder.com/180");
  const [nome, setNome] = useState("João");
  const [sobrenome, setSobrenome] = useState("Arriba");
  const [email, setEmail] = useState("joaoarriba081k@gmail.com");
  const [dataNascimento, setDataNascimento] = useState("1998-06-17");
  const [genero, setGenero] = useState("Masculino");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");

  const alterarFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelar = () => {
    alert("As alterações foram canceladas.");
  };

  const atualizar = () => {
    if (senha !== confirmacaoSenha) {
      setMensagemErro("As senhas não coincidem. Tente novamente.");
    } else {
      setMensagemErro("");
      alert("Informações atualizadas com sucesso!");
    }
  };

  return (
    <div className={styles["container-perfil"]}>
      <Image src='/user.png' alt="Foto de perfil" width={90} height={90} className={styles["foto-perfil"]} />
      <label htmlFor="inputFoto" className={styles["botao-alterar-foto"]}>
        Alterar Foto
      </label>
      <input type="file" id="inputFoto" accept="image/*" onChange={alterarFoto} style={{ display: "none" }} />
      <div className={styles["nome-sobrenome"]}>
        <div className={styles.campo}>
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div className={styles.campo}>
          <label htmlFor="sobrenome">Sobrenome</label>
          <input type="text" id="sobrenome" value={sobrenome} onChange={(e) => setSobrenome(e.target.value)} />
        </div>
      </div>
      <div className={styles.campo}>
        <label htmlFor="email">Email</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className={styles["data-genero"]}>
        <div className={styles.campo}>
          <label htmlFor="dataNascimento">Data de Nascimento</label>
          <input type="date" id="dataNascimento" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
        </div>
        <div className={styles.campo}>
          <label htmlFor="genero">Gênero</label>
          <input type="text" id="genero" value={genero} onChange={(e) => setGenero(e.target.value)} />
        </div>
      </div>
      <div className={styles.campo}>
        <label htmlFor="senha">Senha</label>
        <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
      </div>
      <div className={styles.campo}>
        <label htmlFor="confirmacaoSenha">Confirmação de Senha</label>
        <input type="password" id="confirmacaoSenha" value={confirmacaoSenha} onChange={(e) => setConfirmacaoSenha(e.target.value)} />
      </div>
      {mensagemErro && <div className={styles.erro}>{mensagemErro}</div>}
      <div className={styles.botoes}>
        <button className={`${styles.botao} ${styles.cancelar}`} onClick={cancelar}>Cancelar</button>
        <button className={`${styles.botao} ${styles.atualizar}`} onClick={atualizar}>Atualizar</button>
      </div>
    </div>
  );
}
