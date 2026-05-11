export function SiteFooter() {
  return (
    <footer className="pt-4 text-center text-sm text-muted">
      <p>
        © {new Date().getFullYear()} {`—`} Built with{" "}
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-heading hover:underline"
        >
          Next.js
        </a>
      </p>
    </footer>
  );
}
