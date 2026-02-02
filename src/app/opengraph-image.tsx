import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const alt = 'Lucas Carvalho - Desenvolvedor Full-Stack'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)',
          position: 'relative',
        }}
      >
        {/* Grid Pattern Overlay */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: 82,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #ec4899 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
              marginBottom: 20,
              display: 'flex',
            }}
          >
            Lucas Carvalho
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 600,
              color: '#cbd5e1',
              marginBottom: 40,
              display: 'flex',
            }}
          >
            Desenvolvedor Full-Stack
          </div>

          {/* Tech Stack Pills */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              justifyContent: 'center',
              maxWidth: 900,
            }}
          >
            {['React', 'TypeScript', 'Next.js', 'Node.js', 'Java', 'Spring Boot', 'PostgreSQL'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: 12,
                  fontSize: 22,
                  fontWeight: 500,
                  color: '#e9d5ff',
                  display: 'flex',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
