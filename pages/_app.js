import '../styles/globals.css'
import Link from 'next/Link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6">
          <p className="text-4xl font-bold">My MarketPlace</p>
          <div className="flex mt-4">
            <Link href="/">
              <a className="mr-6 text-cyan-500">HOME</a>
            </Link>

            <Link href="/create-item">
              <a className="mr-6 text-cyan-500">SELL YOUR ASSETS</a>
            </Link>

            <Link href="/myitems">
              <a className='mr-6 text-cyan-500'>MY DIGITAL ASSETS</a>
            </Link>

            <Link href="/dashboard">
              <a className='mr-6 text-cyan-500'>CREATOR DASHBOARD</a>
            </Link>
            
          </div>

      </nav>
      <Component {...pageProps} />
      </div>
  )
}

export default MyApp;
