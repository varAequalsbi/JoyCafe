# JoyCafe GEO Landing Page Plan

> **Status:** This is the original strategic framework. After the owner completed the discovery questionnaire, the project-specific source of truth became [`JOYCAFE_IMPLEMENTATION_PLAN.md`](./JOYCAFE_IMPLEMENTATION_PLAN.md).

## 1. Product goal

Build a fast, accessible, crawlable landing page that makes JoyCafe easy for people and generative search systems to understand, verify, cite, and recommend for relevant local café queries.

The intended outcome is **a higher probability that AI assistants recommend JoyCafe when it genuinely matches the user's request**. No site can guarantee an AI recommendation: results vary by engine, user location, prompt wording, index freshness, reputation, and competing sources. The project therefore optimizes four things that can be influenced:

1. **Discovery** — crawlers can fetch and index the page.
2. **Understanding** — the café, location, menu, attributes, and audience fit are unambiguous.
3. **Trust and corroboration** — claims agree with credible third-party profiles and real reviews.
4. **Recommendation fit** — the page directly answers the questions people ask when choosing a café.

### Primary user outcome

A visitor can decide within 30 seconds whether JoyCafe fits their needs and can immediately get directions, view the menu, contact the café, or visit/reserve/order.

### GEO outcome

Across a controlled set of local café recommendation prompts, JoyCafe's mention rate, correct-fact rate, citation rate, and referral traffic improve from the pre-launch baseline over 30, 60, and 90 days.

## 2. Required inputs before final copy

The build can begin with clearly labelled placeholders, but launch is blocked until these facts are verified by the café owner:

- Exact business name and any alternate/common spelling
- Full street address, neighborhood, city, province, postal code, country, and map coordinates
- Phone, WhatsApp, email, canonical domain, and map/directions URL
- Opening hours, holiday-hour policy, price range, currencies, and accepted payment methods
- Complete menu with current prices, dietary/allergen notes, signature items, and availability rules
- Service modes: dine-in, takeaway, delivery, reservation, outdoor seating, parking, Wi-Fi, power outlets, accessibility, prayer room, smoking policy, pet policy, and group capacity
- The café's real differentiators and evidence for each claim
- Founder/chef/barista names and short, fact-checked story where relevant
- Original photos, logo, brand colors, and permission to publish each asset
- Links to Google Business Profile, Apple Maps, Bing Places, Instagram/TikTok, delivery apps, and reputable directory/editorial profiles
- Review source URLs and permission/context for any testimonial displayed
- Indonesian and English naming/copy requirements
- Primary conversion: directions, WhatsApp, reservation, phone call, or order

**Truth rule:** never invent reviews, awards, popularity claims, menu details, statistics, accessibility features, or superlatives such as “best café.” Every material claim must be supportable.

## 3. Audience and query map

Create a query-to-evidence matrix before writing copy. Initial clusters:

| Recommendation intent | Example prompt pattern | Evidence the page must expose |
|---|---|---|
| Near-me/local | “Recommend a café near [landmark/neighborhood]” | Precise address, coordinates, landmarks, map link, hours |
| Product | “Where can I get good [coffee/food item] in [city]?” | Menu item, ingredients, price, photo, availability, preparation detail |
| Work/study | “Quiet café with Wi-Fi and power outlets” | Wi-Fi, sockets, noise/time guidance, seating, stay policy |
| Dietary | “Halal/vegan/gluten-aware café in [city]” | Exact policy, certification where applicable, cross-contact caveat |
| Group/family/date | “Café for a group/date/family” | Capacity, seating, ambience, facilities, reservation details |
| Budget | “Affordable café under Rp X” | Current item prices, typical spend range, last-updated date |
| Time-based | “Café open early/late/on Sunday” | Machine-readable and visible opening hours |
| Accessibility | “Wheelchair-accessible café” | Entrance, restroom, seating, parking facts; no vague claims |

For each target query, record the intended answer, the exact supporting facts, the page section containing them, and at least one corroborating external profile where possible.

## 4. Information architecture

Start with one strong canonical landing page. Add focused pages only when they contain substantial unique content rather than thin SEO variants.

### Landing-page sections

