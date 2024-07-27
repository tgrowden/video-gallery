import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, FieldApi } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

import { fetchWithHeaders } from "../../utils/Api";

interface VideoFormData {
  title: string;

  description: string;

  video: string | number | readonly string[] | undefined;
}

// typing is tedious and unnecessary
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className="text-red-700">{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const MAX_FILE_BYTE_SIZE = 10 * 1024 * 1024;

interface VideoFormProps {
  onSuccess?: (() => void) | (() => Promise<void>);
}

export default function VideoForm({ onSuccess }: VideoFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const c = useQueryClient();

  const form = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      video: undefined
    },

    onSubmit: ({ value }) => {
      const formData = new FormData();
      if (videoFile) {
        formData.append("video", videoFile);
      }
      formData.append("description", value.description);
      formData.append("title", value.title);

      return fetchWithHeaders("/video", "POST", {
        body: formData
      })
        .then(() => c.clear())
        .then(() => {
          return onSuccess?.();
        });
    }
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        form.handleSubmit();
      }}
    >
      <div className="grid gap-6 mb-6 grid-cols-1">
        <form.Field
          name="video"
          validatorAdapter={zodValidator()}
          validators={{
            onSubmit: z
              .string()
              .refine((i) => i.length > 0, {
                message: "Please select a video file"
              })
              .refine(() => (videoFile?.size ?? 0) <= MAX_FILE_BYTE_SIZE, {
                message: `File cannot exceed 10MB`
              })
          }}
          children={(field) => {
            return (
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor={field.name}
                >
                  Video File:
                </label>

                <input
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  id={field.name}
                  type="file"
                  accept="video/x-ms-wmv,video/mp4,video/quicktime"
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    setVideoFile(e.target.files?.[0] ?? null);
                    field.handleChange(e.target.value);
                  }}
                />

                <p className="mt-1 text-sm text-gray-500" id="video_help">
                  MP4, MOV, WMV (Max 10MB).
                </p>

                <FieldInfo field={field} />
              </div>
            );
          }}
        />

        <form.Field
          name="title"
          validatorAdapter={zodValidator()}
          validators={{
            onChange: z
              .string()
              .refine((i) => i.length > 0, { message: "Title is required" })
              .refine((i) => i.length <= 255, {
                message: "Title cannot exceed 255 characters"
              })
          }}
          children={(field) => {
            return (
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor={field.name}
                >
                  Video Title:
                </label>
                <input
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  id={field.name}
                  type="text"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </div>
            );
          }}
        />

        <form.Field
          name="description"
          validatorAdapter={zodValidator()}
          validators={{
            onChange: z.string().refine((i) => i.length > 0, {
              message: "Description is required"
            })
          }}
          children={(field) => {
            return (
              <div>
                <label
                  className="block mb-2 text-sm font-medium text-gray-900"
                  htmlFor={field.name}
                >
                  Video Description:
                </label>
                <textarea
                  rows={2}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />

                <FieldInfo field={field} />
              </div>
            );
          }}
        />

        <div className="w-auto ml-auto mr-auto">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:cursor-default disabled:bg-slate-300"
                type="submit"
                disabled={!canSubmit}
              >
                {isSubmitting ? "..." : "Submit"}
              </button>
            )}
          />
        </div>
      </div>
    </form>
  );
}
