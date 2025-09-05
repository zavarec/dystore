--
-- PostgreSQL database dump
--

\restrict 4rTZhVvwgfXDynl6ON1uatTy1zcFpLgjCMR46QXJ8dGwVfEHq75eNrEcy7OGSnH

-- Dumped from database version 15.14 (Debian 15.14-1.pgdg13+1)
-- Dumped by pg_dump version 15.14 (Debian 15.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: CategoryPromoPlacement; Type: TYPE; Schema: public; Owner: dystore
--

CREATE TYPE public."CategoryPromoPlacement" AS ENUM (
    'ABOVE_HERO',
    'BELOW_HERO',
    'ABOVE_SUBCATEGORIES',
    'BELOW_SUBCATEGORIES',
    'ABOVE_FILTERS',
    'BELOW_FILTERS',
    'ABOVE_PRODUCTS',
    'BETWEEN_PRODUCTS',
    'BELOW_PRODUCTS'
);


ALTER TYPE public."CategoryPromoPlacement" OWNER TO dystore;

--
-- Name: CategoryPromoVariant; Type: TYPE; Schema: public; Owner: dystore
--

CREATE TYPE public."CategoryPromoVariant" AS ENUM (
    'BANNER',
    'TEXT_STRIP',
    'TEXT_QUOTE',
    'GRID',
    'STRIP_USP',
    'IMAGE_PAIR',
    'HEADLINE_STRIP'
);


ALTER TYPE public."CategoryPromoVariant" OWNER TO dystore;

--
-- Name: ContentSide; Type: TYPE; Schema: public; Owner: dystore
--

CREATE TYPE public."ContentSide" AS ENUM (
    'LEFT',
    'RIGHT',
    'CENTER'
);


ALTER TYPE public."ContentSide" OWNER TO dystore;

--
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: dystore
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'PAID',
    'SHIPPED',
    'DELIVERED',
    'CONFIRMED',
    'PROCESSING',
    'CANCELLED'
);


ALTER TYPE public."OrderStatus" OWNER TO dystore;

--
-- Name: PageKey; Type: TYPE; Schema: public; Owner: dystore
--

CREATE TYPE public."PageKey" AS ENUM (
    'HOME'
);


ALTER TYPE public."PageKey" OWNER TO dystore;

--
-- Name: PromoFont; Type: TYPE; Schema: public; Owner: dystore
--

CREATE TYPE public."PromoFont" AS ENUM (
    'INTER',
    'ROBOTO',
    'MONTSERRAT',
    'POPPINS',
    'NUNITO_SANS'
);


ALTER TYPE public."PromoFont" OWNER TO dystore;

--
-- Name: PromotionSlot; Type: TYPE; Schema: public; Owner: dystore
--

CREATE TYPE public."PromotionSlot" AS ENUM (
    'HERO',
    'PRODUCT_OF_DAY',
    'FEATURED',
    'CUSTOM'
);


ALTER TYPE public."PromotionSlot" OWNER TO dystore;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: dystore
--

CREATE TYPE public."Role" AS ENUM (
    'DIRECTOR',
    'MANAGER',
    'CUSTOMER'
);


ALTER TYPE public."Role" OWNER TO dystore;

--
-- Name: SectionKey; Type: TYPE; Schema: public; Owner: dystore
--

CREATE TYPE public."SectionKey" AS ENUM (
    'PRODUCT_OF_DAY',
    'FEATURED',
    'CUSTOM',
    'HITS'
);


ALTER TYPE public."SectionKey" OWNER TO dystore;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public."Category" (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "parentId" integer,
    image text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    "isActive" boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Category" OWNER TO dystore;

--
-- Name: CategoryPromoSection; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public."CategoryPromoSection" (
    id integer NOT NULL,
    "categoryId" integer NOT NULL,
    variant public."CategoryPromoVariant" NOT NULL,
    placement public."CategoryPromoPlacement" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    title text,
    subtitle text,
    "imageUrl" text,
    "videoUrl" text,
    "ctaText" text,
    "ctaLink" text,
    font public."PromoFont" DEFAULT 'NUNITO_SANS'::public."PromoFont",
    "titleColor" text,
    "textColor" text,
    "ctaBg" text,
    "ctaColor" text,
    "startsAt" timestamp(3) without time zone,
    "endsAt" timestamp(3) without time zone,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "bgColor" text,
    "contentSide" public."ContentSide",
    "heightPx" integer
);


ALTER TABLE public."CategoryPromoSection" OWNER TO dystore;

--
-- Name: CategoryPromoSection_id_seq; Type: SEQUENCE; Schema: public; Owner: dystore
--

CREATE SEQUENCE public."CategoryPromoSection_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."CategoryPromoSection_id_seq" OWNER TO dystore;

--
-- Name: CategoryPromoSection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dystore
--

ALTER SEQUENCE public."CategoryPromoSection_id_seq" OWNED BY public."CategoryPromoSection".id;


--
-- Name: Category_id_seq; Type: SEQUENCE; Schema: public; Owner: dystore
--

CREATE SEQUENCE public."Category_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Category_id_seq" OWNER TO dystore;

--
-- Name: Category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dystore
--

ALTER SEQUENCE public."Category_id_seq" OWNED BY public."Category".id;


--
-- Name: PageSection; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public."PageSection" (
    id integer NOT NULL,
    page public."PageKey" NOT NULL,
    key public."SectionKey" NOT NULL,
    title text,
    "isEnabled" boolean DEFAULT true NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    settings jsonb,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."PageSection" OWNER TO dystore;

--
-- Name: PageSection_id_seq; Type: SEQUENCE; Schema: public; Owner: dystore
--

CREATE SEQUENCE public."PageSection_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."PageSection_id_seq" OWNER TO dystore;

--
-- Name: PageSection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dystore
--

ALTER SEQUENCE public."PageSection_id_seq" OWNED BY public."PageSection".id;


--
-- Name: Product; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public."Product" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "shortDescription" text,
    price double precision NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    "imageUrl" text,
    "categoryId" integer NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    popularity integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Product" OWNER TO dystore;

--
-- Name: Product_id_seq; Type: SEQUENCE; Schema: public; Owner: dystore
--

CREATE SEQUENCE public."Product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Product_id_seq" OWNER TO dystore;

--
-- Name: Product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dystore
--

ALTER SEQUENCE public."Product_id_seq" OWNED BY public."Product".id;


--
-- Name: Promotion; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public."Promotion" (
    id integer NOT NULL,
    slot public."PromotionSlot" NOT NULL,
    "productId" integer,
    title text,
    subtitle text,
    "ctaText" text,
    "ctaLink" text,
    "bgImageUrl" text,
    "bgVideoUrl" text,
    "isPublished" boolean DEFAULT false NOT NULL,
    "startAt" timestamp(3) without time zone NOT NULL,
    "endAt" timestamp(3) without time zone NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "ctaBg" text,
    "ctaColor" text,
    font public."PromoFont" DEFAULT 'NUNITO_SANS'::public."PromoFont",
    "textColor" text,
    "titleColor" text
);


ALTER TABLE public."Promotion" OWNER TO dystore;

--
-- Name: Promotion_id_seq; Type: SEQUENCE; Schema: public; Owner: dystore
--

CREATE SEQUENCE public."Promotion_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Promotion_id_seq" OWNER TO dystore;

--
-- Name: Promotion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dystore
--

ALTER SEQUENCE public."Promotion_id_seq" OWNED BY public."Promotion".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO dystore;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    "cartId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL
);


ALTER TABLE public.cart_items OWNER TO dystore;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: dystore
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_items_id_seq OWNER TO dystore;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dystore
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.carts OWNER TO dystore;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: dystore
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.carts_id_seq OWNER TO dystore;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dystore
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    "orderId" integer NOT NULL,
    "productId" integer NOT NULL,
    quantity integer NOT NULL,
    "priceAtPurchase" double precision NOT NULL
);


ALTER TABLE public.order_items OWNER TO dystore;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: dystore
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO dystore;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dystore
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    "userId" text NOT NULL,
    "totalPrice" double precision NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    comment text,
    "deliveryAddress" text,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO dystore;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: dystore
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO dystore;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dystore
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: dystore
--