1. **Hero:** what JoyCafe is, exact locality, strongest verifiable differentiator, open/closed context if reliable, and primary CTA.
2. **Quick facts:** address, hours, price range, service options, Wi-Fi/accessibility/parking facts.
3. **Why choose JoyCafe:** 3–5 concrete, evidence-backed reasons matched to recommendation intents.
4. **Signature menu:** real items, descriptions, prices, dietary markers, availability, and last-updated date.
5. **Best for:** clear use cases such as working, casual meetings, families, dates, or quick takeaway—only when true.
6. **Experience/gallery:** original, descriptive images of exterior, entrance, seating, menu items, and accessibility-relevant features.
7. **Reviews and recognition:** attributed excerpts that comply with the source's terms; link to the original source. Do not mark self-serving testimonials as aggregate ratings.
8. **Location:** full address, nearby landmarks/transit/parking, embedded or linked map, and directions CTA.
9. **FAQ:** concise answers to genuine pre-visit questions; all answers visible in normal page content.
10. **Contact/footer:** consistent name, address, phone, hours, canonical links, social profiles, and last-updated information.

### Likely follow-up pages

- `/menu` — full crawlable menu, prices, dietary/allergen detail, and update date
- `/about` — real origin, people, sourcing, and evidence-backed story
- `/visit` — directions, landmark context, facilities, policies, and accessibility details
- Optional editorial pages only for real user needs, such as a detailed brewing guide or neighborhood guide; never mass-produce location/keyword pages

## 5. Content and entity strategy

- Put the direct answer first in every section, then supporting detail.
- Use short descriptive headings, semantic lists/tables, complete sentences, and stable terminology.
- State “JoyCafe is a [specific café type] in [neighborhood, city]” consistently.
- Keep name, address, phone, URL, hours, and menu facts identical across the site and major profiles.
- Attach dates to time-sensitive facts: “Menu and prices checked on YYYY-MM-DD.”
- Explain who the café is and is not ideal for; recommendation systems need fit, not generic praise.
- Include quotable factual passages, but write for customers rather than stuffing keywords or awkward AI-targeted prose.
- Cite primary evidence for certifications, awards, partnerships, sourcing, or published recognition.
- Provide descriptive image filenames and alt text; include exterior/signage imagery so visitors can recognize the location.
- Publish in Indonesian first if that is the customer language; add a fully equivalent English version only if it can be maintained. Use correct `lang`, `hreflang`, and self-canonical URLs for multilingual pages.
- Do not create an `llms.txt` file as a launch dependency. It may be tested later, but it is not a substitute for crawlability, structured HTML, sitemap, or reputable third-party evidence.

## 6. Technical GEO and local SEO requirements

### Rendering and crawlability

- Use a static-first React architecture. Critical copy, links, metadata, and JSON-LD must be present in the initial HTML, not dependent on a client-side API call.
- Return `200` for valid pages, real `404` responses for missing pages, and permanent redirects for changed canonical URLs.
- Publish `robots.txt` that permits intended search crawlers, including `OAI-SearchBot`; decide separately whether to permit training-oriented crawlers.
- Publish an XML sitemap containing only canonical, indexable URLs and accurate modification dates.
- Add unique title, meta description, canonical URL, Open Graph/X metadata, favicon, and social preview.
- Do not use `noindex`, crawler-blocking authentication, intrusive interstitials, or robots rules on public recommendation content.
- Use normal `<a href>` links for navigation and key actions.

### Structured data

Add one truthful JSON-LD entity graph whose visible content matches the markup:

- Most specific business type: `CafeOrCoffeeShop` (also a `FoodEstablishment`/`LocalBusiness`)
- Stable `@id` based on the canonical domain
- `name`, `alternateName` if real, `url`, `logo`, `image`, `telephone`, `email`
- `address` as `PostalAddress` and `geo` as `GeoCoordinates`
- `openingHoursSpecification`, including day-specific exceptions when maintainable
- `priceRange`, `servesCuisine`, `acceptsReservations`, and applicable amenity/service properties
- `hasMenu` pointing to the canonical menu page
- `sameAs` only for profiles that unambiguously represent JoyCafe
- `Menu`, `MenuSection`, and `MenuItem` markup on a full menu page if it remains accurate
- `BreadcrumbList` on multi-page navigation

