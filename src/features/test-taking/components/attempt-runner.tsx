"use client";

import { AttemptCompleteScreen } from "./attempt-complete-screen";
import { DiscItemView } from "./disc-item-view";
import { LikertItemView } from "./likert-item-view";
import { MarkGroupItemView } from "./mark-group-item-view";
import { PairItemView } from "./pair-item-view";
import { RankGroupItemView } from "./rank-group-item-view";
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
          remainingSeconds={runner.remainingSeconds}
        />

        {runner.usesMarkView ? (
          <MarkGroupItemView
            order={runner.safeIndex + 1}
            question={(runner.content.question as string | null) ?? null}
            options={(runner.content.options as string[]) ?? []}
            marks={runner.marks}
            disabled={runner.timeUp}
            onChange={runner.mark}
          />
        ) : runner.usesRankView ? (
          <RankGroupItemView
            order={runner.safeIndex + 1}
            question={(runner.content.question as string | null) ?? null}
            options={(runner.content.options as string[]) ?? []}
            ranks={runner.ranks}
            disabled={runner.timeUp}
            onRank={runner.rank}
          />
        ) : runner.usesRatingView ? (
          <LikertItemView
            order={runner.safeIndex + 1}
            text={(runner.content.text as string | null) ?? ""}
            min={typeof runner.content.min === "number" ? runner.content.min : 1}
            max={typeof runner.content.max === "number" ? runner.content.max : 5}
            labels={
              Array.isArray(runner.content.labels)
                ? (runner.content.labels as string[])
                : undefined
            }
            rating={runner.rating}
            disabled={runner.timeUp}
            onRate={runner.rate}
          />
        ) : runner.isPair ? (
          <PairItemView
            order={runner.safeIndex + 1}
            question={(runner.content.question as string | null) ?? null}
            statements={(runner.content.statements as string[]) ?? []}
            value={runner.pairChoice}
            disabled={runner.timeUp}
            onChoose={runner.choosePair}
          />
        ) : runner.usesChoiceView ? (
          <RightWrongItemView
            order={runner.safeIndex + 1}
            question={(runner.content.question as string | null) ?? null}
            imageUrl={(runner.content.imageUrl as string | null) ?? null}
            options={(runner.content.options as string[]) ?? []}
            mode={runner.mode}
            multi={runner.multi}
            chosen={runner.chosen}
            text={runner.text}
            disabled={runner.timeUp}
            onChoose={runner.chooseRightWrong}
            onText={runner.typeRightWrong}
          />
        ) : (
          <DiscItemView
            order={runner.safeIndex + 1}
            words={(runner.content.words as string[]) ?? []}
            value={runner.discValue}
            duplicateWarning={runner.duplicateWarning}
            disabled={runner.timeUp}
            onSelect={runner.selectDisc}
          />
        )}
      </div>

      <RunnerNavPanel
        {...navProps}
        running={!runner.completed}
        allAnswered={runner.allAnswered}
        remainingSeconds={runner.remainingSeconds}
      />
    </main>
  );
}
