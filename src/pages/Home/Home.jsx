import { Button } from 'design-system'
import 'design-system/styles/tokens.css'
import 'design-system/styles/global.css'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">PT Nusantara Teknologi Digital</h1>
        <p className="home__subtitle">Find the best talent for your company</p>
      </header>
      <div className="home__actions">
        <Button variant="Solid" size="Medium" color="Primary">
          Post a Job
        </Button>
        <Button variant="Outline" size="Medium" color="Primary">
          Browse Candidates
        </Button>
      </div>
    </div>
  )
}
