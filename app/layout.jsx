import './globals.css'

export const metadata = {
  title: 'aigeek.ink — AI Tattoo Planning Tool',
  description: 'Generate your tattoo design, see it on your skin, download a stencil to take to your artist. No subscription. $1.99, once, done.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-KE8GMC3JX0"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-KE8GMC3JX0');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
