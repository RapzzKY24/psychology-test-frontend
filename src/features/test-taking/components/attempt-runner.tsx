"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AttemptCompleteScreen } from "./attempt-complete-screen";
import { AttemptSaveAlert } from "./attempt-save-alert";
import { DiscItemView } from "./disc-item-view";
import { LikertItemView } from "./likert-item-view";
import { ManualItemView } from "./manual-item-view";
import { MarkGroupItemView } from "./mark-group-item-view";
import { OptionScaleItemView } from "./option-scale-item-view";
import { PairItemView } from "./pair-item-view";
import { RankGroupItemView } from "./rank-group-item-view";
import { RightWrongItemView } from "./right-wrong-item-view";
import { RunnerHeader } from "./runner-header";
import { RunnerMobileBar } from "./runner-mobile-bar";
import { RunnerNavPanel } from "./runner-nav-panel";
import { TimedGridItemView } from "./timed-grid-item-view";
import { useAttemptRunner } from "../hooks/use-attempt-runner";
import { resolveScorerType } from "../registry";
import type { AttemptRead, ManualMark } from "@/lib/api/types";

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
    // The last lajur of a timed grid may be submitted while still empty: the
    // clock would end the test anyway, and the scorer counts blanks as wrong.
    currentAnswered: runner.currentAnswered || (runner.usesTimedGridView && runner.isLast),
    completing: runner.completing,
    onSelect: runner.goTo,
    onPrev: runner.goPrev,
    onNext: runner.goNext,
    onFinish: runner.finish,
  };

  return (
    <main className="flex w-full flex-1 flex-col gap-6 px-4 pt-4 pb-10 sm:px-6 lg:flex-row lg:flex-wrap lg:items-start lg:gap-8 lg:py-10">
      {runner.savingFailed ? (
        <div className="w-full">
          <AttemptSaveAlert
            attemptId={attempt.id}
            expired={runner.timeUp}
            canRetry={runner.canRetryFailed}
            onRetry={() => void runner.retryFailed()}
          />
        </div>
      ) : null}
      <RunnerMobileBar {...navProps} locked={runner.usesTimedGridView} />

      <div className="flex w-full min-w-0 flex-col gap-6 lg:order-1 lg:w-auto lg:flex-1">
        <RunnerHeader
          testName={attempt.testName}
          answeredCount={runner.answeredCount}
          total={runner.total}
          scorerType={scorerType}
          running={!runner.completed}
          remainingSeconds={runner.remainingSeconds}
        />

        {runner.usesTimedGridView ? (
          <TimedGridItemView
            column={
              typeof runner.content.column === "number" ? runner.content.column : 1
            }
            digits={
              Array.isArray(runner.content.digits)
                ? (runner.content.digits as number[])
                : []
            }
            answers={runner.timedGridAnswers}
            disabled={runner.timeUp}
            onChange={runner.answerTimedGrid}
            onComplete={runner.finishTimedGridColumn}
            onSkip={runner.skipTimedGridColumn}
            isLast={runner.isLast}
          />
        ) : runner.usesManualView && runner.item ? (
          <ManualItemView
            key={runner.item.id}
            attemptId={attempt.id}
            itemId={runner.item.id}
            box={typeof runner.content.box === "number" ? runner.content.box : 1}
            mark={runner.content.mark as ManualMark}
            imageUrl={runner.manualImageUrl}
            participantToken={participantToken}
            disabled={runner.timeUp}
            onSaved={runner.saveManualDrawing}
            onDirtyChange={runner.setManualDirty}
          />
        ) : runner.usesMarkView ? (
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
        ) : runner.usesOptionView ? (
          <OptionScaleItemView
            order={runner.safeIndex + 1}
            text={(runner.content.text as string | null) ?? ""}
            options={(runner.content.options as string[]) ?? []}
            chosen={runner.optionChoice}
            disabled={runner.timeUp}
            onChoose={runner.chooseOption}
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
        locked={runner.usesTimedGridView}
      />

      <AlertDialog
        open={runner.pendingNavigation}
        onOpenChange={(open) => {
          if (!open) runner.cancelNavigation();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Gambar belum disimpan</AlertDialogTitle>
            <AlertDialogDescription>
              Goresan di kotak ini akan hilang kalau Anda pindah tanpa menekan
              Simpan gambar. Kembali dan simpan dulu, atau tinggalkan gambar ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Kembali menggambar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={runner.confirmNavigation}>
              Tinggalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
