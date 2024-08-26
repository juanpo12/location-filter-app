'use client'
import { Button, Dialog, DialogTitle } from "@mui/material"
import { useState } from "react";

const ModalConfirmDelete = ({deletePhoneNumber, id} : any) => {
    const [open, setOpen] = useState(false);

    return(
        <div>
            <Button variant="contained" color="error" onClick={() => setOpen(true)}>Delete</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Are you sure you want to delete this phone number?</DialogTitle>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button variant="contained" color="error" onClick={() => deletePhoneNumber(id)}>Delete</Button>
            </Dialog>
        </div>
    )
}


export default ModalConfirmDelete

