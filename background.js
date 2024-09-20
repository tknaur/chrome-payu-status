const RSS_URL = 'https://status.secure.payu.com/history.rss';
const STORAGE_KEY = 'payu_statuspage_version';
const HEADER_NAME = 'etag';

async function fetchRSS() {
	const lastValue = await getValue(STORAGE_KEY);

	try {
		const response = await fetch(RSS_URL, {
			method: 'HEAD',
			headers: {
			    'Cache-Control': 'no-cache'
			}
		});

		const controlHeader = response.headers.get(HEADER_NAME);

		if (controlHeader !== (await getValue(STORAGE_KEY))) {
              await updateBadge();
              await storeValue(STORAGE_KEY, controlHeader);
        }
	} catch (error) {
		console.error('Error fetching RSS feed:', error);
	}
}

async function updateBadge() {
	chrome.action.setBadgeText({ text: '[NEW]' });
	chrome.action.setBadgeBackgroundColor({ color: '#a6c307' });
}


async function storeValue(key, value) {
	console.log('Store new value');

	try {
		await chrome.storage.local.set({ [key]: value });
	} catch (error) {
		// error do nothing
	}
}


async function getValue(key) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get([key], function (result) {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError);
			} else {
				resolve(result[key]);
			}
		});
	});
}


chrome.alarms.create("keepAlive", { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === "keepAlive") {
		console.log("Keeping the background script alive");
		fetchRSS();
	}
});
