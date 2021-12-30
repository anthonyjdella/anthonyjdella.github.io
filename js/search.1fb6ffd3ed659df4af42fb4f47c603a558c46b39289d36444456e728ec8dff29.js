function searching () {
    const SEARCH_ID = 'search';
    const ENABLE_SEARCH_ID = 'enable_search';
    const REGEX_MODE_ID = 'regex_mode';
    const LIST_ID = 'blogSearch';

    let list = null;
    let filteredList = null;

    const logPerformance = function(work, startTime, endTime) {
        const duration = (endTime - startTime).toFixed(2);
        console.log(`${work} took ${duration} ms`);
    };

    const getSearchEl = document.getElementById(SEARCH_ID);
    const getEnableSearchEl = document.getElementById(ENABLE_SEARCH_ID);
    const getRegexModeEl = document.getElementById(REGEX_MODE_ID);
    const getListEl = document.getElementById(LIST_ID);

    console.log(getSearchEl)
    console.log(getEnableSearchEl)
    console.log(getRegexModeEl)
    console.log(getListEl)

    const disableSearchEl = function(placeholder) {
        getSearchEl().disabled = true;
        getSearchEl().placeholder = placeholder;
    };

    const enableSearchEl = function() {
        getSearchEl().disabled = false;
        getSearchEl().placeholder =
            'Case-insensitive search by title, content, or publish date';
    };

    const disableRegexModeEl = function() {
        getRegexModeEl().disabled = true;
    };

    const enableRegexModeEl = function() {
        getRegexModeEl().disabled = false;
    };

    const fetchJsonIndex = function() {
        const startTime = performance.now();
        disableSearchEl('Loading ...');
        const url = `${window.location.origin}/index.json`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                list = data.blog;
                filteredList = data.blog;
                enableSearchEl();
                logPerformance('fetchJsonIndex', startTime, performance.now());
            })
            .catch(error =>
                console.error(`Failed to fetch JSON index: ${error.message}`)
            );
    };

    const filterList = function(regexMode) {
        const regexQuery = new RegExp(getSearchEl().value, 'i');
        const query = getSearchEl().value.toUpperCase();
        filteredList = list.filter(item => {
            const title = item.Title.toUpperCase();
            const content = item.PlainContent.toUpperCase();
            const publishDate = item.PublishDateFormatted.toUpperCase();
            if (regexMode) {
                return (
                    regexQuery.test(title) ||
                    regexQuery.test(content) ||
                    regexQuery.test(publishDate)
                );
            } else {
                return (
                    title.includes(query) ||
                    content.includes(query) ||
                    publishDate.includes(query)
                );
            }
        });
    };

    const renderList = function() {
        const newList = document.createElement('ul');
        newList.id = LIST_ID;

        filteredList.forEach(item => {
            const li = document.createElement('li');

            const publishDate = document.createElement('span');
            publishDate.textContent = item.PublishDateFormatted;

            const titleLink = document.createElement('a');
            titleLink.href = item.RelPermalink;
            titleLink.textContent = item.Title;

            li.appendChild(publishDate);
            li.appendChild(document.createTextNode(' '));
            li.appendChild(titleLink);

            newList.appendChild(li);
        });

        const oldList = getListEl();
        oldList.replaceWith(newList);
    };

    const handleSearchEvent = function() {
        const startTime = performance.now();
        const regexMode = getRegexModeEl().checked;
        filterList(regexMode);
        renderList();
        logPerformance('handleSearchEvent', startTime, performance.now());
    };

    const handleEnableSearchEvent = function() {
        if (getEnableSearchEl().checked) {
            fetchJsonIndex();
            enableRegexModeEl();
        } else {
            disableSearchEl('Disabled ...');
            disableRegexModeEl();
        }
    };

    const addEventListeners = function() {
        getEnableSearchEl().addEventListener('change', handleEnableSearchEvent);
        getSearchEl().addEventListener('keyup', handleSearchEvent);
        getRegexModeEl().addEventListener('change', handleSearchEvent);
    };

    const main = function() {
        if (getSearchEl()) {
            addEventListeners();
        }
    };

    main();
};

searching();