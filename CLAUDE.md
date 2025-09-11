# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Litong Electronics website - A professional electronics components distributor website built with Next.js 14, TypeScript, Tailwind CSS, and Sanity CMS. The site serves as an e-commerce platform for electronic components with multi-language support (Chinese primary, with 10 supported locales).

## Essential Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:fresh        # Clear cache and start fresh development server
npm run clear-cache      # Clear Next.js and webpack caches (use when build issues occur)

# Building and Production
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run lint            # ESLint check
npm run lint:fix        # Auto-fix ESLint issues
npm run typecheck       # TypeScript type checking
npm run format          # Prettier code formatting

# Sanity CMS
npm run sanity:dev      # Start Sanity Studio (available at /admin)
npm run sanity:build    # Build Sanity Studio
npm run sanity:deploy   # Deploy Sanity Studio
```

## Architecture & Key Concepts

### App Router Structure
- **Multi-locale routing**: All pages under `src/app/[locale]/` with locale-first routing
- **Supported locales**: zh-CN (default), zh-TW, en, ja, ko, de, fr, es, ru, ar
- **Brand pages**: Dynamic routing with `[slug]` parameter, supports both English and Chinese brand names
- **URL encoding**: Chinese brand slugs are URL-encoded and must be decoded with `decodeURIComponent()`

### Sanity CMS Integration
- **Project ID**: `oquvb2bs` (hardcoded in client configuration)
- **Dataset**: `production`
- **Studio access**: `/admin` route for content management
- **Key content types**: brandBasic, products, categories, solutions, articles
- **Image handling**: Uses `@sanity/image-url` with `urlFor()` helper

### Brand System Architecture
- **Data fetching**: `getBrandData()` queries Sanity for brand information
- **Data enhancement**: `enhanceBrandData()` provides fallback values for incomplete data
- **Chinese support**: Brand names and slugs can be in Chinese characters
- **URL structure**: `/[locale]/brands/[slug]` where slug can be Chinese or English

### Critical Files and Functions
- `src/lib/sanity/client.ts`: Sanity client configuration and GROQ query fragments
- `src/app/[locale]/brands/[slug]/page.tsx`: Main brand page with URL decoding logic
- `src/middleware.ts`: Next-intl middleware for locale routing
- `src/i18n.ts`: Internationalization configuration
- `scripts/clear-cache.js`: Cache clearing utility for build issues

### UI Component Architecture
- **Base components**: Located in `src/components/ui/`
- **Styling**: Tailwind CSS with custom utility classes
- **Icons**: Lucide React icon library
- **Layout**: Responsive design with mobile-first approach

## Development Workflow

### Working with Brand Pages
1. Brand data is fetched from Sanity CMS using GROQ queries
2. Missing data fields are enhanced with intelligent defaults
3. Chinese brand names require URL decoding: `decodeURIComponent(params.slug)`
4. All brand pages support navigation to products, solutions, and support sections

### Cache Management
- Next.js cache can cause inconsistent behavior during development
- Use `npm run clear-cache` when encountering build or routing issues
- The clear-cache script removes `.next` and `node_modules/.cache` directories

### Sanity Content Management
- Access Sanity Studio at `/admin` or via `npm run sanity:dev`
- Brand data is stored in `brandBasic` document type
- Required fields: name, slug, isActive
- Optional fields: description, website, country, headquarters, established, logo, isFeatured

### Multi-language Considerations
- All routes require locale prefix (enforced by middleware)
- Default locale is `zh-CN` (Simplified Chinese)
- Locale detection is enabled for automatic user preference detection
- Content should be properly localized for the target audience

## Common Issues and Solutions

### Brand Page 404 Errors
- Ensure brand exists in Sanity with `isActive: true`
- Check if slug matches exactly (case-sensitive)
- For Chinese brands, verify URL encoding/decoding is working
- Clear cache if page was recently added to Sanity

### Build/Compilation Issues
- Run `npm run clear-cache` to clear Next.js cache
- Check TypeScript errors with `npm run typecheck`
- Verify all imports are correctly resolved
- Ensure Sanity client configuration is valid

### Sanity Connection Issues
- Verify project ID (`oquvb2bs`) and dataset (`production`) in client config
- Check if content is published (not in draft state)
- Ensure GROQ queries match the actual schema structure
- Use `useCdn: false` for latest data during development

## Additional Documentation

The following project documents are included as references for Claude Code:
./prd.md
./产品开发计划.md
./TODO.md
./DEV_GUIDE.md
./docs

