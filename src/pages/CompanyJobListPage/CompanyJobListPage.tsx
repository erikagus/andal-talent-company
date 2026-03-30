import { MapPin, Briefcase, Users, Globe, ClockUser, ClockClockwise } from '@phosphor-icons/react'
import logoCompany from '../../assets/logo-company.png'
import { Button } from '../../design-system'
import { Navbar } from '../../components'
import './CompanyJobListPage.css'

const COMPANY = {
  name: 'PT Nusantara Teknologi Digital',
  location: 'DKI Jakarta, Indonesia',
  industry: 'Information Technology & Software',
  employeeRange: '50 - 100 Employees',
  website: 'https://www.nusantaratech.id',
  description:
    'PT Nusantara Teknologi Digital is a technology company focused on building innovative digital solutions that help businesses operate more efficiently and grow sustainably. We specialize in developing modern web platforms, enterprise systems, and scalable digital products designed to improve productivity and user experience across various industries. Driven by collaboration and continuous learning, our team values creativity, integrity, and impact. We foster a supportive work environment where individuals are encouraged to grow professionally, contribute ideas, and create meaningful technology that makes a real difference for businesses and communities.',
}

interface Job {
  id: number
  title: string
  location: string
  type: string
  experience: string
  daysLeft: number
  salary: string
}

const JOBS: Job[] = [
  {
    id: 1,
    title: 'Sales Manager',
    location: 'DKI Jakarta, Indonesia',
    type: 'Full Time',
    experience: 'Mid-Senior Level',
    daysLeft: 123,
    salary: 'Rp 12-18 jt',
  },
  {
    id: 2,
    title: 'Sales Staff',
    location: 'DKI Jakarta, Indonesia',
    type: 'Contract',
    experience: 'Entry Level',
    daysLeft: 42,
    salary: 'Rp 5 jt',
  },
  {
    id: 3,
    title: 'Graphic Designer',
    location: 'DKI Jakarta, Indonesia',
    type: 'Full Time',
    experience: 'Entry Level',
    daysLeft: 12,
    salary: 'Rp 6-10 jt',
  },
  {
    id: 4,
    title: 'HR & Talent Acquisition Lead',
    location: 'DKI Jakarta, Indonesia',
    type: 'Full Time',
    experience: 'Senior Level',
    daysLeft: 7,
    salary: 'Rp 20-25 jt',
  },
]

function JobCard({ title, location, type, experience, daysLeft, salary }: Job) {
  return (
    <div className="job-card">
      {/* Avatar + title + company */}
      <div className="job-card__header">
        <div className="job-card__avatar">
          <img className="job-card__avatar-img" src="{logoCompany}" alt="" />
        </div>
        <div className="job-card__title-group">
          <h3 className="job-card__title">{title}</h3>
          <span className="job-card__company">{COMPANY.name}</span>
        </div>
      </div>

      {/* Two-column meta */}
      <div className="job-card__meta">
        <div className="job-card__meta-col">
          <div className="job-card__meta-item">
            <MapPin size={16} className="job-card__meta-icon" weight="fill" />
            <span>{location}</span>
          </div>
          <div className="job-card__meta-item">
            <Briefcase size={16} className="job-card__meta-icon" weight="fill" />
            <span>{type}</span>
          </div>
        </div>
        <div className="job-card__meta-col">
          <div className="job-card__meta-item">
            <ClockUser size={16} className="job-card__meta-icon" weight="fill" />
            <span>{experience}</span>
          </div>
          <div className="job-card__meta-item">
            <ClockClockwise size={16} className="job-card__meta-icon" weight="fill" />
            <span>{daysLeft} Day(s) Left</span>
          </div>
        </div>
      </div>

      {/* Footer: salary + Apply button */}
      <div className="job-card__footer">
        <div className="job-card__salary">
          <span className="job-card__salary-label">Gaji/Bulan</span>
          <span className="job-card__salary-amount">{salary}</span>
        </div>
        <div className="job-card__actions">
          <Button variant="Solid" size="Small" color="Primary">
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function CompanyJobListPage() {
  return (
    <div className="company-job-list-page">
      <Navbar />

      <main className="company-job-list-page__main page-content">
        {/* Company profile card */}
        <div className="company-card">
          <div className="company-card__body">
            {/* Company logo */}
            <div className="company-card__logo-upload">
              <img
                className="company-card__logo-placeholder"
                src="{logoCompany}"
                alt={COMPANY.name}
              />
            </div>

            {/* Company info */}
            <div className="company-card__info">
              <h1 className="company-card__name">{COMPANY.name}</h1>

              <div className="company-card__meta">
                <div className="company-card__meta-row">
                  <div className="company-card__meta-item">
                    <MapPin size={16} className="company-card__meta-icon" weight="fill" />
                    <span>{COMPANY.location}</span>
                  </div>
                  <div className="company-card__meta-item">
                    <Briefcase size={16} className="company-card__meta-icon" weight="fill" />
                    <span>{COMPANY.industry}</span>
                  </div>
                </div>
                <div className="company-card__meta-row">
                  <div className="company-card__meta-item">
                    <Users size={16} className="company-card__meta-icon" weight="fill" />
                    <span>{COMPANY.employeeRange}</span>
                  </div>
                  <div className="company-card__meta-item">
                    <Globe size={16} className="company-card__meta-icon" weight="fill" />
                    <a className="company-card__link" href={COMPANY.website} target="_blank" rel="noreferrer">
                      {COMPANY.website}
                    </a>
                  </div>
                </div>
              </div>

              <p className="company-card__description">{COMPANY.description}</p>
            </div>
          </div>
        </div>

        {/* Job list section */}
        <div className="job-section">
          <div className="job-section__header">
            <h2 className="job-section__title">Job List</h2>
            <p className="job-section__subtitle">Updated 5 minutes ago</p>
          </div>
          <div className="job-grid">
            {JOBS.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
