import * as React from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  user_id: string | null;
  user_name?: string; // Optional user name mapping
  verified_purchase: boolean;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

function StarRating({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`size-4 ${
            star <= rating ? "fill-amber-400 text-amber-400" : "fill-border text-border"
          }`}
        />
      ))}
    </div>
  );
}

export function ProductReviews({ productId, rating, reviewCount, reviews }: ProductReviewsProps) {
  if (reviewCount === 0) {
    return (
      <div className="rounded-2xl border border-border bg-paper p-8 text-center space-y-4">
        <h3 className="font-display text-xl font-bold">No Reviews Yet</h3>
        <p className="text-sm text-muted-foreground">Be the first to review this product!</p>
      </div>
    );
  }

  // Distribution
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="rounded-2xl border border-border bg-paper p-6 sm:p-8 space-y-8">
      {/* Header & Aggregate */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-4 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="space-y-1">
            <h2 className="font-display text-2xl font-extrabold text-ink">Customer Reviews</h2>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <StarRating rating={Math.round(rating)} />
              <span className="font-bold text-lg">{Number(rating).toFixed(1)} out of 5</span>
            </div>
            <p className="text-xs text-muted-foreground">Based on {reviewCount} reviews</p>
          </div>
        </div>

        <div className="md:col-span-8 space-y-2 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
          {distribution.map((d) => (
            <div key={d.stars} className="flex items-center gap-4 text-sm">
              <span className="w-12 whitespace-nowrap text-muted-foreground">{d.stars} star</span>
              <div className="h-2 flex-1 rounded-full bg-border/50 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${d.percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground text-xs">{d.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-3 pb-6 border-b border-border/50 last:border-0 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  {review.title && <h4 className="font-bold text-sm text-ink ml-2">{review.title}</h4>}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-ink">{review.user_name || "Anonymous Customer"}</span>
                  {review.verified_purchase && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="size-3" />
                      Verified Purchase
                    </span>
                  )}
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            {review.comment && <p className="text-sm text-ink/80 leading-relaxed">{review.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
