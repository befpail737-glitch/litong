import { client } from '../src/lib/sanity/client';

async function runQuery() {
  const args = process.argv.slice(2);
  const docType = args[0] || 'article';
  const filter = args[1] || '';

  try {
    console.log(`🔍 Querying ${docType}${filter ? ` with filter: ${filter}` : ''}...`);

    let query = '';

    if (docType === 'articleCategory') {
      query = `*[_type == "articleCategory"] {
        _id,
        name,
        "slug": slug.current,
        isVisible
      }`;
    } else if (docType === 'article' && filter === 'support') {
      query = `*[_type == "article" && articleType == "support"] {
        _id,
        title,
        "slug": slug.current,
        articleType,
        isPublished,
        "category": category->name,
        "brands": relatedBrands[]->name
      } | order(_createdAt desc)`;
    } else if (docType === 'article' && filter === 'images') {
      query = `*[_type == "article" && defined(image)] {
        _id,
        title,
        "hasImage": defined(image),
        "imageUrl": image.asset->url,
        "contentImages": length(content[_type == "image"])
      } | order(_createdAt desc)[0...10]`;
    } else if (docType === 'article') {
      query = `*[_type == "article"] {
        _id,
        title,
        "slug": slug.current,
        articleType,
        isPublished,
        "hasImage": defined(image),
        "category": category->name
      } | order(_createdAt desc)[0...10]`;
    } else {
      query = `*[_type == "${docType}"][0...10]`;
    }

    const result = await client.fetch(query);

    if (!result || result.length === 0) {
      console.log(`❌ No ${docType} found`);
      return;
    }

    console.log(`✅ Found ${result.length} ${docType}(s):`);
    result.forEach((item: any, index: number) => {
      console.log(`${index + 1}. ${JSON.stringify(item, null, 2)}`);
    });

  } catch (error) {
    console.error('❌ Query failed:', error);
    process.exit(1);
  }
}

runQuery();