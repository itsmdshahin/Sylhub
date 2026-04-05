type AuthShellProps = {
  title: string;
  kicker: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  kicker,
  imageSrc,
  imageAlt,
  reverse = false,
  children,
}: AuthShellProps) {
  return (
    <section className="auth-shell">
      <div className="auth-shape one">
        <img src="/assets/images/shape1.svg" alt="" />
      </div>
      <div className="auth-shape two">
        <img src="/assets/images/shape2.svg" alt="" />
      </div>
      <div className="auth-shape three">
        <img src="/assets/images/shape3.svg" alt="" />
      </div>

      <div className="auth-card" style={{ direction: reverse ? "rtl" : "ltr" }}>
        <div className="auth-visual" style={{ direction: "ltr" }}>
          <img src={imageSrc} alt={imageAlt} />
        </div>

        <div className="auth-panel" style={{ direction: "ltr" }}>
          <div className="brand">
            <img src="/assets/images/sitelogos.png" alt="SYL HUB" />
          </div>

          <p className="auth-kicker">{kicker}</p>
          <h1 className="auth-title">{title}</h1>

          {children}
        </div>
      </div>
    </section>
  );
}