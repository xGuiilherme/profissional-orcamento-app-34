import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const isMobile = useIsMobile();
  const toastPosition = isMobile ? "top-center" : "top-right";

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={toastPosition}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          error: 
            "!bg-red-50 !text-red-800 !border-red-200 dark:!bg-red-950 dark:!text-red-100 dark:!border-red-900",
            success: 
            "!bg-green-50 !text-green-800 !border-green-200 dark:!bg-green-950 dark:!text-green-100 dark:!border-green-900",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };