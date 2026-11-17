"use client";

import { useState } from "react";
import { Building2, LogIn, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUTH_COPY } from "../copy";
import { formFor, modeForStatus, toggleMode } from "../gateway";
import type { AuthEntryState, AuthMode, AuthPeran, AuthStatus, EntryStep } from "../gateway";
import { AuthSplitCard } from "./auth-split-card";
import { AuthChoice, AuthChoiceGroup } from "./auth-choice";
import { InstansiSignUpForm } from "./instansi-sign-up-form";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

interface AuthGatewayProps {
  next: string | null;
  initial: AuthEntryState;
}

/**
 * Two questions, then the form they point to. Steps stay client-local so the
 * transition is instant; `next` is carried as a prop instead of rewritten into
 * the URL on every answer.
 */
export function AuthGateway({ next, initial }: AuthGatewayProps) {
  const [step, setStep] = useState<EntryStep>(initial.step);
  // On the first question nothing is selected yet: a preselected answer would
  // make "Lanjut" look answered when the visitor never chose.
  const [peran, setPeran] = useState<AuthPeran | null>(
    initial.step === "peran" ? null : initial.peran,
  );
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [mode, setMode] = useState<AuthMode>(initial.mode);

  const activePeran = peran ?? "pribadi";
  const formKind = formFor(mode, activePeran);

  function backToPeran() {
    setPeran(null);
    setStatus(null);
    setStep("peran");
  }

  const title =
    step === "form"
      ? mode === "masuk"
        ? AUTH_COPY.masuk.title
        : AUTH_COPY.daftar.title
      : AUTH_COPY.gateway.title;
  const description =
    step === "form"
      ? mode === "masuk"
        ? AUTH_COPY.masuk.description
        : AUTH_COPY.daftar.description
      : AUTH_COPY.gateway.description;

  return (
    <AuthSplitCard
      eyebrow={step === "form" ? undefined : AUTH_COPY.gateway.eyebrow}
      title={title}
      description={description}
      footer={
        step === "form" ? (
          <div className="grid gap-2">
            <p>
              {mode === "masuk" ? AUTH_COPY.masuk.footerQuestion : AUTH_COPY.daftar.footerQuestion}{" "}
              <button
                type="button"
                className="text-foreground font-medium underline underline-offset-4"
                onClick={() => setMode(toggleMode(mode))}
              >
                {mode === "masuk" ? AUTH_COPY.masuk.footerAction : AUTH_COPY.daftar.footerAction}
              </button>
            </p>
            <button type="button" className="underline underline-offset-4" onClick={backToPeran}>
              {AUTH_COPY.gateway.changeSelection}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={() => {
              setMode("masuk");
              setStep("form");
            }}
          >
            {AUTH_COPY.gateway.skip}
          </button>
        )
      }
    >
      {step === "peran" ? (
        <div className="grid gap-5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {AUTH_COPY.gateway.stepOne}
          </p>
          <p className="text-base font-semibold">{AUTH_COPY.gateway.peran.question}</p>
          <AuthChoiceGroup label={AUTH_COPY.gateway.peran.question}>
            <AuthChoice
              icon={UserRound}
              label={AUTH_COPY.gateway.peran.pribadi.label}
              description={AUTH_COPY.gateway.peran.pribadi.description}
              selected={peran === "pribadi"}
              onSelect={() => setPeran("pribadi")}
            />
            <AuthChoice
              icon={Building2}
              label={AUTH_COPY.gateway.peran.instansi.label}
              description={AUTH_COPY.gateway.peran.instansi.description}
              selected={peran === "instansi"}
              onSelect={() => setPeran("instansi")}
            />
          </AuthChoiceGroup>
          <Button
            type="button"
            className="h-11 w-full"
            disabled={!peran}
            onClick={() => setStep("status")}
          >
            {AUTH_COPY.gateway.next}
          </Button>
        </div>
      ) : step === "status" ? (
        <div className="grid gap-5">
          <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
            {AUTH_COPY.gateway.stepTwo}
          </p>
          <p className="text-base font-semibold">{AUTH_COPY.gateway.status.question}</p>
          <AuthChoiceGroup label={AUTH_COPY.gateway.status.question}>
            <AuthChoice
              icon={LogIn}
              label={AUTH_COPY.gateway.status.sudah.label}
              description={AUTH_COPY.gateway.status.sudah.description}
              selected={status === "sudah"}
              onSelect={() => setStatus("sudah")}
            />
            <AuthChoice
              icon={Sparkles}
              label={AUTH_COPY.gateway.status.belum.label}
              description={AUTH_COPY.gateway.status.belum.description}
              selected={status === "belum"}
              onSelect={() => setStatus("belum")}
            />
          </AuthChoiceGroup>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11"
              onClick={() => setStep("peran")}
            >
              {AUTH_COPY.gateway.back}
            </Button>
            <Button
              type="button"
              className="h-11 flex-1"
              disabled={!status}
              onClick={() => {
                if (!status) return;
                setMode(modeForStatus(status));
                setStep("form");
              }}
            >
              {AUTH_COPY.gateway.next}
            </Button>
          </div>
        </div>
      ) : formKind === "signin" ? (
        <SignInForm next={next} instansi={activePeran === "instansi"} />
      ) : formKind === "instansi-signup" ? (
        <InstansiSignUpForm />
      ) : (
        <SignUpForm next={next} />
      )}
    </AuthSplitCard>
  );
}
