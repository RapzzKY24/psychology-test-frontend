import { AttemptRunnerIsland } from "@/features/test-taking/components/attempt-runner-island";

/**
 * Thin route: the guest token lives in the browser, so the fetch and the
 * runner itself sit inside the island.
 */
export default async function TesPage({ params }: PageProps<"/tes/kerjakan/[attemptId]">) {
  const { attemptId } = await params;
  return <AttemptRunnerIsland attemptId={attemptId} />;
}
