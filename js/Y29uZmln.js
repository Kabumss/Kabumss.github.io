var adsManager, adsLoader, adDisplayContainer, videoContent, adsInitialized, adsPlay = new Array(), destroy = false, verification2 = false, advUrl = 'https://vast.yomeno.xyz/?tcid=3344', adSW = false;
var subsURL = window.location.host, data, waitData = true, hash, hashAux = 'series', indexIframe, swHome, swSeries, indexForward = -1, indexDub = new Array(), collapse = false, activeIndex, language = 1, iniPage = true;

$(document).ready(function () {
    var url = window.parent.location.hash.slice(1).split("/"), i;
    if (subsURL !== '5yktms21bkvr08g1zg6uxg-on.drv.tw') {
        subsURL = '';
    } else {
        subsURL = '/www.kabums.org';
    }
    $("#forward").prop('disabled', true);
    if (url.length === 1 && url[0] === 'series') {
        $("#back").prop('disabled', true);
    }
    if (url[0] !== '') {
        swHome = false;
        swSeries = true;
        hash = url;
        titlePage();
        if (/^\d+$/.test(url[url.length - 1]) && /^\d+$/.test(url[url.length - 2])) {
            hash = '';
            for (i = 0; i < url.length - 1; i++) {
                hash += url[i];
                if (i < url.length - 2) {
                    hash += '/';
                }
            }
            hash = hash.split("/");
        }
        iniCartoons();
    } else {
        gtag('config', 'G-TVDT8FN44H', {'page_path': '/home'});
        swHome = true;
        swSeries = false;
        utterances(-1);
    }
});

$(window.parent.document).on('click', "#home", function () {
    if (!swHome) {
        gtag('config', 'G-TVDT8FN44H', {'page_path': '/home'});
        hashAux = window.parent.location.hash;
        window.parent.history.pushState("", window.parent.document.title, window.parent.location.pathname + window.parent.location.search);
        window.parent.document.title = 'Kabums';
        $('#homePage', window.parent.document).css('display', '');
        $('#iframe1', window.parent.document).css('display', 'none');
        swHome = true;
        swSeries = false;
        utterances(-1);
    } else {
        window.parent.scrollTo(0, 0);
    }
});

$(window.parent.document).on('click', "#series", function () {
    var i, num, url;
    if (swHome) {
        window.parent.location.hash = hashAux;
        swHome = false;
        url = hashAux.split("/");
        titlePage();
        if (url.length === 1) {
            swSeries = true;
        } else {
            swSeries = false;
        }
        iniCartoons();
        if (window.parent.location.hash.slice(1).split("/").length === 1) {
            $("#back").prop('disabled', true);
        }
    } else {
        url = window.parent.location.hash.slice(1).split("/");
        if (/^\d+$/.test(url[url.length - 1])) {
            num = 2;
        } else {
            num = 1;
        }
        for (i = url.length; i > num; i--) {
            $('#nav > form svg').last().remove();
            $('#nav > form button').last().remove();
        }
        window.parent.location.hash = 'series';
        window.parent.document.title = 'Dibujos Animados';
        $("#forward").prop('disabled', true);
        $("#back").prop('disabled', true);
        window.scrollTo(0, 0);
        dataGenerateFolder();
    }
});

$(document).on('click', "#folder", function () {
    $("#forward").prop('disabled', true);
    $("#back").prop('disabled', false);
    window.parent.location.hash += '/' + $(this).text().replace(/ /g, '_');
    hash = window.parent.location.hash.slice(1).split("/");
    titlePage();
    dataGenerateFolder();
});

$(document).on('click', "[name='vid']", function () {
    adSW = false;
    loadVideo($(this).index(), true);
});

$(window.parent.document).on('click', '#myModal', function () {
    if ($('#myModal', window.parent.document).attr('class') === 'modal fade') {
        $("#forward").prop('disabled', false);
        $('#video', window.parent.document).attr('src', '0.html');
        $('#dubbing > button', window.parent.document).remove();
        deleteNumPath();
        destroyIma();
    }
});

