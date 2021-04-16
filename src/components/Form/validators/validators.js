import _ from 'lodash';

function getUploadedFiles($attribute, $messages, $options) {
    // Skip validation if File API is not available
    if (typeof File === "undefined") {
        return [];
    }

    let $fileInput = ''; // $($attribute.input, $attribute.form).get(0);

    // @TODO
    // Skip validation if $file input does not exist
    // (in case $file inputs are added dynamically and no $file input has been added to the form)
    if (1 || typeof $fileInput === "undefined") {
        return [];
    }

    let $files = $fileInput.files;
    if (!$files) {
        $messages.push($options.message);
        return [];
    }

    if ($files.length === 0) {
        if (!$options.skipOnEmpty) {
            $messages.push($options.uploadRequired);
        }

        return [];
    }

    if ($options.maxFiles && $options.maxFiles < $files.length) {
        $messages.push($options.tooMany);
        return [];
    }

    return $files;
}

function validateFile($file, $messages, $options) {
    if ($options.extensions && $options.extensions.length > 0) {
        let index = $file.name.lastIndexOf('.');
        let ext = !~index ? '' : $file.name.substr(index + 1, $file.name.length).toLowerCase();

        if (!~$options.extensions.indexOf(ext)) {
            $messages.push($options.wrongExtension.replace(/\{$file\}/g, $file.name));
        }
    }

    if ($options.mimeTypes && $options.mimeTypes.length > 0) {
        if (!validateMimeType($options.mimeTypes, $file.type)) {
            $messages.push($options.wrongMimeType.replace(/\{$file\}/g, $file.name));
        }
    }

    if ($options.maxSize && $options.maxSize < $file.size) {
        $messages.push($options.tooBig.replace(/\{$file\}/g, $file.name));
    }

    if ($options.minSize && $options.minSize > $file.size) {
        $messages.push($options.tooSmall.replace(/\{$file\}/g, $file.name));
    }
}

function validateMimeType($mimeTypes, $fileType) {
    for (let i = 0, len = $mimeTypes.length; i < len; i++) {
        if (new RegExp($mimeTypes[i]).test($fileType)) {
            return true;
        }
    }

    return false;
}

function validateImageSize($file, $image, $messages, $options) {
    if ($options.minWidth && $image.width < $options.minWidth) {
        $messages.push($options.underWidth.replace(/\{$file\}/g, $file.name));
    }

    if ($options.maxWidth && $image.width > $options.maxWidth) {
        $messages.push($options.overWidth.replace(/\{$file\}/g, $file.name));
    }

    if ($options.minHeight && $image.height < $options.minHeight) {
        $messages.push($options.underHeight.replace(/\{$file\}/g, $file.name));
    }

    if ($options.maxHeight && $image.height > $options.maxHeight) {
        $messages.push($options.overHeight.replace(/\{$file\}/g, $file.name));
    }
}

function isEmpty($value) {
    return $value === null || $value === undefined || (_.isArray($value) && $value.length === 0) || $value === '';
}

function formatMessage(message, $value) {
    return message.replace(/\{$value\}/g, $value);
}

function makeRegExp($string, $flags){
    let $regexp = /^[\/\\]{0,2}(.*?)[\/\\]{0,2}([a-z]*)$/g,
        $matches = $regexp.exec($string);

    if($matches[2]){
        $flags = ($matches[2] + ($flags || ''))
            .split('')
            .filter(($item, $pos, $self) => $self.indexOf($item) == $pos)
            .join('');
    }

    return new RegExp($matches[1], $flags);
}

