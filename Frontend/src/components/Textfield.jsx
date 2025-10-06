import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

export function RHFTextField({ name, label, rules, ...props }) {
  const { control } = useFormContext(); // pega o control do contexto

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value ?? ""}
          label={label}
          fullWidth
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          {...props}
        />
      )}
    />
  );
}