$(window.parent.document).on('click', '#nextPrevious > button', function () {
    var url = window.parent.location.hash.slice(1).split("/");
    $('#dubbing > button', window.parent.document).remove();
    deleteNumPath();
    //destroyIma();
    adSW = false;
    if ($(this).index() === 1) {
        loadVideo(parseInt(url[url.length - 1]), false);
    } else {
        loadVideo(parseInt(url[url.length - 1]) - 2, false);
    }
});

$(document).on('click', "#back", function () {
    if (!waitData) {
        var url = window.parent.location.hash.slice(1).split("/");
        $("#forward").prop('disabled', false);
        if (url.length === 2) {
            $("#back").prop('disabled', true);
        }
        deleteNumPath();
        $('#nav > form svg').last().remove();
        $('#nav > form button').last().remove();
        dataGenerateFolder();
    }
});

$(document).on('click', "#forward", function () {
    if (!waitData) {
        $("#back").prop('disabled', false);
        if (hash[window.parent.location.hash.split("/").length] !== undefined) {
            window.parent.location.hash += '/' + hash[window.parent.location.hash.split("/").length];
            titlePage();
            dataGenerateFolder();
            if (hash[window.parent.location.hash.split("/").length] === undefined) {
                $("#forward").prop('disabled', true);
            }
        } else {
            indexForward = indexIframe;
            window.parent.location.hash += '/' + (indexForward + 1);
            titlePage();
            $('[name="vid"]:eq(' + indexForward + ')').trigger('click');
        }
    }
});

$(window.parent.document).on('click', '[name="dub"]', function () {
    $('#video', window.parent.document).attr('src', data["video"][indexIframe][indexDub[$(this).index()]]);
    $('[name="dub"]:eq(' + (language - 1) + ')', window.parent.document).removeClass('active');
    $('[name="dub"]:eq(' + $(this).index() + ')', window.parent.document).addClass('active');
    language = $(this).index() + 1;
    changeLanguagePath();
});

$(document).on('keyup', '#myInput', function () {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
});

$(window.parent.document).on('click', '#collapse', function () {
    if (!collapse) {
        collapse = true;
    } else {
        collapse = false;
    }
    $('#collapseDescription', window.parent.document).attr('aria-expanded', collapse);
});

new ResizeSensor(jQuery('.form-inline'), function () {
    $('#list').attr('style', 'padding-top: ' + ($('.form-inline').height() + 40) + 'px');
});

function iniCartoons() {
    var url = window.parent.location.hash.slice(1).split("/"), path = "", i;
    $('#myUL').remove();
    $('#iframe1', window.parent.document).css('display', '');
    $('#homePage', window.parent.document).css('display', 'none');
    if (!/^\d+$/.test(url[url.length - 1])) {
        path = window.parent.location.hash.slice(1);
    } else if (!/^\d+$/.test(url[url.length - 2]) && /^\d+$/.test(url[url.length - 1])) {
        for (i = 0; i < url.length - 1; i++) {
            path += url[i];
            if (i < url.length - 2) {
                path += '/';
            }
        }
        language = url[url.length - 1];
    } else {
        for (i = 0; i < url.length - 2; i++) {
            path += url[i];
            if (i < url.length - 3) {
                path += '/';
            }
        }
        language = url[url.length - 2];
    }
    $("#ZGF0YQ").attr('src', subsURL + path.replace(/_/g, ' ') + '/data.html?v=' + version);
    waitForIframe();
}

