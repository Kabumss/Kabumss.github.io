var mejsPlayer, language = new Array(), sw = false, play = false, collapse = false, serie = "", subsURL = window.location.host, hideNav = false, subtitles = '', isMobile = deviceDetection(), ios = iOS();
var adsManager, adsLoader, adDisplayContainer, videoContent, adsInitialized, adsPlay = new Array(), destroy = false, adsSW = false, timeADS, verification2 = false, advUrl = 'https://vast.yomeno.xyz/?tcid=3344';

$(document).ready(function () {
    var url = window.parent.location.hash.split("/");
    if (url.length === 4) {
        loadPlayer();
        $('#homePage').css('display', 'none');
        $('#module').css('display', '');
        $('#module').prepend('<h3>' + data[url[0]]['info']['video']['title'] + '</h3>' + '<p class="collapse" id="collapseDescription" aria-expanded="false">' + data[url[0]]['info']['video']['description'] + '</p>');
    } else {
        gtag('config', 'G-TVDT8FN44H', {'page_path': '/home'});
        utterances('Kabums');
    }
});

$(window).on("load", function () {
    var url = window.parent.location.hash.split("/");
    play = true;
    if (Object.keys(data[url[0]][url[1].replace('_', ' ')][url[2]]['subtitles']).length === 0) {
        $('.mejs__captions-button').attr('style', 'display: none');
    }
    $('.mejs__poster').css('display', '');
});

$(document).on('click', ".mejs__qualities-selector-list-item", function () {
    var time = $('video').get(0).currentTime, numl;
    var url = window.parent.location.hash.split("/");
    let i;
    window.parent.location.hash = url[0] + '/' + url[1] + '/' + url[2] + '/' + language[$(this).text()];
    url[1] = url[1].replace('_', ' ');
    url[3] = language[$(this).text()];
    for (i = 0; i < Object.keys(data[url[0]][url[1]]).length; i++) {
        if (parseInt(url[3].slice(1)) <= Object.keys(data[url[0]][url[1]]['E' + (i + 1)]['video']).length) {
            numl = url[3];
        } else {
            numl = 'l1';
        }
        $('#mep_0_playlist_item_' + i).val(data[url[0]][url[1]]['E' + (i + 1)]['video'][numl]['link']);
    }
    $('.mejs__playlist-selector-list-item:eq(' + (parseInt(url[2].slice(1)) - 1) + ')').trigger('click');
    $('video').get(0).currentTime = time;
});

$(document).on('click', '.mejs__playlist-selector-list-item', function () {
    var url = window.parent.location.hash.split("/");
    let i;
    if (sw === true) {
        $('#srcVideo_html5').attr('src', $('#mep_0_playlist_item_' + $(this).index()).val());
        $('.mejs__playlist-layer').removeClass('mejs__playlist-hidden');
        $('.mejs__playlist-selector-list-item:eq(' + (parseInt(url[2].slice(1)) - 1) + ')').removeClass('mejs__playlist-selected');
        $('.mejs__playlist-selector-list-item:eq(' + $(this).index() + ')').addClass('mejs__playlist-selected');
        $('.mejs__playlist-selector-label:eq(' + (parseInt(url[2].slice(1)) - 1) + ') > span').remove();
        $('.mejs__playlist-selector-label:eq(' + $(this).index() + ')').prepend("<span>▶</span> ");
    }
    $('.mejs__qualities-selector-list-item').remove();
    for (i = 1; i <= Object.keys(data[url[0]][$("#info").val()]['E' + (parseInt($(this).index()) + 1)]['video']).length; i++) {
        $('.mejs__qualities-selector-list').append('<li class="mejs__qualities-selector-list-item" ><label id="lang' + i + '" class="mejs__qualities-selector-label" class="mejs__qualities-selector-label">' + data[url[0]][$("#info").val()]['E' + (parseInt($(this).index()) + 1)]['video']['l' + i]['lang'] + '</label></li>');
    }
    if ($("#lang" + url[3].slice(1)).text() !== "") {
        $("#lang" + url[3].slice(1)).addClass("mejs__qualities-selected");
    } else {
        $("#lang1").addClass("mejs__qualities-selected");
    }
    for (i = 1; i <= Object.keys(data[url[0]][$("#info").val()]['E' + (parseInt($(this).index()) + 1)]['video']).length; i++) {
        language[data[url[0]][$("#info").val()]['E' + (parseInt($(this).index()) + 1)]['video']['l' + i]['lang']] = 'l' + i;
    }
    window.parent.location.hash = url[0] + '/' + url[1] + '/E' + (parseInt($(this).index()) + 1) + '/' + url[3];
    url = window.parent.location.hash.split("/");
    loadSubtitles();
    mejsPlayer.play();
    gtag('config', 'G-TVDT8FN44H', {'page_path': '/' + window.parent.location.hash});
    utterances(url);
});

