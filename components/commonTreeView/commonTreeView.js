import * as React from 'react';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { styled, alpha } from '@mui/material/styles';
import { TreeItem, useTreeItem } from '@mui/x-tree-view/TreeItem';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { setFolderSelectValue } from '@/store/modules/folderSelectStore';
import { setFolderExpandValue } from '@/store/modules/folderExpandStore';
import { useRouter, usePathname } from 'next/navigation'
import FolderIcon from '@mui/icons-material/Folder';

const CustomContentRoot = styled('div')(({ theme }) => ({
  height:"32px",
  '&.MuiTreeItem-content':{
    padding: "0px"
  },
  '.MuiTreeItem-iconContainer #myIconContainer svg': {
    fontSize:"24px",
  },
  WebkitTapHighlightColor: 'transparent',
  '&&:hover, &&.Mui-disabled, &&.Mui-focused, &&.Mui-selected, &&.Mui-selected.Mui-focused, &&.Mui-selected:hover':
    {
      backgroundColor: 'transparent',
    },
  '.MuiTreeItem-contentBar': {
    position: 'absolute',
    width: '100%',
    height: 32,
    left: 0,
  },
  '&:hover .MuiTreeItem-contentBar': {
    backgroundColor: theme.palette.action.hover,
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: 'transparent',
    },
  },
  '&.Mui-disabled .MuiTreeItem-contentBar': {
    opacity: theme.palette.action.disabledOpacity,
    backgroundColor: 'transparent',
  },
  '&.Mui-selected .MuiTreeItem-contentBar': {  
    backgroundColor: theme.palette.custom.blue,
  },
  '&.Mui-selected:hover .MuiTreeItem-contentBar': {
    backgroundColor: theme.palette.custom.blue,
    // Reset on touch devices, it doesn't add specificity
    '@media (hover: none)': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        theme.palette.action.selectedOpacity,
      ),
    },
  },
}));

const CustomContent = React.forwardRef(function CustomContent(props, ref) {
  const router = useRouter()
  const {
    className,
    classes,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleSelectionClick = (event) => {
    router.push('/my-drive')
    handleSelection(event);
  };

  const handleExpansionClick = (event) => {
    console.log("expansion")
    handleExpansion(event);
  };


  return (
    <CustomContentRoot
      className={clsx(className, classes.root, {
        'Mui-expanded': expanded,
        'Mui-selected': selected,
        'Mui-focused': focused,
        'Mui-disabled': disabled,
      })}
      ref={ref}
      onClick={handleMouseDown}
    >
      <div className="MuiTreeItem-contentBar"  onClick={handleSelectionClick}/>
      <div onClick={handleExpansionClick} className={classes.iconContainer} style={{zIndex: 1201, marginRight:"0px", width:"24px"}}>
        <div id='myIconContainer' style={{alignItems:'center', height:'24px'}}>{icon}</div>
        
        </div>
        <FolderIcon sx={{zIndex: 1201,}}/>
      <Typography onClick={handleSelectionClick} component="div" className={classes.label} style={{paddingLeft:"16px"}} noWrap>
        {label}
      </Typography>
    </CustomContentRoot>
  );
});

const CustomTreeItem = React.forwardRef(function CustomTreeItem(props, ref) {
  return <TreeItem ContentComponent={CustomContent} {...props} ref={ref} />;
});

export default function CommonTreeView() {
  const dispatch = useDispatch();
  
  const {folderStructor} = useSelector(state=>state.folder);
  const {folderSelectValue} = useSelector(state=>state.folderSelect);
  const {folderExpandValue} = useSelector(state=>state.folderExpand);
  //console.log(folderStructor)
  const [expanded, setExpanded] = React.useState([]);
  //const [selected, setSelected] = React.useState([]);

  const handleToggle = (event, nodeIds) => {
    console.log(`expand: ${nodeIds}`);
    dispatch(setFolderExpandValue(nodeIds));
  };

  const handleSelect = (event, nodeIds) => {
    //console.log(`select: ${nodeIds}`);
    dispatch(setFolderSelectValue(Number(nodeIds)));
  };
  const renderTree = (nodes) => (
    <CustomTreeItem key={nodes.id} nodeId={nodes.id.toString()} label={nodes.name} >
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </CustomTreeItem>
  );

  return (
    <Box sx={{  flexGrow: 1, maxWidth: 300 }}>
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon/>}
        defaultExpanded={['root']}
        defaultExpandIcon={<ChevronRightIcon/>}
        expanded={folderExpandValue}
        selected={folderSelectValue===null?null:folderSelectValue.toString()}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {renderTree(folderStructor)}
      </TreeView>
    </Box>
  );
}
