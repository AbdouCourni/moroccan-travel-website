// // components/ReviewsSection.tsx
// import { getPlaceReviews, getPlaceReviewStats } from '../lib/firebase-server';
// import PlaceReviews from './PlaceReviews';

// interface Props {
//   targetType: 'destination' | 'place';
//   targetId: string;
//   placeName: string;
// }

// export default async function ReviewsSection({ targetType, targetId, placeName }: Props) {
//   const [reviews, reviewStats] = await Promise.all([
//     getPlaceReviews(targetId),
//     getPlaceReviewStats(targetId),
//   ]);

//   return (
//     <PlaceReviews
//       targetType={targetType}
//       targetId={targetId}
//       placeName={placeName}
//       initialReviews={reviews}
//       reviewStats={reviewStats}
//     />
//   );
// }
