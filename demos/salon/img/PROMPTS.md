# Imágenes para la web del salón (Lila Nails)

Guarda cada imagen en esta misma carpeta (`demos/salon/img/`) con **el nombre exacto** de la tabla, en `.jpg`.
La web ya las busca ahí: en cuanto exista el archivo, aparece. Mientras falte, se ve un fondo degradado con una "L".

## Cómo usarlos

1. Copia el **bloque de estilo** y pégalo al final de cada prompt. Es lo que hace que las 15 fotos parezcan del mismo salón y de la misma sesión.
2. Genera en la **proporción indicada**. La web recorta al centro, así que deja el sujeto centrado y con aire alrededor.
3. Añade el **prompt negativo** si tu generador lo admite (Stable Diffusion, Leonardo, Flux con negativos). En Midjourney, usa `--no` con las mismas palabras.
4. Revisa siempre las manos: **cinco dedos, uñas todas iguales de forma y largo**. Si sale una mano rara, regenera; es lo primero que nota una clienta.
5. Exporta a unos 1600 px en el lado largo (2400 px para las horizontales) y comprime a JPG calidad 80.

### Bloque de estilo (pegar al final de cada prompt)

```
Editorial beauty photography, shot on Canon EOS R5 with 100mm f/2.8 macro lens, soft diffused natural window light from the left, shallow depth of field, warm neutral color palette of cream, blush pink, soft beige and a deep burgundy accent, true-to-life skin texture with visible pores and fine lines, realistic nail anatomy with natural cuticles, subtle glossy reflections on the nail surface, no retouching artifacts, hyperrealistic, photorealistic, 8k, high-end salon campaign look
```

### Prompt negativo

```
extra fingers, missing fingers, fused fingers, six fingers, deformed hands, distorted knuckles, unnatural long fingers, uneven nail lengths, mismatched nail shapes, plastic skin, airbrushed skin, cartoon, illustration, 3d render, cgi, text, watermark, logo, brand names, oversaturated, harsh flash, cluttered background, jewelry overload
```

Parámetros para Midjourney: añade `--style raw --s 150` y la proporción de cada imagen (`--ar 4:5`, `--ar 1:1`, `--ar 16:9`, `--ar 5:4`).

---

## Las 15 imágenes

| Archivo | Dónde se usa | Proporción |
|---|---|---|
| `hero.jpg` | Imagen principal de la cabecera (arco grande) | 4:5 |
| `detaliu.jpg` | Círculo pequeño sobre la cabecera | 1:1 |
| `salon.jpg` | Sección "Despre salon", foto grande | 5:4 |
| `tehnician.jpg` | Sección "Despre salon", foto pequeña superpuesta | 4:5 |
| `serv-manichiura.jpg` | Tarjeta de servicio: Manichiură | 4:5 |
| `serv-pedichiura.jpg` | Tarjeta de servicio: Pedichiură | 4:5 |
| `serv-nailart.jpg` | Tarjeta de servicio: Nail art | 4:5 |
| `g1.jpg` … `g6.jpg` | Galería de trabajos | 4:5 |
| `igiena.jpg` | Sección oscura "De ce Lila" (arco) | 4:5 |
| `cta.jpg` | Fondo del bloque final "Rezervă acum" | 16:9 |

### 1. `hero.jpg` — 4:5 (la más importante)

```
Close-up of two elegant female hands gently resting one over the other on a cream linen fabric, medium-length almond-shaped nails with a flawless milky nude-pink gel polish and a mirror-like glossy finish, relaxed graceful fingers, a single thin gold ring, soft blush-pink background fading out of focus, generous empty space above the hands, calm and luxurious mood
```

### 2. `detaliu.jpg` — 1:1

```
Extreme macro shot of a nail technician's gloved hand applying glossy burgundy gel polish with a fine brush onto a client's almond-shaped nail, the brush mid-stroke, wet polish catching the light, client's hand resting on a white towel, blurred salon background in warm cream tones, subject perfectly centered
```

### 3. `salon.jpg` — 5:4

```
Interior of a small boutique nail salon with no people, two manicure tables in light oak with cream leather chairs, arched wall mirror with a thin brass frame, blush-pink plaster walls, a shelf with neatly arranged nail polish bottles in nude and red tones without visible labels, dried pampas grass in a ceramic vase, warm afternoon sunlight coming through sheer curtains, clean minimalist Scandinavian-meets-Parisian style, wide angle 24mm, straight verticals, architectural interior photography
```

