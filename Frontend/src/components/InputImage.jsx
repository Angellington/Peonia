import { Box, Button } from "@mui/material";
import { useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

const InputImage = ({ name, id, rules, ...props }) => {
  const [image, setImage] = useState(false);
  const inputRef = useRef(null);

  const { control } = useFormContext();

 

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
    const handleInputImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result;
          setImage(base64);
          field.onChange(base64);
        };
        reader.readAsDataURL(file);
      };

        return (
        <Box
          {...field}
          helperText={fieldState.error?.message}
          error={!!fieldState.error}
          sx={{
            position: "relative",
            width: "100%",
            height: "6rem",
            borderRadius: "0.75rem",
            overflow: "hidden",
            cursor: "pointer",
            backgroundColor: "secondary.main",
          }}
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            id={id}
            name={name}
            accept="image/*"
            style={{ display: "none" }}
            ref={inputRef}
            {...props}
            onChange={handleInputImage}
          />
          {image ? (
            <>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.4)",
                  color: "#fff",
                  opacity: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  transition: "opacity 0.3s ease",
                  "&:hover": {
                    opacity: 1,
                  },
                }}
              >
                Trocar imagem
              </Box>
            </>
          ) : (
            <Button
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: 0,
                color: "text.primary",
                fontWeight: "bold",
              }}
            >
              Selecionar imagem
            </Button>
          )}
        </Box>
      )
      } }
    />
  );
};

export default InputImage;
