# Images

Everything in this folder is **generated**. Don't edit or add files here by hand.

## How it works

1. Originals live in `/assets-src/<section>/` (outside `public/`, so full-size
   files never ship). Use lowercase kebab-case names, e.g.
   `assets-src/soccer/solo-in-game.jpg`.
2. `npm run images:build` runs `scripts/optimize-images.mjs` (sharp), which for
   every original:
   - applies the EXIF rotation, so nothing is sideways
   - strips all metadata, including GPS
   - writes WebP at quality 80 in two sizes:
     `public/images/<section>/<name>-1600w.webp` and `<name>-800w.webp`
   - records the real dimensions in `src/content/image-manifest.json`
3. `src/content/site.ts` refers to images by their base path, without the size
   suffix: `src: "/images/soccer/solo-in-game"`. Components serve the right
   size with `srcSet`.

## Folders

| Section        | Used for                                                        |
| -------------- | --------------------------------------------------------------- |
| `about/`       | Headshot in About                                                |
| `plannrai/`    | Four phone screenshots (case study)                              |
| `skillmatics/` | Furbitz GTM strategy page, content deck (case study)             |
| `celona/`      | Presenting photo, market research deck (case study)              |
| `projects/`    | SiteSmith and BasisPoint previews (Index); SiteSmith founders page (spare) |
| `soccer/`      | Football chapter: solo photo, medals, four match-result graphics (two in use) |
| `photography/` | Photography chapter                                               |
| `asha/`        | Asha Foundation chapter                                           |

## Adding or swapping an image

1. Put the original in `assets-src/<section>/new-name.jpg` (JPG, PNG or WebP;
   not HEIC: export as JPG first).
2. Run `npm run images:build`.
3. In `site.ts`, point an entry at `"/images/<section>/new-name"` and set:
   - `kind`: `"photo"` (cropped to fill), `"document"` (slides, docs and page
     screenshots: never cropped, shown on a mat) or `"screenshot"` (phone screens)
   - `alt`: describe what's in the image
   - `caption`: optional for secondary images; the first image in a set always shows one
   - `focus`: for photos, the point to keep in frame, e.g. `"60% 40%"`
   - `trimTop`: for phone screenshots with a status bar, e.g. `0.055`
4. The first image in a list is the primary. A set shows up to 4.

To trim empty page margins from a screenshot before it's built, add an entry to
`EXTRACT` in `scripts/optimize-images.mjs`.

## PlannrAI video

Upload to YouTube or Vimeo (unlisted is fine), then paste only the id into
`caseStudies[0].media.video.id` in `site.ts` and set `provider`. The video
block is hidden while the id is empty and appears automatically once it's set.

## Resume

`/public/resume/Aarav_Aher_Resume.pdf`
