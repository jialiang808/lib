(function($) {
    $.fn.myUploadFile = function(args) {
        if (this.length == 0) {
            return;
        }
        if (args === 'val') {
            return this.data('my-key');
        }
        var defaultOptions = {
            auto: true,
            uploadUrl: '',
            formData: {},
            uploadLimit: 1,
            fileSizeLimit: 1024 * 1024 * 10, // 10 MB
            fileTypes: { title: 'Images', extensions: 'gif,jpg,jpeg,png', mimeTypes: 'image/gif,image/jpg,image/jpeg,image/png' }
        };
        return initUpload(this);

        function initUpload(container) {
            var options = $.extend(defaultOptions, args);
            container.data('my-key', []);
            if (!WebUploader.Uploader.support()) {
                var error = "您的浏览器尚未安装Flash插件，无法使用，需安装后重新启动浏览器。 或更换谷歌、火狐、IE9以上浏览器使用。";
                container.append('<div class="upload-error">' + error + '</div>');
                return;
            }
            var uploader = WebUploader.create({
                auto: options.auto, //选完文件后，是否自动上传。
                swf: '/static/lib/webuploader/Uploader.swf', // swf文件路径
                server: options.uploadUrl, //文件接收服务端。
                pick: { //内部根据当前运行是创建，可能是input元素，也可能是flash.
                    id: container.selector,
                    innerHTML: options.btnHtml,
                    multiple: options.uploadLimit > 1,
                },
                fileNumLimit: 999,
                fileSingleSizeLimit: options.fileSizeLimit,
                formData: options.formData, //文件上传请求的参数表
                accept: options.fileTypes,
                compress: false //不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            });
            uploader.on('uploadStart', function(file) {
                if (options.start) {
                    options.start.call(container)
                }
            });
            uploader.on('uploadBeforeSend', function(obj, data, headers) {
                var token = myCommon.getLocalStorage('token');
                if (token) {
                    headers['Authorization'] = 'Bearer ' + token;
                }
            });
            uploader.on('uploadProgress', function(file, percentage) {
                //上传进度条
                if (options.progress) {
                    options.progress.call(container, percentage)
                }
            });
            uploader.on('uploadSuccess', function(file, result) {
                if (options.success) {
                    options.success.call(container, result)
                }
            });
            uploader.on('uploadError', function(file, result) {
                uploader.removeFile(file);
            });
            uploader.on('uploadComplete', function(file) {
                if (options.complete) {
                    options.complete.call(container)
                }
            });
            uploader.on('error', function(reason) {
                var msg = '上传失败';
                switch (reason) {
                    case 'F_DUPLICATE':
                        msg = '文件上传重复';
                        break;
                    case 'Q_EXCEED_NUM_LIMIT':
                        msg = '上传文件数量超出了限制';
                        break;
                    case 'F_EXCEED_SIZE':
                        msg = '文件太大，超出限制';
                        break;
                    case 'Q_EXCEED_SIZE_LIMIT':
                        msg = '文件总上传大小超出限制';
                        break;
                    case 'Q_TYPE_DENIED':
                        msg = '文件类型不符合要求';
                        break;
                }
                myCommon.showMessage(msg);
            });

            return uploader;
        }
    };
})(jQuery);
