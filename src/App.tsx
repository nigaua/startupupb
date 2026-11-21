import { type FormEvent, useEffect, useState } from "react";

type PageRoute = "/" | "/doneaza" | "/voluntari" | "/faq" | "/despre-noi";

const ROADMAP_MONTHS = [
  {
    month: 1,
    phase: "Lansare & A/B test",
    parentsCount: 50,
    parentsAmount: 5000,
    companiesCount: 1,
    companiesAmount: 10000,
    monthlyTarget: 15000,
    cumulativeTarget: 15000,
    budgetSpent: 3500,
    supporters: 32,
  },
  {
    month: 2,
    phase: "Optimizare mesaje",
    parentsCount: 50,
    parentsAmount: 5000,
    companiesCount: 2,
    companiesAmount: 20000,
    monthlyTarget: 25000,
    cumulativeTarget: 40000,
    budgetSpent: 2500,
    supporters: 64,
  },
  {
    month: 3,
    phase: "Activare voluntari & Capsulă",
    parentsCount: 50,
    parentsAmount: 5000,
    companiesCount: 3,
    companiesAmount: 30000,
    monthlyTarget: 35000,
    cumulativeTarget: 75000,
    budgetSpent: 2500,
    supporters: 98,
  },
  {
    month: 4,
    phase: "Accelerare comunitate",
    parentsCount: 100,
    parentsAmount: 10000,
    companiesCount: 4,
    companiesAmount: 40000,
    monthlyTarget: 50000,
    cumulativeTarget: 125000,
    budgetSpent: 2500,
    supporters: 162,
  },
  {
    month: 5,
    phase: "Scalare sponsori corporate",
    parentsCount: 100,
    parentsAmount: 10000,
    companiesCount: 5,
    companiesAmount: 50000,
    monthlyTarget: 60000,
    cumulativeTarget: 185000,
    budgetSpent: 2000,
    supporters: 230,
  },
  {
    month: 6,
    phase: "Impuls final & închidere",
    parentsCount: 150,
    parentsAmount: 15000,
    companiesCount: 5,
    companiesAmount: 50000,
    monthlyTarget: 65000,
    cumulativeTarget: 250000,
    budgetSpent: 2000,
    supporters: 325,
  },
];

const quickAmounts = { person: [50, 100, 250], company: [2500, 5000, 10000] };
const DEFAULT_MESSAGE = "Mult succes în prima sesiune! Să vă fie acest loc un început bun.";
const DEFAULT_NAME = "Un susținător Chip In";

const UPB_FACULTIES = [
  "Automatică și Calculatoare",
  "Electronică, Telecomunicații și Tehnologia Informației",
  "Inginerie Electrică",
  "Energetică",
  "Inginerie Mecanică și Mecatronică",
  "Inginerie Industrială și Robotică",
  "Ingineria Sistemelor Biotehnice",
  "Transporturi",
  "Inginerie Aerospațială",
  "Știința și Ingineria Materialelor",
  "Inginerie Chimică și Biotehnologii",
  "Inginerie în Limbi Străine",
  "Științe Aplicate",
  "Inginerie Medicală",
  "Antreprenoriat, Ingineria și Managementul Afacerilor",
];

const FAQ_ITEMS = [
  {
    question: "Unde ajung concret fondurile strânse prin campanie?",
    answer:
      "Fondurile susțin direct realizarea noului cămin studențesc al POLITEHNICII București prin Fundația HIPOLITECH. Prioritatea imediată o reprezintă prima etapă a proiectului: proiectare, avize și autorizații (estimată la 1.250.000 lei), ca parte din investiția totală estimată la 100.000.000 lei.",
  },
  {
    question: "Cum funcționează contribuția mea și cum o pot finaliza?",
    answer:
      "În pagina Donează alegi dacă susții proiectul ca persoană fizică sau ca societate, introduci suma dorită (o singură dată sau lunar, pe parcursul celor 6 luni) și vezi imediat cum ajută la atingerea obiectivului lunii curente. Plata și finalizarea contribuției se fac direct pe platforma Chip In, prin card bancar sau transfer bancar.",
  },
  {
    question: "Cine va beneficia de noul cămin?",
    answer:
      "Căminul vizează prioritar studenții cu performanțe academice deosebite și studenții cu dificultăți financiare care au nevoie reală de sprijin pentru a-și continua studiile.",
  },
  {
    question: "Dacă donez, copilul meu primește prioritate sau un loc rezervat în cămin?",
    answer:
      "Nu. Contribuțiile reprezintă un gest de solidaritate față de comunitatea academică și nu conferă drepturi de cazare, rezervări sau prioritate la repartizare.",
  },
  {
    question: "O anumită sumă donată acoperă costul unei camere sau al unui loc de cazare?",
    answer:
      "Nu. Proiectul nu echivalează sumele donate cu o cameră sau un loc anume; fiecare contribuție se adună în obiectivul comun de finanțare al noului cămin.",
  },
  {
    question: "Reprezint o companie. Putem susține proiectul printr-un contract de sponsorizare?",
    answer:
      "Da. Companiile și partenerii pot selecta opțiunea „Societate / Companie” în pagina Donează pentru a stabili suma și a finaliza contribuția sau contractul de sponsorizare direct prin Chip In, alături de echipa Fundației HIPOLITECH. Condițiile contractuale și facilitățile fiscale se stabilesc conform legislației aplicabile.",
  },
  {
    question: "Ce este „Capsula Timpului pentru Prima Generație”?",
    answer:
      "Este spațiul dedicat comunității noastre, unde părinții, susținătorii și partenerii pot lăsa un mesaj scurt de încurajare pentru primii studenți care vor locui în noul cămin. După completare, primești pe loc un card digital de susținător pe care îl poți distribui mai departe familiei sau colegilor.",
  },
  {
    question: "Sunt student la POLITEHNICĂ și vreau să mă implic. Cum pot deveni voluntar?",
    answer:
      "Poți completa formularul din pagina Voluntari. Voluntarii ne ajută să promovăm campania în campus și la evenimentele universității, informând comunitatea și ghidând persoanele interesate să contribuie direct pe platforma Chip In.",
  },
];

const formatLei = (value: number) =>
  new Intl.NumberFormat("ro-RO", { maximumFractionDigits: 0 }).format(value);

