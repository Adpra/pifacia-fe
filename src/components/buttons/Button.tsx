import { twMerge } from "tailwind-merge";

export interface ButtonProps {
  text?: string;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "info" | "warning" | "danger";
  disabled?: boolean;
  className?: any;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const Button = (props: ButtonProps) => {
  const {
    text,
    size,
    color,
    disabled,
    className,
    onClick,
    type = "button",
  } = props;

  const colorClass = styles[color ?? "primary"];
  const sizeClass = styles[size ?? "sm"];
  const disabledClass = disabled ? styles["danger"] : "";

  return (
    <button
      type={type}
      className={twMerge(
        "btn",
        colorClass,
        sizeClass,
        disabledClass,
        className ?? ""
      )}
      disabled={disabled}
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
  danger: "btn-error",

  // States
  disabled: "btn-disabled",
};

export default Button;