Avoid unsupported or misleading markup. In particular, do not add self-serving `AggregateRating`/`Review` markup merely to pursue rich results, and do not add FAQ markup expecting a guaranteed rich result.

Validate JSON-LD with Schema.org Validator and applicable Google Rich Results tests. Structured data improves machine understanding and eligibility; it does not guarantee ranking or display.

### Performance and accessibility

- Responsive from 320 px upward with no horizontal overflow.
- Semantic landmarks and heading order; keyboard-visible focus; skip link; accessible names.
- Text and controls meet WCAG 2.2 AA contrast; tap targets are comfortably usable.
- Images are correctly sized, compressed, lazy-loaded below the fold, and do not cause layout shift.
- Production targets at the 75th percentile: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 on mobile field data when enough traffic exists.
- No essential facts hidden only in carousels, hover states, images, canvas, or inaccessible widgets.

## 7. Off-site trust work (required for the final outcome)

The landing page alone is insufficient. AI answers often rely on search indexes and third-party sources, so the same verified entity facts must be corroborated elsewhere.

- Claim and fully complete Google Business Profile and Bing Places; also maintain Apple Business Connect where relevant.
- Keep name/address/phone/hours/category/menu URLs consistent across map, delivery, social, and trusted directory profiles.
- Add fresh original photos and keep holiday hours current.
- Ask real customers for honest reviews without incentives, gating, scripts, or fabricated content; respond helpfully.
- Earn legitimate local mentions: neighborhood publications, tourism sites, event partners, suppliers, community organizations, and relevant “best of” guides based on merit.
- Link profiles back to the canonical website, and link the site to official profiles with `sameAs` where appropriate.
- Create a monthly fact-consistency check across the website and all profiles.

## 8. Analytics and GEO measurement

### Baseline before launch

Create at least 30 prompts across the intent clusters, with Indonesian and English variants where relevant. Run each prompt multiple times on the target engines because answers are stochastic. Record:

- Brand mentioned: yes/no
- Recommendation position/prominence
- Website cited or linked: yes/no
- Facts correct/incorrect/omitted
- Competitors mentioned
- Source URLs used
- User location, engine, date, prompt, and run number

Do not automate querying in ways that violate a platform's terms.

### Website measurement

- Configure privacy-appropriate analytics and conversion events for directions, WhatsApp, phone, menu, reservation/order, and outbound profile clicks.
- Verify Google Search Console and Bing Webmaster Tools; submit the sitemap and monitor indexing.
- Track organic landing queries, indexed pages, crawl issues, branded/unbranded traffic, conversions, and referrers including ChatGPT where exposed.
- Use UTM tags only on links the café controls; do not expect all AI referrals to be identifiable.

### Evaluation cadence

- Day 0: baseline before launch
- Day 7: crawl/index and structured-data audit
- Day 30: first prompt and referral comparison
- Day 60: content/profile consistency refresh
- Day 90: outcome review and next experiment

Report mention rate, citation rate, factual accuracy, share of recommendation prompts, AI referral sessions, and qualified conversions separately. A traffic increase without relevant visits is not success.

## 9. Delivery phases

### Phase 0 — Discovery and evidence pack

- Collect and verify all business facts, assets, profile links, and permissions.
- Audit current search/map/AI visibility and named competitors.
- Build the query-to-evidence matrix and baseline prompt set.
- Agree on the primary conversion and canonical domain.

**Exit:** there is one approved source-of-truth document; unresolved claims are excluded or visibly marked as placeholders in non-production work.

### Phase 1 — Content and page model

- Draft the landing page, FAQ, quick facts, menu excerpt, and calls to action.
- Map every claim to evidence and every target query to visible content.
- Define page titles, descriptions, URLs, image brief, and structured-data entity IDs.

**Exit:** owner approves factual copy; no invented or unsupported claims remain.

### Phase 2 — First meaningful React slice

- Scaffold the static-first site and implement the hero, quick facts, signature menu, location, and primary CTA.
- Establish responsive visual language, semantic HTML, metadata, and initial JSON-LD.
- Show a local preview once the page is recognizably JoyCafe and compiles without blocking errors.

**Exit:** a coherent mobile/desktop preview contains real representative content in the initial HTML.

### Phase 3 — Complete build

- Complete all approved sections and focused supporting pages.
- Add original images, full structured data, sitemap, robots policy, canonical/hreflang metadata, analytics, and conversion tracking.
- Add social preview metadata and image.

**Exit:** production build succeeds and all DoD checks that can run locally pass.

### Phase 4 — QA and launch

- Test mobile/desktop presentation, keyboard navigation, forms/actions, links, status codes, page source, and crawl directives.
- Validate structured data, accessibility, performance, social preview, sitemap, and canonical behavior.
- Deploy to the canonical HTTPS domain and verify webmaster tools.

**Exit:** public URLs are indexable, tested, monitored, and contain only approved facts.

### Phase 5 — Authority and iteration

- Align major business profiles and start legitimate review/mention work.
- Re-run the prompt benchmark at 30/60/90 days.
- Fix factual gaps first, then run one controlled content experiment at a time.

**Exit:** a 90-day report compares visibility and business outcomes with the baseline and documents the next evidence-backed iteration.

## 10. Skills likely needed

### Codex skills available for delivery

| Skill | Why it is needed | When |
|---|---|---|
| `sites:sites-building` | Build the landing page using the existing/new site workflow and produce a meaningful preview | Required during implementation |
| `sites:sites-hosting` | Publish the validated site and manage the hosted URL | Required unless the user explicitly wants local-only delivery |
| `browser:control-in-app-browser` | Inspect the public/local page, interactions, responsive states, rendered content, and validation tools | Required for explicit browser QA; recommended before launch |
| `imagegen` | Create an original hero/social image if suitable owned photography is unavailable | Conditional; real café photography is preferred |
| `openai-docs` | Verify current official ChatGPT Search crawler/discovery guidance | Required when implementing or revisiting ChatGPT-specific rules |

No spreadsheet, presentation, PDF, document, plugin, or computer-control skill is presently necessary. If menu/catalog maintenance later moves into a workbook, the spreadsheet skill could become useful, but it should not be added now.

### Project competencies

- Local SEO and entity consistency
- GEO research and repeatable prompt benchmarking
- Evidence-led copywriting in Indonesian and/or English
- React and static/server rendering
- Schema.org/JSON-LD modeling
- Technical SEO, crawler controls, sitemaps, and HTTP behavior
- Responsive UI design and conversion design
- Accessibility (WCAG 2.2 AA)
- Web performance/Core Web Vitals
- Analytics, consent/privacy, and conversion measurement
- Local profile, review, and digital PR operations

## 11. Definition of Done (DoD)

The project is done only when all applicable items below are true.

### Truth and content

- [ ] Every public business fact is owner-approved and traceable to the source-of-truth record.
- [ ] Name, address, phone, hours, price range, menu, and policies are current and internally consistent.
- [ ] The hero states what JoyCafe is, where it is, and why it fits a specific customer need.
- [ ] Target recommendation intents are answered directly in visible page content.
- [ ] Prices and other time-sensitive content include a last-verified date and maintenance owner.
- [ ] No fabricated reviews, awards, statistics, credentials, scarcity, or “best” claims exist.
- [ ] Testimonials are attributed and link to permitted source context where applicable.
- [ ] Primary CTA and fallback contact/directions actions work.

### Machine understanding and indexing

- [ ] Important content and links exist in the initial HTML response.
- [ ] Each indexable page has a unique title, description, canonical URL, and one clear H1.
- [ ] `robots.txt` permits intended search crawlers, including `OAI-SearchBot`, and does not accidentally block assets/pages.
- [ ] `sitemap.xml` contains only canonical `200` URLs and is submitted to Google and Bing.
- [ ] No production page intended for discovery contains `noindex` or requires login.
- [ ] Valid `CafeOrCoffeeShop` JSON-LD matches visible facts and uses a stable `@id`.
- [ ] Address, coordinates, hours, phone, menu URL, images, and `sameAs` profiles are marked up when verified.
- [ ] Structured data passes Schema.org validation and applicable rich-result tests with zero critical errors.
- [ ] Missing URLs return a true `404`; redirects and canonicals resolve without loops or chains.