CREATE TABLE public.users (
    id text NOT NULL,
    phone text,
    email text,
    password text,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    role public."Role" DEFAULT 'CUSTOMER'::public."Role" NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO dystore;

--
-- Name: Category id; Type: DEFAULT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Category" ALTER COLUMN id SET DEFAULT nextval('public."Category_id_seq"'::regclass);


--
-- Name: CategoryPromoSection id; Type: DEFAULT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."CategoryPromoSection" ALTER COLUMN id SET DEFAULT nextval('public."CategoryPromoSection_id_seq"'::regclass);


--
-- Name: PageSection id; Type: DEFAULT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."PageSection" ALTER COLUMN id SET DEFAULT nextval('public."PageSection_id_seq"'::regclass);


--
-- Name: Product id; Type: DEFAULT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Product" ALTER COLUMN id SET DEFAULT nextval('public."Product_id_seq"'::regclass);


--
-- Name: Promotion id; Type: DEFAULT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Promotion" ALTER COLUMN id SET DEFAULT nextval('public."Promotion_id_seq"'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public."Category" (id, name, slug, "parentId", image, "createdAt", description, "isActive", "updatedAt") FROM stdin;
1	Уход за волосами	hair-care	\N	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-hair-care-2.jpg	2025-08-31 19:29:51.805	\N	t	2025-08-31 19:29:51.805
2	Пылесосы	vacuum-cleaners	\N	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-floorcare.jpg	2025-08-31 19:29:51.805	\N	t	2025-08-31 19:29:51.805
3	Освещение	lighting	\N	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-lighting.jpg	2025-08-31 19:29:51.806	\N	t	2025-08-31 19:29:51.806
4	Наушники	headphones	\N	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-headphones-new.jpg	2025-08-31 19:29:51.806	\N	t	2025-08-31 19:29:51.806
5	Климатическая техника	climate-tech	\N	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/homepage-category-tiles-air-treatment.jpg	2025-08-31 19:29:51.805	\N	t	2025-08-31 19:29:51.805
6	Фены Dyson Supersonic	feny-dyson-supersonic	1	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/hair-care/2025/category/505d/features/WEB_505_Category_Bento_Box_Hair_Dryer.jpg	2025-08-31 19:29:51.855	\N	t	2025-08-31 19:29:51.855
7	Мультистайлеры Dyson Airwrap	multistaylery-dyson-airwrap	1	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/hair-care/2025/590/category/Web-590-Category-page-Tiles-Shop-all-hair-stylers.jpg	2025-08-31 19:29:51.861	\N	t	2025-08-31 19:29:51.861
8	Выпрямители Dyson Corrale	vypryamiteli-dyson-corrale	1	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/hair-care/708/category/Corrale-category-page-Shop-the-range-card.jpg	2025-08-31 19:29:51.861	\N	t	2025-08-31 19:29:51.861
9	Аксессуары для волос	aksessuary-dlya-volos	1	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/hair-care/308fh-708/image-carousel/708-723-308FH-category-page-Shop-the-range-card-6.jpg	2025-08-31 19:29:51.863	\N	t	2025-08-31 19:29:51.863
10	Беспроводные пылесосы	besprovodnye-pylesosy	2	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-1-cordless.jpg	2025-08-31 19:29:51.863	\N	t	2025-08-31 19:29:51.863
11	Роботы-пылесосы	roboty-pylesosy	2	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-2-robot.jpg	2025-08-31 19:29:51.865	\N	t	2025-08-31 19:29:51.865
12	Вертикальные пылесосы	vertikalnye-pylesosy	2	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-4-upright.jpg	2025-08-31 19:29:51.867	\N	t	2025-08-31 19:29:51.867
13	Моющие пылесосы	moyuschie-pylesosy	2	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-3-wet.jpg	2025-08-31 19:29:51.869	\N	t	2025-08-31 19:29:51.869
14	Аксессуары	aksessuary	2	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/new-cat-card-5-accessories.jpg	2025-08-31 19:29:51.87	\N	t	2025-08-31 19:29:51.87
15	Запчасти	zapchasti	2	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/adobetarget/plp-2024/fc-cat-tiles/Range-cards-Parts.jpg	2025-08-31 19:29:51.871	\N	t	2025-08-31 19:29:51.871
16	Настольные лампы	nastolnye-lampy	3	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/lighting/category/creative-lighting/CD06_BLKBS-008_qq-RGB_3QRight-Perspective_LightOn-A4_REFW.jpg	2025-08-31 19:29:51.871	\N	t	2025-08-31 19:29:51.871
17	Напольные лампы	napolnye-lampy	3	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/lighting/category/creative-lighting/CF06-BLKBS_008-qq_RGB-3QRight_Orthographic-LightOn_A4-REFW.jpg	2025-08-31 19:29:51.872	\N	t	2025-08-31 19:29:51.872
18	Наушники с ANC	naushniki-s-anc	4	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/571H_Nav_Image_Aluminium.jpg	2025-08-31 19:29:51.873	\N	t	2025-08-31 19:29:51.873
19	Премиум-наушники	premium-naushniki	4	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/home-page/571H_Nav_Image_Copper.jpg	2025-08-31 19:29:51.874	\N	t	2025-08-31 19:29:51.874
20	Очистители воздуха	ochistiteli-vozduha	5	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/direct-new-journey/category/environmental-care/ec-cat-page-card-1-purifiers.jpg	2025-08-31 19:29:51.874	\N	t	2025-08-31 19:29:51.874
21	Очистители-увлажнители	ochistiteli-uvlazhniteli	5	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/air-treatment/dec-2024/category-page/us-bp04-cat-card.png	2025-08-31 19:29:51.875	\N	t	2025-08-31 19:29:51.875
22	Вентиляторы и обогреватели	ventilyatory-i-obogrevateli	5	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/air-treatment/dec-2024/category-page/categoryCard_FansAndHeaters.jpg	2025-08-31 19:29:51.876	\N	t	2025-08-31 19:29:51.876
\.


--
-- Data for Name: CategoryPromoSection; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public."CategoryPromoSection" (id, "categoryId", variant, placement, "order", "isActive", title, subtitle, "imageUrl", "videoUrl", "ctaText", "ctaLink", font, "titleColor", "textColor", "ctaBg", "ctaColor", "startsAt", "endsAt", "createdById", "createdAt", "updatedAt", "bgColor", "contentSide", "heightPx") FROM stdin;
\.


--
-- Data for Name: PageSection; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public."PageSection" (id, page, key, title, "isEnabled", "position", settings, "createdById", "createdAt", "updatedAt") FROM stdin;
1	HOME	PRODUCT_OF_DAY	Товар дня	t	0	\N	29ec014d-19dd-471c-adfc-e8b11bacf5dc	2025-08-31 19:29:52.158	2025-08-31 19:29:52.158
2	HOME	FEATURED	Избранное	t	1	\N	29ec014d-19dd-471c-adfc-e8b11bacf5dc	2025-08-31 19:29:52.158	2025-08-31 19:29:52.158
3	HOME	HITS	Хиты	t	2	\N	29ec014d-19dd-471c-adfc-e8b11bacf5dc	2025-08-31 19:29:52.158	2025-08-31 19:29:52.158
4	HOME	CUSTOM	Спецпредложения	t	3	\N	29ec014d-19dd-471c-adfc-e8b11bacf5dc	2025-08-31 19:29:52.158	2025-08-31 19:29:52.158
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public."Product" (id, name, description, "shortDescription", price, stock, "imageUrl", "categoryId", "isFeatured", popularity, "createdAt", "isActive", "updatedAt") FROM stdin;
1	Фены Dyson Supersonic Model 4	Описание Фены Dyson Supersonic — уникальная модель 4 с особыми функциями.	Фены Dyson Supersonic кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	f	550	2025-08-31 19:29:51.877	t	2025-08-31 19:29:51.877
9	Фены Dyson Supersonic Model 4 Copy	Описание Фены Dyson Supersonic — уникальная модель 4 с особыми функциями.	Фены Dyson Supersonic кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	f	550	2025-08-31 19:29:51.895	t	2025-08-31 19:29:51.895
14	Мультистайлеры Dyson Airwrap Model 3	Описание Мультистайлеры Dyson Airwrap — уникальная модель 3 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	t	400	2025-08-31 19:29:51.902	t	2025-08-31 19:29:51.902
16	Мультистайлеры Dyson Airwrap Model 3 Copy	Описание Мультистайлеры Dyson Airwrap — уникальная модель 3 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	t	400	2025-08-31 19:29:51.911	t	2025-08-31 19:29:51.911
23	Выпрямители Dyson Corrale Model 5	Описание Выпрямители Dyson Corrale — уникальная модель 5 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	t	700	2025-08-31 19:29:51.916	t	2025-08-31 19:29:51.916
26	Выпрямители Dyson Corrale Model 5 Copy	Описание Выпрямители Dyson Corrale — уникальная модель 5 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	t	700	2025-08-31 19:29:51.92	t	2025-08-31 19:29:51.92
35	Аксессуары для волос Model 4	Описание Аксессуары для волос — уникальная модель 4 с особыми функциями.	Аксессуары для волос кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	f	550	2025-08-31 19:29:51.925	t	2025-08-31 19:29:51.925
37	Аксессуары для волос Model 1 Copy	Описание Аксессуары для волос — уникальная модель 1 с особыми функциями.	Аксессуары для волос кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	t	100	2025-08-31 19:29:51.927	t	2025-08-31 19:29:51.927
44	Беспроводные пылесосы Model 2	Описание Беспроводные пылесосы — уникальная модель 2 с особыми функциями.	Беспроводные пылесосы кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	f	250	2025-08-31 19:29:51.931	t	2025-08-31 19:29:51.931
47	Беспроводные пылесосы Model 2 Copy	Описание Беспроводные пылесосы — уникальная модель 2 с особыми функциями.	Беспроводные пылесосы кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	f	250	2025-08-31 19:29:51.934	t	2025-08-31 19:29:51.934
53	Роботы-пылесосы Model 3	Описание Роботы-пылесосы — уникальная модель 3 с особыми функциями.	Роботы-пылесосы кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	t	400	2025-08-31 19:29:51.937	t	2025-08-31 19:29:51.937
56	Роботы-пылесосы Model 2 Copy	Описание Роботы-пылесосы — уникальная модель 2 с особыми функциями.	Роботы-пылесосы кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	f	250	2025-08-31 19:29:51.94	t	2025-08-31 19:29:51.94
64	Вертикальные пылесосы Model 4	Описание Вертикальные пылесосы — уникальная модель 4 с особыми функциями.	Вертикальные пылесосы кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	f	550	2025-08-31 19:29:51.943	t	2025-08-31 19:29:51.943
68	Вертикальные пылесосы Model 1 Copy	Описание Вертикальные пылесосы — уникальная модель 1 с особыми функциями.	Вертикальные пылесосы кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	t	100	2025-08-31 19:29:51.945	t	2025-08-31 19:29:51.945
73	Моющие пылесосы Model 4	Описание Моющие пылесосы — уникальная модель 4 с особыми функциями.	Моющие пылесосы кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	f	550	2025-08-31 19:29:51.949	t	2025-08-31 19:29:51.949
79	Моющие пылесосы Model 1 Copy	Описание Моющие пылесосы — уникальная модель 1 с особыми функциями.	Моющие пылесосы кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	t	100	2025-08-31 19:29:51.952	t	2025-08-31 19:29:51.952
5	Фены Dyson Supersonic Model 5	Описание Фены Dyson Supersonic — уникальная модель 5 с особыми функциями.	Фены Dyson Supersonic кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	t	700	2025-08-31 19:29:51.879	t	2025-08-31 19:29:51.879
8	Фены Dyson Supersonic Model 5 Copy	Описание Фены Dyson Supersonic — уникальная модель 5 с особыми функциями.	Фены Dyson Supersonic кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	t	700	2025-08-31 19:29:51.895	t	2025-08-31 19:29:51.895
13	Мультистайлеры Dyson Airwrap Model 5	Описание Мультистайлеры Dyson Airwrap — уникальная модель 5 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	t	700	2025-08-31 19:29:51.902	t	2025-08-31 19:29:51.902
19	Мультистайлеры Dyson Airwrap Model 1 Copy	Описание Мультистайлеры Dyson Airwrap — уникальная модель 1 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	t	100	2025-08-31 19:29:51.91	t	2025-08-31 19:29:51.91
21	Выпрямители Dyson Corrale Model 1	Описание Выпрямители Dyson Corrale — уникальная модель 1 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	t	100	2025-08-31 19:29:51.915	t	2025-08-31 19:29:51.915
27	Выпрямители Dyson Corrale Model 4 Copy	Описание Выпрямители Dyson Corrale — уникальная модель 4 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	f	550	2025-08-31 19:29:51.92	t	2025-08-31 19:29:51.92
33	Аксессуары для волос Model 5	Описание Аксессуары для волос — уникальная модель 5 с особыми функциями.	Аксессуары для волос кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	t	700	2025-08-31 19:29:51.925	t	2025-08-31 19:29:51.925
39	Аксессуары для волос Model 4 Copy	Описание Аксессуары для волос — уникальная модель 4 с особыми функциями.	Аксессуары для волос кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	f	550	2025-08-31 19:29:51.928	t	2025-08-31 19:29:51.928
42	Беспроводные пылесосы Model 1	Описание Беспроводные пылесосы — уникальная модель 1 с особыми функциями.	Беспроводные пылесосы кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	t	100	2025-08-31 19:29:51.931	t	2025-08-31 19:29:51.931
50	Беспроводные пылесосы Model 4 Copy	Описание Беспроводные пылесосы — уникальная модель 4 с особыми функциями.	Беспроводные пылесосы кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	f	550	2025-08-31 19:29:51.934	t	2025-08-31 19:29:51.934
51	Роботы-пылесосы Model 1	Описание Роботы-пылесосы — уникальная модель 1 с особыми функциями.	Роботы-пылесосы кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	t	100	2025-08-31 19:29:51.937	t	2025-08-31 19:29:51.937
59	Роботы-пылесосы Model 5 Copy	Описание Роботы-пылесосы — уникальная модель 5 с особыми функциями.	Роботы-пылесосы кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	t	700	2025-08-31 19:29:51.94	t	2025-08-31 19:29:51.94
62	Вертикальные пылесосы Model 3	Описание Вертикальные пылесосы — уникальная модель 3 с особыми функциями.	Вертикальные пылесосы кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	t	400	2025-08-31 19:29:51.942	t	2025-08-31 19:29:51.942
66	Вертикальные пылесосы Model 3 Copy	Описание Вертикальные пылесосы — уникальная модель 3 с особыми функциями.	Вертикальные пылесосы кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	t	400	2025-08-31 19:29:51.945	t	2025-08-31 19:29:51.945
75	Моющие пылесосы Model 5	Описание Моющие пылесосы — уникальная модель 5 с особыми функциями.	Моющие пылесосы кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	t	700	2025-08-31 19:29:51.949	t	2025-08-31 19:29:51.949
77	Моющие пылесосы Model 2 Copy	Описание Моющие пылесосы — уникальная модель 2 с особыми функциями.	Моющие пылесосы кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	f	250	2025-08-31 19:29:51.951	t	2025-08-31 19:29:51.951
2	Фены Dyson Supersonic Model 1	Описание Фены Dyson Supersonic — уникальная модель 1 с особыми функциями.	Фены Dyson Supersonic кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	t	100	2025-08-31 19:29:51.877	t	2025-08-31 19:29:51.877
6	Фены Dyson Supersonic Model 3 Copy	Описание Фены Dyson Supersonic — уникальная модель 3 с особыми функциями.	Фены Dyson Supersonic кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	t	400	2025-08-31 19:29:51.895	t	2025-08-31 19:29:51.895
12	Мультистайлеры Dyson Airwrap Model 2	Описание Мультистайлеры Dyson Airwrap — уникальная модель 2 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	f	250	2025-08-31 19:29:51.901	t	2025-08-31 19:29:51.901
17	Мультистайлеры Dyson Airwrap Model 4 Copy	Описание Мультистайлеры Dyson Airwrap — уникальная модель 4 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	f	550	2025-08-31 19:29:51.912	t	2025-08-31 19:29:51.912
22	Выпрямители Dyson Corrale Model 3	Описание Выпрямители Dyson Corrale — уникальная модель 3 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	t	400	2025-08-31 19:29:51.916	t	2025-08-31 19:29:51.916
28	Выпрямители Dyson Corrale Model 2 Copy	Описание Выпрямители Dyson Corrale — уникальная модель 2 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	f	250	2025-08-31 19:29:51.92	t	2025-08-31 19:29:51.92
31	Аксессуары для волос Model 3	Описание Аксессуары для волос — уникальная модель 3 с особыми функциями.	Аксессуары для волос кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	t	400	2025-08-31 19:29:51.924	t	2025-08-31 19:29:51.924
40	Аксессуары для волос Model 5 Copy	Описание Аксессуары для волос — уникальная модель 5 с особыми функциями.	Аксессуары для волос кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	t	700	2025-08-31 19:29:51.928	t	2025-08-31 19:29:51.928
41	Беспроводные пылесосы Model 5	Описание Беспроводные пылесосы — уникальная модель 5 с особыми функциями.	Беспроводные пылесосы кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	t	700	2025-08-31 19:29:51.931	t	2025-08-31 19:29:51.931
49	Беспроводные пылесосы Model 3 Copy	Описание Беспроводные пылесосы — уникальная модель 3 с особыми функциями.	Беспроводные пылесосы кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	t	400	2025-08-31 19:29:51.934	t	2025-08-31 19:29:51.934
54	Роботы-пылесосы Model 4	Описание Роботы-пылесосы — уникальная модель 4 с особыми функциями.	Роботы-пылесосы кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	f	550	2025-08-31 19:29:51.937	t	2025-08-31 19:29:51.937
58	Роботы-пылесосы Model 4 Copy	Описание Роботы-пылесосы — уникальная модель 4 с особыми функциями.	Роботы-пылесосы кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	f	550	2025-08-31 19:29:51.94	t	2025-08-31 19:29:51.94
61	Вертикальные пылесосы Model 1	Описание Вертикальные пылесосы — уникальная модель 1 с особыми функциями.	Вертикальные пылесосы кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	t	100	2025-08-31 19:29:51.942	t	2025-08-31 19:29:51.942
70	Вертикальные пылесосы Model 4 Copy	Описание Вертикальные пылесосы — уникальная модель 4 с особыми функциями.	Вертикальные пылесосы кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	f	550	2025-08-31 19:29:51.945	t	2025-08-31 19:29:51.945
72	Моющие пылесосы Model 3	Описание Моющие пылесосы — уникальная модель 3 с особыми функциями.	Моющие пылесосы кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	t	400	2025-08-31 19:29:51.948	t	2025-08-31 19:29:51.948
78	Моющие пылесосы Model 4 Copy	Описание Моющие пылесосы — уникальная модель 4 с особыми функциями.	Моющие пылесосы кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	f	550	2025-08-31 19:29:51.951	t	2025-08-31 19:29:51.951
3	Фены Dyson Supersonic Model 2	Описание Фены Dyson Supersonic — уникальная модель 2 с особыми функциями.	Фены Dyson Supersonic кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	f	250	2025-08-31 19:29:51.877	t	2025-08-31 19:29:51.877
7	Фены Dyson Supersonic Model 1 Copy	Описание Фены Dyson Supersonic — уникальная модель 1 с особыми функциями.	Фены Dyson Supersonic кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	t	100	2025-08-31 19:29:51.895	t	2025-08-31 19:29:51.895
15	Мультистайлеры Dyson Airwrap Model 1	Описание Мультистайлеры Dyson Airwrap — уникальная модель 1 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	t	100	2025-08-31 19:29:51.902	t	2025-08-31 19:29:51.902
18	Мультистайлеры Dyson Airwrap Model 2 Copy	Описание Мультистайлеры Dyson Airwrap — уникальная модель 2 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	f	250	2025-08-31 19:29:51.91	t	2025-08-31 19:29:51.91
24	Выпрямители Dyson Corrale Model 2	Описание Выпрямители Dyson Corrale — уникальная модель 2 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	f	250	2025-08-31 19:29:51.916	t	2025-08-31 19:29:51.916
29	Выпрямители Dyson Corrale Model 3 Copy	Описание Выпрямители Dyson Corrale — уникальная модель 3 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	t	400	2025-08-31 19:29:51.92	t	2025-08-31 19:29:51.92
32	Аксессуары для волос Model 1	Описание Аксессуары для волос — уникальная модель 1 с особыми функциями.	Аксессуары для волос кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	t	100	2025-08-31 19:29:51.924	t	2025-08-31 19:29:51.924
36	Аксессуары для волос Model 2 Copy	Описание Аксессуары для волос — уникальная модель 2 с особыми функциями.	Аксессуары для волос кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	f	250	2025-08-31 19:29:51.927	t	2025-08-31 19:29:51.927
43	Беспроводные пылесосы Model 3	Описание Беспроводные пылесосы — уникальная модель 3 с особыми функциями.	Беспроводные пылесосы кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	t	400	2025-08-31 19:29:51.931	t	2025-08-31 19:29:51.931
48	Беспроводные пылесосы Model 1 Copy	Описание Беспроводные пылесосы — уникальная модель 1 с особыми функциями.	Беспроводные пылесосы кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	t	100	2025-08-31 19:29:51.934	t	2025-08-31 19:29:51.934
52	Роботы-пылесосы Model 2	Описание Роботы-пылесосы — уникальная модель 2 с особыми функциями.	Роботы-пылесосы кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	f	250	2025-08-31 19:29:51.937	t	2025-08-31 19:29:51.937
57	Роботы-пылесосы Model 3 Copy	Описание Роботы-пылесосы — уникальная модель 3 с особыми функциями.	Роботы-пылесосы кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	t	400	2025-08-31 19:29:51.94	t	2025-08-31 19:29:51.94
63	Вертикальные пылесосы Model 2	Описание Вертикальные пылесосы — уникальная модель 2 с особыми функциями.	Вертикальные пылесосы кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	f	250	2025-08-31 19:29:51.942	t	2025-08-31 19:29:51.942
69	Вертикальные пылесосы Model 5 Copy	Описание Вертикальные пылесосы — уникальная модель 5 с особыми функциями.	Вертикальные пылесосы кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	t	700	2025-08-31 19:29:51.945	t	2025-08-31 19:29:51.945
74	Моющие пылесосы Model 1	Описание Моющие пылесосы — уникальная модель 1 с особыми функциями.	Моющие пылесосы кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	t	100	2025-08-31 19:29:51.948	t	2025-08-31 19:29:51.948
76	Моющие пылесосы Model 3 Copy	Описание Моющие пылесосы — уникальная модель 3 с особыми функциями.	Моющие пылесосы кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	t	400	2025-08-31 19:29:51.951	t	2025-08-31 19:29:51.951
81	Аксессуары Model 3	Описание Аксессуары — уникальная модель 3 с особыми функциями.	Аксессуары кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	t	400	2025-08-31 19:29:51.954	t	2025-08-31 19:29:51.954
87	Аксессуары Model 5 Copy	Описание Аксессуары — уникальная модель 5 с особыми функциями.	Аксессуары кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	t	700	2025-08-31 19:29:51.957	t	2025-08-31 19:29:51.957
92	Запчасти Model 3	Описание Запчасти — уникальная модель 3 с особыми функциями.	Запчасти кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	t	400	2025-08-31 19:29:51.96	t	2025-08-31 19:29:51.96
97	Запчасти Model 3 Copy	Описание Запчасти — уникальная модель 3 с особыми функциями.	Запчасти кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	t	400	2025-08-31 19:29:51.964	t	2025-08-31 19:29:51.964
102	Настольные лампы Model 4	Описание Настольные лампы — уникальная модель 4 с особыми функциями.	Настольные лампы кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	f	550	2025-08-31 19:29:51.967	t	2025-08-31 19:29:51.967
106	Настольные лампы Model 2 Copy	Описание Настольные лампы — уникальная модель 2 с особыми функциями.	Настольные лампы кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	f	250	2025-08-31 19:29:51.972	t	2025-08-31 19:29:51.972
114	Напольные лампы Model 2	Описание Напольные лампы — уникальная модель 2 с особыми функциями.	Напольные лампы кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	f	250	2025-08-31 19:29:51.976	t	2025-08-31 19:29:51.976
117	Напольные лампы Model 1 Copy	Описание Напольные лампы — уникальная модель 1 с особыми функциями.	Напольные лампы кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	t	100	2025-08-31 19:29:51.98	t	2025-08-31 19:29:51.98
122	Наушники с ANC Model 2	Описание Наушники с ANC — уникальная модель 2 с особыми функциями.	Наушники с ANC кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	f	250	2025-08-31 19:29:51.983	t	2025-08-31 19:29:51.983
130	Наушники с ANC Model 5 Copy	Описание Наушники с ANC — уникальная модель 5 с особыми функциями.	Наушники с ANC кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	t	700	2025-08-31 19:29:51.986	t	2025-08-31 19:29:51.986
132	Премиум-наушники Model 2	Описание Премиум-наушники — уникальная модель 2 с особыми функциями.	Премиум-наушники кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	f	250	2025-08-31 19:29:51.99	t	2025-08-31 19:29:51.99
139	Премиум-наушники Model 2 Copy	Описание Премиум-наушники — уникальная модель 2 с особыми функциями.	Премиум-наушники кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	f	250	2025-08-31 19:29:51.997	t	2025-08-31 19:29:51.997
142	Очистители воздуха Model 2	Описание Очистители воздуха — уникальная модель 2 с особыми функциями.	Очистители воздуха кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	f	250	2025-08-31 19:29:52.001	t	2025-08-31 19:29:52.001
147	Очистители воздуха Model 2 Copy	Описание Очистители воздуха — уникальная модель 2 с особыми функциями.	Очистители воздуха кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	f	250	2025-08-31 19:29:52.004	t	2025-08-31 19:29:52.004
153	Очистители-увлажнители Model 4	Описание Очистители-увлажнители — уникальная модель 4 с особыми функциями.	Очистители-увлажнители кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	f	550	2025-08-31 19:29:52.007	t	2025-08-31 19:29:52.007
156	Очистители-увлажнители Model 1 Copy	Описание Очистители-увлажнители — уникальная модель 1 с особыми функциями.	Очистители-увлажнители кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	t	100	2025-08-31 19:29:52.01	t	2025-08-31 19:29:52.01
165	Вентиляторы и обогреватели Model 5	Описание Вентиляторы и обогреватели — уникальная модель 5 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	t	700	2025-08-31 19:29:52.014	t	2025-08-31 19:29:52.014
82	Аксессуары Model 1	Описание Аксессуары — уникальная модель 1 с особыми функциями.	Аксессуары кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	t	100	2025-08-31 19:29:51.954	t	2025-08-31 19:29:51.954
88	Аксессуары Model 3 Copy	Описание Аксессуары — уникальная модель 3 с особыми функциями.	Аксессуары кратко: модель 3	33990	12	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	t	400	2025-08-31 19:29:51.957	t	2025-08-31 19:29:51.957
91	Запчасти Model 2	Описание Запчасти — уникальная модель 2 с особыми функциями.	Запчасти кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	f	250	2025-08-31 19:29:51.96	t	2025-08-31 19:29:51.96
99	Запчасти Model 5 Copy	Описание Запчасти — уникальная модель 5 с особыми функциями.	Запчасти кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	t	700	2025-08-31 19:29:51.964	t	2025-08-31 19:29:51.964
101	Настольные лампы Model 2	Описание Настольные лампы — уникальная модель 2 с особыми функциями.	Настольные лампы кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	f	250	2025-08-31 19:29:51.967	t	2025-08-31 19:29:51.967
109	Настольные лампы Model 5 Copy	Описание Настольные лампы — уникальная модель 5 с особыми функциями.	Настольные лампы кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	t	700	2025-08-31 19:29:51.972	t	2025-08-31 19:29:51.972
112	Напольные лампы Model 4	Описание Напольные лампы — уникальная модель 4 с особыми функциями.	Напольные лампы кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	f	550	2025-08-31 19:29:51.976	t	2025-08-31 19:29:51.976
116	Напольные лампы Model 5 Copy	Описание Напольные лампы — уникальная модель 5 с особыми функциями.	Напольные лампы кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	t	700	2025-08-31 19:29:51.98	t	2025-08-31 19:29:51.98
124	Наушники с ANC Model 5	Описание Наушники с ANC — уникальная модель 5 с особыми функциями.	Наушники с ANC кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	t	700	2025-08-31 19:29:51.983	t	2025-08-31 19:29:51.983
126	Наушники с ANC Model 3 Copy	Описание Наушники с ANC — уникальная модель 3 с особыми функциями.	Наушники с ANC кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	t	400	2025-08-31 19:29:51.986	t	2025-08-31 19:29:51.986
133	Премиум-наушники Model 5	Описание Премиум-наушники — уникальная модель 5 с особыми функциями.	Премиум-наушники кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	t	700	2025-08-31 19:29:51.991	t	2025-08-31 19:29:51.991
136	Премиум-наушники Model 4 Copy	Описание Премиум-наушники — уникальная модель 4 с особыми функциями.	Премиум-наушники кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	f	550	2025-08-31 19:29:51.997	t	2025-08-31 19:29:51.997
144	Очистители воздуха Model 5	Описание Очистители воздуха — уникальная модель 5 с особыми функциями.	Очистители воздуха кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	t	700	2025-08-31 19:29:52.001	t	2025-08-31 19:29:52.001
146	Очистители воздуха Model 1 Copy	Описание Очистители воздуха — уникальная модель 1 с особыми функциями.	Очистители воздуха кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	t	100	2025-08-31 19:29:52.004	t	2025-08-31 19:29:52.004
155	Очистители-увлажнители Model 5	Описание Очистители-увлажнители — уникальная модель 5 с особыми функциями.	Очистители-увлажнители кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	t	700	2025-08-31 19:29:52.007	t	2025-08-31 19:29:52.007
158	Очистители-увлажнители Model 3 Copy	Описание Очистители-увлажнители — уникальная модель 3 с особыми функциями.	Очистители-увлажнители кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	t	400	2025-08-31 19:29:52.01	t	2025-08-31 19:29:52.01
162	Вентиляторы и обогреватели Model 3	Описание Вентиляторы и обогреватели — уникальная модель 3 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	t	400	2025-08-31 19:29:52.014	t	2025-08-31 19:29:52.014
84	Аксессуары Model 2	Описание Аксессуары — уникальная модель 2 с особыми функциями.	Аксессуары кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	f	250	2025-08-31 19:29:51.954	t	2025-08-31 19:29:51.954
86	Аксессуары Model 4 Copy	Описание Аксессуары — уникальная модель 4 с особыми функциями.	Аксессуары кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	f	550	2025-08-31 19:29:51.957	t	2025-08-31 19:29:51.957
95	Запчасти Model 5	Описание Запчасти — уникальная модель 5 с особыми функциями.	Запчасти кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	t	700	2025-08-31 19:29:51.961	t	2025-08-31 19:29:51.961
96	Запчасти Model 1 Copy	Описание Запчасти — уникальная модель 1 с особыми функциями.	Запчасти кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	t	100	2025-08-31 19:29:51.963	t	2025-08-31 19:29:51.963
103	Настольные лампы Model 5	Описание Настольные лампы — уникальная модель 5 с особыми функциями.	Настольные лампы кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	t	700	2025-08-31 19:29:51.968	t	2025-08-31 19:29:51.968
110	Настольные лампы Model 4 Copy	Описание Настольные лампы — уникальная модель 4 с особыми функциями.	Настольные лампы кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	f	550	2025-08-31 19:29:51.972	t	2025-08-31 19:29:51.972
111	Напольные лампы Model 3	Описание Напольные лампы — уникальная модель 3 с особыми функциями.	Напольные лампы кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	t	400	2025-08-31 19:29:51.976	t	2025-08-31 19:29:51.976
119	Напольные лампы Model 3 Copy	Описание Напольные лампы — уникальная модель 3 с особыми функциями.	Напольные лампы кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	t	400	2025-08-31 19:29:51.98	t	2025-08-31 19:29:51.98
125	Наушники с ANC Model 4	Описание Наушники с ANC — уникальная модель 4 с особыми функциями.	Наушники с ANC кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	f	550	2025-08-31 19:29:51.983	t	2025-08-31 19:29:51.983
128	Наушники с ANC Model 4 Copy	Описание Наушники с ANC — уникальная модель 4 с особыми функциями.	Наушники с ANC кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	f	550	2025-08-31 19:29:51.986	t	2025-08-31 19:29:51.986
131	Премиум-наушники Model 1	Описание Премиум-наушники — уникальная модель 1 с особыми функциями.	Премиум-наушники кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	t	100	2025-08-31 19:29:51.989	t	2025-08-31 19:29:51.989
140	Премиум-наушники Model 5 Copy	Описание Премиум-наушники — уникальная модель 5 с особыми функциями.	Премиум-наушники кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	t	700	2025-08-31 19:29:51.997	t	2025-08-31 19:29:51.997
141	Очистители воздуха Model 1	Описание Очистители воздуха — уникальная модель 1 с особыми функциями.	Очистители воздуха кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	t	100	2025-08-31 19:29:52.001	t	2025-08-31 19:29:52.001
150	Очистители воздуха Model 5 Copy	Описание Очистители воздуха — уникальная модель 5 с особыми функциями.	Очистители воздуха кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	t	700	2025-08-31 19:29:52.005	t	2025-08-31 19:29:52.005
151	Очистители-увлажнители Model 1	Описание Очистители-увлажнители — уникальная модель 1 с особыми функциями.	Очистители-увлажнители кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	t	100	2025-08-31 19:29:52.007	t	2025-08-31 19:29:52.007
160	Очистители-увлажнители Model 5 Copy	Описание Очистители-увлажнители — уникальная модель 5 с особыми функциями.	Очистители-увлажнители кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	t	700	2025-08-31 19:29:52.01	t	2025-08-31 19:29:52.01
161	Вентиляторы и обогреватели Model 1	Описание Вентиляторы и обогреватели — уникальная модель 1 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	t	100	2025-08-31 19:29:52.013	t	2025-08-31 19:29:52.013
83	Аксессуары Model 5	Описание Аксессуары — уникальная модель 5 с особыми функциями.	Аксессуары кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	t	700	2025-08-31 19:29:51.954	t	2025-08-31 19:29:51.954
89	Аксессуары Model 2 Copy	Описание Аксессуары — уникальная модель 2 с особыми функциями.	Аксессуары кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	f	250	2025-08-31 19:29:51.957	t	2025-08-31 19:29:51.957
93	Запчасти Model 4	Описание Запчасти — уникальная модель 4 с особыми функциями.	Запчасти кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	f	550	2025-08-31 19:29:51.961	t	2025-08-31 19:29:51.961
98	Запчасти Model 2 Copy	Описание Запчасти — уникальная модель 2 с особыми функциями.	Запчасти кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	f	250	2025-08-31 19:29:51.963	t	2025-08-31 19:29:51.963
105	Настольные лампы Model 3	Описание Настольные лампы — уникальная модель 3 с особыми функциями.	Настольные лампы кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	t	400	2025-08-31 19:29:51.967	t	2025-08-31 19:29:51.967
108	Настольные лампы Model 1 Copy	Описание Настольные лампы — уникальная модель 1 с особыми функциями.	Настольные лампы кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	t	100	2025-08-31 19:29:51.972	t	2025-08-31 19:29:51.972
115	Напольные лампы Model 1	Описание Напольные лампы — уникальная модель 1 с особыми функциями.	Напольные лампы кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	t	100	2025-08-31 19:29:51.976	t	2025-08-31 19:29:51.976
118	Напольные лампы Model 2 Copy	Описание Напольные лампы — уникальная модель 2 с особыми функциями.	Напольные лампы кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	f	250	2025-08-31 19:29:51.98	t	2025-08-31 19:29:51.98
121	Наушники с ANC Model 1	Описание Наушники с ANC — уникальная модель 1 с особыми функциями.	Наушники с ANC кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	t	100	2025-08-31 19:29:51.983	t	2025-08-31 19:29:51.983
129	Наушники с ANC Model 2 Copy	Описание Наушники с ANC — уникальная модель 2 с особыми функциями.	Наушники с ANC кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	f	250	2025-08-31 19:29:51.986	t	2025-08-31 19:29:51.986
135	Премиум-наушники Model 3	Описание Премиум-наушники — уникальная модель 3 с особыми функциями.	Премиум-наушники кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	t	400	2025-08-31 19:29:51.99	t	2025-08-31 19:29:51.99
137	Премиум-наушники Model 1 Copy	Описание Премиум-наушники — уникальная модель 1 с особыми функциями.	Премиум-наушники кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	t	100	2025-08-31 19:29:51.997	t	2025-08-31 19:29:51.997
143	Очистители воздуха Model 3	Описание Очистители воздуха — уникальная модель 3 с особыми функциями.	Очистители воздуха кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	t	400	2025-08-31 19:29:52.001	t	2025-08-31 19:29:52.001
149	Очистители воздуха Model 4 Copy	Описание Очистители воздуха — уникальная модель 4 с особыми функциями.	Очистители воздуха кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	f	550	2025-08-31 19:29:52.005	t	2025-08-31 19:29:52.005
152	Очистители-увлажнители Model 2	Описание Очистители-увлажнители — уникальная модель 2 с особыми функциями.	Очистители-увлажнители кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	f	250	2025-08-31 19:29:52.007	t	2025-08-31 19:29:52.007
159	Очистители-увлажнители Model 4 Copy	Описание Очистители-увлажнители — уникальная модель 4 с особыми функциями.	Очистители-увлажнители кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	f	550	2025-08-31 19:29:52.01	t	2025-08-31 19:29:52.01
164	Вентиляторы и обогреватели Model 2	Описание Вентиляторы и обогреватели — уникальная модель 2 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	f	250	2025-08-31 19:29:52.013	t	2025-08-31 19:29:52.013
85	Аксессуары Model 4	Описание Аксессуары — уникальная модель 4 с особыми функциями.	Аксессуары кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	f	550	2025-08-31 19:29:51.954	t	2025-08-31 19:29:51.954
90	Аксессуары Model 1 Copy	Описание Аксессуары — уникальная модель 1 с особыми функциями.	Аксессуары кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	14	t	100	2025-08-31 19:29:51.957	t	2025-08-31 19:29:51.957
94	Запчасти Model 1	Описание Запчасти — уникальная модель 1 с особыми функциями.	Запчасти кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	t	100	2025-08-31 19:29:51.96	t	2025-08-31 19:29:51.96
100	Запчасти Model 4 Copy	Описание Запчасти — уникальная модель 4 с особыми функциями.	Запчасти кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	15	f	550	2025-08-31 19:29:51.964	t	2025-08-31 19:29:51.964
104	Настольные лампы Model 1	Описание Настольные лампы — уникальная модель 1 с особыми функциями.	Настольные лампы кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	t	100	2025-08-31 19:29:51.967	t	2025-08-31 19:29:51.967
107	Настольные лампы Model 3 Copy	Описание Настольные лампы — уникальная модель 3 с особыми функциями.	Настольные лампы кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	16	t	400	2025-08-31 19:29:51.972	t	2025-08-31 19:29:51.972
113	Напольные лампы Model 5	Описание Напольные лампы — уникальная модель 5 с особыми функциями.	Напольные лампы кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	t	700	2025-08-31 19:29:51.976	t	2025-08-31 19:29:51.976
120	Напольные лампы Model 4 Copy	Описание Напольные лампы — уникальная модель 4 с особыми функциями.	Напольные лампы кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/529476-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	17	f	550	2025-08-31 19:29:51.98	t	2025-08-31 19:29:51.98
123	Наушники с ANC Model 3	Описание Наушники с ANC — уникальная модель 3 с особыми функциями.	Наушники с ANC кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	t	400	2025-08-31 19:29:51.983	t	2025-08-31 19:29:51.983
127	Наушники с ANC Model 1 Copy	Описание Наушники с ANC — уникальная модель 1 с особыми функциями.	Наушники с ANC кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	18	t	100	2025-08-31 19:29:51.986	t	2025-08-31 19:29:51.986
134	Премиум-наушники Model 4	Описание Премиум-наушники — уникальная модель 4 с особыми функциями.	Премиум-наушники кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	f	550	2025-08-31 19:29:51.99	t	2025-08-31 19:29:51.99
138	Премиум-наушники Model 3 Copy	Описание Премиум-наушники — уникальная модель 3 с особыми функциями.	Премиум-наушники кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/759558-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	19	t	400	2025-08-31 19:29:51.997	t	2025-08-31 19:29:51.997
145	Очистители воздуха Model 4	Описание Очистители воздуха — уникальная модель 4 с особыми функциями.	Очистители воздуха кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	f	550	2025-08-31 19:29:52.001	t	2025-08-31 19:29:52.001
148	Очистители воздуха Model 3 Copy	Описание Очистители воздуха — уникальная модель 3 с особыми функциями.	Очистители воздуха кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	20	t	400	2025-08-31 19:29:52.004	t	2025-08-31 19:29:52.004
154	Очистители-увлажнители Model 3	Описание Очистители-увлажнители — уникальная модель 3 с особыми функциями.	Очистители-увлажнители кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	t	400	2025-08-31 19:29:52.007	t	2025-08-31 19:29:52.007
157	Очистители-увлажнители Model 2 Copy	Описание Очистители-увлажнители — уникальная модель 2 с особыми функциями.	Очистители-увлажнители кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	21	f	250	2025-08-31 19:29:52.01	t	2025-08-31 19:29:52.01
163	Вентиляторы и обогреватели Model 4	Описание Вентиляторы и обогреватели — уникальная модель 4 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	f	550	2025-08-31 19:29:52.014	t	2025-08-31 19:29:52.014
166	Вентиляторы и обогреватели Model 2 Copy	Описание Вентиляторы и обогреватели — уникальная модель 2 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	f	250	2025-08-31 19:29:52.016	t	2025-08-31 19:29:52.016
167	Вентиляторы и обогреватели Model 1 Copy	Описание Вентиляторы и обогреватели — уникальная модель 1 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	t	100	2025-08-31 19:29:52.016	t	2025-08-31 19:29:52.016
168	Вентиляторы и обогреватели Model 5 Copy	Описание Вентиляторы и обогреватели — уникальная модель 5 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	t	700	2025-08-31 19:29:52.016	t	2025-08-31 19:29:52.016
169	Вентиляторы и обогреватели Model 4 Copy	Описание Вентиляторы и обогреватели — уникальная модель 4 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	f	550	2025-08-31 19:29:52.016	t	2025-08-31 19:29:52.016
170	Вентиляторы и обогреватели Model 3 Copy	Описание Вентиляторы и обогреватели — уникальная модель 3 с особыми функциями.	Вентиляторы и обогреватели кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero-locale/en_GB/545814-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	22	t	400	2025-08-31 19:29:52.016	t	2025-08-31 19:29:52.016
4	Фены Dyson Supersonic Model 3	Описание Фены Dyson Supersonic — уникальная модель 3 с особыми функциями.	Фены Dyson Supersonic кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	t	400	2025-08-31 19:29:51.877	t	2025-08-31 19:29:51.877
10	Фены Dyson Supersonic Model 2 Copy	Описание Фены Dyson Supersonic — уникальная модель 2 с особыми функциями.	Фены Dyson Supersonic кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	6	f	250	2025-08-31 19:29:51.895	t	2025-08-31 19:29:51.895
11	Мультистайлеры Dyson Airwrap Model 4	Описание Мультистайлеры Dyson Airwrap — уникальная модель 4 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	f	550	2025-08-31 19:29:51.901	t	2025-08-31 19:29:51.901
20	Мультистайлеры Dyson Airwrap Model 5 Copy	Описание Мультистайлеры Dyson Airwrap — уникальная модель 5 с особыми функциями.	Мультистайлеры Dyson Airwrap кратко: модель 5	37990	14	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	7	t	700	2025-08-31 19:29:51.912	t	2025-08-31 19:29:51.912
25	Выпрямители Dyson Corrale Model 4	Описание Выпрямители Dyson Corrale — уникальная модель 4 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 4	35990	13	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	f	550	2025-08-31 19:29:51.916	t	2025-08-31 19:29:51.916
30	Выпрямители Dyson Corrale Model 1 Copy	Описание Выпрямители Dyson Corrale — уникальная модель 1 с особыми функциями.	Выпрямители Dyson Corrale кратко: модель 1	29990	10	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	8	t	100	2025-08-31 19:29:51.92	t	2025-08-31 19:29:51.92
34	Аксессуары для волос Model 2	Описание Аксессуары для волос — уникальная модель 2 с особыми функциями.	Аксессуары для волос кратко: модель 2	31990	11	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	f	250	2025-08-31 19:29:51.924	t	2025-08-31 19:29:51.924
38	Аксессуары для волос Model 3 Copy	Описание Аксессуары для волос — уникальная модель 3 с особыми функциями.	Аксессуары для волос кратко: модель 3	33990	12	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/598976-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	9	t	400	2025-08-31 19:29:51.927	t	2025-08-31 19:29:51.927
45	Беспроводные пылесосы Model 4	Описание Беспроводные пылесосы — уникальная модель 4 с особыми функциями.	Беспроводные пылесосы кратко: модель 4	35990	13	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	f	550	2025-08-31 19:29:51.931	t	2025-08-31 19:29:51.931
46	Беспроводные пылесосы Model 5 Copy	Описание Беспроводные пылесосы — уникальная модель 5 с особыми функциями.	Беспроводные пылесосы кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	10	t	700	2025-08-31 19:29:51.934	t	2025-08-31 19:29:51.934
55	Роботы-пылесосы Model 5	Описание Роботы-пылесосы — уникальная модель 5 с особыми функциями.	Роботы-пылесосы кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	t	700	2025-08-31 19:29:51.937	t	2025-08-31 19:29:51.937
60	Роботы-пылесосы Model 1 Copy	Описание Роботы-пылесосы — уникальная модель 1 с особыми функциями.	Роботы-пылесосы кратко: модель 1	29990	10	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	11	t	100	2025-08-31 19:29:51.94	t	2025-08-31 19:29:51.94
65	Вертикальные пылесосы Model 5	Описание Вертикальные пылесосы — уникальная модель 5 с особыми функциями.	Вертикальные пылесосы кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	t	700	2025-08-31 19:29:51.943	t	2025-08-31 19:29:51.943
67	Вертикальные пылесосы Model 2 Copy	Описание Вертикальные пылесосы — уникальная модель 2 с особыми функциями.	Вертикальные пылесосы кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	12	f	250	2025-08-31 19:29:51.945	t	2025-08-31 19:29:51.945
71	Моющие пылесосы Model 2	Описание Моющие пылесосы — уникальная модель 2 с особыми функциями.	Моющие пылесосы кратко: модель 2	31990	11	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	f	250	2025-08-31 19:29:51.948	t	2025-08-31 19:29:51.948
80	Моющие пылесосы Model 5 Copy	Описание Моющие пылесосы — уникальная модель 5 с особыми функциями.	Моющие пылесосы кратко: модель 5	37990	14	http://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/hero/448799-01.png?$responsive$&cropPathE=desktop&fit=stretch,1&wid=1920	13	t	700	2025-08-31 19:29:51.952	t	2025-08-31 19:29:51.952
\.


--
-- Data for Name: Promotion; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public."Promotion" (id, slot, "productId", title, subtitle, "ctaText", "ctaLink", "bgImageUrl", "bgVideoUrl", "isPublished", "startAt", "endAt", "position", "createdById", "createdAt", "updatedAt", "ctaBg", "ctaColor", font, "textColor", "titleColor") FROM stdin;
1	PRODUCT_OF_DAY	1	Товар дня	\N	Купить со скидкой	\N	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/products/beauty/hair-stylers/airwrap-origin/rcc/Web-EntrySkus-308C-overview-banner-2.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=1920	\N	t	2025-08-30 19:29:52.146	2025-09-07 19:29:52.146	0	29ec014d-19dd-471c-adfc-e8b11bacf5dc	2025-08-31 19:29:52.149	2025-08-31 19:29:52.149	\N	\N	NUNITO_SANS	\N	\N
2	FEATURED	\N	Хиты недели	\N	Смотреть	/catalog/hits	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/countries/ca/products/air-treatment/EC_Home-Editorial_Banner-3.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=1920	\N	t	2025-08-30 19:29:52.146	2025-09-07 19:29:52.146	0	29ec014d-19dd-471c-adfc-e8b11bacf5dc	2025-08-31 19:29:52.152	2025-08-31 19:29:52.152	\N	\N	NUNITO_SANS	\N	\N
3	FEATURED	\N	Рекомендации	\N	Перейти	/catalog/recommended	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/campaigns/summer-sales/Labor-Day_2025_FC_V12.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=3840	\N	t	2025-08-30 19:29:52.146	2025-09-07 19:29:52.146	1	29ec014d-19dd-471c-adfc-e8b11bacf5dc	2025-08-31 19:29:52.152	2025-08-31 19:29:52.152	\N	\N	NUNITO_SANS	\N	\N
4	CUSTOM	\N	Эксклюзив	\N	Подробнее	/landing/exclusive	https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/campaigns/summer-sales/Labor-Day_2025_FC_V12.jpg?$responsive$&cropPathE=desktop&fit=stretch,1&fmt=pjpeg&wid=3840	\N	t	2025-08-30 19:29:52.146	2025-09-07 19:29:52.146	0	29ec014d-19dd-471c-adfc-e8b11bacf5dc	2025-08-31 19:29:52.153	2025-08-31 19:29:52.153	\N	\N	NUNITO_SANS	\N	\N
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
75ad203c-9c1c-4fed-84ce-9671507509e0	4efce115172747f802127ed856e18da60b23228a26070507c00609388b7d7621	2025-08-31 17:55:41.719326+00	20250629095335_init	\N	\N	2025-08-31 17:55:41.70355+00	1
7bb00819-7965-430f-b547-fa47f49a29d4	3f2543bf01c7effd33feaf18aaf302b90465f0a8ba13c058b19a93ac0c5dbde4	2025-08-31 17:55:41.775194+00	20250830004500_add_center_to_content_side	\N	\N	2025-08-31 17:55:41.774338+00	1
bec56ac2-1abd-49a8-9842-38fb8c60d3f2	f9462202c7bc8156cf3bf5c168596815ddc91cb2d2e562f0b016a462b19b79d0	2025-08-31 17:55:41.726606+00	20250629101033_change_decimal_to_float	\N	\N	2025-08-31 17:55:41.719785+00	1
bbf0ba69-f12f-4642-b6f1-1e64d04d361a	10b5792a9a51227f9da09754798423d368dcbad9061c712548047477566315c4	2025-08-31 17:55:41.728259+00	20250629174858_add_category_hierarchy	\N	\N	2025-08-31 17:55:41.726934+00	1
2591c714-de3c-4804-95aa-0fac489d1fc4	f4c640d3b4239ebbed7733b4092108e71687d186cb06d81980360a89c5cd2ce0	2025-08-31 17:55:41.730105+00	20250629180943_add_category_image	\N	\N	2025-08-31 17:55:41.728553+00	1
94d451a1-c2a5-4353-b1f7-6204a13807f1	5b161e09166937edd604f8608d49d6f9eb0c60ef87485d5c5530be32ff4879e7	2025-08-31 17:55:41.77647+00	20250830011000_add_headline_strip_variant	\N	\N	2025-08-31 17:55:41.775486+00	1
6c431399-015a-4b9b-8cad-a6939522ccd4	f0952bfee7b97d9c8e260da6eb6589a13c88711a143ea7265832b199e9544b95	2025-08-31 17:55:41.731868+00	20250701200941_add_featured_and_popularity	\N	\N	2025-08-31 17:55:41.730453+00	1
a06b5c76-f5f0-4f09-8866-603d88a67df0	1b037f3719ffdf2ef3c3f6a7dc17e87eb0bb9cd045e6a11dae2cb09673f73051	2025-08-31 17:55:41.741555+00	20250702_align_schema	\N	\N	2025-08-31 17:55:41.732182+00	1
af231ce6-590b-4622-92c2-25593729c5dd	6402a2f0422ee8c35a1cefca625a5c3b8db5239dc667c356a7e76d0d98ce6512	2025-08-31 17:55:41.752153+00	20250824095211_roles_update	\N	\N	2025-08-31 17:55:41.741892+00	1
d0f95c52-e419-4721-8869-81f89d2af5c5	5ebfe281bc75e0fbfc6d5ca6fe2b5d38cc3d94cd7b7f63955cc326e0698334bf	2025-08-31 17:55:41.780323+00	20250830013500_add_height_px	\N	\N	2025-08-31 17:55:41.776884+00	1
70cb528d-37cd-4c38-82e9-da90d1a2529f	db8399e971b5ec5b32a6cc12f3799d24ec76e62c0cd3dcae88b6987fc6efeda6	2025-08-31 17:55:41.758267+00	20250824103647_promotions	\N	\N	2025-08-31 17:55:41.752552+00	1
851fba8e-da2b-41ba-8428-0689a8cb5039	cdf45b285e62fcf2bd3c933d29ecb5f7670100cc5076cf85cbf7cb895e8d1cbd	2025-08-31 17:55:41.76409+00	20250824180710_	\N	\N	2025-08-31 17:55:41.758666+00	1
24fe8063-a8ac-4c1c-9572-6cb9b4bd0e25	b56373592847b0b23d50e1a5dba683d3dd5b51a1eb49da3bee46f4e2f30ff22f	2025-08-31 17:55:41.770385+00	20250828211832_add_category_promo_sections	\N	\N	2025-08-31 17:55:41.764457+00	1
84be943d-ed71-454c-826b-d653703161d8	453053acdcf8c4de0cc29d4360f8e5c93da1109c9893e4c2d0c6b3451145483f	2025-08-31 17:55:41.787699+00	20250830124113_	\N	\N	2025-08-31 17:55:41.780764+00	1
4a8da366-9b5b-4983-9a8c-c3a958763be4	122d743a0403e77ad7e0ed9447f5b8826f2fbdbc55612d936eff004dd13c2eec	2025-08-31 17:55:41.771623+00	20250829204748_add_bg_color	\N	\N	2025-08-31 17:55:41.770706+00	1
cd5e4beb-603a-4b07-b9f6-cb45e7032d58	9fb4700d3a60347de7dbdeef1bc6fc881a843fb8b87f70ed8b5dd6da551838c6	2025-08-31 17:55:41.772838+00	20250830000000_add_bg_color_to_category_promo_section	\N	\N	2025-08-31 17:55:41.771907+00	1
0c20f485-1d90-4c6b-9b2a-643ff26fe15e	eb148f591c3d62edeb10daa44b11fbeee2f4eb7d25ce913621ac3f0d7593858e	2025-08-31 17:55:41.77403+00	20250830003000_add_content_side	\N	\N	2025-08-31 17:55:41.773117+00	1
75a50781-4fe4-4872-9f08-98a10ed69df1	651459523f4ad5d609ead366d59f1f066cdf93af41248af2da9525fd58804781	2025-08-31 17:55:41.789255+00	20250830212917_add_nunito_sans_font	\N	\N	2025-08-31 17:55:41.788066+00	1
4017827d-8b1b-4afe-b487-59eb7d33d4bf	53a361d7528f53ce6692aa4d7a855e7b1dbd6cd5698553c27a201a80193ff127	2025-08-31 17:55:41.946797+00	20250831175541_init	\N	\N	2025-08-31 17:55:41.945515+00	1
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public.cart_items (id, "cartId", "productId", quantity) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public.carts (id, "userId", "createdAt", "updatedAt") FROM stdin;
1	6c8a225c-4f32-4102-a0c8-f28e02bfe7ef	2025-08-31 21:59:52.062	2025-08-31 21:59:52.062
2	50230107-2149-4a3f-a4d4-7efc706ef9ca	2025-08-31 22:26:56.913	2025-08-31 22:26:56.913
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public.order_items (id, "orderId", "productId", quantity, "priceAtPurchase") FROM stdin;
1	1	125	1	35990
2	2	25	1	35990
3	3	1	1	35990
4	4	5	1	37990
5	5	5	1	37990
6	6	1	1	35990
7	7	64	1	35990
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public.orders (id, "userId", "totalPrice", status, "createdAt", comment, "deliveryAddress", "updatedAt") FROM stdin;
1	50230107-2149-4a3f-a4d4-7efc706ef9ca	35990	PENDING	2025-08-31 22:27:20.085	\N	Москва, ул.Кавказская дом 1 	2025-08-31 22:27:20.085
2	50230107-2149-4a3f-a4d4-7efc706ef9ca	35990	PENDING	2025-08-31 22:29:02.771	\N	Адрес не указан	2025-08-31 22:29:02.771
3	50230107-2149-4a3f-a4d4-7efc706ef9ca	35990	PENDING	2025-08-31 22:31:15.821	\N	Адрес не указан	2025-08-31 22:31:15.821
4	50230107-2149-4a3f-a4d4-7efc706ef9ca	37990	PENDING	2025-08-31 22:32:09.208	\N	Адрес не указан	2025-08-31 22:32:09.208
5	50230107-2149-4a3f-a4d4-7efc706ef9ca	37990	PENDING	2025-08-31 22:34:02.906	\N	Адрес не указан	2025-08-31 22:34:02.906
6	50230107-2149-4a3f-a4d4-7efc706ef9ca	35990	PENDING	2025-08-31 22:35:27.442	\N	Адрес не указан	2025-08-31 22:35:27.442
7	6c8a225c-4f32-4102-a0c8-f28e02bfe7ef	35990	PENDING	2025-09-01 14:35:38.657	\N	Адрес не указан	2025-09-01 14:35:38.657
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dystore
--

COPY public.users (id, phone, email, password, name, "createdAt", "isActive", role, "updatedAt") FROM stdin;
6c8a225c-4f32-4102-a0c8-f28e02bfe7ef	79990000000	director@dystore.local	$2b$10$U92UmadtVvR.XvH/OCRGKOuXI6IyZTrWsjqkqAEcCEk.8wahiph/u	Super Director	2025-08-31 19:29:52.079	t	DIRECTOR	2025-08-31 19:29:52.079
29ec014d-19dd-471c-adfc-e8b11bacf5dc	79990000001	manager@dystore.local	$2b$10$KZHY1laKt.T8oN2cUkLpxeiBuLgM3tTwgv5nXwrds9a5QgPhAY4/a	Content Manager	2025-08-31 19:29:52.146	t	MANAGER	2025-08-31 19:29:52.146
50230107-2149-4a3f-a4d4-7efc706ef9ca	+79060011100	\N	\N	\N	2025-08-31 22:26:55.638	t	CUSTOMER	2025-08-31 22:26:55.638
\.


--
-- Name: CategoryPromoSection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dystore
--

SELECT pg_catalog.setval('public."CategoryPromoSection_id_seq"', 1, false);


--
-- Name: Category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dystore
--

SELECT pg_catalog.setval('public."Category_id_seq"', 22, true);


--
-- Name: PageSection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dystore
--

SELECT pg_catalog.setval('public."PageSection_id_seq"', 4, true);


--
-- Name: Product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dystore
--

SELECT pg_catalog.setval('public."Product_id_seq"', 170, true);


--
-- Name: Promotion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dystore
--

SELECT pg_catalog.setval('public."Promotion_id_seq"', 4, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dystore
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 7, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dystore
--

SELECT pg_catalog.setval('public.carts_id_seq', 2, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dystore
--

SELECT pg_catalog.setval('public.order_items_id_seq', 7, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dystore
--

SELECT pg_catalog.setval('public.orders_id_seq', 7, true);


--
-- Name: CategoryPromoSection CategoryPromoSection_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."CategoryPromoSection"
    ADD CONSTRAINT "CategoryPromoSection_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: PageSection PageSection_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."PageSection"
    ADD CONSTRAINT "PageSection_pkey" PRIMARY KEY (id);


--
-- Name: Product Product_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_pkey" PRIMARY KEY (id);


--
-- Name: Promotion Promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Promotion"
    ADD CONSTRAINT "Promotion_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: CategoryPromoSection_categoryId_isActive_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "CategoryPromoSection_categoryId_isActive_idx" ON public."CategoryPromoSection" USING btree ("categoryId", "isActive");


--
-- Name: CategoryPromoSection_placement_order_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "CategoryPromoSection_placement_order_idx" ON public."CategoryPromoSection" USING btree (placement, "order");


--
-- Name: Category_parentId_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "Category_parentId_idx" ON public."Category" USING btree ("parentId");


--
-- Name: Category_slug_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "Category_slug_idx" ON public."Category" USING btree (slug);


--
-- Name: Category_slug_key; Type: INDEX; Schema: public; Owner: dystore
--

CREATE UNIQUE INDEX "Category_slug_key" ON public."Category" USING btree (slug);


--
-- Name: PageSection_page_isEnabled_position_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "PageSection_page_isEnabled_position_idx" ON public."PageSection" USING btree (page, "isEnabled", "position");


--
-- Name: PageSection_page_key_key; Type: INDEX; Schema: public; Owner: dystore
--

CREATE UNIQUE INDEX "PageSection_page_key_key" ON public."PageSection" USING btree (page, key);


--
-- Name: Product_categoryId_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "Product_categoryId_idx" ON public."Product" USING btree ("categoryId");


--
-- Name: Product_isFeatured_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "Product_isFeatured_idx" ON public."Product" USING btree ("isFeatured");


--
-- Name: Product_popularity_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "Product_popularity_idx" ON public."Product" USING btree (popularity);


--
-- Name: Promotion_slot_isPublished_startAt_endAt_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "Promotion_slot_isPublished_startAt_endAt_idx" ON public."Promotion" USING btree (slot, "isPublished", "startAt", "endAt");


--
-- Name: Promotion_slot_position_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "Promotion_slot_position_idx" ON public."Promotion" USING btree (slot, "position");


--
-- Name: cart_items_cartId_productId_key; Type: INDEX; Schema: public; Owner: dystore
--

CREATE UNIQUE INDEX "cart_items_cartId_productId_key" ON public.cart_items USING btree ("cartId", "productId");


--
-- Name: carts_userId_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "carts_userId_idx" ON public.carts USING btree ("userId");


--
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


--
-- Name: orders_userId_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX "orders_userId_idx" ON public.orders USING btree ("userId");


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: dystore
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_phone_idx; Type: INDEX; Schema: public; Owner: dystore
--

CREATE INDEX users_phone_idx ON public.users USING btree (phone);


--
-- Name: users_phone_key; Type: INDEX; Schema: public; Owner: dystore
--

CREATE UNIQUE INDEX users_phone_key ON public.users USING btree (phone);


--
-- Name: CategoryPromoSection CategoryPromoSection_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."CategoryPromoSection"
    ADD CONSTRAINT "CategoryPromoSection_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CategoryPromoSection CategoryPromoSection_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."CategoryPromoSection"
    ADD CONSTRAINT "CategoryPromoSection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Category Category_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PageSection PageSection_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."PageSection"
    ADD CONSTRAINT "PageSection_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Product Product_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Product"
    ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Promotion Promotion_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Promotion"
    ADD CONSTRAINT "Promotion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Promotion Promotion_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public."Promotion"
    ADD CONSTRAINT "Promotion_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: cart_items cart_items_cartId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES public.carts(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: cart_items cart_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: carts carts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Product"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dystore
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 4rTZhVvwgfXDynl6ON1uatTy1zcFpLgjCMR46QXJ8dGwVfEHq75eNrEcy7OGSnH