function generateFolder() {
    var i, ini, index, numDelete;
    var url = window.parent.location.hash.slice(1).split("/");
    if (!/^\d+$/.test(url[url.length - 2]) || iniPage) {
        if (!/^\d+$/.test(url[url.length - 2]) && /^\d+$/.test(url[url.length - 1])) {
            numDelete = 2;
        } else {
            numDelete = 1;
        }
        if (swSeries) {
            numDelete = 1;
        }
        index = -1;
        if (iniPage && /^\d+$/.test(url[url.length - 2])) {
            numDelete = 2;
            index = parseInt(url[url.length - 1]) - 1;
            if (index < 0 || index > (Object.keys(data["name"]).length - 1)) {
                deleteNumPath();
                index = -1;
            }
        } else if (iniPage && !/^\d+$/.test(url[url.length - 1])) {
            numDelete = 0;
        }
        iniPage = false;
        $('#nav > form button').last().prop('disabled', false);
        if (!swSeries) {
            if ($('#nav > form button').last().text().toLowerCase() !== url[url.length - numDelete].replace(/_/g, ' ').toLowerCase()) {
                $('#nav > form').append('<i class="fas fa-chevron-right"></i><button class="btn bg-light" type="button" title="' + url[url.length - numDelete].replace(/_/g, ' ') + '" onclick="path(' + (url.length - numDelete) + ')" >' + url[url.length - numDelete].replace(/_/g, ' ') + '</button>');
            }
        } else {
            for (i = 1; i < url.length - numDelete; i++) {
                $('#nav > form').append('<i class="fas fa-chevron-right"></i><button class="btn bg-light" type="button" title="' + url[i].replace(/_/g, ' ') + '" onclick="path(' + i + ')" >' + url[i].replace(/_/g, ' ') + '</button>');
            }
            swSeries = false;
        }
        $('#nav > form button').last().prop('disabled', true);
    } else {
        index = parseInt(url[url.length - 1]) - 1;
        if (index < 0 || index > (Object.keys(data["name"]).length - 1)) {
            deleteNumPath();
            index = -1;
        }
    }
    $('#list').append('<ul id="myUL"></ul>');
    for (i = 0; i <= Object.keys(data["name"]).length - 1; i++) {
        if (Object.keys(data["video"]).length === 0) {
            ini = '<li id="folder" class="list-group-item"><a href="#"><i class="fas fa-folder"></i>';
        } else {
            ini = '<li name="vid" class="list-group-item"><a href="#"><i class="far fa-file-video text-danger"></i>';
        }
        $('#myUL').append(ini + '<span class="ml-3">' + data.name[i] + '</span></a></li>');
    }
    if (index !== -1) {
        indexForward = index;
        $('[name="vid"]:eq(' + index + ')').trigger('click');
    }
    if (Object.keys(data["video"]).length !== 0) {
        $("#forward").prop('disabled', true);
        if (!/^\d+$/.test(url[url.length - 1])) {
            window.parent.location.hash += '/' + language;
        }
    }
}

function dataGenerateFolder() {
    $("#ZGF0YQ").attr('src', subsURL + window.parent.location.hash.slice(1).replace(/_/g, ' ') + '/data.html?v=' + version);
    $('#myUL').remove();
    waitData = true;
    waitForIframe();
}

function loadVideo(index, sw) {
    var num = window.parent.location.hash.slice(1).split("/");
    if (indexForward === -1) {
        indexIframe = index;
    } else {
        indexIframe = indexForward;
        indexForward = -1;
    }
    $("#forward").prop('disabled', false);
    if (!/^\d+$/.test(num[num.length - 2])) {
        window.parent.location.hash += '/' + (indexIframe + 1);
        titlePage();
    }
    num = window.parent.location.hash.slice(1).split("/");
    if (parseInt(num[num.length - 1]) !== $('#myUL > li').length) {
        $('#next', window.parent.document).prop('disabled', false);
    } else {
        $('#next', window.parent.document).prop('disabled', true);
    }
    if (parseInt(num[num.length - 1]) - 2 !== -1) {
        $('#previous', window.parent.document).prop('disabled', false);
    } else {
        $('#previous', window.parent.document).prop('disabled', true);
    }
    videoLink();
    destroy = false;
    //initADS();
    moduleAndUtterances(indexIframe);
    if (sw) {
        $('#btnModal', window.parent.document).trigger('click');
    }
    gtag('config', 'G-TVDT8FN44H', {'page_path': window.parent.location.hash + '/' + data.name[indexIframe]});
}

