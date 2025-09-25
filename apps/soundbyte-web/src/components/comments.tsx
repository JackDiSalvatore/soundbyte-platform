import { SoundCloudComment } from "@/types/soundcloud-comment";
import Comment from "./comment";

type Props = {
  comments?: SoundCloudComment[] | null;
  title?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
};

export default function Comments({
  comments,
  title,
  onLoadMore,
  hasMore,
  isLoading,
}: Props) {
  if (!comments || comments.length === 0) {
    return (
      <section className="max-w-7xl mx-auto mt-6">
        <div className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground">No Comments.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4">{title ?? "Comments"}: </h3>

      <div className="flex flex-col gap-4">
        {comments.map((c: SoundCloudComment) => (
          <Comment key={c.id} comment={c} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}
