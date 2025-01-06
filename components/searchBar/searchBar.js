import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import TuneIcon from '@mui/icons-material/Tune';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { Button, Stack, TextField, Tooltip } from '@mui/material';
import Select from '@mui/material/Select';
import Icons from '@/components/icon/icon';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { setItemName, setFileTypeIndex, setDateCreatedIndex, setSearchPageKey } from '@/store/modules/searchParametersStore';
import { useRouter, usePathname } from 'next/navigation';
import { setFolderSelectValue } from '@/store/modules/folderSelectStore';
import { searchFileType, searchDateCreated } from '@/config/config';
import { v4 as uuidv4 } from 'uuid';
import { newDesUrl, urlWithoutLanguage } from '@/utils/urlFunctions';
import { useTranslation } from '@/international/myTranslate';


const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    //width: '50%'
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    //width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 1),
        // vertical padding + font size from searchIcon
        //paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
    },
    flexGrow: 1,
}));



export default function MySearchBar() {
    const dispatch = useDispatch()
    const { t, lang } = useTranslation()
    const router = useRouter()
    const pathname = usePathname()
    const searchParameters = useSelector(state => state.searchParameters)
    const [searchValue, setSearchValue] = useState(searchParameters.itemName)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [fileTypeIndex, setThisFileTypeIndex] = useState(0)
    const [itemName, setThisItemName] = useState('')
    const [dateCreatedIndex, setThisDateCreatedIndex] = useState(0)

    const handleSettingClick = () => {
        setThisItemName(searchParameters.itemName)
        setThisFileTypeIndex(searchParameters.fileTypeIndex)
        setThisDateCreatedIndex(searchParameters.dateCreatedIndex)
        setDialogOpen(true)
    }

    const handleDialogClose = () => {
        setDialogOpen(false)
    }

    const handleChangeFileType = (e) => {
        setThisFileTypeIndex(e.target.value)
    }

    const search = (e) => {
        // console.log(e, e.keyCode)
        if (e.keyCode !== 13) {
            return
        }
        e.target.blur();
        dispatch(setItemName(searchValue))
        dispatch(setFileTypeIndex(0))
        dispatch(setDateCreatedIndex(0))
        dispatch(setSearchPageKey(uuidv4()))
        dispatch(setFolderSelectValue(null))
        router.push(newDesUrl(pathname, '/search'))
    }

    const advancedSearch = () => {
        setDialogOpen(false)
        dispatch(setItemName(itemName))
        dispatch(setFileTypeIndex(fileTypeIndex))
        dispatch(setDateCreatedIndex(dateCreatedIndex))
        dispatch(setSearchPageKey(uuidv4()))
        dispatch(setFolderSelectValue(null))
        router.push(newDesUrl(pathname, '/search'))
    }

    useEffect(()=>{
        setSearchValue(searchParameters.itemName) 
    }, [searchParameters])
    return (
        <>
            <Box tabIndex={'1'} sx={{
                position: 'relative',
                borderRadius: 8,
                backgroundColor: 'custom.searchBarBlue',
                '&:focus-within': {
                    backgroundColor: 'white',
                    boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.5)',
                },
                marginLeft: 0,
                //flexGrow: 1,
                width: '80%',
                maxWidth: '800px', 
                display: "flex",
                height: '48px',
                pr: '6px',
            }}>
                <SearchIconWrapper>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder={t("Search in Drive")}
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchValue}
                    onChange={(e) => { setSearchValue(e.target.value) }}
                    onKeyDown={search}
                />
                {
                    searchValue !== '' &&
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Tooltip title={t('Clear search')} disableInteractive >
                        <IconButton onClick={() => { setSearchValue('') }}>
                            <CloseIcon />
                        </IconButton>
                        </Tooltip>
                    </Box>
                }
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title={t('Advanced search')} disableInteractive >
                    <IconButton onClick={handleSettingClick}>
                        <TuneIcon />
                    </IconButton>
                    </Tooltip>
                </Box>
            </Box>
            <Dialog
                onClose={handleDialogClose}
                aria-labelledby="customized-dialog-title"
                open={dialogOpen}
                maxWidth={'md'}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleDialogClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <Box sx={{ width: '500px', height: '50px', mt: '8px', mb: '8px', display: 'flex', alignItems: 'center' }} >
                        <Box sx={{ width: '150px', display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                                {t("Type")}
                            </Typography>
                        </Box>
                        <Select
                            value={fileTypeIndex}
                            onChange={handleChangeFileType}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            size='small'
                            sx={{ width: '220px', typography: 'body2' }}
                        >
                            {
                                searchFileType.map((item, index) => (
                                    <MenuItem value={index} key={index}>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                            {
                                                item.name !== 'Any' ?
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <Icons type={item.iconType} sx={{ fontSize: 21 }} />
                                                    </Box> :
                                                    fileTypeIndex !== 0 &&
                                                    <Box sx={{ display: "flex", alignItems: "center", pl: "8px", width: '24px' }} />
                                            }

                                            <Typography variant='body2'>
                                                {t(item.name)}
                                            </Typography>
                                        </Stack>
                                    </MenuItem>
                                )
                                )
                            }
                        </Select>
                    </Box>
                    <Box sx={{ width: '500px', height: '50px', mt: '8px', mb: '8px', display: 'flex', alignItems: 'center' }} >
                        <Box sx={{ width: '150px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                            <Typography variant="subtitle2">
                                {t("Item name")}
                            </Typography>
                        </Box>
                        <TextField
                            placeholder={t('Enter a term that matches the file name')}
                            value={itemName}
                            onChange={(e) => { setThisItemName(e.target.value) }}
                            fullWidth
                            size='small'
                            sx={{ maxWidth: '300px', }}
                        />
                    </Box>
                    <Box sx={{ width: '500px', height: '50px', mt: '8px', mb: '8px', display: 'flex', alignItems: 'center' }} >
                        <Box sx={{ width: '150px', display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle2">
                                {t("Date created")}
                            </Typography>
                        </Box>
                        <Select
                            value={dateCreatedIndex}
                            onChange={(e) => { setThisDateCreatedIndex(e.target.value) }}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            size='small'
                            sx={{ width: '220px' }}
                        >
                            {
                                searchDateCreated.map((item, index) => (
                                    <MenuItem value={index} key={index}>
                                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                                            <Typography variant="body2" >
                                                {t(item.name)}
                                            </Typography>
                                        </Stack>
                                    </MenuItem>
                                )
                                )
                            }
                        </Select>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ m: '8px' }}>
                    <Button autoFocus variant="contained" size="small" onClick={advancedSearch}>
                        {t('Search')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}