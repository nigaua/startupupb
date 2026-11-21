import { type FormEvent, useEffect, useState } from "react";

type PageRoute = "/" | "/doneaza" | "/voluntari" | "/faq" | "/despre-noi";

const monthlyTargets = [20000, 30000, 40000, 45000, 55000, 60000];
const quickAmounts = { person: [50, 100, 250], company: [500, 1000, 2500] };
const DEFAULT_MESSAGE = "Mult succes în prima sesiune! Să vă fie acest loc un început bun.";
const DEFAULT_NAME = "Un susținător HIPOLITECH";

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

/* Hairline façade drawing: the project is in its design stage, so the hero shows a blueprint. */
function DormElevation() {
  const floors = [0, 1, 2, 3, 4, 5];
  const columns = [0, 1, 2, 3, 4];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 440 540"
      fill="none"
      stroke="currentColor"
      className="pointer-events-none absolute bottom-0 right-10 hidden h-[78%] max-h-[620px] w-auto text-white opacity-[0.16] xl:block"
    >
      <path d="M0 500H440" strokeWidth="1.5" />
      <rect x="60" y="80" width="300" height="420" strokeWidth="1.5" />
      <path d="M60 100H360M52 80H368" strokeWidth="1" />
      {floors.map((floor) =>
        columns.map((column) => {
          const isEntrance = floor === 5 && column === 2;
          return isEntrance ? null : (
            <rect
              key={`${floor}-${column}`}
              x={85 + column * 55}
              y={118 + floor * 62}
              width="30"
              height="36"
              strokeWidth="1"
            />
          );
        }),
      )}
      <path d="M185 500V440H235V500M210 440V500" strokeWidth="1" />
      <path d="M398 80V500M392 86l12-12M392 506l12-12M380 80h24M380 500h24" strokeWidth="0.75" />
      <path d="M60 522H360M54 528l12-12M354 528l12-12M60 512v18M360 512v18" strokeWidth="0.75" />
      <text
        x="418"
        y="290"
        fill="currentColor"
        stroke="none"
        fontSize="10"
        letterSpacing="2"
        transform="rotate(90 418 290)"
        textAnchor="middle"
      >
        ETAPA 1 · PROIECTARE
      </text>
      <text
        x="210"
        y="538"
        fill="currentColor"
        stroke="none"
        fontSize="10"
        letterSpacing="2"
        textAnchor="middle"
      >
        NOUL CĂMIN UPB · FAȚADĂ DE PRINCIPIU
      </text>
    </svg>
  );
}

