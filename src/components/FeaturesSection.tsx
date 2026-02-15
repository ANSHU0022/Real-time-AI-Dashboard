const featureCards = [
  {
    title: "Real-time data",
    image:
      "https://images.unsplash.com/photo-1686061593213-98dad7c599b9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
    points: [
      "Live sheet sync in seconds",
      "New rows appear instantly",
      "KPI tiles refresh automatically",
      "Filters update without reload",
      "Data table stays in sync",
      "Zero manual imports",
    ],
  },
  {
    title: "Multiple dashboards",
    image: "https://cdn.stocksnap.io/img-thumbs/960w/team-meeting_2R1OMUFVO5.jpg",
    points: [
      "Sales, Marketing, HR, Support, Finance",
      "Role-based views per team",
      "Unified metrics across departments",
      "Drill-down by region and product",
      "Cross-team visibility in one hub",
      "Decision-ready summaries",
    ],
  },
  {
    title: "AI chatting support",
    image:
      "https://images.unsplash.com/photo-1762330467475-a565d04e1808?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1600",
    points: [
      "Ask questions in natural language",
      "AI reads your live data",
      "Gemini 2.5 LLM core",
      "N8N orchestration workflows",
      "Answers with context and charts",
      "Team-ready insights in seconds",
    ],
  },
  {
    title: "AI report generate",
    image:
      "https://cdn.pixabay.com/photo/2017/10/17/14/10/financial-2860753_1280.jpg",
    points: [
      "Select start and end dates",
      "Auto insights and anomalies",
      "PDF report generation",
      "Weekly and monthly delivery",
      "Email to stakeholders",
      "Executive summary included",
    ],
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Features
          </p>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Everything your teams need to move faster
          </h2>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Four key capabilities that power your company-wide analytics and AI workflow.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featureCards.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-3xl border border-border/60 bg-card/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-44 overflow-hidden sm:h-52">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              </div>
              <div className="space-y-4 p-5">
                <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {card.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
