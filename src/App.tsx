import React, { useState, useEffect } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  MessageCircle,
  Play,
  Sparkles,
  Star,
  Upload,
  X,
  ArrowDown,
} from 'lucide-react';
import {
  OpeningVideoIntro,
  getPrakritiProductAssets,
  CustomMediaOverrides,
} from './components/PrakritiMediaAssets';

const GOOGLE_REVIEW_URL = 'https://g.page/r/Cfm5Kmz9IcJAEBI/review';
const WHATSAPP_NUMBER_DISPLAY = '+91 93701 88789';
const WHATSAPP_BASE_URL = 'https://wa.me/919370188789';

const SUGGESTED_REVIEW_TEXT = `★★★★★
I had a great experience with Prakriti Soap. I really liked the quality and the product. Highly recommended!`;

interface ProductItem {
  id: 'charcoal-chandan' | 'rose-goat-milk';
  name: string;
  subtitle: string;
  weight: string;
  skinType: string;
  ethicalClaim: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  whatsappMessage: string;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'charcoal-chandan',
    name: 'Charcoal Chandan Soap',
    subtitle: 'Purifying Activated Charcoal & Cooling Sandalwood',
    weight: '100g (3.5 oz)',
    skinType: 'All Skin Types',
    ethicalClaim: 'Cruelty-Free',
    description:
      'An artisanal marbled bar blending deep-cleansing activated charcoal with pure, cooling sandalwood (chandan) and soothing rose water. Formulated to draw out everyday impurities while leaving skin calm, balanced, and softly scented.',
    benefits: [
      'Reduces blemishes, acne & excess surface oil',
      'Deeply cleanses pores without stripping natural moisture',
      'Soothes sun-tired skin with pure chandan & rose water',
      'Enriched with Vitamin E & cold-pressed coconut oil',
    ],
    ingredients: ['Rose Water', 'Sandalwood (Chandan)', 'Activated Charcoal', 'Vitamin E', 'Coconut Oil'],
    whatsappMessage:
      'Hello Prakriti Soap! 🌿 I would like to order the *Charcoal Chandan Soap (100g)*. Please share availability and delivery details.',
  },
  {
    id: 'rose-goat-milk',
    name: 'Rose Goat Milk Soap',
    subtitle: 'Nourishing Farm-Fresh Goat Milk, Crushed Rose & Cinnamon',
    weight: '100g (3.5 oz)',
    skinType: 'All Skin Types',
    ethicalClaim: 'Cruelty-Free',
    description:
      'A rich, velvety botanical bar crafted with creamy goat milk, sun-dried crimson rose petals, warm cinnamon bark, and pure essential oils. Gently exfoliates and cocoons dry or delicate skin in lasting hydration.',
    benefits: [
      'Hydrates & softens dry, delicate skin with creamy lather',
      'Gently exfoliates with real crushed botanicals',
      'Nourishes skin barrier with natural lactic acid & honey',
      'Leaves a warm floral-botanical aroma of rose & cinnamon',
    ],
    ingredients: ['Rose Petals', 'Goat Milk', 'Cinnamon Bark', 'Pure Honey', 'Essential Oils'],
    whatsappMessage:
      'Hello Prakriti Soap! 🌹 I would like to order the *Rose Goat Milk Soap (100g)*. Please share availability and delivery details.',
  },
];

const WHY_PRAKRITI_PILLARS = [
  {
    index: '01',
    title: 'Handcrafted',
    summary: 'Small-Batch Artisanal Pouring',
    detail:
      'Each oval bar is hand-poured, marbled, and cured in small batches to preserve the natural glycerin and active botanical oils.',
  },
  {
    index: '02',
    title: 'Naturally Inspired',
    summary: 'Time-Honored Indian Botanicals',
    detail:
      'Rooted in traditional skincare wisdom—combining pure chandan (sandalwood), crushed rose petals, activated charcoal, and nourishing goat milk.',
  },
  {
    index: '03',
    title: 'Everyday Care',
    summary: 'Gentle pH-Balanced Cleansing',
    detail:
      'Created for daily face and body rituals across all skin types, cleansing thoroughly without harsh sulfates or synthetic drying agents.',
  },
  {
    index: '04',
    title: 'Made With Love',
    summary: 'Cruelty-Free & Honest Ingredients',
    detail:
      'Thoughtfully formulated with care in every detail—from skin-kind ingredients to our classic apothecary presentation.',
  },
];

