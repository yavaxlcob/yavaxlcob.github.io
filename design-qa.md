# Design QA — fourth screen live waterline correction

- Source visual truth: `C:\Users\User\AppData\Local\Temp\codex-clipboard-8b1b54dd-a6aa-4f5b-bbf8-025b473233e2.png`
- Implementation: `http://127.0.0.1:4173/?v=wave-edge-fix#colors`
- Browser evidence: Codex in-app browser capture at 1265 × 708 CSS px
- Source pixels: 1536 × 484 (focused crop supplied by the user)
- State: desktop, white hull selected, animation enabled

## Full-view comparison evidence

The boat no longer reads as a static cutout placed on top of the water. A narrow foreground-water layer now crosses the lower hull from the stern to the area beneath the windshield, using the same photographic reservoir texture as the full-screen water. The established scale, vertical placement, heading, palette, and lower-screen controls remain unchanged.

## Focused region comparison evidence

Focused inspection of the hull from the stern through the lower windshield area shows an animated, tapered waterline with two restrained moving highlights. The detached forward highlight has been removed, the forward endpoint is lowered into the surrounding water, and the stern entry is flatter and lower. The mid-hull contour remains unchanged in character. All eight colour assets load at 1280 × 460.

## Fidelity surfaces

- Fonts and typography: unchanged from the approved section.
- Spacing and layout rhythm: unchanged; the boat and colour controls retain their desktop positions.
- Colors and tokens: the foreground layer uses the existing reservoir photograph, darkened to match the section's water treatment.
- Image quality and asset fidelity: the lower hull is integrated with a real photographic water texture rather than a broad repeated strip; the wave tapers at both ends and carries small moving highlights.
- Copy and content: unchanged.

## Comparison history

- P1 before: a broad textured strip looked like a separate blue object attached beneath the hull.
- Fix: removed the overlay element and rebuilt each colour render with a clean rear-to-windshield alpha contour.
- P2 before: the clean alpha edge still read as a static cutout against the water.
- Fix: added a dedicated foreground-water canvas with an independently moving, narrow contact wave and more visible motion in the section's background water.
- P3 before: the forward highlight occasionally detached into a thin “snake”, while the stern entry formed an artificial rounded hump.
- Fix: removed the forward highlight segment, lowered both endpoints, and applied stronger end tapering to wave displacement and depth.
- Post-fix evidence: three animation-phase captures show a continuous forward blend and a flatter stern entry; the live canvas and boat rocking remain active.

## Verification

- All eight colour controls load complete 1280 × 460 boat images.
- Foreground-water canvas renders at the live section size and remains independent from the colour selector.
- Three animation phases checked: no detached forward stripe and no rounded stern hump.
- No browser console warnings or errors.
- Local reference, link, metadata, reduced-motion, and layer checks pass.

final result: passed

## Latest local iteration — marine favicon set

- Implementation: `http://127.0.0.1:4173/?v=favicon-marine#top`
- The new mark uses a large six-spoke helm above two broad water waves in the existing deep-marine, steel-blue palette.
- Runtime SVG: `favicon.svg`; editable source: `assets/favicon-source.svg`.
- Generated PNG variants: 512, 180, 64, 32 and 16 px. The 16 px render was visually inspected for silhouette clarity.
- `index.html` now declares SVG, 32 px, 16 px, Apple Touch Icon and `site.webmanifest`.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — video, FAQ order and final screen

- Implementation: `http://127.0.0.1:4173/?v=video-contain-faq-order#gallery`
- The primary VK iframe is a sharp `contain` layer at an exact 16:9 ratio. A blurred, darkened copy of the same frame fills the remaining stage area without cropping the primary video.
- «Визуальный дневник» was removed completely from the video scene.
- FAQ now sits immediately after video and before «Выберите свой стиль».
- «До встречи на воде» and the footer now share one full-height final water screen; the title is centered in the available scene above the integrated footer.
- Desktop and mobile checks confirm the primary frame remains fully visible, section order is correct, and no horizontal overflow or console errors appear.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — hero marine CTA

- Implementation: `http://127.0.0.1:4173/?v=hero-cta#top`
- The hero CTA now reads «ПРИСОЕДИНИТЬСЯ» and preserves its Telegram destination.
- It uses an asymmetric marine-glass control: steel-blue liquid layers, a restrained moving shimmer, beveled corners, a directional mark, and small hover/active/focus responses.
- The redundant hero lead was removed; CTA spacing now follows the tagline directly without a visual gap.
- Mobile/tablet checks show no horizontal overflow; the shared reduced-motion rule suppresses animation.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — VK Video visual diary

- Implementation: `http://127.0.0.1:4173/?v=vk-video-gallery#gallery`
- The prior six-image gallery, carousel controls, lightbox, and their script handlers were removed.
- The «Визуальный дневник» section is now a full-viewport VK Video embed with responsive 16:9 cover cropping and no surrounding container, card, frame, or side field.
- The only overlay is the section title, placed over a subtle readability gradient. The embed requests muted autoplay; no loop workaround was added.
- Mobile and desktop checks confirm full-screen dimensions and clean browser console.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — sixth copy and seventh image

