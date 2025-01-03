'use client'
import React from 'react';
import { useEffect } from 'react';
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomNoRowsOverlay from '@/components/icon/noRowsSvg'
import { useDispatch, useSelector } from 'react-redux';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import api from '@/api';
let { reqGetLogs } = api;
import { processResponse } from '@/utils/processResponseUtils';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CommonLogDialog from '@/components/commonLogDialog/commonLogDialog';
import { filesize } from "filesize";

const hourToMil = 60 * 60 * 1000

const DefaultStyle = ({item})=>{
  return (
    <React.Fragment></React.Fragment>
  )
}

const LogContentStyle = ({item}) => {
  return(
  <Box key={item.id} sx={{ mb: '30px' }} gutterBottom>
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="subtitle2" >{`[ ${item.type} ]`}</Typography>
      <Typography variant="body2" >{item.time}</Typography>
    </Box>
    <Typography variant="body2" sx={{ pl: '5px' }} gutterBottom>{item.detail}</Typography>
  </Box>
  )
}

const IpContentStyle = ({item}) => {
  return(
  <Box key={item} sx={{ mb: '10px', pl: '20px' }} gutterBottom>
      <Typography gutterBottom>{item}</Typography>
  </Box>
  )
}

const Page = () => {
  const dispatch = useDispatch();
  const { loginStatus, userName } = useSelector(state => state.login);
  const [logList, setLogList] = React.useState([])
  const [hours, setHours] = React.useState(24 * 365 * 10)
  const [logDialogOpen, setLogDialogOpen] = React.useState(false)
  const [logDialogContent, setLogDialogContent] = React.useState([])
  const [ contentStyle, setContentStyle] = React.useState('default')
  const [ logDialogTitle, setLogDialogTitle] = React.useState('')
  const map = new Map()


  const ipCell = (props) => {
    let data = props.row.userLog
    const set = new Set()
    let ipContent = new Array()
    data.forEach((item) => {
      if (!set.has(item.ip)) {
        set.add(item.ip)
        ipContent.push({
          id: item.ip,
          type: '',
          content: item.ip,
        })
      }
    })
    let firstIp = data[0].ip

    return <Typography onClick={() => {
      setLogDialogContent([...set])
      setContentStyle('ipContent')
      setLogDialogTitle('IP')
      setLogDialogOpen(true)
    }}>{set.size > 1 ? `${firstIp} ...` : firstIp}</Typography>
  }

  const buttonCell = (props) => {
    let data = props.row
    let formatedContent = data.userLog.map((item) => {
      let str = null
      if (item.detail !== null) {
        item.detail
        const colonIndex = item.detail.indexOf(":");
        str = colonIndex !== -1 ? item.detail.substring(colonIndex + 1) : item.detail;
      }
      return { ...item, detail: str };
    })

    return (
      <Button onClick={() => {
        console.log(data.userLog)
        setLogDialogContent(formatedContent)
        setContentStyle('logContent')
        setLogDialogTitle('Logs')
        setLogDialogOpen(true)
      }}>Details</Button>
    )
  }

  const buttonType = {
    type: 'custom',
    resizable: false,
    filterable: false,
    sortable: false,
    editable: false,
    groupable: false,
    display: 'flex',
  }

  const trafficValueGetter = (value, row) => {
    let traffic = 0
    value.row.userLog.forEach((item) => {
      if (item.traffic !== null) {
        traffic += item.traffic
      }
    })
    return filesize(traffic, { base: 2, standard: "jedec" })
  }

  const columns = [
    { field: 'username', headerName: 'USERNAME', flex: 1 },
    { field: 'ip', ...buttonType, headerName: 'IP', renderCell: ipCell, width: 300 },
    { field: 'traffic', headerName: 'TRAFFIC', valueGetter: trafficValueGetter, width: 130 },
    { field: 'log', ...buttonType, headerName: 'LOG', renderCell: buttonCell, width: 130 },
  ];


  const getData = async (thisHours) => {
    let res = await reqGetLogs(thisHours * hourToMil)
    processResponse(res, dispatch)
    if(res.data === null){
      return
    }
    setLogList(res.data)
    res.data.forEach(item => {
      map.set(item.userId, item.userLog)
    });
  }

  const handleTimeChange = (event) => {
    setHours(event.target.value)
    getData(event.target.value)
  }



  useEffect(() => {
    if (loginStatus === 2) {
      getData(hours)
    }
  }, [loginStatus]);

  console.log(logList)
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', pr: '15px' }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <FormControl sx={{ m: 1, width: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Time </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={hours}
            onChange={handleTimeChange}
          >
            <MenuItem value={24 * 365 * 10}>
              <em>None</em>
            </MenuItem>
            <MenuItem value={0.083}>5 minutes</MenuItem>
            <MenuItem value={0.5}>30 minutes</MenuItem>
            <MenuItem value={1}>1 hour</MenuItem>
            <MenuItem value={24}>1 day</MenuItem>
            <MenuItem value={24 * 7}>1 week</MenuItem>
            <MenuItem value={24 * 31}>1 month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ flexGrow: 1 }}>
        <DataGrid rows={logList} columns={columns} getRowId={(row) => row.userId} slots={{ noRowsOverlay: CustomNoRowsOverlay }} />
      </Paper>
      <CommonLogDialog open={logDialogOpen} setOpen={setLogDialogOpen}
        dialogTitle={logDialogTitle} content={logDialogContent} ContentStyle={
          contentStyle==='default'?DefaultStyle:(contentStyle==='logContent'?LogContentStyle:IpContentStyle)}
      />
    </>
  );
};

export default Page;