import React from "react";
import styles from "./page.module.css"; // Importando o CSS module
import Link from "next/link";
import Image from "next/image";

const AdicionarAmigos = () => {
  return (
    <section className={styles.bodyMain}>
      {/* Lado Esquerdo */}
      <section className={styles.leftSide}>
        <div >
                 <svg className={styles.logo} width="100" height="50" viewBox="0 0 150 63" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30.6007 62H1L28.5939 1H55.686L79.2662 28.7273L68.7304 38.965L40.1331 11.6643L20.5666 45.7902L30.6007 62Z" stroke="white"/>
                    <path d="M33.6109 35.1259L40.1331 21.9021L68.7304 45.7902L107.362 11.6643L110.874 26.1678L71.7406 62H55.686L33.6109 35.1259Z" stroke="white"/>
                    <path d="M120.406 21.9021L110.874 1H148L99.8362 62H86.2901L120.406 21.9021Z" stroke="white"/>
                </svg>
        </div>

        <nav className={styles.menu}>
    <Link className={styles.link} href="#">
        <p>Minha Conta</p>
    </Link>
    <Link className={styles.link} href="#">
        <p>Notificações</p>
    </Link>
    <Link className={styles.link} href="#">
        <p>Aparência</p>
    </Link>
</nav>




        <div className={styles.itens}>
       
        <Link href="/">
            <Image src="/casa.png" alt="Voltar" width={40} height={40} className={styles.img_t} />
            </Link>

            <Link href="/componentes/aparencia">
            <Image src="/engrenagem.png" alt="Voltar" width={40} height={40} className={styles.img_t} />
            </Link>
             
            <Link href="../html/aparéncia.html">
            <Image src="/sino.png" alt="Voltar" width={40} height={40} className={styles.img_t} />
            </Link>
        </div>
      </section>

      {/* Lado Direito */}
      <section className={styles.rightSide}>
        <div className={styles.header}>
          <h1>Adicionar amigos:</h1>
          <input
            type="text"
            className={styles.search}
            placeholder="Pesquisar"
          />
        </div>

        <div className={styles.userList}>
          <div className={styles.userCard}>
            <div className={styles.userIcon}>👤</div>
            <div className={styles.userInfo}>
              <span>Nome do usuário</span>
            </div>
            <button className={styles.addBtn}>Adicionar</button>
          </div>
        </div>
      </section>
    </section>
  );
};

export default AdicionarAmigos;