function videoLink() {
    if (data["video"][indexIframe]["description"] === undefined) {
        generateLink(1, 0);
    } else {
        generateLink(2, 1);
    }
}

function generateLink(numCompare, numDelete) {
    var i, k = 0, sw = true, dubbing = '', active = '', minos = 0;
    if (data["video"][indexIframe]["description"] !== undefined) {
        minos--;
    }
    if (language > Object.keys(data["video"][indexIframe]).length + minos) {
        language = 1;
        changeLanguagePath();
    }
    if (Object.keys(data["video"][indexIframe]).length === numCompare) {
        $('#video', window.parent.document).attr('src', data["video"][indexIframe][0]);
    } else {
        if (!adSW) {
            for (i = 0; i < Object.keys(data["video"][indexIframe]).length - numDelete; i++) {
                if (data["video"][indexIframe][k] !== undefined) {
                    if (language - 1 === i) {
                        active = ' active';
                    }
                    dubbing += '<button name="dub" class="nav-link' + active + '" >' + data.dubbing[k] + '</button>';
                    indexDub[i] = k;
                    k++;
                } else {
                    k++;
                    while (sw) {
                        if (data["video"][indexIframe][k] !== undefined) {
                            if (language - 1 === i) {
                                active = ' active';
                            }
                            dubbing += '<button name="dub" class="nav-link' + active + '" >' + data.dubbing[k] + '</button>';
                            indexDub[i] = k;
                            k++;
                            sw = false;
                        } else {
                            k++;
                        }
                    }
                    sw = true;
                }
                active = '';
            }
            $('#dubbing', window.parent.document).append(dubbing);
        }
        $('#video', window.parent.document).attr('src', data["video"][indexIframe][indexDub[language - 1]]);
    }
}

function titlePage() {
    if (waitData) {
        setTimeout("titlePage()", 100);
    } else {
        var url = window.parent.location.hash.slice(1).split("/");
        if (/^\d+$/.test(url[url.length - 2]) && /^\d+$/.test(url[url.length - 1])) {
            window.parent.document.title = url[1].replace(/_/g, ' ') + ' - ' + data.name[parseInt(url[url.length - 1]) - 1];
        } else if (url.length === 2) {
            window.parent.document.title = url[1].replace(/_/g, ' ');
        } else if (url.length === 1) {
            window.parent.document.title = 'Dibujos Animados';
        } else {
            window.parent.document.title = url[1].replace(/_/g, ' ') + ' - ' + url[2].replace(/_/g, ' ');
        }
    }
}

function deleteNumPath() {
    var i, url = window.parent.location.hash.slice(1).split("/"), path = "", numDelete;
    if (!/^\d+$/.test(url[url.length - 2]) && /^\d+$/.test(url[url.length - 1])) {
        numDelete = 2;
    } else {
        numDelete = 1;
    }
    for (i = 0; i < url.length - numDelete; i++) {
        path += url[i];
        if (i < url.length - numDelete - 1) {
            path += '/';
        }
    }
    window.parent.location.hash = path;
    titlePage();
}

function path(ind) {
    var url = window.parent.location.hash.slice(1).split("/"), i, path = "", numDelete;
    if (!/^\d+$/.test(url[url.length - 2]) && /^\d+$/.test(url[url.length - 1])) {
        numDelete = 2;
    } else {
        numDelete = 1;
    }
    for (i = 0; i <= ind; i++) {
        path += url[i];
        if (i < ind) {
            path += '/';
        }
    }
    window.parent.location.hash = path;
    titlePage();
    for (i = url.length; i > ind + numDelete; i--) {
        $('#nav > form svg').last().remove();
        $('#nav > form button').last().remove();
    }
    if (url[ind] === 'series') {
        $("#back").prop('disabled', true);
    }
    dataGenerateFolder();
    $("#forward").prop('disabled', false);
}