function normalizeRoute(pathname: string): PageRoute {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (
    clean === "/doneaza" ||
    clean === "/voluntari" ||
    clean === "/faq" ||
    clean === "/despre-noi"
  ) {
    return clean;
  }
  return "/";
}

function ArrowRightIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4" fill="none">
      <path
        d="M4.5 10h11M10.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0" fill="none">
      <path
        d="m5 10.5 3 3L15 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`size-5 shrink-0 text-[#0B3B6E] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
    >
      <path
        d="m5.5 7.75 4.5 4.5 4.5-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SiteFooter() {
  return (
    <footer className="blueprint px-5 py-10 text-white lg:px-10">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-4 text-xs leading-5 text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-chipin.png" alt="chip in" className="h-7 w-auto" />
          <p>Fundația HIPOLITECH · Universitatea Politehnica din București</p>
        </div>
        <p>Un loc în cămin poate schimba un destin!</p>
      </div>
    </footer>
  );
}

export default function App() {
  const [route, setRoute] = useState<PageRoute>(() => normalizeRoute(window.location.pathname));

  // Donation & checkout state
  const [supporterType, setSupporterType] = useState<"person" | "company">("person");
  const [month, setMonth] = useState(0);
  const [amount, setAmount] = useState(100);
  const [frequency, setFrequency] = useState<"once" | "monthly">("monthly");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("card");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [companyCui, setCompanyCui] = useState("");
  const [donationConfirmed, setDonationConfirmed] = useState(false);

  // Capsula Timpului state
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [cardName, setCardName] = useState(DEFAULT_NAME);
  const [cardMessage, setCardMessage] = useState(DEFAULT_MESSAGE);
  const [copied, setCopied] = useState(false);

  // Volunteer form state
  const [volunteerFullName, setVolunteerFullName] = useState("");
  const [volunteerPhone, setVolunteerPhone] = useState("");
  const [volunteerEmail, setVolunteerEmail] = useState("");
  const [volunteerFaculty, setVolunteerFaculty] = useState("");
  const [volunteerReason, setVolunteerReason] = useState("");
  const [volunteerSent, setVolunteerSent] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const onPopState = () => {
      setRoute(normalizeRoute(window.location.pathname));
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextRoute: PageRoute) => {
    if (nextRoute !== route) {
      window.history.pushState({}, "", nextRoute);
      setRoute(nextRoute);
    }
    window.scrollTo({ top: 0 });
  };

  const currentMonth = ROADMAP_MONTHS[month];
  const target = currentMonth.cumulativeTarget;
  const existing = Math.round(target * 0.62);
  const totalContribution = frequency === "monthly" ? amount * 6 : amount;
  const addedPercent = Math.min((totalContribution / target) * 100, 38);
  const supportersNeeded = Math.max(
    0,
    Math.ceil((target - existing - totalContribution) / totalContribution),
  );
  const pillLeft = Math.min(Math.max(62 + addedPercent / 2, 14), 86);

  const switchSupporter = (type: "person" | "company") => {
    setSupporterType(type);
    setAmount(type === "company" ? 10000 : quickAmounts[type][1]);
    setDonationConfirmed(false);
  };

  const handleCheckoutSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDonationConfirmed(true);
  };

  const generateCard = () => {
    setCardName(name.trim() || DEFAULT_NAME);
    setCardMessage(message.trim() || DEFAULT_MESSAGE);
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard?.writeText(`„${cardMessage}” — ${cardName}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable in restricted context
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`„${cardMessage}” — ${cardName}\nCampanie Chip In × UPB`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleVolunteerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVolunteerSent(true);
  };

  const resetVolunteerForm = () => {
    setVolunteerFullName("");
    setVolunteerPhone("");
    setVolunteerEmail("");
    setVolunteerFaculty("");
    setVolunteerReason("");
    setVolunteerSent(false);
  };

  const segment = (active: boolean) =>
    `cursor-pointer rounded-[9px] px-3 py-2 text-[13px] font-bold transition ${
      active
        ? "bg-white text-[#0B3B6E] shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
        : "text-[#64748B] hover:text-[#0F172A]"
    }`;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#F8FAFC] text-[#0F172A]">
      <header className="pointer-events-none fixed inset-x-0 top-3.5 z-40 flex justify-center px-3 sm:px-5">
        <div className="pointer-events-auto flex h-12 w-fit max-w-full items-center gap-4 rounded-2xl border border-white/15 bg-[#0B2545]/92 px-3.5 shadow-[0_14px_34px_-12px_rgba(2,8,23,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:gap-6 sm:px-5">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigate("/");
            }}
            aria-label="chip in — Acasă"
            className="flex shrink-0 cursor-pointer items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <img
              src="/logo-chipin.png"
              alt="chip in"
              className="h-6 w-auto select-none sm:h-7"
            />
          </a>

          <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/15" />

          <nav
            aria-label="Navigație principală"
            className="flex items-center gap-4 text-xs font-semibold text-white/75 sm:gap-6 sm:text-[13px]"
          >
            <a
              className="nav-link cursor-pointer whitespace-nowrap"
              data-active={route === "/doneaza" ? "true" : undefined}
              href="/doneaza"
              onClick={(event) => {
                event.preventDefault();
                navigate("/doneaza");
              }}
            >
              Donează
            </a>
            <a
              className="nav-link cursor-pointer whitespace-nowrap"
              data-active={route === "/voluntari" ? "true" : undefined}
              href="/voluntari"
              onClick={(event) => {
                event.preventDefault();
                navigate("/voluntari");
              }}
            >
              Voluntari
            </a>
            <a
              className="nav-link cursor-pointer whitespace-nowrap"
              data-active={route === "/faq" ? "true" : undefined}
              href="/faq"
              onClick={(event) => {
                event.preventDefault();
                navigate("/faq");
              }}
            >
              FAQ
            </a>
            <a
              className="nav-link cursor-pointer whitespace-nowrap"
              data-active={route === "/despre-noi" ? "true" : undefined}
              href="/despre-noi"
              onClick={(event) => {
                event.preventDefault();
                navigate("/despre-noi");
              }}
            >
              Despre noi
            </a>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {route === "/" && (
          /* HERO — prima pagină: doar prima parte până la cele două butoane */
          <section className="blueprint relative flex flex-1 flex-col overflow-hidden text-white">
            {/* Desktop/PC architectural dorm background with seamless blueprint-to-photo scrim */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
              <img
                src="/hero-camine.webp"
                alt=""
                fetchPriority="high"
                decoding="async"
                className="absolute inset-y-0 right-0 h-full w-[70%] object-cover object-center xl:w-[66%]"
              />
              {/* Left-to-right directional scrim: guarantees WCAG AAA contrast behind text while revealing the dorm clearly on the right */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, #0B2545 0%, #0B2545 31%, rgba(11, 37, 69, 0.94) 42%, rgba(11, 37, 69, 0.56) 56%, rgba(11, 37, 69, 0.16) 76%, rgba(11, 37, 69, 0.24) 100%)",
                }}
              />
              {/* Subtle top & bottom framing vignette to blend with navbar and viewport edge */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(11, 37, 69, 0.48) 0%, rgba(11, 37, 69, 0) 18%, rgba(11, 37, 69, 0) 80%, rgba(11, 37, 69, 0.52) 100%)",
                }}
              />
              {/* Faint blueprint grid fading from left into the architectural render */}
              <div
                className="architectural-grid absolute inset-0 opacity-20"
                style={{
                  maskImage: "linear-gradient(90deg, black 0%, black 34%, transparent 66%)",
                  WebkitMaskImage: "linear-gradient(90deg, black 0%, black 34%, transparent 66%)",
                }}
              />
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-center px-5 pb-16 pt-24 sm:py-24 lg:px-10 lg:py-20">
              <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
                <span className="h-px w-8 bg-white/45" />
                Fundația HIPOLITECH ·{" "}
                <span className="sm:hidden">UPB</span>
                <span className="hidden sm:inline">Universitatea Politehnica din București</span>
              </p>
              <h1 className="relative max-w-[680px] text-balance text-[40px] font-bold leading-[1.1] tracking-normal sm:text-6xl xl:text-[66px]">
                Un loc în cămin poate schimba un destin!
              </h1>

              <div className="relative mt-6 max-w-[580px] space-y-4 text-pretty sm:mt-8">
                <p className="text-lg leading-[1.6] text-white sm:text-xl">
                  Pentru mulți tineri veniți din alte orașe, primul an la Politehnică începe cu o
                  întrebare grea: unde voi locui?
                </p>
                <p className="text-base leading-[1.7] text-[#E2E8F0] sm:text-[17px]">
                  Un loc în cămin înseamnă mai mult decât un pat. Înseamnă liniștea de a învăța,
                  colegi alături și puterea de a merge mai departe. Fundația HIPOLITECH strânge
                  fonduri pentru noul cămin al UPB, iar prima etapă (proiectare, avize și
                  autorizații) are nevoie de{" "}
                  <span className="font-semibold text-white tabular-nums">1.250.000 de lei</span>.
                  Fiecare contribuție ne aduce mai aproape.
                </p>
              </div>

              <div className="relative mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
                <a
                  href="/doneaza"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/doneaza");
                  }}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 text-[15px] font-bold text-[#0B2545] shadow-[0_12px_28px_-8px_rgba(2,8,23,0.45)] transition-[background-color,transform] duration-150 ease-out hover:bg-[#F7F6F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97] sm:pe-6 sm:ps-7"
                >
                  Donează acum <ArrowRightIcon />
                </a>
                <a
                  href="/voluntari"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/voluntari");
                  }}
                  className="inline-flex min-h-12 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-white/45 bg-[#0B2545]/45 px-4 text-[15px] font-bold text-white backdrop-blur-[2px] transition-[background-color,border-color,transform] duration-150 ease-out hover:border-white hover:bg-[#0B2545]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97] sm:px-7"
                >
                  Devino voluntar
                </a>
              </div>
            </div>
          </section>
        )}

        {route === "/doneaza" && (
          <>
            {/* CONTRIBUȚIE & SIMULATOR — warm paper */}
            <section
              id="simulator"
              className="scroll-mt-20 border-b border-[#E2E8F0] bg-[#F7F6F2] px-5 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-28"
            >
              <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[42fr_58fr] lg:gap-16 xl:gap-20">
                <div className="lg:pt-6">
                  <p className="section-kicker">Contribuție directă</p>
                  <h2 className="section-title">Vezi cum contează contribuția ta</h2>
                  <p className="section-subtitle">
                    Mobilizarea comunității crește treptat în 6 etape lunare transparente, de la{" "}
                    <span className="font-semibold text-[#0F172A] tabular-nums">15.000 lei</span> în
                    prima lună până la{" "}
                    <span className="font-semibold text-[#0F172A] tabular-nums">250.000 lei</span>{" "}
                    cumulat la finalul celor 6 luni (20% din Etapa 1).
                  </p>
                  <div className="mt-8 grid max-w-[500px] grid-cols-2 border-y border-[#E2E8F0]">
                    {[
                      ["Start · Luna 1", "15.000 lei"],
                      ["Cumulat · Luna 6", "250.000 lei"],
                    ].map(([label, value], index) => (
                      <div
                        key={label}
                        className={`py-4 ${index > 0 ? "border-l border-[#E2E8F0] pl-5" : "pr-5"}`}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#64748B]">
                          {label}
                        </p>
                        <p className="mt-1 text-xl font-extrabold tabular-nums text-[#0B2545]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Donation & payment card */}
                <div className="lg:self-start">
                  <div className="rounded-[22px] border border-[#E2E8F0] bg-white p-5 text-[#0F172A] shadow-[0_24px_48px_-28px_rgba(11,37,69,0.35)] sm:p-7">
                    <div className="grid grid-cols-2 rounded-xl bg-[#F1F5F9] p-1">
                      <button
                        type="button"
                        onClick={() => switchSupporter("person")}
                        className={segment(supporterType === "person")}
                      >
                        <span className="hidden sm:inline">
                          Persoană fizică (Părinte / Susținător)
                        </span>
                        <span className="sm:hidden">Persoană fizică</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => switchSupporter("company")}
                        className={segment(supporterType === "company")}
                      >
                        Societate / Companie
                      </button>
                    </div>

                    {/* Roadmap milestone track */}
                    <div className="mt-5">
                      <div className="mb-2.5 flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#64748B]">
                          Foaie de parcurs · {currentMonth.phase}
                        </p>
                        <p className="text-[13px] font-bold tabular-nums text-[#0B3B6E]">
                          Cumulat Luna {currentMonth.month}: {formatLei(target)} lei
                        </p>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {ROADMAP_MONTHS.map((item, index) => {
                          const active = month === index;
                          const passed = index < month;
                          return (
                            <button
                              type="button"
                              key={item.month}
                              onClick={() => setMonth(index)}
                              aria-pressed={active}
                              className="group cursor-pointer text-left"
                            >
                              <span
                                className={`block h-1.5 transition-colors ${
                                  index === 0 ? "rounded-l-full" : ""
                                } ${index === 5 ? "rounded-r-full" : ""} ${
                                  active
                                    ? "bg-[#F59E0B]"
                                    : passed
                                      ? "bg-[#0B3B6E]"
                                      : "bg-[#E2E8F0] group-hover:bg-[#CBD5E1]"
                                }`}
                              />
                              <span className="mt-2 flex items-center gap-1.5">
                                <span
                                  className={`size-1.5 shrink-0 rounded-full ${
                                    active
                                      ? "bg-[#F59E0B] ring-[3px] ring-[#FEF3C7]"
                                      : passed
                                        ? "bg-[#0B3B6E]"
                                        : "bg-[#CBD5E1]"
                                  }`}
                                />
                                <span
                                  className={`text-xs font-extrabold ${active ? "text-[#0F172A]" : "text-[#94A3B8]"}`}
                                >
                                  Luna {item.month}
                                </span>
                              </span>
                              <span
                                className={`mt-0.5 hidden pl-3 text-[10px] font-bold tabular-nums sm:block ${
                                  active ? "text-[#0B3B6E]" : "text-[#94A3B8]"
                                }`}
                              >
                                {formatLei(item.cumulativeTarget / 1000)}k
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 pb-4 pt-4 sm:px-5">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="text-2xl font-extrabold tabular-nums tracking-[-0.01em] text-[#0F172A]">
                            {formatLei(existing)} lei{" "}
                            <span className="text-sm font-semibold tracking-normal text-[#64748B]">
                              strânși
                            </span>
                          </p>
                          <p className="mt-0.5 text-xs font-semibold tabular-nums text-[#64748B]">
                            • {currentMonth.supporters} susținători · țintă lunară{" "}
                            {formatLei(currentMonth.monthlyTarget)} lei
                          </p>
                        </div>
                        <p className="pb-0.5 text-right text-sm font-extrabold tabular-nums text-[#0B3B6E]">
                          62% <span className="font-semibold text-[#64748B]">din reper</span>
                        </p>
                      </div>

                      <div className="relative mt-12">
                        <div
                          className="absolute bottom-[30px] z-10 -translate-x-1/2 transition-[left] duration-300"
                          style={{ left: `${pillLeft}%` }}
                        >
                          <div className="whitespace-nowrap rounded-full bg-[#F59E0B] px-3 py-1.5 text-xs font-extrabold tabular-nums text-[#0B2545] shadow-[0_6px_16px_rgba(245,158,11,0.4)]">
                            +{formatLei(totalContribution)} lei contribuția ta
                          </div>
                          <div className="mx-auto -mt-1 size-2.5 rotate-45 bg-[#F59E0B]" />
                        </div>
                        <div className="flex h-[18px] overflow-hidden rounded-full bg-[#E2E8F0] shadow-[inset_0_1px_2px_rgba(15,23,42,0.08)]">
                          <div className="h-full bg-[#0B3B6E]" style={{ width: "62%" }} />
                          <div
                            className="bar-stripes h-full border-l-2 border-white bg-[#F59E0B] transition-[width] duration-300"
                            style={{ width: `${addedPercent}%` }}
                          />
                        </div>
                        <div className="mt-1.5 flex justify-between text-[10px] font-semibold tabular-nums text-[#94A3B8]">
                          <span>0</span>
                          <span>{formatLei(target)} lei</span>
                        </div>
                      </div>

                      <p className="mt-2 text-[13px] font-semibold leading-5 text-[#0F172A]">
                        {supportersNeeded === 0 ? (
                          <>Contribuția ta acoperă integral reperul cumulat al lunii {currentMonth.month}.</>
                        ) : (
                          <>
                            Cu această contribuție, mai sunt necesari doar{" "}
                            <span className="rounded bg-[#FEF3C7] px-1 font-extrabold tabular-nums text-[#B45309]">
                              {supportersNeeded}{" "}
                              {supportersNeeded === 1 ? "susținător" : "susținători"}
                            </span>{" "}
                            pentru a atinge reperul de {formatLei(target)} lei din Luna{" "}
                            {currentMonth.month}.
                          </>
                        )}
                      </p>
                      <p className="mt-2.5 border-t border-[#E2E8F0] pt-2.5 text-[11px] leading-4 tabular-nums text-[#64748B]">
                        Obiectiv Luna {currentMonth.month}: {currentMonth.parentsCount} părinți (
                        {formatLei(currentMonth.parentsAmount)} lei) +{" "}
                        {currentMonth.companiesCount}{" "}
                        {currentMonth.companiesCount === 1 ? "companie" : "companii"} (
                        {formatLei(currentMonth.companiesAmount)} lei).
                      </p>
                    </div>

                    {/* Inputs */}
                    <div className="mt-5 grid grid-cols-[1fr_118px] gap-3 sm:grid-cols-[1fr_150px]">
                      <div>
                        <span className="field-label">Alege suma</span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {quickAmounts[supporterType].map((value) => (
                            <button
                              type="button"
                              key={value}
                              onClick={() => {
                                setAmount(value);
                                setDonationConfirmed(false);
                              }}
                              className={`h-11 cursor-pointer rounded-xl border text-[13px] font-extrabold tabular-nums transition ${
                                amount === value
                                  ? "border-[#0B3B6E] bg-[#0B3B6E] text-white"
                                  : "border-[#E2E8F0] text-[#475569] hover:border-[#94A3B8]"
                              }`}
                            >
                              {formatLei(value)} lei
                            </button>
                          ))}
                        </div>
                      </div>
                      <label>
                        <span className="field-label truncate">Altă sumă (lei)</span>
                        <input
                          className="field-input min-h-11 py-2 text-base font-extrabold tabular-nums"
                          type="number"
                          min="1"
                          value={amount}
                          onChange={(event) => {
                            setAmount(Math.max(1, Number(event.target.value)));
                            setDonationConfirmed(false);
                          }}
                        />
                      </label>
                    </div>
                    <div className="mt-3 grid grid-cols-2 rounded-xl bg-[#F1F5F9] p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFrequency("once");
                          setDonationConfirmed(false);
                        }}
                        className={segment(frequency === "once")}
                      >
                        O singură dată
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFrequency("monthly");
                          setDonationConfirmed(false);
                        }}
                        className={`${segment(frequency === "monthly")} flex flex-wrap items-center justify-center gap-x-2`}
                      >
                        Lunar × 6 luni
                        {frequency === "monthly" && (
                          <span className="rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-extrabold tabular-nums text-[#B45309]">
                            Total 6 luni: {formatLei(amount * 6)} lei
                          </span>
                        )}
                      </button>
                    </div>

                    {!checkoutOpen ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutOpen(true);
                          setDonationConfirmed(false);
                        }}
                        className="mt-5 flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#0B3B6E] px-5 py-3.5 text-center text-sm font-extrabold text-white shadow-[0_10px_24px_-6px_rgba(11,59,110,0.55)] transition hover:-translate-y-px hover:bg-[#0B2545]"
                      >
                        Donează {formatLei(totalContribution)} lei →
                      </button>
                    ) : (
                      <form
                        onSubmit={handleCheckoutSubmit}
                        className="mt-5 space-y-3.5 rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-4 sm:p-5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#0B3B6E]">
                            Finalizează plata pe Chip In
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setCheckoutOpen(false);
                              setDonationConfirmed(false);
                            }}
                            className="cursor-pointer text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
                          >
                            Modifică suma
                          </button>
                        </div>

                        <div className="grid grid-cols-2 rounded-xl bg-[#E2E8F0]/70 p-1">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("card")}
                            className={segment(paymentMethod === "card")}
                          >
                            Card bancar
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("transfer")}
                            className={segment(paymentMethod === "transfer")}
                          >
                            Transfer bancar
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="field-label">
                              {supporterType === "company" ? "Denumire companie" : "Nume complet"}
                            </span>
                            <input
                              required
                              type="text"
                              className="field-input min-h-11 py-2"
                              value={donorName}
                              onChange={(event) => setDonorName(event.target.value)}
                              placeholder={
                                supporterType === "company"
                                  ? "Ex: Companie S.R.L."
                                  : "Ex: Andrei Popescu"
                              }
                            />
                          </label>
                          <label className="block">
                            <span className="field-label">Email confirmare</span>
                            <input
                              required
                              type="email"
                              className="field-input min-h-11 py-2"
                              value={donorEmail}
                              onChange={(event) => setDonorEmail(event.target.value)}
                              placeholder="Ex: nume@exemplu.ro"
                            />
                          </label>
                        </div>

                        {supporterType === "company" && (
                          <label className="block">
                            <span className="field-label">CUI / Cod fiscal (pentru contract)</span>
                            <input
                              required
                              type="text"
                              className="field-input min-h-11 py-2 tabular-nums"
                              value={companyCui}
                              onChange={(event) => setCompanyCui(event.target.value)}
                              placeholder="Ex: RO12345678"
                            />
                          </label>
                        )}

                        {paymentMethod === "transfer" && (
                          <div className="rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-3 text-xs leading-5 text-[#475569]">
                            <p className="font-bold text-[#0B2545]">
                              Beneficiar: Fundația HIPOLITECH · Chip In UPB
                            </p>
                            <p className="mt-1 tabular-nums">
                              Detalii plată: <span className="font-semibold">Noul Cămin UPB</span>
                            </p>
                          </div>
                        )}

                        <button
                          type="submit"
                          className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#0B3B6E] px-5 py-3.5 text-center text-sm font-extrabold text-white shadow-[0_10px_24px_-6px_rgba(11,59,110,0.55)] transition hover:-translate-y-px hover:bg-[#0B2545]"
                        >
                          {paymentMethod === "card"
                            ? `Plătește ${formatLei(totalContribution)} lei`
                            : `Confirmă transferul de ${formatLei(totalContribution)} lei`}
                        </button>
                      </form>
                    )}

                    {donationConfirmed && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#166534]">
                        <CheckIcon />
                        Îți mulțumim! Contribuția ta de {formatLei(totalContribution)} lei a fost
                        înregistrată, iar confirmarea a fost trimisă pe email.
                      </div>
                    )}

                    <p className="mt-2.5 text-center text-[11px] leading-4 text-[#64748B]">
                      Plățile se procesează direct pe Chip In. Contribuțiile susțin proiectul comun
                      și nu oferă rezervări sau drepturi de cazare.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CAPSULA — warm off-white */}
            <section id="capsula" className="scroll-mt-20 bg-[#F7F6F2] px-5 py-20 lg:px-10 lg:py-28">
              <div className="mx-auto max-w-[1240px]">
                <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                  <div>
                    <p className="section-kicker">Un mesaj care rămâne</p>
                    <h2 className="section-title">Capsula Timpului pentru Prima Generație</h2>
                    <p className="section-subtitle">
                      Lasă un gând bun pentru primii studenți care vor locui în noul cămin și
                      generează un card de susținător.
                    </p>

                    <div className="mt-10 rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-7">
                      <label className="block">
                        <span className="field-label">Nume / Inițiale</span>
                        <input
                          className="field-input"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          placeholder="Ex: A.M."
                        />
                      </label>
                      <label className="mt-5 block">
                        <span className="field-label">
                          Mesaj scurt de încurajare (max. 160 caractere)
                        </span>
                        <textarea
                          className="field-input min-h-28 resize-none"
                          maxLength={160}
                          value={message}
                          onChange={(event) => setMessage(event.target.value)}
                          placeholder="Scrie aici mesajul tău..."
                        />
                        <span className="mt-1.5 block text-right text-[11px] font-semibold tabular-nums text-[#94A3B8]">
                          {message.length}/160
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={generateCard}
                        className="primary-button mt-3 cursor-pointer"
                      >
                        Generează Cardul de Susținător
                      </button>
                    </div>
                  </div>

                  <div className="lg:pt-6">
                    <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(150deg,#0F4A85_0%,#0B3B6E_42%,#0B2545_100%)] p-7 text-[#FFF7E8] shadow-[0_34px_60px_-18px_rgba(11,37,69,0.55)] sm:p-10">
                      <div
                        aria-hidden="true"
                        className="architectural-grid absolute inset-0 opacity-25"
                      />
                      <div aria-hidden="true" className="paper-noise absolute inset-0 opacity-30" />
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 200 200"
                        className="absolute -bottom-16 -right-12 size-72 text-[#FFF7E8] opacity-[0.07]"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M20 180V80l80-50 80 50v100M20 180h160M60 180v-60h80v60M100 30v150M60 120h80M60 150h80"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <div
                        aria-hidden="true"
                        className="absolute inset-3 rounded-[18px] border border-dashed border-[#FFF7E8]/20"
                      />

                      <div className="relative flex min-h-[330px] flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#F5D9A8]">
                              Card Digital de Susținător
                            </p>
                            <p className="mt-1 text-[11px] font-semibold tabular-nums text-[#FFF7E8]/60">
                              Nr. 0001 · Prima Generație
                            </p>
                          </div>
                          <div className="grid size-12 place-items-center rounded-full border border-[#F5D9A8]/50 text-sm font-extrabold text-[#F5D9A8] ring-4 ring-[#F5D9A8]/10">
                            H
                          </div>
                        </div>
                        <blockquote className="my-auto py-8 text-balance text-2xl font-semibold leading-[1.4] tracking-[-0.01em] sm:text-[30px]">
                          <span className="mr-1 text-[#F59E0B]">„</span>
                          {cardMessage}
                          <span className="text-[#F59E0B]">”</span>
                        </blockquote>
                        <div className="flex items-end justify-between gap-4 border-t border-[#FFF7E8]/20 pt-5">
                          <div>
                            <p className="text-sm font-bold">{cardName}</p>
                            <p className="mt-1 text-xs text-[#FFF7E8]/70">
                              Susținător • Campanie Chip In × UPB
                            </p>
                          </div>
                          <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#F5D9A8]/70 sm:block">
                            UPB · 2026
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={shareWhatsApp}
                        className="secondary-button cursor-pointer"
                      >
                        Distribuie pe WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={copyMessage}
                        className="secondary-button cursor-pointer"
                      >
                        {copied ? "Mesaj copiat" : "Copiază mesajul"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TRANSPARENȚĂ & PLAN PE 6 LUNI — soft slate */}
            <section className="border-t border-[#E2E8F0] bg-[#F1F5F9] px-5 py-20 lg:px-10 lg:py-24">
              <div className="mx-auto max-w-[1240px]">
                <div id="transparenta" className="scroll-mt-24">
                  <p className="section-kicker">Planul campaniei pe 6 luni</p>
                  <div className="mt-6 grid border-y border-[#CBD5E1] md:grid-cols-3">
                    {[
                      [
                        "250.000 lei",
                        "Obiectivul pe 6 luni (20% din Etapa 1): 500 părinți (50.000 lei) + 20 companii (200.000 lei).",
                      ],
                      [
                        "235.000 lei net",
                        "Fonduri nete direcționate direct către noul cămin, cu un buget operațional total de 15.000 lei.",
                      ],
                      [
                        "1.250.000 lei",
                        "Etapa 1 completă: proiectare, avize și autorizații pentru noul cămin studențesc UPB.",
                      ],
                    ].map(([stat, description], index) => (
                      <div
                        key={stat}
                        className={`py-9 md:px-8 lg:px-10 ${index > 0 ? "border-t border-[#CBD5E1] md:border-l md:border-t-0" : "md:pl-0"}`}
                      >
                        <p className="text-[11px] font-bold tabular-nums text-[#94A3B8]">
                          0{index + 1}
                        </p>
                        <p className="mt-3 text-[34px] font-extrabold tabular-nums tracking-[-0.01em] text-[#0B3B6E] lg:text-[40px]">
                          {stat}
                        </p>
                        <p className="mt-3 max-w-[320px] text-sm leading-6 text-[#475569]">
                          {description}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 6-month structured roadmap table */}
                  <div className="mt-10 overflow-hidden rounded-[22px] border border-[#E2E8F0] bg-white shadow-[0_24px_48px_-28px_rgba(11,37,69,0.22)]">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                        <thead>
                          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#64748B]">
                            <th className="px-5 py-4">Etapă</th>
                            <th className="px-5 py-4">Fază de campanie</th>
                            <th className="px-5 py-4">Părinți (× 100 lei)</th>
                            <th className="px-5 py-4">Companii (× 10.000 lei)</th>
                            <th className="px-5 py-4 text-right">Țintă lunară</th>
                            <th className="px-5 py-4 text-right">Cumulat</th>
                            <th className="px-5 py-4 text-right">Buget cheltuit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0] tabular-nums">
                          {ROADMAP_MONTHS.map((item, index) => {
                            const active = month === index;
                            return (
                              <tr
                                key={item.month}
                                onClick={() => setMonth(index)}
                                className={`cursor-pointer transition-colors ${
                                  active ? "bg-[#EFF6FF]/80" : "hover:bg-[#F8FAFC]"
                                }`}
                              >
                                <td className="px-5 py-4 font-extrabold text-[#0B2545]">
                                  <span className="inline-flex items-center gap-2">
                                    <span
                                      className={`size-2 rounded-full ${
                                        active ? "bg-[#F59E0B]" : "bg-[#CBD5E1]"
                                      }`}
                                    />
                                    Luna {item.month}
                                  </span>
                                </td>
                                <td className="px-5 py-4 font-semibold text-[#334155]">
                                  {item.phase}
                                </td>
                                <td className="px-5 py-4 text-[#475569]">
                                  <span className="font-bold text-[#0F172A]">
                                    {item.parentsCount}
                                  </span>{" "}
                                  ({formatLei(item.parentsAmount)} lei)
                                </td>
                                <td className="px-5 py-4 text-[#475569]">
                                  <span className="font-bold text-[#0F172A]">
                                    {item.companiesCount}
                                  </span>{" "}
                                  ({formatLei(item.companiesAmount)} lei)
                                </td>
                                <td className="px-5 py-4 text-right font-semibold text-[#475569]">
                                  {formatLei(item.monthlyTarget)} lei
                                </td>
                                <td className="px-5 py-4 text-right font-extrabold text-[#0B3B6E]">
                                  {formatLei(item.cumulativeTarget)} lei
                                </td>
                                <td className="px-5 py-4 text-right text-[#64748B]">
                                  {formatLei(item.budgetSpent)} lei
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="border-t-2 border-[#CBD5E1] bg-[#0B2545] text-white tabular-nums">
                            <td className="px-5 py-4 font-extrabold">TOTAL</td>
                            <td className="px-5 py-4 font-semibold text-[#CBD5E1]">
                              6 luni (20% din Etapa 1)
                            </td>
                            <td className="px-5 py-4 font-semibold">500 (50.000 lei)</td>
                            <td className="px-5 py-4 font-semibold">20 (200.000 lei)</td>
                            <td className="px-5 py-4 text-right font-bold">250.000 lei</td>
                            <td className="px-5 py-4 text-right font-extrabold text-[#F59E0B]">
                              235.000 lei net
                            </td>
                            <td className="px-5 py-4 text-right font-semibold text-[#CBD5E1]">
                              15.000 lei
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <SiteFooter />
          </>
        )}

        {route === "/voluntari" && (
          <>
            <section className="flex-1 bg-[#F7F6F2] px-5 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-28">
              <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[42fr_58fr] lg:gap-16 xl:gap-20">
                <div className="lg:pt-6">
                  <p className="section-kicker">Comunitatea UPB</p>
                  <h1 className="section-title">Devino voluntar în campanie</h1>
                  <p className="section-subtitle">
                    Ești student și vrei să ajuți la construirea noului cămin UPB? Completează
                    formularul de mai alături și te contactăm pentru următoarele activități din
                    campus.
                  </p>
                </div>

                <div className="lg:self-start">
                  <div className="rounded-[22px] border border-[#E2E8F0] bg-white p-6 text-[#0F172A] shadow-[0_24px_48px_-28px_rgba(11,37,69,0.35)] sm:p-8">
                    <form className="space-y-5" onSubmit={handleVolunteerSubmit}>
                      <label className="block">
                        <span className="field-label">Nume complet</span>
                        <input
                          required
                          type="text"
                          className="field-input"
                          value={volunteerFullName}
                          onChange={(event) => {
                            setVolunteerFullName(event.target.value);
                            setVolunteerSent(false);
                          }}
                          placeholder="Ex: Andrei Popescu"
                        />
                      </label>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                          <span className="field-label">Număr de telefon</span>
                          <input
                            required
                            type="tel"
                            className="field-input tabular-nums"
                            value={volunteerPhone}
                            onChange={(event) => {
                              setVolunteerPhone(event.target.value);
                              setVolunteerSent(false);
                            }}
                            placeholder="Ex: 07xx xxx xxx"
                          />
                        </label>

                        <label className="block">
                          <span className="field-label">Email</span>
                          <input
                            required
                            type="email"
                            className="field-input"
                            value={volunteerEmail}
                            onChange={(event) => {
                              setVolunteerEmail(event.target.value);
                              setVolunteerSent(false);
                            }}
                            placeholder="Ex: nume@stud.upb.ro"
                          />
                        </label>
                      </div>

                      <label className="block">
                        <span className="field-label">Facultatea de proveniență</span>
                        <input
                          required
                          type="text"
                          list="upb-faculties"
                          className="field-input"
                          value={volunteerFaculty}
                          onChange={(event) => {
                            setVolunteerFaculty(event.target.value);
                            setVolunteerSent(false);
                          }}
                          placeholder="Alege sau scrie facultatea ta"
                        />
                        <datalist id="upb-faculties">
                          {UPB_FACULTIES.map((faculty) => (
                            <option key={faculty} value={faculty} />
                          ))}
                        </datalist>
                      </label>

                      <label className="block">
                        <span className="field-label">De ce vrei să faci voluntariat?</span>
                        <textarea
                          required
                          className="field-input min-h-32 resize-y"
                          value={volunteerReason}
                          onChange={(event) => {
                            setVolunteerReason(event.target.value);
                            setVolunteerSent(false);
                          }}
                          placeholder="Scrie câteva rânduri despre motivația ta și cum ai vrea să te implici..."
                        />
                      </label>

                      <button type="submit" className="primary-button cursor-pointer">
                        Trimite înscrierea
                      </button>
                    </form>

                    {volunteerSent && (
                      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3.5 text-sm font-semibold text-[#166534] sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <CheckIcon />
                          <span>
                            Înscriere înregistrată! Îți mulțumim, {volunteerFullName.trim()}.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={resetVolunteerForm}
                          className="shrink-0 cursor-pointer text-xs font-extrabold text-[#166534] underline underline-offset-2 hover:text-[#14532D]"
                        >
                          Trimite altă înscriere
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
            <SiteFooter />
          </>
        )}

        {route === "/faq" && (
          <>
            <section className="flex-1 bg-[#F7F6F2] px-5 pb-20 pt-24 lg:px-10 lg:pb-28 lg:pt-28">
              <div className="mx-auto max-w-[960px]">
                <p className="section-kicker">Întrebări frecvente</p>
                <h1 className="section-title">Tot ce trebuie să știi despre campanie</h1>
                <p className="section-subtitle">
                  Răspunsuri clare despre cum funcționează contribuțiile pe Chip In, etapele
                  proiectului și implicarea comunității UPB.
                </p>

                <div className="mt-10 space-y-3">
                  {FAQ_ITEMS.map((item, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={item.question}
                        className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
                        >
                          <span className="flex items-baseline gap-3.5 text-[15px] font-extrabold leading-snug text-[#0F172A] sm:text-base">
                            <span className="text-xs font-extrabold tabular-nums text-[#0B3B6E]">
                              0{index + 1}
                            </span>
                            <span>{item.question}</span>
                          </span>
                          <ChevronDownIcon open={isOpen} />
                        </button>
                        {isOpen && (
                          <div className="border-t border-[#F1F5F9] px-5 pb-6 pt-4 sm:px-7 sm:pl-[56px]">
                            <p className="text-sm leading-7 text-[#475569] sm:text-[15px]">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:flex-row sm:items-center sm:p-7">
                  <div>
                    <p className="text-base font-extrabold text-[#0B2545]">
                      Vrei să susții direct noul cămin UPB?
                    </p>
                    <p className="mt-1 text-sm text-[#475569]">
                      Alege suma dorită sau implică-te alături de echipa de voluntari.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <a
                      href="/doneaza"
                      onClick={(event) => {
                        event.preventDefault();
                        navigate("/doneaza");
                      }}
                      className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#0B3B6E] px-5 text-sm font-extrabold text-white transition hover:bg-[#0B2545]"
                    >
                      Donează acum <ArrowRightIcon />
                    </a>
                    <a
                      href="/voluntari"
                      onClick={(event) => {
                        event.preventDefault();
                        navigate("/voluntari");
                      }}
                      className="secondary-button inline-flex min-h-11 cursor-pointer items-center"
                    >
                      Devino voluntar
                    </a>
                  </div>
                </div>
              </div>
            </section>
            <SiteFooter />
          </>
        )}

        {route === "/despre-noi" && (
          <>
            <section className="flex-1 bg-[#F7F6F2] px-5 pb-20 pt-24 lg:px-10 lg:pb-28 lg:pt-28">
              <div className="mx-auto max-w-[1100px]">
                <p className="section-kicker">Despre noi</p>
                <h1 className="section-title">
                  Misiunea noastră: „Un loc în cămin poate schimba un destin!”
                </h1>
                <p className="section-subtitle max-w-[780px] text-[17px]">
                  Chip In este platforma dedicată campaniei de strângere de fonduri pentru
                  construirea unui nou cămin studențesc al Universității Politehnica din București,
                  inițiată de Fundația HIPOLITECH. Proiectul este gândit prioritar pentru studenții
                  cu rezultate academice deosebite și pentru cei care au nevoie de sprijin
                  financiar, urmărind să le ofere spații moderne de locuire, studiu și comunitate.
                </p>

                {/* Key milestones strip matching the design system */}
                <div className="mt-12 grid border-y border-[#CBD5E1] md:grid-cols-3">
                  {[
                    [
                      "100.000.000 lei",
                      "Investiția totală estimată pentru construirea de la zero a noului cămin studențesc UPB.",
                    ],
                    [
                      "1.250.000 lei",
                      "Prima etapă a proiectului: proiectare, avize și autorizații necesare demarării lucrărilor.",
                    ],
                    [
                      "250.000 lei",
                      "Obiectivul mobilizării comunității în șase etape lunare transparente pe Chip In.",
                    ],
                  ].map(([stat, description], index) => (
                    <div
                      key={stat}
                      className={`py-8 md:px-7 ${index > 0 ? "border-t border-[#CBD5E1] md:border-l md:border-t-0" : "md:pl-0"}`}
                    >
                      <p className="text-[11px] font-bold tabular-nums text-[#94A3B8]">
                        0{index + 1}
                      </p>
                      <p className="mt-2.5 text-3xl font-extrabold tabular-nums tracking-[-0.01em] text-[#0B3B6E] lg:text-[34px]">
                        {stat}
                      </p>
                      <p className="mt-2.5 text-sm leading-6 text-[#475569]">{description}</p>
                    </div>
                  ))}
                </div>

                {/* Editorial story cards */}
                <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <article className="rounded-[22px] border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_48px_-28px_rgba(11,37,69,0.2)] sm:p-8">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0B3B6E]">
                      01 · De ce am creat această platformă
                    </p>
                    <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.01em] text-[#0F172A]">
                      Proiectele mari se clădesc din pași clari și vizibili
                    </h2>
                    <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#475569]">
                      <p>
                        Construirea unui cămin de la zero este un obiectiv ambițios, cu o investiție
                        totală estimată la{" "}
                        <span className="font-bold text-[#0F172A] tabular-nums">
                          100.000.000 lei
                        </span>
                        . Când vezi o astfel de sumă, este firesc să te întrebi dacă o contribuție
                        de 50 sau 100 de lei chiar poate schimba ceva. Noi credem că proiectele mari
                        se clădesc din pași clari și vizibili.
                      </p>
                      <p>
                        De aceea, am organizat mobilizarea comunității în șase etape lunare
                        transparente, cu un obiectiv de{" "}
                        <span className="font-bold text-[#0F172A] tabular-nums">250.000 lei</span>,
                        direcționat către prima etapă a proiectului: proiectare, avize și
                        autorizații, estimată la{" "}
                        <span className="font-bold text-[#0F172A] tabular-nums">1.250.000 lei</span>
                        . Pe Chip In, părinții, susținătorii și companiile văd în timp real
                        progresul campaniei, își pot calcula impactul, pot contribui direct online
                        și pot lăsa un gând bun primei generații de studenți prin Capsula Timpului.
                      </p>
                    </div>
                  </article>

                  <article className="flex flex-col justify-between rounded-[22px] border border-[#E2E8F0] bg-white p-6 shadow-[0_24px_48px_-28px_rgba(11,37,69,0.2)] sm:p-8">
                    <div>
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0B3B6E]">
                        02 · Transparență și responsabilitate
                      </p>
                      <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.01em] text-[#0F172A]">
                        Comunicare deschisă la fiecare etapă
                      </h2>
                      <p className="mt-4 text-[15px] leading-7 text-[#475569]">
                        Fiecare etapă a proiectului este comunicată deschis, pornind de la reperele
                        publice ale Fundației HIPOLITECH. Contribuțiile atrase direct prin Chip In
                        susțin obiectivul comun de finanțare al noului cămin, iar detaliile tehnice
                        pot evolua pe parcursul fazei de proiectare și avizare.
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3 border-t border-[#E2E8F0] pt-6">
                      <a
                        href="/doneaza"
                        onClick={(event) => {
                          event.preventDefault();
                          navigate("/doneaza");
                        }}
                        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#0B3B6E] px-5 text-sm font-extrabold text-white transition hover:bg-[#0B2545]"
                      >
                        Donează acum <ArrowRightIcon />
                      </a>
                      <a
                        href="/voluntari"
                        onClick={(event) => {
                          event.preventDefault();
                          navigate("/voluntari");
                        }}
                        className="secondary-button inline-flex min-h-11 cursor-pointer items-center"
                      >
                        Devino voluntar
                      </a>
                    </div>
                  </article>
                </div>
              </div>
            </section>
            <SiteFooter />
          </>
        )}
      </main>
    </div>
  );
}
