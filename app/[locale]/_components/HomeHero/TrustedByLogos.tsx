const LOGOS = [
  { name: "OpenAI", file: "openai.png" },
  { name: "Claude", file: "claude.png" },
  { name: "Gemini", file: "gemini.png" },
  { name: "Zapier", file: "zapier.png" },
  { name: "Notion", file: "notion.png" },
  { name: "Facebook", file: "facebook.png" },
  { name: "WhatsApp", file: "whatsapp.png" },
  { name: "Instagram", file: "instagram.png" },
] as const;

function TrustedByLogos() {
  // repeat the set so the strip is wide enough to loop seamlessly at any viewport width
  const track = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div
      className="relative mb-12 w-full max-w-md overflow-hidden mask-[linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:mb-14 cursor-pointer"
      aria-hidden="true"
    >
      <div className="flex w-max items-center gap-12 animate-[automex-logo-marquee_50s_linear_infinite] hover:paused motion-reduce:animate-none">
        {track.map((logo, i) => (
          <span
            key={`${logo.file}-${i}`}
            role="img"
            aria-label={logo.name}
            className="h-5 w-24 shrink-0 bg-muted-foreground/60 transition-colors duration-300 hover:bg-foreground"
            style={{
              WebkitMaskImage: `url(/tech-logo/${logo.file})`,
              maskImage: `url(/tech-logo/${logo.file})`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes automex-logo-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </div>
  );
}

export default TrustedByLogos;