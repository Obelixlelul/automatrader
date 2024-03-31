import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Dispatch, type SetStateAction, useCallback } from "react";

interface AlertProps {
  cbConfirm?: () => void | undefined;
  title: string;
  description: string;
  open: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}

export default function Alert({
  cbConfirm,
  title,
  description,
  open,
  onOpenChange,
}: AlertProps) {
  const handleCbConfirm = useCallback(() => {
    try {
      if (cbConfirm) {
        cbConfirm();
      }
    } catch (err) {
      throw err;
    }
  }, [cbConfirm]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleCbConfirm}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
