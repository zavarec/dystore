export const sampleCarousel = `{
    "kind": "carousel",
    "autoplay": true,
    "intervalMs": 6000,
    "showDots": true,
    "showArrows": true,
    "slides": [
      {
        "id": "s1",
        "title": "Whole-machine HEPA filtration",
        "subtitle": "Traps 99.99% of particles as small as 0.1 microns",
        "media": { "type": "image", "src": "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1200" },
        "align": "left"
      },
      {
        "id": "s2",
        "title": "6× the suction",
        "media": { "type": "video", "src": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4", "poster": "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200" },
        "align": "right"
      }
    ]
  }`;

export const sampleDropdown = `{
    "kind": "dropdown",
    "bgColor": "#050505",
    "options": [
      {
        "id": "dry",
        "label": "Discover dry cleaning",
        "title": "Discover dry cleaning",
        "subtitle": "Attachments for carpets and delicate surfaces.",
        "cards": [
          {
            "id": "card-3",
            "title": "Digital Motorbar™",
            "description": "Automatically de-tangles hair and adapts suction across different floor types.",
            "media": {
              "type": "image",
              "src": "https://images.unsplash.com/photo-1582719478250-4806c37a9d74?auto=format&fit=crop&w=1400&q=80"
            }
          },
          {
            "id": "card-4",
            "title": "Soft roller cleaner head",
            "description": "Captures fine dust and large debris from hard floors simultaneously.",
            "media": {
              "type": "image",
              "src": "https://images.unsplash.com/photo-1616627568558-8f99ec3fef3b?auto=format&fit=crop&w=1400&q=80"
            }
          }
        ]
      }
    ]
  }`;

export const sampleHighlights = `{
    "kind": "highlights",
    "heading": "Machine highlights",
    "subheading": "Key engineering details at a glance.",
    "items": [
      {
        "id": "h1",
        "title": "Deep cleans debris and pet hair",
        "description": "Dyson Motorbar™ cleaner head sucks up dirt and dust, automatically de-tangling hair.",
        "media": { "type": "image", "src": "https://images.unsplash.com/photo-1556228578-8c89e6adf342?auto=format&fit=crop&w=1200&q=80" }
      },
      {
        "id": "h2",
        "title": "Low-profile hard floor cleaning",
        "description": "Illuminated Brush bar reaches further under furniture and into tight spaces.",
        "media": { "type": "image", "src": "https://images.unsplash.com/photo-1581578017423-3c7c50283d89?auto=format&fit=crop&w=1200&q=80" }
      },
      {
        "id": "h3",
        "title": "Advanced whole-machine filtration",
        "description": "Sealed system traps 99.99% of particles as small as 0.3 microns.",
        "media": { "type": "image", "src": "https://images.unsplash.com/photo-1523419410161-4aa74d10c5c5?auto=format&fit=crop&w=1200&q=80" }
      },
      {
        "id": "h4",
        "title": "No-touch bin emptying",
        "description": "Hygienic ejection mechanism drives dirt deep into your bin in one action.",
        "media": { "type": "image", "src": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80" }
      }
    ]
  }`;
