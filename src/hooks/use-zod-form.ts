import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldValues,
  type UseFormProps,
  useForm,
} from "react-hook-form";
import { type z, type ZodType } from "zod";

export function useZodForm<TSchema extends ZodType<FieldValues>>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">,
) {
  return useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    ...options,
  });
}
