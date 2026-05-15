"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

interface AnimatedPrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  disabled?: boolean;
  className?: string;
}

export default function AnimatedPrimaryButton({
  children,
  onClick,
  href,
  target,
  disabled = false,
  className = "",
}: AnimatedPrimaryButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Use CSS variables for colors so theme changes propagate automatically.
  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current as HTMLElement;
    gsap.killTweensOf(el);

    // Visual states: adjust elevation and shadow rather than animating color.
    if (disabled) {
      gsap.to(el, { boxShadow: "none", scale: 1, duration: 0.18 });
      return;
    }

    if (isPressed) {
      gsap.to(el, {
        y: 1,
        scale: 0.997,
        boxShadow: "inset 0 2px 6px rgba(0,0,0,0.18)",
        duration: 0.06,
        ease: "power2.out",
      });
      return;
    }

    if (isHovered) {
      gsap.to(el, {
        y: -3,
        scale: 1.01,
        boxShadow: "0 12px 30px rgba(37,99,235,0.18)",
        duration: 0.25,
        ease: "power2.out",
      });
      return;
    }

    // Default
    gsap.to(el, {
      y: 0,
      scale: 1,
      boxShadow: "0 6px 18px rgba(2,6,23,0.12)",
      duration: 0.35,
      ease: "power2.out",
    });
  }, [isHovered, isPressed, disabled]);

  const sharedClass = `relative inline-flex items-center justify-center rounded-full select-none ${
    disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
  } ${className}`;

  const sharedStyle: React.CSSProperties = {
    height: 46,
    padding: "0 26px",
    borderRadius: 36,
    borderWidth: 1,
    borderStyle: "solid",
    color: "var(--primary-foreground, #fff)",
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1,
    backgroundColor: "var(--primary)",
    borderColor: "var(--border)",
    boxShadow: "0 6px 18px rgba(2,6,23,0.12)",
  };

  const handlers = {
    onMouseEnter: () => !disabled && setIsHovered(true),
    onMouseLeave: () => {
      setIsHovered(false);
      setIsPressed(false);
    },
    onMouseDown: () => !disabled && setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onClick: (e: React.MouseEvent) => {
      if (disabled) e.preventDefault();
      else onClick?.();
    },
  };

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        style={sharedStyle}
        className={sharedClass}
        {...handlers}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      disabled={disabled}
      style={sharedStyle}
      className={sharedClass}
      {...handlers}
    >
      {children}
    </button>
  );
}
