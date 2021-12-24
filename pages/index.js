import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Badge from '../components/Badge'
import { useState } from 'react'

export default function Home() {
  const [userName, setUserName] = useState('')
  const [badgeData, setBadgeData] = useState()

  const onNameSubmit = async (e) => {
    e.preventDefault()
    if(!userName){
      alert('Lütfen GitHub kullanıcı adını giriniz.')
      return
    }
    console.log('submitted:', userName)
    const response = await fetch('/api/fetch_badge', {
      method: 'POST',
      body: JSON.stringify({ user: userName }),
      headers: { 'Content-Type': 'application/json' }
    })
    const data = await response.json()
    setBadgeData(data)
    // console.log({ data })
  }
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Generate GitHub Badge</title>
        <meta name="description" content="GitHub Badge" />
        <link rel="icon" href="/icons/id-card.png" />
      </Head>

      <main className={styles.main}>
        <form className='form' onSubmit={onNameSubmit} >
            <div className='form-control'>
                <label className='lbl'>GitHub Kullanıcı Adı:</label>
                <input type='text' placeholder='torvalds' onChange={(e) => setUserName(e.target.value)} />
            </div>
        </form>
        <Badge data={badgeData} />
      </main>
    </div>
  )
}
