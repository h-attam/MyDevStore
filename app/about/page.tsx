import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hakkımda - My Dev Store',
  description: 'Becerilerim, deneyimlerim, projelerim ve iletişim bilgilerim',
}

// Bu veriler Supabase'den veya bir config dosyasından gelebilir
const skills = [
  { name: 'Next.js', level: 90, category: 'Frontend' },
  { name: 'TypeScript', level: 85, category: 'Language' },
  { name: 'React', level: 90, category: 'Frontend' },
  { name: 'Supabase', level: 80, category: 'Backend' },
  { name: 'Tailwind CSS', level: 85, category: 'Styling' },
  { name: 'Node.js', level: 75, category: 'Backend' },
  { name: 'PostgreSQL', level: 70, category: 'Database' },
  { name: 'Stripe API', level: 75, category: 'Payment' },
]

const experiences = [
  {
    title: 'Full Stack Developer',
    company: 'Freelance',
    period: '2022 - Şimdi',
    description: 'Next.js, TypeScript ve Supabase kullanarak modern web uygulamaları geliştiriyorum. E-ticaret platformları, portfolio siteleri ve kurumsal web uygulamaları üzerinde çalışıyorum.',
  },
  {
    title: 'Frontend Developer',
    company: 'Tech Company',
    period: '2020 - 2022',
    description: 'React ve TypeScript kullanarak kullanıcı arayüzleri geliştirdim. Responsive tasarım ve kullanıcı deneyimi odaklı çalışmalar yaptım.',
  },
]

const projects = [
  {
    id: '1',
    title: 'E-Ticaret Platformu',
    description: 'Next.js ve Supabase ile geliştirilmiş tam özellikli e-ticaret platformu. Stripe entegrasyonu, kullanıcı yönetimi ve admin paneli içerir.',
    technologies: ['Next.js', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS'],
    live_url: '#',
    github_url: '#',
  },
  {
    id: '2',
    title: 'Portfolio Website',
    description: 'Modern ve responsive portfolio websitesi. Projelerimi, becerilerimi ve deneyimlerimi sergiliyorum.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    live_url: '#',
    github_url: '#',
  },
  {
    id: '3',
    title: 'Task Management App',
    description: 'Takım çalışması için geliştirilmiş görev yönetim uygulaması. Real-time güncellemeler ve kullanıcı rolleri içerir.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    live_url: '#',
    github_url: '#',
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Hakkımda
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Merhaba! Ben bir full-stack developer'ım. Modern web teknolojileri 
          kullanarak kullanıcı dostu ve performanslı uygulamalar geliştiriyorum.
        </p>
      </div>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Becerilerim
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {skill.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {skill.level}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {skill.category}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Deneyimlerim
        </h2>
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 border-blue-600"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {exp.title}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {exp.period}
                </span>
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                {exp.company}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          Projelerim
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-4">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Canlı Demo →
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:underline"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">İletişim</h2>
        <p className="text-lg mb-6 text-blue-100">
          Projeleriniz için benimle iletişime geçebilirsiniz.
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>info@mydevstore.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+90 XXX XXX XX XX</span>
          </div>
          <div className="flex space-x-4 mt-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Twitter
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

