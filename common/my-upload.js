(function($) {
    $.fn.myUpload = function(args, pictures) {
        if (this.length == 0) {
            return;
        }

        var defaultOptions = {
            uploadUrl: '',
            formData: {},
            uploadLimit: 1,
            fileSizeLimit: 10000000, // 10 MB
            fileTypes: { title: 'Images', extensions: 'gif,jpg,jpeg,png', mimeTypes: 'image/gif,image/jpg,image/jpeg,image/png' },
            height: 104,
            width: 104,
            uploadedFiles: [],
            returnElementId: '',
            instruction: '',
            success: null,
            cancleCallBack: null
        };

        return initUpload(this);

        function initUpload(container) {
            if (args === 'val') {
                return getFileKey();
            }
            var options = $.extend(defaultOptions, args);
            if (args === 'add') {
                options = container.data('options');
                var remainCount = options.uploadLimit;
                var uploadingCount = 0;
                var returnElement = $('#' + options.returnElementId);
                var btnUpload = container.find('.btn-upload');
                for (var i = 0; i < pictures.length; i++) {
                    addFile(pictures[i], null, true);
                }
                return;
            }
            container.data('options', options);
            if (options.uploadedFiles && typeof options.uploadedFiles == 'string') {
                options.uploadedFiles = JSON.parse(args.uploadedFiles);
            }
            var singleNumber = myCommon.getSingleNumber();
            var uploadId = "my-upload-" + singleNumber;
            var tempHtml = '<div class="my-upload" id="upload-area-' + singleNumber + '"><div class="file-list"></div>';
            tempHtml += '<div id="' + uploadId + '" class="btn-upload"></div></div>';
            container.html(tempHtml);
            var btnUpload = container.find('.btn-upload');
            btnUpload.css({
                'width': options.width,
                'height': options.height
            });

            container.data('my-key', { add: [], del: [], all: [] });
            if (!WebUploader.Uploader.support()) {
                var error = "您的浏览器尚未安装Flash插件，无法使用，需安装后重新启动浏览器。 或更换谷歌、火狐、IE9以上浏览器使用。";
                $('#upload-area-' + singleNumber).append('<div class="instruction">' + error + '</div>');
                return;
            }
            if (options.instruction) {
                $('#upload-area-' + singleNumber).append('<div class="instruction">' + options.instruction + '</div>');
            }
            var remainCount = options.uploadLimit;
            var uploadingCount = 0;
            var returnElement = $('#' + options.returnElementId);
            var uploader = WebUploader.create({
                auto: true, //选完文件后，是否自动上传。
                swf: '/lib/webuploader/Uploader.swf', // swf文件路径
                server: options.uploadUrl, //文件接收服务端。
                pick: { //内部根据当前运行是创建，可能是input元素，也可能是flash.
                    id: '#' + uploadId,
                    innerHTML: options.btnHtml,
                    multiple: options.uploadLimit > 1,
                },
                fileNumLimit: 999,
                fileSingleSizeLimit: options.fileSizeLimit,
                formData: options.formData, //文件上传请求的参数表
                accept: options.fileTypes,
                compress: false //不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
            });
            uploader.on('beforeFileQueued', function() {
                if (remainCount - uploadingCount < 1) {
                    return false;
                }
                uploadingCount++;
            });
            uploader.on('uploadStart', function(file) {
                //显示加载状态
                btnUpload.append('<div class="upload-loading"></div>');
                if (options.start) {
                    options.start.call(container, result)
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
                if (typeof result === "string") {
                    result = JSON.stringify(result);
                }
                if (result.code != 200) {
                    myCommon.showMessage(result.info || '上传失败');
                    uploader.removeFile(file);
                    return;
                }
                addFile(result.data, file);

                if (options.success) {
                    options.success.call(container, result)
                }
            });
            uploader.on('uploadError', function(file, reason) {
                uploader.removeFile(file);
                console.log("上传失败：" + reason);
            });
            uploader.on('uploadComplete', function(file) {
                //删除加载状态
                uploadingCount--;
                if (uploadingCount == 0) {
                    container.find('.upload-loading').remove();
                }
                if (options.complete) {
                    options.complete.call(container, result)
                }
            });
            uploader.on('error', function(reason) {
                uploadingCount--;
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
            //加载存在的上传文件
            if (options.uploadedFiles) {
                for (var i = 0; i < options.uploadedFiles.length; i++) {
                    addFile(options.uploadedFiles[i], null, true);
                }
            }

            function removeFile(key, isUploadedFile) {
                var keys = container.data('my-key');
                if (isUploadedFile) {
                    keys.del.push(key);
                }
                keys.all.splice($.inArray(key, keys.all), 1);
                if (!isUploadedFile) {
                    keys.add.splice($.inArray(key, keys.add), 1);
                }
                setFileKey(keys);
                remainCount++
                if (remainCount == 1) {
                    btnUpload.show();
                }
            }

            function addFile(data, file, isUploadedFile) {
                if (remainCount < 1) {
                    return;
                }
                if (remainCount == 1) {
                    btnUpload.hide();
                }
                remainCount--;
                var imgUrl = data.download_url || data;
                var key = data.id || imgUrl;
                var keys = container.data('my-key');
                keys.all.push(key);
                if (!isUploadedFile) {
                    keys.add.push(key);
                }
                setFileKey(keys);
                var itemId = "my-upload-item-" + myCommon.getSingleNumber();
                var fileFormat = '<div class="file-item" style="width:{0}px;height:{1}px;"><img src="{2}"><a id="{3}" class="btn-delete">删除</a></div>';
                var fileHtml = fileFormat.format(options.width, options.height, imgUrl, itemId);
                container.find('.file-list').append(fileHtml);

                $('#' + itemId).click(function(event) {
                    if (options.cancleCallBack) {
                        options.cancleCallBack.call(container, key);
                    }
                    if (file) {
                        uploader.removeFile(file);
                    }
                    removeFile(key, isUploadedFile);
                    $(this).parent().remove();
                });
            }

            function setFileKey(keys) {
                container.data('my-key', keys);
                if (options.uploadLimit == 1 && returnElement.length > 0) {
                    var valStr = keys.add[0] || keys.all[0] || '';
                    returnElement.val(valStr);
                } else {
                    returnElement.val(JSON.stringify(keys));
                }
            }

            function getFileKey() {
                var keys = container.data('my-key');
                return keys;
            }
        }
    };
})(jQuery);
