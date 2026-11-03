type BlogsLoadMoreProps = {
  onClick: () => void;
};

export default function BlogsLoadMore({ onClick }: BlogsLoadMoreProps) {
  return (
    <div className="blogs-load">
      <button type="button" onClick={onClick}>
        Load More Technical Roadmaps
        <img src="/images/blogs/ea9a7.svg" alt="" />
      </button>
    </div>
  );
}
