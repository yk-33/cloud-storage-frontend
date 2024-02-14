import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';


export default function CommonDialog({ dialogValue, dialogTitle, dialogConfirmName, dialogOpen,
    handleCloseDialog, handleInputChangeDialog, handleConfirmDialog }) {

    return (
        <Dialog open={dialogOpen} onClose={handleCloseDialog} >
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent sx={{ width: '350px' }}>
                <TextField
                    autoFocus={true}
                    margin="dense"
                    id="name"
                    fullWidth
                    variant="outlined"
                    size="small"
                    value={dialogValue}
                    onChange={handleInputChangeDialog}
                />
            </DialogContent>
            <DialogActions sx={{ mr: '16px', mb: '8px' }}>
                <Button onClick={handleCloseDialog} size="small"
                    sx={{ borderRadius: '16px', }}
                >Cancel</Button>
                <Button onClick={handleConfirmDialog} variant="contained" size="small"
                    sx={{ borderRadius: '16px', }}
                >{dialogConfirmName}</Button>
            </DialogActions>
        </Dialog>
    )
}