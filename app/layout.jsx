import './globals.css'

export const metadata = {
  title: 'aigeek.ink — AI Tattoo Planning Tool',
  description: 'Generate your tattoo design, see it on your skin, download a stencil to take to your artist. No subscription. $1.99, once, done.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
