import { twMerge } from "tailwind-merge";

export interface ButtonProps {
  text?: string;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "info" | "warning" | "danger";
  disabled?: boolean;
  className?: any;
  onClick?: () => void;
}

const Button = (props: ButtonProps) => {
  const { text, size, color, disabled, className, onClick } = props;

  const colorClass = styles[color ?? "primary"];
  const sizeClass = styles[size ?? "sm"];
  const disabledClass = disabled ? styles["danger"] : "";

  return (
    <button
      type="button"
      className={twMerge(
        "btn",
        colorClass,
        sizeClass,
        disabledClass,
        className ?? ""
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

const styles = {
  // Sizes
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",

  // Colors
  primary: "btn-primary",
  secondary: "btn-neutral",
  success: "btn-success",
  info: "btn-info",
  warning: "btn-warning",
  danger: "btn-danger",

  // States
  disabled: "btn-disabled",
};

export default Button;
