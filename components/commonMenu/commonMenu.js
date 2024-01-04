import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';
import Menu from '@mui/material/Menu';

export default function CommonMenu({ itemId, itemName, itemType, data, anchorel, open, setanchorel }) {

  const handleClose = ()=>{
    setanchorel(null)
  }

  const handleCilck = (action)=>{
    setanchorel(null)
    action(itemId, itemName, itemType)
  }

  return (
    <Paper sx={{ width: 320, maxWidth: '100%' }}>
      <Menu
        anchorEl={anchorel}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <div>
        {//onClick={() => item.action(itemId)}
          data.map((group, index, arr) =>
            <React.Fragment key={index}>
              {
                group.map(item =>
                  <MenuItem key={item.name} onClick={() => handleCilck(item.action)}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                  </MenuItem>
                )
              }
              {index<arr.length-1 && <Divider />}
            </React.Fragment>
          )
        }
        </div>
      </Menu>
    </Paper>
  );
}