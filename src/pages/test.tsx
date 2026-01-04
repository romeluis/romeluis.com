import '../global.css';

function TestPage() {
  return (
    <div style={{ padding: 'var(--spacing-2xl)' }}>
      <h1>Design System Test Page</h1>
      <p className="text-note">This page verifies all design system components are working correctly.</p>

      {/* Typography Test */}
      <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
        <h2>Typography</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div>
            <small className="text-note">Hero (55pt, Bold)</small>
            <h1 style={{ marginBottom: 0 }}>The quick brown fox</h1>
          </div>
          <div>
            <small className="text-note">Title (28pt, Regular)</small>
            <h2 style={{ marginBottom: 0 }}>The quick brown fox jumps</h2>
          </div>
          <div>
            <small className="text-note">Body (18pt, Regular)</small>
            <p style={{ marginBottom: 0 }}>The quick brown fox jumps over the lazy dog</p>
          </div>
          <div>
            <small className="text-note">Note (12pt, Regular)</small>
            <small>The quick brown fox jumps over the lazy dog</small>
          </div>
          <div>
            <small className="text-note">Link (underlined)</small>
            <p style={{ marginBottom: 0 }}><a href="#">This is a test link</a></p>
          </div>
        </div>
      </section>

      {/* UI Colors Test */}
      <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
        <h2>UI Colors</h2>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <div className="container-rounded" style={{ backgroundColor: 'var(--color-ui-white)', border: 'var(--border-width) solid var(--color-ui-black)', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <strong>UI White</strong>
              <br />
              <small className="text-note">#ffffff</small>
            </div>
          </div>
          <div className="container-rounded" style={{ backgroundColor: 'var(--color-ui-light-1)', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <strong>UI Light 1</strong>
              <br />
              <small className="text-note">#e2e2e2</small>
            </div>
          </div>
          <div className="container-rounded" style={{ backgroundColor: 'var(--color-ui-light-2)', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <strong>UI Light 2</strong>
              <br />
              <small className="text-note">#afafaf</small>
            </div>
          </div>
          <div className="container-rounded" style={{ backgroundColor: 'var(--color-ui-black)', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', color: 'var(--color-ui-white)' }}>
              <strong>UI Black</strong>
              <br />
              <small className="text-note" style={{ color: 'var(--color-ui-white)' }}>#120e14</small>
            </div>
          </div>
        </div>
      </section>

      {/* Accent Colors Test */}
      <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
        <h2>Accent Colors</h2>
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <div className="container-rounded" style={{ backgroundColor: 'var(--color-accent-green)', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <strong>Green</strong>
              <br />
              <small className="text-note">#91bf4b</small>
            </div>
          </div>
          <div className="container-rounded" style={{ backgroundColor: 'var(--color-accent-yellow)', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <strong>Yellow</strong>
              <br />
              <small className="text-note">#ffd05d</small>
            </div>
          </div>
          <div className="container-rounded" style={{ backgroundColor: 'var(--color-accent-orange)', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <strong>Orange</strong>
              <br />
              <small className="text-note">#f26a2d</small>
            </div>
          </div>
          <div className="container-rounded" style={{ backgroundColor: 'var(--color-accent-pink)', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <strong>Pink</strong>
              <br />
              <small className="text-note">#f96ba4</small>
            </div>
          </div>
          <div className="container-rounded" style={{ backgroundColor: 'var(--color-accent-blue)', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <strong>Blue</strong>
              <br />
              <small className="text-note">#02a6ff</small>
            </div>
          </div>
        </div>
      </section>

      {/* Container Test */}
      <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
        <h2>Containers</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          <div>
            <small className="text-note">Pill Container (9999px rounded)</small>
            <div style={{ marginTop: 'var(--spacing-sm)' }}>
              <span className="container-pill">Pill Container</span>
            </div>
          </div>
          <div>
            <small className="text-note">Rounded Container (40px radius)</small>
            <div className="container-rounded" style={{ marginTop: 'var(--spacing-sm)', maxWidth: '400px' }}>
              <p style={{ margin: 0 }}>This is a rounded container with 40px border-radius and 2pt border.</p>
            </div>
          </div>
          <div>
            <small className="text-note">Card Container (with extra padding)</small>
            <div className="container-card" style={{ marginTop: 'var(--spacing-sm)', maxWidth: '400px' }}>
              <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Card Title</h2>
              <p style={{ margin: 0 }}>This is a card container with extra padding for content.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Spacing Test */}
      <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
        <h2>Spacing Scale</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <small className="text-note" style={{ width: '60px' }}>xs (4px):</small>
            <div style={{ width: 'var(--spacing-xs)', height: '20px', backgroundColor: 'var(--color-accent-blue)' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <small className="text-note" style={{ width: '60px' }}>sm (8px):</small>
            <div style={{ width: 'var(--spacing-sm)', height: '20px', backgroundColor: 'var(--color-accent-blue)' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <small className="text-note" style={{ width: '60px' }}>md (16px):</small>
            <div style={{ width: 'var(--spacing-md)', height: '20px', backgroundColor: 'var(--color-accent-blue)' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <small className="text-note" style={{ width: '60px' }}>lg (24px):</small>
            <div style={{ width: 'var(--spacing-lg)', height: '20px', backgroundColor: 'var(--color-accent-blue)' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <small className="text-note" style={{ width: '60px' }}>xl (32px):</small>
            <div style={{ width: 'var(--spacing-xl)', height: '20px', backgroundColor: 'var(--color-accent-blue)' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <small className="text-note" style={{ width: '60px' }}>2xl (48px):</small>
            <div style={{ width: 'var(--spacing-2xl)', height: '20px', backgroundColor: 'var(--color-accent-blue)' }}></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <small className="text-note" style={{ width: '60px' }}>3xl (64px):</small>
            <div style={{ width: 'var(--spacing-3xl)', height: '20px', backgroundColor: 'var(--color-accent-blue)' }}></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TestPage;
