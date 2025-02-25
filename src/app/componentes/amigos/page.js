import React from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';

const ChatInterface = () => {
  return (
    <div className={styles.bodyMain}>
      {/* Left Side */}
      <div className={styles.leftSide}>
        <header className={styles.header}>
        <div className={styles.back}>
       <Link href="/">
      <Image src="/voltar-botao.png" alt="Voltar" width={50} height={50} className={styles.voltar_botao} />
      </Link>
      <p className={styles.p}>Amigos</p>

      

      </div>
          <div className={styles.icons}>
            <div className={styles.iconContainer}>
            
            <Link href="/componentes/notificaamizada">
            <Image src="/notificacao.png" alt="Voltar" width={55} height={55} className={styles.voltar_botao} />
            </Link>

            <Link href="/componentes/adicionaramg">
            <Image src="/mais.png" alt="Voltar" width={55} height={55} className={styles.voltar_botao} />
            </Link>
             
            <Link href="../html/aparéncia.html">
            <Image src="/engrenagem.png" alt="Voltar" width={55} height={55} className={styles.voltar_botao} />
            </Link>
        
            </div>
          </div>
        </header>

        {/* Barra de pesquisa e amigos */}
        <input type="text" className={styles.search} placeholder="Pesquisar" />

        <div className={styles.friendsHeader}>
          <h2>Meus Amigos</h2>
          <button className={styles.removeFriends}>Remover amigos</button>
        </div>

        <section className={styles.friends}>
          <div className={styles.friend}>
          <Image  className={styles.imagem} src="/rafaela.jpg" alt="Rafaela" width={50} height={50}  />
            <div className={styles.friendInfo}>
              <h3 >Rafaela</h3>
            </div>
          </div>
          <div className={styles.friend}>
          <Image  className={styles.imagem} src="/lucas.jpg" alt="Lucas" width={50} height={50}  />
            <div className={styles.friendInfo}>
              <h3>Lucas</h3>
            </div>
          </div>
        </section>

        <footer className={styles.logo}>
          <svg width="210" height="111" viewBox="0 0 210 111" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42.884 110H1L40.0444 1H78.3788L111.744 50.5455L96.8362 68.8392L56.372 20.0559L28.686 81.035L42.884 110Z" stroke="white" />
            <path d="M47.1433 61.979L56.372 38.3497L96.8362 81.035L151.498 20.0559L156.468 45.972L101.096 110H78.3788L47.1433 61.979Z" stroke="white" />
            <path d="M169.956 38.3497L156.468 1H209L140.85 110H121.683L169.956 38.3497Z" stroke="white" />
          </svg>
        </footer>
      </div>

      {/* Chat Section */}
      <div className={styles.rightSide}>
        <div className={styles.chatHeader}>
        <Image  className={styles.imagem} src="/rafaela.jpg" alt="Rafaela" width={50} height={50}  />
          <div className={styles.chatInfo}>
            <h3 className={styles.tit}>Rafaela</h3>
            <p>Online</p>
          </div>
        </div>

        <div className={styles.chat}>
          <div className={`${styles.messageBox} ${styles.left}`}>
            <div className={styles.messageSender}>Rafaela:</div>
            <div className={styles.messageContent}>Lucass!! Você viu minhas chaves do carro???</div>
          </div>
          <div className={`${styles.messageBox} ${styles.right}`}>
            <div className={styles.messageSender}>Lucas:</div>
            <div className={styles.messageContent}>Não eu não vi elas! Não esqueceu na sua bolsa??</div>
          </div>
          <div className={`${styles.messageBox} ${styles.left}`}>
            <div className={styles.messageSender}>Rafaela:</div>
            <div className={styles.messageContent}>Naoo, olha na minha gaveta do escritorio, pfv!!</div>
          </div>
          <div className={`${styles.messageBox} ${styles.right}`}>
            <div className={styles.messageSender}>Lucas:</div>
            <div className={styles.messageContent}>Ultima vez que vi tava sobre a estante</div>
          </div>
          <div className={`${styles.messageBox} ${styles.left}`}>
            <div className={styles.messageSender}>Rafaela:</div>
            <div className={styles.messageContent}>Acheii!! Estavam lá mesmo. Muito obrigada, Lucas!!</div>
          </div>
        </div>

        <div className={styles.chatFooter}>
      <input 
        type="text" 
        className={styles.chatFooterInput} 
        placeholder="Escreva..." 
      />
      <button className={styles.chatFooterButton}>&#9658;</button>
    </div>
      </div>
    </div>
  );
};

export default ChatInterface;
