"use client";

import { AttemptCompleteScreen } from "./attempt-complete-screen";
import { DiscItemView } from "./disc-item-view";
import { RightWrongItemView } from "./right-wrong-item-view";
import { RunnerHeader } from "./runner-header";
import { RunnerMobileBar } from "./runner-mobile-bar";
import { RunnerNavPanel } from "./runner-nav-panel";
import { useAttemptRunner } from "../hooks/use-attempt-runner";
import { resolveScorerType } from "../registry";
import type { AttemptRead } from "@/lib/api/types";

interface AttemptRunnerProps {
  attempt: AttemptRead;
  participantToken: string | null;
  homeHref: string;
}

/**
 * Composition only: the hook owns every decision, the child components own
 * their slice of the layout.
 */
export function AttemptRunner({ attempt, participantToken, homeHref }: AttemptRunnerProps) {
  const scorerType = resolveScorerType(attempt);
  const runner = useAttemptRunner({ attempt, participantToken, scorerType });

  if (runner.completed) {
    return <AttemptCompleteScreen homeHref={homeHref} />;
  }

  const navProps = {
    total: runner.total,
    answered: runner.answered,
    activeIndex: runner.safeIndex,
    atStart: runner.safeIndex === 0,
    isLast: runner.isLast,
    currentAnswered: runner.currentAnswered,
    completing: runner.completing,
    onSelect: runner.goTo,
    onPrev: runner.goPrev,
    onNext: runner.goNext,
    onFinish: runner.finish,
  };

  return (
    <main className="flex w-full flex-1 flex-col gap-6 px-4 pt-4 pb-10 sm:px-6 lg:flex-row lg:items-start lg:gap-8 lg:py-10">
      <RunnerMobileBar {...navProps} />

      <div className="flex w-full min-w-0 flex-col gap-6 lg:order-1 lg:w-auto lg:flex-1">
        <RunnerHeader
          testName={attempt.testName}
          answeredCount={runner.answeredCount}
          total={runner.total}
          scorerType={scorerType}
          running={!runner.completed}
        />

        {runner.isRightWrong ? (
          <RightWrongItemView
            order={runner.safeIndex + 1}
            question={(runner.content.question as string | null) ?? null}
            imageUrl={(runner.content.imageUrl as string | null) ?? null}
            options={(runner.content.options as string[]) ?? []}
            value={runner.chosen}
            disabled={false}
            onSelect={runner.selectRightWrong}
          />
        ) : (
          <DiscItemView
            order={runner.safeIndex + 1}
            words={(runner.content.words as string[]) ?? []}
            value={runner.discValue}
            duplicateWarning={runner.duplicateWarning}
            disabled={false}
            onSelect={runner.selectDisc}
          />
        )}
      </div>

      <RunnerNavPanel {...navProps} running={!runner.completed} allAnswered={runner.allAnswered} />
    </main>
  );
}
