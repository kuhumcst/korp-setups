/** @format */
const korpApp = angular.module("korpApp")
korpApp.factory("kwicDownload", function () {
    const emptyRow = function (length) {
        return _.fill(new Array(length), "")
    }

    const createFile = function (dataType, fileType, content) {
        const date = moment().format("YYYYDDMM_HHmmss")
        const filename = `korp_${dataType}_${date}.${fileType}`
        const blobURL = window.URL.createObjectURL(new Blob([content], { type: `text/${fileType}` }))
        return [filename, blobURL]
    }

    const padRows = (data, length) =>
        _.map(data, function (row) {
            const newRow = emptyRow(length)
            newRow[0] = row
            return newRow
        })

    const createSearchInfo = function (requestInfo, totalHits) {
        const rows = []
        const fields = ["cqp", "context", "within", "sorting", "start", "end", "hits"]
        for (let field of fields) {
            var row
            if (field === "cqp") {
                row = `## CQP query: ${requestInfo.cqp}`
            }
            if (field === "context") {
                row = `## context: ${requestInfo.default_context}`
            }
            if (field === "within") {
                row = `## within: ${requestInfo.default_within}`
            }
            if (field === "sorting") {
                const sorting = requestInfo.sort || "none"
                row = `## sorting: ${sorting}`
            }
            if (field === "start") {
                row = `## start: ${requestInfo.start}`
            }
            if (field === "end") {
                const cqpQuery = ""
                row = `## end: ${requestInfo.end}`
            }
            if (field === "hits") {
                row = `## Total hits: ${totalHits}`
            }
            rows.push(row)
        }
        return rows
    }

    const transformDataToAnnotations = function (data, searchInfo) {
        const headers = _.filter(
            _.keys(data[1].tokens[0]),
            (val) => val.indexOf("_") !== 0 && val !== "structs" && val !== "$$hashKey" && val !== "position"
        )
        const columnCount = headers.length + 1
        let corpus
        const res = padRows(searchInfo, columnCount)
        res.push(["match"].concat(headers))
        for (let row of data) {
            if (row.tokens) {
                const textAttributes = []
                for (let attrName in row.structs) {
                    const attrValue = row.structs[attrName]
                    textAttributes.push(attrName + ': "' + attrValue + '"')
                }
                const hitInfo = emptyRow(columnCount)
                hitInfo[0] = `# ${corpus}; text attributes: ${textAttributes.join(", ")}`
                res.push(hitInfo)

                for (let token of row.tokens || []) {
                    let match = ""
                    for (let matchObj of [row.match].flat()) {
                        if (token.position >= matchObj.start && token.position < matchObj.end) {
                            match = "***"
                            break
                        }
                    }
                    const newRow = [match]
                    for (let field of headers) {
                        newRow.push(token[field])
                    }
                    res.push(newRow)
                }
            } else if (row.newCorpus) {
                corpus = row.newCorpus
            }
        }

        return res
    }

    /* transformDataToKWIC replaced by transformDataToCustomKWIC
    const transformDataToKWIC = function (data, searchInfo) {
        let row
        let corpus
        const structHeaders = []
        let res = []
        for (row of data) {
            if (row.tokens) {
                if (row.isLinked) {
                    // parallell mode does not have matches or structs for the linked sentences
                    // current wordaround is to add all tokens to the left context
                    res.push(["", "", row.tokens.map((token) => token.word).join(" "), "", ""])
                    continue
                }

                var attrName, token
                const leftContext = []
                const match = []
                const rightContext = []

                if (row.match instanceof Array) {
                    // the user has searched "not-in-order" and we cannot have a left, match and right context for the download
                    // put all data in leftContext
                    for (token of row.tokens) {
                        leftContext.push(token.word)
                    }
                } else {
                    for (token of row.tokens.slice(0, row.match.start)) {
                        leftContext.push(token.word)
                    }
                    for (token of row.tokens.slice(row.match.start, row.match.end)) {
                        match.push(token.word)
                    }
                    for (token of row.tokens.slice(row.match.end, row.tokens.length)) {
                        rightContext.push(token.word)
                    }
                }

                const structs = []
                for (attrName in row.structs) {
                    if (!structHeaders.includes(attrName)) {
                        structHeaders.push(attrName)
                    }
                }
                for (attrName of structHeaders) {
                    if (attrName in row.structs) {
                        structs.push(row.structs[attrName])
                    } else {
                        structs.push("")
                    }
                }
                const newRow = [
                    corpus,
                    row.match instanceof Array
                        ? row.match.map((match) => match.position).join(", ")
                        : row.match.position,
                    leftContext.join(" "),
                    match.join(" "),
                    rightContext.join(" "),
                ].concat(structs)
                res.push(newRow)
            } else if (row.newCorpus) {
                corpus = row.newCorpus
            }
        }

        const headers = ["corpus", "match_position", "left context", "match", "right_context"].concat(structHeaders)
        res = [headers].concat(res)

        res.push(emptyRow(headers.length))
        for (let row of padRows(searchInfo, headers.length)) {
            res.push(row)
        }

        return res
    }
    */




    const transformDataToCustomKWIC = function (data, searchInfo) {
        const notInOrder = isNotInOrder(data)
        const linkedData = isLinked(data)
        const cqpQuery = searchInfo[0].replace("## CQP query: ", "")
        let res
        let structHeaders = []
        var basicTokenAnnotationHeaders = []
        var tokenAnnotationHeaders = []
        var queryLength = 0
        if (!linkedData) {
            structHeaders = getStructHeaders(data)
            var [basicTokenAnnotationHeaders, tokenAnnotationHeaders, queryLength] = getTokenAnnotationHeaders(data, notInOrder)
        }
        let headers = assembleHeaders(queryLength, structHeaders, tokenAnnotationHeaders)

        if (linkedData) {
            headers = ["corpus", "match_position", "left context", "match", "right_context"]
            res = processLinkedRows(data)
        }
        else if (notInOrder) {
            res = processNotOrderedRows(data, basicTokenAnnotationHeaders, queryLength)
        }
        else {
            res = processNormalRows(data, basicTokenAnnotationHeaders, queryLength)
        }

        res = [headers].concat(res)
        res = addFooter(res, headers, searchInfo)

        return res
    }


    const isNotInOrder = function (data) {
        // Check whether data comes from search where results are "not in order".
        for (let row of data) {
            if (row.match) {
                if (row.match instanceof Array) {
                    return true
                }
                else {
                    return false
                }
            }
        }
    }


    const isLinked = function (data) {
        // Check whether data comes from corpus with linked data, i.e. a multilingual corpus.
        for (let row of data) {
            if (row.isLinked) {
                return true
            }
            else {
                return false
            }
        }
    }


    const processLinkedRows = function (data) {
        // parallell mode does not have matches or structs for the linked sentences
        // current workaround is to add all tokens to the left context
        let res = []
        for (let row of data) {
            if (row.tokens) {
                res.push(["", "", row.tokens.map((token) => token.word).join(" "), "", ""])
            }
        }
        return res
    }


    const processNotOrderedRows = function (data, basicTokenAnnotationHeaders, queryLength) {
        let res = []
        let corpus
        for (let row of data) {
            if (row.newCorpus) {
                corpus = row.newCorpus
            }
            else if (row.tokens) {
                let structs = []
                let [context, match, tokenLevelMeta] = getNotInOrderMatchAndContexts(row, basicTokenAnnotationHeaders, queryLength)

                structs = Object.values(row.structs)

                const newRow = makeBasicRow(match, queryLength, corpus, row, context, [])
                const newRowWithMeta = newRow.concat(structs, tokenLevelMeta)
                res.push(newRowWithMeta)
            }
        }
        return res
    }


    const processNormalRows = function (data, basicTokenAnnotationHeaders, queryLength) {
        let res = []
        let corpus
        for (let row of data) {
            if (row.newCorpus) {
                corpus = row.newCorpus
            }
            else if (row.tokens) {
                let structs = []
                let [leftContext, match, rightContext, tokenLevelMeta] = getMatchAndContexts(row, basicTokenAnnotationHeaders, queryLength)

                structs = Object.values(row.structs)

                const newRow = makeBasicRow(match, queryLength, corpus, row, leftContext, rightContext)
                const newRowWithMeta = newRow.concat(structs, tokenLevelMeta)
                res.push(newRowWithMeta)
            }
        }
        return res
    }


    const getMatchAndContexts = function (row, basicTokenAnnotationHeaders, queryLength) {
        let leftContext = []
        let match = []
        let rightContext = []
        let tokenAnnotationArrays = []

        for (let token of row.tokens.slice(0, row.match.start)) {
            leftContext.push(token.word)
        }
        const matchSlice = row.tokens.slice(row.match.start, row.match.end)
        for (let i in [...Array(queryLength).keys()]) {
            if (matchSlice[i]) {
                const tokenObj = matchSlice[i]
                match.push(tokenObj.word)
                const tokenAnnotations = getTokenAnnotationsBasedOnHeaders(tokenObj, basicTokenAnnotationHeaders)
                tokenAnnotationArrays.push(tokenAnnotations)
            }
            else {
                match.push("")
                tokenAnnotationArrays.push([...Array(basicTokenAnnotationHeaders.length)].map(x => ""))
            }
        }


        for (let token of row.tokens.slice(row.match.end, row.tokens.length)) {
            rightContext.push(token.word)
        }

        const flatGroupedTokenAnnotations = _.flatMap(_.zip(...tokenAnnotationArrays))
        return [leftContext, match, rightContext, flatGroupedTokenAnnotations]
    }


    const getNotInOrderMatchAndContexts = function (row, basicTokenAnnotationHeaders, queryLength) {
        // Note: This function assumes row.match to be an array like the one below.
        // "match":[{"position":81046,"start":59,"end":60},{"position":81088,"start":101,"end":102}]
        let fullContext = []
        let match = []
        let tokenAnnotationArrays = []

        for (let token of row.tokens.slice(0, row.tokens.length)) {
            fullContext.push(token.word)
        }
        for (let i in [...Array(queryLength).keys()]) {
            if (row.match[i]) {
                const tokenObj = row.tokens.slice(row.match[i]["start"], row.match[i]["end"])[0]
                match.push(tokenObj.word)
                const tokenAnnotations = getTokenAnnotationsBasedOnHeaders(tokenObj, basicTokenAnnotationHeaders)
                tokenAnnotationArrays.push(tokenAnnotations)
            }
            else {
                match.push("")
                tokenAnnotationArrays.push([...Array(basicTokenAnnotationHeaders.length)].map(x => ""))
            }
        }

        const flatGroupedTokenAnnotations = _.flatMap(_.zip(...tokenAnnotationArrays))
        return [fullContext, match, flatGroupedTokenAnnotations]
    }


    const getTokenAnnotationsBasedOnHeaders = function (tokenObject, basicTokenAnnotationHeaders) {
        let annotations = []
        for (let header of basicTokenAnnotationHeaders) {
            let annotation = tokenObject[header]
            if (annotation == null) {
                annotation = ""
            }
            annotations.push(annotation)
        }
        return annotations
    }

    const filterTokenAnnotations = function (tokenObject) {
        // Leave out certain attributes of token in order to keep the actual annotations.
        return Object.fromEntries(
            Object.entries(tokenObject).filter(([key]) => key !== "structs" && key !== "$$hashKey" && key !== "position" &&
                                                          key !== "_open_sentence" && key !== "_match" && key !== "_matchSentence"))
    }


    const getStructHeaders = function (data) {
        for (let row of data) {
            if (row.tokens) {
                return Object.keys(row.structs)
            }
        }
        return []
    }


    const getTokenAnnotationHeaders = function (data, notInOrder) {
        // Get token annotation headers - that is, the longest header array (i.e. headers from the corpus with the most annotations)
        let basicTokenAnnotationHeaders = []
        let tokenAnnotationHeaders = []
        let matchSlice = []
        let longestMatchSliceLength = 0
        for (let row of data) {
            if (row.tokens) {
                if (notInOrder) {
                    let matchSlices = []
                    for (let matchObj of row.match) {
                        matchSlices.push(row.tokens.slice(matchObj["start"], matchObj["end"]))
                    }
                    matchSlice = _.flatMap(matchSlices)
                }
                else {
                    matchSlice = row.tokens.slice(row.match.start, row.match.end)
                }
                if (matchSlice.length > longestMatchSliceLength) {
                    longestMatchSliceLength = matchSlice.length
                }

                const firstTokenAnnotationHeaders = Object.keys(filterTokenAnnotations(matchSlice[0]))
                if (firstTokenAnnotationHeaders.length > basicTokenAnnotationHeaders.length) {
                    basicTokenAnnotationHeaders = firstTokenAnnotationHeaders
                }

                let tokenAnnotationHeaderArrays = []
                if (matchSlice.length == 1) {
                    tokenAnnotationHeaderArrays.push(basicTokenAnnotationHeaders)
                }
                else {
                    let i = 1
                    for (let token of matchSlice) {
                        const tokenAnnotations = filterTokenAnnotations(token)
                        tokenAnnotationHeaderArrays.push(Object.keys(tokenAnnotations).map((annotationHeader) => annotationHeader + i))
                        i += 1
                    }
                }

                const flatGroupedTokenAnnotationHeaders = _.flatMap(_.zip(...tokenAnnotationHeaderArrays))
                if (flatGroupedTokenAnnotationHeaders.length > tokenAnnotationHeaders.length) {
                    tokenAnnotationHeaders = flatGroupedTokenAnnotationHeaders
                }
            }
        }
        return [basicTokenAnnotationHeaders, tokenAnnotationHeaders, longestMatchSliceLength]
    }


    const makeBasicRow = function (match, queryLength, corpus, row, leftContext, rightContext) {
        // Return a basic KWIC row (without all kinds of metadata) 
        if (!match.length == queryLength) {
            queryLength = 0
        }

        let matchArray = [match.join(" ")]
        if (queryLength) {
            matchArray = [...match]
            let shortage = queryLength - matchArray.length
            if (shortage > 0) {
                matchArray = matchArray.concat(Array(shortage).fill(""))
            }
        }
        const newRow = [
            corpus,
            row.match instanceof Array ? row.match.map((match) => match.position).join(", ") : row.match.position,
            leftContext.join(" "),
            ...matchArray,
            rightContext.join(" "),
        ]
        return newRow
    }


    const assembleHeaders = function (queryLength, structHeaders, tokenAnnotationHeaders) {
        let matchHeaders = ["match"]
        if (queryLength > 1) {
            matchHeaders = [...Array(queryLength).keys()].map((i) => "match" + (i + 1))
        }
        return ["corpus", "match_position", "left context", ...matchHeaders, "right_context"].concat(structHeaders, tokenAnnotationHeaders)
    }


    const addFooter = function (res, headers, searchInfo) {
        res.push(emptyRow(headers.length))
        for (let row of padRows(searchInfo, headers.length)) {
            res.push(row)
        }
        return res
    }










    const array2csv = function (data, sep, rowsep) {
      return data.map(row =>
        row
        .map(String)                        // convert every value to String
        .map(v => v.replaceAll('"', '""'))  // escape double quotes
        .map(v => `"${v}"`)                 // quote every value
        .join(sep)                          // fields separated by sep
      ).join(rowsep)                        // rows separated by rowsep
    }





    const transformData = function (dataType, data, requestInfo, totalHits) {
        const searchInfo = createSearchInfo(requestInfo, totalHits)
        if (dataType === "annotations") {
            return transformDataToAnnotations(data, searchInfo)
        }
        // if (dataType === "oldkwic") {
        //     return transformDataToKWIC(data, searchInfo)
        // }
        if (dataType === "kwic") {
            return transformDataToCustomKWIC(data, searchInfo)
        }
    }

    const makeContent = function (fileType, transformedData) {
        let dataDelimiter
        if (fileType === "csv") {
            dataDelimiter = ";"
        }
        if (fileType === "tsv") {
            dataDelimiter = "\t"
        }

        // const csv = new CSV(transformedData, {
        //     delimiter: dataDelimiter,
        // })

        // Prepending the BOM '\uFEFF', creating a file encoded in UTF-8-BOM, makes
        // the csv readable in Excel as well as text editors on Windows as well as Mac.
        const csvWithBOM = '\uFEFF' + array2csv(transformedData, dataDelimiter, '\n')
        return csvWithBOM
    }

    // dataType: either "kwic" or "annotations"
    // fileType: either "csv" or "tsv"
    // data: json from the backend
    return {
        makeDownload(dataType, fileType, data, requestInfo, totalHits) {
            const tmp = transformData(dataType, data, requestInfo, totalHits)
            const tmp2 = makeContent(fileType, tmp)
            return createFile(dataType, fileType, tmp2)
        },
    }
})
