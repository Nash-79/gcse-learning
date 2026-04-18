import {
  boardLibraryResources,
  topicLibraryResources,
  type BoardLibraryResource,
  type LibraryBoard,
  type LibraryResourceKind,
  type TopicLibraryResource,
} from "@/generated/contentLibraryManifest";

export interface GroupedTopicLibraryResources {
  textbook: TopicLibraryResource[];
  assessmentOverview: TopicLibraryResource[];
  assessmentSets: TopicLibraryResource[];
  longAnswer: TopicLibraryResource[];
}

const EMPTY_GROUPS: GroupedTopicLibraryResources = {
  textbook: [],
  assessmentOverview: [],
  assessmentSets: [],
  longAnswer: [],
};

function uniqueByPath<T extends { relativePath: string }>(items: T[]) {
  return items.filter((item, index, all) =>
    all.findIndex((candidate) => candidate.relativePath === item.relativePath) === index
  );
}

export function getTopicLibraryResources(slug: string, board: LibraryBoard | "all") {
  const matches = topicLibraryResources.filter((resource) =>
    resource.slug === slug && (board === "all" || resource.board === board)
  );

  const deduped = uniqueByPath(matches);
  return deduped.reduce<GroupedTopicLibraryResources>((groups, resource) => {
    if (resource.kind === "textbook") groups.textbook.push(resource);
    if (resource.kind === "assessment-overview") groups.assessmentOverview.push(resource);
    if (resource.kind === "assessment-set") groups.assessmentSets.push(resource);
    if (resource.kind === "long-answer") groups.longAnswer.push(resource);
    return groups;
  }, {
    textbook: [],
    assessmentOverview: [],
    assessmentSets: [],
    longAnswer: [],
  });
}

export function hasTopicLibraryResources(slug: string, board: LibraryBoard | "all") {
  const groups = getTopicLibraryResources(slug, board);
  return Object.values(groups).some((group) => group.length > 0);
}

export function getBoardLibraryResources(board: LibraryBoard | "all", kinds?: LibraryResourceKind[]) {
  const resources = boardLibraryResources.filter((resource) =>
    (board === "all" || resource.board === board) &&
    (!kinds || kinds.includes(resource.kind))
  );
  return uniqueByPath(resources);
}

export function getPrintablePastPaperResources(board: LibraryBoard | "all") {
  return getBoardLibraryResources(board, ["past-paper", "mark-scheme", "specification"]);
}

export function isTopicResourceGroupEmpty(groups: GroupedTopicLibraryResources) {
  return Object.values(groups).every((group) => group.length === 0);
}

export { EMPTY_GROUPS };
export type { BoardLibraryResource, TopicLibraryResource };
