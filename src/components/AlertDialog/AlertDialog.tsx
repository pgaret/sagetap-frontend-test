import React, { FC, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type AlertDialogProps = {
    title: string;
    body?: string;
    color?:
        | "primary"
        | "error"
        | "success"
        | "inherit"
        | "info"
        | "warning"
        | "secondary"
        | undefined;
    handleCancel: () => void;
    handleConfirm: () => void;
};

export const AlertDialog: FC<AlertDialogProps> = (props) => {
    const {
        title,
        body = "",
        color = "primary",
        handleCancel,
        handleConfirm,
    } = props;

    useEffect(() => {
        const eventHandler = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                event.preventDefault();

                handleConfirm();
            }
        };

        document.addEventListener("keydown", eventHandler);

        return () => {
            document.removeEventListener("keydown", eventHandler);
        };
    });

    return (
        <Dialog
            open
            onClose={handleCancel}
            aria-labelledby="alert-dialog"
            aria-describedby="alert-dialog"
        >
            <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {body}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color={color || "primary"}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    color={color || "primary"}
                    variant="contained"
                    data-testid="confirm-dialog"
                >
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};
