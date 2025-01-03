const BACK_END_URL = 'api.simple-cloud-storage.click:80' //'http://localhost:8080'//'http://192.168.31.131:8080'
const PICTURE_TYPE = new Set(['jpeg', 'jpg', 'png', 'gif', 'svg'])  //card中哪些类型请求预览图
const FILE_SIZE = 5  //单位：MB
const FILE_SIZE_BYTE = FILE_SIZE * 1024 * 1024
const TOTAL_STORAGE_PER_USER = 20 //MB
const TOTAL_STORAGE_PER_USER_BYTE = TOTAL_STORAGE_PER_USER * 1024 * 1024

const SEARCH_TYPE = {
    Any: [],
    'Photos & images': ['jpeg', 'jpg', 'png', 'gif', 'svg'],
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

const emptyPageImageUrl = {
    myDrive: `${BACK_END_URL}/images/empty_state_my_drive_v2.svg`,
    search: `${BACK_END_URL}/images/empty_state_no_search_results_v6.svg`,
    storage: `${BACK_END_URL}/images/empty_state_storage_v2.svg`,
    trash: `${BACK_END_URL}/images/empty_state_trash_v4.svg`,
    card: `${BACK_END_URL}/images/empty_state_details_v2.svg`,
}

export {BACK_END_URL, FILE_SIZE, FILE_SIZE_BYTE, PICTURE_TYPE, SEARCH_TYPE
    , searchFileType, searchDateCreated, TOTAL_STORAGE_PER_USER_BYTE, emptyPageImageUrl}