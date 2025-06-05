exports.getDatatabledata = async function (req) {
    var requestQuery = req.query;
    var skip = requestQuery.start;
    var limit = requestQuery.length;
    var sortField = '',
        sortDirection = '',
        searchName = '';
    if (requestQuery.order && requestQuery.order.length > 0) {
        sortField = requestQuery.columns[requestQuery.order[0].column].data;
        if (requestQuery.order[0].dir == 'desc') {
            sortDirection = -1;
        } else {
            sortDirection = 1;
        }
    }
    searchName = requestQuery.search.value;
    return {
        sortDirection: sortDirection,
        sortField: sortField,
        skip: Number(skip),
        limit: Number(limit),
        searchName: searchName,
    };
};

exports.cipher = value => {
    try {
        const textToChars = text => text.split('').map(c => c.charCodeAt(0));
        const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
        const applySaltToChar = code => textToChars(process.env.SECRET_KEY).reduce((a,b) => a ^ b, code);
        const encrypted = value.split('')
          .map(textToChars)
          .map(applySaltToChar)
          .map(byteHex)
          .join('');
    
        return encrypted
    } catch (error) {
        console.log(error);
        return ""
    }
};

exports.cipherObjects = (values, obj) => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(process.env.SECRET_KEY).reduce((a,b) => a ^ b, code);
    for (let i = 0; i < values.length; i++) {
        if(obj[values[i]]){
            obj[values[i]] = obj[values[i]].split('').map(textToChars).map(applySaltToChar).map(byteHex).join('')
        }
    }
    return obj
};

exports.decipher = value => {
    try {
        const textToChars = text => text.split('').map(c => c.charCodeAt(0));
        const applySaltToChar = code => textToChars(process.env.SECRET_KEY).reduce((a,b) => a ^ b, code);
        return value.match(/.{1,2}/g).map(hex => parseInt(hex, 16)).map(applySaltToChar).map(charCode => String.fromCharCode(charCode)).join('');
    } catch (error) {
        console.log(error);
        return ""
    }
}

exports.decipherObj = (values, obj) => {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const applySaltToChar = code => textToChars(process.env.SECRET_KEY).reduce((a,b) => a ^ b, code);
    for (let i = 0; i < values.length; i++) {
        if(obj[values[i]]){
            obj[values[i]] = obj[values[i]].match(/.{1,2}/g).map(hex => parseInt(hex, 16)).map(applySaltToChar).map(charCode => String.fromCharCode(charCode)).join('');
        }
    }
    return obj
}
