"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTestSchema, slugify } from "../schemas";
import { DEFAULT_SCORER_BY_CATEGORY } from "../scorers";
import type { CreateTestInput } from "../schemas";
import { useCreateTest } from "../hooks/use-create-test";
import { CreateTestFields } from "./create-test-fields";

export function CreateTestButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [scorerEdited, setScorerEdited] = useState(false);

  const form = useForm<CreateTestInput>({
    resolver: zodResolver(CreateTestSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      category: "PERSONALITY",
      scorerType: "FORCED_CHOICE_DISC",
      price: 0,
      estimatedDurationMin: 20,
    },
  });

  const name = form.watch("name");
  const category = form.watch("category");
  useEffect(() => {
    if (!slugEdited) {
      form.setValue("slug", slugify(name), { shouldDirty: true });
    }
  }, [name, slugEdited, form]);

  // Category only suggests a scorer type; a deliberate pick is never overridden.
  useEffect(() => {
    if (!scorerEdited) {
      form.setValue("scorerType", DEFAULT_SCORER_BY_CATEGORY[category]);
    }
  }, [category, scorerEdited, form]);

  const mutation = useCreateTest({
    onSlugTaken: () =>
      form.setError("slug", { message: "Slug sudah dipakai tes lain." }),
    onCreated: (created) => {
      setOpen(false);
      form.reset();
      setSlugEdited(false);
      setScorerEdited(false);
      router.push(`/admin/tes/${created.id}`);
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          form.reset();
          setSlugEdited(false);
          setScorerEdited(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" aria-hidden />
          Buat Tes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buat Tes Baru</DialogTitle>
          <DialogDescription>
            Tes lahir sebagai DRAFT — lengkapi soal dan interpretasi sebelum publish.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((v) => mutation.mutateAsync(v))}
          noValidate
          className="grid gap-4"
        >
          <CreateTestFields
            form={form}
            onSlugTyped={() => setSlugEdited(true)}
            onScorerTyped={() => setScorerEdited(true)}
          />
          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Menyimpan..." : "Buat Tes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
