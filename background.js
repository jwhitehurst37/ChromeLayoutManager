// Paulo P. 2017

function loadLayoutKeys() {
    var list = localStorage.getItem("windowstatesaver_state_keys");
    if (list === null ){
        list = "[]";
    }
    return JSON.parse(list);
}

function clearKeys(txt) {
	var list = loadLayoutKeys();
    if (list === undefined) {
        list = [];
    }
    var i = list.indexOf(txt);
    if(i !== -1) {
        list.splice(i, 1);
    }
    localStorage.setItem("windowstatesaver_state_keys", JSON.stringify(list));
}

function loadWindows(originalWindowId, key) {
	var windows = JSON.parse(localStorage.getItem('windowstatesaver_state'+key));
	if(windows === null)
		return;
	
	for(var index = 0; index < windows.length; index++)
	{
		var windowParams = {
			left: windows[index].left,
			top: windows[index].top,
			width: windows[index].width,
			height: windows[index].height,
			focused: windows[index].focused,
			incognito: windows[index].incognito,
			type: windows[index].type };
			
		chrome.windows.create(windowParams, function (index) {
			return function (window) {
				for(var tabIndex = 0; tabIndex < windows[index].tabs.length; tabIndex++)
				{
					var tabParams = {
						windowId: window.id,
						index: windows[index].tabs[tabIndex].index,
						url: windows[index].tabs[tabIndex].url,
						active: windows[index].tabs[tabIndex].active,
						pinned: windows[index].tabs[tabIndex].pinned };
						
					chrome.tabs.create(tabParams);
				}
				chrome.tabs.remove(window.tabs[0].id);
				if(originalWindowId !== null)
				{
					chrome.windows.remove(originalWindowId);
					originalWindowId = null;
				}
			};
		} (index));
	}
}


chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if(request.saveState) {
            var layout_keys = loadLayoutKeys();
            var layout_key = request.layout_name;
            if (layout_keys === undefined) {
                layout_keys = [];
            }
            else {
                layout_keys.push(layout_key);
            }
            localStorage.setItem('windowstatesaver_state_keys', JSON.stringify(layout_keys));

			chrome.windows.getAll({populate: true}, function (windows) {
				localStorage.setItem('windowstatesaver_state'+ layout_key, JSON.stringify(windows));
				sendResponse("OK");
				console.log("Saving state.");
			});
		}
		else if (request.listState) {
            var keys = JSON.stringify(loadLayoutKeys());
            sendResponse(keys);
        }
        else if (request.clearState) {
		    clearKeys(request.layout_name);
            sendResponse("Done");
        }
		else if(request.loadState) {
			chrome.windows.getCurrent(function (window) {
				loadWindows(window.id, request.layout_name);
			});
			sendResponse({});
		}
	}
);
