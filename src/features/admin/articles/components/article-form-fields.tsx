"use client";

import type { UseFormReturn } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ArticleFormInput } from "../schemas";
import { ArticleBlocksEditor } from "./article-blocks-editor";

interface ArticleFormFieldsProps {
  form: UseFormReturn<ArticleFormInput>;
  disabled: boolean;
  coverPreview: string | null;
  onPickCover: (file: File | undefined) => void;
  onSlugEdited: () => void;
}

/** Title/slug/excerpt/category/cover/body — validation comes from the form. */
export function ArticleFormFields({
  form,
  disabled,
  coverPreview,
  onPickCover,
  onSlugEdited,
}: ArticleFormFieldsProps) {
  const titleError = form.formState.errors.title;
  const slugError = form.formState.errors.slug;
  const excerptError = form.formState.errors.excerpt;
  const contentError = form.formState.errors.content;
  const content = form.watch("content");

  return (
    <>
      <Field data-invalid={titleError ? true : undefined}>
        <FieldLabel htmlFor="article-title">Judul</FieldLabel>
        <Input
          id="article-title"
          disabled={disabled}
          aria-invalid={titleError ? true : undefined}
          {...form.register("title")}
        />
        {titleError && <FieldError errors={[titleError]} />}
      </Field>

      <Field data-invalid={slugError ? true : undefined}>
        <FieldLabel htmlFor="article-slug">Slug</FieldLabel>
        <Input
          id="article-slug"
          disabled={disabled}
          aria-invalid={slugError ? true : undefined}
          {...form.register("slug", { onChange: onSlugEdited })}
        />
        <FieldDescription>URL publik: /artikel/&lt;slug&gt;.</FieldDescription>
        {slugError && <FieldError errors={[slugError]} />}
      </Field>

      <Field data-invalid={excerptError ? true : undefined}>
        <FieldLabel htmlFor="article-excerpt">Ringkasan</FieldLabel>
        <Input
          id="article-excerpt"
          disabled={disabled}
          aria-invalid={excerptError ? true : undefined}
          {...form.register("excerpt")}
        />
        {excerptError && <FieldError errors={[excerptError]} />}
      </Field>

      <Field>
        <FieldLabel htmlFor="article-category">Kategori (opsional)</FieldLabel>
        <Input
          id="article-category"
          placeholder="mis. Kesehatan Mental"
          disabled={disabled}
          {...form.register("category")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="article-cover">Sampul (opsional)</FieldLabel>
        {coverPreview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local upload URL
          <img
            src={coverPreview}
            alt="Pratinjau sampul"
            className="mb-2 max-h-40 rounded-md border object-cover"
          />
        ) : null}
        <Input
          id="article-cover"
          type="file"
          accept="image/png,image/jpeg"
          disabled={disabled}
          onChange={(e) => {
            onPickCover(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <FieldDescription>PNG/JPG, maksimal 2MB.</FieldDescription>
      </Field>

      <Field data-invalid={contentError ? true : undefined}>
        <FieldLabel>Isi Artikel</FieldLabel>
        <ArticleBlocksEditor
          value={content}
          invalid={Boolean(contentError)}
          onChange={(blocks) =>
            form.setValue("content", blocks, { shouldValidate: true, shouldDirty: true })
          }
        />
        {contentError && <FieldError errors={[contentError]} />}
      </Field>
    </>
  );
}
