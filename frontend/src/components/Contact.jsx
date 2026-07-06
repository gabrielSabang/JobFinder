import React from 'react'

const Contact = () => {
  return (
    <div className="relative isolate bg-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <h2 className="text-3xl font-bold tracking-tight text-ink font-playfair">Get in touch</h2>
            <p className="mt-6 text-lg leading-8 text-warm-gray">
              We'd love to hear from you! Whether you have a question about our services, feedback on our platform, or anything else, our team is ready to answer all your questions.
            </p>
            <dl className="mt-10 space-y-4 text-base leading-7 text-warm-gray">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Telephone</span>
                </dt>
                <dd>
                  <a className="hover:text-ink" href="tel:+1 (555) 234-5678">
                    +1 (555) 234-5678
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                </dt>
                <dd>
                  <a className="hover:text-ink" href="mailto:hello@example.com">
                    hello@jobfinder.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <form action="#" method="POST" className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48">
          {/* Form fields can be added here later */}
          <p className="text-center text-warm-gray">
            Contact form coming soon.
          </p>
        </form>
      </div>
    </div>
  )
}

export default Contact
