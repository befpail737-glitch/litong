/**
 * Studio page temporarily disabled for static export
 */

export async function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPageDisabled() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">Sanity Studio</h1>
      <p className="text-gray-600 mb-4">
        Sanity Studio is temporarily disabled for static export compatibility.
      </p>
      <p className="text-sm text-gray-500">
        To access the studio, please visit{' '}
        <a
          href="https://litong.sanity.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          litong.sanity.studio
        </a>
      </p>
    </div>
  )
}