$(document).on('change', '#info', function () {
    var url = window.parent.location.hash.split("/");
    url[1] = $(this).val();
    changeContent(url);
    utterances(url);
});

$(document).on('click', ".home-btn", function () {
    if (window.parent.location.hash !== "") {
        window.scrollTo(0, 0);
        $('#content').attr('style', 'display: none');
        $('#homePage').css('display', '');
        $('#comments').css('display', '');
        window.parent.history.pushState("", document.title, window.parent.location.pathname + window.parent.location.search);
        mejsPlayer.pause();
        $('#module').attr('style', 'display: none');
        gtag('config', 'G-TVDT8FN44H', {'page_path': '/home'});
        utterances('Kabums');
    } else {
        window.scrollTo(0, 0);
    }
});

$(document).on('click', '.pushy-link', function () {
    var url;
    window.scrollTo(0, 0);
    window.parent.location.hash = $('.pushy-link:eq(' + $(this).index() + ') > a').attr('href');
    url = window.parent.location.hash.split("/");
    $('#content').css('display', '');
    $('#homePage').attr('style', 'display: none');
    if (serie !== url[0]) {
        collapse = false;
        $('#collapseDescription').attr('aria-expanded', collapse);
        serie = url[0];
        play = false;
        if ($('#srcVideo').length === 1) {
            let i;
            $('#info > option').remove();
            for (i = 1; i <= Object.keys(data[url[0]]['info']['season']).length; i++) {
                $('#info').append('<option value="' + data[url[0]]['info']['season']['i' + i] + '">' + data[url[0]]['info']['season']['i' + i] + '</option>');
            }
            url[1] = url[1].replace('_', ' ');
            $('video').attr('data-cast-title', data[url[0]]['info']['video']['title']);
            $('.mejs__poster-img').attr('src', data[url[0]]['info']['video']['poster']);
            $('[class="mejs__poster mejs__layer"]').css('background-image', 'url(&quot;' + data[url[0]]['info']['video']['poster'] + '&quot;)');
            $('video').attr('poster', data[url[0]]['info']['video']['poster']);
            changeContent(url);
            adsSW = false;
            $('#adContainer').attr('style', 'display: none');
            play = true;
            mejsPlayer.load();
            $('.mejs__poster').css('display', '');
        } else {
            loadPlayer();
        }
    } else {
        gtag('config', 'G-TVDT8FN44H', {'page_path': '/' + window.parent.location.hash});
    }
    $('#module').css('display', '');
    $('#module > h3').remove();
    $('#module > p').remove();
    $('#module').prepend('<h3>' + data[url[0]]['info']['video']['title'] + '</h3>' + '<p class="collapse" id="collapseDescription" aria-expanded="false">' + data[url[0]]['info']['video']['description'] + '</p>');
    utterances(url);
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

$(document).on('click', '#collapse', function () {
    if (!collapse) {
        collapse = true;
    } else {
        collapse = false;
    }
    $('#collapseDescription').attr('aria-expanded', collapse);
});

$(document).on('click', '.mejs__next-button', function () {
    $('.mejs__playlist-selector-list-item:eq(' + window.parent.location.hash.split("/")[2].slice(1) + ')').trigger('click');
});

$(document).on('click', '.mejs__prev-button', function () {
    $('.mejs__playlist-selector-list-item:eq(' + (parseInt(window.parent.location.hash.split("/")[2].slice(1)) - 2) + ')').trigger('click');
});

$(document).on('click', '.mejs__captions-selector-list-item', function () {
    var hash = window.parent.location.hash.split("/");
    hash[1] = hash[1].replace('_', ' ');
    gtag('event', 'subtitles', {
        'event_category': data[hash[0]]['info']['video']['title'],
        'event_label': hash[1] + ' E' + data[hash[0]][hash[1]][hash[2]]['title'] + ' Subtítulo: ' + $('.mejs__captions-selector-list-item:eq(' + $(this).index() + ')').text() + ' ' + hash[3]
    });
    if (play === true) {
        $.ajax({
            url: window.location.protocol + "//" + window.location.host + subsURL + data[hash[0]][hash[1]][hash[2]]['subtitles']['s' + $(this).index()]['src'],
            dataType: "text",
            async: false,
            success: (data) => {
                subtitles = data;
                window.octopusInstance.setTrack(data);
            }
        });
    }
});

$(document).on('click', '[title="Pantalla completa"]', function () {
    window.scrollTo(0, 0);
});

function loadPlayer() {
    var url = window.parent.location.hash.split("/");
    var videoPlayer = '<video id="srcVideo" controls preload="none" poster="' + data[url[0]]['info']['video']['poster'] + '" playsinline>';
    var select = '<select id="info" class="custom-select custom-select-sm text-white" style="background-color: #2a2a2e;" >'; //#222222 //#7a7a7a
    var numl;
    let i;
    url[1] = url[1].replace('_', ' ');
    for (i = 1; i <= Object.keys(data[url[0]][url[1]]).length; i++) {
        if (parseInt(url[3].slice(1)) <= Object.keys(data[url[0]][url[1]]['E' + i]['video']).length) {
            numl = url[3];
        } else {
            numl = 'l1';
        }
        videoPlayer += '<source src="' + data[url[0]][url[1]]['E' + i]['video'][numl]['link'] + '" title="' + data[url[0]][url[1]]['E' + i]['title'] + '" data-playlist-thumbnail="' + data[url[0]][url[1]]['E' + i]['image'] + '" ';
        if (!isMobile) {
            videoPlayer += 'data-playlist-description="' + data[url[0]][url[1]]['E' + i]['description'] + '" type="video/mp4" >';
        } else {
            videoPlayer += 'type="video/mp4" >';
        }
    }
    videoPlayer += '</video>';
    $('#content').html(videoPlayer);
    if (subsURL !== '5yktms21bkvr08g1zg6uxg-on.drv.tw') {
        subsURL = '';
    } else {
        subsURL = '/www.kabums.org';
    }
    for (i = 1; i <= 5; i++) {
        $('#srcVideo').append('<track id="sub' + i + '" src="' + subsURL + '/subs/none.ass" srclang="none" label="" kind="subtitles" type="application/x-ass">');
    }
    mejs.i18n.language('es');
    mejsPlayer = new MediaElementPlayer(document.querySelectorAll('video')[0], {
        success: function (player, node) {
            var video = node;
            player.addEventListener('captionschange', function (e) {
                console.log('Charging Track ' + e.detail.caption);
                if (e.detail.caption !== null) {
                    if (window.octopusInstance) {
                        window.octopusInstance.setTrack(subtitles);
                    } else if (SubtitlesOctopus) {
                        var options = {
                            video: video,
                            //subUrl: e.detail.caption.src,
                            subContent: subtitles,
                            debug: true,
                            workerUrl: subsURL + '/js/plugins/subtitles-octopus/subtitles-octopus-worker.js'
                        };
                        window.octopusInstance = new SubtitlesOctopus(options);
                    }
                } else {
                    if (SubtitlesOctopus || window.octopusInstance) {
                        console.log('Disable Track ' + e.detail.caption);
                        window.octopusInstance.freeTrack();
                    }
                }
            });
            player.addEventListener('play', function (e) {
                var hash = window.parent.location.hash.split("/");
                hash[1] = hash[1].replace('_', ' ');
                if (play === true) {
                    $('.mejs__playlist-layer').addClass('mejs__playlist-hidden');
                } else {
                    play = true;
                }
                if (ios) {
                    $('.fixed-top').css('display', 'none');
                }
                gtag('event', 'play', {
                    'event_category': data[hash[0]]['info']['video']['title'],
                    'event_label': hash[1] + ' E' + data[hash[0]][hash[1]][hash[2]]['title'] + ' ' + hash[3]
                });
            });
            player.addEventListener('pause', function (e) {
                var hash = window.parent.location.hash.split("/");
                hash[1] = hash[1].replace('_', ' ');
                if (ios) {
                    $('.fixed-top').css('display', '');
                }
                gtag('event', 'pause', {
                    'event_category': data[hash[0]]['info']['video']['title'],
                    'event_label': hash[1] + ' E' + data[hash[0]][hash[1]][hash[2]]['title'] + ' ' + hash[3]
                });
            });
            player.addEventListener('ended', function (e) {
                var hash = window.parent.location.hash.split("/");
                hash[1] = hash[1].replace('_', ' ');
                $('.mejs__playlist-selector-list-item:eq(' + window.parent.location.hash.split("/")[2].slice(1) + ')').trigger('click');
                gtag('event', 'ended', {
                    'event_category': data[hash[0]]['info']['video']['title'],
                    'event_label': hash[1] + ' E' + data[hash[0]][hash[1]][hash[2]]['title'] + ' ' + hash[3]
                });
            });
            $(player).closest('.mejs__container').attr('lang', mejs.i18n.language());
            $('html').attr('lang', mejs.i18n.language());
        },
        stretching: 'responsive',
        autoClosePlaylist: true,
        features: ['playpause', 'current', 'progress', 'duration', 'speed', 'tracks', 'quality', 'volume', 'fullscreen', 'prevtrack', 'playlist', 'nexttrack']
    });
    $('#srcVideo_html5 > source').remove();
    $('.mejs__playlist-layer, .mejs__layer mejs__playlist-selector').css({"z-index": "2"});
    for (i = 1; i <= Object.keys(data[url[0]]['info']['season']).length; i++) {
        select += '<option value="' + data[url[0]]['info']['season']['i' + i] + '">' + data[url[0]]['info']['season']['i' + i] + '</option>';
    }
    select += '</select>';
    $('.mejs__playlist-selector-list').before(select);
    $("#info").val(url[1]);
    $("[aria-label='Selector de calidad']").attr("title", "Selector de idioma");
    $("[title='Selector de idioma']").attr("aria-label", "Selector de idioma");
    $("[title='Selector de idioma']").html('<i class="fas fa-headphones" style="font-size: 20px;"></i>');
    $('.mejs__playlist-selector-list-item:eq(' + (parseInt(window.parent.location.hash.split("/")[2].slice(1)) - 1) + ')').trigger('click');
    mejsPlayer.pause();
    $('#mep_0_captions_none').trigger('click');
    $('.mejs__playlist-layer').removeClass('mejs__playlist-hidden');
    $('.mejs__poster').css('display', '');
    destroy = false;
    adsSW = false;
    initADS();
}

function changeContent(url) {
    var numl, playlist = "";
    const cantPlaylist = $('.mejs__playlist-selector-list-item').length;
    let i;
    sw = true;
    window.parent.location.hash = url[0] + '/' + url[1].replace(' ', '_') + '/E1/' + url[3];
    $('.mejs__playlist-selector-list-item').remove();
    for (i = 1; i <= Object.keys(data[url[0]][url[1].replace('_', ' ')]).length; i++) {
        if (parseInt(url[3].slice(1)) <= Object.keys(data[url[0]][url[1]]['E' + i]['video']).length) {
            numl = url[3];
        } else {
            numl = 'l1';
        }
        if (i === 1) {
            playlist += "<li tabindex=\"0\" class=\"mejs__playlist-selector-list-item mejs__playlist-selected\"><div class=\"mejs__playlist-item-inner\"><div class=\"mejs__playlist-item-thumbnail\"><img tabindex=\"-1\" src=\"" + data[url[0]][url[1]]['E' + i]['image'] + "\"></div><div class=\"mejs__playlist-item-content\"><div><input type=\"radio\" class=\"mejs__playlist-selector-input\" name=\"mep_0_playlist\" id=\"mep_0_playlist_item_" + (i - 1) + "\" data-playlist-index=\"" + (i - 1) + "\" value=\"" + data[url[0]][url[1]]['E' + i]['video'][numl]['link'] + "\"><label class=\"mejs__playlist-selector-label\" for=\"mep_0_playlist_item_" + (i - 1) + "\"><span>▶</span> " + data[url[0]][url[1]]['E' + i]['title'] + "</label></div>";
        } else {
            playlist += "<li tabindex=\"0\" class=\"mejs__playlist-selector-list-item\"><div class=\"mejs__playlist-item-inner\"><div class=\"mejs__playlist-item-thumbnail\"><img tabindex=\"-1\" src=\"" + data[url[0]][url[1]]['E' + i]['image'] + "\"></div><div class=\"mejs__playlist-item-content\"><div><input type=\"radio\" class=\"mejs__playlist-selector-input\" name=\"mep_0_playlist\" id=\"mep_0_playlist_item_" + (i - 1) + "\" data-playlist-index=\"" + (i - 1) + "\" value=\"" + data[url[0]][url[1]]['E' + i]['video'][numl]['link'] + "\"><label class=\"mejs__playlist-selector-label\" for=\"mep_0_playlist_item_" + (i - 1) + "\">" + data[url[0]][url[1]]['E' + i]['title'] + "</label></div>";
        }
        if (!isMobile) {
            playlist += "<div class=\"mejs__playlist-item-description\">" + data[url[0]][url[1]]['E' + i]['description'] + "</div></div></div></li>";
        } else {
            playlist += "</div></div></li>";
        }
    }
    $('.mejs__playlist-selector-list').append(playlist);
    $('.mejs__overlay-play').css('display', '');
    $('#srcVideo_html5').attr('src', data[url[0]][url[1]]['E1']['video'][url[3]]['link']);
    $('.mejs__qualities-selector-list-item').remove();
    for (i = 1; i <= Object.keys(data[url[0]][url[1]]['E1']['video']).length; i++) {
        $('.mejs__qualities-selector-list').append('<li class="mejs__qualities-selector-list-item" ><label id="lang' + i + '" class="mejs__qualities-selector-label" class="mejs__qualities-selector-label">' + data[url[0]][url[1]]['E1']['video']['l' + i]['lang'] + '</label></li>');
    }
    if ($("#lang" + url[3].slice(1)).text() !== "") {
        $("#lang" + url[3].slice(1)).addClass("mejs__qualities-selected");
    } else {
        $("#lang1").addClass("mejs__qualities-selected");
    }
    $('.mejs__playlist-layer').removeClass('mejs__playlist-hidden');
    if (parseInt(url[3].slice(1)) > Object.keys(data[url[0]][url[1]]['E1']['video']).length) {
        window.parent.location.hash = url[0] + '/' + url[1].replace(' ', '_') + '/E1/l1';
    }
    $('.mejs__poster').css('display', '');
    gtag('config', 'G-TVDT8FN44H', {'page_path': '/' + window.parent.location.hash});
    loadSubtitles();
    $('#adContainer').attr('style', '');
}

function loadSubtitles() {
    var url = window.parent.location.hash.split("/");
    let i;
    url[1] = url[1].replace('_', ' ');
    for (i = 1; i <= 5; i++) {
        $('.mejs__captions-selector-list-item:eq(' + i + ')').attr('style', 'display: none');
    }
    if (Object.keys(data[url[0]][url[1]][url[2]]['subtitles']).length !== 0) {
        $('.mejs__captions-button').css('display', '');
        $.ajax({
            url: window.location.protocol + "//" + window.location.host + subsURL + data[url[0]][url[1]][url[2]]['subtitles']['s1']['src'],
            dataType: "text",
            async: false,
            success: (data) => {
                subtitles = data;
                window.octopusInstance.setTrack(data);
            }
        });
        for (i = 1; i <= Object.keys(data[url[0]][url[1]][url[2]]['subtitles']).length; i++) {
            $('.mejs__captions-selector-list-item:eq(' + i + ')').css('display', '');
            //$('#sub' + i).attr('src', subsURL + data[url[0]][url[1]][url[2]]['subtitles']['s' + i]['src']);
            $('#sub' + i).attr('label', data[url[0]][url[1]][url[2]]['subtitles']['s' + i]['label']);
        }
        /*mejsPlayer.findTracks();
         mejsPlayer.loadTrack(0); */
        for (i = 1; i <= Object.keys(data[url[0]][url[1]][url[2]]['subtitles']).length; i++) {
            $('.mejs__captions-selector-label:eq(' + i + ')').html(data[url[0]][url[1]][url[2]]['subtitles']['s' + i]['label']);
        } 
        alert("1");
        //$('.mejs__captions-selected').trigger('click');
    } else {
        $('#mep_0_captions_none').trigger('click');
        $('.mejs__captions-button').attr('style', 'display: none');
    }
}

function utterances(url) {
    var utteranc, title = "";
    if (url !== "Kabums") {
        title = data[url[0]]['info']['video']['title'] + ' - ' + data[url[0]][url[1].replace('_', ' ')][url[2]]['title'];
        $('#commentsTitle').text('Comenta Acerca de ' + title);
    } else {
        title = "Kabums";
        $('#commentsTitle').text('Comenta Acerca de la Página');
    }
    $('#utterances').remove();
    $('#comments').append('<div id="utterances"></div>');
    utteranc = document.createElement("script");
    utteranc.src = "https://utteranc.es/client.js";
    utteranc.setAttribute('repo', 'Dieblos/kabums-comentarios');
    utteranc.setAttribute('issue-term', title);
    utteranc.setAttribute('theme', 'photon-dark');
    utteranc.setAttribute('anonymous', 'crossorigin');
    document.getElementById("utterances").appendChild(utteranc);
}

function deviceDetection() {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        return true;
    }
    return false;
}

function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
            // iPad on iOS 13 detection
            || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
}

