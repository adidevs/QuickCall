'use client'
import styles from './page.module.css'
import RoomInfo from './RoomInfo';
import {ContextProvider} from './SocketContext';

export default function Home() {
  return (
    <ContextProvider>
    <main className={styles.main}>
      <nav className={styles.nav }>
            <h1 className={styles.navItem}>QuickCall</h1>
            <h1 className={styles.navItem}  >{new Date().toDateString()}</h1>
        </nav>
      <h2>Connect with friends in an<br/>
      instant! </h2>
      <RoomInfo/>
    </main>
    </ContextProvider>
  )
}
