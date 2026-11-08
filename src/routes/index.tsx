import { createFileRoute } from "@tanstack/react-router";

// Displays the Studio D.Freitas static site (imported from GitHub into public/dfreitas).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Studio D.Freitas — Prótese Capilar e Barbearia" },
      {
        name: "description",
        content:
          "Studio D.Freitas: prótese capilar com naturalidade absoluta, cuidado e respeito. Agende pelo WhatsApp.",
      },
      { property: "og:title", content: "Studio D.Freitas — Prótese Capilar" },
      {
        property: "og:description",
        content: "Mais que cabelo: autoestima de volta. Agende sua avaliação pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <iframe
      src="/dfreitas/index.html"
      title="Studio D.Freitas — Prótese Capilar"
      className="fixed inset-0 h-full w-full border-0"
      allow="autoplay; fullscreen"
    />
  );
}
