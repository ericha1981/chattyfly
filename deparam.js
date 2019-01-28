parseQueryString = (param) => {
    const queryVars = param.substring(1).split('&');

    var queryString = {};
    queryVars.forEach((element) => {
        paramName = element.split('=')[0];
        paramVal = element.split('=')[1].replace(/\+/g, ' ');

        queryString[paramName] = paramVal;
    });

    return queryString;
}
