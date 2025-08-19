import WaitlistForm from '@/components/WaitlistForm'
import Hero from '@/components/Hero'
import './page.css'

export default function Home() {
  return (
    <main className="main">
      <Hero />
      <WaitlistForm />
    </main>
  )
}
