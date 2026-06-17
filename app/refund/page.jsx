export const metadata = {
  title: 'Refund Policy — aigeek.ink',
  description: 'Refund Policy for aigeek.ink',
}

export default function Refund() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '680px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <a href="/" style={{ fontSize: '0.9rem', color: '#555', textDecoration: 'none' }}>← aigeek.ink</a>
      </nav>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem', color: '#111' }}>Refund Policy</h1>
      <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: '2rem' }}>Last updated: June 2026</p>

      <section style={{ lineHeight: '1.8', color: '#333' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '1.5rem 0 0.5rem', color: '#111' }}>Our Commitment</h2>
        <p>We want you to be satisfied with aigeek.ink. Because we deal in digital goods and AI-generated content, our refund policy is straightforward and fair.</p>

        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '1.5rem 0 0.5rem', color: '#111' }}>When We Issue Full Refunds</h2>
        <p>You are entitled to a full refund in any of the following situations:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>The AI skin render failed twice in a row (technical failure on our end).</li>
          <li>You were charged but did not receive your generated design, stencil, or PDF.</li>
          <li>A technical error prevented you from accessing a feature you paid for.</li>
          <li>You request a refund within 24 hours of purchase and have not downloaded your outputs.</li>
        </ul>

        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '1.5rem 0 0.5rem', color: '#111' }}>When We Do Not Issue Refunds</h2>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>You generated a design but did not like the result — AI output is subjective and we encourage using the free tier first.</li>
          <li>You changed your mind after successfully receiving your outputs.</li>
          <li>More than 48 hours have passed since purchase.</li>
        </ul>

        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '1.5rem 0 0.5rem', color: '#111' }}>AI Render Failures</h2>
        <p>Our AI skin render (powered by Fal.ai) has an approximate 10% failure rate. We automatically retry once. If the second attempt also fails, we will issue a full credit refund to your account automatically. No need to contact us.</p>

        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '1.5rem 0 0.5rem', color: '#111' }}>How to Request a Refund</h2>
        <p>Email <a href="mailto:aigeek.ink@gmail.com" style={{ color: '#111' }}>aigeek.ink@gmail.com</a> with your order details. We respond within 24 hours on business days. Approved refunds are processed within 5–10 business days depending on your payment provider.</p>

        <h2 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '1.5rem 0 0.5rem', color: '#111' }}>Contact</h2>
        <p>Refund questions: <a href="mailto:aigeek.ink@gmail.com" style={{ color: '#111' }}>aigeek.ink@gmail.com</a></p>
      </section>
    </main>
  )
}
