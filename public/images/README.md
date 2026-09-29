# Images

Drop photos into the folder for each section. File names are referenced in
`src/content/site.ts`, so add an entry there after adding a file.
Use `.jpg` for photos and `.png` for screenshots. Keep each file under ~500 KB
(export at ~80% quality). The site is a static export, so images are served
as-is and are not resized automatically.

| Folder         | What goes here                                  | Recommended size                         |
| -------------- | ----------------------------------------------- | ---------------------------------------- |
| `headshot/`    | Your portrait, saved as **`headshot.jpg`**      | 1200 × 1500 px (4:5, portrait)           |
| `plannrai/`    | App screenshots                                 | Phone: 1170 × 2532 px · Desktop: 2400 × 1500 px |
| `skillmatics/` | Store placements, the All You Can Mumbai stall  | 1600 × 1200 px (4:3)                     |
| `celona/`      | Presentation slides or team photos (optional)   | 1600 × 1000 px (16:10)                   |
| `gallery/`     | Personal photos for Off the Clock               | 1600 px on the long edge, any ratio      |
| `football/`    | Match or team photos                            | 1600 × 1200 px (4:3)                     |

The headshot appears automatically once `headshot/headshot.jpg` exists
(rebuild or restart the dev server). Until then, a monogram placeholder shows.

Every image needs alt text in `site.ts` that describes what's in the photo.

The resume goes in `/public/resume/Aarav_Aher_Resume.pdf`.
