import { Button as MuiButton } from "@mui/material";

const Button = ({
  variant = "contained",
  color = "primary",
  size,
  children,
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size || "medium"}
      sx={{
        width: "7rem",
        maxHeight: "2.5rem",
        borderRadius: 24, 
        textTransform: "none",
        fontWeight: 500,
        fontFamily: '"Josefin Sans", "Roboto", sans-serif',
        px: { xs: 3, sm: 4 },
        py: { xs: 1.5, sm: 2 },
        fontSize: { xs: "0.875rem", sm: "1rem" },

        ...(variant === "contained" && {
          backgroundColor: "primary.main",
          color: "#fff",
          boxShadow: "0 4px 10px rgba(209, 107, 165, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "primary.dark",
            boxShadow: "0 6px 20px rgba(209, 107, 165, 0.5)",
            transform: "translateY(-2px)",
          },
        }),

        // Para outlined, borda e hover chamativos
        ...(variant === "outlined" && {
          border: "2px solid",
          borderColor: "primary.main",
          color: "primary.main",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "primary.light",
            color: "#fff",
            borderColor: "primary.dark",
          },
        }),

        // Para text, leve mas ainda visível
        ...(variant === "text" && {
          color: "primary.main",
          "&:hover": {
            backgroundColor: "primary.light",
          },
        }),
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
