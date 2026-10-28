"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { QueryKey } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
import type { AdminArticleListItem } from "@/lib/api/types";
import { qk } from "@/lib/api/query-keys";
import { fetchAdminArticleDetail } from "../api";
import {
  ArticleFormSchema,
  buildArticlePayload,
  emptyArticleForm,
  slugify,
  toArticleFormDefaults,
} from "../schemas";
import type { ArticleFormInput } from "../schemas";
import { useCreateArticle, useUpdateArticle } from "../hooks/use-article-mutations";
import { ArticleFormFields } from "./article-form-fields";

interface ArticleFormDialogProps {
  mode: "create" | "edit";
  listKey: QueryKey;
  /** Required in edit mode — supplies the id and the list-level defaults. */
  article?: AdminArticleListItem;
  trigger: ReactNode;
}

/** Admin writes/edits an article: structured blocks + optional cover file. */
export function ArticleFormDialog({ mode, listKey, article, trigger }: ArticleFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const autoSlug = useRef(true);

  const form = useForm<ArticleFormInput>({
    resolver: zodResolver(ArticleFormSchema),
    defaultValues: emptyArticleForm(),
  });

  // Edit mode needs the full body (list rows omit `content`).
  const detail = useQuery({
    queryKey: qk.admin.articles.detail(article?.id ?? ""),
    queryFn: async () => (await fetchAdminArticleDetail(article?.id ?? "")).data,
    enabled: open && mode === "edit" && Boolean(article),
  });

  useEffect(() => {
    if (mode !== "edit" || !detail.data) return;
    form.reset(toArticleFormDefaults(detail.data));
    setCoverPreview(detail.data.coverUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when detail arrives
  }, [detail.data, mode]);

  const onSaved = () => {
    setOpen(false);
    router.refresh();
  };
  const createMutation = useCreateArticle(listKey, onSaved);
  const updateMutation = useUpdateArticle(listKey, article?.id ?? "", onSaved);
  const mutation = mode === "create" ? createMutation : updateMutation;

  const title = form.watch("title");
  useEffect(() => {
    if (mode !== "create" || !autoSlug.current) return;
    form.setValue("slug", slugify(title));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, mode]);

  const pickCover = (file: File | undefined) => {
    if (!file) return;
    setCoverFile(file);
    setCoverPreview((old) => {
      if (old?.startsWith("blob:")) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  };

  const submit = form.handleSubmit((values) => {
    mutation.mutate({ payload: buildArticlePayload(values), cover: coverFile });
  });

  const loadingDetail = mode === "edit" && detail.isLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          form.reset(emptyArticleForm());
          autoSlug.current = true;
          setCoverFile(null);
          setCoverPreview(null);
        } else if (mode === "edit" && article) {
          // Prefer the cached detail (has content); fall back to list fields.
          const d = detail.data;
          form.reset({
            title: d?.title ?? article.title,
            slug: d?.slug ?? article.slug,
            excerpt: d?.excerpt ?? article.excerpt,
            category: d?.category ?? article.category ?? "",
            content: d?.content ?? [],
          });
          setCoverPreview(d?.coverUrl ?? article.coverUrl);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Tulis Artikel" : "Edit Artikel"}</DialogTitle>
          <DialogDescription>
            Artikel disimpan sebagai draf. Terbitkan dari tabel setelah selesai.
          </DialogDescription>
        </DialogHeader>

        {loadingDetail ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" aria-hidden />
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="grid gap-4">
            <ArticleFormFields
              form={form}
              disabled={mutation.isPending}
              coverPreview={coverPreview}
              onPickCover={pickCover}
              onSlugEdited={() => (autoSlug.current = false)}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending || loadingDetail}>
                {mutation.isPending ? "Menyimpan..." : "Simpan Draf"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