MediaElementPlayer.prototype.exitFullScreen_org = MediaElementPlayer.prototype.exitFullScreen;
MediaElementPlayer.prototype.exitFullScreen = function () {
    // Your code here
    this.exitFullScreen_org();
};

function initADS() {
    videoContent = document.getElementById('srcVideo_html5');
    videoContent.addEventListener('play', function (event) {
        if (adsSW === true) {
            var hash = window.parent.location.hash.split("/");
            $('.mejs__playlist-layer').addClass('mejs__playlist-hidden');
            if (adsPlay[hash[0] + hash[1] + hash[2]] === undefined) {
                $('#adContainer').attr('style', '');
                newIMA();
            }
        } else {
            adsSW = true;
            mejsPlayer.pause();
            $('.mejs__playlist-layer').removeClass('mejs__playlist-hidden');
        }
    });
}

function newIMA() {
    timeADS = $('video').get(0).currentTime;
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
    adDisplayContainer = new google.ima.AdDisplayContainer(document.getElementById('adContainer'), videoContent);
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
    videoContent.load();
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
        videoContent.play();
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
                videoContent.play();
            }
            break;
    }
}

window.addEventListener('resize orientationchange', function (event) {
    if (adsManager) {
        var width = videoContent.clientWidth;
        var height = videoContent.clientHeight;
        adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
    }
});
function onAdError(adErrorEvent) {
    //console.log('onAdError', adErrorEvent.getError());
    if (verification2 === false) {
        newIMA();
    } else {
        $('#adContainer').attr('style', 'display: none');
        $('#content').css('visibility', '');
        adsManager.destroy();
    }
}

function onContentPauseRequested() {
    var height = videoContent.clientHeight;
    videoContent.pause();
    if (!ios) {
        mejsPlayer.exitFullScreen();
    } else {
        $('video').get(0).webkitExitFullScreen();
    }
    window.scrollTo(0, 0);
    $('#msjAD').attr('style', 'top:' + (height / 2) + 'px');
    $('#msjAD').text('Espera un momento, cargando anuncio...');
    setTimeout(function () {
        $('#msjAD').text('Espera un momento, cargando video...');
    }, 10000);
    $('#content').css('visibility', 'hidden');
    verification2 = true;
}

function onContentResumeRequested() {
    var hash = window.parent.location.hash.split("/");
    adsPlay[hash[0] + hash[1] + hash[2]] = true;
    $('#content').css('visibility', '');
    videoContent.play();
    $('video').get(0).currentTime = timeADS;
    $('#adContainer').attr('style', 'display: none');
    verification2 = false;
    $('#msjAD').text('');
}

