export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <h2
        style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: 600,
          color: '#1e293b',
        }}
      >
        力通电子管理系统
      </h2>
      <p
        style={{
          margin: 0,
          fontSize: '16px',
          color: '#64748b',
        }}
      >
        正在加载后台管理系统...
      </p>
    </div>
  )
}