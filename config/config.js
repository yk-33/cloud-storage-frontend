const BACK_END_URL = 'http://localhost:8080'//'http://192.168.31.131:8080'//'http://localhost:8080' 'api.simple-cloud-storage.click:80'
const PICTURE_TYPE = new Set(['jepg', 'jpg', 'png', 'gif'])  //card中哪些类型请求预览图

const SEARCH_TYPE = {
    Any: [],
    'Photos & images': ['jepg', 'jpg', 'png', 'gif'],
    PDFs: ['pdf'],
    Documents: ['doc', 'docx'],
    Audio: ['mp3', 'wav'],
    Videos: ['mp4', 'avi', 'wmv', 'flv', 'mov', 'mkv'],
    Archives: ['zip', 'rar'],
    Folders: ['folder'],
} 

const searchFileType = [
    { name: 'Any', iconType: '' },
    { name: 'Photos & images', iconType: 'png' },
    { name: 'PDFs', iconType: 'pdf' },
    { name: 'Documents', iconType: 'default' },
    { name: 'Audio', iconType: 'mp3' },
    { name: 'Videos', iconType: 'mp4' },
    { name: 'Archives', iconType: 'rar' },
    { name: 'Folders', iconType: 'folder' },
]

const searchDateCreated = [
    { name: 'Any time', value: [-1, -1]},
    { name: 'Today', value: [-1, 0]},
    { name: 'Yesterday', value: [-1, 1]},
    { name: 'Last 7 days', value: [-1, 7]},
    { name: 'Last 30 days', value: [-1, 30]},
    { name: 'Last 90 days', value: [-1, 90]},
]

export {BACK_END_URL, PICTURE_TYPE, SEARCH_TYPE, searchFileType, searchDateCreated}