const REVIEW_TEMPLATES: Record<number, string[]> = {
  5: [
    "★★★★★ I absolutely love Prakriti Soap! The handmade natural soap leaves my skin feeling so soft and nourished after every bath. Amazing quality and fragrance.",
    "★★★★★ Switching to Prakriti Soap was the best decision for my skincare routine. Exceptional quality, natural ingredients, and a truly refreshing bathing experience.",
    "★★★★★ Prakriti Soap is a fantastic handmade soap. The lather is creamy, the fragrance is subtle and natural, and it doesn't dry out my skin at all. Highly recommended!",
    "★★★★★ Truly premium natural skincare! Prakriti Soap has become my daily favorite. High quality, beautiful packaging, and wonderful for everyday use.",
    "★★★★★ I'm very impressed with Prakriti Soap. The quality of this handmade soap is outstanding, and it leaves a pleasant, natural fragrance lingering after your shower.",
    "★★★★★ Fantastic natural soap! Prakriti Soap has wonderful ingredients that feel gentle and nourishing on the skin. Will definitely be ordering again.",
    "★★★★★ A wonderful addition to my daily bath routine. Prakriti Soap offers great quality, rich lather, and a genuinely natural skincare experience.",
    "★★★★★ Prakriti Soap is top-notch handmade soap. My skin feels clean, hydrated, and refreshed every single day. Five stars!",
    "★★★★★ Beautiful natural soap with an exquisite bathing experience. Prakriti Soap delivers on its promise of quality skincare.",
    "★★★★★ Excellent quality handmade soap! Prakriti Soap is gentle on the skin, smells wonderful, and feels completely natural."
  ],
  4: [
    "★★★★☆ Really good natural soap! Prakriti Soap has a great texture and pleasant fragrance. My skin feels clean and soft, though delivery took an extra day.",
    "★★★★☆ Prakriti Soap is a solid handmade soap for daily skincare. Good quality lather and gentle on skin, though I wish the fragrance lasted a bit longer.",
    "★★★★☆ Enjoyed using Prakriti Soap. It's a high quality natural soap that feels very refreshing during the bath. Very happy with the product overall.",
    "★★★★☆ A very nice handmade soap from Prakriti Soap. Leaves skin soft and clean. Would love to see more varieties in the future!",
    "★★★★☆ Prakriti Soap offers great natural skincare quality. The bathing experience is pleasant and soothing. Satisfied with my purchase.",
    "★★★★☆ Good quality natural soap. Prakriti Soap feels gentle on the skin and has a nice subtle fragrance. Solid four stars.",
    "★★★★☆ Really nice handmade soap. Prakriti Soap lathers well and leaves skin feeling moisturized. A reliable choice for everyday skincare.",
    "★★★★☆ I like Prakriti Soap a lot. The natural ingredients make a noticeable difference in skin texture. Good product and quality.",
    "★★★★☆ A dependable handmade soap. Prakriti Soap provides a refreshing bath and clean skin without dryness. Very pleasant experience.",
    "★★★★☆ Prakriti Soap is a quality natural skincare choice. Good fragrance and gentle feel. Would recommend to friends."
  ],
  3: [
    "★★★☆☆ Prakriti Soap is an average natural soap. The handmade quality is decent and it cleans well, but the fragrance was a bit milder than expected.",
    "★★★☆☆ Decent handmade soap. Prakriti Soap is okay for daily use, though I felt it finished a little faster than regular commercial soaps.",
    "★★★☆☆ Prakriti Soap provides a standard bathing experience. Quality is fine, but nothing extraordinary for the price point.",
    "★★★☆☆ It's an okay natural soap. Prakriti Soap is gentle on skin, but the scent could be improved. Acceptable product.",
    "★★★☆☆ Prakriti Soap is a decent handmade soap option. Works well for basic skincare, though packaging could be sturdier.",
    "★★★☆☆ Average natural soap experience with Prakriti Soap. Cleans reasonably well without irritation, but standard overall.",
    "★★★☆☆ Prakriti Soap is fine for everyday bathing. Not bad, but expected a richer lather from a handmade soap.",
    "★★★☆☆ An acceptable natural soap. Prakriti Soap works decently for skincare, though results are fairly typical.",
    "★★★☆☆ Prakriti Soap is okay. Decent ingredients and gentle feel, but the fragrance faded quickly.",
    "★★★☆☆ Fair quality handmade soap. Prakriti Soap is okay for routine use, nothing exceptional."
  ],
  2: [
    "★★☆☆☆ Prakriti Soap was okay, but honestly expected better moisture from a handmade soap. Felt a bit drying on my skin after a few uses.",
    "★★☆☆☆ Not entirely satisfied with Prakriti Soap. The natural fragrance was nice, but the soap bar melted rather quickly during regular daily use.",
    "★★☆☆☆ Prakriti Soap is an average natural soap. Unfortunately, it didn't suit my skin type as well as I hoped, leaving it feeling a bit tight.",
    "★★☆☆☆ Expected more from Prakriti Soap given the handmade description. Lather was thinner than expected and scent was very faint.",
    "★★☆☆☆ Prakriti Soap has decent ingredients, but the overall bathing experience was underwhelming for the price.",
    "★★☆☆☆ Prakriti Soap was just okay. The soap didn't hold up well in the bathroom dish and softened too quickly.",
    "★★☆☆☆ Not my favorite natural soap. Prakriti Soap left my skin feeling slightly dry compared to other handmade soaps I've tried.",
    "★★☆☆☆ Prakriti Soap has potential, but the quality consistency could be improved in future batches.",
    "★★☆☆☆ Prakriti Soap was somewhat disappointing. Decent scent, but the bar didn't last long enough for daily skincare use.",
    "★★☆☆☆ Prakriti Soap didn't quite meet my expectations for a premium handmade soap."
  ],
  1: [
    "★☆☆☆☆ Unfortunately, Prakriti Soap didn't work for me. The natural soap bar broke apart easily and felt too drying on my skin.",
    "★☆☆☆☆ Disappointed with Prakriti Soap. The handmade soap dissolved very quickly in water and the fragrance was almost unnoticeable.",
    "★☆☆☆☆ Prakriti Soap was not what I expected. It caused mild irritation and felt harsh on sensitive skin.",
    "★☆☆☆☆ Regrettably, Prakriti Soap did not meet quality expectations. The bar became mushy after just two days in the shower.",
    "★☆☆☆☆ Not satisfied with Prakriti Soap. Poor lather quality and left skin feeling tight and dry.",
    "★☆☆☆☆ Prakriti Soap fell short of expectations. The handmade quality needs significant improvement for daily skincare.",
    "★☆☆☆☆ Unfortunately, Prakriti Soap did not last long and lacked the moisturizing feel expected from natural soap.",
    "★☆☆☆☆ Dissatisfied with Prakriti Soap. The bar crumbled easily and didn't provide a good bathing experience.",
    "★☆☆☆☆ Prakriti Soap was disappointing. Weak fragrance and unsatisfactory texture for handmade soap.",
    "★☆☆☆☆ Not recommended. Prakriti Soap dissolved too quickly and was too harsh for regular skincare use."
  ]
};

