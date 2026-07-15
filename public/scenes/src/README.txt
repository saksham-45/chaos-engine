DROP YOUR 5 IMAGES HERE
=======================

These are traced into high-quality color SVGs (same technique as the pupsik
cat) and revealed under a cursor torch in the site's dossier slots.

Save each image in THIS folder with the exact name below (any of
.jpg / .jpeg / .png / .webp — extension doesn't matter, the name before the
dot is what maps it into the site):

  charminar    -> the Charminar bazaar street scene
  taj          -> the Taj Mahal through the arch
  starfield    -> the swirling starry-night sky
  procession   -> the royal lake-procession miniature
  oldcity      -> the old-city street with the wires

e.g.  charminar.jpg,  taj.png,  starfield.jpg,  procession.jpg,  oldcity.jpg

Then, from chaos-engine/, run:

  node scripts/trace-scenes.mjs

It writes public/scenes/<slug>.svg for each and (re)builds cat-badge.png.
Higher-res sources trace better; anything ~1000-2000px works great.
