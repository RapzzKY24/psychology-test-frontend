"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { asOptimistic, useOptimisticList } from "@/lib/hooks/use-optimistic-list";
import { isApiError } from "@/lib/api/client";
import { GENERIC_ERROR_MESSAGE } from "@/lib/api/error";
import { qk } from "@/lib/api/query-keys";
import type { AdminArticleListItem, ArticleInput } from "@/lib/api/types";
import {
  createArticle,
  deleteArticle,
  publishArticle,
  unpublishArticle,
  updateArticle,
  uploadArticleCover,
} from "../api";

const nowIso = () => new Date().toISOString();

export function useCreateArticle(
  listKey: QueryKey,
  onSaved: (id: string) => void,
) {
  const list = useOptimisticList<AdminArticleListItem>(listKey);

  return useMutation({
    mutationFn: async ({ payload, cover }: { payload: ArticleInput; cover: File | null }) => {
      const { data } = await createArticle(payload);
      if (cover) await uploadArticleCover(data.id, cover);
      return data;
    },
    meta: { silentError: true },
    onMutate: async ({ payload }) => {
      const rollback = list.begin();
      list.patch((rows) => [
        asOptimistic({
          id: `optimistic-${Date.now()}`,
          slug: payload.slug,
          title: payload.title,
          excerpt: payload.excerpt,
          coverUrl: null,
          category: payload.category ?? null,
          status: "DRAFT",
          publishedAt: null,
          createdAt: nowIso(),
          updatedAt: nowIso(),
        }),
        ...rows,
      ]);
      return { rollback };
    },
    onError: (error, _vars, context) => {
      context?.rollback();
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSuccess: (data) => {
      toast.success("Artikel disimpan sebagai draf.");
      onSaved(data.id);
    },
    onSettled: () => list.refetch(),
  });
}

export function useUpdateArticle(
  listKey: QueryKey,
  articleId: string,
  onSaved: () => void,
) {
  const list = useOptimisticList<AdminArticleListItem>(listKey);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, cover }: { payload: ArticleInput; cover: File | null }) => {
      const { data } = await updateArticle(articleId, payload);
      if (cover) await uploadArticleCover(articleId, cover);
      return data;
    },
    meta: { silentError: true },
    onMutate: async ({ payload }) => {
      const rollback = list.begin();
      list.patch((rows) =>
        rows.map((row) =>
          row.id === articleId
            ? asOptimistic({
                ...row,
                slug: payload.slug,
                title: payload.title,
                excerpt: payload.excerpt,
                category: payload.category ?? null,
              })
            : row,
        ),
      );
      return { rollback };
    },
    onError: (error, _vars, context) => {
      context?.rollback();
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSuccess: () => {
      toast.success("Artikel diperbarui.");
      void queryClient.invalidateQueries({ queryKey: qk.admin.articles.detail(articleId) });
      onSaved();
    },
    onSettled: () => list.refetch(),
  });
}

function useStatusMutation(
  listKey: QueryKey,
  articleId: string,
  run: (id: string) => Promise<unknown>,
  nextStatus: "DRAFT" | "PUBLISHED",
  successMessage: string,
) {
  const list = useOptimisticList<AdminArticleListItem>(listKey);

  return useMutation({
    mutationFn: () => run(articleId),
    meta: { silentError: true },
    onMutate: async () => {
      const rollback = list.begin();
      list.patch((rows) =>
        rows.map((row) => (row.id === articleId ? asOptimistic({ ...row, status: nextStatus }) : row)),
      );
      return { rollback };
    },
    onError: (error, _vars, context) => {
      context?.rollback();
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSuccess: () => toast.success(successMessage),
    onSettled: () => list.refetch(),
  });
}

export function usePublishArticle(listKey: QueryKey, articleId: string) {
  return useStatusMutation(
    listKey,
    articleId,
    publishArticle,
    "PUBLISHED",
    "Artikel diterbitkan.",
  );
}

export function useUnpublishArticle(listKey: QueryKey, articleId: string) {
  return useStatusMutation(
    listKey,
    articleId,
    unpublishArticle,
    "DRAFT",
    "Artikel dikembalikan ke draf.",
  );
}

export function useDeleteArticle(listKey: QueryKey, articleId: string) {
  const list = useOptimisticList<AdminArticleListItem>(listKey);

  return useMutation({
    mutationFn: () => deleteArticle(articleId),
    meta: { silentError: true },
    onMutate: async () => {
      const rollback = list.begin();
      list.patch((rows) => rows.filter((row) => row.id !== articleId));
      return { rollback };
    },
    onError: (error, _vars, context) => {
      context?.rollback();
      toast.error(isApiError(error) ? error.message : GENERIC_ERROR_MESSAGE);
    },
    onSuccess: () => toast.success("Artikel dihapus."),
    onSettled: () => list.refetch(),
  });
}
