import { topicAugmentations, type TopicAugmentation, type TopicAugmentationBoard } from "@/generated/topicAugmentations";

export function getTopicAugmentation(slug: string, board: TopicAugmentationBoard | "all"): TopicAugmentation | null {
  if (!slug) return null;

  if (board !== "all") {
    const exact = topicAugmentations.find((item) => item.slug === slug && item.board === board);
    if (exact) return exact;
  }

  return topicAugmentations.find((item) => item.slug === slug) || null;
}