### Experience, accessibility, and quality

- [ ] Page works at 320 px, common mobile/tablet widths, and desktop without horizontal overflow.
- [ ] All functionality is keyboard usable with visible focus and logical order.
- [ ] WCAG 2.2 AA automated checks have no critical violations; key flows pass manual checks.
- [ ] Images have appropriate dimensions, compression, alt text, and permission records.
- [ ] No broken internal/external links, missing assets, console-blocking errors, or failed primary actions.
- [ ] Production build and project tests/lint pass.
- [ ] Lighthouse lab checks on the production build reach at least 90 for Performance, Accessibility, Best Practices, and SEO on the agreed representative mobile run, with any exception documented.
- [ ] Real-user Core Web Vitals are monitored after launch, targeting good thresholds once sufficient field data exists.

### Trust and distribution

- [ ] Google Business Profile and Bing Places are claimed/verified or ownership blockers are documented.
- [ ] Core entity facts match across the website and priority third-party profiles.
- [ ] Official profiles link to the canonical domain where the platform allows it.
- [ ] Review acquisition follows platform rules and uses only real customer feedback.
- [ ] At least one named person owns monthly updates for hours, menu, profiles, reviews, and website facts.

### Measurement and outcome

- [ ] Analytics records directions, WhatsApp, phone, menu, reservation/order, and key outbound clicks.
- [ ] Search Console and Bing Webmaster Tools are verified and show the canonical URLs as discoverable/indexable, allowing normal processing time.
- [ ] A versioned baseline contains at least 30 high-intent prompts, multiple runs, engines, dates, locations, and competitor/source observations.
- [ ] A dashboard/report separately tracks mention rate, citation rate, factual accuracy, qualified referrals, and conversions.
- [ ] Day 7 and Day 30 checks are assigned; Day 60 and Day 90 reviews are scheduled.
- [ ] At Day 90, JoyCafe shows a documented improvement in at least one leading GEO metric (qualified mention rate, citation rate, or factual accuracy) **without regression in factual accuracy**, or the report identifies the failed hypothesis and next controlled experiment.

The aspirational business success criterion is increased qualified visits/orders attributable to organic and AI-assisted discovery. It is measured over time, not treated as a launch-day guarantee or a condition developers can force.

## 12. Key risks and controls

| Risk | Control |
|---|---|
| AI systems still do not recommend JoyCafe | Improve real-world prominence and third-party corroboration; benchmark multiple engines; iterate based on observed source gaps |
| Incorrect AI answer | Publish explicit, dated facts; align external profiles; monitor prompts and correct source discrepancies |
| Stale menu/hours | Assign an owner and monthly/holiday update process; show verification dates |
| Keyword-stuffed or generic content | Write direct customer answers, require evidence, and review for usefulness and natural language |
| Fake or misleading review/schema tactics | Use only real visible content and platform-compliant review practices |
| Client-only content is missed | Pre-render critical HTML and verify raw response/source during QA |
| Privacy or tracking problems | Minimize data, document consent needs, and avoid collecting unnecessary personal data |

## 13. Evidence informing the plan

- Google recommends the most specific `LocalBusiness` subtype and explains that structured data can communicate hours and other business details: <https://developers.google.com/search/docs/appearance/structured-data/local-business>
- Google documents that pre-rendering remains useful because not all bots execute JavaScript, and recommends crawlable links, descriptive metadata, canonical URLs, and structured-data testing: <https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics>
- Google's structured-data guidance explicitly states that valid markup does not guarantee rich-result display: <https://developers.google.com/search/docs/appearance/structured-data/sd-policies>
- Schema.org defines the café entity type used by this plan: <https://schema.org/CafeOrCoffeeShop>
- OpenAI's publisher guidance says public sites can appear in ChatGPT Search and that allowing `OAI-SearchBot` supports discovery/citation: <https://help.openai.com/en/articles/12627856-publishers-and-developers-faq>
- The foundational GEO paper reports that content changes can affect visibility, but effects vary by domain: <https://arxiv.org/abs/2311.09735>
