import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="bg-cream">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-3xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-6xl font-playfair">
              Find Your Next Career Move with JobFinder
            </h1>
            <p className="mt-6 text-lg leading-8 text-warm-gray max-w-2xl mx-auto">
              JobFinder is your one-stop destination for discovering new job opportunities and gaining career insights. We connect talented individuals with exciting companies and provide valuable content through our blog to help you grow professionally.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/home"
                className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-ink shadow-sm hover:bg-accent-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent transition-colors"
              >
                Browse Posts
              </Link>
              <Link to="/about" className="text-sm font-semibold leading-6 text-ink hover:text-accent transition-colors">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-parchment py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-accent">Your Career Partner</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl font-playfair">
              Everything you need to advance your career
            </p>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              From job postings to career advice, we've got you covered. Explore the features that make JobFinder the best place to start your job search.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-ink">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <svg className="h-6 w-6 text-ink" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  Latest Job Opportunities
                </dt>
                <dd className="mt-2 text-base leading-7 text-warm-gray">
                  Browse thousands of job listings from top companies. Our powerful search and filtering tools make it easy to find roles that match your skills and aspirations.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-ink">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <svg className="h-6 w-6 text-ink" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.125C3 6.504 3.504 6 4.125 6H7.5" />
                    </svg>
                  </div>
                  Insightful Blog Posts
                </dt>
                <dd className="mt-2 text-base leading-7 text-warm-gray">
                  Stay ahead of the curve with our regularly updated blog. We cover topics like resume writing, interview tips, industry trends, and personal development to help you succeed.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-ink">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <svg className="h-6 w-6 text-ink" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  </div>
                  Community Discussions
                </dt>
                <dd className="mt-2 text-base leading-7 text-warm-gray">
                  Connect and chat with other professionals in your field. Share experiences, ask questions, and build your network with like-minded individuals.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-ink">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                    <svg className="h-6 w-6 text-ink" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  User Profiles
                </dt>
                <dd className="mt-2 text-base leading-7 text-warm-gray">
                  Create a professional profile to showcase your experience, follow other users, and keep track of your contributions to the community.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
