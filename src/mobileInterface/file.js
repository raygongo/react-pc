import 'es6-promise/auto';
import mi from './mobileInterface';
import CallbackHandler from './common/callbackHandler';
function getFileHash(file) {
    return file.fileId;
}
function getTempId() {
    return new Date().getTime().toString();
}
/** 处理图片文件的内容 */
function handleImageFile(imageResult) {
    for (let i = 0, count = imageResult.length; i < count; i++) {
        const img = imageResult[i], hasExtName = img.fileName.indexOf('.') != -1, extName = hasExtName ? img.fileName.split('.').pop() : 'png';
        //为图片的 base64 内容添加前缀，使其可直接使用在 img 标签的 src 上
        img.imageData = `data:image/${extName};base64,` + img.imageData;
        handleLocalFile(img);
    }
    return imageResult;
}
/** 处理本地文件的内容 */
function handleLocalFile(files) {
    if (files instanceof Array) {
        for (var i = 0; i < files.length; i++) {
            handleLocalFile(files[i]);
        }
        return files;
    }
    files.tempId = getTempId(); //创建文件临时ID
    files.fileSize = +files.fileSize; //转换文件大小为数字
}
/** 协助处理文件下载回调 */
const fileDownloadCallback = new CallbackHandler('downloadRetBack', getFileHash, { once: false });
/** 协助处理文件上传回调 */
const fileUploadCallback = new CallbackHandler('uploadRetBack', (file) => file.tempId, { once: false });
/** 处理文件上传操作 */
class FileUploader {
    constructor(file) {
        this.file = file;
    }
    createUploadOption(sysId) {
        const file = this.file;
        return {
            fileName: file.fileName,
            filePath: file.filePath,
            sysId: sysId,
            tempId: file.tempId
        };
    }
    /** 取消文件上传 */
    cancel() {
        // mi.cancelUpload(this.file);
        File.cancelUpload(this.file);
    }
    /** 开始文件上传 */
    start(sysId) {
        const uploadOption = this.createUploadOption(sysId);
        return new Promise((resolve, reject) => {
            fileUploadCallback.addCallback(uploadOption.tempId, (processInfo) => {
                //准备上传状态，暂时不做处理
                if (processInfo.status === File.UPLOAD_PREPARE) {
                    return;
                }
                processInfo.fileSize = this.file.fileSize;
                if (processInfo.status === File.UPLOAD_UPLOADING) {
                    try {
                        this.onUploadProcess && this.onUploadProcess(processInfo);
                    }
                    catch (err) { }
                    return;
                }
                fileUploadCallback.removeCallback(uploadOption.tempId);
                if (processInfo.status === File.DOWNLOAD_SUCCESS) {
                    resolve(processInfo);
                }
                else {
                    reject({ code: -1000, msg: processInfo.msg });
                }
            });
            mi.uploadFile(uploadOption);
        });
    }
}
/** 文件对象，用于执行文件上传或下载操作 */
export default class File {
    constructor(fileId, fileName, filePath) {
        this.fileId = fileId;
        this.fileName = fileName;
        this.filePath = filePath;
    }
    /** 获取文件下载参数 */
    get downloadOption() {
        return {
            fileId: this.fileId,
            fileName: this.fileName,
            fileDownloadPath: this.filePath
        };
    }
    /** 下载文件 */
    download() {
        const promise = new Promise((resolve, reject) => {
            fileDownloadCallback.addCallback(this.fileId, (processInfo) => {
                //准备下载中，暂时不做任何处理
                if (processInfo.status === File.DOWNLOAD_PREPARE) {
                    return;
                }
                processInfo.fileSize = +processInfo.fileSize; //转换文件大小为数字
                //下载中，触发进度回调
                if (processInfo.status === File.DOWNLOAD_DOWNLOADING) {
                    try {
                        this.onDownloadProcess && this.onDownloadProcess(processInfo);
                    }
                    catch (err) { }
                    return;
                }
                //不管下载成功还是失败，移除回调函数
                fileDownloadCallback.removeCallback(this.fileId);
                if (processInfo.status === File.DOWNLOAD_SUCCESS) {
                    resolve(processInfo);
                }
                else {
                    reject({ code: -1001, msg: processInfo.msg });
                }
            });
            mi.downloadFile(this.downloadOption);
        });
        return promise;
    }
    /** 取消文件下载 */
    cancelDownload() {
        fileDownloadCallback.removeCallback(this.fileId);
        File.cancelDownload(this.downloadOption);
        //mi.cancelDownload(this.downloadOption);
    }
    /** 检查文件是否已经下载过 */
    isDownloaded() {
        return File.isDownloaded([this.downloadOption]).then((response) => {
            return response[0].hasDownloaded;
        });
    }
    /** 打开本地文件 */
    open() {
        //mi.openLocalFile(this.downloadOption);
        File.open(this.downloadOption);
    }
    /** 检查文件是否已经被下载过 */
    static isDownloaded(files) {
        const promise = CallbackHandler
            .registerCallbackPromise('checkFDRetBack')
            .then(CallbackHandler.reorderBy(files, getFileHash))
            .then(function (response) {
            //由于接口所返回的 Boolean 值是字符串型，所以需要进行一次转换
            response.forEach(function (item) {
                item.hasDownloaded = item.hasDownloaded.toString() === 'true';
            });
            return response;
        });
        mi.checkFileDownloaded(files);
        return promise;
    }
    /** 创建文件上传对象 */
    static createUploader(file) {
        return new FileUploader(file);
    }
    /** 打开文件选择器 */
    static openFileSelector(option = { fileNum: 1 }) {
        const promise = CallbackHandler.registerCallbackPromise('fileSelectorRetBack').then(handleLocalFile);
        mi.openFileSelector(option);
        return promise;
    }
    /** 打开图片选择器 */
    static openImgSelector(option) {
        const promise = CallbackHandler.registerCallbackPromise('imgSelectorRetBack').then(handleImageFile);
        mi.openImgSelector(option);
        return promise;
    }
    /** 打开相机拍照 */
    static openCamera(option) {
        const promise = CallbackHandler.registerCallbackPromise('cameraRetBack').then(handleImageFile).then(images => images[0]);
        mi.openCamera(option);
        return promise;
    }
    /** 上传文件 */
    static uploadFile(file, sysId, onProcess) {
        const fileUploader = File.createUploader(file);
        fileUploader.onUploadProcess = onProcess;
        return fileUploader.start(sysId);
    }
    /** 下载文件 */
    static downloadFile(fileInfo, onProcess) {
        const file = new File(fileInfo.fileId, fileInfo.fileName);
        file.onDownloadProcess = onProcess;
        return file.download();
    }
    /** 打开文件 */
    static open(fileInfo) {
        mi.openLocalFile(fileInfo);
    }
    /** 取消文件下载 */
    static cancelDownload(fileInfo) {
        mi.cancelDownload(fileInfo);
    }
    /** 取消文件上传 */
    static cancelUpload(fileInfo) {
        mi.cancelUpload(fileInfo);
    }
}
/** 文件下载状态:准备下载 */
File.DOWNLOAD_PREPARE = 'preparing';
/** 文件下载状态:下载中 */
File.DOWNLOAD_DOWNLOADING = 'downloading';
/** 文件下载状态:成功 */
File.DOWNLOAD_SUCCESS = 'success';
/** 文件下载状态:中断 */
File.DOWNLOAD_BREAK = 'break';
/** 文件下载状态:失败 */
File.DOWNLOAD_FAIL = 'failed';
/** 文件上传状态:准备上传 */
File.UPLOAD_PREPARE = 'preparing';
/** 文件上传状态:上传中 */
File.UPLOAD_UPLOADING = 'uploading';
/** 文件上传状态:完成 */
File.UPLOAD_SUCCESS = 'success';
/** 文件上传状态:中断 */
File.UPLOAD_BREAK = 'break';
/** 文件上传状态:失败 */
File.UPLOAD_FAIL = 'failed';
