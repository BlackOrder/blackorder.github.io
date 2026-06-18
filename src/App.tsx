import { Head } from 'vite-react-ssg/single-page';
import { SITE, personJsonLd } from './lib/seo';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Specialties from './components/Specialties';
import Work from './components/Work';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Head>
        <html lang="en-us" />
        <title>{SITE.titleFull}</title>
        <meta name="description" content={SITE.description} />
        <meta name="color-scheme" content="dark" />
        <link rel="canonical" href={`${SITE.url}/`} />
        <meta property="og:title" content={SITE.titleFull} />
        <meta property="og:description" content={SITE.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE.url}/`} />
        <meta property="og:image" content={SITE.ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE.titleFull} />
        <meta name="twitter:description" content={SITE.description} />
        <meta name="twitter:image" content={SITE.ogImage} />
        <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      </Head>

      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Nav />
      <main id="main-content">
        <Hero />
        <Specialties />
        <Work />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
