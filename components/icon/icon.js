import FolderIcon from '@mui/icons-material/Folder';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import DescriptionIcon from '@mui/icons-material/Description';
import LinkIcon from '@mui/icons-material/Link';
import GifIcon from '@mui/icons-material/Gif';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import SearchIcon from '@mui/icons-material/Search';
import { pink, green, red, blue, orange, purple, indigo} from '@mui/material/colors';

export default function Icons({type, sx}){
    
    const iconMap = {
        folder: <FolderIcon  sx={{...sx}}/>,
        jepg: <InsertPhotoIcon  sx={{color: red[400],...sx}}/>,
        jpg: <InsertPhotoIcon  sx={{color: red[400],...sx}}/>,
        png: <InsertPhotoIcon  sx={{color: red[400],...sx}}/>,
        gif: <GifIcon sx={{color: red[400],...sx}}/>,
        pdf: <PictureAsPdfIcon sx={{color: red[400],...sx}}/>,
        torrent: <LinkIcon sx={{color: orange[400],...sx}}/>,
        mp3: <AudioFileIcon sx={{color: pink[300],...sx}}/>,
        wav: <AudioFileIcon sx={{color: pink[300],...sx}}/>,
        mp4: <VideoFileIcon sx={{color: indigo[400],...sx}}/>,
        avi: <VideoFileIcon sx={{color: indigo[400],...sx}}/>,
        wmv: <VideoFileIcon sx={{color: indigo[400],...sx}}/>,
        flv: <VideoFileIcon sx={{color: indigo[400],...sx}}/>,
        mov: <VideoFileIcon sx={{color: indigo[400],...sx}}/>,
        mkv: <VideoFileIcon sx={{color: indigo[400],...sx}}/>,
        zip: <FolderZipIcon sx={{color: blue[400],...sx}}/>,
        rar: <FolderZipIcon sx={{color: blue[400],...sx}}/>,
        default: <DescriptionIcon sx={{color: blue[400],...sx}}/>,
        trash: <DeleteIcon sx={{...sx}}/>,
        search: <SearchIcon sx={{...sx}}/>,
    }
    let iconType = iconMap.hasOwnProperty(type) ? type: 'default'
    return(
        iconMap[iconType]  
    )
}