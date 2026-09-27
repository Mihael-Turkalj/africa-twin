# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript + GSAP (ScrollTrigger), static build deployed to GitHub Pages from its own public repo. Chosen by the user; the same stack as the lab's `plitvice-flight` site, where scroll-scrubbed video is already proven.

## Users

Primary: prospective clients, agencies and employers evaluating Mihael Turkalj's web work. They reach the site from his portfolio (mihaelturkalj.com) or GitHub, usually on a laptop, sometimes on a phone, and judge within a minute whether he can build distinctive, technically ambitious product pages.

Secondary, inside the story: motorcycle enthusiasts and past or present XRV750 owners, who will notice wrong facts.

## Product Purpose

An unofficial, single-product showcase of the Honda XRV750 Africa Twin, RD07 generation (1993–2003), in the classic tricolour livery. The bike sits at the centre of the page. As the visitor scrolls, it comes apart into its main assemblies (bodywork and fairing, fuel tank, seat, wheels, brakes, suspension, exhaust, cooling, engine, frame), and each assembly gets an explanation.

Success: the visitor understands how this motorcycle is built. Every assembly is explained clearly and correctly, and the portfolio visitor leaves convinced by the craft.

## Positioning

A product page for a product that no longer exists: it can't sell anything, so it explains instead. The exploded view is the argument, with the parts leaving the bike in a real assembly order and each explained with verified specifications.

## Operating Context

- Part of a portfolio "lab" in which each site is built with a different design approach. This one is built with Impeccable (its hooks are on). The site's README records the approach and the lessons.
- The exploded view is AI-generated video (kie.ai: Nano Banana Pro keyframes, Kling 3.0 transitions), built from real reference photos and scrubbed by scroll, the method proven on `plitvice-flight`. Generation costs credits, and the user approves every spend beforehand.
- Before a site counts as done, it is checked with Playwright at 375 px and 1440 px.

## Capabilities and Constraints

- Unofficial. "Honda" and "Africa Twin" are active Honda trademarks (the name was revived for the CRF1000L in 2016). Use the names descriptively only. No Honda wing logo, no Honda press photos, and a visible "unofficial; not affiliated with Honda" note.
- The imagery is AI-generated and must be disclosed as such. Mechanical details in the generated imagery may not be exact; the text must stay accurate.
- Specifications differ between Japanese and European figures and between the RD07 (1993–95) and RD07A (1996+). Label which figure is which, or use the safe wording from the research; never average them or invent a figure.
- English only.
- Undecided: the exact list and order of the assemblies shown separately in the exploded view (it depends on what the video model can render cleanly).

## Brand Commitments

The site is presented as a portfolio piece by Mihael Turkalj (links to https://mihaelturkalj.com and https://github.com/Mihael-Turkalj). There are no other binding brand assets.

## Evidence on Hand

- Verified research with sources: `research/xrv750-rd07.md`, covering specs, assemblies, rally heritage, common issues and name status.
- Real reference photos: about 18 free-licence photos of XRV750s on Wikimedia Commons (Category:Honda XRV750). They must be credited if shown.
- Absent, and must not be fabricated: testimonials, owner quotes, prices beyond the sourced 1998 UK list price, production totals beyond the sourced MOTORRAD figures, and any claim of Honda endorsement.

## Product Principles

1. Explain, don't sell: every visual beat maps to an assembly and a verified fact.
2. The bike is the protagonist; the interface recedes around it.
3. Accuracy over drama: when sources disagree, say so plainly instead of picking the most impressive number.
4. Honest provenance: the imagery is labelled AI-generated, the photos are credited, and the site is unofficial.

## Accessibility & Inclusion

The exploded view must have a reduced-motion equivalent that carries the same information (stills plus text). All assembly explanations must be readable as text and not locked inside video.
