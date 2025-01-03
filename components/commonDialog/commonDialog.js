import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useTranslation } from '@/international/myTranslate';

export default function CommonDialog({ dialogValue, dialogTitle, dialogConfirmName, dialogOpen,
    handleCloseDialog, handleInputChangeDialog, handleConfirmDialog }) {

        const { t, lang } = useTranslation()

    return (
        <Dialog open={dialogOpen} onClose={handleCloseDialog} >
            <DialogTitle>{t(dialogTitle)}</DialogTitle>
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
                >{t('Cancel')}</Button>
                <Button onClick={handleConfirmDialog} variant="contained" size="small"
                    sx={{ borderRadius: '16px', }}
                >{t(dialogConfirmName)}</Button>
            </DialogActions>
        </Dialog>
    )
}