type PromptPrepareBannerProps = {
  title: string;
  body: string;
};

export default function PromptPrepareBanner({ title, body }: PromptPrepareBannerProps) {
  return (
    <aside className="prompt-detail-prepare" aria-label={title}>
      <span className="prompt-detail-prepare-icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M9 2.4c-2.2 0-4 1.7-4 3.8 0 1.4.7 2.6 1.8 3.3v1.7c0 .5.4.9.9.9h2.6c.5 0 .9-.4.9-.9V9.5c1.1-.7 1.8-1.9 1.8-3.3 0-2.1-1.8-3.8-4-3.8Z"
            stroke="#B45309"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M7.4 14.2h3.2" stroke="#B45309" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M7.8 15.6h2.4" stroke="#B45309" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
    </aside>
  );
}