export default function App() {
  const [route, setRoute] = useState<PageRoute>(() => normalizeRoute(window.location.pathname));

  // Donation simulator & Capsula state
  const [supporterType, setSupporterType] = useState<"person" | "company">("person");
  const [month, setMonth] = useState(0);
  const [amount, setAmount] = useState(100);
  const [frequency, setFrequency] = useState<"once" | "monthly">("monthly");
  const [donationConfirmed, setDonationConfirmed] = useState(false);
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

  const target = monthlyTargets[month];
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
    setAmount(quickAmounts[type][1]);
    setDonationConfirmed(false);
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
    const text = encodeURIComponent(`„${cardMessage}” — ${cardName}\nCampanie HIPOLITECH`);
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
    `rounded-[9px] px-3 py-2 text-[13px] font-bold transition ${
      active
        ? "bg-white text-[#0B3B6E] shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
        : "text-[#64748B] hover:text-[#0F172A]"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A]">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0B2545]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-5 lg:px-10">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault();
              navigate("/");
            }}
            aria-label="chip in — Acasă"
            className="flex shrink-0 items-center"
          >
            <img
              src="/logo-chipin.png"
              alt="chip in"
              className="h-8 w-auto select-none sm:h-9"
            />
          </a>

          <nav
            aria-label="Navigație principală"
            className="flex items-center gap-5 text-xs font-semibold text-white/70 sm:gap-9 sm:text-sm"
          >
            <a
              className="nav-link"
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
              className="nav-link"
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
              className="nav-link"
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
              className="nav-link"
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
            <div className="relative mx-auto flex w-full max-w-[1320px] flex-1 flex-col justify-center px-5 pb-20 pt-10 sm:py-20 lg:px-10 lg:py-12">
              <DormElevation />

              <p className="mb-6 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
                <span className="h-px w-8 bg-white/40" />
                Fundația HIPOLITECH ·{" "}
                <span className="sm:hidden">UPB</span>
                <span className="hidden sm:inline">Universitatea Politehnica din București</span>
              </p>
              <h1 className="relative max-w-[760px] text-balance text-[40px] font-bold leading-[1.1] tracking-normal sm:text-6xl xl:text-[68px]">
                Un loc în cămin poate schimba un destin!
              </h1>

              <div className="relative mt-6 max-w-[640px] space-y-4 text-pretty sm:mt-8">
                <p className="text-lg leading-[1.6] text-white sm:text-xl">
                  Pentru mulți tineri veniți din alte orașe, primul an la Politehnică începe cu o
                  întrebare grea: unde voi locui?
                </p>
                <p className="text-base leading-[1.7] text-[#CBD5E1] sm:text-[17px]">
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
                  className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-white px-4 text-[15px] font-bold text-[#0B2545] transition-[background-color,scale] duration-150 ease-out hover:bg-[#F7F6F2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.96] sm:pe-6 sm:ps-7"
                >
                  Donează acum <ArrowRightIcon />
                </a>
                <a
                  href="/voluntari"
                  onClick={(event) => {
                    event.preventDefault();
                    navigate("/voluntari");
                  }}
                  className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-lg border border-white/40 px-4 text-[15px] font-bold text-white transition-[background-color,border-color,scale] duration-150 ease-out hover:border-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.96] sm:px-7"
                >
                  Devino voluntar
                </a>
              </div>
            </div>
          </section>
        )}

        {route === "/doneaza" && (
          <>
            {/* SIMULATOR — warm paper */}
            <section
              id="simulator"
              className="scroll-mt-16 border-b border-[#E2E8F0] bg-[#F7F6F2] px-5 py-16 lg:px-10 lg:py-24"
            >
              <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[42fr_58fr] lg:gap-16 xl:gap-20">
                <div className="lg:pt-6">
                  <p className="section-kicker">Simulator</p>
                  <h2 className="section-title">Vezi cum contează contribuția ta</h2>
                  <p className="section-subtitle">
                    Obiectivul simulat este de 250.000 de lei în 6 luni, parte din prima etapă a
                    proiectului: proiectare, avize și autorizații (1.250.000 de lei).
                  </p>
                  <div className="mt-8 grid max-w-[500px] grid-cols-2 border-y border-[#E2E8F0]">
                    {[
                      ["Etapa 1", "1.250.000 lei"],
                      ["Țintă 6 luni", "250.000 lei"],
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

                {/* Simulator card */}
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
                      <div className="mb-2.5 flex items-baseline justify-between">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#64748B]">
                          Foaie de parcurs
                        </p>
                        <p className="text-[13px] font-bold tabular-nums text-[#0B3B6E]">
                          Ținta lunii {month + 1}: {formatLei(target)} lei
                        </p>
                      </div>
                      <div className="grid grid-cols-6 gap-1">
                        {monthlyTargets.map((value, index) => {
                          const active = month === index;
                          const passed = index < month;
                          return (
                            <button
                              type="button"
                              key={index}
                              onClick={() => setMonth(index)}
                              aria-pressed={active}
                              className="group text-left"
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
                                  Luna {index + 1}
                                </span>
                              </span>
                              <span className="mt-0.5 hidden pl-3 text-[10px] font-semibold tabular-nums text-[#94A3B8] sm:block">
                                {formatLei(value / 1000)}k
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
                              strânși (simulat)
                            </span>
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-[#64748B]">
                            • 124 susținători
                          </p>
                        </div>
                        <p className="pb-0.5 text-right text-sm font-extrabold tabular-nums text-[#0B3B6E]">
                          62% <span className="font-semibold text-[#64748B]">din ținta lunii</span>
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
                        Cu această contribuție, mai sunt necesari doar{" "}
                        <span className="rounded bg-[#FEF3C7] px-1 font-extrabold tabular-nums text-[#B45309]">
                          {supportersNeeded} susținători
                        </span>{" "}
                        pentru a atinge ținta lunii {month + 1}.
                      </p>
                      <p className="mt-2.5 border-t border-[#E2E8F0] pt-2.5 text-[11px] leading-4 text-[#64748B]">
                        Contribuie la Etapa 1 (proiectare, avize, autorizații): 1.250.000 lei.
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
                              className={`h-11 rounded-xl border text-[13px] font-extrabold tabular-nums transition ${
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
                        <span className="field-label truncate">Sumă demonstrativă (lei)</span>
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

                    <button
                      type="button"
                      onClick={() => setDonationConfirmed(true)}
                      className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#0B3B6E] px-5 py-3.5 text-center text-sm font-extrabold text-white shadow-[0_10px_24px_-6px_rgba(11,59,110,0.55)] transition hover:-translate-y-px hover:bg-[#0B2545]"
                    >
                      Donează {formatLei(totalContribution)} lei →
                    </button>

                    {donationConfirmed && (
                      <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm font-semibold text-[#166534]">
                        <CheckIcon />
                        Contribuție demonstrativă de {formatLei(totalContribution)} lei înregistrată.
                      </div>
                    )}

                    <p className="mt-2.5 text-center text-[11px] leading-4 text-[#64748B]">
                      Simulare educațională. Contribuțiile susțin proiectul comun și nu oferă
                      rezervări sau drepturi de cazare.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CAPSULA — warm off-white */}
            <section id="capsula" className="scroll-mt-16 bg-[#F7F6F2] px-5 py-20 lg:px-10 lg:py-28">
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
                        <span className="field-label">Nume / Inițiale (fictiv în demo)</span>
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
                      <button type="button" onClick={generateCard} className="primary-button mt-3">
                        Generează Cardul de Susținător (Demo)
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
                              Susținător simbolic • Campanie HIPOLITECH (Demo)
                            </p>
                          </div>
                          <p className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#F5D9A8]/70 sm:block">
                            UPB · 2025
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button type="button" onClick={shareWhatsApp} className="secondary-button">
                        Distribuie pe WhatsApp
                      </button>
                      <button type="button" onClick={copyMessage} className="secondary-button">
                        {copied ? "Mesaj copiat" : "Copiază mesajul"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* TRANSPARENȚĂ — soft slate */}
            <section className="border-t border-[#E2E8F0] bg-[#F1F5F9] px-5 py-20 lg:px-10 lg:py-24">
              <div className="mx-auto max-w-[1240px]">
                <div id="transparenta" className="scroll-mt-24">
                  <p className="section-kicker">Unde merg contribuțiile</p>
                  <div className="mt-6 grid border-y border-[#CBD5E1] md:grid-cols-3">
                    {[
                      [
                        "1.250.000 lei",
                        "Etapa 1: proiectare, avize și autorizații (estimare Fundație).",
                      ],
                      [
                        "250.000 lei",
                        "Ținta exercițiului pe 6 luni, împărțită în 6 etape lunare transparente.",
                      ],
                      [
                        "100% direct",
                        "Fără intermediari. Fiecare contribuție susține direct noul cămin UPB.",
                      ],
                    ].map(([stat, description], index) => (
                      <div
                        key={stat}
                        className={`py-9 md:px-8 lg:px-10 ${index > 0 ? "border-t border-[#CBD5E1] md:border-l md:border-t-0" : "md:pl-0"}`}
                      >
                        <p className="text-[11px] font-bold tabular-nums text-[#94A3B8]">
                          0{index + 1}
                        </p>
                        <p className="mt-3 text-[34px] font-extrabold tabular-nums tracking-[-0.01em] text-[#0B3B6E] lg:text-[42px]">
                          {stat}
                        </p>
                        <p className="mt-3 max-w-[320px] text-sm leading-6 text-[#475569]">
                          {description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <footer className="blueprint px-5 py-10 text-white lg:px-10">
              <div className="mx-auto flex max-w-[1240px] flex-col gap-4 text-xs leading-5 text-[#94A3B8] sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img src="/logo-chipin.png" alt="chip in" className="h-7 w-auto" />
                  <p>Fundația HIPOLITECH · Universitatea Politehnica din București</p>
                </div>
                <p>Un loc în cămin poate schimba un destin!</p>
              </div>
            </footer>
          </>
        )}

        {route === "/voluntari" && (
          <section className="flex-1 bg-[#F7F6F2] px-5 py-16 lg:px-10 lg:py-24">
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

                    <button type="submit" className="primary-button">
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
                        className="shrink-0 text-xs font-extrabold text-[#166534] underline underline-offset-2 hover:text-[#14532D]"
                      >
                        Trimite altă înscriere
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {route === "/faq" && (
          <section className="flex-1 bg-[#F7F6F2]" aria-label="FAQ" />
        )}

        {route === "/despre-noi" && (
          <section className="flex-1 bg-[#F7F6F2]" aria-label="Despre noi" />
        )}
      </main>
    </div>
  );
}
