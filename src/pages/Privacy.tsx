function Privacy() {
  const linkClass = "text-tech-gold underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tech-gold";

  return (
    <article className="mx-auto w-full max-w-4xl px-6 py-12 font-inter leading-relaxed text-gray-200 sm:py-16">
      <header className="mb-10 space-y-4">
        <h1 className="font-outfit text-4xl font-bold text-tech-gold sm:text-5xl">Privacy Policy</h1>
        <p className="text-sm text-gray-400">Last updated: <time dateTime="2026-10-27">October 27, 2026</time></p>
        <p>
          Georgia Tech Esports Organization (&ldquo;GT Esports,&rdquo; &ldquo;we,&rdquo; or &ldquo;us&rdquo;)
          is a student organization at the Georgia Institute of Technology. This policy explains
          how we handle information through our website, website accounts, and newsletter and
          alumni contact lists.
        </p>
      </header>

      <div className="space-y-10 [&_h2]:mb-3 [&_h2]:font-outfit [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_p+p]:mt-4">
        <section aria-labelledby="information">
          <h2 id="information">Information we collect</h2>
          <ul className="list-disc space-y-3 pl-6">
            <li><strong>Account information.</strong> When you create an account, we collect your name and email address. Supabase handles email/password authentication. If you choose Discord sign-in, Discord shares the account information authorized during sign-in, which may include your account identifier, name, email address, and profile image.</li>
            <li><strong>Contact information.</strong> Newsletter signup asks for your first name, last name, and email address. Our newsletter and alumni records may also include organization, contact category, group membership, communication preferences, contact history, and notes relevant to our communications. Authorized organizers can add records or import existing contact lists.</li>
            <li><strong>Messages and published content.</strong> We receive information you send us, including requests about your account or personal information. The website also displays organization content such as leadership names, roles, biographies, and photos.</li>
            <li><strong>Usage and technical information.</strong> Our website and service providers may process page visits, referring websites, browser and device information, approximate location, IP addresses, and request or security logs to deliver, protect, and understand use of the website.</li>
          </ul>
        </section>

        <section aria-labelledby="uses">
          <h2 id="uses">How we use information</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Provide account sign-in and manage access to website features.</li>
            <li>Manage newsletter subscriptions, alumni contacts, and organization communications.</li>
            <li>Publish team and leadership information and other organization content.</li>
            <li>Respond to questions, support requests, and privacy requests.</li>
            <li>Maintain the website, understand traffic, fix problems, and prevent misuse.</li>
          </ul>
          <p>Creating a website account does not by itself subscribe you to the newsletter.</p>
        </section>

        <section aria-labelledby="access">
          <h2 id="access">Who can access information</h2>
          <p>
            Authorized organizers can access contact records to manage communications. Account,
            database, storage, hosting, and analytics providers process information to support
            the website. We use Supabase for accounts, database services, and uploaded images,
            and Vercel Web Analytics for website traffic statistics.
          </p>
          <p>
            Information published on team or leadership pages is visible to anyone and may be
            copied or indexed by search engines. Private contact records are not published as
            part of those pages. Authorized organizers can export contact records for organization use.
          </p>
          <p>
            We may also disclose information when required by law or when reasonably necessary
            to address fraud, abuse, security incidents, or threats to people or the website.
          </p>
        </section>

        <section aria-labelledby="storage">
          <h2 id="storage">Browser storage and analytics</h2>
          <p>
            We use browser local storage to keep you signed in through Supabase. You can sign
            out or clear your browser storage to remove locally stored sign-in information.
            This does not delete your account or records held by us.
          </p>
          <p>
            Vercel Web Analytics provides traffic statistics, such as pages visited, referring
            websites, device and browser type, and approximate location. Vercel describes this
            analytics service as using aggregated statistics without third-party cookies.
            This is separate from storage used for sign-in and from services such as embedded videos.
            Learn more in <a className={linkClass} href="https://vercel.com/docs/analytics/privacy-policy">Vercel&apos;s analytics privacy documentation</a>.
          </p>
        </section>

        <section aria-labelledby="external-services">
          <h2 id="external-services">Discord, videos, and external websites</h2>
          <p>
            If you use Discord sign-in, Discord also handles information under its own privacy
            policy. Opening a game highlight may load a YouTube player or media from another
            provider. That provider receives technical information, such as your IP address and
            browser information, when the media loads, and may use cookies or similar technologies.
          </p>
          <p>
            Links to community platforms and other websites take you to services operated by
            others. Their privacy practices apply when you use them. You can read the
            <a className={linkClass} href="https://discord.com/privacy"> Discord Privacy Policy</a> and
            <a className={linkClass} href="https://policies.google.com/privacy"> Google Privacy Policy</a> for more information.
          </p>
        </section>

        <section aria-labelledby="retention">
          <h2 id="retention">Retention and security</h2>
          <p>
            We keep information for as long as needed for the purposes described here, including
            account administration, organization communications, security, and applicable legal
            obligations. Retention depends on the type of record and why it is held; there is
            no single retention period for every record. Contact us to ask about a particular
            record or request deletion.
          </p>
          <p>
            We use access controls and other reasonable safeguards to protect information.
            No website, storage system, or transmission method can guarantee complete security.
          </p>
        </section>

        <section aria-labelledby="choices">
          <h2 id="choices">Your choices and requests</h2>
          <p>
            You can browse public pages without creating an account. To ask to access, correct,
            or delete your information, close your account, stop newsletter or alumni communications,
            or remove a published name or photo, email
            <a className={linkClass} href="mailto:georgiatechesports@gmail.com"> georgiatechesports@gmail.com</a>.
            Please identify the account or record involved, but do not send your password.
          </p>
          <p>
            We may need to verify your identity before acting on a request. Some records may
            need to be retained for legal or security reasons. Removing content from our website
            does not necessarily remove copies already held by search engines or other people.
            Additional privacy rights may apply depending on where you live.
          </p>
        </section>

        <section aria-labelledby="changes">
          <h2 id="changes">Changes to this policy</h2>
          <p>
            We will post updates on this page and revise the date above. If applicable law
            requires additional notice or consent for a change, we will provide it.
          </p>
        </section>

        <section aria-labelledby="contact">
          <h2 id="contact">Contact us</h2>
          <p>
            For questions about this policy or how GT Esports handles your information, contact
            Georgia Tech Esports Organization at
            <a className={linkClass} href="mailto:georgiatechesports@gmail.com"> georgiatechesports@gmail.com</a>.
          </p>
        </section>
      </div>
    </article>
  );
}

export default Privacy;
