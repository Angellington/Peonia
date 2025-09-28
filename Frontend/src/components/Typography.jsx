import { Typography as MuiTypography } from "@mui/material";

const Typography = ({ variant, color, children, ...props }) => {
  return (
    <MuiTypography
      variant={variant}
      color={color || "text.primary"}
      sx={{
        fontFamily: '"Josefin Sans", "Roboto", sans-serif',
        lineHeight: 1.6,
        ...(variant === "h1" && {
          fontWeight: 700,
          fontSize: "clamp(1.6rem, 5vw, 3rem)", 
          color: "primary.main",
        }),
        ...(variant === "h2" && {
          fontWeight: 600,
          fontSize: "clamp(1.4rem, 4vw, 2.25rem)",
          color: "secondary.main",
        }),
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

export default Typography;