function changeLanguagePath() {
    var url = window.parent.location.hash.slice(1).split("/"), i, path = '';
    url[url.length - 2] = language;
    for (i = 0; i < url.length; i++) {
        path += url[i];
        if (i < url.length - 1) {
            path += '/';
        }
    }
    window.parent.location.hash = path;
}

function utterances(index) {
    var utteranc, title, utterances = 'utterances', comments = 'comments';
    if (index > -1) {
        title = window.parent.location.hash.slice(1).split("/")[1].replace(/_/g, ' ') + ' - ' + data.name[index];
    } else {
        title = 'Kabums';
        utterances += 'Home';
        comments += 'Home';
    }
    $('#' + utterances, window.parent.document).remove();
    $('#' + comments, window.parent.document).append('<div id="' + utterances + '"></div>');
    utteranc = document.createElement("script");
    utteranc.src = "https://utteranc.es/client.js";
    utteranc.setAttribute('repo', 'Dieblos/kabums-comentarios');
    utteranc.setAttribute('issue-term', title);
    utteranc.setAttribute('theme', 'github-light');
    utteranc.setAttribute('crossorigin', 'anonymous');
    window.parent.document.getElementById(utterances).appendChild(utteranc);
}

function moduleAndUtterances(index) {
    $('#titleVideo', window.parent.document).remove();
    if (data["video"][index]["description"] !== undefined) {
        $('#module > p', window.parent.document).remove();
        $('#module', window.parent.document).css('display', '');
        $('#module', window.parent.document).prepend('<p class="collapse" id="collapseDescription" aria-expanded="false">' + data["video"][index]["description"] + '</p>');
    } else {
        $('#module', window.parent.document).css('display', 'none');
    }
    collapse = false;
    $('#collapseDescription', window.parent.document).attr('aria-expanded', collapse);
    $('#module > a', window.parent.document).addClass("collapsed");
    $('#module', window.parent.document).before('<h1 id="titleVideo">' + window.parent.location.hash.slice(1).split("/")[1].replace(/_/g, ' ') + ' - ' + data.name[index] + '</h1>');
    utterances(index);
}

function waitForIframe() {
    if (waitData) {
        setTimeout("waitForIframe()", 100);
    } else {
        generateFolder();
    }
}

function initADS() {
    if (adsPlay[window.parent.location.hash] === undefined) {
        videoContent = window.parent.document.getElementById('videoModal');
        newIMA();
    }
}

function newIMA() {
    if (destroy === true) {
        destroyIma();
    } else {
        destroy = true;
    }
    setUpIMA();
    loadAdv(advUrl);
}

function destroyIma() {
    adDisplayContainer.destroy();
    adsLoader.contentComplete();
    adsLoader.destroy();
    if (adsManager) {
        adsManager.destroy();
    }
    adsInitialized = false;
    console.log('destroyIma()', 'adDisplayContainer', adDisplayContainer, 'adsLoader', adsLoader, 'adsManager', adsManager);
}

function setUpIMA() {
    // Create the ad display container.
    adDisplayContainer = new google.ima.AdDisplayContainer(window.parent.document.getElementById('adContainer'), videoContent);
    // Create ads loader.
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    // Listen and respond to ads loaded and error events.
    adsLoader.addEventListener(
            google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
            onAdsManagerLoaded,
            false);
    adsLoader.addEventListener(
            google.ima.AdErrorEvent.Type.AD_ERROR,
            onAdError,
            false);
}

function loadAdv(url) {
    // Request video ads.
    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = url;
    adsRequest.linearAdSlotWidth = videoContent.clientWidth;
    adsRequest.linearAdSlotHeight = videoContent.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoContent.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoContent.clientHeight / 3;

    adsLoader.requestAds(adsRequest);
}