### 4. `tehnician.jpg` — 4:5

```
A female nail technician in her late twenties wearing a cream linen apron and black nitrile gloves, focused and smiling slightly while filing a client's nails at a light oak manicure table, hair tied back, face in soft three-quarter profile, client's hands visible in the foreground, professional LED lamp and neatly arranged tools on the table, blush-pink wall behind, natural candid documentary feel, 50mm lens
```

### 5. `serv-manichiura.jpg` — 4:5

```
One female hand held elegantly in front of a soft cream background, medium almond nails with a sheer milky pink semi-permanent polish, perfectly clean cuticles, fingers slightly curved, holding a small sprig of dried baby's breath flowers, darker soft vignette toward the bottom of the frame so text can sit over it
```

### 6. `serv-pedichiura.jpg` — 4:5

```
Top-down view of a woman's feet with a fresh classic red pedicure resting on a folded cream towel beside a ceramic bowl of warm water with floating rose petals, a small wooden brush and a rolled towel nearby, natural skin texture, relaxing spa atmosphere, warm beige stone floor, darker soft shadow in the lower third of the frame
```

### 7. `serv-nailart.jpg` — 4:5

```
Close-up of a female hand showing detailed hand-painted nail art on almond nails: delicate thin white floral line drawings and tiny gold foil flakes over a translucent nude base, each nail slightly different but harmonious, hand resting on a burgundy velvet surface, dramatic soft side light, rich deep background, darker toward the bottom
```

### 8. `g1.jpg` — French clásico — 4:5

```
Female hand with a classic French manicure on medium almond nails, crisp thin white tips over a sheer natural pink base, hand resting on a cream ceramic cup of cappuccino, soft morning light, neutral beige background
```

### 9. `g2.jpg` — Burdeos brillante — 4:5

```
Female hand with short square-oval nails painted in a deep glossy burgundy wine red, high-shine reflection line across each nail, hand holding the lapel of a cream wool coat, moody elegant autumn feel, soft blurred background
```

### 10. `g3.jpg` — Nude cromado — 4:5

```
Female hand with long almond nails in a nude base with a subtle pearl chrome glazed-donut finish, soft iridescent reflections, fingers lightly touching a satin champagne-colored fabric, bright airy lighting
```

### 11. `g4.jpg` — Floral pintado a mano — 4:5

```
Female hand with medium oval nails featuring tiny hand-painted pastel flowers in pink, white and sage green on a milky translucent base, each flower slightly different, hand holding a small bouquet of fresh ranunculus, spring mood, blush background
```

### 12. `g5.jpg` — Baby boomer — 4:5

```
Female hand with medium coffin-shaped nails in a baby boomer ombré, soft gradient from milky white tips to natural pink at the cuticle, seamless blend, hand resting on a white marble surface with soft grey veins, clean bright light
```

### 13. `g6.jpg` — Pedicura roja — 4:5

```
Close-up of a woman's feet with a glossy classic red pedicure, toes slightly pointed, resting on a fluffy white towel, a pair of cream linen slippers and a small eucalyptus branch beside them, soft warm light, natural skin texture
```

### 14. `igiena.jpg` — 4:5 (va sobre fondo burdeos oscuro)

```
Still life of professional manicure tools in sealed transparent sterilization pouches laid neatly on a stainless steel tray: cuticle nippers, a pusher and scissors, with a small tabletop autoclave softly out of focus behind, a gloved hand opening one pouch, clinical cleanliness with warm tones, deep burgundy and cream color scheme, soft directional light
```

### 15. `cta.jpg` — 16:9 (lleva texto blanco encima)

```
Wide flat-lay from above on a blush-pink linen surface: several unlabeled nail polish bottles in nude, pink and burgundy, a nail file, a small brush, dried roses and scattered petals arranged around the edges, the center of the frame left mostly empty for text, soft even shadows, low contrast, slightly dark and moody exposure
```

---

## Notas

- **Sin texto ni marcas** en ninguna imagen: las etiquetas de los botes salen deformadas y delatan que es generada.
- **Coherencia de piel y uñas:** si quieres que parezca la misma clientela, añade al prompt de las manos `light-medium skin tone` (o el tono que prefieras) y mantenlo en todas.
- Las tres fotos de servicios y `cta.jpg` llevan texto encima; por eso piden la parte inferior (o el centro) más oscura y despejada.
- Cuando las tengas, dímelo y ajusto el encuadre de cada una (punto focal del recorte) si alguna queda mal centrada.
