# Images

Drop photos into the folder for each section, then fill in the matching `src`
in `src/content/site.ts` (each empty `src` has its intended filename in a
comment next to it). Until a `src` is filled, the site shows a labelled
placeholder, so nothing breaks if a photo is missing.

Use `.jpg` for photos and `.png` for screenshots. Keep each file under ~500 KB
(export at ~80% quality). The site is a static export, so images are served
as-is and are not resized automatically. Photos are cropped to fit their tile
(centre crop), so keep the subject near the middle.

Every image needs alt text in `site.ts` describing what's in the photo.

## Checklist

### About
- [ ] `headshot/headshot.jpg`: portrait, 1200 × 1500 px (4:5). This one
      appears automatically, with no `site.ts` edit needed.

### PlannrAI (`plannrai/`), 4 portrait phone screenshots, ~1170 × 2532 px
- [ ] `plannrai/screen-1.png`
- [ ] `plannrai/screen-2.png`
- [ ] `plannrai/screen-3.png`
- [ ] `plannrai/screen-4.png`

Take them on an iPhone (any recent model's native screenshot is close to this
size). Order them in the story you want: e.g. onboarding → plan → detail → result.

### Skillmatics (`skillmatics/`), 5 photos for the photo-essay grid
- [ ] `skillmatics/photo-1.jpg`: **landscape**, the big lead image,
      ~2000 × 1250 px. *All You Can Mumbai stall.*
- [ ] `skillmatics/photo-2.jpg`: **portrait**, the tall tile, ~1200 × 1800 px.
      *In-store placement.*
- [ ] `skillmatics/photo-3.jpg`: **landscape**, ~1600 × 1200 px (4:3).
      *On the ground at the event.*
- [ ] `skillmatics/photo-4.jpg`: **landscape**, ~1600 × 1200 px (4:3).
      *Shelf and pricing setup.*
- [ ] `skillmatics/photo-5.jpg`: **wide landscape**, the closing strip,
      ~2000 × 900 px. *GTM presentation.*

### Celona (`celona/`), 3 landscape photos, ~1600 × 1000 px (16:10)
- [ ] `celona/photo-1.jpg`: the large lead image
- [ ] `celona/photo-2.jpg`
- [ ] `celona/photo-3.jpg`

### Later sections
- `gallery/`: personal photos for Off the Clock, 1600 px on the long edge
- `football/`: match or team photos, 1600 × 1200 px (4:3)

## PlannrAI video

1. Upload the walkthrough to YouTube or Vimeo. **Unlisted** is fine.
2. Copy the video id:
   - YouTube `https://www.youtube.com/watch?v=AbC123xYz` → `AbC123xYz`
   - Vimeo `https://vimeo.com/123456789` → `123456789`
3. In `site.ts`, under PlannrAI `media.video`, set `id` to that value and
   `provider` to `"youtube"` or `"vimeo"`.
4. Optional: add `poster: "/images/plannrai/poster.jpg"` (1920 × 1080 px) for
   a custom thumbnail. YouTube uses its own thumbnail otherwise; Vimeo shows a
   plain navy frame without one.

The video only loads when someone clicks play, so it doesn't slow the page.

## Resume

`/public/resume/Aarav_Aher_Resume.pdf`