export default {

    required: function ($value, $options) {

        $options = $options || {message: 'This field is required'};

        let $valid = false;
        if ($options.requiredValue === undefined) {
            let isString = typeof $value == 'string' || $value instanceof String;
            if ($options.strict && $value !== undefined || !$options.strict && !isEmpty(isString ? _.trim($value) : $value)) {
                $valid = true;
            }
        } else if (!$options.strict && $value == $options.requiredValue || $options.strict && $value === $options.requiredValue) {
            $valid = true;
        }

        return $valid || $options.message;
    },

    // "boolean" is a reserved keyword in older versions of ES so it's quoted for IE < 9 support
    'boolean': function ($value, $options) {
        if ($options.skipOnEmpty === '1' && isEmpty($value)) {
            return true;
        }

        let $valid = !$options.strict && ($value == $options.trueValue || $value == $options.falseValue)
            || $options.strict && ($value === $options.trueValue || $value === $options.falseValue);

        return $valid || $options.message;
    },

    string: function ($value, $options) {

        if ($options.skipOnEmpty === '1' && isEmpty($value)) {
            return true;
        }

        if (typeof $value !== 'string') {
            return $options.message;
        }

        if ($options.is !== undefined && $value.length != $options.is) {
            return formatMessage($options.notEqual, $value);
        }
        if ($options.min !== undefined && $value.length < $options.min) {
            return formatMessage($options.tooShort, $value);
        }
        if ($options.max !== undefined && $value.length > $options.max) {
            return formatMessage($options.tooLong, $value);
        }

        return true;
    },

    compare: function ($value, $options) {

        if ($options.skipOnEmpty === '1' && isEmpty($value)) {
            return true;
        }

        let $compareValue = $options.compareValue;
        let $valid = true;

        if ($options.type === 'number') {
            $value = $value ? parseFloat($value) : 0;
            $compareValue = $compareValue ? parseFloat($compareValue) : 0;
        }
        switch ($options.operator) {
            case '==':
                $valid = $value == $compareValue;
                break;
            case '===':
                $valid = $value === $compareValue;
                break;
            case '!=':
                $valid = $value != $compareValue;
                break;
            case '!==':
                $valid = $value !== $compareValue;
                break;
            case '>':
                $valid = $value > $compareValue;
                break;
            case '>=':
                $valid = $value >= $compareValue;
                break;
            case '<':
                $valid = $value < $compareValue;
                break;
            case '<=':
                $valid = $value <= $compareValue;
                break;
            default:
                $valid = false;
                break;
        }

        return $valid || $options.message;
    },

    file: function ($attribute, $messages, $options) {
        let $files = getUploadedFiles($attribute, $messages, $options);
        _.each($files, function (i, $file) {
            validateFile($file, $messages, $options);
        });
    },

    image: function ($attribute, $messages, $options, $deferredList) {
        let $files = getUploadedFiles($attribute, $messages, $options);
        _.each($files, function (i, $file) {
            validateFile($file, $messages, $options);

            // Skip $image validation if FileReader API is not available
            if (typeof FileReader === "undefined") {
                return;
            }

            let $deferred = _.Deferred();
            this.validateImage($file, $messages, $options, $deferred, new FileReader(), new Image());
            $deferredList.push($deferred);
        });
    },

    validateImage: function ($file, $messages, $options, $deferred, $fileReader, $image) {
        $image.onload = function () {
            validateImageSize($file, $image, $messages, $options);
            $deferred.resolve();
        };

        $image.onerror = function () {
            $messages.push($options.notImage.replace(/\{$file\}/g, $file.name));
            $deferred.resolve();
        };

        $fileReader.onload = function () {
            $image.src = this.result;
        };

        // Resolve $deferred if there was error while reading data
        $fileReader.onerror = function () {
            $deferred.resolve();
        };

        $fileReader.readAsDataURL($file);
    },

    number: function ($value, $options) {
        if ($options.skipOnEmpty === '1' && isEmpty($value)) {
            return true;
        }
        if( typeof $options.pattern === 'string' ){
            let $regexp = makeRegExp($options.pattern);
            if (typeof $value === 'string' && !$regexp.test($value)) {
                return $options.message;
            }
        }
        if ($options.min !== undefined && parseFloat($value) < $options.min) {
            return formatMessage($options.tooSmall, $value);
        }
        if ($options.max !== undefined && parseFloat($value) > $options.max) {
            return formatMessage($options.tooBig, $value);
        }

        return true;
    },

    range: function ($value, $options) {

        if ($options.skipOnEmpty === '1' && isEmpty($value)) {
            return true;
        }

        if (!$options.allowArray && _.isArray($value)) {
            return $options.message;
        }

        let $valid = true;

        _.each(_.isArray($value) ? $value : [$value], function ($item, $index) {
            //if (_.inArray(v, $options.range) == -1) {
            if ($options.range.indexOf($item) == -1) {
                $valid = false;
                return false;
            } else {
                return true;
            }
        });

        switch ($options.not){
            case '1':
                $options.not = true;
                break;
            case '0':
                $options.not = false;
                break;
            default:
                $options.not = false;
        }

        if ($options.not === $valid) {
            return $options.message;
        }

        return true;
    },

    regularexpression: function ($value, $options) {
        if ($options.skipOnEmpty === '1' && isEmpty($value)) {
            return true;
        }

        let $valid = true;

        if(typeof $options.pattern === 'string'){
            let $regexp = makeRegExp($options.pattern);
            $valid = $regexp.test($value);
        }

        switch ($options.not){
            case '1':
                $options.not = true;
                break;
            case '0':
                $options.not = false;
                break;
            default:
                $options.not = false;
        }

        if ($options.not === $valid) {
            return $options.message;
        }

        return true;
    },

    email: function ($value, $options) {
        if ($options.skipOnEmpty === '1' && isEmpty($value)) {
            return true;
        }

        let $valid = true,
            $regexp = /^((?:"?([^"]*)"?\s)?)(?:\s+)?(?:(<?)((.+)@([^>]+))(>?))$/,
            $matches = $regexp.exec($value);

        if ($matches === null) {
            $valid = false;
        } else {
            let $local_part = $matches[5],
                $domain = $matches[6];

            /*
            if ($options.enableIDN) {
                $local_part = punycode.toASCII($local_part);
                $domain = punycode.toASCII($domain);

                $value = $matches[1] + $matches[3] + $local_part + '@' + $domain + $matches[7];
            }
            */

            if ($local_part.length > 64) {
                $valid = false;
            } else if (($local_part + '@' + $domain).length > 254) {
                $valid = false;
            } else {
                if(typeof $options.pattern === 'string'){
                    $regexp = makeRegExp($options.pattern);
                    $valid = $regexp.test($value);
                } else if($options.allowName && typeof $options.fullPattern === 'string') {
                    $regexp = makeRegExp($options.fullPattern);
                    $valid = $regexp.test($value);
                }
            }
        }

        return $valid || $options.message;
    },

    // @TODO
    date: function ($value, $options) {
        return true;
    },

    // @TODO
    time: function ($value, $options) {
        return true;
    },

    // @TODO
    datetime: function ($value, $options) {
        return true;
    },

    url: function ($value, $options) {
        if ($options.skipOnEmpty === '1' && isEmpty($value)) {
            return true;
        }

        if ($options.defaultScheme && !/:\/\//.test($value)) {
            $value = $options.defaultScheme + '://' + $value;
        }

        let $valid = true;

        /*
        if ($options.enableIDN) {
            let matches = /^([^:]+):\/\/([^\/]+)(.*)$/.exec($value);
            if (matches === null) {
                $valid = false;
            } else {
                $value = matches[1] + '://' + punycode.toASCII(matches[2]) + matches[3];
            }
        }
         */

        if(typeof $options.pattern === 'string'){
            let $regexp = makeRegExp($options.pattern, 'i');
            $valid = $regexp.test($value);
        }

        return $valid || $options.message;
    },

    trim: function ($form, $attribute, $options, $value) {
        let $input = $form.find($attribute.input);
        if ($input.is(':checkbox, :radio')) {
            return $value;
        }

        $value = $input.val();
        if (!$options.skipOnEmpty || !isEmpty($value)) {
            $value = _.trim($value);
            $input.val($value);
        }

        return $value;
    },

    ip: function ($value, $options) {
        if ($options.skipOnEmpty === '1' && isEmpty($value)) {
            return true;
        }

        let $negation = null,
            $cidr = null,
            $matches = new RegExp($options.ipParsePattern).exec($value);

        if ($matches) {
            $negation = $matches[1] || null;
            $value = $matches[2];
            $cidr = $matches[4] || null;
        }

        if ($options.subnet === true && $cidr === null) {
            return formatMessage($options.messages.noSubnet, $value);
        }
        if ($options.subnet === false && $cidr !== null) {
            return formatMessage($options.messages.hasSubnet, $value);
        }
        if ($options.negation === false && $negation !== null) {
            return formatMessage($options.messages.message, $value);
        }

        let $ipVersion = $value.indexOf(':') === -1 ? 4 : 6;
        if ($ipVersion == 6) {
            if (!(new RegExp($options.ipv6Pattern)).test($value)) {
                return formatMessage($options.messages.message, $value);
            }
            if (!$options.ipv6) {
                return formatMessage($options.messages.ipv6NotAllowed, $value);
            }
        } else {
            if (!(new RegExp($options.ipv4Pattern)).test($value)) {
                return formatMessage($options.messages.message, $value);
            }
            if (!$options.ipv4) {
                return formatMessage($options.messages.ipv4NotAllowed, $value);
            }
        }

        return true;
    }
};