- Implementation: `http://127.0.0.1:4173/?v=story-seven-visual#profile`
- Slide 6 now uses marine wording: «Комфорт в непогоду» and «идти по воде».
- Slide 7 uses a distinct VBOATS water photo, saved locally as `assets/yava-xl-cob04.jpg`; its scene label is «Свобода на воде».
- In-app browser checks confirm both steps are readable and navigation reaches `07 / 07` with the new seventh image loaded.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — persistent return control

- Implementation: `http://127.0.0.1:4173/?v=floating-back-top#top`
- The return control is now a single global fixed button, hidden while the first hero screen is active and available from the second section onward.
- The button sits 18px from the right and bottom viewport edges, independent of the closing water section.
- Browser capture confirms it remains available while navigating below the hero and does not alter footer or propeller layout.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — closing-screen spacing and footer lockup

- Source visual truth: `C:\Users\User\AppData\Local\Temp\codex-clipboard-b1504656-ebd0-4629-b4b3-164c1d883c8b.png`
- Implementation: `http://127.0.0.1:4173/?v=closing-layout#faq`
- The white FAQ zone has more breathing room below its chapter index, while the water invitation begins lower and occupies less vertical space.
- The headline and invitation copy remain centered; the supporting line stays on one desktop line.
- The footer lockup now reads «VBOATS  YAVA XL COB  Клуб владельцев» on one line with the owner label in blue.
- The enlarged animated propeller is contained in the lower-right footer area without increasing footer height or colliding with the navigation row.
- Browser capture confirms the boat remains visible and the bottom-of-page layout fits cleanly.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — closing water cue and footer propeller alignment

- Source visual truth: `C:\Users\User\AppData\Local\Temp\codex-clipboard-65b7e70e-1ea9-4950-a797-1a6bd28b9c92.png`
- Implementation: `http://127.0.0.1:4173/?v=closing-final#faq`
- The invitation headline is lowered within the water field, preserving the centered two-line composition and the single-line supporting copy.
- The footer «Наверх ↑» text link was replaced by a separate animated circular up-arrow in the lower-right of the water area.
- The animated propeller is larger, aligned to the lower-right footer edge, and the footer divider now stops before it; footer height remains compact.
- Browser capture confirms the boat, up-arrow, footer navigation, and propeller remain visible without overlap.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — closing-screen typography and propeller scale

- Source visual truth: `C:\Users\User\AppData\Local\Temp\codex-clipboard-70e3b5c3-4d14-41ae-a68c-7b7eeb992ef5.png`
- Implementation: `http://127.0.0.1:4173/?v=closing-type#faq`
- The closing headline is now two centered lines in the water area, scaled to the available desktop width; the supporting invitation copy is larger, centered, and has a restrained water-like breathing animation.
- The animated propeller is larger but absolutely contained in the existing lower-right footer zone, so the footer height and divider remain unchanged.
- The FAQ schema text now matches the visible fourth question.
- Browser capture confirms the boat remains visible, the closing headline fits, the footer stays compact, and the full propeller remains inside the viewport at page bottom.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — sixth screen questions and closing invitation

- Implementation: `http://127.0.0.1:4173/?v=faq-iteration#faq`
- The «Коротко о главном» heading now follows the larger shared desktop chapter scale.
- The fourth FAQ prompt now reads «Как вступить в клуб YAVA XL COB?» and opens correctly with the Telegram link.
- The closing copy is now a single prominent water-screen headline: «До встречи на воде. Вливайтесь в круг своих.»
- The curved propeller lettering and the standalone CTA propeller were removed from the invitation panel. The real animated propeller link now sits in the lower-right footer metadata area; the footer navigation row and its divider remain intact.
- In-app browser capture confirms the FAQ list, water invitation, boat, footer navigation, and propeller remain visible and legible together.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — fifth screen spacing

- Implementation: `http://127.0.0.1:4173/?v=club-spacing#club`
- State: desktop, animation enabled
- The «Присоединиться к клубу» link now has a clear breathing gap below the «Маршруты» plate.
- The «Маршруты» stream now terminates at the plate's upper-left corner, keeping the animated line out of the label area.
- In-app browser capture confirms the route plate, connector, and CTA remain distinct and legible.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — footer menu and divider clearance

- Source visual truth: `C:\Users\User\AppData\Local\Temp\codex-clipboard-18d6cf5e-578d-4681-af36-efdbeed165b2.png`
- Implementation: `http://127.0.0.1:4173/?v=menu-final-2#faq`
- The footer menu is shifted left so `Параметры / Галерея / FAQ` ends immediately before the propeller zone.
- The divider is extended toward the propeller and stops with a small visual gap before it.
- Browser capture confirms the menu, divider, propeller, and up-arrow remain distinct and legible.
- GitHub remains untouched; this iteration is local-only.

final result: passed

## Latest local iteration — seven YAVA XL COB scenarios

- Implementation: `http://127.0.0.1:4173/?v=story-seven#profile`
- The «Одна лодка. Несколько темпов жизни.» slider now has seven coherent stories, with every headline, description, accent line and image caption rewritten around a real use case.
- Desktop and mobile checks confirm seven matched frames, seven steps and seven progress marks; the final story is reachable with the existing controls.
- The fifth winter frame has no «Зимняя визуализация» overlay or label.
- The seventh story uses the separate local photo `assets/photo-14.webp` of YAVA XL COB in motion.
- GitHub remains untouched; this iteration is local-only.

final result: passed