function buildWhatsAppUrl(message: string): string {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

export default function App() {
  // Show the full-screen cinematic intro video first on load
  const [showIntroVideo, setShowIntroVideo] = useState<boolean>(true);
  const [heroShowcaseTab, setHeroShowcaseTab] = useState<'duo' | 'charcoal' | 'rose'>('duo');
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [editableReviewText, setEditableReviewText] = useState<string>(() => {
    const list = REVIEW_TEMPLATES[5];
    return list[Math.floor(Math.random() * list.length)];
  });
  const [copySuccessMessage, setCopySuccessMessage] = useState<string>('');
  const [selectedOrderOption, setSelectedOrderOption] = useState<'both' | 'charcoal' | 'rose'>('both');
  const [orderQuantity, setOrderQuantity] = useState<number>(2);
  const [lightboxProduct, setLightboxProduct] = useState<ProductItem | null>(null);
  const [showMediaUploader, setShowMediaUploader] = useState<boolean>(false);
  const [customMedia, setCustomMedia] = useState<CustomMediaOverrides>({});

  const defaultAssets = getPrakritiProductAssets();

  const charcoalImageSrc = customMedia.charcoalPhotoUrl || defaultAssets.charcoalUrl;
  const roseImageSrc = customMedia.rosePhotoUrl || defaultAssets.roseUrl;
  const heroImageSrc =
    heroShowcaseTab === 'duo'
      ? customMedia.heroPhotoUrl || defaultAssets.heroDuoUrl
      : heroShowcaseTab === 'charcoal'
      ? charcoalImageSrc
      : roseImageSrc;

  // Lock body scroll while full-screen opening video is active
  useEffect(() => {
    if (showIntroVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showIntroVideo]);

  const handleSelectRating = (rating: number) => {
    setSelectedRating(rating);
    const list = REVIEW_TEMPLATES[rating];
    const randomReview = list[Math.floor(Math.random() * list.length)];
    setEditableReviewText(randomReview);
    setCopySuccessMessage('');
  };

  const handleShuffleReview = () => {
    const list = REVIEW_TEMPLATES[selectedRating];
    const randomReview = list[Math.floor(Math.random() * list.length)];
    setEditableReviewText(randomReview);
    setCopySuccessMessage('');
  };

  const handleCopyCustomReview = async () => {
    try {
      await navigator.clipboard.writeText(editableReviewText);
      setCopySuccessMessage('Review copied! Now tap Google Review and paste it.');
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = editableReviewText;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccessMessage('Review copied! Now tap Google Review and paste it.');
      } catch {
        setCopySuccessMessage('Review copied! Now tap Google Review and paste it.');
      }
      document.body.removeChild(textArea);
    }
    window.setTimeout(() => {
      setCopySuccessMessage('');
    }, 5000);
  };

  const getCustomOrderWhatsAppMessage = () => {
    if (selectedOrderOption === 'charcoal') {
      return `Hello Prakriti Soap! 🌿 I would like to order ${orderQuantity}x Charcoal Chandan Soap (100g). Please share price and delivery details.`;
    }
    if (selectedOrderOption === 'rose') {
      return `Hello Prakriti Soap! 🌹 I would like to order ${orderQuantity}x Rose Goat Milk Soap (100g). Please share price and delivery details.`;
    }
    return `Hello Prakriti Soap! ✨ I would like to order the Prakriti Soap Duo (${orderQuantity} bars: Charcoal Chandan Soap & Rose Goat Milk Soap). Please share price and delivery details.`;
  };

  const defaultHeroWhatsAppMessage =
    'Hello Prakriti Soap! 🌿 I visited your website and would like to order Prakriti Handcrafted Soaps (Charcoal Chandan / Rose Goat Milk). Please share details.';

  const handleFileUpload = (
    key: keyof CustomMediaOverrides,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCustomMedia((prev) => ({ ...prev, [key]: url }));
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#231F1B] flex flex-col pb-16 md:pb-0">
      {/* 1. OPENING FULL-SCREEN CINEMATIC VIDEO INTRO */}
      <OpeningVideoIntro
        isOpen={showIntroVideo}
        onExplore={() => setShowIntroVideo(false)}
        customVideoUrl={customMedia.introVideoUrl}
      />

      {/* TOP BAR CONTRACT: 3 Zones (Single-element Brand Title | 4 Nav Links | 1 Primary Action) */}
      <header className="sticky top-0 z-30 h-13 sm:h-16 bg-[#FAF6F0]/92 backdrop-blur-md border-b border-[#231F1B]/8 px-4 sm:px-8 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-xl sm:text-2xl font-semibold tracking-[0.08em] text-[#231F1B] whitespace-nowrap shrink-0"
        >
          PRAKRITI SOAP
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-[#5A5044]"
        >
          <a
            href="#products"
            className="hover:text-[#231F1B] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Our Soaps
          </a>
          <a
            href="#why-prakriti"
            className="hover:text-[#231F1B] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Why Prakriti
          </a>
          <a
            href="#google-review"
            className="hover:text-[#231F1B] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Google Review
          </a>
          <a
            href="#whatsapp-order"
            className="hover:text-[#231F1B] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            WhatsApp Order
          </a>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowIntroVideo(true)}
            className="min-h-[40px] px-3 py-1.5 text-xs font-medium text-[#4A3F33] hover:text-[#231F1B] border border-[#231F1B]/15 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            title="Replay Opening Brand Film"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Watch Film</span>
          </button>

          <a
            href={buildWhatsAppUrl(defaultHeroWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] px-4 py-2 text-xs sm:text-sm font-medium text-[#FAF6F0] bg-[#2D4432] hover:bg-[#223526] rounded-full transition-colors flex items-center justify-center whitespace-nowrap shrink-0"
          >
            Order on WhatsApp
          </a>
        </div>
      </header>

      {/* 2. MAIN PAGE — HERO SECTION */}
      <main id="top" className="flex-1">
        <section className="relative overflow-hidden pt-8 pb-16 sm:py-20 lg:py-24 px-4 sm:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Editorial Value Proposition */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Quiet unboxed metadata line (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#5C4B3B] font-medium tracking-wide mb-4">
                <span>Natural Care</span>
                <span aria-hidden="true">•</span>
                <span>Handcrafted with Love</span>
                <span aria-hidden="true">•</span>
                <span>Pure Botanicals</span>
              </div>

              <h1
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[#231F1B] leading-[1.08] tracking-tight mb-6"
                style={{ textWrap: 'balance' }}
              >
                Your Skin Deserves Something Natural.
              </h1>

              <p className="text-base sm:text-lg text-[#4E4439] leading-relaxed mb-8 max-w-xl">
                Experience small-batch artisanal soaps crafted with pure sandalwood (chandan),
                activated charcoal, farm-fresh goat milk, and sun-dried rose petals. Gentle
                everyday nourishment that leaves your skin soft, calm, and naturally radiant.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto mb-8">
                <a
                  href="#products"
                  className="min-h-[52px] px-7 py-3.5 rounded-full bg-[#2D4432] hover:bg-[#213325] text-[#FAF6F0] font-medium text-base flex items-center justify-center gap-2.5 shadow-sm transition-all active:scale-[0.99] whitespace-nowrap"
                >
                  <span>Explore Our Soaps</span>
                  <ArrowDown className="w-4 h-4" />
                </a>

                <a
                  href={buildWhatsAppUrl(defaultHeroWhatsAppMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[52px] px-7 py-3.5 rounded-full bg-[#EFE8DC] hover:bg-[#E5DCCB] text-[#231F1B] border border-[#231F1B]/12 font-medium text-base flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-[#2D4432]" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>

              {/* Clean unboxed botanical highlights */}
              <div className="pt-6 border-t border-[#231F1B]/10 w-full flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-[#5E5245]">
                <span>Net Wt. 100g (3.5 oz) per bar</span>
                <span aria-hidden="true">·</span>
                <span>Cruelty-Free</span>
                <span aria-hidden="true">·</span>
                <span>All Skin Types</span>
              </div>
            </div>

            {/* Right Column: Real Product Photos Showcase */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden bg-[#6A604F] border border-[#231F1B]/10 shadow-lg">
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-[#685F4E]">
                  <img
                    src={heroImageSrc}
                    alt="Prakriti Soap — Charcoal Chandan and Rose Goat Milk Handcrafted Bars"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                  {/* Subtle bottom gradient for caption legibility */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4 sm:p-6 flex items-end justify-between gap-4">
                    <div className="text-[#FAF6F0]">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#E6DEC8]">
                        {heroShowcaseTab === 'duo'
                          ? 'Signature Collection'
                          : heroShowcaseTab === 'charcoal'
                          ? 'Purifying Formula'
                          : 'Hydrating Formula'}
                      </p>
                      <p className="font-display text-lg sm:text-2xl font-medium">
                        {heroShowcaseTab === 'duo'
                          ? 'Charcoal Chandan & Rose Goat Milk'
                          : heroShowcaseTab === 'charcoal'
                          ? 'Prakriti Charcoal Chandan Soap'
                          : 'Prakriti Rose Goat Milk Soap'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowIntroVideo(true)}
                      className="min-h-[44px] px-4 py-2 rounded-full bg-[#FAF6F0]/95 hover:bg-white text-[#231F1B] text-xs font-medium flex items-center gap-1.5 shadow-md transition-transform active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-[#2D4432]" />
                      <span>Play Intro Video</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Segmented Photo Switcher (Allowed functional buttons per frontend-design skill) */}
                <div className="bg-[#F3ECE0] p-2.5 flex items-center justify-between gap-2 border-t border-[#231F1B]/8">
                  <div className="flex items-center gap-1.5 w-full" role="tablist" aria-label="Product photo view">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={heroShowcaseTab === 'duo'}
                      onClick={() => setHeroShowcaseTab('duo')}
                      className={`flex-1 min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap truncate ${
                        heroShowcaseTab === 'duo'
                          ? 'bg-[#231F1B] text-[#FAF6F0] shadow-xs'
                          : 'text-[#5A5044] hover:text-[#231F1B] hover:bg-[#E7DFD0]'
                      }`}
                    >
                      Both Soaps
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={heroShowcaseTab === 'charcoal'}
                      onClick={() => setHeroShowcaseTab('charcoal')}
                      className={`flex-1 min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap truncate ${
                        heroShowcaseTab === 'charcoal'
                          ? 'bg-[#231F1B] text-[#FAF6F0] shadow-xs'
                          : 'text-[#5A5044] hover:text-[#231F1B] hover:bg-[#E7DFD0]'
                      }`}
                    >
                      Charcoal Chandan
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={heroShowcaseTab === 'rose'}
                      onClick={() => setHeroShowcaseTab('rose')}
                      className={`flex-1 min-h-[42px] px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap truncate ${
                        heroShowcaseTab === 'rose'
                          ? 'bg-[#231F1B] text-[#FAF6F0] shadow-xs'
                          : 'text-[#5A5044] hover:text-[#231F1B] hover:bg-[#E7DFD0]'
                      }`}
                    >
                      Rose Goat Milk
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PRODUCTS SECTION: Charcoal Chandan Soap & Rose Goat Milk Soap */}
        <section
          id="products"
          className="py-16 sm:py-24 px-4 sm:px-8 bg-[#F4EFE6] border-y border-[#231F1B]/8"
        >
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-12 sm:mb-16">
              <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-[#5C4B3B] font-medium mb-2">
                Handcrafted Collection
              </p>
              <h2
                className="font-display text-3xl sm:text-5xl font-semibold text-[#231F1B] tracking-tight mb-4"
                style={{ textWrap: 'balance' }}
              >
                Two Signature Botanical Bars, Crafted for Daily Rituals.
              </h2>
              <p className="text-base text-[#52473B] leading-relaxed">
                Each Prakriti soap bar is poured with skin-loving botanicals and natural oils—free
                from harsh detergents and gentle enough for both face and body.
              </p>
            </div>

            {/* 2-Column Product Showcase Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              {PRODUCTS.map((product) => {
                const imgSrc =
                  product.id === 'charcoal-chandan' ? charcoalImageSrc : roseImageSrc;

                return (
                  <article
                    key={product.id}
                    className="group bg-[#FAF6F0] rounded-3xl overflow-hidden border border-[#231F1B]/10 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Product Photo Slot (4:3 aspect ratio) */}
                      <div
                        className="relative aspect-[4/3] w-full bg-[#685F4E] overflow-hidden cursor-pointer"
                        onClick={() => setLightboxProduct(product)}
                      >
                        <img
                          src={imgSrc}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                        <div className="absolute bottom-3 right-3 bg-black/45 backdrop-blur-xs text-[#FAF6F0] text-xs px-3 py-1.5 rounded-full">
                          Tap to inspect label
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 sm:p-8">
                        {/* Unboxed Clean Metadata (Zero-Pill Rule) */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B5D4D] font-medium uppercase tracking-wider mb-2">
                          <span>{product.weight}</span>
                          <span aria-hidden="true">·</span>
                          <span>{product.skinType}</span>
                          <span aria-hidden="true">·</span>
                          <span>{product.ethicalClaim}</span>
                        </div>

                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#231F1B] mb-1.5">
                          {product.name}
                        </h3>

                        <p className="text-sm font-medium text-[#2D4432] mb-4">
                          {product.subtitle}
                        </p>

                        <p className="text-sm sm:text-base text-[#4E4439] leading-relaxed mb-6">
                          {product.description}
                        </p>

                        {/* Key Benefits */}
                        <div className="border-t border-[#231F1B]/10 pt-5 mb-6">
                          <h4 className="text-xs uppercase tracking-[0.14em] text-[#6B5D4D] font-semibold mb-3">
                            Key Skin Benefits
                          </h4>
                          <ul className="space-y-2.5">
                            {product.benefits.map((benefit) => (
                              <li
                                key={benefit}
                                className="flex items-start gap-2.5 text-sm text-[#342E27]"
                              >
                                <Check className="w-4 h-4 text-[#2D4432] shrink-0 mt-0.5" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Key Ingredients (Clean unboxed typography with bullet separators) */}
                        <div className="border-t border-[#231F1B]/10 pt-4">
                          <span className="text-xs uppercase tracking-[0.14em] text-[#6B5D4D] font-semibold block mb-1.5">
                            Made With
                          </span>
                          <p className="text-xs sm:text-sm text-[#4E4439] leading-relaxed">
                            {product.ingredients.join('  •  ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Contiguous Purchase Action Footer */}
                    <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-2">
                      <a
                        href={buildWhatsAppUrl(product.whatsappMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-[#2D4432] hover:bg-[#213325] text-[#FAF6F0] font-medium text-base flex items-center justify-center gap-2.5 shadow-xs transition-all active:scale-[0.99] whitespace-nowrap"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Order This Soap</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. WHY PRAKRITI SECTION */}
        <section id="why-prakriti" className="py-16 sm:py-24 px-4 sm:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-[#5C4B3B] font-medium mb-2">
              The Prakriti Philosophy
            </p>
            <h2
              className="font-display text-3xl sm:text-5xl font-semibold text-[#231F1B] mb-4"
              style={{ textWrap: 'balance' }}
            >
              Why Prakriti Soap
            </h2>
            {/* Exact 4 pillars from prompt */}
            <p className="font-display italic text-lg sm:text-2xl text-[#4E4439]">
              Handcrafted • Naturally Inspired • Everyday Care • Made With Love
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {WHY_PRAKRITI_PILLARS.map((pillar) => (
              <div
                key={pillar.index}
                className="p-6 sm:p-7 rounded-2xl bg-[#F4EFE6] border border-[#231F1B]/8 flex flex-col justify-between"
              >
                <div>
                  <span className="font-display text-2xl font-semibold text-[#7A5C43] block mb-3 tabular-nums">
                    {pillar.index}.
                  </span>
                  <h3 className="font-display text-2xl font-semibold text-[#231F1B] mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-medium text-[#2D4432] uppercase tracking-wider mb-3">
                    {pillar.summary}
                  </p>
                  <p className="text-sm text-[#4E4439] leading-relaxed">{pillar.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. GOOGLE REVIEW SECTION */}
        <section
          id="google-review"
          className="py-16 sm:py-24 px-4 sm:px-8 bg-[#EFE8DC] border-t border-[#231F1B]/8"
        >
          <div className="max-w-3xl mx-auto bg-[#FAF6F0] rounded-3xl p-6 sm:p-12 border border-[#231F1B]/10 shadow-xs text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-[#5C4B3B] font-medium mb-2">
              Customer Appreciation
            </p>

            <h2
              className="font-display text-3xl sm:text-5xl font-semibold text-[#231F1B] mb-3"
              style={{ textWrap: 'balance' }}
            >
              Enjoyed Your Prakriti Soap?
            </h2>

            <p className="text-sm sm:text-base text-[#4E4439] max-w-xl mx-auto leading-relaxed mb-6">
              Select your rating to instantly generate a ready-made review, copy it with one tap, and share your thoughts on Google.
            </p>

            {/* 1–5 Star Selector */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleSelectRating(star)}
                  className={`min-w-[48px] min-h-[48px] px-3.5 py-2.5 rounded-xl text-lg sm:text-xl font-medium transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedRating >= star
                      ? 'bg-[#C68B2C] text-white shadow-sm'
                      : 'bg-[#EFE8DC] text-[#7A6B58] hover:bg-[#E3D9C7]'
                  }`}
                  aria-label={`${star} Star${star > 1 ? 's' : ''}`}
                >
                  <span>★</span>
                  <span className="text-xs font-semibold">{star}</span>
                </button>
              ))}
            </div>

            {/* Editable Review Box */}
            <div className="bg-[#F4EFE6] rounded-2xl p-5 sm:p-6 border border-[#231F1B]/10 text-left max-w-xl mx-auto mb-6">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-medium text-[#6B5D4D]">
                  Generated Review ({selectedRating}★ - Editable)
                </span>
                <button
                  type="button"
                  onClick={handleShuffleReview}
                  className="text-xs font-medium text-[#2D4432] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>🎲 Pick Another</span>
                </button>
              </div>

              <textarea
                value={editableReviewText}
                onChange={(e) => setEditableReviewText(e.target.value)}
                rows={3}
                className="w-full font-sans text-sm sm:text-base text-[#231F1B] bg-white/80 border border-[#231F1B]/15 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#2D4432]"
              />

              {copySuccessMessage && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-xs sm:text-sm font-semibold text-[#2D4432] flex items-center gap-2 bg-[#2D4432]/10 p-3 rounded-xl"
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{copySuccessMessage}</span>
                </div>
              )}
            </div>

            {/* Action Buttons: Copy Review + Write a Google Review */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-xl mx-auto">
              <button
                type="button"
                onClick={handleCopyCustomReview}
                className="min-h-[52px] px-6 py-3.5 rounded-2xl bg-[#EFE8DC] hover:bg-[#E3D9C7] text-[#231F1B] border border-[#231F1B]/15 font-medium text-base flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer whitespace-nowrap"
              >
                <Copy className="w-4 h-4 text-[#5C4B3B]" />
                <span>📋 Copy Review</span>
              </button>

              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[52px] px-7 py-3.5 rounded-2xl bg-[#231F1B] hover:bg-[#38322C] text-[#FAF6F0] font-medium text-base flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] whitespace-nowrap"
              >
                <span>⭐ Write a Google Review</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>
            </div>
          </div>
        </section>

        {/* 6. WHATSAPP DIRECT ORDER SECTION */}
        <section
          id="whatsapp-order"
          className="py-16 sm:py-24 px-4 sm:px-8 max-w-5xl mx-auto"
        >
          <div className="rounded-3xl bg-[#2D4432] text-[#FAF6F0] p-6 sm:p-12 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 text-left">
                <p className="text-xs uppercase tracking-[0.18em] text-[#C2D6B8] font-medium mb-2">
                  Direct Brand Concierge
                </p>
                <h2
                  className="font-display text-3xl sm:text-5xl font-semibold text-[#FAF6F0] mb-4"
                  style={{ textWrap: 'balance' }}
                >
                  Order Directly on WhatsApp
                </h2>
                <p className="text-sm sm:text-base text-[#E3ECE0] leading-relaxed mb-6 max-w-xl">
                  Have questions about skin suitability, bulk gifting, or doorstep delivery? Message
                  us directly on WhatsApp and we will assist you personally.
                </p>

                <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base text-[#FAF6F0] font-medium mb-6">
                  <span className="text-[#C2D6B8]">WhatsApp Number:</span>
                  <a
                    href={buildWhatsAppUrl(getCustomOrderWhatsAppMessage())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono tabular-nums text-lg sm:text-xl underline underline-offset-4 hover:text-[#C2D6B8] transition-colors"
                  >
                    {WHATSAPP_NUMBER_DISPLAY}
                  </a>
                </div>
              </div>

              {/* Interactive Pre-filled Order Customizer */}
              <div className="lg:col-span-5 bg-[#FAF6F0] text-[#231F1B] rounded-2xl p-5 sm:p-6">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#5C4B3B] mb-3">
                  Customize Pre-Filled Order Message
                </p>

                {/* Soap Selection Buttons */}
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderOption('both')}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-left text-xs sm:text-sm font-medium border transition-colors flex items-center justify-between cursor-pointer ${
                      selectedOrderOption === 'both'
                        ? 'bg-[#2D4432]/10 border-[#2D4432] text-[#231F1B]'
                        : 'bg-white border-[#231F1B]/12 text-[#5A5044] hover:border-[#231F1B]/30'
                    }`}
                  >
                    <span>Both Soaps (Charcoal Chandan + Rose Goat Milk)</span>
                    {selectedOrderOption === 'both' && <Check className="w-4 h-4 text-[#2D4432] shrink-0" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOrderOption('charcoal')}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-left text-xs sm:text-sm font-medium border transition-colors flex items-center justify-between cursor-pointer ${
                      selectedOrderOption === 'charcoal'
                        ? 'bg-[#2D4432]/10 border-[#2D4432] text-[#231F1B]'
                        : 'bg-white border-[#231F1B]/12 text-[#5A5044] hover:border-[#231F1B]/30'
                    }`}
                  >
                    <span>Charcoal Chandan Soap (100g)</span>
                    {selectedOrderOption === 'charcoal' && (
                      <Check className="w-4 h-4 text-[#2D4432] shrink-0" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedOrderOption('rose')}
                    className={`min-h-[44px] px-3.5 py-2 rounded-xl text-left text-xs sm:text-sm font-medium border transition-colors flex items-center justify-between cursor-pointer ${
                      selectedOrderOption === 'rose'
                        ? 'bg-[#2D4432]/10 border-[#2D4432] text-[#231F1B]'
                        : 'bg-white border-[#231F1B]/12 text-[#5A5044] hover:border-[#231F1B]/30'
                    }`}
                  >
                    <span>Rose Goat Milk Soap (100g)</span>
                    {selectedOrderOption === 'rose' && <Check className="w-4 h-4 text-[#2D4432] shrink-0" />}
                  </button>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-between mb-5 pt-2 border-t border-[#231F1B]/10">
                  <span className="text-xs font-medium text-[#5A5044]">Quantity (Bars):</span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 4, 6].map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => setOrderQuantity(qty)}
                        className={`min-w-[40px] min-h-[40px] rounded-lg text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                          orderQuantity === qty
                            ? 'bg-[#231F1B] text-[#FAF6F0]'
                            : 'bg-[#EFE8DC] text-[#231F1B] hover:bg-[#E2D8C7]'
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary WhatsApp Button */}
                <a
                  href={buildWhatsAppUrl(getCustomOrderWhatsAppMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[52px] px-6 py-3.5 rounded-2xl bg-[#2D4432] hover:bg-[#213325] text-[#FAF6F0] font-medium text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] whitespace-nowrap"
                >
                  <span>💬 Order on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FINAL CTA SECTION */}
        <section className="py-16 sm:py-20 px-4 sm:px-8 bg-[#F4EFE6] border-t border-[#231F1B]/8 text-center">
          <div className="max-w-2xl mx-auto">
            <Sparkles className="w-5 h-5 text-[#7A5C43] mx-auto mb-3" />
            <h2
              className="font-display text-3xl sm:text-5xl font-semibold text-[#231F1B] mb-3"
              style={{ textWrap: 'balance' }}
            >
              Natural care, made with love.
            </h2>
            <p className="text-sm sm:text-base text-[#52473B] mb-8">
              Experience the gentle touch of handcrafted Charcoal Chandan and Rose Goat Milk soaps.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5">
              <a
                href={GOOGLE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[52px] px-7 py-3.5 rounded-full bg-[#FAF6F0] hover:bg-white text-[#231F1B] border border-[#231F1B]/15 font-medium text-base flex items-center justify-center gap-2 transition-all active:scale-[0.99] whitespace-nowrap"
              >
                <span>⭐ Write a Google Review</span>
              </a>

              <a
                href={buildWhatsAppUrl(defaultHeroWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[52px] px-7 py-3.5 rounded-full bg-[#2D4432] hover:bg-[#213325] text-[#FAF6F0] font-medium text-base flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] whitespace-nowrap"
              >
                <span>💬 Order on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* QUIET EDITORIAL FOOTER */}
      <footer className="bg-[#231F1B] text-[#E6DEC8] py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pb-8 border-b border-white/10">
          <div>
            <p className="font-display text-2xl font-semibold tracking-[0.1em] text-[#FAF6F0] mb-1">
              PRAKRITI SOAP
            </p>
            <p className="text-xs sm:text-sm text-[#B8AC99]">
              Natural Care • Handcrafted with Love • Pure As Nature
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm text-[#D6CBB8]">
            <a href="#products" className="hover:text-white transition-colors">
              Our Soaps
            </a>
            <a href="#why-prakriti" className="hover:text-white transition-colors">
              Why Prakriti
            </a>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Google Review
            </a>
            <a
              href={buildWhatsAppUrl(defaultHeroWhatsAppMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors font-mono tabular-nums"
            >
              WhatsApp: {WHATSAPP_NUMBER_DISPLAY}
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9C907E]">
          <p>© {new Date().getFullYear()} Prakriti Soap. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowIntroVideo(true)}
              className="hover:text-[#FAF6F0] underline underline-offset-4 transition-colors cursor-pointer"
            >
              Replay Intro Video
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowMediaUploader(true)}
              className="hover:text-[#FAF6F0] underline underline-offset-4 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Upload className="w-3 h-3" />
              <span>Custom Media Files</span>
            </button>
          </div>
        </div>
      </footer>

      {/* FIXED MOBILE BOTTOM BAR: ⭐ Review | 💬 WhatsApp (Compact <= 56px to respect 15% mobile sticky cap) */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-14 bg-[#FAF6F0]/95 backdrop-blur-md border-t border-[#231F1B]/12 px-3 flex items-center gap-2.5 shadow-lg"
        role="navigation"
        aria-label="Mobile Quick Actions"
      >
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[44px] rounded-xl bg-[#EFE8DC] active:bg-[#E2D8C7] text-[#231F1B] border border-[#231F1B]/12 font-medium text-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <Star className="w-4 h-4 fill-[#C68B2C] text-[#C68B2C]" />
          <span>⭐ Review</span>
        </a>

        <a
          href={buildWhatsAppUrl(defaultHeroWhatsAppMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-h-[44px] rounded-xl bg-[#2D4432] active:bg-[#213325] text-[#FAF6F0] font-medium text-sm flex items-center justify-center gap-1.5 whitespace-nowrap"
        >
          <span>💬 WhatsApp</span>
        </a>
      </div>

      {/* PRODUCT CLOSE-UP LIGHTBOX MODAL */}
      {lightboxProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLightboxProduct(null)}
        >
          <div
            className="bg-[#FAF6F0] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#231F1B]/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full bg-[#685F4E]">
              <img
                src={
                  lightboxProduct.id === 'charcoal-chandan'
                    ? charcoalImageSrc
                    : roseImageSrc
                }
                alt={lightboxProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setLightboxProduct(null)}
                aria-label="Close preview"
                className="absolute top-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#231F1B]">
                  {lightboxProduct.name}
                </h3>
                <p className="text-xs text-[#5A5044]">
                  {lightboxProduct.ingredients.join(' • ')}
                </p>
              </div>
              <a
                href={buildWhatsAppUrl(lightboxProduct.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-[#2D4432] hover:bg-[#213325] text-[#FAF6F0] text-sm font-medium flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order This Soap</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* OPTIONAL CUSTOM MEDIA ASSETS DRAWER (Allows dropping local video/photo files for testing) */}
      {showMediaUploader && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowMediaUploader(false)}
        >
          <div
            className="bg-[#FAF6F0] text-[#231F1B] rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#231F1B]/15"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl font-semibold">Custom Media Assets</h3>
              <button
                type="button"
                onClick={() => setShowMediaUploader(false)}
                className="min-w-[40px] min-h-[40px] rounded-full hover:bg-[#EFE8DC] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#5A5044] leading-relaxed mb-4">
              The studio visuals from your Prakriti Soap video are built-in and ready for Netlify.
              You can also select local video or image files from your device to preview them live:
            </p>
            <div className="space-y-3 text-xs">
              <label className="block p-3 rounded-xl bg-[#F4EFE6] border border-[#231F1B]/10 cursor-pointer hover:border-[#2D4432]">
                <span className="font-semibold block mb-1">1. Opening Video (.mp4 / .mov / .webm)</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload('introVideoUrl', e)}
                  className="w-full text-xs"
                />
              </label>

              <label className="block p-3 rounded-xl bg-[#F4EFE6] border border-[#231F1B]/10 cursor-pointer hover:border-[#2D4432]">
                <span className="font-semibold block mb-1">2. Charcoal Chandan Soap Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('charcoalPhotoUrl', e)}
                  className="w-full text-xs"
                />
              </label>

              <label className="block p-3 rounded-xl bg-[#F4EFE6] border border-[#231F1B]/10 cursor-pointer hover:border-[#2D4432]">
                <span className="font-semibold block mb-1">3. Rose Goat Milk Soap Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('rosePhotoUrl', e)}
                  className="w-full text-xs"
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowMediaUploader(false)}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#2D4432] text-[#FAF6F0] text-xs font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
