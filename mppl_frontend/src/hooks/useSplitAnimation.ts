import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitType from "split-type";

export const useSplitAnimation = (
  containerRef: React.RefObject<any>,
  selector: string = ".headline-animate-gsap",
) => {
  useGSAP(
    () => {
      if (!containerRef.current) return;
      const targetElement = containerRef.current.querySelector(selector);
      if (!targetElement) return;
      const split = new SplitType(
        targetElement as HTMLElement,
        {
          types: "chars, words",
          type: "chars, words",
        } as any,
      );

      const tl = gsap.timeline();
      const brandChars: HTMLElement[] = [];
      const regularChars: HTMLElement[] = [];

      if (split.chars) {
        split.chars.forEach((char) => {
          if (char.closest("span")) {
            char.classList.add(
              "bg-gradient-to-r",
              "from-[#059669]",
              "to-[#009688]",
              "bg-clip-text",
              "text-transparent",
              "inline-block",
            );
            brandChars.push(char);
          } else {
            regularChars.push(char);
          }
        });
      }

      if (containerRef.current.querySelector(".left-content-gsap")) {
        tl.from(".left-content-gsap", {
          x: -50,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      }

      if (regularChars.length > 0) {
        tl.from(
          regularChars,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.02,
            ease: "power2.out",
          },
          "-=0.8",
        );
      }

      if (brandChars.length > 0) {
        tl.from(
          brandChars,
          {
            duration: 0.8,
            opacity: 0,
            scale: 0,
            y: 40,
            rotationX: 180,
            transformOrigin: "50% 50% -50",
            ease: "back.out(1.7)",
            stagger: 0.05,
          },
          "-=0.4",
        );
      }

      if (containerRef.current.querySelector(".image-reveal-gsap")) {
        tl.from(
          ".image-reveal-gsap",
          { scale: 1.2, filter: "blur(10px)", opacity: 0, duration: 1 },
          "-=0.5",
        );
      }

      if (containerRef.current.querySelectorAll(".fade-up-gsap").length > 0) {
        tl.from(
          ".fade-up-gsap",
          {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
          },
          "-=0.4",
        );
      }

      if (
        containerRef.current.querySelectorAll(".second-fade-up-gsap").length > 0
      ) {
        tl.from(
          ".second-fade-up-gsap",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
          },
          "-=0.4",
        );
      }

      if (
        containerRef.current.querySelectorAll(".stagger-links-gsap").length > 0
      ) {
        tl.from(
          ".stagger-links-gsap",
          {
            x: 20,
            opacity: 0,
            stagger: 0.1,
          },
          "-=0.2",
        );
      }

      return () => {
        split.revert();
      };
    },
    { scope: containerRef },
  );
};