function playAds() {
    //console.log('playAds');
    // Initialize the container. Must be done via a user action on mobile devices.
    //videoContent.load();
    adDisplayContainer.initialize();
    try {
        if (!adsInitialized) {
            adDisplayContainer.initialize();
            adsInitialized = true;
            console.log('playAds - adDisplayContainer initialized');
        }
        var width = videoContent.clientWidth;
        var height = videoContent.clientHeight;
        adsManager.init(width, height, google.ima.ViewMode.NORMAL);
        adsManager.start();
    } catch (adError) {

        console.log('playAds() adError:', adError);
        //videoContent.play();
    }
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    //console.log('onAdsManagerLoaded');
    var adsRenderingSettings = new google.ima.AdsRenderingSettings();
    adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
    // videoContent should be set to the content video element.
    adsManager = adsManagerLoadedEvent.getAdsManager(videoContent, adsRenderingSettings);

    adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
    adsManager.addEventListener(google.ima.AdError.Type.AD_LOAD, onAdError);
    adsManager.addEventListener(google.ima.AdError.Type.AD_PLAY, onAdError);

    for (var evt in google.ima.AdEvent.Type) {
        adsManager.addEventListener(google.ima.AdEvent.Type[evt], onAdEvent);
    }

    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested);
    adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested);
    adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAdEvent);

    playAds();
}

function onAdEvent(adEvent) {
    //console.log('adEvent', adEvent.type);
    // Retrieve the ad from the event. Some events (e.g. ALL_ADS_COMPLETED)
    // don't have ad object associated.
    var ad = adEvent.getAd();
    switch (adEvent.type) {
        case google.ima.AdEvent.Type.LOADED:
            if (!ad.isLinear()) {
                adSW = true;
                videoLink();
            }
            break;
    }
}

jQuery(window).on('orientationchange resize', function (event) {
    var h;
    h = videoContent.clientHeight;
    $('#msjAD', window.parent.document).attr('style', 'top:' + (h / 2) + 'px');
    if (adsManager) {
        var height, width;
        width = videoContent.clientWidth;
        height = videoContent.clientHeight;
        adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
    }
});

function onAdError(adErrorEvent) {
    //console.log('onAdError', adErrorEvent.getError());
    gtag('event', 'Video Ad (Error)', {
        'event_category': window.parent.location.hash,
        'event_label': data.name[indexIframe]
    });
    //if (verification2 === false) {
    newIMA();
    /* } else {
     $('#videoModal', window.parent.document).append('<iframe id="video" src="" frameborder="0" allowfullscreen></iframe>');
     adSW = true;
     videoLink();
     destroyIma();
     } */
}

function onContentPauseRequested() {
    var height = videoContent.clientHeight;
    gtag('event', 'Video Ad in Progress', {
        'event_category': window.parent.location.hash,
        'event_label': data.name[indexIframe]
    });
    $('#video', window.parent.document).remove();
    //verification2 = true;
    $('#dubbing > button', window.parent.document).prop('disabled', true);
    $('#msjAD', window.parent.document).attr('style', 'top:' + (height / 2) + 'px');
    $('#msjAD', window.parent.document).text('Espera un momento, cargando anuncio...');
}

function onContentResumeRequested() {
    adsPlay[window.parent.location.hash] = true;
    destroyIma();
    $('#videoModal', window.parent.document).append('<iframe id="video" src="" frameborder="0" allowfullscreen></iframe>');
    adSW = true;
    videoLink();
    //verification2 = false;
    $('#dubbing > button', window.parent.document).prop('disabled', false);
    $('#msjAD', window.parent.document).text('Espera un momento, cargando video...');
    gtag('event', 'Successful Video Ad', {
        'event_category': window.parent.location.hash,
        'event_label': data.name[indexIframe]
    });
}
